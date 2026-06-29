# Contribuir al Sistema de Gestión Escolar

¡Gracias por tu interés en contribuir! Este documento te guiará a través del proceso.

## Cómo Contribuir

### 1. Reportar Bugs
- Usa el template de bug report
- Incluye pasos para reproducir
- Agrega capturas de pantalla si es posible

### 2. Sugerir Funcionalidades
- Usa el template de feature request
- Explica el problema que resuelve
- Describe la solución propuesta

### 3. Enviar Código
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Guías de Estilo

### Código
- Usa 2 espacios para indentar
- Usa comillas simples
- No uses punto y coma
- Sigue las guías de ESLint

### Commits
- Usa inglés
- Usa formato convencional
- Ejemplos:
  - `feat: add new feature`
  - `fix: fix bug`
  - `docs: update documentation`
  - `style: format code`
  - `refactor: refactor code`
  - `test: add tests`
  - `chore: update dependencies`

### Pull Requests
- Usa el template de PR
- Incluye descripción de los cambios
- Agrega capturas de pantalla si es necesario
- Asegúrate de que las pruebas pasen

## Desarrollo Local

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/schoolms/school-management.git

# Instalar dependencias
npm run install:all

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migrate

# Iniciar desarrollo
npm run dev
```

### Pruebas
```bash
# Ejecutar pruebas
npm test

# Ejecutar linter
npm run lint
```

## Preguntas

Si tienes preguntas, abre un issue o únete a nuestras [Discussions](https://github.com/schoolms/school-management/discussions).
