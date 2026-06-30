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
echo "3) Todo Local (Frontend, Backend y BD local ya iniciada)"
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
        echo "Frontend: http://localhost:3000"
        echo "Backend: http://localhost:3030"
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
        echo "🔍 Verificando base de datos local..."
        if command -v psql &> /dev/null; then
            # Intentar crear la base de datos si no existe
            if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw school_management; then
                echo "⚠️  La base de datos 'school_management' no existe. Intentando crearla..."
                psql -U postgres -c "CREATE DATABASE school_management;" &>/dev/null
                if [ $? -eq 0 ]; then
                    echo "✅ Base de datos 'school_management' creada con éxito."
                else
                    echo "❌ No se pudo crear la base de datos. Asegúrate de tener permisos o de que PostgreSQL local esté activo."
                fi
            else
                echo "✅ Base de datos local detectada."
            fi
        fi

        echo "🔄 Ejecutando migraciones locales..."
        cd "$DIR_RAIZ/backend" && npm run migrate
        
        echo ""
        echo "✅ Iniciando servidores Frontend y Backend localmente..."
        echo "Frontend: http://localhost:3000"
        echo "Backend: http://localhost:3030"
        echo ""
        cd "$DIR_RAIZ" && npm run dev
        ;;
    *)
        echo "👋 Salida."
        exit 0
        ;;
esac
