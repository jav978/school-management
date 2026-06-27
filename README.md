# Sistema de Gestión Escolar

Sistema web completo para gestión escolar con Nuxt.js 3, Feathers.js, PostgreSQL y Tailwind CSS.

## Características

- **Gestión de Estudiantes**: Registro, matrícula y expedientes
- **Gestión de Profesores**: Perfiles, asignaturas y horarios
- **Calificaciones**: Sistema de evaluaciones y boletines
- **Control de Asistencia**: Registro diario por clase
- **Gestión Financiera**: Pagos, colegiaturas y facturación
- **Comunicación**: Mensajería y notificaciones
- **Horarios**: Gestión de horarios escolares
- **Reportes**: Estadísticas e informes

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación de PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (con Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Descargar e instalar desde: https://www.postgresql.org/download/windows/

## Instalación

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Configuración de Base de Datos

1. Crear base de datos PostgreSQL:
```sql
CREATE DATABASE school_management;
```

2. Configurar variables en `backend/.env`:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/school_management
JWT_SECRET=tu-secreto-jwt
```

3. Ejecutar migraciones:
```bash
cd backend
npm run migrate
```

## Estructura del Proyecto

```
school-management/
├── frontend/          # Nuxt.js 3 + Tailwind
│   ├── components/    # Componentes Vue
│   ├── pages/         # Páginas del sistema
│   ├── stores/        # Pinia stores
│   └── layouts/       # Layouts
├── backend/           # Feathers.js
│   ├── src/
│   │   ├── services/  # Servicios REST
│   │   └── hooks/     # Hooks de Feathers
│   └── migrations/    # Migraciones PostgreSQL
└── docs/              # Documentación
```

## Módulos

### 1. Dashboard
- Estadísticas generales
- Gráficos de rendimiento
- Actividad reciente

### 2. Estudiantes
- CRUD completo
- Búsqueda y filtros
- Expediente académico

### 3. Profesores
- Gestión de personal
- Asignación de materias
- Horarios individuales

### 4. Calificaciones
- Registro de evaluaciones
- Boletines de notas
- Promedios por periodo

### 5. Asistencia
- Control diario
- Estados: presente, ausente, tardanza, justificado
- Reportes mensuales

### 6. Horarios
- Horarios por grado
- Asignación de aulas
- Vista semanal

### 7. Finanzas
- Colegiaturas y pagos
- Estado de cuenta
- Facturación

### 8. Comunicación
- Mensajería interna
- Anuncios
- Notificaciones

### 9. Reportes
- Rendimiento académico
- Asistencia general
- Estado financiero
- Exportación PDF/Excel

## Roles de Usuario

- **Admin**: Acceso completo al sistema
- **Profesor**: Gestión de clases y calificaciones
- **Estudiante**: Consulta de notas y horarios
- **Padre**: Consulta de información del estudiante

## Tecnologías

- **Frontend**: Nuxt.js 3, Vue 3, Tailwind CSS, Pinia
- **Backend**: Feathers.js 5, Node.js
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT con Feathers Auth

## Desarrollo

### Frontend
```bash
cd frontend
npm run dev
```
Disponible en: http://localhost:3000

### Backend
```bash
cd backend
npm run dev
```
Disponible en: http://localhost:3030

## Producción

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## Próximos Pasos

- [ ] Autenticación completa con roles
- [ ] API REST completa
- [ ] Pruebas unitarias
- [ ] Documentación API
- [ ] Deploy en producción
