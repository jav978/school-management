/**
 * Global Sanitized Error Handler
 * Ensures exceptions never leak SQL queries, Knex statements, or internal stack traces
 * and prevents the Node.js server from terminating unexpectedly.
 */
module.exports = function (app) {
  return function (err, req, res, next) {
    const isProduction = process.env.NODE_ENV === 'production'
    const status = err.status || err.code || err.statusCode || 500
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

    // Log internal detail safely on the server
    console.error(`[${new Date().toISOString()}] [${errorId}] Error on ${req.method} ${req.url}:`, {
      message: err.message,
      code: status,
      name: err.name,
      stack: isProduction ? undefined : err.stack
    })

    // Prepare client-safe response
    let safeMessage = err.message || 'Ocurrió un error inesperado al procesar la solicitud'

    // Mask database/SQL errors
    if (err.message && (err.message.includes('knex') || err.message.includes('select') || err.message.includes('relation') || err.message.includes('syntax error'))) {
      safeMessage = 'Error interno en la base de datos. La operación no pudo completarse.'
    }

    res.status(status >= 100 && status < 600 ? status : 500).json({
      name: err.name || 'GeneralError',
      message: safeMessage,
      code: status,
      className: err.className || 'general-error',
      error_id: errorId,
      timestamp: new Date().toISOString()
    })
  }
}
