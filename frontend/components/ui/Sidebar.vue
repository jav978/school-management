<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
    <div class="p-4 border-b flex items-center gap-3">
      <img src="/logocolegio.png" alt="U.E Santa Luisa" class="w-9 h-9 object-contain" />
      <h1 class="text-base font-bold text-slate-800">U.E Santa Luisa</h1>
    </div>
    <nav class="mt-6">
      <ui-sidebar-section title="Principal">
        <ui-sidebar-item to="/dashboard" icon="📊" label="Dashboard" />
      </ui-sidebar-section>

      <ui-sidebar-section title="Académico">
        <ui-sidebar-item to="/students" icon="👨‍🎓" label="Estudiantes" />
        <ui-sidebar-item to="/teachers" icon="👨‍🏫" label="Profesores" />
        <ui-sidebar-item to="/grades" icon="📝" label="Calificaciones" />
        <ui-sidebar-item to="/attendance" icon="✅" label="Asistencia" />
        <ui-sidebar-item to="/schedules" icon="📅" label="Horarios" />
      </ui-sidebar-section>

      <ui-sidebar-section title="Administración">
        <ui-sidebar-item to="/finance" icon="💰" label="Finanzas" />
        <ui-sidebar-item to="/communication" icon="💬" label="Comunicación" />
        <ui-sidebar-item to="/reports" icon="📈" label="Reportes" />
      </ui-sidebar-section>
    </nav>
  </aside>
</template>
