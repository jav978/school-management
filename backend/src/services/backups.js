const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const bcrypt = require('bcryptjs')

const BACKUPS_DIR = path.resolve(__dirname, '../../storage/backups')
const CONFIG_FILE = path.join(BACKUPS_DIR, 'config.json')

function ensureBackupDir() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true })
  }
}

function getConfig() {
  ensureBackupDir()
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const content = fs.readFileSync(CONFIG_FILE, 'utf8')
      return JSON.parse(content)
    } catch (err) {
      console.error('[Backups] Error reading config.json, returning default:', err.message)
    }
  }
  return {
    enabled: true,
    hour: '18:00',
    retention_days: 30,
    last_run: null,
    last_status: 'never_run'
  }
}

function updateConfig(newConfig) {
  ensureBackupDir()
  const current = getConfig()
  const updated = {
    ...current,
    ...newConfig,
    updated_at: new Date().toISOString()
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8')
  return updated
}

// Ordered table list to optimize parent-first restore order
const PREFERRED_TABLE_ORDER = [
  'institutions', 'countries', 'states', 'cities',
  'users', 'fee_types', 'grade_scales', 'subject_categories', 'rooms',
  'academic_years', 'grades', 'classrooms',
  'terms', 'subjects',
  'teachers', 'staff', 'parents',
  'classes',
  'students',
  'class_subjects', 'teacher_qualifications', 'student_parents', 'student_class_history', 'student_fees',
  'exams', 'lesson_plans', 'lessons', 'timetable_slots', 'schedules',
  'exam_questions', 'exam_results', 'assignments', 'assignment_submissions', 'attendance', 'attendance_summary',
  'term_report_cards', 'report_cards', 'report_card_subjects',
  'certificates', 'id_cards', 'payments', 'academic_plannings', 'supply_lists', 'supply_items', 'supply_suggestions',
  'events', 'event_targets', 'event_attendees', 'announcements', 'announcement_targets', 'announcement_reads',
  'conversations', 'conversation_participants', 'messages', 'message_receipts', 'notifications', 'system_feedback', 'settings'
]

async function listBackups() {
  ensureBackupDir()
  const files = await fs.promises.readdir(BACKUPS_DIR)
  const metaFiles = files.filter(f => f.endsWith('.meta.json'))
  
  const backups = []
  let totalBytes = 0
  let snapshotsCount = 0

  for (const mf of metaFiles) {
    try {
      const content = await fs.promises.readFile(path.join(BACKUPS_DIR, mf), 'utf8')
      const meta = JSON.parse(content)
      
      // Verify archive file exists
      const archivePath = path.join(BACKUPS_DIR, meta.filename)
      if (fs.existsSync(archivePath)) {
        const stats = await fs.promises.stat(archivePath)
        meta.size_bytes = stats.size
        totalBytes += stats.size
        if (meta.type && meta.type.includes('snapshot')) {
          snapshotsCount++
        }
        backups.push(meta)
      }
    } catch (err) {
      console.warn('[Backups] Could not read metadata file:', mf, err.message)
    }
  }

  // Sort descending by timestamp
  backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const lastBackup = backups.length > 0 ? backups[0].timestamp : null

  return {
    backups,
    stats: {
      total_backups: backups.length,
      total_size_bytes: totalBytes,
      total_size_mb: parseFloat((totalBytes / (1024 * 1024)).toFixed(2)),
      snapshots_count: snapshotsCount,
      last_backup_date: lastBackup
    }
  }
}

async function createBackup(db, type = 'manual', user = null, notes = '') {
  ensureBackupDir()

  // 1. Discover all tables in schema 'school'
  const tableRows = await db.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'school' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('knex_migrations', 'knex_migrations_lock', 'user_sessions')
    ORDER BY table_name;
  `)

  const availableTables = new Set(tableRows.rows.map(r => r.table_name))
  
  // Arrange in topological order followed by any remaining tables
  const tablesToDump = []
  for (const t of PREFERRED_TABLE_ORDER) {
    if (availableTables.has(t)) {
      tablesToDump.push(t)
      availableTables.delete(t)
    }
  }
  for (const remaining of availableTables) {
    tablesToDump.push(remaining)
  }

  const dumpData = {}
  const tableCounts = {}
  let totalRecords = 0

  for (const tableName of tablesToDump) {
    try {
      const rows = await db(`school.${tableName}`).select('*')
      dumpData[tableName] = rows
      tableCounts[tableName] = rows.length
      totalRecords += rows.length
    } catch (err) {
      console.error(`[Backups] Error reading table school.${tableName}:`, err.message)
      dumpData[tableName] = []
      tableCounts[tableName] = 0
    }
  }

  const now = new Date()
  const timestampStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const baseFilename = `backup_${timestampStr}_${type}`
  const gzFilename = `${baseFilename}.json.gz`
  const metaFilename = `${baseFilename}.meta.json`

  const payload = {
    version: '1.0',
    generator: 'Colegio Santa Luisa Backup Engine',
    schema: 'school',
    timestamp: now.toISOString(),
    type, // 'automatico', 'manual', 'snapshot_pre_migracion', 'snapshot_pre_restauracion'
    notes: notes || `Respaldo ${type} generado el ${now.toLocaleString('es-VE')}`,
    created_by: user ? {
      id: user.id,
      email: user.email,
      name: user.name || user.full_name || user.first_name || 'Administrador'
    } : { name: 'Sistema Automático' },
    table_counts: tableCounts,
    total_records: totalRecords,
    data: dumpData
  }

  // Compress JSON
  const jsonBuffer = Buffer.from(JSON.stringify(payload), 'utf8')
  const compressedBuffer = zlib.gzipSync(jsonBuffer)

  const archivePath = path.join(BACKUPS_DIR, gzFilename)
  const metaPath = path.join(BACKUPS_DIR, metaFilename)

  await fs.promises.writeFile(archivePath, compressedBuffer)

  const metadata = {
    filename: gzFilename,
    base_name: baseFilename,
    type,
    timestamp: now.toISOString(),
    formatted_date: now.toLocaleString('es-VE'),
    size_bytes: compressedBuffer.length,
    size_mb: parseFloat((compressedBuffer.length / (1024 * 1024)).toFixed(2)),
    total_records: totalRecords,
    table_counts: tableCounts,
    created_by: payload.created_by,
    notes: payload.notes
  }

  await fs.promises.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf8')

  // Log in school.audit_logs if user present
  try {
    if (user && user.id) {
      await db('school.audit_logs').insert({
        user_id: user.id,
        action: 'BACKUP_CREATED',
        table_name: 'ALL',
        notes: `Respaldo creado: ${gzFilename} (${type}) con ${totalRecords} registros.`,
        occurred_at: db.fn.now()
      })
    }
  } catch (auditErr) {
    console.warn('[Backups] Could not write audit log:', auditErr.message)
  }

  return metadata
}

async function restoreBackup(db, filename, adminUser, password) {
  ensureBackupDir()

  // 1. Validate inputs & prevent path traversal
  const safeFilename = path.basename(filename)
  const archivePath = path.join(BACKUPS_DIR, safeFilename)

  if (!fs.existsSync(archivePath)) {
    throw new Error(`El archivo de respaldo '${safeFilename}' no existe en el almacenamiento.`)
  }

  // 2. Validate admin password
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('Solo un usuario con rol de Administrador puede realizar restauraciones.')
  }
  if (!password) {
    throw new Error('Debe proporcionar su contraseña de administrador para autorizar la restauración.')
  }

  const dbUser = await db('school.users').where({ id: adminUser.id }).first()
  if (!dbUser) {
    throw new Error('Usuario administrador no encontrado en el sistema.')
  }

  const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash)
  if (!isPasswordValid) {
    const error = new Error('Contraseña de administrador incorrecta. Restauración denegada.')
    error.statusCode = 401
    throw error
  }

  // 3. Decompress and parse backup
  const compressed = await fs.promises.readFile(archivePath)
  let rawJson
  try {
    rawJson = zlib.gunzipSync(compressed).toString('utf8')
  } catch (zlibErr) {
    throw new Error('No se pudo descomprimir el archivo de respaldo: archivo corrupto o formato no válido.')
  }

  let backupPayload
  try {
    backupPayload = JSON.parse(rawJson)
  } catch (jsonErr) {
    throw new Error('El archivo de respaldo no contiene una estructura JSON válida.')
  }

  if (!backupPayload.data || typeof backupPayload.data !== 'object') {
    throw new Error('Estructura de respaldo inválida: no se encontró el conjunto de datos por tablas.')
  }

  // 4. Create an automatic safety snapshot before restoring
  console.log(`[Backups] Creando snapshot de seguridad antes de restaurar ${safeFilename}...`)
  const safetySnapshot = await createBackup(
    db, 
    'snapshot_pre_restauracion', 
    adminUser, 
    `Snapshot de emergencia previo a la restauración de ${safeFilename}`
  )

  // 5. Execute restore inside a Knex transaction with foreign key check suppression
  console.log(`[Backups] Ejecutando restauración transaccional de ${safeFilename}...`)
  
  let restoredTablesCount = 0
  let totalRestoredRecords = 0

  await db.transaction(async trx => {
    // Suppress triggers and FK constraints during restore
    await trx.raw("SET session_replication_role = 'replica';")

    try {
      const dumpData = backupPayload.data
      const tableNames = Object.keys(dumpData)

      // A. Truncate tables present in dump
      for (const t of tableNames) {
        try {
          await trx.raw(`TRUNCATE TABLE school.${trx.client.customFormatter ? trx.client.customFormatter(t) : t} CASCADE;`)
        } catch (tErr) {
          console.warn(`[Backups] Notice truncating school.${t}:`, tErr.message)
        }
      }

      // B. Insert rows table by table
      for (const t of tableNames) {
        const rows = dumpData[t]
        if (Array.isArray(rows) && rows.length > 0) {
          // Batch insert in chunks of 500 to avoid query size limits
          const CHUNK_SIZE = 500
          for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
            const chunk = rows.slice(i, i + CHUNK_SIZE)
            await trx(`school.${t}`).insert(chunk)
          }
          restoredTablesCount++
          totalRestoredRecords += rows.length
        }

        // Reset sequence if table has serial 'id'
        try {
          await trx.raw(`
            SELECT setval(pg_get_serial_sequence('school.${t}', 'id'), COALESCE(MAX(id), 1))
            FROM school.${t};
          `)
        } catch (seqErr) {
          // Some tables have UUID or lack serial sequence; ignore safely
        }
      }

      // Re-enable triggers and FK constraints
      await trx.raw("SET session_replication_role = 'origin';")

      // Record in audit log
      await trx('school.audit_logs').insert({
        user_id: adminUser.id,
        action: 'DATABASE_RESTORED',
        table_name: 'ALL',
        notes: `Base de datos restaurada desde '${safeFilename}' (${totalRestoredRecords} registros, ${restoredTablesCount} tablas). Snapshot previo: ${safetySnapshot.filename}`,
        occurred_at: trx.fn.now()
      })
    } catch (innerErr) {
      // Re-enable before throwing so session state remains clean
      try { await trx.raw("SET session_replication_role = 'origin';") } catch (_) {}
      throw innerErr
    }
  })

  return {
    success: true,
    message: `Restauración completada con éxito. Se restauraron ${totalRestoredRecords} registros en ${restoredTablesCount} tablas.`,
    safety_snapshot: safetySnapshot.filename,
    restored_records: totalRestoredRecords,
    restored_tables: restoredTablesCount
  }
}

async function deleteBackup(filename) {
  ensureBackupDir()
  const safeFilename = path.basename(filename)
  const archivePath = path.join(BACKUPS_DIR, safeFilename)
  const metaPath = path.join(BACKUPS_DIR, safeFilename.replace('.json.gz', '.meta.json'))

  if (fs.existsSync(archivePath)) {
    await fs.promises.unlink(archivePath)
  }
  if (fs.existsSync(metaPath)) {
    await fs.promises.unlink(metaPath)
  }
  return { success: true, deleted: safeFilename }
}

async function purgeOldBackups(retentionDays = 30) {
  ensureBackupDir()
  const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)
  const list = await listBackups()
  
  let deletedCount = 0
  // Always keep at least 1 newest backup regardless of retention
  const candidates = list.backups.slice(1)

  for (const b of candidates) {
    const backupTime = new Date(b.timestamp).getTime()
    if (backupTime < cutoffTime) {
      // Do not auto-purge snapshots marked as pre-migration unless older than double retention
      if (b.type && b.type.includes('snapshot') && backupTime > (Date.now() - (retentionDays * 2 * 24 * 60 * 60 * 1000))) {
        continue
      }
      try {
        await deleteBackup(b.filename)
        deletedCount++
      } catch (e) {
        console.warn('[Backups] Could not purge old backup:', b.filename, e.message)
      }
    }
  }

  return { deleted_count: deletedCount }
}

// Express helper to verify Admin Bearer Token
async function verifyAdminAuth(req, app) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Autenticación requerida')
    err.statusCode = 401
    throw err
  }
  const token = authHeader.split(' ')[1]
  const authPayload = await app.service('authentication').verifyAccessToken(token)
  
  const db = app.get('knexClient')
  const user = await db('school.users').where({ id: authPayload.sub, is_active: true, is_deleted: false }).first()
  if (!user) {
    const err = new Error('Usuario no válido o inactivo')
    err.statusCode = 401
    throw err
  }
  if (user.role !== 'admin') {
    const err = new Error('Acceso restringido: requiere privilegios de Administrador')
    err.statusCode = 403
    throw err
  }
  return user
}

module.exports = function (app) {
  ensureBackupDir()

  // 1. GET /backups or /api/backups - List backups and stats
  app.get(['/backups', '/api/backups'], async (req, res) => {
    try {
      await verifyAdminAuth(req, app)
      const data = await listBackups()
      const config = getConfig()
      return res.json({ ...data, config })
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 2. POST /backups or /api/backups - Create manual backup now
  app.post(['/backups', '/api/backups'], async (req, res) => {
    try {
      const user = await verifyAdminAuth(req, app)
      const db = app.get('knexClient')
      const notes = req.body?.notes || 'Copia de seguridad manual creada desde el panel de control'
      const meta = await createBackup(db, 'manual', user, notes)
      return res.json({ success: true, backup: meta })
    } catch (err) {
      console.error('[Backups] Create error:', err)
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 3. GET /backups/config or /api/backups/config - Get scheduler config
  app.get(['/backups/config', '/api/backups/config'], async (req, res) => {
    try {
      await verifyAdminAuth(req, app)
      return res.json(getConfig())
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 4. PUT /backups/config or /api/backups/config - Update scheduler config
  app.put(['/backups/config', '/api/backups/config'], async (req, res) => {
    try {
      await verifyAdminAuth(req, app)
      const updated = updateConfig(req.body)
      return res.json({ success: true, config: updated })
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 5. GET /backups/:filename/download or /api/backups/:filename/download - Secure download
  app.get(['/backups/:filename/download', '/api/backups/:filename/download'], async (req, res) => {
    try {
      // Allow download with query token or header
      const token = req.query.token || (req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null)
      if (!token) {
        return res.status(401).json({ error: 'Token de descarga requerido' })
      }
      const authPayload = await app.service('authentication').verifyAccessToken(token)
      const db = app.get('knexClient')
      const user = await db('school.users').where({ id: authPayload.sub, is_active: true }).first()
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado para descargar respaldos' })
      }

      const safeFilename = path.basename(req.params.filename)
      const filePath = path.join(BACKUPS_DIR, safeFilename)
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo de respaldo no encontrado' })
      }

      res.setHeader('Content-Type', 'application/gzip')
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`)
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 6. POST /backups/restore or /api/backups/restore - Restore with admin password confirmation
  app.post(['/backups/restore', '/api/backups/restore'], async (req, res) => {
    try {
      const user = await verifyAdminAuth(req, app)
      const { filename, password } = req.body
      if (!filename) {
        return res.status(400).json({ error: 'Debe especificar el archivo de respaldo a restaurar.' })
      }
      if (!password) {
        return res.status(400).json({ error: 'Debe ingresar su contraseña de administrador para autorizar la restauración.' })
      }

      const db = app.get('knexClient')
      const result = await restoreBackup(db, filename, user, password)
      return res.json(result)
    } catch (err) {
      console.error('[Backups] Restore error:', err)
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })

  // 7. DELETE /backups/:filename or /api/backups/:filename - Delete backup
  app.delete(['/backups/:filename', '/api/backups/:filename'], async (req, res) => {
    try {
      await verifyAdminAuth(req, app)
      const result = await deleteBackup(req.params.filename)
      return res.json(result)
    } catch (err) {
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })
}

module.exports.createBackup = createBackup
module.exports.listBackups = listBackups
module.exports.getConfig = getConfig
module.exports.updateConfig = updateConfig
module.exports.purgeOldBackups = purgeOldBackups
module.exports.restoreBackup = restoreBackup
