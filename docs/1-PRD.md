# 1. Product Requirement Document (PRD)
## Sistema de Gestión Escolar Integral — U.E. Santa Luisa v1.0

---

## 1. Visión General del Producto

El **Sistema de Gestión Escolar U.E. Santa Luisa v1.0** es una plataforma tecnológica integral, modular y de código abierto (Licencia MIT), diseñada específicamente para automatizar, centralizar y optimizar la administración académica, operativa y financiera de la **Unidad Educativa Santa Luisa**.

El sistema surge para responder a una necesidad crítica de la institución: sustituir sistemas comerciales privativos de alto costo de licenciamiento anual, que presentaban constantes fallas técnicas (errores de conectividad `Failed to fetch`, caídas de servidores externos y bloqueos por licencias vencidas como `Invalid PrimeUI License`), e ineficiencias graves en la gestión manual de notas, boletas y solvencias administrativas.

Desarrollado bajo estándares web modernos (**Nuxt 3, Vue 3, Express.js y PostgreSQL 16**), la plataforma proporciona una experiencia fluida, reactiva, accesible 24/7 y adaptada a la normativa legal vigente del **Ministerio del Poder Popular para la Educación (MPPE)** de la República Bolivariana de Venezuela.

---

## 2. Objetivos Principales del Sistema

1. **Cumplimiento Integral de la Normativa MPPE**:
   - Soporte nativo para doble régimen de evaluación: **Escala Vigesimal (1 a 20 puntos)** para Educación Media General y Técnica; y **Escala Literal Cualitativa (A, B, C, D, E)** con descriptores de logros para Educación Inicial y Primaria.
   - Cálculo automático de ponderaciones por corte, promedios de lapso (1°, 2° y 3° Lapso), nota definitiva de año y registro de materias pendientes o revisión.
2. **Independencia Tecnológica y Cero Costo de Licencias**:
   - Arquitectura 100% autodirigida y desplegable en contenedores **Docker**, con base de datos relacional PostgreSQL propia.
   - Eliminación total de cuotas recurrentes a proveedores de software externo y supresión de librerías con llaves de validación remota.
3. **Gestión Automatizada de Boletas y Control de Solvencia**:
   - Generación instantánea de boletas oficiales con formato ministerial, membrete institucional, sellos y firmas digitales.
   - Pasarela lógica de solvencia financiera: los representantes con mensualidades pendientes visualizan el desglose de su estado de cuenta pero tienen restringida la descarga en línea de la boleta oficial, orientándolos a regularizar su situación en Administración o Control de Estudios.
4. **Planificación Académica y Trazabilidad Docente**:
   - Carga centralizada de planes de evaluación por lapso y planificaciones semanales de clase.
   - Supervisión y aprobación en línea por parte de la Dirección y Coordinación Pedagógica antes de su aplicación en aula.
5. **Comunicación Directa y Monitoreo en Tiempo Real**:
   - Módulo de mensajería interna y notificaciones instantáneas para eventos, citaciones y circulares escolares.
   - Paneles estadísticos (KPIs) con desglose demográfico de matrícula por género, rangos de edad, distribución por sección, tasas de aprobación/reprobación y recaudación.

---

## 3. Perfiles de Usuario (User Personas)

### A. Director(a) / Subdirector(a) Académico(a)
- **Rol**: Máxima autoridad del plantel; supervisa el desempeño global de docentes y alumnos, aprueba períodos académicos y valida reportes consolidados.
- **Necesidades Clave**: Panel ejecutivo con métricas en tiempo real, auditoría de cambios en notas, visualización de planificaciones pedagógicas y emisión de certificados y diplomas con un clic.

### B. Coordinador(a) de Control de Estudios y Evaluación
- **Rol**: Responsable de la carga de matrícula, conformación de secciones, asignación de docentes guía, supervisión de fechas de cierre de lapso y emisión de documentos probatorios oficiales.
- **Necesidades Clave**: Validación de actas de notas, importación/exportación masiva en Excel/CSV, auditoría de correcciones extraordinarias de calificaciones y generación de nóminas ministeriales.

### C. Docente de Aula / Especialista
- **Rol**: Imparte asignaturas, registra la planificación pedagógica, asienta evaluaciones continuas, toma asistencia diaria y redacta observaciones cualitativas.
- **Necesidades Clave**: Interfaz intuitiva para carga rápida de calificaciones en lote, cálculo automático en tiempo real de definitivas sin errores aritméticos y acceso desde dispositivos móviles o laptops.

### D. Administrador(a) Financiero(a) y Cobranzas
- **Rol**: Registra pagos de inscripción, mensualidades y aranceles; concilia operaciones en Bolívares (VES) a tasa oficial BCV y Divisas (USD); emite solvencias.
- **Necesidades Clave**: Estado de cuenta por estudiante/representante, reporte de morosidad, emisión de recibos y activación/desactivación del bloqueo de descarga de boletas.

### E. Representante Legal / Tutor
- **Rol**: Padre, madre o responsable legal del estudiante registrado en el sistema.
- **Necesidades Clave**: Consulta del rendimiento académico de sus representados, visualización del récord de asistencia, notificaciones institucionales y consulta de estados de pago con opciones de reporte de transferencia/pago móvil.

### F. Estudiante
- **Rol**: Alumno de Educación Primaria o Media General.
- **Necesidades Clave**: Consulta de su horario semanal, calificaciones publicadas por lapso y calendario de evaluaciones programadas.

---

## 4. Requerimientos Funcionales por Módulo

| # | Módulo | Funcionalidades Clave |
|---|---|---|
| **01** | **Autenticación y Seguridad (RBAC)** | Login seguro con JWT y contraseñas hasheadas en Argon2/Bcrypt; roles granulares (`superadmin`, `director`, `control_estudios`, `docente`, `administracion`, `representante`, `estudiante`); cierre por inactividad. |
| **02** | **Estudiantes y Matrícula** | Registro de ficha acumulativa del estudiante, datos antropométricos, antecedentes médicos, asignación a año escolar y sección, carga de documentos de identidad. |
| **03** | **Representantes y Núcleo Familiar** | Vinculación de uno o más estudiantes a un representante principal y suplente; registro de parentesco, datos de contacto y dirección domiciliaria. |
| **04** | **Personal Docente y Administrativo (Staff)** | Gestión de nómina de profesores, credenciales académicas, asignación de carga horaria, estatus laboral (`activo`, `licencia`, `retirado`) y ficha de emergencia. |
| **05** | **Aulas y Espacios Físicos** | Catálogo de aulas regulares, laboratorios de ciencias/computación, biblioteca y canchas deportivas, con control de capacidad física y ubicación por piso/edificio. |
| **06** | **Asignaturas y Malla Curricular** | Estructura curricular oficial del MPPE por niveles (Inicial, Primaria, Media General), códigos de materia, horas académicas semanales y prelaciones. |
| **07** | **Horarios y Carga Horaria** | Constructor visual de horarios semanales por sección y docente, con detección automática de choques o solapamiento de horas y espacios físicos. |
| **08** | **Planificación Curricular** | Registro de Planes de Lapso y Planes de Evaluación docente (contenidos, estrategias, instrumentos, fechas y ponderaciones % hasta sumar exactamente 100%). |
| **09** | **Evaluación y Calificaciones** | Carga de notas por actividad evaluativa; soporte para escala vigesimal (1-20) y escala literal (A-E); cálculo automático de notas de corte, promedio de lapso y nota final de curso. |
| **10** | **Asistencia y Convivencia Escolar** | Registro diario de asistencia (`presente`, `ausente`, `justificado`, `retraso`), cómputo del porcentaje de inasistencias y registro de incidencias disciplinarias. |
| **11** | **Boletas de Calificaciones** | Generación de boletas oficiales vectoriales en formato PDF/imprimible con diseño ceremonial institucional, membrete MPPE y código QR de validación. |
| **12** | **Pasarela de Solvencia Administrativa** | Restricción lógica automática de descarga de boleta para representantes morosos; visualización de deuda pendiente y orientación para regularización presencial. |
| **13** | **Certificados y Reconocimientos** | Emisión de Diplomas de Honor, Reconocimientos al Mérito y Constancias de Estudio en orientación horizontal con marco perimetral geométrico, medalla y sello dorado. |
| **14** | **Cobranzas y Finanzas Escolares** | Control de pagos de colegiatura, inscripción y aranceles; soporte bimoneda (USD y VES a tasa oficial BCV); emisión de recibos y cierres de caja. |
| **15** | **Comunicaciones y Notificaciones** | Bandeja de mensajes directos, circulares institucionales, notificaciones en campana de alertas y bitácora de eventos relevantes del colegio. |
| **16** | **Reportes Ejecutivos y Analítica** | Exportación a Excel/CSV de listados de estudiantes, consolidados de notas por sección, reportes de morosidad y estadísticas demográficas por género y edad. |

---

## 5. Requerimientos No Funcionales

### A. Rendimiento y Escalabilidad
- Tiempo de respuesta de endpoints de la API inferior a 250 ms en percentil 95 (p95) para consultas habituales.
- Carga de interfaces web en menos de 1.2 segundos en conexiones locales o residenciales.
- Capacidad para atender de manera concurrente a más de 1,200 estudiantes matriculados, 80 docentes y 1,000 representantes.

### B. Seguridad y Privacidad de Datos
- Almacenamiento seguro de credenciales con hashing unidireccional de alto costo computacional.
- Headers HTTP protegidos mediante políticas de seguridad (`Helmet`, `CORS` restringido a orígenes autorizados, protección `XSS` y `Content-Security-Policy`).
- Registro inmutable de auditoría (`audit_logs`) para toda modificación o anulación de calificaciones, registrando ID de usuario, dirección IP, fecha/hora y valor anterior/nuevo.

### C. Disponibilidad y Resiliencia
- Disponibilidad objetivo del 99.8% durante períodos ordinarios y 99.95% durante semanas críticas de entrega de notas e inscripción.
- Respaldo automatizado diario de la base de datos PostgreSQL mediante cronjob encriptado y respaldos semanales fuera de sitio.

### D. Usabilidad y Accesibilidad
- Diseño responsivo adaptado a computadoras de escritorio, laptops educativas (Canaima), tablets y teléfonos inteligentes.
- Soporte para Tema Oscuro (*Dark Slate*) y Tema Claro (*Crisp Clean*), con contraste de color conforme a los estándares WCAG 2.1 AA.
- Iconografía técnica basada en trazos vectoriales puros (SVG sin relleno), garantizando nitidez absoluta en pantallas de alta densidad (Retina).

---

## 6. Métricas de Éxito (KPIs de Producto)

| Métrica | Situación Anterior (Comercial / Manual) | Meta con Sistema U.E. Santa Luisa |
|---|---|---|
| **Tiempo de emisión de boletas de lapso** | 8 a 12 días continuos de cálculo manual en papel/Excel. | Inmediato (< 5 segundos por sección completa). |
| **Tasa de error en promedios y definitivas** | 8% - 15% de actas con errores de redondeo o suma. | 0.0% (cálculo algorítmico determinístico validado). |
| **Gasto anual recurrente en licencias de software** | $1,200 – $2,500 USD anuales con fallos de soporte. | $0.00 USD (Software Institucional Libre bajo MIT). |
| **Cobranza oportuna y control de morosidad** | Retraso de hasta 45 días por falta de cruce de datos. | Aumento del 35% en cobros gracias al gate de solvencia. |
| **Consultas presenciales en Control de Estudios** | Colas de 50+ representantes diarios en cierre de lapso. | Reducción del 75% gracias al portal de autoservicio web. |
