# 4. App Flow & User Navigation
## Sistema de Gestión Escolar Integral — U.E. Santa Luisa v1.0

---

## 1. Mapa de Navegación General del Sistema

```mermaid
graph TD
    Start([Usuario abre el Sistema]) --> CheckAuth{¿Sesión activa con token JWT?}
    
    CheckAuth -- No --> LoginScreen[/login/]
    LoginScreen -->|Ingresa credenciales válidas| ValidateRole{Identificación de Rol}
    
    CheckAuth -- Sí --> ValidateRole
    
    ValidateRole --> MainLayout[Layout Principal - Sidebar, Header & Footer]
    
    subgraph Módulo Académico
        MainLayout --> Dashboard[/dashboard/]
        MainLayout --> Students[/students - Expedientes de Estudiantes/]
        MainLayout --> Staff[/staff - Nómina Docente y Administrativa/]
        MainLayout --> Classrooms[/classrooms - Aulas y Espacios Físicos/]
        MainLayout --> Schedules[/schedules - Horarios Semanales/]
        MainLayout --> Planning[/planning - Planificación Curricular y Planes de Lapso/]
        MainLayout --> Evaluations[/evaluations - Carga de Calificaciones y Cortes/]
        MainLayout --> Attendance[/attendance - Asistencia Diaria y Convivencia/]
    end

    subgraph Evaluación y Certificación
        MainLayout --> ReportCards[/report-cards - Boletas de Calificaciones/]
        MainLayout --> Certificates[/certificates - Diplomas y Reconocimientos/]
    end

    subgraph Administración y Operaciones
        MainLayout --> Solvency[/solvency - Control de Solvencia Escolar/]
        MainLayout --> Payments[/payments - Cobranzas y Caja Escolar/]
        MainLayout --> Messaging[/messaging - Mensajería Interna y Circulares/]
        MainLayout --> Reports[/reports - Reportes Estadísticos y Demografía/]
        MainLayout --> Settings[/settings - Configuración del Plantel/]
    end
```

---

## 2. Flujo Operativo: Registro y Planificación Curricular del Docente

```mermaid
sequenceDiagram
    autonumber
    actor Docente
    actor Coordinador as Coordinación Pedagógica / Dirección
    participant App as Frontend (Nuxt 3)
    participant API as Backend (Express REST API)
    participant DB as PostgreSQL 16

    Note over Docente, Coordinador: FASE 1: CARGA DE PLAN DE EVALUACIÓN
    Docente->>App: Accede a /planning y selecciona Año, Sección y Asignatura
    Docente->>App: Define actividades de evaluación con criterios, fechas y porcentajes (%)
    App->>App: Valida en tiempo real que la suma de ponderaciones sea exactamente 100%
    Docente->>App: Clic en "Enviar Plan para Aprobación"
    App->>API: POST /api/plannings
    API->>DB: Almacena plan en estado 'pendiente_aprobacion'
    API-->>App: Confirmación de recepción exitosa

    Note over Coordinador, DB: FASE 2: REVISIÓN Y APROBACIÓN
    Coordinador->>App: Revisa los planes pendientes en su bandeja
    Coordinador->>App: Valida pertinencia pedagógica y aprueba
    App->>API: PUT /api/plannings/:id/approve
    API->>DB: Actualiza status a 'aprobado'
    API-->>App: Notificación push/in-app al Docente

    Note over Docente, DB: FASE 3: ASENTAMIENTO DE CALIFICACIONES
    Docente->>App: Accede a /evaluations con el plan ya aprobado
    Docente->>App: Ingresa notas por estudiante en escala 1-20 (o A-E)
    App->>App: Calcula en vivo el corte del lapso y acumulado
    Docente->>App: Clic en "Guardar Calificaciones"
    App->>API: POST /api/evaluations/grades/batch
    API->>DB: Inserta calificaciones en tabla `grades` y registra en `audit_logs`
    API-->>App: Confirmación de guardado seguro
```

---

## 3. Flujo Operativo: Emisión de Boletas y Puerta de Solvencia Administrativa

Este flujo resuelve uno de los requerimientos clave de la institución: garantizar el control de la cobranza escolar sin comprometer el registro pedagógico de las notas.

```mermaid
sequenceDiagram
    autonumber
    actor Representante
    actor Admin as Administración / Caja
    participant App as Frontend (Nuxt 3)
    participant API as Backend (Express REST API)
    participant DB as PostgreSQL 16

    Representante->>App: Inicia sesión y accede a /report-cards
    Representante->>App: Selecciona el estudiante y el lapso a consultar
    App->>API: GET /api/solvency/check/:studentId
    API->>DB: Consulta cuotas vencidas vs pagos aprobados en tabla `payments`
    
    alt Caso 1: Estudiante Solvente (is_solvent == true)
        DB-->>API: 0 cuotas vencidas pendientes
        API-->>App: Retorna { is_solvent: true }
        App->>API: GET /api/report-cards/:studentId?lapso=1
        API->>DB: Recupera notas, promedios y observaciones cualitativas
        DB-->>API: Datos académicos consolidados
        API-->>App: Payload de boleta
        App->>Representante: Muestra Boleta Oficial completa con botón "Descargar PDF / Imprimir"
        Representante->>App: Descarga boleta ceremonial con membrete y código QR
    else Caso 2: Estudiante Insolvente (is_solvent == false)
        DB-->>API: 2 cuotas pendientes (Ej: Mensualidades Mayo y Junio)
        API-->>App: Retorna { is_solvent: false, pending_debt: [...] }
        App->>Representante: Muestra Estado de Cuenta y Alerta Institucional:
        Note over App, Representante: "Boleta retenida por mensualidades pendientes.<br/>Acuda a Administración para regularizar."
        Representante->>Admin: Se presenta en taquilla de Administración y realiza pago
        Admin->>App: Registra pago en /payments (Transferencia/Efectivo)
        App->>API: POST /api/payments
        API->>DB: Registra pago y marca cuotas como 'pagado'
        API-->>App: Solvencia actualizada inmediatamente
        App->>Representante: Al recargar, la boleta queda desbloqueada para descarga
    end
```

---

## 4. Flujo Operativo: Emisión de Diplomas y Certificados Oficiales

```mermaid
sequenceDiagram
    autonumber
    actor Directivo as Director / Control de Estudios
    participant App as Frontend (Nuxt 3)
    participant API as Backend (Express REST API)
    participant DB as PostgreSQL 16

    Directivo->>App: Ingresa a /certificates
    Directivo->>App: Selecciona tipo de documento (Diploma de Honor, Reconocimiento, Constancia)
    Directivo->>App: Selecciona Sección y Alumno con promedio destacado
    App->>API: GET /api/students/:id/certificate-data
    API->>DB: Consulta récord académico, mención de honor y datos institucionales
    DB-->>API: Retorna información del alumno y promedio
    API-->>App: Rellena lienzo ceremonial horizontal
    App->>Directivo: Renderiza vista previa con marco perimetral dorado, sello y código QR
    Directivo->>App: Clic en "Imprimir / Guardar en PDF"
    App->>Directivo: Dispara ventana de impresión nativa (@media print) con alta resolución vectorial
```
