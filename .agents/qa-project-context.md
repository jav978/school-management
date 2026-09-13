# QA Project Context: Sistema de Gestión Escolar (EduFlow)

## 1. Información General del Proyecto
- **Nombre**: Sistema de Gestión Escolar — U.E Colegio "Santa Luisa"
- **Propósito**: Gestión integral de procesos académicos, administrativos y financieros para instituciones educativas K-12.
- **Ambiente de Ejecución Local**:
  - Frontend: `http://localhost:3001`
  - Backend: `http://localhost:3031` (FeathersJS REST API)
  - Base de Datos: PostgreSQL (`school` schema)

## 2. Stack Tecnológico
- **Frontend**:
  - Nuxt 4 (Vue 3, Composition API)
  - Pinia para gestión de estado (`stores/auth.js`)
  - Tailwind CSS + @nuxt/ui + DaisyUI
- **Backend**:
  - Feathers.js 5 (Express, Knex.js, Socket.io)
  - Autenticación JWT local (`@feathersjs/authentication-local`)
  - PostgreSQL con migraciones y semillas Knex

## 3. Arquitectura de Calidad y Pruebas
- **Framework E2E**: Playwright (`@playwright/test`)
- **Directorio de Pruebas**: `tests/e2e/` en la raíz del proyecto
- **Configuración**: `playwright.config.ts` (Base URL: `http://localhost:3001`, headless, reportes HTML y trazas en fallo)
- **Estrategia de Autenticación en Pruebas**:
  - Helper / Fixture modular `tests/e2e/fixtures/auth.ts`
  - Credenciales semilla: `admin@santaluisa.edu.ve` / `admin123` (Admin institucional)
  - Validación de estado en `sessionStorage` y Pinia store

## 4. Áreas Críticas de Riesgo
1. **Autenticación y Control de Roles**: Redirecciones seguras según roles (Admin, Teacher, Student, Parent) y protección de rutas.
2. **Navegación e Hidratación**: Asegurar que las vistas Nuxt 4 rendericen limpiamente sin errores de consola o desincronización de sesión.
3. **Gestión de Entidades Centrales**: Aulas (`/classrooms`), Estudiantes (`/students`), Personal (`/staff`), Usuarios (`/users`).
4. **Resiliencia ante Datos Vacíos**: Manejo elegante cuando el sistema corre en modo clean-slate o con pocos registros.
