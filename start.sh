#!/bin/bash

# Obtener la ruta absoluta del directorio donde se encuentra este script
DIR_RAIZ="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR_RAIZ"

echo "============================================="
echo "🚀 Sistema de Gestión Escolar - Inicio"
echo "============================================="
echo ""

echo "Elige cómo deseas levantar el sistema:"
echo "1) Híbrido (BD y utilidades en Docker + Frontend y Backend locales)"
echo "2) Todo en Docker (Frontend, Backend, BD y utilidades)"
echo "3) Frontend y Backend locales (BD InsForge Cloud / local configurada)"
echo "4) Salir"
echo ""
read -p "Selecciona una opción (1-4): " OPCION

case $OPCION in
    1)
        echo ""
        echo "🐋 Iniciando Base de Datos y utilidades en Docker..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Error: Docker no está instalado en este sistema."
            exit 1
        fi
        docker compose up -d db pgadmin directus
        
        echo -n "🔄 Esperando a que la Base de Datos esté lista para recibir conexiones"
        # Esperar activamente a que PostgreSQL responda dentro del contenedor
        until docker exec school_db pg_isready -U postgres &>/dev/null; do
            echo -n "."
            sleep 1
        done
        echo " ¡Lista!"
        
        echo "🔄 Ejecutando migraciones locales..."
        cd "$DIR_RAIZ/backend" && npm run migrate
        
        echo ""
        echo "✅ ¡Todo listo! Iniciando servidores Frontend y Backend localmente..."
        echo "Frontend: http://localhost:3001"
        echo "Backend:  http://localhost:3031"
        echo ""
        cd "$DIR_RAIZ" && npm run dev
        ;;
    2)
        echo ""
        echo "🐋 Iniciando todo el sistema en Docker..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Error: Docker no está instalado en este sistema."
            exit 1
        fi
        docker compose up --build
        ;;
    3)
        echo ""
        echo "🔄 Ejecutando migraciones..."
        cd "$DIR_RAIZ/backend" && npm run migrate
        
        echo ""
        echo "✅ ¡Todo listo! Iniciando servidores Frontend y Backend localmente..."
        echo "Frontend: http://localhost:3001"
        echo "Backend:  http://localhost:3031"
        echo ""
        cd "$DIR_RAIZ" && npm run dev
        ;;
    4)
        echo "👋 Salida."
        exit 0
        ;;
    *)
        echo "❌ Opción no válida."
        exit 1
        ;;
esac


