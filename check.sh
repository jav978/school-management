#!/bin/bash

if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

echo "🔍 Verificando configuración del sistema..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado."
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi
echo "✅ npm $(npm --version)"

# Verificar PostgreSQL (Local o en Docker)
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL CLI $(psql --version)"
    if pg_isready -q; then
        echo "✅ PostgreSQL está corriendo en el host"
    fi
elif docker ps --format '{{.Names}}' | grep -qE "^(postgres_db|school_db)$"; then
    DB_CONTAINER=$(docker ps --format '{{.Names}}' | grep -E "^(postgres_db|school_db)$" | head -n 1)
    echo "✅ PostgreSQL está corriendo en Docker (Contenedor: $DB_CONTAINER, puerto 5432)"
else
    echo "❌ PostgreSQL no se detectó (ni psql local ni contenedor Docker postgres_db/school_db activo)."
    exit 1
fi

# Verificar dependencias del frontend
if [ -d "frontend/node_modules" ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "⚠️  Dependencias del frontend no instaladas. Ejecuta: cd frontend && npm install"
fi

# Verificar dependencias del backend
if [ -d "backend/node_modules" ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "⚠️  Dependencias del backend no instaladas. Ejecuta: cd backend && npm install"
fi

echo ""
echo "📋 Resumen:"
echo "  - Frontend: http://localhost:3001"
echo "  - Backend: http://localhost:3031"
echo "  - Base de datos: school_management"
echo ""
echo "🚀 Para iniciar el sistema: ./start.sh"
echo "🔄 Para resetear la base de datos: ./reset-db.sh"
echo "🌱 Para sembrar datos de ejemplo: ./seed.sh"
