const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')
const bcrypt = require('bcryptjs')
const { createBackup } = require('./backups')

// Supported migration entities and their schemas with friendly aliases for auto-matching
const ENTITY_SCHEMAS = {
  academic_years: {
    label: 'Años Escolares y Períodos',
    tableName: 'academic_years',
    primaryKey: 'id',
    uniqueField: 'name',
    fields: [
      {
        field: 'name',
        label: 'Nombre / Ciclo Escolar',
        required: true,
        type: 'string',
        example: '2023-2024',
        aliases: ['ano', 'año', 'periodo', 'ano_escolar', 'año_escolar', 'ciclo', 'periodo_academico', 'year', 'academic_year']
      },
      {
        field: 'start_date',
        label: 'Fecha de Inicio',
        required: false,
        type: 'date',
        default: '2023-09-01',
        aliases: ['fecha_inicio', 'inicio', 'fecha_desde', 'desde', 'start_date', 'begin_date']
      },
      {
        field: 'end_date',
        label: 'Fecha de Fin',
        required: false,
        type: 'date',
        default: '2024-07-15',
        aliases: ['fecha_fin', 'fin', 'fecha_hasta', 'hasta', 'end_date']
      },
      {
        field: 'is_current',
        label: '¿Es el Año Escolar Actual?',
        required: false,
        type: 'boolean',
        default: false,
        aliases: ['actual', 'es_actual', 'vigente', 'is_current']
      },
      {
        field: 'is_active',
        label: 'Activo',
        required: false,
        type: 'boolean',
        default: true,
        aliases: ['activo', 'estatus', 'estado', 'is_active']
      }
    ]
  },

  subjects: {
    label: 'Catálogo de Materias y Asignaturas',
    tableName: 'subjects',
    primaryKey: 'id',
    uniqueField: 'code',
    fields: [
      {
        field: 'code',
        label: 'Código de Asignatura',
        required: true,
        type: 'string',
        example: 'MAT-01',
        aliases: ['codigo', 'código', 'cod', 'clave', 'code', 'subject_code']
      },
      {
        field: 'name',
        label: 'Nombre de la Materia',
        required: true,
        type: 'string',
        example: 'Matemáticas',
        aliases: ['materia', 'nombre', 'asignatura', 'disciplina', 'curso', 'subject', 'name']
      },
      {
        field: 'grade_level',
        label: 'Nivel / Año Escolar',
        required: false,
        type: 'string',
        example: '1er Año',
        aliases: ['grado', 'año', 'nivel', 'ano', 'curso_nivel', 'grade', 'level', 'grade_level']
      },
      {
        field: 'credits',
        label: 'Créditos / Unidades',
        required: false,
        type: 'number',
        default: 3,
        aliases: ['creditos', 'créditos', 'uc', 'horas_credito', 'credits']
      },
      {
        field: 'hours_per_week',
        label: 'Horas Semanales',
        required: false,
        type: 'number',
        default: 4,
        aliases: ['horas', 'horas_semanales', 'carga_horaria', 'hours', 'hours_per_week']
      },
      {
        field: 'is_elective',
        label: '¿Es Electiva?',
        required: false,
        type: 'boolean',
        default: false,
        aliases: ['electiva', 'es_electiva', 'optativa', 'is_elective']
      },
      {
        field: 'is_active',
        label: 'Activa',
        required: false,
        type: 'boolean',
        default: true,
        aliases: ['activo', 'activa', 'estado', 'is_active']
      }
    ]
  },

  teachers: {
    label: 'Personal Docente y Profesores',
    tableName: 'teachers',
    primaryKey: 'id',
    uniqueField: 'national_id',
    fields: [
      {
        field: 'first_name',
        label: 'Primer Nombre',
        required: true,
        type: 'string',
        aliases: ['nombre', 'nombres', 'primer_nombre', 'first_name', 'name']
      },
      {
        field: 'last_name',
        label: 'Primer Apellido',
        required: true,
        type: 'string',
        aliases: ['apellido', 'apellidos', 'primer_apellido', 'last_name', 'surname']
      },
      {
        field: 'national_id',
        label: 'Cédula de Identidad / DNI',
        required: false,
        type: 'string',
        example: 'V-14567890',
        aliases: ['cedula', 'cédula', 'ci', 'dni', 'identificacion', 'documento', 'rut', 'national_id']
      },
      {
        field: 'employee_id',
        label: 'Ficha / Código de Empleado',
        required: false,
        type: 'string',
        example: 'DOC-2020-001',
        aliases: ['ficha', 'codigo_empleado', 'codigo_docente', 'num_empleado', 'employee_id']
      },
      {
        field: 'email_personal',
        label: 'Correo Electrónico',
        required: false,
        type: 'string',
        aliases: ['correo', 'email', 'correo_electronico', 'mail']
      },
      {
        field: 'phone_mobile',
        label: 'Teléfono Móvil',
        required: false,
        type: 'string',
        aliases: ['telefono', 'teléfono', 'celular', 'movil', 'móvil', 'phone', 'phone_mobile']
      },
      {
        field: 'specialization',
        label: 'Especialidad / Área',
        required: false,
        type: 'string',
        aliases: ['especialidad', 'materia_principal', 'area', 'profesion', 'titulo', 'specialization']
      },
      {
        field: 'hire_date',
        label: 'Fecha de Contratación',
        required: false,
        type: 'date',
        aliases: ['fecha_ingreso', 'fecha_contratacion', 'ingreso', 'contratacion', 'hire_date']
      },
      {
        field: 'status',
        label: 'Estatus',
        required: false,
        type: 'string',
        default: 'active',
        aliases: ['estatus', 'estado', 'condicion', 'situacion', 'status']
      }
    ]
  },

  students: {
    label: 'Estudiantes e Historial Escolar',
    tableName: 'students',
    primaryKey: 'id',
    uniqueField: 'student_id',
    fields: [
      {
        field: 'first_name',
        label: 'Primer Nombre',
        required: true,
        type: 'string',
        aliases: ['nombre', 'nombres', 'primer_nombre', 'estudiante_nombre', 'alumno_nombre', 'first_name']
      },
      {
        field: 'last_name',
        label: 'Primer Apellido',
        required: true,
        type: 'string',
        aliases: ['apellido', 'apellidos', 'primer_apellido', 'estudiante_apellido', 'alumno_apellido', 'last_name']
      },
      {
        field: 'student_id',
        label: 'Matrícula / Carnet / Expediente',
        required: false,
        type: 'string',
        example: 'EST-2018-045',
        aliases: ['matricula', 'matrícula', 'carnet', 'codigo_estudiante', 'num_expediente', 'expediente', 'id_estudiante', 'student_id']
      },
      {
        field: 'national_id',
        label: 'Cédula / Cédula Escolar',
        required: false,
        type: 'string',
        example: 'V-31234567',
        aliases: ['cedula', 'cédula', 'ci', 'dni', 'identificacion', 'documento_identidad', 'cedula_escolar', 'rut', 'national_id']
      },
      {
        field: 'date_of_birth',
        label: 'Fecha de Nacimiento',
        required: false,
        type: 'date',
        aliases: ['fecha_nacimiento', 'f_nac', 'nacimiento', 'fnac', 'fecha_nac', 'birth_date', 'dob']
      },
      {
        field: 'gender',
        label: 'Género / Sexo',
        required: false,
        type: 'string',
        default: 'other',
        aliases: ['sexo', 'genero', 'género', 'gender', 'sex']
      },
      {
        field: 'blood_type',
        label: 'Tipo de Sangre',
        required: false,
        type: 'string',
        default: 'unknown',
        aliases: ['tipo_sangre', 'grupo_sanguineo', 'factor_rh', 'sangre', 'blood_type']
      },
      {
        field: 'admission_date',
        label: 'Fecha de Admisión / Ingreso',
        required: false,
        type: 'date',
        aliases: ['fecha_ingreso', 'fecha_admision', 'ingreso', 'matriculacion', 'admission_date']
      },
      {
        field: 'email_personal',
        label: 'Correo Personal',
        required: false,
        type: 'string',
        aliases: ['correo', 'email', 'correo_estudiante', 'email_personal']
      },
      {
        field: 'phone_mobile',
        label: 'Teléfono de Contacto',
        required: false,
        type: 'string',
        aliases: ['telefono', 'teléfono', 'celular', 'movil', 'móvil', 'phone', 'phone_mobile']
      },
      {
        field: 'status',
        label: 'Estatus del Estudiante',
        required: false,
        type: 'string',
        default: 'active',
        aliases: ['estatus', 'estado', 'condicion', 'situacion', 'status']
      },
      {
        field: 'notes',
        label: 'Notas / Observaciones Históricas',
        required: false,
        type: 'string',
        aliases: ['notas', 'observaciones', 'comentarios', 'historial', 'grado_antiguo', 'notes']
      }
    ]
  },

  report_cards: {
    label: 'Historial de Calificaciones y Boletas',
    tableName: 'report_cards',
    primaryKey: 'id',
    uniqueField: 'verification_code',
    fields: [
      {
        field: 'student_name',
        label: 'Nombre del Estudiante',
        required: true,
        type: 'string',
        aliases: ['alumno', 'estudiante', 'nombre_estudiante', 'nombre_completo', 'student_name']
      },
      {
        field: 'student_code',
        label: 'Cédula / Carnet Estudiante',
        required: false,
        type: 'string',
        aliases: ['cedula', 'ci', 'matricula', 'expediente', 'student_code']
      },
      {
        field: 'grade_level',
        label: 'Grado / Año',
        required: false,
        type: 'string',
        example: '3er Año',
        aliases: ['grado', 'año', 'curso', 'seccion', 'nivel', 'grade_level']
      },
      {
        field: 'academic_year',
        label: 'Año Escolar',
        required: false,
        type: 'string',
        example: '2019-2020',
        aliases: ['ano_escolar', 'año_escolar', 'periodo_academico', 'ciclo', 'academic_year']
      },
      {
        field: 'period',
        label: 'Lapso / Período',
        required: false,
        type: 'string',
        example: 'Final',
        aliases: ['lapso', 'trimestre', 'semestre', 'momento', 'period']
      },
      {
        field: 'final_average',
        label: 'Promedio Final / Calificación',
        required: false,
        type: 'number',
        example: 18.5,
        aliases: ['promedio', 'promedio_final', 'nota_definitiva', 'calificacion_final', 'nota', 'average', 'final_average']
      },
      {
        field: 'teacher_observations',
        label: 'Observaciones Docentes',
        required: false,
        type: 'string',
        aliases: ['observaciones', 'comentarios', 'apreciacion', 'teacher_observations']
      }
    ]
  }
}

// Clean and normalize strings for fuzzy matching
function normalizeHeaderName(name) {
  if (!name) return ''
  return String(name)
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '') // remove punctuation
}

// Multi-format parser for CSV, TSV, TXT, Excel, and SQL INSERT INTO statements
function parseContentToRows(filename, bufferOrString, isBase64 = false) {
  const ext = path.extname(filename).toLowerCase()

  // 1. Excel files (.xlsx, .xls)
  if (ext === '.xlsx' || ext === '.xls') {
    let buf = bufferOrString
    if (isBase64 || typeof bufferOrString === 'string') {
      buf = Buffer.from(bufferOrString, 'base64')
    }
    const workbook = xlsx.read(buf, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) throw new Error('El archivo Excel no contiene ninguna hoja.')
    const sheet = workbook.Sheets[sheetName]
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' })
    if (rows.length === 0) throw new Error('El archivo Excel está vacío.')
    const headers = Object.keys(rows[0])
    return { headers, rows, total_rows: rows.length, format: 'excel' }
  }

  // Convert buffer to string for text-based formats
  let text = typeof bufferOrString === 'string' 
    ? (isBase64 ? Buffer.from(bufferOrString, 'base64').toString('utf8') : bufferOrString)
    : bufferOrString.toString('utf8')

  // 2. SQL text dump (.sql)
  if (ext === '.sql' || text.toUpperCase().includes('INSERT INTO')) {
    const extractedRows = parseSqlInsertStatements(text)
    if (extractedRows.rows.length > 0) {
      return {
        headers: extractedRows.headers,
        rows: extractedRows.rows,
        total_rows: extractedRows.rows.length,
        format: 'sql'
      }
    }
  }

  // 3. CSV, TSV, or TXT
  return parseDelimitedText(text)
}

function parseDelimitedText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length < 2) {
    throw new Error('El archivo no contiene suficientes líneas de datos o está vacío.')
  }

  // Detect delimiter using the first non-empty line
  const sample = lines[0]
  let delimiter = ','
  const counts = {
    ',': (sample.match(/,/g) || []).length,
    ';': (sample.match(/;/g) || []).length,
    '\t': (sample.match(/\t/g) || []).length,
    '|': (sample.match(/\|/g) || []).length
  }
  let maxCount = 0
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count
      delimiter = delim
    }
  }

  const parseLine = (line) => {
    // Regex aware of quotes
    const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*)"|([^${delimiter}]*))`, 'g')
    const matches = []
    let match
    while ((match = regex.exec(line)) !== null) {
      let val = match[1] !== undefined ? match[1] : match[2]
      matches.push((val || '').trim())
      if (regex.lastIndex === match.index) {
        regex.lastIndex++
      }
    }
    return matches
  }

  const rawHeaders = parseLine(lines[0])
  const headers = rawHeaders.map((h, i) => h || `Columna_${i + 1}`)

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue
    const rowObj = {}
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : ''
    })
    rows.push(rowObj)
  }

  return { headers, rows, total_rows: rows.length, format: 'delimited' }
}

// Custom parser to extract rows from INSERT INTO `table` (`col1`, `col2`) VALUES ('v1', 'v2'), ...
function parseSqlInsertStatements(sqlText) {
  const rows = []
  let headers = []

  const insertRegex = /INSERT\s+INTO\s+[`"']?(\w+)[`"']?\s*(?:\(([^)]+)\))?\s+VALUES\s*([\s\S]*?);/gi
  let insertMatch

  while ((insertMatch = insertRegex.exec(sqlText)) !== null) {
    const rawCols = insertMatch[2]
    const rawValues = insertMatch[3]

    if (rawCols && headers.length === 0) {
      headers = rawCols.split(',').map(c => c.trim().replace(/[`"']/g, ''))
    }

    // Match each tuple (val1, val2, ...)
    const tupleRegex = /\(([\s\S]*?)\)(?:,|$)/g
    let tupleMatch

    while ((tupleMatch = tupleRegex.exec(rawValues)) !== null) {
      const tupleContent = tupleMatch[1].trim()
      // Split values respecting strings
      const valRegex = /(?:'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|([^,]+))/g
      const rowValues = []
      let vMatch
      while ((vMatch = valRegex.exec(tupleContent)) !== null) {
        let cleanVal = vMatch[1] !== undefined ? vMatch[1] : (vMatch[2] !== undefined ? vMatch[2] : vMatch[3])
        cleanVal = cleanVal ? cleanVal.trim() : ''
        if (cleanVal.toUpperCase() === 'NULL') cleanVal = ''
        cleanVal = cleanVal.replace(/^['"]|['"]$/g, '').trim()
        rowValues.push(cleanVal)
      }

      if (rowValues.length > 0) {
        if (headers.length === 0) {
          headers = rowValues.map((_, i) => `col_${i + 1}`)
        }
        const rowObj = {}
        headers.forEach((h, idx) => {
          rowObj[h] = rowValues[idx] !== undefined ? rowValues[idx] : ''
        })
        rows.push(rowObj)
      }
    }
  }

  return { headers, rows }
}

// Compute smart automatic matching between file headers and entity fields
function computeAutoMapping(entityKey, fileHeaders) {
  const schema = ENTITY_SCHEMAS[entityKey]
  if (!schema) return {}

  const mapping = {}
  const usedHeaders = new Set()

  for (const fieldDef of schema.fields) {
    const normTarget = normalizeHeaderName(fieldDef.field)
    const normAliases = (fieldDef.aliases || []).map(normalizeHeaderName)

    let bestMatch = null

    // Exact or alias match
    for (const h of fileHeaders) {
      if (usedHeaders.has(h)) continue
      const normH = normalizeHeaderName(h)
      if (normH === normTarget || normAliases.includes(normH)) {
        bestMatch = h
        break
      }
    }

    // Substring match fallback
    if (!bestMatch) {
      for (const h of fileHeaders) {
        if (usedHeaders.has(h)) continue
        const normH = normalizeHeaderName(h)
        if (normH.includes(normTarget) || normAliases.some(a => normH.includes(a) || a.includes(normH))) {
          bestMatch = h
          break
        }
      }
    }

    if (bestMatch) {
      mapping[fieldDef.field] = bestMatch
      usedHeaders.add(bestMatch)
    } else {
      mapping[fieldDef.field] = null // Unmapped, will need user selection or default value
    }
  }

  return mapping
}

// Suggest the most likely entity based on header names
function detectEntityFromHeaders(fileHeaders) {
  const normHeaders = fileHeaders.map(normalizeHeaderName)
  let bestEntity = 'students'
  let bestScore = 0

  for (const [entityKey, schema] of Object.entries(ENTITY_SCHEMAS)) {
    let score = 0
    for (const field of schema.fields) {
      const aliases = (field.aliases || []).map(normalizeHeaderName)
      if (normHeaders.includes(normalizeHeaderName(field.field)) || normHeaders.some(nh => aliases.includes(nh))) {
        score += field.required ? 3 : 1
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestEntity = entityKey
    }
  }

  return bestEntity
}

// Date normalization helper
function normalizeDate(val) {
  if (!val) return null
  const str = String(val).trim()
  if (!str) return null

  // Check ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0')
    const month = dmyMatch[2].padStart(2, '0')
    const year = dmyMatch[3]
    return `${year}-${month}-${day}`
  }

  // Excel serial number date
  const num = Number(str)
  if (!isNaN(num) && num > 25000 && num < 60000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + num * 86400000)
    return date.toISOString().split('T')[0]
  }

  return null
}

// Dry-Run validation engine
async function validateMigrationData(db, entityKey, rows, mapping, defaultValues = {}) {
  const schema = ENTITY_SCHEMAS[entityKey]
  if (!schema) throw new Error(`Entidad desconocida '${entityKey}'`)

  let validCount = 0
  let warningCount = 0
  let errorCount = 0

  const errors = []
  const warnings = []
  const validSamples = []

  // Pre-load existing unique keys from DB to detect duplicates
  const existingUniqueValues = new Set()
  if (schema.uniqueField) {
    try {
      const dbRows = await db(`school.${schema.tableName}`).select(schema.uniqueField)
      dbRows.forEach(r => {
        if (r[schema.uniqueField]) {
          existingUniqueValues.add(String(r[schema.uniqueField]).trim().toUpperCase())
        }
      })
    } catch (_) {}
  }

  const seenInBatch = new Set()

  for (let idx = 0; idx < rows.length; idx++) {
    const rawRow = rows[idx]
    const rowNum = idx + 2 // 1-based + 1 for header line
    const mappedObj = {}
    const rowErrors = []
    const rowWarnings = []

    for (const fieldDef of schema.fields) {
      const sourceCol = mapping[fieldDef.field]
      let val = sourceCol && rawRow[sourceCol] !== undefined ? rawRow[sourceCol] : ''

      // Apply default value if empty
      if ((val === '' || val === null || val === undefined) && defaultValues[fieldDef.field] !== undefined) {
        val = defaultValues[fieldDef.field]
      }

      // Check required
      if (fieldDef.required && (val === '' || val === null || val === undefined)) {
        rowErrors.push(`Campo requerido '${fieldDef.label}' está vacío y no tiene valor por defecto.`)
        continue
      }

      // Type validation and normalization
      if (val !== '' && val !== null && val !== undefined) {
        if (fieldDef.type === 'number') {
          const num = parseFloat(String(val).replace(',', '.'))
          if (isNaN(num)) {
            rowErrors.push(`El campo '${fieldDef.label}' debe ser numérico (recibido: '${val}')`)
          } else {
            mappedObj[fieldDef.field] = num
          }
        } else if (fieldDef.type === 'boolean') {
          const s = String(val).toLowerCase().trim()
          mappedObj[fieldDef.field] = ['true', '1', 'si', 'sí', 'yes', 't'].includes(s)
        } else if (fieldDef.type === 'date') {
          const cleanDate = normalizeDate(val)
          if (!cleanDate) {
            rowWarnings.push(`Fecha inválida en '${fieldDef.label}' ('${val}'), se guardará como NULL.`)
            mappedObj[fieldDef.field] = null
          } else {
            mappedObj[fieldDef.field] = cleanDate
          }
        } else {
          mappedObj[fieldDef.field] = String(val).trim()
        }
      } else {
        mappedObj[fieldDef.field] = fieldDef.default !== undefined ? fieldDef.default : null
      }
    }

    // Entity-specific validations & checks
    if (entityKey === 'students') {
      if (mappedObj.blood_type) {
        const bt = String(mappedObj.blood_type).toUpperCase().trim()
        const validBts = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN']
        if (!validBts.includes(bt)) {
          rowWarnings.push(`Tipo de sangre '${mappedObj.blood_type}' no reconocido, ajustado a 'unknown'.`)
          mappedObj.blood_type = 'unknown'
        }
      }
      if (mappedObj.gender) {
        const g = String(mappedObj.gender).toLowerCase().trim()
        if (['m', 'masculino', 'hombre', 'male'].includes(g)) mappedObj.gender = 'male'
        else if (['f', 'femenino', 'mujer', 'female'].includes(g)) mappedObj.gender = 'female'
        else mappedObj.gender = 'other'
      }
    }

    // Duplicate check on uniqueField
    if (schema.uniqueField && mappedObj[schema.uniqueField]) {
      const uVal = String(mappedObj[schema.uniqueField]).trim().toUpperCase()
      if (existingUniqueValues.has(uVal)) {
        rowErrors.push(`El identificador único '${uVal}' ya existe en la base de datos de ${schema.label}.`)
      } else if (seenInBatch.has(uVal)) {
        rowErrors.push(`El identificador único '${uVal}' está duplicado dentro de este mismo archivo.`)
      } else {
        seenInBatch.add(uVal)
      }
    }

    if (rowErrors.length > 0) {
      errorCount++
      if (errors.length < 25) {
        errors.push({
          row: rowNum,
          errors: rowErrors,
          raw: rawRow
        })
      }
    } else {
      validCount++
      if (rowWarnings.length > 0) {
        warningCount++
        if (warnings.length < 25) {
          warnings.push({
            row: rowNum,
            warnings: rowWarnings,
            preview: mappedObj
          })
        }
      }
      if (validSamples.length < 5) {
        validSamples.push(mappedObj)
      }
    }
  }

  return {
    entity: entityKey,
    entity_label: schema.label,
    total_rows: rows.length,
    valid_count: validCount,
    warning_count: warningCount,
    error_count: errorCount,
    errors,
    warnings,
    valid_samples: validSamples
  }
}

// Transactional Execution Engine with Pre-Migration Snapshot and Rejected Rows CSV
async function executeMigration(db, entityKey, rows, mapping, defaultValues, adminUser, password) {
  const schema = ENTITY_SCHEMAS[entityKey]
  if (!schema) throw new Error(`Entidad desconocida '${entityKey}'`)

  // 1. Verify admin password
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('Solo un administrador puede ejecutar la migración histórica de datos.')
  }
  const dbUser = await db('school.users').where({ id: adminUser.id }).first()
  if (!dbUser) throw new Error('Usuario administrador no encontrado.')

  const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash)
  if (!isPasswordValid) {
    const error = new Error('Contraseña de administrador incorrecta. Migración abortada.')
    error.statusCode = 401
    throw error
  }

  // 2. Pre-Migration Safety Snapshot
  console.log(`[DataMigration] Creando Snapshot automático de seguridad pre-migración para ${entityKey}...`)
  const safetySnapshot = await createBackup(
    db, 
    'snapshot_pre_migracion', 
    adminUser, 
    `Snapshot automático de seguridad previo a la migración masiva de '${schema.label}'`
  )

  // 3. Process and prepare rows
  const toInsert = []
  const rejectedRows = []

  // Pre-load unique keys
  const existingUniqueValues = new Set()
  if (schema.uniqueField) {
    try {
      const dbRows = await db(`school.${schema.tableName}`).select(schema.uniqueField)
      dbRows.forEach(r => {
        if (r[schema.uniqueField]) {
          existingUniqueValues.add(String(r[schema.uniqueField]).trim().toUpperCase())
        }
      })
    } catch (_) {}
  }
  const seenInBatch = new Set()

  for (let idx = 0; idx < rows.length; idx++) {
    const rawRow = rows[idx]
    const rowNum = idx + 2
    const mappedObj = {}
    let hasError = false
    let errorReason = ''

    for (const fieldDef of schema.fields) {
      const sourceCol = mapping[fieldDef.field]
      let val = sourceCol && rawRow[sourceCol] !== undefined ? rawRow[sourceCol] : ''

      if ((val === '' || val === null || val === undefined) && defaultValues[fieldDef.field] !== undefined) {
        val = defaultValues[fieldDef.field]
      }

      if (fieldDef.required && (val === '' || val === null || val === undefined)) {
        hasError = true
        errorReason = `Falta campo requerido: ${fieldDef.label}`
        break
      }

      if (val !== '' && val !== null && val !== undefined) {
        if (fieldDef.type === 'number') {
          const num = parseFloat(String(val).replace(',', '.'))
          mappedObj[fieldDef.field] = isNaN(num) ? 0 : num
        } else if (fieldDef.type === 'boolean') {
          const s = String(val).toLowerCase().trim()
          mappedObj[fieldDef.field] = ['true', '1', 'si', 'sí', 'yes', 't'].includes(s)
        } else if (fieldDef.type === 'date') {
          mappedObj[fieldDef.field] = normalizeDate(val)
        } else {
          mappedObj[fieldDef.field] = String(val).trim()
        }
      } else {
        mappedObj[fieldDef.field] = fieldDef.default !== undefined ? fieldDef.default : null
      }
    }

    if (!hasError && schema.uniqueField && mappedObj[schema.uniqueField]) {
      const uVal = String(mappedObj[schema.uniqueField]).trim().toUpperCase()
      if (existingUniqueValues.has(uVal) || seenInBatch.has(uVal)) {
        hasError = true
        errorReason = `Identificador duplicado: ${uVal}`
      } else {
        seenInBatch.add(uVal)
      }
    }

    if (hasError) {
      rejectedRows.push({
        _line: rowNum,
        _error: errorReason,
        ...rawRow
      })
    } else {
      // Add mandatory institutional columns
      mappedObj.institution_id = mappedObj.institution_id || 1
      if (entityKey === 'students' && !mappedObj.student_id) {
        mappedObj.student_id = `EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      }
      toInsert.push(mappedObj)
    }
  }

  // 4. Batch transactional insert
  let insertedCount = 0
  await db.transaction(async trx => {
    const BATCH_SIZE = 250
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE)
      await trx(`school.${schema.tableName}`).insert(batch)
      insertedCount += batch.length
    }

    // Reset table sequence if serial id exists
    try {
      await trx.raw(`
        SELECT setval(pg_get_serial_sequence('school.${schema.tableName}', 'id'), COALESCE(MAX(id), 1))
        FROM school.${schema.tableName};
      `)
    } catch (_) {}

    await trx('school.audit_logs').insert({
      user_id: adminUser.id,
      action: 'DATA_MIGRATION',
      table_name: schema.tableName,
      notes: `Migración histórica de ${schema.label}: ${insertedCount} insertados, ${rejectedRows.length} rechazados. Snapshot: ${safetySnapshot.filename}`,
      occurred_at: trx.fn.now()
    })
  })

  // 5. Generate CSV of rejected rows for instant download and correction
  let rejectedCsv = ''
  if (rejectedRows.length > 0) {
    const cols = ['_line', '_error', ...Object.keys(rows[0] || {})]
    const escapeCsv = (v) => `"${String(v || '').replace(/"/g, '""')}"`
    const headerRow = cols.join(',')
    const dataRows = rejectedRows.map(r => cols.map(c => escapeCsv(r[c])).join(','))
    rejectedCsv = [headerRow, ...dataRows].join('\n')
  }

  return {
    success: true,
    entity: entityKey,
    inserted_count: insertedCount,
    rejected_count: rejectedRows.length,
    safety_snapshot: safetySnapshot.filename,
    rejected_csv: rejectedCsv
  }
}

// Express Routes mounting helper
module.exports = function (app) {
  // 1. GET /data-migration/entities or /api/data-migration/entities
  app.get(['/data-migration/entities', '/api/data-migration/entities'], (req, res) => {
    return res.json({
      entities: Object.entries(ENTITY_SCHEMAS).map(([key, item]) => ({
        key,
        label: item.label,
        tableName: item.tableName,
        fields: item.fields
      }))
    })
  })

  // 2. POST /data-migration/parse or /api/data-migration/parse
  app.post(['/data-migration/parse', '/api/data-migration/parse'], (req, res) => {
    try {
      const { filename, content, base64 } = req.body
      if (!filename || !content) {
        return res.status(400).json({ error: 'Se requiere el nombre y contenido del archivo.' })
      }

      const parsed = parseContentToRows(filename, content, Boolean(base64))
      const detectedEntity = detectEntityFromHeaders(parsed.headers)
      const autoMapping = computeAutoMapping(detectedEntity, parsed.headers)

      return res.json({
        filename,
        total_rows: parsed.total_rows,
        headers: parsed.headers,
        sample_rows: parsed.rows.slice(0, 10),
        rows: parsed.rows,
        detected_entity: detectedEntity,
        auto_mapping: autoMapping,
        schema: ENTITY_SCHEMAS[detectedEntity]
      })
    } catch (err) {
      console.error('[DataMigration] Parse error:', err)
      return res.status(400).json({ error: err.message || 'Error al procesar el archivo.' })
    }
  })

  // 3. POST /data-migration/auto-map or /api/data-migration/auto-map
  app.post(['/data-migration/auto-map', '/api/data-migration/auto-map'], (req, res) => {
    try {
      const { entity, headers } = req.body
      if (!entity || !headers) {
        return res.status(400).json({ error: 'Se requiere entity y headers.' })
      }
      const mapping = computeAutoMapping(entity, headers)
      return res.json({
        entity,
        mapping,
        schema: ENTITY_SCHEMAS[entity]
      })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  })

  // 4. POST /data-migration/validate or /api/data-migration/validate
  app.post(['/data-migration/validate', '/api/data-migration/validate'], async (req, res) => {
    try {
      const { entity, rows, mapping, defaultValues } = req.body
      if (!entity || !rows || !mapping) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos para la validación.' })
      }

      const db = app.get('knexClient')
      const result = await validateMigrationData(db, entity, rows, mapping, defaultValues || {})
      return res.json(result)
    } catch (err) {
      console.error('[DataMigration] Validation error:', err)
      return res.status(400).json({ error: err.message })
    }
  })

  // 5. POST /data-migration/execute or /api/data-migration/execute
  app.post(['/data-migration/execute', '/api/data-migration/execute'], async (req, res) => {
    try {
      // Verify admin token
      const authHeader = req.headers['authorization']
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Autenticación requerida' })
      }
      const token = authHeader.split(' ')[1]
      const authPayload = await app.service('authentication').verifyAccessToken(token)

      const db = app.get('knexClient')
      const adminUser = await db('school.users').where({ id: authPayload.sub, is_active: true }).first()
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso restringido: requiere privilegios de Administrador' })
      }

      const { entity, rows, mapping, defaultValues, password } = req.body
      if (!entity || !rows || !mapping || !password) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos o contraseña de confirmación.' })
      }

      const result = await executeMigration(db, entity, rows, mapping, defaultValues || {}, adminUser, password)
      return res.json(result)
    } catch (err) {
      console.error('[DataMigration] Execute error:', err)
      return res.status(err.statusCode || 500).json({ error: err.message })
    }
  })
}

module.exports.ENTITY_SCHEMAS = ENTITY_SCHEMAS
module.exports.parseContentToRows = parseContentToRows
module.exports.computeAutoMapping = computeAutoMapping
