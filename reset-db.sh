#!/bin/bash

echo "🔄 Reseteando base de datos..."

# Eliminar y recrear la base de datos
psql -U postgres -c "DROP DATABASE IF EXISTS school_management;"
psql -U postgres -c "CREATE DATABASE school_management;"

# Ejecutar migraciones
cd backend && npm run migrate

echo "✅ Base de datos reseteada exitosamente."
