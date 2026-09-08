const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads/avatars')

// Asegurar que el directorio de almacenamiento existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

module.exports = function (app) {
  // Endpoint de subida de avatar/fotos de perfil
  app.post('/uploads/avatar', async (req, res) => {
    try {
      const { image, filename: clientFilename } = req.body

      if (!image) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen para procesar.' })
      }

      // Validar formato Data-URI (base64)
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Formato de imagen inválido. Debe ser una imagen Base64 válida.' })
      }

      const mimeType = matches[1].toLowerCase()
      const base64Data = matches[2]
      const buffer = Buffer.from(base64Data, 'base64')

      // Validar tipos MIME permitidos
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedMimes.includes(mimeType)) {
        return res.status(400).json({
          error: 'Tipo de archivo no permitido. Solo se aceptan formatos JPEG, PNG y WEBP.'
        })
      }

      // Validar tamaño máximo permitido: 3MB (3 * 1024 * 1024 bytes)
      const MAX_SIZE = 3 * 1024 * 1024
      if (buffer.length > MAX_SIZE) {
        return res.status(400).json({
          error: `El archivo supera el límite máximo permitido de 3MB (tamaño recibido: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB).`
        })
      }

      // Determinar extensión segura
      let ext = 'jpg'
      if (mimeType.includes('png')) ext = 'png'
      else if (mimeType.includes('webp')) ext = 'webp'

      // Generar nombre de archivo único
      const uniqueName = `avatar_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`
      const filePath = path.join(UPLOADS_DIR, uniqueName)

      // Escribir archivo al disco
      await fs.promises.writeFile(filePath, buffer)

      const relativeUrl = `/uploads/avatars/${uniqueName}`
      return res.status(200).json({
        success: true,
        url: relativeUrl,
        filename: uniqueName,
        size: buffer.length,
        mimeType
      })
    } catch (err) {
      console.error('[Uploads Error]:', err)
      return res.status(500).json({ error: 'Error interno al guardar la imagen.' })
    }
  })
}
