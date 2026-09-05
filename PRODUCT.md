# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary User**: Administrative staff and school leadership (dirección académica y administrativa, secretaría, coordinadores). They operate in high-density office and desktop environments managing admissions, student dossiers, teacher assignments, class schedules, attendance tracking, tuition billing, and school-wide reporting.
- **Secondary Users**:
  - **Teachers (Profesores)**: Daily logging of attendance, evaluations (exams, assignments, projects), and course grading rosters.
  - **Parents & Guardians (Padres y Tutores)**: Access to academic progress, attendance records, circulars/communications, and tuition payment balances.
  - **Students (Estudiantes)**: Consultation of grades, class schedules, homework, and institutional announcements.

## Product Purpose

A unified, centralized web application for managing academic, operational, and financial workflows in a medium-sized K-12 educational institution (200–1000 students). Success means eliminating fragmented spreadsheets and manual paper processes, reducing administrative friction, and providing real-time visibility into student academic performance, attendance records, and tuition statuses.

## Positioning

Tailored specifically for Spanish-speaking K-12 private or subsidized educational institutions, adhering to standard regional academic terms (grados, secciones, bimestres/trimestres, matrículas, cuotas) with dense, practical operational workflows rather than generic enterprise HR/ERP bloat.

## Operating Context

- Used predominantly on desktop monitors and laptops in administrative offices, with mobile and tablet access for teachers taking roll call in classrooms and parents checking reports.
- Core seasonal rituals: school year enrollment and matriculation, period-based grading closures, monthly payment collections, and official report card (boletines) issuance.

## Capabilities and Constraints

- **Confirmed Modules**:
  - Dashboard with summary KPIs, recent activities, and demographic charts.
  - Student Information System (SIS): complete student profile dossiers, academic history, family/guardian contact info.
  - Teacher Management: profiles, assigned subjects, and teaching schedules.
  - Gradebook (Calificaciones): evaluations breakdown (exam, assignment, project, quiz) with weighted averages and distribution.
  - Attendance Tracking (Asistencia): daily status records (presente, ausente, tardanza, justificado) and aggregate attendance metrics.
  - Schedule Management (Horarios): weekly timetable views organized by grade/section and classroom.
  - Financial Management (Finanzas): tuition & payment tracking (pagado, pendiente, vencido), receipt generation, and balance statements.
  - Communications: internal messaging, announcements, and notices.
  - Reports & Analytics: academic performance, attendance summaries, and exportable financial summaries.
- **Technical Stack**:
  - Frontend: Nuxt 4 (Vue 3, Composition API), Pinia, Tailwind CSS, Nuxt UI, DaisyUI.
  - Backend: Feathers.js 5 REST & WebSocket services, Knex.js query builder, PostgreSQL database.
  - Auth: JWT authentication with role-based access control (Admin, Profesor, Estudiante, Padre).
- **Constraints**: Single-institution deployment model; multi-tenancy is not required at this stage.

## Product Principles

1. **Operational Density & Clarity**: Administrative staff manage high volumes of tabular data (students, grades, payments). Interfaces must prioritize scanability, keyboard efficiency, and compact layouts without visual clutter.
2. **Role-Appropriate Depth**: Admins need full oversight and batch editing; teachers need fast, friction-free daily inputs; parents and students need clear, high-legibility progress summaries.
3. **Data Integrity & Traceability**: Critical records (grades, payments, attendance history) must be accurate, transparent, and verifiable.
4. **Resilient Offline/Local Performance**: Fast interactions and instant UI updates even on standard school network connections.
