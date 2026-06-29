<template>
  <div class="space-y-6">
    <!-- Top Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Estudiantes Activos -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estudiantes</span>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white mt-1">847</h3>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
              ↑ +12%
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">este mes</span>
          </div>
        </div>
        <!-- Sparkline mini chart -->
        <div class="w-24 h-12">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40">
            <path d="M0,35 Q15,10 30,25 T60,5 T90,20 T100,10" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"></path>
            <path d="M0,35 Q15,10 30,25 T60,5 T90,20 T100,10 L100,40 L0,40 Z" fill="url(#greenGrad)" opacity="0.1"></path>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981"></stop>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Ingresos Mensuales -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ingresos (USD)</span>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white mt-1">$4,500</h3>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
              ↑ +20%
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">este mes</span>
          </div>
        </div>
        <!-- Sparkline mini chart -->
        <div class="w-24 h-12">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40">
            <path d="M0,30 Q20,38 40,20 T70,10 T100,5" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"></path>
            <path d="M0,30 Q20,38 40,20 T70,10 T100,5 L100,40 L0,40 Z" fill="url(#blueGrad)" opacity="0.1"></path>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#06b6d4"></stop>
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Asistencia Promedio -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Asistencia Diaria</span>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white mt-1">94.2%</h3>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
              ↓ -0.8%
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">vs ayer</span>
          </div>
        </div>
        <!-- Sparkline mini chart (negative trend) -->
        <div class="w-24 h-12">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40">
            <path d="M0,10 Q20,8 40,25 T80,18 T100,32" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"></path>
            <path d="M0,10 Q20,8 40,25 T80,18 T100,32 L100,40 L0,40 Z" fill="url(#roseGrad)" opacity="0.1"></path>
            <defs>
              <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f43f5e"></stop>
                <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Ocupación de Aulas (Circular indicator) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Capacidad de Aulas</span>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white mt-1">164 / 180</h3>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
              ↑ +3%
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">optimizado</span>
          </div>
        </div>
        <!-- Donut circular indicator -->
        <div class="relative w-14 h-14 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="22" stroke="currentColor" class="text-slate-100 dark:text-slate-850" stroke-width="4.5" fill="transparent"></circle>
            <circle cx="28" cy="28" r="22" stroke="#10b981" stroke-width="4.5" fill="transparent" stroke-dasharray="138" stroke-dashoffset="13.8" stroke-linecap="round"></circle>
          </svg>
          <span class="absolute text-[10px] font-black text-slate-700 dark:text-slate-200">90%</span>
        </div>
      </div>

    </div>

    <!-- Charts Grid (Middle Section) -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <!-- Asistencia y Rendimiento Semanal (Bar Chart) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm lg:col-span-3">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Rendimiento Semanal</h3>
            <p class="text-xs text-slate-400 mt-0.5">Comparativa de asistencia y promedio académico</p>
          </div>
          <select class="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 outline-none">
            <option>Última Semana</option>
            <option>Último Mes</option>
          </select>
        </div>

        <!-- Styled Bar Chart using SVG -->
        <div class="h-64 flex flex-col justify-between">
          <div class="flex-1 flex items-end justify-between px-2 sm:px-6 relative">
            <!-- Grid Lines -->
            <div class="absolute inset-x-0 h-[1px] bg-slate-100 dark:bg-slate-850" style="bottom: 25%;"></div>
            <div class="absolute inset-x-0 h-[1px] bg-slate-100 dark:bg-slate-850" style="bottom: 50%;"></div>
            <div class="absolute inset-x-0 h-[1px] bg-slate-100 dark:bg-slate-850" style="bottom: 75%;"></div>

            <!-- Mon -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 70%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 35%"></div>
              </div>
            </div>
            <!-- Tue -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 60%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 45%"></div>
              </div>
            </div>
            <!-- Wed -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 80%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 40%"></div>
              </div>
            </div>
            <!-- Thu -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 75%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 25%"></div>
              </div>
            </div>
            <!-- Fri -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 65%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 85%"></div>
              </div>
            </div>
            <!-- Sat -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 70%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 30%"></div>
              </div>
            </div>
            <!-- Sun -->
            <div class="flex flex-col items-center gap-2 group z-10 w-1/7">
              <div class="w-8 flex items-end gap-1 h-44 justify-center">
                <div class="w-3 bg-emerald-500 rounded-full transition-all duration-500" style="height: 45%"></div>
                <div class="w-3 bg-emerald-300 dark:bg-emerald-500/30 rounded-full transition-all duration-500" style="height: 90%"></div>
              </div>
            </div>

          </div>
          <!-- X-Axis Labels -->
          <div class="flex justify-between px-2 sm:px-6 mt-4 border-t border-slate-100 dark:border-slate-850 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span class="w-1/7 text-center">Lun</span>
            <span class="w-1/7 text-center">Mar</span>
            <span class="w-1/7 text-center">Mié</span>
            <span class="w-1/7 text-center">Jue</span>
            <span class="w-1/7 text-center">Vie</span>
            <span class="w-1/7 text-center">Sáb</span>
            <span class="w-1/7 text-center">Dom</span>
          </div>
        </div>

        <div class="flex justify-center gap-6 mt-6 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-2">
            <span class="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
            Asistencia (%)
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3.5 h-3.5 rounded-full bg-emerald-300 dark:bg-emerald-500/30"></span>
            Promedio Académico
          </div>
        </div>
      </div>

      <!-- Distribución por Nivel (Pie Chart) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-black text-slate-800 dark:text-white">Estudiantes por Nivel</h3>
          <p class="text-xs text-slate-400 mt-0.5">Distribución de matrícula escolar</p>
        </div>

        <!-- Clean Pie SVG -->
        <div class="my-6 flex justify-center items-center relative">
          <svg class="w-44 h-44" viewBox="0 0 36 36">
            <!-- Green block (Primaria) - 60% -->
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4.2" stroke-dasharray="60 40" stroke-dashoffset="25"></circle>
            <!-- Emerald light (Secundaria) - 30% -->
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34d399" stroke-width="4.2" stroke-dasharray="30 70" stroke-dashoffset="-35"></circle>
            <!-- White/Gray block (Preescolar) - 10% -->
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a7f3d0" stroke-width="4.2" stroke-dasharray="10 90" stroke-dashoffset="-65"></circle>
          </svg>
        </div>

        <div class="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Primaria</span>
            </div>
            <span>60%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span>Secundaria</span>
            </div>
            <span>30%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-500/20"></span>
              <span>Preescolar</span>
            </div>
            <span>10%</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Section: Recent Activities & Top Classes -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <!-- Recent Sales (Actividades Recientes) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm lg:col-span-3">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-white">Últimas Actividades</h3>
          <button class="px-4 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors">Ver Todo</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-850 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th class="pb-3 pl-2">Estudiante</th>
                <th class="pb-3">Actividad</th>
                <th class="pb-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-850/40 text-sm">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                <td class="py-4 pl-2 font-bold text-slate-800 dark:text-slate-200">Juan Pérez García</td>
                <td class="py-4 text-slate-500 dark:text-slate-400">Calificación en Matemáticas</td>
                <td class="py-4 text-right">
                  <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg">Aprobado</span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                <td class="py-4 pl-2 font-bold text-slate-800 dark:text-slate-200">María López Silva</td>
                <td class="py-4 text-slate-500 dark:text-slate-400">Pago Matrícula Mensual</td>
                <td class="py-4 text-right">
                  <span class="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold px-2.5 py-1 rounded-lg">Completado</span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                <td class="py-4 pl-2 font-bold text-slate-800 dark:text-slate-200">Carlos Rodríguez</td>
                <td class="py-4 text-slate-500 dark:text-slate-400">Inscripción a Taller Arte</td>
                <td class="py-4 text-right">
                  <span class="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">Pendiente</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Products (Clases Destacadas) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-sm lg:col-span-2">
        <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-white mb-6">Clases y Cursos Activos</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-2xl transition-all">
            <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black text-lg">
              M
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">Matemáticas Avanzadas</p>
              <p class="text-xs text-slate-400 mt-0.5">3ro Secundaria • Prof. Roberto</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-slate-700 dark:text-slate-300">95% asis.</span>
            </div>
          </div>

          <div class="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-2xl transition-all">
            <div class="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center font-black text-lg">
              F
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">Física Teórica</p>
              <p class="text-xs text-slate-400 mt-0.5">2do Secundaria • Prof. Laura</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-slate-700 dark:text-slate-300">92% asis.</span>
            </div>
          </div>

          <div class="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-2xl transition-all">
            <div class="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center font-black text-lg">
              H
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">Historia Universal</p>
              <p class="text-xs text-slate-400 mt-0.5">1ro Secundaria • Prof. Miguel</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-slate-700 dark:text-slate-300">88% asis.</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
</script>
