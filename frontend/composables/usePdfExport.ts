import { ref } from 'vue'

export interface PdfExportOptions {
  orientation?: 'portrait' | 'landscape'
  format?: 'letter' | 'a4'
  scale?: number
  margin?: number | [number, number, number, number]
}

export function usePdfExport() {
  const isExporting = ref(false)

  const downloadPdf = async (
    elementOrId: HTMLElement | string,
    filename: string,
    options: PdfExportOptions = {}
  ): Promise<boolean> => {
    if (!import.meta.client) return false

    isExporting.value = true
    try {
      let targetEl: HTMLElement | null = null
      if (typeof elementOrId === 'string') {
        targetEl = document.getElementById(elementOrId)
      } else {
        targetEl = elementOrId
      }

      if (!targetEl) {
        console.error(`[usePdfExport] Element not found: ${elementOrId}`)
        isExporting.value = false
        return false
      }

      // Dynamically load html2pdf to prevent SSR build issues
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule

      const orientation = options.orientation || 'portrait'
      const format = options.format || 'letter'
      const scale = options.scale || 2
      const margin = options.margin !== undefined ? options.margin : [8, 8, 8, 8]

      const sanitizedFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`

      const opt = {
        margin,
        filename: sanitizedFilename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format,
          orientation
        }
      }

      await html2pdf().set(opt).from(targetEl).save()
      return true
    } catch (err) {
      console.error('[usePdfExport] Error generating PDF:', err)
      return false
    } finally {
      isExporting.value = false
    }
  }

  const printDocument = () => {
    if (import.meta.client) {
      window.print()
    }
  }

  return {
    isExporting,
    downloadPdf,
    printDocument
  }
}
