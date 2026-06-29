#!/bin/bash

echo "🛑 Deteniendo Sistema de Gestión Escolar..."

# Matar procesos de Node.js
pkill -f "node"
pkill -f "npm"

echo "✅ Servidores detenidos."
