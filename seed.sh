#!/bin/bash

# Cargar NVM si node o npm no están en PATH
if ! command -v npm &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo "🌱 Sembrando datos de ejemplo..."

cd backend && npm run seed

echo "✅ Datos de ejemplo insertados exitosamente."
