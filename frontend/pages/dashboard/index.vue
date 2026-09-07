<template>
  <div class="space-y-6">

    <!-- Role Welcome Banner -->
    <div class="glass-card rounded-3xl p-6 relative overflow-hidden border border-brand-primary/15 dark:border-slate-800 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-purple flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-brand-gold/40">
            <span v-if="currentRole === 'student'">🎓</span>
            <span v-else-if="currentRole === 'teacher'">👨‍🏫</span>
            <span v-else-if="currentRole === 'parent'">👨‍👩‍👦</span>
            <span v-else>👑</span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                <template v-if="currentRole === 'student'">¡Hola, Gabriel Martínez!</template>
                <template v-else-if="currentRole === 'teacher'">¡Buen día, Prof. Carmen Fernández!</template>
                <template v-else-if="currentRole === 'parent'">¡Bienvenida, Sra. Elena Rodríguez!</template>
                <template v-else>Panel Institucional • U.E Santa Luisa</template>
              </h2>
              <span 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="{
                  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30': currentRole === 'student',
                  'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30': currentRole === 'teacher',
                  'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30': currentRole === 'parent',
                  'bg-brand-gold/20 text-amber-900 dark:text-brand-gold border border-brand-gold/40': !['student', 'teacher', 'parent'].includes(currentRole)
                }"
              >
                {{ currentRole === 'student' ? 'Estudiante Regular' : currentRole === 'teacher' ? 'Docente Titular' : currentRole === 'parent' ? 'Representante Legal' : 'Administración General' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              <template v-if="currentRole === 'student'">
                3er Año • Sección U • C.I. V-32.456.789 • Año Escolar 2025-2026
              </template>
              <template v-else-if="currentRole === 'teacher'">
                Dpto. de Ciencias Naturales y Exactas • Carga: 28 Horas Académicas
              </template>
              <template v-else-if="currentRole === 'parent'">
                2 Estudiantes Matriculados • Solvencia Administrativa al Día
              </template>
              <template v-else>
                Período Lectivo 2025-2026 • 1er Lapso Pedagógico en desarrollo
              </template>
            </p>
          </div>
        </div>

        <!-- Quick Action / Status Badge -->
        <div class="flex items-center gap-2 sm:self-center">
          <div v-if="currentRole === 'student'" class="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3.5 py-2 rounded-2xl border border-emerald-500/20 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Solvente para 1er Lapso</span>
          </div>
          <div v-else-if="currentRole === 'parent'" class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button 
              @click="setActiveStudent('carlos')"
              :class="selectedChild === 'carlos' ? 'bg-brand-primary text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer"
            >
              👦 Carlos (3er Año U)
            </button>
            <button 
              @click="setActiveStudent('maria')"
              :class="selectedChild === 'maria' ? 'bg-brand-primary text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer"
            >
              👧 María (1er Grado U)
            </button>
          </div>
          <div v-else class="text-right hidden sm:block">
            <span class="text-xs font-bold text-slate-400">Lunes, 15 Septiembre</span>
            <p class="text-xs font-black text-brand-primary dark:text-brand-secondary">Semana 1 • 1er Lapso</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 1. STUDENT VIEW (currentRole === 'student')                     -->
    <!-- ZERO institutional financials, ZERO global totals              -->
    <!-- ============================================================== -->
    <template v-if="currentRole === 'student'">
      <!-- Student Top KPI Row (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        
        <!-- Promedio General -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Promedio General
              </p>
              <h3 class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-display tracking-tight">
                18.4 <span class="text-xs font-bold text-slate-400">/ 20</span>
              </h3>
            </div>
            <NuxtLink 
              to="/boletas" 
              class="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-emerald-500/20"
              title="Ver Boleta"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
            <span class="text-emerald-600 dark:text-emerald-400">Rendimiento Sobresaliente</span>
            <span class="text-slate-400">1er Lapso</span>
          </div>
        </div>

        <!-- Materias Cursadas -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Materias Cursadas
              </p>
              <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
                11 <span class="text-xs font-bold text-slate-400">Asignaturas</span>
              </h3>
            </div>
            <NuxtLink 
              to="/subjects" 
              class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
              title="Ver Materias"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span class="text-brand-purple dark:text-brand-secondary">Plan Media General</span>
            <span>3er Año U</span>
          </div>
        </div>

        <!-- Asistencia Personal -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Asistencia
              </p>
              <h3 class="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1 font-display tracking-tight">
                97.8%
              </h3>
            </div>
            <NuxtLink 
              to="/attendance" 
              class="w-11 h-11 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-sky-500/20"
              title="Ver Asistencia"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
            <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 45 Asistencias
            </span>
            <span class="text-amber-600 dark:text-amber-400">1 Falta Justificada</span>
          </div>
        </div>

        <!-- Próxima Evaluación -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Próxima Evaluación
              </p>
              <h3 class="text-xl font-black text-amber-600 dark:text-brand-gold mt-1 font-display tracking-tight truncate">
                Física Teórica
              </h3>
            </div>
            <NuxtLink 
              to="/schedules" 
              class="w-11 h-11 rounded-2xl bg-brand-gold/15 text-amber-700 dark:text-brand-gold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-gold/30"
              title="Ver Horario"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span class="text-amber-700 dark:text-brand-gold">Jueves 18 Sep • 07:30 AM</span>
            <span>20% (4 pts)</span>
          </div>
        </div>

      </div>

      <!-- Student Middle Row: Today's Classes (8 cols) & Digital ID/Shortcuts (4 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <!-- Today's Schedule & Recent Grades (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Clases de Hoy (Lunes) -->
          <div class="glass-card glass-card-hover rounded-3xl p-6 shadow-sm dark:shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <span>📅</span> Mis Clases de Hoy (Lunes)
                </h3>
                <p class="text-xs text-slate-400">3er Año • Sección U • Aula Principal 12</p>
              </div>
              <NuxtLink to="/schedules" class="text-xs font-bold text-brand-primary dark:text-brand-secondary hover:underline">
                Horario semanal completo →
              </NuxtLink>
            </div>

            <!-- Timeline of Classes -->
            <div class="space-y-3">
              <div 
                v-for="(cls, idx) in studentTodayClasses" 
                :key="idx"
                class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                :class="cls.isCurrent 
                  ? 'bg-brand-primary/5 dark:bg-brand-purple/15 border-brand-primary/30 dark:border-brand-secondary/40 shadow-xs' 
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80'"
              >
                <div class="flex items-center gap-3.5">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0"
                    :class="cls.isCurrent ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'"
                  >
                    {{ cls.icon }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ cls.subject }}</h4>
                      <span v-if="cls.isCurrent" class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white animate-pulse">
                        EN CURSO AHORA
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      {{ cls.teacher }} • <span class="font-medium text-slate-700 dark:text-slate-300">{{ cls.room }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3 self-start sm:self-center">
                  <span class="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    ⏰ {{ cls.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mis Calificaciones Recientes (1er Lapso) -->
          <div class="glass-card glass-card-hover rounded-3xl p-6 shadow-sm dark:shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <span>📝</span> Calificaciones Asentadas (1er Lapso)
                </h3>
                <p class="text-xs text-slate-400">Últimas evaluaciones calificadas por tus docentes</p>
              </div>
              <NuxtLink to="/boletas" class="text-xs font-bold text-brand-primary dark:text-brand-secondary hover:underline">
                Consultar Boleta Oficial →
              </NuxtLink>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th class="pb-3 pl-2">Asignatura</th>
                    <th class="pb-3">Docente Especialista</th>
                    <th class="pb-3">Evaluación</th>
                    <th class="pb-3 text-center">Pond.</th>
                    <th class="pb-3 text-center">Nota</th>
                    <th class="pb-3 text-right pr-2">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr v-for="(grade, idx) in studentRecentGrades" :key="idx" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td class="py-3 pl-2 font-bold text-slate-800 dark:text-slate-100">{{ grade.subject }}</td>
                    <td class="py-3 text-slate-500 dark:text-slate-400">{{ grade.teacher }}</td>
                    <td class="py-3 text-slate-600 dark:text-slate-300">{{ grade.evaluation }}</td>
                    <td class="py-3 text-center font-semibold text-slate-500">{{ grade.weight }}</td>
                    <td class="py-3 text-center">
                      <span class="inline-block px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {{ grade.score }} / 20
                      </span>
                    </td>
                    <td class="py-3 text-right pr-2">
                      <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Aprobado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Student Digital ID Card & Quick Actions (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          
          <!-- Carnet Digital -->
          <div class="bg-gradient-to-br from-brand-primary via-brand-purple to-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-white/10">
            <div class="absolute right-0 top-0 translate-x-6 -translate-y-6 w-36 h-36 bg-brand-gold/20 rounded-full blur-2xl pointer-events-none"></div>

            <div class="flex items-center justify-between pb-3 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span class="text-base">🇻🇪</span>
                <span class="text-[10px] font-black uppercase tracking-wider text-brand-gold">U.E Santa Luisa</span>
              </div>
              <span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                CARNET DIGITAL
              </span>
            </div>

            <div class="mt-4 flex items-center gap-3.5">
              <div class="w-16 h-16 rounded-2xl bg-white/10 p-1 border border-white/20 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160" 
                  alt="Gabriel Martínez"
                  class="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-black text-white leading-tight">Gabriel Martínez</h4>
                <p class="text-[11px] text-slate-300 font-mono mt-0.5">C.I. V-32.456.789</p>
                <p class="text-[11px] font-bold text-brand-gold mt-1">3er Año • Sección U</p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span>Año Escolar 2025-2026</span>
              <span class="text-emerald-400 font-bold">● Válido / Activo</span>
            </div>
          </div>

          <!-- Shortcuts Card -->
          <div class="glass-card glass-card-hover rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">Accesos Rápidos</h4>
            
            <NuxtLink 
              to="/boletas" 
              class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-primary/10 transition-all border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span class="flex items-center gap-2">📄 Mi Boleta del Lapso</span>
              <span>→</span>
            </NuxtLink>

            <NuxtLink 
              to="/schedules" 
              class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-primary/10 transition-all border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span class="flex items-center gap-2">👨‍🏫 Horarios de Profesores</span>
              <span>→</span>
            </NuxtLink>

            <NuxtLink 
              to="/subjects" 
              class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-primary/10 transition-all border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span class="flex items-center gap-2">📚 Mis 11 Asignaturas</span>
              <span>→</span>
            </NuxtLink>
          </div>

        </div>

      </div>
    </template>

    <!-- ============================================================== -->
    <!-- 2. TEACHER VIEW (currentRole === 'teacher')                     -->
    <!-- ZERO institutional financials, Focus on classes & grading      -->
    <!-- ============================================================== -->
    <template v-else-if="currentRole === 'teacher'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Mis Cátedras</p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display">4</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-brand-purple dark:text-brand-secondary">
            <span>Física & Cs. Naturales</span>
            <span>3er, 4to y 5to Año</span>
          </div>
        </div>

        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alumnos Atendidos</p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display">142</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-slate-500">
            <span>Sección Única por año</span>
            <span class="text-emerald-500">100% Asistencia</span>
          </div>
        </div>

        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Planillas por Asentar</p>
            <h3 class="text-3xl font-black text-amber-600 dark:text-brand-gold mt-1 font-display">2</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-amber-700 dark:text-brand-gold">
            <span>Física 3er Año (Taller 1)</span>
            <span>Vence 22 Sep</span>
          </div>
        </div>

        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Horas Semanales</p>
            <h3 class="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1 font-display">28h</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-slate-400">
            <span>20h Aula • 8h Preparación</span>
          </div>
        </div>
      </div>
    </template>

    <!-- ============================================================== -->
    <!-- 3. PARENT VIEW (currentRole === 'parent')                       -->
    <!-- Multi-child view, Solvency per Lapso, Grades, Attendance       -->
    <!-- ============================================================== -->
    <template v-else-if="currentRole === 'parent'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        
        <!-- Solvencia Administrativa (Per Lapso) -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado Administrativo</p>
            <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-display">Solvente</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold">
            <span class="text-emerald-600 dark:text-emerald-400">1er Lapso Habilitado</span>
            <span class="text-slate-400">Septiembre Pagado</span>
          </div>
        </div>

        <!-- Promedio del Estudiante Seleccionado -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Promedio Escolar</p>
            <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display">
              {{ selectedChild === 'carlos' ? '18.4' : '19.1' }} <span class="text-xs font-bold text-slate-400">/ 20</span>
            </h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-emerald-600">
            <span>{{ selectedChild === 'carlos' ? '3er Año Sección U' : '1er Grado Sección U' }}</span>
            <span>Sobresaliente</span>
          </div>
        </div>

        <!-- Asistencia -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asistencia</p>
            <h3 class="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1 font-display">
              {{ selectedChild === 'carlos' ? '97.8%' : '100%' }}
            </h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-slate-400">
            <span>{{ selectedChild === 'carlos' ? '1 falta justificada' : 'Sin inasistencias' }}</span>
          </div>
        </div>

        <!-- Acceso a Boleta -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Boleta de Calificaciones</p>
            <h3 class="text-xl font-black text-brand-primary dark:text-white mt-1 font-display">1er Lapso</h3>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <NuxtLink to="/boletas" class="text-xs font-black text-brand-primary dark:text-brand-secondary hover:underline flex items-center justify-between">
              <span>Descargar Boleta Oficial</span>
              <span>↓</span>
            </NuxtLink>
          </div>
        </div>

      </div>
    </template>

    <!-- ============================================================== -->
    <!-- 4. ADMIN VIEW (currentRole === 'admin' / coordinator)          -->
    <!-- Full Institutional KPIs, Financials, Expenses, Gender metrics  -->
    <!-- ============================================================== -->
    <template v-else>
      <!-- Top KPI Row (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        
        <!-- Students KPI with Gender Breakdown -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                {{ t('students') }}
              </p>
              <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
                1,260
              </h3>
            </div>
            <NuxtLink 
              to="/students" 
              class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
              title="Ver Estudiantes"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>

          <!-- Gender Breakdown Submetrics -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span class="text-sky-600 dark:text-brand-secondary flex items-center gap-1">
                <span>♂</span> Masc: 693 (55%)
              </span>
              <span class="text-amber-600 dark:text-brand-gold flex items-center gap-1">
                <span>♀</span> Fem: 567 (45%)
              </span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div class="h-full bg-brand-secondary" style="width: 55%" title="Masculino: 55%"></div>
              <div class="h-full bg-brand-gold" style="width: 45%" title="Femenino: 45%"></div>
            </div>
          </div>
        </div>

        <!-- Teachers KPI -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                {{ t('teachers') }}
              </p>
              <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
                224
              </h3>
            </div>
            <NuxtLink 
              to="/teachers" 
              class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
              title="Ver Profesores"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 100% Cátedras activas
            </span>
            <span>32 Especialistas</span>
          </div>
        </div>

        <!-- Parents KPI -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                {{ t('parents') }}
              </p>
              <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
                840
              </h3>
            </div>
            <NuxtLink 
              to="/parents" 
              class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
              title="Ver Padres"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span class="text-brand-purple dark:text-brand-secondary">Familias activas</span>
            <span>Año 2025-2026</span>
          </div>
        </div>

        <!-- Earnings KPI -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                {{ t('earnings') }}
              </p>
              <h3 class="text-3xl font-black text-brand-primary dark:text-white mt-1 font-display tracking-tight">
                $54,000
              </h3>
            </div>
            <NuxtLink 
              to="/finance" 
              class="w-11 h-11 rounded-2xl bg-brand-primary/10 dark:bg-brand-purple/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs border border-brand-primary/20 dark:border-brand-secondary/30"
              title="Ver Finanzas"
            >
              <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </NuxtLink>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span class="text-emerald-600 dark:text-emerald-400 font-extrabold">+8.4% vs mes anterior</span>
            <span class="text-slate-400">94.2% meta</span>
          </div>
        </div>

      </div>

      <!-- Middle Row: Earnings Bar Chart & Students Gender Ratio -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <!-- Earnings Chart Card (8 cols) -->
        <div class="lg:col-span-8 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-[420px] shadow-sm dark:shadow-xl">
          <div>
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {{ t('earnings') }} & Gastos Operativos
                  </h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold/15 text-amber-700 dark:text-brand-gold border border-brand-gold/30">
                    Año 2025-2026
                  </span>
                </div>
                <div class="relative inline-block mt-1">
                  <select 
                    v-model="selectedYear"
                    class="text-xs font-bold text-slate-500 bg-transparent outline-none cursor-pointer pr-4 hover:text-brand-primary dark:hover:text-white transition-colors"
                  >
                    <option value="2024">Año Escolar 2024-2025 ⌵</option>
                    <option value="2025">Año Escolar 2025-2026 ⌵</option>
                    <option value="2026">Año Escolar 2026-2027 ⌵</option>
                  </select>
                </div>
              </div>

              <!-- Legend & Actions -->
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-3 text-xs font-bold">
                  <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                    <span class="w-3 h-3 rounded-full bg-brand-gold shadow-xs"></span>
                    {{ t('earnings') }}
                  </span>
                  <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                    <span class="w-3 h-3 rounded-full bg-brand-purple shadow-xs"></span>
                    {{ t('expanse') }}
                  </span>
                </div>

                <NuxtLink to="/finance" class="p-1.5 text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors" title="Ver detalle financiero">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <!-- Bar Chart SVG Container -->
            <div class="mt-6 h-60 flex">
              <!-- Y-Axis Labels -->
              <div class="flex flex-col justify-between text-[11px] font-bold text-slate-400 dark:text-slate-400 pr-3 pb-6 select-none">
                <span>$50k</span>
                <span>$40k</span>
                <span>$30k</span>
                <span>$20k</span>
                <span>$10k</span>
                <span>$0</span>
              </div>

              <!-- Bars & Grid -->
              <div class="flex-1 flex flex-col justify-between relative">
                <div class="absolute inset-x-0 top-0 border-b border-slate-100 dark:border-slate-800/60"></div>
                <div class="absolute inset-x-0 top-[20%] border-b border-slate-100 dark:border-slate-800/60"></div>
                <div class="absolute inset-x-0 top-[40%] border-b border-slate-100 dark:border-slate-800/60"></div>
                <div class="absolute inset-x-0 top-[60%] border-b border-slate-100 dark:border-slate-800/60"></div>
                <div class="absolute inset-x-0 top-[80%] border-b border-slate-100 dark:border-slate-800/60"></div>
                <div class="absolute inset-x-0 bottom-6 border-b-2 border-slate-200 dark:border-slate-700"></div>

                <!-- Bars Area -->
                <div class="flex-1 flex items-end justify-between px-1 sm:px-2 pb-6 z-10">
                  <div 
                    v-for="(item, idx) in monthlyData" 
                    :key="idx" 
                    class="flex flex-col items-center gap-1 group relative cursor-pointer"
                  >
                    <div class="flex items-end gap-1.5 h-44">
                      <div 
                        class="w-2.5 sm:w-3 bg-brand-gold rounded-t-full transition-all duration-300 hover:brightness-110 shadow-xs" 
                        :style="{ height: `${item.earnings}%` }"
                        :title="`Ingresos: $${item.earnings * 600}`"
                      ></div>
                      <div 
                        class="w-2.5 sm:w-3 bg-brand-purple rounded-t-full transition-all duration-300 hover:brightness-125 shadow-xs" 
                        :style="{ height: `${item.expanse}%` }"
                        :title="`Gastos: $${item.expanse * 600}`"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- X-Axis Month Labels -->
                <div class="flex justify-between px-1 sm:px-2 text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase">
                  <span v-for="(m, i) in monthNames" :key="i" class="w-5 text-center">{{ m }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <span>Promedio mensual: <strong class="text-slate-900 dark:text-white">$45,200</strong></span>
            <span class="text-brand-purple dark:text-brand-secondary font-bold">Balance positivo en curso</span>
          </div>
        </div>

        <!-- Students Gender Ratio Card (4 cols) -->
        <div class="lg:col-span-4 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-[420px] shadow-sm dark:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
                Matrícula por Género
              </h3>
              <p class="text-xs text-slate-400">Total: 1,260 alumnos matriculados</p>
            </div>
            <NuxtLink to="/students" class="text-slate-400 hover:text-brand-primary dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </NuxtLink>
          </div>

          <div class="my-2 relative flex items-center justify-center">
            <div class="relative w-48 h-48 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-110" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" stroke-width="7" class="text-slate-100 dark:text-slate-800" />
                <circle cx="60" cy="60" r="37" fill="none" stroke="currentColor" stroke-width="7" class="text-slate-100 dark:text-slate-800" />
                
                <circle 
                  cx="60" cy="60" r="48" 
                  fill="none" 
                  stroke="#f7c301" 
                  stroke-width="7" 
                  stroke-dasharray="301" 
                  stroke-dashoffset="165" 
                  stroke-linecap="round" 
                />
                <circle cx="108" cy="60" r="4" fill="#f7c301" />

                <circle 
                  cx="60" cy="60" r="37" 
                  fill="none" 
                  stroke="#38bdf8" 
                  stroke-width="7" 
                  stroke-dasharray="232" 
                  stroke-dashoffset="104" 
                  stroke-linecap="round" 
                />
                <circle cx="97" cy="60" r="4" fill="#38bdf8" />
              </svg>

              <div class="absolute w-16 h-16 rounded-full bg-brand-primary/10 dark:bg-brand-purple/20 flex flex-col items-center justify-center text-brand-primary dark:text-brand-secondary shadow-inner border border-brand-primary/20 dark:border-brand-secondary/30">
                <span class="text-lg font-black">🎓</span>
                <span class="text-[10px] font-extrabold uppercase">1.2k</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span class="w-3 h-3 rounded-full bg-brand-secondary shadow-xs"></span>
                Masculino (♂)
              </span>
              <span class="text-slate-900 dark:text-white font-extrabold">693 (55%)</span>
            </div>

            <div class="flex items-center justify-between text-xs font-bold">
              <span class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span class="w-3 h-3 rounded-full bg-brand-gold shadow-xs"></span>
                Femenino (♀)
              </span>
              <span class="text-slate-900 dark:text-white font-extrabold">567 (45%)</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- ============================================================== -->
    <!-- 5. UNIVERSAL BOTTOM ROW: Notices & Calendar / Community       -->
    <!-- Common to all personas to maintain unity & announcements       -->
    <!-- ============================================================== -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      <!-- Notice Board Section (8 cols) -->
      <div class="lg:col-span-8 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-xl">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-display">
                {{ t('noticeBoard') }}
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Circulares oficiales y comunicados de la U.E Santa Luisa
              </p>
            </div>
            <NuxtLink to="/communication" class="text-xs font-bold text-brand-primary dark:text-brand-secondary hover:underline">
              Ver todos →
            </NuxtLink>
          </div>

          <!-- Notices List -->
          <div class="mt-5 divide-y divide-slate-100 dark:divide-slate-800/60">
            <div 
              v-for="(item, idx) in noticeList" 
              :key="idx" 
              class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 rounded-2xl px-2.5 transition-all"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <img 
                  :src="item.image" 
                  :alt="item.title" 
                  class="w-12 h-12 rounded-xl object-cover shadow-xs flex-shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div class="min-w-0">
                  <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate hover:text-brand-primary dark:hover:text-brand-gold cursor-pointer transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-2.5 mt-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-amber-800 dark:text-brand-gold text-[10px] font-extrabold">
                      {{ item.date }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-semibold">• Dirección Académica</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 flex-shrink-0 self-start sm:self-center">
                <span class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-brand-primary/10 dark:bg-brand-purple/25 text-brand-primary dark:text-brand-secondary border border-brand-primary/20">
                  {{ item.tag || 'Institucional' }}
                </span>
                <NuxtLink to="/communication" class="text-slate-400 hover:text-brand-primary p-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Actualizado en tiempo real por Secretaría General</span>
          <span class="font-bold text-brand-primary dark:text-brand-secondary">4 comunicados activos</span>
        </div>
      </div>

      <!-- Right Column (4 cols): Event Calendar & Join Community Card -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- School Calendar Card -->
        <div class="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between shadow-sm dark:shadow-xl">
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold font-display text-slate-900 dark:text-white">
                {{ t('eventCalendar') }}
              </h3>
              <span class="text-xs font-bold text-brand-gold">Año 2025-2026</span>
            </div>

            <!-- Tab Switcher -->
            <div class="mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1">
              <button 
                @click="calendarTab = 'dayToDay'"
                :class="calendarTab === 'dayToDay' ? 'bg-brand-primary text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="flex-1 py-1.5 text-xs rounded-xl transition-all text-center"
              >
                {{ t('dayToDay') }}
              </button>
              <button 
                @click="calendarTab = 'socialMedia'"
                :class="calendarTab === 'socialMedia' ? 'bg-brand-primary text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="flex-1 py-1.5 text-xs rounded-xl transition-all text-center"
              >
                Efemérides
              </button>
            </div>

            <!-- Month & Nav Header -->
            <div class="mt-5 flex items-center justify-between px-1">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Septiembre 2026</span>
              <div class="flex items-center gap-1 text-slate-400">
                <button class="p-1 hover:text-brand-primary dark:hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button class="p-1 hover:text-brand-primary dark:hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Days Grid -->
            <div class="mt-3">
              <div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>LU</span>
                <span>MA</span>
                <span>MI</span>
                <span>JU</span>
                <span>VI</span>
                <span>SA</span>
                <span>DO</span>
              </div>

              <div class="grid grid-cols-7 text-center text-xs gap-y-1 text-slate-600 dark:text-slate-400">
                <span class="text-slate-300 dark:text-slate-600 py-1">31</span>
                <span class="py-1 font-medium">1</span>
                <span class="py-1 font-medium">2</span>
                <span class="py-1 font-medium">3</span>
                <span class="py-1 font-medium">4</span>
                <span class="py-1 text-slate-400">5</span>
                <span class="py-1 text-slate-400">6</span>

                <span class="py-1">7</span>
                <span class="py-1">8</span>
                <span class="py-1">9</span>
                <span class="py-1">10</span>
                <span class="py-1">11</span>
                <span class="py-1 text-slate-400">12</span>
                <span class="py-1 text-slate-400">13</span>

                <span class="py-1">14</span>
                <span class="py-1 font-black bg-brand-primary text-white rounded-full shadow-xs">15</span>
                <span class="py-1">16</span>
                <span class="py-1">17</span>
                <span class="py-1">18</span>
                <span class="py-1 text-slate-400">19</span>
                <span class="py-1 text-slate-400">20</span>

                <span class="py-1">21</span>
                <span class="py-1">22</span>
                <span class="py-1">23</span>
                <span class="py-1">24</span>
                <span class="py-1">25</span>
                <span class="py-1 text-slate-400">26</span>
                <span class="py-1 text-slate-400">27</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-brand-gold">
            <span>⭐ 15 Sep: Inicio del 1er Lapso</span>
          </div>
        </div>

        <!-- Community Card -->
        <div class="bg-gradient-to-br from-brand-primary via-brand-purple to-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
          <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
              Comunidad Vicenciana
            </span>
            <h3 class="text-base font-black text-white mt-2 leading-snug font-display">
              {{ t('joinCommunityTitle') }}
            </h3>
            <p class="text-xs text-slate-200 mt-1.5 leading-relaxed">
              {{ t('joinCommunityDesc') }}
            </p>

            <div class="mt-4">
              <NuxtLink 
                to="/communication"
                class="inline-block px-5 py-2 bg-brand-gold text-slate-950 text-xs font-black rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                {{ t('exploreNow') }} →
              </NuxtLink>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between pt-2 border-t border-white/10">
            <div class="flex -space-x-2 overflow-hidden">
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="" />
              <img class="inline-block h-7 w-7 rounded-full ring-2 ring-brand-purple" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=80" alt="" />
              <div class="h-7 w-7 rounded-full ring-2 ring-brand-purple bg-brand-gold text-slate-950 flex items-center justify-center text-[10px] font-black">
                +1.2k
              </div>
            </div>

            <span class="text-xl">🇻🇪 🎓</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuthStore } from '~/stores/auth'
import { useActiveStudent } from '~/composables/useActiveStudent'

const { t } = useLanguage()
const authStore = useAuthStore()
const { activeStudentKey, setActiveStudent } = useActiveStudent()

// Live persona detection
const currentRole = computed(() => authStore.userRole || 'admin')

const selectedYear = ref('2025')
const calendarTab = ref('dayToDay')
const selectedChild = activeStudentKey

// Student Persona Mock Data (Gabriel Martínez - 3er Año Sección U)
const studentTodayClasses = [
  {
    subject: 'Matemática',
    teacher: 'Prof. Carlos Mendoza',
    room: 'Aula 12',
    time: '07:00 - 08:30',
    icon: '📐',
    isCurrent: false
  },
  {
    subject: 'Física Teórica',
    teacher: 'Prof. Carmen Fernández',
    room: 'Laboratorio B',
    time: '08:30 - 10:00',
    icon: '⚡',
    isCurrent: true
  },
  {
    subject: 'Castellano y Literatura',
    teacher: 'Prof. Luis Silva',
    room: 'Aula 12',
    time: '10:30 - 12:00',
    icon: '📖',
    isCurrent: false
  },
  {
    subject: 'Educación Física y Deporte',
    teacher: 'Prof. Roberto Díaz',
    room: 'Cancha Techada Múltiple',
    time: '12:00 - 01:00',
    icon: '⚽',
    isCurrent: false
  }
]

const studentRecentGrades = [
  {
    subject: 'Matemática',
    teacher: 'Prof. Carlos Mendoza',
    evaluation: 'Taller Práctico: Polinomios',
    weight: '20%',
    score: '19'
  },
  {
    subject: 'Física Teórica',
    teacher: 'Prof. Carmen Fernández',
    evaluation: 'Informe de Laboratorio: Cinemática',
    weight: '20%',
    score: '18'
  },
  {
    subject: 'Castellano y Literatura',
    teacher: 'Prof. Luis Silva',
    evaluation: 'Análisis de Novela Doña Bárbara',
    weight: '20%',
    score: '17'
  },
  {
    subject: 'Biología Celular',
    teacher: 'Prof. Patricia Mora',
    evaluation: 'Exposición Maqueta Mitosis',
    weight: '20%',
    score: '20'
  },
  {
    subject: 'Química General',
    teacher: 'Prof. Elena Vásquez',
    evaluation: 'Tabla Periódica y Enlaces',
    weight: '20%',
    score: '18'
  }
]

// Month abbreviations for Admin View
const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Monthly paired bars data: Earnings vs Expense
const monthlyData = [
  { earnings: 78, expanse: 64 },
  { earnings: 55, expanse: 30 },
  { earnings: 72, expanse: 62 },
  { earnings: 88, expanse: 25 },
  { earnings: 58, expanse: 50 },
  { earnings: 32, expanse: 20 },
  { earnings: 45, expanse: 48 },
  { earnings: 82, expanse: 40 },
  { earnings: 92, expanse: 55 },
  { earnings: 60, expanse: 35 },
  { earnings: 74, expanse: 48 },
  { earnings: 85, expanse: 60 }
]

// Mock notice items for Santa Luisa
const noticeList = [
  {
    title: 'Cronograma de Entrega de Boletas del 1er Lapso Pedagógico',
    date: '18 Dic, 2026',
    views: '12.4k',
    tag: 'Académico',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Normativa sobre el uso del uniforme y carnet estudiantil institucional',
    date: '12 Ene, 2026',
    tag: 'Disciplina',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Conmemoración del Natalicio de Santa Luisa de Marillac y Semana Vicenciana',
    date: '15 Mar, 2026',
    tag: 'Pastoral',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=120'
  },
  {
    title: 'Apertura de inscripciones para actividades extracurriculares y robótica',
    date: '02 Feb, 2026',
    tag: 'Cultura',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120'
  }
]
</script>
