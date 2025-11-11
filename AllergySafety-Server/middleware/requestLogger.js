export default function requestLogger(req, res, next) {
  try {
    const now = new Date().toISOString()
    const authHeader = req.headers.authorization || ''
    const hasToken = authHeader.startsWith('Bearer')
    console.log(`[${now}] ${req.method} ${req.originalUrl} - token:${hasToken} - ip:${req.ip}`)
    // Log small bodies for debugging (avoid huge payloads)
    if (req.method === 'POST' || req.method === 'PUT') {
      try {
        const clone = { ...req.body }
        // redact common sensitive fields
        if (clone.password) clone.password = 'REDACTED'
        if (clone.confirmPassword) clone.confirmPassword = 'REDACTED'
        console.log('  Body:', JSON.stringify(clone))
      } catch (err) {
        console.log('  Body: <unserializable>')
      }
    }
  } catch (err) {
    // never break the request on logger error
    console.error('Request logger error', err)
  }
  next()
}
