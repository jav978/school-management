# 2. Technical Requirement Document (TRD)
## Sistema de Gestión Escolar Integral — U.E. Santa Luisa v1.0

---

## 1. Arquitectura General del Sistema

El sistema implementa una arquitectura desacoplada en capas (**Frontend SPA/SSR reactivo + Backend REST API modular + Base de Datos Relacional PostgreSQL 16 + Contenedores Docker**), optimizada para alta concurrencia, bajo consumo de recursos y total soberanía tecnológica (cero dependencia de plataformas de pago o licencias privativas):

```
+-------------------------------------------------------------------------------+
|                                CLIENT LAYER                                   |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                  Nuxt 3 / Vue 3 Application (SPA / SSR)               |   |
|   |  - Tailwind CSS + Glassmorphism Engine                                |   |
|   |  - Pure Outline SVG Icon System (Zero-Licensing Overhead)             |   |
|   |  - Pinia State Management (Auth, Students, Grades, Solvency, Theme)   |   |
|   |  - Native Print Engine (@media print, Vectorial Boletas & Diplomas)   |   |
|   +-----------------------------------------------------------------------+   |
+--------------------------------------||---------------------------------------+
                                       ||  HTTPS / REST API (JSON Payload)
+--------------------------------------vv---------------------------------------+
|                                GATEWAY LAYER                                  |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |           Nginx Reverse Proxy / Cloud VPS Ingress Gateway             |   |
|   |  - SSL/TLS Termination (Let's Encrypt Auto-Renew)                     |   |
|   |  - Gzip / Brotli Compression & Static Asset Caching                   |   |
|   |  - Rate Limiting & DDoS Shield                                        |   |
|   +-----------------------------------------------------------------------+   |
+--------------------------------------||---------------------------------------+
                                       ||  Internal Network (Docker Bridge)
+--------------------------------------vv---------------------------------------+
|                                BACKEND LAYER                                  |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                 Node.js / Express.js REST API Server                  |   |
|   |  - Auth & RBAC Middleware (JWT Verification & Role Gates)             |   |
|   |  - Business Services: Evaluations, Solvency, Planning, Attendance     |   |
|   |  - Grade Engine: Vigesimal (1-20) & Literal (A-E) MPPE Algorithms     |   |
|   |  - Audit & Compliance Logging Middleware                              |   |
|   |  - Multi-Currency BCV Conversion Utility                              |   |
|   +-----------------------------------------------------------------------+   |
+--------------------------------------||---------------------------------------+
                                       ||  PostgreSQL Connection Pool (pg)
+--------------------------------------vv---------------------------------------+
|                                 DATA LAYER                                    |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                      PostgreSQL 16 Database                           |   |
|   |  - Relational Schema: `school`                                        |   |
|   |  - Tables: users, students, guardians, teachers, classrooms,          |   |
|   |            subjects, plannings, evaluations, grades, report_cards,    |   |
|   |            attendance, payments, fee_concepts, audit_logs             |   |
|   |  - Automated updated_at triggers, UUID v4 keys, foreign key constraints|   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 2. Stack Tecnológico Detallado

### A. Frontend Layer
- **Framework**: [Nuxt 3](https://nuxt.com/) (v3.15+) sobre [Vue 3](https://vuejs.org/) (Composition API, `<script setup lang="ts">`).
- **CSS & Sistema de Estilos**: [Tailwind CSS](https://tailwindcss.com/) v3.4+ con utilidades personalizadas para efectos de desenfoque y profundidad (*Glassmorphism*).
- **Iconografía**: Sistema nativo de componentes y trazos vectoriales puros **Outline SVG** (`fill="none" stroke="currentColor" stroke-width="2"`), eliminando por completo cualquier dependencia externa que pueda causar bloqueos como `Invalid PrimeUI License`.
- **Gestión de Estado**: [Pinia](https://pinia.vuejs.org/) con persistencia de tokens de sesión y preferencias de interfaz (modo oscuro/claro).
- **Motor de Impresión y Documentos**: Motor CSS de impresión nativa `@media print` de alta definición para boletas y diplomas vectoriales ceremoniales, complementado con utilidades de exportación masiva a archivos `.csv` y `.xlsx`.

### B. Backend Layer
- **Runtime**: [Node.js](https://nodejs.org/) v20.x LTS.
- **Framework Web**: [Express.js](https://expressjs.com/) v4.21+ estructurado bajo el patrón de arquitectura por capas (`routes/`, `controllers/`, `services/`, `middlewares/`, `config/`).
- **Seguridad y Criptografía**:
  - `jsonwebtoken` (JWT) para emisión y verificación de tokens con tiempo de expiración configurable.
  - `bcryptjs` para hashing criptográfico de contraseñas de usuarios con factor de costo 12.
  - `helmet` para inyección de cabeceras HTTP de protección (HSTS, X-Content-Type-Options, CSP).
  - `cors` configurado restrictivamente con lista blanca de orígenes institucionales autorizados.
  - `express-rate-limit` para prevención de ataques de fuerza bruta y denegación de servicio en rutas críticas de autenticación.

### C. Base de Datos
- **Motor**: [PostgreSQL](https://www.postgresql.org/) v16.
- **Extensiones Habilitadas**: `uuid-ossp`, `pgcrypto`.
- **Conexión y Pool**: Conector nativo `pg` (node-postgres) configurado con `Pool` de conexiones reutilizables, control de timeouts y consultas parametrizadas para inmunidad contra inyecciones SQL.
- **Esquema Dedicado**: `school`, separando las tablas de la lógica del sistema de los esquemas públicos de la base de datos.

### D. Infraestructura y Despliegue
- **Contenedores**: [Docker](https://www.docker.com/) y `docker-compose` para orquestación de servicios (frontend Nuxt, backend Express y base de datos PostgreSQL).
- **Servidor Web / Reverse Proxy**: [Nginx](https://nginx.org/) para manejo de tráfico HTTPS, compresión gzip de respuestas y entrega eficiente de archivos estáticos.
- **Entorno de Producción**: VPS en la nube (Ubuntu Server 24.04 LTS), garantizando disponibilidad ininterrumpida 24/7 sin costos de licencias comerciales.

---

## 3. Especificaciones de la Lógica Académica y Evaluación (Normativa MPPE)

### A. Régimen de Educación Media General (Escala Vigesimal 1 - 20)
1. **Estructura del Año Escolar**:
   - Se divide en **Tres (3) Lapsos Académicos**.
   - Cada lapso se compone de múltiples actividades evaluativas planificadas previamente en el Plan de Evaluación Docente.
2. **Ponderaciones**:
   - Cada evaluación posee un porcentaje ponderado ($P_i \in [1, 100]$) tal que la sumatoria de ponderaciones en el lapso sea estrictamente igual al 100%: $\sum_{i=1}^{n} P_i = 100\%$.
   - La nota acumulada del lapso ($N_L$) se calcula como:
     $$N_L = \sum_{i=1}^{n} \left( \frac{\text{Calificación}_i \times P_i}{100} \right)$$
3. **Aprobación y Definitiva**:
   - Escala de notas enteras de 1 a 20 puntos.
   - Nota mínima aprobatoria: **10 puntos**.
   - Promedio definitivo anual ($N_D$): Media aritmética simple de los tres lapsos:
     $$N_D = \frac{N_{L1} + N_{L2} + N_{L3}}{3}$$
   - Regla de redondeo oficial MPPE: Todo promedio con parte decimal igual o superior a `.50` se aproxima al entero superior inmediato en la nota final definitiva.

### B. Régimen de Educación Inicial y Primaria (Escala Literal A - E)
- **A**: El estudiante alcanzó todas las competencias establecidas con rendimiento sobresaliente.
- **B**: El estudiante alcanzó la mayoría de las competencias previstas de manera satisfactoria.
- **C**: El estudiante alcanzó las competencias básicas requeridas.
- **D**: El estudiante requiere acompañamiento y refuerzo pedagógico para consolidar las competencias.
- **E**: El estudiante no alcanzó las competencias mínimas requeridas.
- Cada calificación literal va acompañada obligatoriamente de un informe descriptivo-cualitativo del docente sobre las dimensiones socioemocional, cognitiva y psicomotriz del alumno.

---

## 4. Mecanismo de Control de Solvencia Financiera

El sistema integra un mecanismo de validación de solvencia administrativa para la emisión de boletas oficiales:

1. **Estado de Solvencia del Alumno**:
   - Calculado dinámicamente comparando las cuotas mensuales devengadas a la fecha actual contra los pagos registrados y aprobados en la tabla `payments`.
   - Si existe deuda exigible: `is_solvent = false`.
2. **Puerta Lógica de Descarga de Boletas (Solvency Gate)**:
   - En el portal del Representante: Si `is_solvent === true`, el botón de descarga/impresión de la boleta oficial se encuentra activo.
   - Si `is_solvent === false`, el sistema oculta el enlace de descarga oficial y muestra una alerta institucional informativa con el detalle de las cuotas vencidas y el mensaje:
     > *"Estimado Representante: Para consultar o descargar la boleta oficial de calificaciones de su representado, le invitamos cordialmente a acudir a la oficina de Administración o Control de Estudios para la regularización de su estado de cuenta."*
3. **Privilegios Administrativos**:
   - El personal de Dirección y Control de Estudios dispone de un conmutador de visualización con auditoría que les permite consultar e imprimir la boleta en sede para fines académicos internos aun en casos de insolvencia transitoria.

---

## 5. Endpoints Clave de la API REST

| Método | Ruta | Rol Mínimo Requerido | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Autenticación de usuarios y entrega de token JWT. |
| `GET` | `/api/auth/profile` | Autenticado | Obtención de los datos del usuario en sesión actual. |
| `GET` | `/api/students` | `docente` | Listado paginado y filtrable de estudiantes activos. |
| `POST` | `/api/students` | `control_estudios` | Registro de nuevo estudiante y expediente escolar. |
| `GET` | `/api/staff` | `director` | Nómina de personal docente y administrativo. |
| `GET` | `/api/classrooms` | `docente` | Inventario de aulas, laboratorios y capacidades. |
| `GET` | `/api/plannings` | `docente` | Planes de lapso y cronogramas de evaluación docente. |
| `POST` | `/api/plannings` | `docente` | Registro de plan de evaluación (suma 100%). |
| `PUT` | `/api/plannings/:id/approve` | `director` | Aprobación directiva de la planificación pedagógica. |
| `GET` | `/api/evaluations/grades` | `docente` | Matriz de calificaciones por sección y asignatura. |
| `POST` | `/api/evaluations/grades/batch` | `docente` | Carga masiva de notas por actividad evaluativa. |
| `GET` | `/api/report-cards/:studentId` | `representante` | Consulta de boleta de lapso sujeta a verificación de solvencia. |
| `GET` | `/api/solvency/check/:studentId` | Autenticado | Verificación del estado de cuenta y mensualidades del alumno. |
| `GET` | `/api/payments` | `administracion` | Historial de pagos, ingresos y conciliación de caja. |
| `POST` | `/api/payments` | `administracion` | Registro de pago de matrícula o mensualidad escolar. |
| `GET` | `/api/reports/statistics` | `director` | KPIs consolidados de matrícula, rendimiento y género. |
