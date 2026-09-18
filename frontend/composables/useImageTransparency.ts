/**
 * Utility to process scanned stamps, seals, and signatures,
 * removing white or off-white backgrounds to produce transparent PNGs.
 */
export function useImageTransparency() {
  const makeBackgroundTransparent = (imageSrc: string, threshold = 210): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !imageSrc) return resolve(imageSrc)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(imageSrc)

          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const d = imgData.data

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i]
            const g = d[i + 1]
            const b = d[i + 2]
            // If near white, fade or remove alpha
            if (r > threshold && g > threshold && b > threshold) {
              const brightness = (r + g + b) / 3
              const alpha = Math.max(0, Math.min(255, 255 - ((brightness - threshold) / (255 - threshold) * 255)))
              d[i + 3] = Math.min(d[i + 3], alpha)
            }
          }

          ctx.putImageData(imgData, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        } catch (e) {
          console.warn('Canvas transparency processing failed, using original:', e)
          resolve(imageSrc)
        }
      }
      img.onerror = () => resolve(imageSrc)
      img.src = imageSrc
    })
  }

  return { makeBackgroundTransparent }
}
