#!/bin/bash

echo "🛑 Deteniendo Sistema de Gestión Escolar..."

# Matar procesos de Node.js
pkill -f "node"
pkill -f "npm"

# Detener contenedores de Docker si docker compose está disponible
if command -v docker &> /dev/null; then
    echo "🐋 Deteniendo contenedores de Docker..."
    docker compose down
fi

echo "✅ Servidores y contenedores detenidos."
