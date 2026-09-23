const { createBackup, getConfig, updateConfig, purgeOldBackups } = require('./backups')

let timerHandle = null

function getLocalHourMinute() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function getTodayDateString() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function checkAndRunScheduledBackup(db) {
  try {
    const config = getConfig()
    if (!config.enabled) {
      return
    }

    const currentHM = getLocalHourMinute()
    const targetHour = config.hour || '18:00'
    const today = getTodayDateString()

    // Has it already run today?
    const lastRunToday = config.last_run && config.last_run.startsWith(today)

    if (currentHM === targetHour && !lastRunToday) {
      console.log(`[BackupScheduler] Ejecutando respaldo automático programado a las ${currentHM}...`)
      
      const meta = await createBackup(
        db, 
        'automatico', 
        null, 
        `Respaldo automático diario ejecutado a las ${currentHM} (Retención: ${config.retention_days || 30} días)`
      )

      console.log(`[BackupScheduler] Respaldo automático completado: ${meta.filename} (${meta.size_mb} MB)`)

      // Execute retention purge
      const purgeResult = await purgeOldBackups(config.retention_days || 30)
      if (purgeResult.deleted_count > 0) {
        console.log(`[BackupScheduler] Purga de retención: se eliminaron ${purgeResult.deleted_count} respaldos antiguos.`)
      }

      updateConfig({
        last_run: new Date().toISOString(),
        last_status: 'success',
        last_filename: meta.filename
      })
    }
  } catch (err) {
    console.error('[BackupScheduler] Error en la ejecución del respaldo programado:', err)
    updateConfig({
      last_status: 'failed',
      last_error: err.message
    })
  }
}

function startScheduler(app) {
  const db = app.get('knexClient')
  const config = getConfig()
  console.log(`[BackupScheduler] Iniciado. Hora programada diaria: ${config.hour || '18:00'} (Activo: ${config.enabled ? 'SÍ' : 'NO'}, Retención: ${config.retention_days || 30} días)`)

  if (timerHandle) {
    clearInterval(timerHandle)
  }

  // Check every 60 seconds
  timerHandle = setInterval(() => {
    checkAndRunScheduledBackup(db)
  }, 60000)

  // Initial check after 5 seconds to register presence
  setTimeout(() => {
    checkAndRunScheduledBackup(db)
  }, 5000)
}

function stopScheduler() {
  if (timerHandle) {
    clearInterval(timerHandle)
    timerHandle = null
  }
}

module.exports = {
  startScheduler,
  stopScheduler
}
