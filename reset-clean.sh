#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🔄 [EduFlow] Reseteando base de datos a estado EN FRÍO (Clean Slate)..."

# Función para ejecutar comandos SQL usando psql local o contenedor Docker
run_sql() {
  local sql="$1"
  if command -v psql &> /dev/null; then
    psql -U postgres -c "$sql"
  elif docker ps | grep -q "postgres_db"; then
    docker exec -i postgres_db psql -U postgres -c "$sql"
  else
    echo "❌ No se encontró 'psql' ni el contenedor Docker 'postgres_db'."
    exit 1
  fi
}

run_sql_file() {
  local file_path="$1"
  local db_name="$2"
  if command -v psql &> /dev/null; then
    psql -U postgres -d "$db_name" < "$file_path" > /dev/null
  elif docker ps | grep -q "postgres_db"; then
    docker exec -i postgres_db psql -U postgres -d "$db_name" < "$file_path" > /dev/null
  else
    echo "❌ No se encontró 'psql' ni el contenedor Docker 'postgres_db'."
    exit 1
  fi
}

echo "🧹 Recreando base de datos 'school_management'..."
run_sql "DROP DATABASE IF EXISTS school_management;"
run_sql "CREATE DATABASE school_management;"

echo "🏛️ Cargando esquema maestro y extensiones (docs/school_db.sql)..."
run_sql_file "$SCRIPT_DIR/docs/school_db.sql" "school_management"

# Ejecutar migraciones de Knex
echo "📦 Ejecutando migraciones de Knex..."
cd "$SCRIPT_DIR/backend"
npx knex migrate:latest

# Ejecutar únicamente la semilla en frío con el Administrador
echo "🌱 Aplicando semilla limpia (002_clean_slate.js)..."
npx knex seed:run --specific=002_clean_slate.js

echo "=========================================================="
echo "✅ Entorno en Frío Preparado Exitosamente:"
echo "   - BD: school_management (Esquema school.*)"
echo "   - Institución: U.E Colegio \"Santa Luisa\""
echo "   - Administrador: admin@santaluisa.edu.ve"
echo "   - Clave inicial: admin123"
echo "   - Registros de Alumnos/Profesores/Padres: 0 (Vacíos)"
echo "=========================================================="
