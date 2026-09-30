#!/bin/bash

# Cargar NVM si node o npm no están en PATH
if ! command -v npm &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo "🔄 Reseteando base de datos..."

run_sql() {
    local sql="$1"
    if command -v psql &> /dev/null; then
        psql -U postgres -c "$sql"
    elif docker ps --format '{{.Names}}' | grep -qE "^(postgres_db|school_db)$"; then
        local container=$(docker ps --format '{{.Names}}' | grep -E "^(postgres_db|school_db)$" | head -n 1)
        docker exec -i "$container" psql -U postgres -c "$sql"
    else
        echo "❌ No se encontró 'psql' ni contenedor Docker de PostgreSQL activo."
        exit 1
    fi
}

run_sql "DROP DATABASE IF EXISTS school_management;"
run_sql "CREATE DATABASE school_management;"

# Ejecutar migraciones
cd backend && npm run migrate

echo "✅ Base de datos reseteada exitosamente."
