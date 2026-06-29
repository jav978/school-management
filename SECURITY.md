# Política de Seguridad

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.

### Cómo Reportar

1. **No** crees un issue público
2. Envía un email a security@schoolms.com
3. Incluye:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (si las tienes)

### Tiempo de Respuesta

- Acusamos recibo en 24 horas
- Proporcionamos una estimación de tiempo en 72 horas
- Trabajamos en una solución lo antes posible

### Divulgación Coordinada

- Trabajamos contigo para entender y resolver el problema
- Te mantenemos informado del progreso
- Publicamos un advisory cuando se corrige la vulnerabilidad
- Te damos crédito (si lo deseas)

## Medidas de Seguridad

### Autenticación
- JWT con expiración
- Hash de contraseñas con bcrypt
- Rate limiting en endpoints de autenticación

### Autorización
- Roles y permisos
- Guards de autenticación
- Validación de entrada

### Datos
- Encriptación en tránsito (HTTPS)
- Encriptación en reposo (configurable)
- Backup regular

### Infraestructura
- Firewall configurado
- Monitoreo de seguridad
- Actualizaciones regulares

## Mejores Prácticas

### Para Desarrolladores
- Nunca hardcodees secretos
- Usa variables de entorno
- Valida toda la entrada
- Sanitiza la salida
- Usa HTTPS en producción
- Mantén las dependencias actualizadas

### Para Usuarios
- Usa contraseñas fuertes
- No compartas credenciales
- Reporta actividad sospechosa
- Mantén tu software actualizado

## Contacto

- Email: security@schoolms.com
- PGP Key: [Enlace a la llave PGP]
