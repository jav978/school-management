/**
 * Utilidades de exportación oficial multi-formato (Excel, Word y CSV)
 * Diseñadas para compatibilidad nativa con Microsoft Office y LibreOffice
 * con soporte UTF-8 completo para acentos y eñes.
 */

export interface ExportColumn {
  key: string
  label: string
  isBold?: boolean
}

export interface ExportOptions {
  filename: string
  title: string
  subtitle?: string
  reportCode?: string
  columns: ExportColumn[]
  rows: Record<string, any>[]
  metadata?: { label: string; value: string }[]
  institutionName?: string
  rif?: string
  deaCode?: string
}

/**
 * Exporta a Excel en formato XML Spreadsheet (nativamente soportado por Microsoft Excel y Calc)
 * con colores de celda corporativos, bordes y anchos calculados.
 */
export function exportToExcel(options: ExportOptions) {
  if (!import.meta.client) return

  const {
    filename,
    title,
    subtitle = '',
    reportCode = '',
    columns,
    rows,
    metadata = [],
    institutionName = 'U.E Colegio "Santa Luisa"',
    rif = 'J-315628015',
    deaCode = 'S0098D0101'
  } = options

  const safeFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`
  const issueDate = new Date().toLocaleDateString('es-VE')

  // Generar XML Spreadsheet 2003
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#281470" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#F8FAFC"/>
   <Interior ss:Color="#3E229C" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="MetaLabel">
   <Font ss:FontName="Calibri" ss:Size="9" ss:Bold="1" ss:Color="#475569"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="MetaValue">
   <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#281470"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#281470"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableCell">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="TableCellBold">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Reporte">
  <Table ss:DefaultRowHeight="20">`

  // Configurar anchos de columna
  columns.forEach(() => {
    xml += `\n   <Column ss:AutoFitWidth="1" ss:Width="120"/>`
  })

  const colCount = Math.max(columns.length, 4)

  // 1. Fila de Título Principal Institucional
  xml += `\n   <Row ss:Height="26">
    <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="HeaderTitle"><Data ss:Type="String">${escapeXml(institutionName.toUpperCase())} - REPORTE OFICIAL</Data></Cell>
   </Row>`

  // 2. Fila de Subtítulo / RIF / DEA
  xml += `\n   <Row ss:Height="18">
    <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="SubTitle"><Data ss:Type="String">RIF: ${escapeXml(rif)} | DEA: ${escapeXml(deaCode)} | Fecha de Emisión: ${issueDate} | ${escapeXml(reportCode)}</Data></Cell>
   </Row>`

  // 3. Título del Reporte
  xml += `\n   <Row ss:Height="22">
    <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="HeaderTitle"><Data ss:Type="String">${escapeXml(title)}</Data></Cell>
   </Row>`

  // 4. Metadatos
  if (metadata.length > 0) {
    xml += `\n   <Row ss:Height="18">`
    metadata.slice(0, colCount).forEach(m => {
      xml += `<Cell ss:StyleID="MetaLabel"><Data ss:Type="String">${escapeXml(m.label)}: ${escapeXml(m.value)}</Data></Cell>`
    })
    xml += `\n   </Row>`
  }

  // Fila vacía separadora
  xml += `\n   <Row ss:Height="10"></Row>`

  // 5. Encabezados de Tabla
  xml += `\n   <Row ss:Height="24">`
  columns.forEach(col => {
    xml += `<Cell ss:StyleID="TableHeader"><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>`
  })
  xml += `\n   </Row>`

  // 6. Filas de Datos
  rows.forEach(row => {
    xml += `\n   <Row ss:Height="20">`
    columns.forEach(col => {
      const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : ''
      const styleId = col.isBold ? 'TableCellBold' : 'TableCell'
      xml += `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`
    })
    xml += `\n   </Row>`
  })

  // Fila resumen final
  xml += `\n   <Row ss:Height="20">
    <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="MetaLabel"><Data ss:Type="String">Total de Registros Exportados: ${rows.length}</Data></Cell>
   </Row>`

  xml += `\n  </Table>
 </Worksheet>
</Workbook>`

  downloadBlob(new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' }), safeFilename)
}

/**
 * Exporta a formato Microsoft Word (.doc) con membrete institucional,
 * tabla formateada y líneas de firmas de las autoridades del plantel.
 */
export function exportToWord(options: ExportOptions) {
  if (!import.meta.client) return

  const {
    filename,
    title,
    subtitle = '',
    reportCode = '',
    columns,
    rows,
    metadata = [],
    institutionName = 'U.E Colegio "Santa Luisa"',
    rif = 'J-315628015',
    deaCode = 'S0098D0101'
  } = options

  const safeFilename = filename.endsWith('.doc') ? filename : `${filename}.doc`
  const issueDate = new Date().toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })

  let metadataHtml = ''
  if (metadata.length > 0) {
    metadataHtml = `
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 20px;">
        <table style="width: 100%; border: none; font-size: 11px;">
          <tr>
            ${metadata.map(m => `<td style="padding: 4px; border: none;"><strong>${escapeXml(m.label)}:</strong> ${escapeXml(m.value)}</td>`).join('')}
          </tr>
        </table>
      </div>
    `
  }

  let tableHeaderHtml = columns.map(c => `
    <th style="background-color: #281470; color: #ffffff; padding: 8px 10px; font-size: 11px; text-align: left; border: 1px solid #1e114f;">
      ${escapeXml(c.label)}
    </th>
  `).join('')

  let tableRowsHtml = rows.map((r, i) => `
    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      ${columns.map(c => `
        <td style="padding: 6px 10px; font-size: 11px; border: 1px solid #e2e8f0; ${c.isBold ? 'font-weight: bold; color: #0f172a;' : 'color: #334155;'}">
          ${escapeXml(r[c.key] !== undefined && r[c.key] !== null ? String(r[c.key]) : '')}
        </td>
      `).join('')}
    </tr>
  `).join('')

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeXml(title)}</title>
      <style>
        @page {
          size: letter;
          margin: 20mm 20mm 20mm 20mm;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          color: #0f172a;
          line-height: 1.4;
        }
        h1, h2, h3 { margin: 0; padding: 0; }
        table { border-collapse: collapse; width: 100%; }
      </style>
    </head>
    <body>
      <!-- Membrete Institucional -->
      <table style="width: 100%; border-bottom: 2px solid #281470; padding-bottom: 12px; margin-bottom: 16px; border: none;">
        <tr>
          <td style="border: none; vertical-align: middle;">
            <p style="font-size: 9px; text-transform: uppercase; color: #64748b; margin: 0; font-weight: bold;">
              REPÚBLICA BOLIVARIANA DE VENEZUELA • MPPE
            </p>
            <h1 style="font-size: 16px; color: #281470; font-weight: bold; margin: 2px 0;">
              ${escapeXml(institutionName)}
            </h1>
            <p style="font-size: 10px; color: #475569; margin: 0;">
              Hijas de la Caridad de San Vicente de Paúl • Distrito Escolar N° 1
            </p>
            <p style="font-size: 9px; color: #64748b; font-family: monospace; margin: 2px 0 0 0;">
              DEA: ${escapeXml(deaCode)} • RIF: ${escapeXml(rif)} • Calle Real del Prado de María, Caracas
            </p>
          </td>
          <td style="border: none; text-align: right; vertical-align: middle;">
            <p style="font-size: 11px; font-weight: bold; color: #d97706; margin: 0;">${escapeXml(reportCode)}</p>
            <p style="font-size: 9px; color: #94a3b8; margin: 2px 0 0 0;">Fecha: ${issueDate}</p>
          </td>
        </tr>
      </table>

      <!-- Título del Documento -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="font-size: 15px; text-transform: uppercase; color: #1e293b; letter-spacing: 0.5px;">
          ${escapeXml(title)}
        </h2>
        ${subtitle ? `<p style="font-size: 11px; color: #64748b; margin-top: 4px;">${escapeXml(subtitle)}</p>` : ''}
      </div>

      <!-- Metadatos del Filtro -->
      ${metadataHtml}

      <!-- Tabla de Datos -->
      <table style="width: 100%; margin-bottom: 24px;">
        <thead>
          <tr>${tableHeaderHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <!-- Total Registros -->
      <p style="font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 35px;">
        Total de registros certificados: ${rows.length}
      </p>

      <!-- Bloque de Firmas Institucionales -->
      <table style="width: 100%; margin-top: 40px; border: none; text-align: center;">
        <tr>
          <td style="width: 45%; border: none; vertical-align: top;">
            <div style="border-top: 1.5px solid #334155; width: 180px; margin: 0 auto 4px auto;"></div>
            <p style="font-size: 11px; font-weight: bold; margin: 0; color: #0f172a;">Prof. Elena Vargas</p>
            <p style="font-size: 9px; text-transform: uppercase; color: #64748b; margin: 0;">Control de Estudios y Evaluación</p>
          </td>
          <td style="width: 10%; border: none;"></td>
          <td style="width: 45%; border: none; vertical-align: top;">
            <div style="border-top: 1.5px solid #334155; width: 180px; margin: 0 auto 4px auto;"></div>
            <p style="font-size: 11px; font-weight: bold; margin: 0; color: #0f172a;">Sor María Dolores Amaya</p>
            <p style="font-size: 9px; text-transform: uppercase; color: #64748b; margin: 0;">Dirección General</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  downloadBlob(new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' }), safeFilename)
}

/**
 * Exporta a CSV limpio con soporte UTF-8 BOM para apertura nativa en Excel sin errores de codificación
 */
export function exportToCsv(options: Pick<ExportOptions, 'filename' | 'columns' | 'rows'>) {
  if (!import.meta.client) return

  const { filename, columns, rows } = options
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`

  const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(';')
  const dataRows = rows.map(r => {
    return columns.map(c => {
      const val = r[c.key] !== undefined && r[c.key] !== null ? String(r[c.key]) : ''
      return `"${val.replace(/"/g, '""')}"`
    }).join(';')
  }).join('\r\n')

  const csvContent = '\uFEFF' + headers + '\r\n' + dataRows
  downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), safeFilename)
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
