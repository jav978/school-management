const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFile } = require('child_process')

const DOCUMENTS_DIR = path.join(__dirname, '../../public/uploads/documents')
const AVATARS_DIR = path.join(__dirname, '../../public/uploads/avatars')
const LOGO_PATH = path.join(__dirname, '../../../frontend/public/logocolegio.png')

if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true })
}

// Convert local image to base64 Data URI
function getBase64Image(imagePath) {
  try {
    if (!imagePath) return ''
    if (imagePath.startsWith('data:')) return imagePath
    
    let resolvedPath = imagePath
    if (imagePath.startsWith('/uploads/avatars/')) {
      resolvedPath = path.join(AVATARS_DIR, path.basename(imagePath))
    } else if (imagePath.startsWith('/logocolegio.png')) {
      resolvedPath = LOGO_PATH
    }

    if (fs.existsSync(resolvedPath)) {
      const ext = path.extname(resolvedPath).slice(1).toLowerCase()
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
      const data = fs.readFileSync(resolvedPath)
      return `data:${mime};base64,${data.toString('base64')}`
    }
  } catch (err) {
    console.warn('Could not read image for PDF:', imagePath, err.message)
  }
  return ''
}

// HTML Template Builder for 2-Page Santa Luisa Official Document
function buildEnrollmentHtml(data, isBlank = false) {
  const logoBase64 = getBase64Image(LOGO_PATH)
  const studentPhotoBase64 = isBlank ? '' : getBase64Image(data?.student?.photo_url)
  const fatherPhotoBase64 = isBlank ? '' : getBase64Image(data?.father?.photo_url)
  const motherPhotoBase64 = isBlank ? '' : getBase64Image(data?.mother?.photo_url)
  const authPhotoBase64 = isBlank ? '' : getBase64Image(data?.authorized_pickup?.photo_url)

  const s = isBlank ? {} : (data?.student || {})
  const f = isBlank ? {} : (data?.father || {})
  const m = isBlank ? {} : (data?.mother || {})
  const a = isBlank ? {} : (data?.authorized_pickup || {})
  const sc = isBlank ? {} : (data?.socioeconomic || {})
  const req = isBlank ? {} : (data?.requirements || {})
  const schools = isBlank ? [] : (data?.previous_schools || [])
  const chronology = isBlank ? [] : (data?.chronology || [])

  const defaultSchools = [
    { grade: 'Educ. Inicial', school_year: '', school_name: '', city: '' },
    { grade: '1º Grado', school_year: '', school_name: '', city: '' },
    { grade: '2º Grado', school_year: '', school_name: '', city: '' },
    { grade: '3º Grado', school_year: '', school_name: '', city: '' },
    { grade: '4º Grado', school_year: '', school_name: '', city: '' },
    { grade: '5º Grado', school_year: '', school_name: '', city: '' },
    { grade: '6º Grado', school_year: '', school_name: '', city: '' }
  ]
  const schoolsList = schools.length > 0 ? schools : defaultSchools

  const defaultChronology = [
    { grade: '1er Grado', school_year: '' },
    { grade: '2do Grado', school_year: '' },
    { grade: '3er Grado', school_year: '' },
    { grade: '4to Grado', school_year: '' },
    { grade: '5to Grado', school_year: '' },
    { grade: '6to Grado', school_year: '' },
    { grade: '1er Año', school_year: '' },
    { grade: '2do Año', school_year: '' },
    { grade: '3er Año', school_year: '' },
    { grade: '4to Año', school_year: '' },
    { grade: '5to Año', school_year: '' }
  ]
  const chronoList = chronology.length > 0 ? chronology : defaultChronology

  const v = (val) => (val !== undefined && val !== null && String(val).trim() !== '' ? String(val).trim() : '')
  const chk = (val) => (val ? '☑' : '☐')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha de Inscripción - U.E. Colegio Santa Luisa</title>
  <style>
    @page {
      size: letter portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      color: #000000;
      background: #ffffff;
      font-size: 9px;
      line-height: 1.25;
    }
    .page-container {
      width: 100%;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 5px;
    }
    .header-logo {
      width: 75px;
      vertical-align: middle;
      text-align: center;
    }
    .header-logo img {
      width: 70px;
      height: 70px;
      object-fit: contain;
    }
    .header-text {
      text-align: center;
      vertical-align: middle;
      padding: 0 8px;
    }
    .header-photo {
      width: 85px;
      vertical-align: middle;
      text-align: center;
    }
    .photo-box {
      width: 80px;
      height: 105px;
      border: 1px dashed #000;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      overflow: hidden;
      background: #fff;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .section-box {
      border: 1px solid #000;
      margin-bottom: 5px;
      border-radius: 4px;
      overflow: hidden;
    }
    .section-title {
      background: #e8e8e8;
      font-weight: 900;
      font-size: 8.5px;
      text-transform: uppercase;
      padding: 2px 6px;
      border-bottom: 1px solid #000;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
    }
    .grid-table td, .grid-table th {
      padding: 2.5px 4px;
      vertical-align: top;
      border-bottom: 1px solid #e0e0e0;
    }
    .field-label {
      font-size: 7.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #333;
      display: block;
      margin-bottom: 1px;
    }
    .field-value {
      font-size: 8.5px;
      font-weight: 600;
      color: #000;
      min-height: 13px;
      border-bottom: 1px dotted #888;
      padding-bottom: 1px;
    }
    .parent-card {
      border: 1px solid #aaa;
      margin-bottom: 4px;
      padding: 4px;
      border-radius: 3px;
    }
    .rep-photo {
      width: 65px;
      height: 80px;
      border: 1px dashed #666;
      text-align: center;
      vertical-align: middle;
      display: inline-block;
      overflow: hidden;
    }
    .rep-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
    }
    .data-table th {
      background: #f2f2f2;
      border: 1px solid #000;
      padding: 2px 4px;
      font-weight: 900;
      text-align: left;
    }
    .data-table td {
      border: 1px solid #000;
      padding: 2px 4px;
    }
    .commitments-list {
      font-size: 7.5px;
      line-height: 1.25;
      margin: 2px 0 0 0;
      padding-left: 14px;
    }
    .commitments-list li {
      margin-bottom: 1.5px;
      text-align: justify;
    }
    .signatures-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      border: 1px solid #000;
    }
    .signatures-table td {
      width: 33.33%;
      padding: 4px 6px;
      vertical-align: bottom;
      text-align: center;
      border-right: 1px solid #000;
    }
    .signatures-table td:last-child {
      border-right: none;
    }
    .sig-line {
      width: 85%;
      border-bottom: 1.5px solid #000;
      margin: 25px auto 3px auto;
    }
    .thumb-box {
      width: 45px;
      height: 55px;
      border: 1.5px dashed #444;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6.5px;
      font-weight: bold;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- ============================================================ -->
  <!-- PÁGINA 1: DATOS ALUMNO, PADRES Y DOMICILIO -->
  <!-- ============================================================ -->
  <div class="page-container">
    <table class="header-table">
      <tr>
        <td class="header-logo">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo Santa Luisa">` : '<div style="font-size:24px;">🏛️</div>'}
        </td>
        <td class="header-text">
          <div style="font-size:8px; font-weight:bold; text-transform:uppercase;">República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación</div>
          <div style="font-size:14px; font-weight:900; margin:1px 0; font-family:serif;">U.E. COLEGIO "SANTA LUISA"</div>
          <div style="font-size:7.5px; color:#333;">Comunidad Educativa Vicenciana • Av. San Martín, Caracas • R.I.F. J-12345678-9 • Código DEA: S0000D0101</div>
          <div style="display:inline-block; margin-top:2px; padding:1px 8px; border:1px solid #000; border-radius:10px; font-weight:900; font-size:8.5px;">
            PLANILLA OFICIAL DE INSCRIPCIÓN Y REGISTRO ESCOLAR (PÁG. 1/2)
          </div>
          <div style="margin-top:3px; font-size:8px; font-weight:bold; display:flex; justify-content:space-around;">
            <span>AÑO ESCOLAR: <strong>2026 - 2027</strong></span>
            <span>FECHA: <strong>${new Date().toLocaleDateString('es-VE')}</strong></span>
            <span>ESTADO: <strong>${v(s.birth_state) || 'DISTRITO CAPITAL (CARACAS)'}</strong></span>
          </div>
        </td>
        <td class="header-photo">
          <div class="photo-box">
            ${studentPhotoBase64 ? `<img src="${studentPhotoBase64}" alt="Foto Alumno">` : '<div style="padding-top:35px; font-size:7px; font-weight:bold; color:#666;">FOTO CARNET<br>ALUMNO<br>(3x4 cm)</div>'}
          </div>
        </td>
      </tr>
    </table>

    <!-- SECCIÓN A: DATOS DEL ALUMNO -->
    <div class="section-box">
      <div class="section-title">A. DATOS DEL ALUMNO</div>
      <table class="grid-table">
        <tr>
          <td style="width: 50%;">
            <span class="field-label">1. Apellidos (Según C.I.)</span>
            <div class="field-value">${v(s.last_name)}</div>
          </td>
          <td style="width: 50%;">
            <span class="field-label">2. Nombres (Según C.I.)</span>
            <div class="field-value">${v(s.first_name)}</div>
          </td>
        </tr>
      </table>
      <table class="grid-table">
        <tr>
          <td style="width: 25%;">
            <span class="field-label">3. Lugar de Nacimiento</span>
            <div class="field-value">${v(s.birth_place)}</div>
          </td>
          <td style="width: 25%;">
            <span class="field-label">4. Estado</span>
            <div class="field-value">${v(s.birth_state)}</div>
          </td>
          <td style="width: 25%;">
            <span class="field-label">5. País</span>
            <div class="field-value">${v(s.birth_country) || 'VENEZUELA'}</div>
          </td>
          <td style="width: 25%;">
            <span class="field-label">6. Fecha de Nacimiento</span>
            <div class="field-value">${v(s.date_of_birth)}</div>
          </td>
        </tr>
      </table>
      <table class="grid-table">
        <tr>
          <td style="width: 25%;">
            <span class="field-label">7. Número de C.I. o Cédula Escolar</span>
            <div class="field-value" style="font-weight:900;">${v(s.national_id)}</div>
          </td>
          <td style="width: 35%;">
            <span class="field-label">8. Grado / Año para el que se Inscribe</span>
            <div class="field-value" style="font-weight:900;">${v(s.grade) || 'Quinto Grado'}</div>
          </td>
          <td style="width: 20%;">
            <span class="field-label">Gestión Escolar</span>
            <div class="field-value"><strong>2026 - 2027</strong></div>
          </td>
          <td style="width: 20%;">
            <span class="field-label">Código Matrícula (ID)</span>
            <div class="field-value">${v(s.student_id)}</div>
          </td>
        </tr>
      </table>
      <table class="grid-table">
        <tr>
          <td style="width: 45%;">
            <span class="field-label">9. Apellidos y Nombres del Responsable Económico</span>
            <div class="field-value">${v(s.economic_responsible_name)}</div>
          </td>
          <td style="width: 30%;">
            <span class="field-label">10. Ocupación Responsable</span>
            <div class="field-value">${v(s.economic_responsible_occupation)}</div>
          </td>
          <td style="width: 25%;">
            <span class="field-label">11. Nivel de Estudio</span>
            <div class="field-value">${v(s.economic_responsible_education)}</div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <span class="field-label">12. Hermanos en este Plantel y Grado que Cursa Cada Uno</span>
            <div class="field-value">${v(s.siblings_in_school) || 'Ninguno'}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- SECCIÓN B: DATOS DE LOS PADRES Y FOTOS DE CONTROL DE RETIRO -->
    <div class="section-box">
      <div class="section-title">B. DATOS DE LOS PADRES Y CONTROL FACIAL DE RETIRO EN PORTERÍA</div>
      <div style="padding: 3px;">
        
        <!-- PADRE -->
        <table class="parent-card" style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="width: 70px; text-align:center; vertical-align:middle;">
              <div class="rep-photo">
                ${fatherPhotoBase64 ? `<img src="${fatherPhotoBase64}" alt="Foto Padre">` : '<div style="padding-top:25px; font-size:6.5px; font-weight:bold; color:#777;">FOTO CARNET<br>PADRE<br>(3x4)</div>'}
              </div>
              <div style="font-size:7px; font-weight:900; margin-top:2px;">PADRE</div>
            </td>
            <td style="padding-left: 6px; vertical-align:top;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="width:50%;"><span class="field-label">1. Apellidos y Nombres del Padre</span><div class="field-value">${v(f.full_name)}</div></td>
                  <td style="width:25%;"><span class="field-label">2. Cédula Identidad</span><div class="field-value"><strong>${v(f.national_id)}</strong></div></td>
                  <td style="width:12%;"><span class="field-label">3. Edad</span><div class="field-value">${v(f.age)}</div></td>
                  <td style="width:13%;"><span class="field-label">4. Nacionalidad</span><div class="field-value">${v(f.nationality) || 'VENEZOLANO'}</div></td>
                </tr>
                <tr>
                  <td><span class="field-label">5. Ocupación / Profesión</span><div class="field-value">${v(f.occupation)}</div></td>
                  <td><span class="field-label">6. Nivel de Estudio</span><div class="field-value">${v(f.education_level)}</div></td>
                  <td><span class="field-label">7. Celular</span><div class="field-value"><strong>${v(f.phone_mobile)}</strong></div></td>
                  <td><span class="field-label">8. E-mail</span><div class="field-value">${v(f.email)}</div></td>
                </tr>
                <tr>
                  <td colspan="4"><span class="field-label">9. Nombre y Dirección de la Empresa donde trabaja</span><div class="field-value">${v(f.employer)}</div></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- MADRE -->
        <table class="parent-card" style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="width: 70px; text-align:center; vertical-align:middle;">
              <div class="rep-photo">
                ${motherPhotoBase64 ? `<img src="${motherPhotoBase64}" alt="Foto Madre">` : '<div style="padding-top:25px; font-size:6.5px; font-weight:bold; color:#777;">FOTO CARNET<br>MADRE<br>(3x4)</div>'}
              </div>
              <div style="font-size:7px; font-weight:900; margin-top:2px;">MADRE</div>
            </td>
            <td style="padding-left: 6px; vertical-align:top;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="width:50%;"><span class="field-label">10. Apellidos y Nombres de la Madre</span><div class="field-value">${v(m.full_name)}</div></td>
                  <td style="width:25%;"><span class="field-label">11. Cédula Identidad</span><div class="field-value"><strong>${v(m.national_id)}</strong></div></td>
                  <td style="width:12%;"><span class="field-label">12. Edad</span><div class="field-value">${v(m.age)}</div></td>
                  <td style="width:13%;"><span class="field-label">13. Nacionalidad</span><div class="field-value">${v(m.nationality) || 'VENEZOLANA'}</div></td>
                </tr>
                <tr>
                  <td><span class="field-label">14. Ocupación / Profesión</span><div class="field-value">${v(m.occupation)}</div></td>
                  <td><span class="field-label">15. Nivel de Estudio</span><div class="field-value">${v(m.education_level)}</div></td>
                  <td><span class="field-label">16. Celular</span><div class="field-value"><strong>${v(m.phone_mobile)}</strong></div></td>
                  <td><span class="field-label">17. E-mail</span><div class="field-value">${v(m.email)}</div></td>
                </tr>
                <tr>
                  <td colspan="4"><span class="field-label">18. Nombre y Dirección de la Empresa donde trabaja</span><div class="field-value">${v(m.employer)}</div></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- TERCERO AUTORIZADO A RETIRAR -->
        <table class="parent-card" style="width:100%; border-collapse:collapse; margin-bottom:0;">
          <tr>
            <td style="width: 70px; text-align:center; vertical-align:middle;">
              <div class="rep-photo">
                ${authPhotoBase64 ? `<img src="${authPhotoBase64}" alt="Foto Autorizado">` : '<div style="padding-top:25px; font-size:6.5px; font-weight:bold; color:#777;">FOTO CARNET<br>AUTORIZADO<br>(3x4)</div>'}
              </div>
              <div style="font-size:6.5px; font-weight:900; margin-top:2px;">AUTORIZADO</div>
            </td>
            <td style="padding-left: 6px; vertical-align:top;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="width:45%;"><span class="field-label">Tercero Autorizado Expreso para Retirar (Nombres y Apellidos)</span><div class="field-value">${v(a.full_name)}</div></td>
                  <td style="width:25%;"><span class="field-label">Cédula Identidad</span><div class="field-value"><strong>${v(a.national_id)}</strong></div></td>
                  <td style="width:15%;"><span class="field-label">Parentesco</span><div class="field-value">${v(a.relationship)}</div></td>
                  <td style="width:15%;"><span class="field-label">Celular</span><div class="field-value">${v(a.phone_mobile)}</div></td>
                </tr>
                <tr>
                  <td colspan="4" style="font-size:7.5px; padding-top:3px;">
                    <strong>DECLARACIÓN:</strong> Autorizo formalmente a esta persona para retirar al estudiante de la institución en cualquier horario o contingencia escolar.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </div>
    </div>

    <!-- SECCIÓN C: DIRECCIÓN COMPLETA DEL DOMICILIO -->
    <div class="section-box">
      <div class="section-title">C. DIRECCIÓN COMPLETA DEL DOMICILIO Y CONTACTOS DE EMERGENCIA</div>
      <table class="grid-table">
        <tr>
          <td colspan="3"><span class="field-label">1. Dirección Habitación Completa</span><div class="field-value">${v(s.address)}</div></td>
        </tr>
        <tr>
          <td style="width:33%;"><span class="field-label">2. Teléfono Habitación</span><div class="field-value">${v(s.phone_home)}</div></td>
          <td style="width:33%;"><span class="field-label">3. De Otro Familiar o Vecino</span><div class="field-value">${v(s.phone_relative_neighbor)}</div></td>
          <td style="width:34%;"><span class="field-label">4. Teléfono Trabajo Papá (Ext. / Dpto.)</span><div class="field-value">${v(s.work_phone_father)} ${s.work_phone_father_ext ? `(Ext. ${s.work_phone_father_ext})` : ''}</div></td>
        </tr>
        <tr>
          <td style="width:33%;"><span class="field-label">5. Teléfono Trabajo Mamá (Ext. / Dpto.)</span><div class="field-value">${v(s.work_phone_mother)} ${s.work_phone_mother_ext ? `(Ext. ${s.work_phone_mother_ext})` : ''}</div></td>
          <td colspan="2" style="background:#fff2f2;">
            <span class="field-label" style="color:#b91c1c;">6. Teléfonos en Caso de Cuadro Viral / Emergencia Médica</span>
            <div class="field-value" style="font-weight:bold;">
              ${v(s.emergency_viral_phone1)} ${s.emergency_viral_phone2 ? `/ ${s.emergency_viral_phone2}` : ''} 
              ${s.emergency_contact_ask_for ? `— Preguntar por: ${s.emergency_contact_ask_for}` : ''}
            </div>
          </td>
        </tr>
      </table>
    </div>

  </div>

  <!-- ============================================================ -->
  <!-- PÁGINA 2: DATOS SOCIOECONÓMICOS, VIVIENDA, COMPROMISOS, RECAUDOS Y CRONOLOGÍA -->
  <!-- ============================================================ -->
  <div class="page-container page-break">
    <table class="header-table" style="margin-bottom:4px; padding-bottom:2px;">
      <tr>
        <td style="vertical-align:middle;">
          <div style="font-size:11px; font-weight:900; font-family:serif;">U.E. COLEGIO "SANTA LUISA"</div>
          <div style="font-size:7.5px; font-weight:bold; color:#444;">EXPEDIENTE DE MATRÍCULA Y ESTUDIO SOCIOECONÓMICO (PÁG. 2/2) — GESTIÓN 2026-2027</div>
        </td>
        <td style="text-align:right; vertical-align:middle;">
          <div style="font-size:8.5px; font-weight:bold;">ALUMNO: <u>${v(s.last_name)}, ${v(s.first_name)}</u></div>
          <div style="font-size:8px;">C.I. / C.E.: <strong>${v(s.national_id) || 'S/N'}</strong> • GRADO: <strong>${v(s.grade) || 'Quinto Grado'}</strong></div>
        </td>
      </tr>
    </table>

    <!-- SECCIÓN D: DATOS FAMILIARES Y SOCIOECONÓMICOS -->
    <div class="section-box">
      <div class="section-title">D. DATOS FAMILIARES, INGRESOS Y NÚCLEO SOCIOECONÓMICO</div>
      <table class="grid-table">
        <tr>
          <td style="width:35%;"><span class="field-label">Total Mensual Ingresos Grupo Familiar</span><div class="field-value">${v(sc.monthly_income)}</div></td>
          <td style="width:25%;"><span class="field-label">N° Personas Dependientes</span><div class="field-value">${v(sc.dependents_count)}</div></td>
          <td style="width:40%;"><span class="field-label">El Ingreso Familiar lo Aporta(n)</span><div class="field-value">${v(sc.income_providers)}</div></td>
        </tr>
      </table>
    </div>

    <!-- SECCIÓN E: PLANTELES DONDE ESTUDIÓ -->
    <div class="section-box">
      <div class="section-title">E. PLANTELES DONDE ESTUDIÓ EL ALUMNO (HISTORIAL ESCOLAR)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:18%;">GRADO</th>
            <th style="width:18%;">AÑO ESCOLAR</th>
            <th>NOMBRE DEL PLANTEL</th>
            <th style="width:22%;">CIUDAD</th>
          </tr>
        </thead>
        <tbody>
          ${schoolsList.map(r => `
            <tr>
              <td><strong>${v(r.grade)}</strong></td>
              <td>${v(r.school_year)}</td>
              <td>${v(r.school_name)}</td>
              <td>${v(r.city) || 'CARACAS'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- SECCIÓN F & G: ANTROPOMETRÍA, TECNOLOGÍA Y CARACTERIZACIÓN DE VIVIENDA -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:5px;">
      <tr>
        <!-- F. Antropometría y Canaima -->
        <td style="width:50%; vertical-align:top; padding-right:3px;">
          <div class="section-box" style="margin-bottom:0;">
            <div class="section-title">F. ANTROPOMETRÍA, SALUD Y EQUIPO TECNOLÓGICO</div>
            <table class="grid-table">
              <tr>
                <td><span class="field-label">Talla</span><div class="field-value"><strong>${v(sc.height)}</strong></div></td>
                <td><span class="field-label">Peso (Kg)</span><div class="field-value">${v(sc.weight)}</div></td>
                <td><span class="field-label">Edad</span><div class="field-value">${v(sc.age)}</div></td>
              </tr>
              <tr>
                <td><span class="field-label">¿Canaima?</span><div class="field-value"><strong>${v(sc.has_canaima).toUpperCase()}</strong></div></td>
                <td><span class="field-label">Serial</span><div class="field-value">${v(sc.canaima_serial)}</div></td>
                <td><span class="field-label">Estado</span><div class="field-value">${v(sc.canaima_condition)}</div></td>
              </tr>
              <tr>
                <td colspan="2"><span class="field-label">Seguro Personal (HCM)</span><div class="field-value">${v(sc.hcm_insurance_name) || 'No posee'}</div></td>
                <td><span class="field-label">Seguro Escolar</span><div class="field-value">${chk(sc.has_school_insurance)} SÍ</div></td>
              </tr>
            </table>
          </div>
        </td>

        <!-- G. Caracterización Vivienda -->
        <td style="width:50%; vertical-align:top; padding-left:3px;">
          <div class="section-box" style="margin-bottom:0;">
            <div class="section-title">G. CARACTERIZACIÓN DE LA VIVIENDA</div>
            <table class="grid-table">
              <tr>
                <td style="width:50%;"><span class="field-label">Tenencia Vivienda</span><div class="field-value">${v(sc.housing_tenure)}</div></td>
                <td style="width:50%;"><span class="field-label">Tipo Vivienda</span><div class="field-value">${v(sc.housing_type)}</div></td>
              </tr>
              <tr>
                <td><span class="field-label">N° Habitaciones</span><div class="field-value">${v(sc.rooms_count)}</div></td>
                <td><span class="field-label">Pago Mensual</span><div class="field-value">${v(sc.housing_monthly_payment) || '0'}</div></td>
              </tr>
              <tr>
                <td colspan="2">
                  <span class="field-label">Con el Alumno Viven:</span>
                  <div class="field-value">
                    ${chk(sc.lives_with_mother)} Mamá &nbsp; ${chk(sc.lives_with_father)} Papá &nbsp; Hermanos: ${v(sc.lives_with_siblings_count) || '0'} &nbsp; Otros: ${v(sc.lives_with_others)}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>

    <!-- SECCIÓN H: SUSCRIPCIÓN DE COMPROMISOS VICENCIANOS -->
    <div class="section-box">
      <div class="section-title">H. SUSCRIPCIÓN DE COMPROMISOS CON LA U.E. COLEGIO "SANTA LUISA"</div>
      <div style="padding: 2.5px 5px;">
        <ul class="commitments-list">
          <li>Me comprometo a cubrir el costo completo del año escolar 2026 - 2027 (doce meses).</li>
          <li>Me comprometo a efectuar el pago de las mensualidades de mi representado los 30 de cada mes.</li>
          <li>Me comprometo a efectuar el pago de la mensualidad del mes de Diciembre antes del 15 del mismo.</li>
          <li>Me comprometo a respetar y cumplir las normas de convivencia del Plantel y lineamientos impartidos por sus autoridades vicencianas.</li>
          <li>Me comprometo a que mi representado cumplirá estrictamente con el uniforme escolar exigido por la Institución.</li>
          <li>Me comprometo a que mi representado no asistirá al Plantel con: prendas de valor, pinturas, gorras, celulares o equipos electrónicos; la Institución no se hace responsable de objetos de valor extraviados en horario escolar.</li>
          <li>Me comprometo a presentar mi tarjeta de pagos cuando la Institución realice operativos de cobranza y auditoría de solvencia.</li>
          <li>Si durante el año escolar en curso se producen aumentos salariales o bonos por decreto oficial, me comprometo a cancelar el ajuste correspondiente que cubra su incidencia en la estructura de costos.</li>
          <li>Todo mes cancelado por adelantado se considera abono, comprometiéndome a cancelar la diferencia resultante.</li>
          <li>Declaro haber leído detenidamente cada punto de la presente carta compromiso, la cual firmo en aceptación expresa de la misma.</li>
        </ul>
      </div>
    </div>

    <!-- SECCIÓN I & J: VALIDACIÓN DE REQUISITOS Y CRONOLOGÍA ESCOLAR -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:5px;">
      <tr>
        <!-- I. Requisitos -->
        <td style="width:40%; vertical-align:top; padding-right:3px;">
          <div class="section-box" style="margin-bottom:0;">
            <div class="section-title">I. VALIDACIÓN DE REQUISITOS (RECAUDOS)</div>
            <table class="grid-table" style="font-size:7.5px;">
              <tr><td>${chk(req.carpeta_manila)} Carpeta Manila</td><td>${chk(req.constancia_cedula_escolar)} Constancia Cédula Escolar</td></tr>
              <tr><td>${chk(req.partida_nacimiento)} Partida de Nacimiento</td><td>${chk(req.ci_madre)} C.I. Madre</td></tr>
              <tr><td>${chk(req.ci_alumno)} C.I. del Alumno</td><td>${chk(req.ci_padre)} C.I. Padre</td></tr>
              <tr><td>${chk(req.boleta_original)} Boleta Original</td><td>${chk(req.fotos_carnet)} Fotos Carnet (Alumno y Reps.)</td></tr>
              <tr><td>${chk(req.boleta_promocion)} Boleta Promoción</td><td>${chk(req.notas_certificadas)} Notas Certificadas</td></tr>
              <tr><td colspan="2">Otros Recaudos: ${v(req.otros) || 'Ninguno'}</td></tr>
            </table>
          </div>
        </td>

        <!-- J. Cronología Escolar -->
        <td style="width:60%; vertical-align:top; padding-left:3px;">
          <div class="section-box" style="margin-bottom:0;">
            <div class="section-title">J. CRONOLOGÍA ESCOLAR EN EL PLANTEL</div>
            <table class="data-table" style="font-size:7px;">
              <thead>
                <tr>
                  <th style="width:25%;">GRADO / AÑO</th>
                  <th style="width:30%;">AÑO ESCOLAR</th>
                  <th>FIRMA DEL REPRESENTANTE</th>
                </tr>
              </thead>
              <tbody>
                ${chronoList.map(c => `
                  <tr>
                    <td><strong>${v(c.grade)}</strong></td>
                    <td>${v(c.school_year)}</td>
                    <td style="border-bottom:1px dotted #888;">&nbsp;</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </table>

    <!-- BLOQUE OFICIAL DE FIRMAS Y HUELLA -->
    <table class="signatures-table">
      <tr>
        <td>
          <div class="sig-line"></div>
          <div style="font-size:8px; font-weight:900; text-transform:uppercase;">FIRMA DEL REPRESENTANTE</div>
          <div style="font-size:7px; color:#333;">Nombre: ${v(f.full_name) || v(m.full_name) || '______________________________'}</div>
          <div style="font-size:7px; color:#333;">C.I.: ${v(f.national_id) || v(m.national_id) || '____________________'}</div>
        </td>
        <td style="text-align:center;">
          <div class="thumb-box">PULGAR<br>DERECHO</div>
          <div style="font-size:7.5px; font-weight:bold; margin-top:2px; text-transform:uppercase;">HUELLA DACTILAR</div>
        </td>
        <td>
          <div class="sig-line"></div>
          <div style="font-size:8px; font-weight:900; text-transform:uppercase;">DIRECCIÓN / CONTROL DE ESTUDIOS</div>
          <div style="font-size:7px; color:#333;">Prof. Graciela Inatty de Poskal</div>
          <div style="font-size:6.5px; color:#666;">Sello Húmedo del Plantel</div>
        </td>
      </tr>
    </table>

  </div>

</body>
</html>`
}

module.exports = function (app) {
  // POST /enrollment-pdf: Generates clean 2-page PDF
  app.post('/enrollment-pdf', async (req, res) => {
    let tempHtmlPath = null
    let tempPdfPath = null

    try {
      const { data, isBlank = false, student_id } = req.body || {}

      const htmlContent = buildEnrollmentHtml(data, isBlank)
      const timestamp = Date.now()
      const randId = Math.random().toString(36).substring(2, 8)
      tempHtmlPath = path.join(os.tmpdir(), `enrollment_${timestamp}_${randId}.html`)
      tempPdfPath = path.join(os.tmpdir(), `enrollment_${timestamp}_${randId}.pdf`)

      // Write HTML file to temporary directory
      await fs.promises.writeFile(tempHtmlPath, htmlContent, 'utf8')

      // Chrome headless execution with exact parameters
      const chromeBin = '/usr/bin/google-chrome'
      const args = [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--no-pdf-header-footer',
        `--print-to-pdf=${tempPdfPath}`,
        tempHtmlPath
      ]

      await new Promise((resolve, reject) => {
        execFile(chromeBin, args, (error, stdout, stderr) => {
          if (error) {
            return reject(new Error(`Chrome PDF generation error: ${error.message}`))
          }
          resolve(true)
        })
      })

      if (!fs.existsSync(tempPdfPath)) {
        throw new Error('El archivo PDF no fue generado por el motor de impresión.')
      }

      const pdfBuffer = await fs.promises.readFile(tempPdfPath)

      // Optionally save to permanent documents archive if student_id is provided
      if (student_id) {
        try {
          const archiveFilename = `ficha_inscripcion_${student_id}_2026_2027.pdf`
          const archivePath = path.join(DOCUMENTS_DIR, archiveFilename)
          await fs.promises.writeFile(archivePath, pdfBuffer)
        } catch (saveErr) {
          console.warn('Could not archive PDF to documents directory:', saveErr.message)
        }
      }

      const lastName = data?.student?.last_name ? data.student.last_name.replace(/\s+/g, '_') : 'Alumno'
      const firstName = data?.student?.first_name ? data.student.first_name.replace(/\s+/g, '_') : 'Inscripcion'
      const downloadFilename = isBlank 
        ? 'Ficha_Inscripcion_Santa_Luisa_Blanco_2026_2027.pdf'
        : `Ficha_Inscripcion_${lastName}_${firstName}_2026_2027.pdf`

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`)
      res.setHeader('Content-Length', pdfBuffer.length)
      return res.send(pdfBuffer)

    } catch (err) {
      console.error('Error generating enrollment PDF:', err)
      return res.status(500).json({ error: 'Error al generar el documento PDF oficial: ' + err.message })
    } finally {
      // Clean up temporary files
      if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
        try { await fs.promises.unlink(tempHtmlPath) } catch (_) {}
      }
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        try { await fs.promises.unlink(tempPdfPath) } catch (_) {}
      }
    }
  })
}
