#!/bin/bash

# Obtener la ruta absoluta del directorio donde se encuentra este script
DIR_RAIZ="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Iniciando Sistema de Gestión Escolar..."
echo ""

# Ejecutar migraciones en el backend
echo "🔄 Ejecutando migraciones..."
cd "$DIR_RAIZ/backend" && npm run migrate

# Iniciar desarrollo
echo ""
echo "✅ ¡Todo listo! Iniciando servidores..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3030"
echo ""

cd "$DIR_RAIZ" && npm run dev

