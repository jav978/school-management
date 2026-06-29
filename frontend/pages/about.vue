<template>
  <div>
    <ui-page-header title="Acerca de" subtitle="Información sobre el sistema" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ui-card title="School Management System">
        <p class="text-gray-600 mb-4">
          Sistema de gestión escolar completo para instituciones educativas. Diseñado para administrar estudiantes, profesores, calificaciones, asistencia y más.
        </p>
        <div class="space-y-2">
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">Versión:</span>
            <span class="text-gray-700">1.0.0</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">Tecnología:</span>
            <span class="text-gray-700">Nuxt.js 3 + Feathers.js</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">Base de Datos:</span>
            <span class="text-gray-700">PostgreSQL</span>
          </div>
        </div>
      </ui-card>

      <ui-card title="Características">
        <ul class="space-y-3">
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Gestión de estudiantes y profesores</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Control de calificaciones</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Registro de asistencia</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Gestión financiera</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Sistema de comunicación</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Horarios escolares</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <span>Reportes y estadísticas</span>
          </li>
        </ul>
      </ui-card>
    </div>
  </div>
</template>
