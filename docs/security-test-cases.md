# Matriz de Gestión de Casos de Prueba de Seguridad (Test Case Management)

Este documento especifica los casos de prueba de seguridad formales para el Sistema de Gestión Escolar (U.E Santa Luisa), cubriendo el control estricto de sesión, concurrencia, protección de rutas, escalamiento de privilegios e inyecciones SQL.

---

## Matriz de Trazabilidad de Requisitos

| Requisito | Descripción | Casos de Prueba Asociados | Estado |
| :--- | :--- | :--- | :--- |
| **REQ-SEC-01** | Bloqueo ineludible de rutas protegidas sin credenciales válidas | `TC-SEC-01` | Automatizado |
| **REQ-SEC-02** | Sesión Única Activa (Kick-out automático de sesión concurrente) | `TC-SEC-02` | Automatizado |
| **REQ-SEC-03** | Cierre de navegador y destrucción de sesión efímera | `TC-SEC-03` | Automatizado |
| **REQ-SEC-04** | Prevención de escalamiento de privilegios (`PATCH /users/:id`) | `TC-SEC-04` | Automatizado |
| **REQ-SEC-05** | Blindaje y autenticación en servicios backend huérfanos | `TC-SEC-05` | Automatizado |
| **REQ-SEC-06** | Sanitización de consultas y resistencia a SQL/NoSQL Injection | `TC-SEC-06` | Automatizado |

---

## Casos de Prueba de Seguridad

### TC-SEC-01: Bloqueo de Acceso Directo a Rutas Protegidas sin Sesión
- **ID:** `TC-SEC-01`
- **Prioridad:** Crítica (P1)
- **Categoría:** Autenticación y Autorización
- **Precondiciones:** El navegador o cliente HTTP no posee tokens ni cookies de sesión activas.
- **Datos de Prueba:**
  - URL Destino: `http://localhost:3001/dashboard`
- **Pasos:**
  1. Abrir un contexto de navegación limpio.
  2. Navegar directamente a la URL `/dashboard`.
  3. Esperar la resolución del middleware de rutas de Nuxt.
- **Resultado Esperado:**
  - La navegación es interceptada.
  - El usuario es redirigido a `/auth/login?redirect=%2Fdashboard`.
  - No se renderiza ningún componente del Dashboard ni información sensible.

---

### TC-SEC-02: Control de Sesión Única Activa (Expulsión Concurrente / Kick-Out)
- **ID:** `TC-SEC-02`
- **Prioridad:** Crítica (P1)
- **Categoría:** Concurrencia de Sesiones
- **Precondiciones:** Usuario con credenciales válidas en la base de datos (`admin@santaluisa.edu.ve`).
- **Datos de Prueba:**
  - Contexto A: Navegador 1
  - Contexto B: Navegador 2
- **Pasos:**
  1. Iniciar sesión en el Contexto A con las credenciales de Administrador.
  2. Verificar que el Contexto A ingresa exitosamente al `/dashboard` y puede consultar datos.
  3. En un Contexto B independiente, iniciar sesión con la misma cuenta.
  4. Verificar que el Contexto B obtiene una sesión activa única (`session_id` nuevo en `school.user_sessions`).
  5. Regresar al Contexto A y realizar una petición autenticada (o recargar la página).
- **Resultado Esperado:**
  - El backend detecta que la sesión del Contexto A fue invalidada (`is_active = false`).
  - La petición del Contexto A responde `401 NotAuthenticated` con mensaje explicativo.
  - El Frontend limpia el almacenamiento del Contexto A y lo redirige forzosamente a `/auth/login`.

---

### TC-SEC-03: Cierre de Navegador y Destrucción de Sesión Efímera
- **ID:** `TC-SEC-03`
- **Prioridad:** Alta (P2)
- **Categoría:** Gestión de Ciclo de Vida de Tokens
- **Precondiciones:** Usuario inició sesión en una ventana de navegador.
- **Datos de Prueba:** Token JWT y cookie `session_token` sin `max-age`.
- **Pasos:**
  1. Iniciar sesión en el sistema.
  2. Simular el cierre total del navegador (destrucción de cookies de sesión sin persistencia).
  3. Abrir una nueva instancia del navegador intentando acceder a `/dashboard` o `/`.
- **Resultado Esperado:**
  - Al no existir la cookie de sesión efímera, `checkAuth()` limpia cualquier residuo local.
  - La aplicación redirige a `/auth/login`.
  - No se permite el reingreso automático al sistema.

---

### TC-SEC-04: Prevención de Escalamiento de Privilegios vía `PATCH /users/:id`
- **ID:** `TC-SEC-04`
- **Prioridad:** Crítica (P1)
- **Categoría:** Control de Acceso Basado en Roles (RBAC)
- **Precondiciones:** Usuario autenticado con rol estándar (ej. `teacher` o `student`).
- **Datos de Prueba:**
  - Payload Malicioso: `{ "role": "admin", "user_type": "admin" }`
- **Pasos:**
  1. Autenticar un usuario con rol de docente o estudiante.
  2. Enviar una petición `PATCH /users/:id` con el payload malicioso intentando elevar privilegios.
  3. Consultar el registro del usuario en la base de datos o mediante `GET /authentication`.
- **Resultado Esperado:**
  - El hook `sanitizeUserUpdate` intercepta y elimina los campos protegidos (`role`, `user_type`).
  - El rol del usuario permanece inalterado.
  - No ocurre escalamiento de privilegios.

---

### TC-SEC-05: Blindaje de Servicios Backend Huérfanos
- **ID:** `TC-SEC-05`
- **Prioridad:** Alta (P2)
- **Categoría:** Seguridad de APIs REST
- **Precondiciones:** Peticiones HTTP directas sin cabecera `Authorization`.
- **Datos de Prueba:**
  - Endpoints: `GET /settings`, `POST /uploads/avatar`, `POST /enrollment-pdf`, `GET /messages`.
- **Pasos:**
  1. Realizar una petición a cada uno de los endpoints sin incluir token de autenticación.
  2. Validar el código de respuesta HTTP.
- **Resultado Esperado:**
  - Todos los endpoints rechazan la solicitud con código `401 NotAuthenticated`.
  - Ninguna acción ni lectura de información es permitida sin token válido.

---

### TC-SEC-06: Resistencia contra Inyección de Parámetros y SQL/NoSQL Injection
- **ID:** `TC-SEC-06`
- **Prioridad:** Alta (P2)
- **Categoría:** Integridad de Datos e Inyección
- **Precondiciones:** Endpoint con parámetros de consulta (`GET /students`, `GET /grades`).
- **Datos de Prueba:**
  - `$limit=99999999`
  - `$sort[--DROP TABLE]=1`
  - `$where=malicious_code`
  - `__proto__[polluted]=true`
- **Pasos:**
  1. Enviar solicitudes con parámetros maliciosos y de desbordamiento de paginación.
  2. Verificar la respuesta del middleware `querySanitizer`.
- **Resultado Esperado:**
  - Claves peligrosas (`__proto__`, `$where`) son eliminadas.
  - El parámetro `$limit` es acotado a un máximo seguro de 100.
  - No se produce ningún error de sintaxis SQL en PostgreSQL ni ejecución de consultas no autorizadas.
