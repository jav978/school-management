# 6. Implementation Plan & Delivery Roadmap
## Sistema de Gestión Escolar Integral — U.E. Santa Luisa v1.0

---

## 1. Fases de Desarrollo Ejecutadas y Estado Actual

```
+-------------------------------------------------------------------------------+
|  FASE 1: ARQUITECTURA BASE Y CONTENERIZACIÓN DOCKER          [COMPLETADO]   |
|  - Configuración del stack Nuxt 3 + Express.js + PostgreSQL 16.               |
|  - Orquestación mediante Docker Compose y red interna puenteada.              |
|  - Definición del esquema relacional `school` con extensiones UUID v4.        |
+-------------------------------------------------------------------------------+
|  FASE 2: GESTIÓN DE MATRÍCULA Y ESTRUCTURA ESCOLAR           [COMPLETADO]   |
|  - Módulos de Estudiantes (/students), Representantes y Personal (/staff).    |
|  - Catálogo de Aulas y Laboratorios (/classrooms) con control de aforo.       |
|  - Malla curricular y carga horaria semanal adaptada a normas del MPPE.      |
+-------------------------------------------------------------------------------+
|  FASE 3: MOTOR DE EVALUACIÓN Y PLANIFICACIÓN PEDAGÓGICA      [COMPLETADO]   |
|  - Módulo de Planificación (/planning) con regla estricta de suma 100%.       |
|  - Motor de notas (/evaluations): Vigesimal (1-20) y Literal (A-E).           |
|  - Asistencia diaria (/attendance) y cómputo de porcentaje de faltas.         |
+-------------------------------------------------------------------------------+
|  FASE 4: BOLETAS OFICIALES Y CONTROL DE SOLVENCIA           [COMPLETADO]   |
|  - Emisión de Boletas Oficiales (/report-cards) con membrete y código QR.     |
|  - Puerta lógica de solvencia financiera (bloqueo en línea de morosos).       |
|  - Diplomas de Excelencia (/certificates) en lienzo ceremonial horizontal.   |
+-------------------------------------------------------------------------------+
|  FASE 5: REFACTORIZACIÓN UI/UX Y SOBERANÍA TECNOLÓGICA       [COMPLETADO]   |
|  - Eliminación absoluta de librerías comerciales con licencias privativas.     |
|  - Iconografía estandarizada en trazos vectoriales Outline SVG sin relleno.   |
|  - Layout maestro con Header interactivo, Versión 1.0.0 y Footer institucional|
|    atribuido al desarrollador José Vásquez (jvasquez@santaluisa.edu.ve).     |
+-------------------------------------------------------------------------------+
|  FASE 6: MIGRACIÓN DE DATOS Y DESPLIEGUE EN VPS NUBE         [EN PROCESO]    |
|  - Ingesta por lotes mediante plantillas estructuradas de Excel / CSV.        |
|  - Puesta en producción en servidor VPS en la nube accesible 24/7.            |
|  - Jornadas de capacitación para personal docente y administrativo.           |
+-------------------------------------------------------------------------------+
```

---

## 2. Estrategia de Migración de Datos Históricos (Excel / CSV)

Para garantizar una transición inmediata desde los antiguos archivos manuales y hojas de cálculo hacia la nueva base de datos PostgreSQL, se dispone de un pipeline de ingesta automatizado:

### A. Plantillas de Carga Masiva
1. **`plantilla_estudiantes.xlsx`**:
   - Cédula de Identidad / Escolar, Nombres, Apellidos, Fecha de Nacimiento (YYYY-MM-DD), Género (M/F), Nivel, Año/Grado, Sección (A, B, C, D), Tipo de Sangre, Cédula del Representante.
2. **`plantilla_representantes.xlsx`**:
   - Cédula, Nombres, Apellidos, Teléfono Principal, Correo Electrónico, Dirección de Habitación, Parentesco (Padre, Madre, Abuelo, Tutor Legal).
3. **`plantilla_docentes.xlsx`**:
   - Cédula, Nombres, Apellidos, Título Profesional, Teléfono, Correo, Especialidad / Asignaturas a impartir.

### B. Proceso de Carga y Validación
- El script de migración valida unicidad de cédulas, existencia previa de grados y secciones, y genera automáticamente las cuentas de usuario (`users`) asignando contraseñas temporales forzando el cambio en el primer inicio de sesión.

---

## 3. Plan de Capacitación y Adopción Institucional

| Taller / Sesión | Audiencia | Duración | Temario Principal |
|---|---|---|---|
| **Taller 1: Inducción Docente** | Todo el cuerpo de profesores | 2.5 Horas | Carga de Planes de Lapso (100%), registro de notas continuas por corte, asistencia y observaciones pedagógicas. |
| **Taller 2: Control de Estudios** | Coordinación y Secretaría | 3.0 Horas | Asignación de secciones, matrícula inicial, validación de actas, cierre de lapsos escolares y emisión de boletas. |
| **Taller 3: Caja y Administración** | Personal de Cobranzas | 2.0 Horas | Registro de transferencias y pagos móviles, actualización de tasas BCV, arqueos diarios y gestión del gate de solvencia. |
| **Taller 4: Socialización a Familias** | Padres y Representantes | 1.0 Hora (Virtual) | Acceso al portal familiar, consulta de asistencia, verificación de estados de pago y descarga de boletas oficiales. |

---

## 4. Matriz de Verificación y Control de Calidad

| ID | Caso de Prueba | Criterio de Éxito Esperado | Estado |
|---|---|---|---|
| **CP-01** | Autenticación y Guards de Ruta | Redirección inmediata a `/login` si no hay token JWT válido; bloqueo de rutas directivas para rol estudiante. | APROBADO |
| **CP-02** | Cómputo de Definitivas MPPE | Promedio exacto ponderado de evaluaciones; cálculo correcto de definitiva de lapso y redondeo oficial ministerial. | APROBADO |
| **CP-03** | Gate de Solvencia Financiera | Alumno con deuda: boleta bloqueada en portal familiar; Alumno solvente: botón de descarga activo. | APROBADO |
| **CP-04** | Generación de Diplomas | Renderizado nítido en formato horizontal con marco ceremonial, sello dorado y código QR verificable. | APROBADO |
| **CP-05** | Responsividad y Temas | Alternancia fluida entre Modo Oscuro y Modo Claro sin pérdida de contraste en textos o tablas. | APROBADO |
| **CP-06** | Independencia de Licencias | Cero llamadas a servidores externos de validación; ausencia total de alertas `Invalid License` en consola. | APROBADO |
