# 7. Troubleshooting & Error Resolution Guide
## Análisis de Incidentes y Diagnóstico Técnico — U.E. Santa Luisa v1.0

---

## 1. Análisis de Causa Raíz (RCA) del Sistema Previo

La transición tecnológica de la **U.E. Santa Luisa** hacia esta nueva plataforma propia se fundamenta en la resolución definitiva de dos graves vulnerabilidades e ineficiencias identificadas en el software anterior (registrado en `docs/error/caputure1.png`):

```
+-------------------------------------------------------------------------------+
|                      EVIDENCIA DE FALLA (caputure1.png)                       |
|                                                                               |
|   1. Error Superior:  [ Failed to fetch ]                                     |
|      -> Causa: Caída de la API externa / Bloqueo CORS / Falla de Red.        |
|                                                                               |
|   2. Error Flotante:  [ Invalid PrimeUI License ] (Esquina inferior derecha)  |
|      -> Causa: Dependencia de componentes UI privativos con expiración        |
|                remota y cobro forzoso de licencias anuales.                   |
+-------------------------------------------------------------------------------+
```

---

## 2. Diagnóstico Detallado de Errores y Solución Implementada

### A. Incidente 1: `Invalid PrimeUI License`

#### 1. Causa Raíz:
- El software anterior incorporaba librerías de interfaz de usuario sujetas a llaves de validación de pago mensual o anual (PrimeUI / componentes comerciales). Al expirar el período o fallar la validación con los servidores de licencias del proveedor, la interfaz quedaba bloqueada o arrojaba alertas intrusivas que impedían la operación escolar.

#### 2. Solución en U.E. Santa Luisa v1.0:
- **Erradicación Total de Librerías con Telemetría o Candado de Licencia**:
  - Todo el frontend fue reconstruido sobre **Nuxt 3 + Vue 3 + Tailwind CSS**.
  - La iconografía fue sustituida por un sistema nativo de trazos vectoriales **Outline SVG puros** (`fill="none" stroke="currentColor"`), sin importar paquetes pesados ni dependientes de suscripción externa.
  - El proyecto completo se publica bajo la **Licencia MIT**, garantizando soberanía institucional perpetua, código abierto y costo recurrente $0.00 en licencias.

---

### B. Incidente 2: `Failed to fetch` (Falla de Conexión en Login / APIs)

#### 1. Causa Raíz:
- El frontend intentaba comunicarse con endpoints que no respondían, sufrían problemas de resolución DNS, o eran bloqueados por políticas restrictivas de Cross-Origin Resource Sharing (CORS) mal configuradas entre el cliente y el servidor backend.

#### 2. Solución en U.E. Santa Luisa v1.0:
- **Topología de Red Interna en Docker**:
  - Tanto el frontend como el backend y la base de datos PostgreSQL conviven dentro de una misma red interna puenteada (`docker bridge network`).
  - La comunicación en producción es gestionada por un Reverse Proxy **Nginx**, el cual expone un único dominio seguro (`https://colegio.santaluisa.edu.ve`), enrutando internamente `/api/*` al backend de Express y el resto de rutas al frontend Nuxt. Esto **elimina por completo los bloqueos CORS entre dominios**.
- **Mecanismo de Reintento y Estado Offline**:
  - Se configuró un interceptor en el cliente HTTP de Vue/Nuxt con reintentos automáticos (exponential backoff) y mensajes amigables al usuario en caso de intermitencia de red local.

---

## 3. Matriz de Errores Frecuentes y Procedimientos de Resolución

| Código / Mensaje | Causa Probable | Procedimiento de Resolución Técnica |
|---|---|---|
| `ERR_CONNECTION_REFUSED` (Backend) | El contenedor de la API Express o el servicio de PostgreSQL está detenido. | 1. Ejecutar `docker compose ps` para revisar el estado del contenedor.<br/>2. Reiniciar con `docker compose restart backend`.<br/>3. Inspeccionar logs con `docker compose logs -f backend`. |
| `FATAL: password authentication failed` | Credenciales de PostgreSQL incorrectas en el archivo `.env`. | 1. Verificar variables `DB_USER`, `DB_PASSWORD` y `DB_NAME` en `.env`.<br/>2. Asegurar concordancia con los datos declarados en `docker-compose.yml`. |
| `TokenExpiredError: jwt expired` | El token JWT del usuario superó su tiempo de validez de sesión. | 1. El cliente redirige automáticamente al usuario a `/login`.<br/>2. Para ampliar la duración en entornos de oficina, ajustar la variable `JWT_EXPIRES_IN=8h` en la configuración del backend. |
| `Sum of weights must equal 100%` | El docente intentó enviar un Plan de Lapso cuyas ponderaciones no suman 100. | 1. La interfaz resalta en color rojo/ámbar la sumatoria actual.<br/>2. El docente debe recalibrar los porcentajes de cada actividad evaluativa hasta que la sumatoria sea estrictamente igual a 100%. |
| `SOLVENCY_RESTRICTION: unpaid tuition` | El representante intenta descargar la boleta oficial teniendo cuotas pendientes. | 1. No es un error técnico, sino una regla de negocio del plantel.<br/>2. El sistema muestra la notificación orientando a cancelar las cuotas en caja.<br/>3. Una vez asentado el pago en `/payments`, la restricción se levanta en tiempo real. |

---

## 4. Rutinas de Mantenimiento y Verificación de Salud (*Healthchecks*)

### A. Endpoint de Estado del Sistema
- Ruta: `GET /api/health`
- Respuesta esperada:
  ```json
  {
    "status": "healthy",
    "uptime_seconds": 86400,
    "timestamp": "2026-09-06T00:00:00.000Z",
    "database": {
      "status": "connected",
      "latency_ms": 3.2
    },
    "version": "1.0.0"
  }
  ```

### B. Respaldo Automático de Base de Datos
Para evitar cualquier pérdida de notas o matrículas, se ejecuta el siguiente cronjob nocturno diario:
```bash
# Respaldar base de datos PostgreSQL de U.E Santa Luisa a las 2:00 AM
0 2 * * * docker exec -t postgres_santa_luisa pg_dump -U postgres -d school_db | gzip > /backups/santa_luisa_db_$(date +\%Y\%m\%d).sql.gz
```
