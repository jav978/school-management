#!/bin/bash

echo "🔍 Verificando integración de base de datos..."
echo ""

# Verificar conexión Docker
echo "📦 Verificando contenedor Docker..."
if docker ps | grep -q "docker-postgres-1"; then
    echo "✅ Contenedor Docker corriendo"
else
    echo "❌ Contenedor Docker no encontrado"
    exit 1
fi

# Verificar base de datos
echo ""
echo "🗄️  Verificando base de datos..."
TABLE_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'school';")
echo "✅ Tablas creadas: $TABLE_COUNT"

# Verificar ENUMs
ENUM_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'school') AND typtype = 'e';")
echo "✅ Tipos ENUM: $ENUM_COUNT"

# Verificar índices
INDEX_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'school';")
echo "✅ Índices: $INDEX_COUNT"

# Verificar vistas
VIEW_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'school';")
echo "✅ Vistas: $VIEW_COUNT"

# Verificar triggers
TRIGGER_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'school';")
echo "✅ Triggers: $TRIGGER_COUNT"

# Verificar datos
echo ""
echo "📊 Verificando datos de ejemplo..."
USER_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM school.users;")
echo "✅ Usuarios: $USER_COUNT"

STUDENT_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM school.students;")
echo "✅ Estudiantes: $STUDENT_COUNT"

TEACHER_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM school.teachers;")
echo "✅ Profesores: $TEACHER_COUNT"

EXAM_COUNT=$(docker exec docker-postgres-1 psql -U postgres -d school_management -t -c "SELECT COUNT(*) FROM school.exams;")
echo "✅ Exámenes: $EXAM_COUNT"

# Verificar backend
echo ""
echo "🖥️  Verificando backend..."
if curl -s http://localhost:3030/users > /dev/null 2>&1; then
    echo "✅ API backend respondiendo"
else
    echo "⚠️  API backend no responde (¿está iniciado?)"
fi

echo ""
echo "✨ Verificación completada"
