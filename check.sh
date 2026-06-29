#!/bin/bash

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

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado."
    exit 1
fi
echo "✅ PostgreSQL $(psql --version)"

# Verificar si PostgreSQL está corriendo
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL no está corriendo."
else
    echo "✅ PostgreSQL está corriendo"
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
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:3030"
echo "  - Base de datos: school_management"
echo ""
echo "🚀 Para iniciar el sistema: ./start.sh"
echo "🔄 Para resetear la base de datos: ./reset-db.sh"
echo "🌱 Para sembrar datos de ejemplo: ./seed.sh"
