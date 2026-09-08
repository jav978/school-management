<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50 to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-8 rounded-3xl text-slate-900 dark:text-white border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
      <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest rounded-full border border-orange-500/30">
            Manual del Sistema EduFlow
          </span>
          <span class="text-slate-500 dark:text-slate-400 text-xs font-mono">v2.4.0 — U.E Santa Luisa</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
          Arquitectura, Entidades y Normativas
        </h1>
        <p class="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
          Documentación técnica y operativa completa del sistema de gestión escolar adaptado a las regulaciones del Ministerio del Poder Popular para la Educación (MPPE) de Venezuela.
        </p>
      </div>

      <div class="relative z-10 flex items-center gap-3">
        <a 
          href="/EduFlow _ Base44.pdf" 
          target="_blank"
          class="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold text-sm transition-all flex items-center gap-2 shadow-xs dark:shadow-none"
        >
          <svg class="w-4 h-4 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF Base
        </a>
      </div>
    </div>

    <!-- Quick Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-sm font-bold">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id 
          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
        class="px-5 py-2 rounded-xl transition-all whitespace-nowrap"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- TAB 1: 20 ENTIDADES DEL SISTEMA -->
    <div v-if="activeTab === 'entities'" class="space-y-6">
      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <input 
            v-model="entitySearch" 
            type="text" 
            placeholder="Buscar entidad, tabla o campo..." 
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-orange-500 dark:text-white"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="selectedCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Entity Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="(ent, idx) in filteredEntities" 
          :key="ent.table"
          class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                #{{ idx + 1 }} {{ ent.schema }}.{{ ent.table }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" :class="getCategoryBadge(ent.category)">
                {{ ent.category }}
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">
              {{ ent.name }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {{ ent.description }}
            </p>

            <div class="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
              <div><strong class="text-orange-500">PK:</strong> {{ ent.pk }}</div>
              <div><strong class="text-indigo-400">Endpoint:</strong> /api/{{ ent.endpoint }}</div>
              <div><strong class="text-emerald-500">Campos clave:</strong> {{ ent.fields.join(', ') }}</div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span class="text-slate-400">Relaciones:</span>
            <span class="font-bold text-slate-700 dark:text-slate-200">{{ ent.relations }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: NORMATIVA DE EVALUACIÓN VENEZOLANA -->
    <div v-else-if="activeTab === 'normativa'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Escala Numérica (1-20) -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">
              1-20
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">
                Educación Media General y Técnica
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Gaceta Oficial MPPE / Ley Orgánica de Educación
              </p>
            </div>
          </div>

          <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>• <strong>Escala Cuantitativa:</strong> Del 01 al 20 puntos con nota mínima aprobatoria de <strong>10 puntos</strong>.</p>
            <p>• <strong>Distribución del Período:</strong> 3 Lapsos Académicos independientes ponderados por promedio simple o ponderado institucional.</p>
            <p>• <strong>Composición Evaluativa:</strong> 70% Evaluaciones formativas continuas (talleres, tareas, pruebas cortas) + 30% Evaluación Integral de Lapso o Proyecto Científico.</p>
            <p>• <strong>Recuperación (Superación Pedagógica):</strong> Los estudiantes con calificación menor a 10 puntos tienen derecho constitucional a actividades pedagógicas remediables antes del cierre de lapso.</p>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">Rangos de Rendimiento</h4>
            <div class="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              <div class="p-2 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">01 - 09<br><span class="font-normal text-[10px]">Aplazado</span></div>
              <div class="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">10 - 13<br><span class="font-normal text-[10px]">Regular</span></div>
              <div class="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">14 - 17<br><span class="font-normal text-[10px]">Bueno</span></div>
              <div class="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">18 - 20<br><span class="font-normal text-[10px]">Excelente</span></div>
            </div>
          </div>
        </div>

        <!-- Escala Literal (A - E) -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-lg">
              A-E
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">
                Educación Inicial y Primaria
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Evaluación Cualitativa y Descriptiva por Competencias
              </p>
            </div>
          </div>

          <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>• <strong>A:</strong> El estudiante alcanzó todas las competencias del grado e incluso superó las expectativas del currículo.</p>
            <p>• <strong>B:</strong> El estudiante alcanzó todas las competencias previstas para el grado escolar de manera satisfactoria.</p>
            <p>• <strong>C:</strong> El estudiante alcanzó la mayoría de las competencias pero requiere afianzar algunos contenidos específicos.</p>
            <p>• <strong>D:</strong> El estudiante alcanzó algunas de las competencias y requiere acompañamiento pedagógico reforzado.</p>
            <p>• <strong>E:</strong> El estudiante no logró alcanzar las competencias esenciales previstas para el nivel o grado escolar.</p>
          </div>

          <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Informe Descriptivo Obligatorio:</strong> En los niveles de Primaria e Inicial, cada boleta incluye un apartado descriptivo con las observaciones del docente sobre el desarrollo socioemocional, psicomotor y cognitivo.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: MATRIZ DE ROLES Y PERMISOS -->
    <div v-else-if="activeTab === 'roles'" class="space-y-6">
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm overflow-x-auto">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Matriz de Acceso por Rol (EduFlow 6 Roles)
        </h3>

        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-black">
              <th class="py-3 px-4">Módulo / Capacidad</th>
              <th class="py-3 px-2 text-center">Admin</th>
              <th class="py-3 px-2 text-center">Control de Estudio</th>
              <th class="py-3 px-2 text-center">Coordinador</th>
              <th class="py-3 px-2 text-center">Docente</th>
              <th class="py-3 px-2 text-center">Estudiante</th>
              <th class="py-3 px-2 text-center">Representante</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-300">
            <tr v-for="perm in roleMatrix" :key="perm.module">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">{{ perm.module }}</td>
              <td class="py-3 px-2 text-center"><span :class="perm.admin ? 'text-emerald-500 font-black' : 'text-slate-300'">{{ perm.admin ? '✓ Total' : '-' }}</span></td>
              <td class="py-3 px-2 text-center"><span :class="perm.control ? 'text-emerald-500 font-black' : 'text-slate-300'">{{ perm.control ? '✓ Sí' : '-' }}</span></td>
              <td class="py-3 px-2 text-center"><span :class="perm.coord ? 'text-emerald-500 font-black' : 'text-slate-300'">{{ perm.coord ? '✓ Sí' : '-' }}</span></td>
              <td class="py-3 px-2 text-center"><span :class="perm.teacher ? 'text-indigo-500 font-black' : 'text-slate-300'">{{ perm.teacher ? '✓ Sus Clases' : '-' }}</span></td>
              <td class="py-3 px-2 text-center"><span :class="perm.student ? 'text-blue-500 font-black' : 'text-slate-300'">{{ perm.student ? '👁 Lectura' : '-' }}</span></td>
              <td class="py-3 px-2 text-center"><span :class="perm.parent ? 'text-blue-500 font-black' : 'text-slate-300'">{{ perm.parent ? '👁 Representados' : '-' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: ARQUITECTURA TÉCNICA Y DIAGRAMAS -->
    <div v-else-if="activeTab === 'architecture'" class="space-y-8">
      <!-- Banner Informativo de Ubicación de Archivos -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/20 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Diagrama Guardado en Repositorio
            </span>
            <span class="text-xs font-mono text-slate-400">docs/ARCHITECTURE.md</span>
          </div>
          <h2 class="text-xl font-black font-display text-white">
            Topología de Ejecución, Fronteras de Confianza & 2FA
          </h2>
          <p class="text-xs text-slate-300 max-w-3xl leading-relaxed">
            El diagrama de arquitectura fue generado y persistido en el repositorio en dos formatos: 
            <code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-amber-300">docs/ARCHITECTURE.md</code> (Mermaid y especificación completa) y 
            <code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-sky-300">docs/architecture-runtime.excalidraw</code> (lienzo vectorial editable).
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <div class="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Frontend: Port 3001
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Backend: Port 3031
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            PostgreSQL: Port 5432
          </div>
        </div>
      </div>

      <!-- MAPA VISUAL DE LAS 4 ZONAS DE CONFIANZA -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-indigo-500"></span>
              Mapa de Zonas y Componentes (12 Componentes en Tiempo de Ejecución)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Visualización por fronteras de confianza (Trust Boundaries) de izquierda a derecha.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <!-- ZONA 1: CLIENTE -->
          <div class="bg-indigo-50/60 dark:bg-indigo-950/20 rounded-3xl p-5 border-2 border-indigo-200 dark:border-indigo-900/50 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800 pb-2">
                <span class="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Zona 1: Cliente
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                  Untrusted Tier
                </span>
              </div>

              <!-- Comp 1 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-indigo-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">#1 Nuxt 3 SPA / PWA</span>
                  <span class="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Port 3001</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Vue 3 Composition API, Vite, Tailwind v4, Pinia Auth Store y generador de boletas con QR.
                </p>
              </div>

              <!-- Comp 2 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-indigo-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-purple-600 dark:text-purple-400">#2 Guardia Global Rutas</span>
                  <span class="text-[10px] font-mono bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded text-purple-600">auth.global.ts</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Bloqueo estricto de rutas si 2FA está pendiente (`/auth/2fa-challenge`) y verificación de RBAC.
                </p>
              </div>

              <!-- Comp 12 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-amber-200 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-amber-600 dark:text-amber-400">#12 App Autenticadora</span>
                  <span class="text-[10px] font-mono bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded text-amber-600">RFC 6238</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Google Authenticator, Aegis o Microsoft Authenticator (códigos TOTP de 6 dígitos cada 30s).
                </p>
              </div>
            </div>

            <!-- Tarjeta Detalle Zona 1 -->
            <div class="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
              <strong class="font-bold block">Tarjeta de Apoyo: Cliente</strong>
              <div>• Manejador de errores en <code>error.vue</code></div>
              <div>• Redirección dinámica por Rol (6 roles)</div>
              <div>• Persistencia segura en sessionStorage</div>
            </div>
          </div>

          <!-- ZONA 2: INGRESS & PERÍMETRO -->
          <div class="bg-rose-50/60 dark:bg-rose-950/20 rounded-3xl p-5 border-2 border-rose-200 dark:border-rose-900/50 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-rose-200 dark:border-rose-800 pb-2">
                <span class="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Zona 2: Perímetro
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold">
                  Ingress & WAF
                </span>
              </div>

              <!-- Comp 3 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-rose-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-rose-600 dark:text-rose-400">#3 Rate Limiter Guard</span>
                  <span class="text-[10px] font-mono bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-rose-600">Anti-DDoS</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  15 intentos/15 min en autenticación (mitigación de fuerza bruta) y 300 req/min en API.
                </p>
              </div>

              <!-- Comp 4 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-rose-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-amber-600 dark:text-amber-400">#4 Filtro Helmet & CORS</span>
                  <span class="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Cabeceras</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Protección HSTS, X-Content-Type-Options: nosniff, bloqueo de iframes (clickjacking) y límite body 2MB.
                </p>
              </div>
            </div>

            <!-- Tarjeta Detalle Zona 2 -->
            <div class="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
              <strong class="font-bold block">Tarjeta de Apoyo: Ingress</strong>
              <div>• Filtro en <code>backend/src/middleware/rate-limiter.js</code></div>
              <div>• Corta tráfico malicioso antes del ORM</div>
              <div>• Respuestas HTTP 429 estandarizadas</div>
            </div>
          </div>

          <!-- ZONA 3: CORE APPLICATION TIER -->
          <div class="bg-purple-50/60 dark:bg-purple-950/20 rounded-3xl p-5 border-2 border-purple-200 dark:border-purple-900/50 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-2">
                <span class="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Zona 3: App Core
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold">
                  Private App Tier
                </span>
              </div>

              <!-- Comp 5 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-purple-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-purple-600 dark:text-purple-400">#5 Servidor Feathers</span>
                  <span class="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Port 3031</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Microframework modular en Node.js, despacho REST y WebSockets en tiempo real.
                </p>
              </div>

              <!-- Comp 6 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-purple-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-blue-600 dark:text-blue-400">#6 Motor 2FA & Auth</span>
                  <span class="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded text-blue-600">otplib</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Servicio <code>/api/two-factor</code> (setup, enable, disable, challenge) con backup codes hasheados.
                </p>
              </div>

              <!-- Comp 7 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-purple-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">#7 Servicios Escolares</span>
                  <span class="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-600">20 Servicios</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Estudiantes, Docentes, Secciones, Calificaciones MPPE, Asistencia, Horarios, Pagos, etc.
                </p>
              </div>

              <!-- Comp 8 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-purple-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-cyan-600 dark:text-cyan-400">#8 Resilient Error Handler</span>
                  <span class="text-[10px] font-mono bg-cyan-100 dark:bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-600">Fail-safe</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Enmascara errores SQL/Postgres, genera errorId único y previene caídas por <code>uncaughtException</code>.
                </p>
              </div>
            </div>

            <!-- Tarjeta Detalle Zona 3 -->
            <div class="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
              <strong class="font-bold block">Tarjeta de Apoyo: App Core</strong>
              <div>• Tokens temporales de 2FA aislados (5m de expiración)</div>
              <div>• 8 Códigos de Respaldo Bcrypt de 8 caracteres</div>
              <div>• Hook global deniega acceso si 2FA pendiente</div>
            </div>
          </div>

          <!-- ZONA 4: SECURE DATA TIER -->
          <div class="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-3xl p-5 border-2 border-emerald-200 dark:border-emerald-900/50 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                <span class="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Zona 4: Datos
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
                  Secure Storage
                </span>
              </div>

              <!-- Comp 9 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-emerald-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">#9 Knex.js Query Builder</span>
                  <span class="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-600">ORM / Pool</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Pool de conexiones, transacciones atómicas y migraciones versionadas en <code>backend/migrations</code>.
                </p>
              </div>

              <!-- Comp 10 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-emerald-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-teal-600 dark:text-teal-400">#10 PostgreSQL Relacional</span>
                  <span class="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Port 5432</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Esquema <code>school.*</code> con 20 tablas, índices B-Tree de cédula y relaciones con integridad referencial.
                </p>
              </div>

              <!-- Comp 11 -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-emerald-100 dark:border-slate-700 shadow-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black text-green-600 dark:text-green-400">#11 Storage de Archivos</span>
                  <span class="text-[10px] font-mono bg-green-100 dark:bg-green-950 px-1.5 py-0.5 rounded text-green-600">Local Uploads</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Comprobantes de pago bancario, fotos institucionales y códigos QR de boletas generados localmente.
                </p>
              </div>
            </div>

            <!-- Tarjeta Detalle Zona 4 -->
            <div class="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
              <strong class="font-bold block">Tarjeta de Apoyo: Datos</strong>
              <div>• Passwords con Bcrypt Salt (10 rondas)</div>
              <div>• Secretos 2FA en reposo en <code>school.users</code></div>
              <div>• Base de datos inaccesible fuera de red interna</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RUTA PRIMARIA DE EJECUCIÓN (PRIMARY PATH STEP-BY-STEP) -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Ruta Primaria de Ejecución (Primary Execution Path)
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span class="text-xs font-black text-indigo-500">Paso 1: Solicitud</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">Credenciales</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              El cliente envía POST <code>/authentication</code> con correo y contraseña.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span class="text-xs font-black text-rose-500">Paso 2: Ingress</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">Rate Limiter</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Verifica ventana de 15 intentos en 15 min. Si se excede, devuelve 429.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span class="text-xs font-black text-amber-500">Paso 3: 2FA Check</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">Desafío TOTP</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Si el usuario activó 2FA, recibe token temporal y valida código de 6 dígitos en <code>/auth/2fa-challenge</code>.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span class="text-xs font-black text-purple-500">Paso 4: Autorización</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">JWT & RBAC</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Emisión de token JWT definitivo con rol escolar y restricciones de acceso.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span class="text-xs font-black text-emerald-500">Paso 5: Persistencia</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">Knex + Postgres</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Servicios consultan la BD relacional bajo transacciones ACID en el esquema <code>school.*</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('entities')
const entitySearch = ref('')
const selectedCategory = ref('Todas')

const tabs = [
  { id: 'entities', label: '20 Entidades del Sistema' },
  { id: 'normativa', label: 'Normativa Evaluativa (1-20 & A-E)' },
  { id: 'roles', label: 'Matriz de Roles y Permisos' },
  { id: 'architecture', label: 'Arquitectura Técnica & Diagramas' }
]

const categories = ['Todas', 'Académico', 'Personal & Aulas', 'Evaluaciones', 'Credenciales & Reportes', 'Gestión']

const getCategoryBadge = (cat) => {
  switch (cat) {
    case 'Académico': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
    case 'Personal & Aulas': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
    case 'Evaluaciones': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
    case 'Credenciales & Reportes': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
    case 'Gestión': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const entities = [
  {
    schema: 'school',
    table: 'students',
    name: 'Estudiantes',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'students',
    fields: ['first_name', 'last_name', 'cedula', 'admission_no', 'current_class_id'],
    relations: 'parents, classes, grades, attendance, boletas, id_cards',
    description: 'Registro maestro del alumnado matriculado con cédula de identidad, escolaridad, ficha médica y contacto.'
  },
  {
    schema: 'school',
    table: 'teachers',
    name: 'Docentes',
    category: 'Personal & Aulas',
    pk: 'id (UUID)',
    endpoint: 'teachers',
    fields: ['first_name', 'last_name', 'employee_id', 'specialization', 'email'],
    relations: 'class_subjects, plannings, exams, timetables',
    description: 'Cuerpo docente con especialidad pedagógica, asignación de cátedra y carga horaria semanal.'
  },
  {
    schema: 'school',
    table: 'staff',
    name: 'Personal Administrativo y Obrero',
    category: 'Personal & Aulas',
    pk: 'id (UUID)',
    endpoint: 'staff',
    fields: ['first_name', 'last_name', 'cedula', 'department', 'position', 'status'],
    relations: 'users, id_cards',
    description: 'Personal de apoyo administrativo, coordinaciones, secretaría, biblioteca, servicios y mantenimiento.'
  },
  {
    schema: 'school',
    table: 'parents',
    name: 'Padres y Representantes',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'parents',
    fields: ['first_name', 'last_name', 'cedula', 'phone', 'relationship'],
    relations: 'students, payments, communications',
    description: 'Ficha del representante legal del estudiante para control de contacto, pagos y autorizaciones.'
  },
  {
    schema: 'school',
    table: 'classes',
    name: 'Grados, Años y Secciones',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'classes',
    fields: ['class_name', 'section', 'academic_year', 'capacity'],
    relations: 'classrooms, students, class_subjects, plannings',
    description: 'Secciones activas agrupadas por grado/año (ej. 1er Año A, 2do Año B, 6to Grado).'
  },
  {
    schema: 'school',
    table: 'classrooms',
    name: 'Aulas e Instalaciones',
    category: 'Personal & Aulas',
    pk: 'id (UUID)',
    endpoint: 'classrooms',
    fields: ['code', 'name', 'type', 'capacity', 'has_projector', 'has_air_conditioner'],
    relations: 'classes, timetables, events',
    description: 'Espacios físicos escolares: aulas ordinarias, laboratorios de física/química/computación, canchas y talleres.'
  },
  {
    schema: 'school',
    table: 'subjects',
    name: 'Asignaturas / Materias',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'subjects',
    fields: ['subject_name', 'code', 'credits', 'type'],
    relations: 'class_subjects, grades, exams, plannings',
    description: 'Catálogo de materias conforme al plan de estudios oficial del MPPE.'
  },
  {
    schema: 'school',
    table: 'class_subjects',
    name: 'Asignación Cátedra-Sección',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'class-subjects',
    fields: ['class_id', 'subject_id', 'teacher_id'],
    relations: 'classes, subjects, teachers, timetables, exams',
    description: 'Asignación de qué profesor dicta qué asignatura en qué sección específica.'
  },
  {
    schema: 'school',
    table: 'timetables',
    name: 'Horarios de Clases',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'timetables',
    fields: ['class_subject_id', 'classroom_id', 'day_of_week', 'start_time', 'end_time'],
    relations: 'class_subjects, classrooms',
    description: 'Bloques horarios semanales con validación de cruces de profesores y disponibilidad de aulas.'
  },
  {
    schema: 'school',
    table: 'plannings',
    name: 'Planificaciones Académicas',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'plannings',
    fields: ['teacher_id', 'class_id', 'subject_id', 'term', 'week_number', 'topic', 'status'],
    relations: 'teachers, classes, subjects',
    description: 'Plan de clase semanal y por lapso con objetivos pedagógicos, recursos, estrategias y estado de aprobación.'
  },
  {
    schema: 'school',
    table: 'exams',
    name: 'Exámenes y Evaluaciones',
    category: 'Evaluaciones',
    pk: 'id (UUID)',
    endpoint: 'exams',
    fields: ['class_subject_id', 'title', 'term', 'exam_date', 'total_marks', 'type'],
    relations: 'class_subjects, exam_questions, grades',
    description: 'Cabecera de evaluación programada con fecha, lapso, puntuación máxima y tipo de evaluación.'
  },
  {
    schema: 'school',
    table: 'exam_questions',
    name: 'Reactivos / Preguntas de Examen',
    category: 'Evaluaciones',
    pk: 'id (UUID)',
    endpoint: 'exam-questions',
    fields: ['exam_id', 'order_num', 'question_text', 'question_type', 'marks', 'options'],
    relations: 'exams',
    description: 'Banco de preguntas con puntaje individual, opciones múltiples o desarrollo, apto para impresión.'
  },
  {
    schema: 'school',
    table: 'grades',
    name: 'Calificaciones de Estudiantes',
    category: 'Evaluaciones',
    pk: 'id (UUID)',
    endpoint: 'grades',
    fields: ['student_id', 'exam_id', 'marks_obtained', 'literal_grade', 'feedback'],
    relations: 'students, exams, boletas',
    description: 'Registro de calificaciones cuantitativas (0-20) y cualitativas (A-E) con observaciones pedagógicas.'
  },
  {
    schema: 'school',
    table: 'report_cards',
    name: 'Boletas de Calificaciones',
    category: 'Credenciales & Reportes',
    pk: 'id (UUID)',
    endpoint: 'report-cards',
    fields: ['student_id', 'academic_year', 'term', 'average_score', 'literal_grade', 'qr_code', 'model'],
    relations: 'students, grades',
    description: 'Boletas finales por lapso con 3 modelos visuales (Moderna, Clásica, Compacta) y validación QR.'
  },
  {
    schema: 'school',
    table: 'certificates',
    name: 'Diplomas y Reconocimientos',
    category: 'Credenciales & Reportes',
    pk: 'id (UUID)',
    endpoint: 'certificates',
    fields: ['student_id', 'title', 'issue_date', 'certificate_type', 'qr_code', 'signatures'],
    relations: 'students',
    description: 'Diplomas de honor al mérito, excelencia académica y culminación de etapa con firmas digitales.'
  },
  {
    schema: 'school',
    table: 'id_cards',
    name: 'Carnets de Identificación (CR80)',
    category: 'Credenciales & Reportes',
    pk: 'id (UUID)',
    endpoint: 'id-cards',
    fields: ['entity_type', 'entity_id', 'card_number', 'expiration_date', 'blood_type', 'qr_code'],
    relations: 'students, teachers, staff',
    description: 'Carnets estándar CR80 imprimibles (anverso/reverso) con foto, datos médicos y código QR de seguridad.'
  },
  {
    schema: 'school',
    table: 'attendance',
    name: 'Control de Asistencias',
    category: 'Académico',
    pk: 'id (UUID)',
    endpoint: 'attendance',
    fields: ['student_id', 'class_id', 'date', 'status', 'remarks'],
    relations: 'students, classes',
    description: 'Registro diario de presencia, retardo o inasistencia justificada, con soporte de escaneo QR.'
  },
  {
    schema: 'school',
    table: 'payments',
    name: 'Cobranzas y Mensualidades',
    category: 'Gestión',
    pk: 'id (UUID)',
    endpoint: 'payments',
    fields: ['student_id', 'amount', 'currency', 'payment_method', 'status', 'concept'],
    relations: 'students, parents',
    description: 'Control de pagos de matrícula, seguro escolar y mensualidades con soporte multimoneda (USD / Bs).'
  },
  {
    schema: 'school',
    table: 'communications',
    name: 'Circulares y Comunicados',
    category: 'Gestión',
    pk: 'id (UUID)',
    endpoint: 'communications',
    fields: ['title', 'content', 'target_role', 'publish_date', 'priority'],
    relations: 'users',
    description: 'Tablón de anuncios, avisos urgentes y circulares a la comunidad educativa Santa Luisa.'
  },
  {
    schema: 'school',
    table: 'users',
    name: 'Usuarios del Sistema y Autenticación',
    category: 'Gestión',
    pk: 'id (UUID)',
    endpoint: 'users',
    fields: ['email', 'role', 'status', 'is_active', 'last_login'],
    relations: 'students, teachers, staff, parents',
    description: 'Cuentas de acceso protegidas por contraseñas con hash bcrypt y asignación estricta de uno de los 6 roles.'
  }
]

const filteredEntities = computed(() => {
  return entities.filter(ent => {
    const matchesCat = selectedCategory.value === 'Todas' || ent.category === selectedCategory.value
    const matchesSearch = !entitySearch.value || 
      ent.name.toLowerCase().includes(entitySearch.value.toLowerCase()) ||
      ent.table.toLowerCase().includes(entitySearch.value.toLowerCase()) ||
      ent.description.toLowerCase().includes(entitySearch.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})

const roleMatrix = [
  { module: 'Gestión de Estudiantes & Expedientes', admin: true, control: true, coord: true, teacher: false, student: false, parent: false },
  { module: 'Carga y Modificación de Calificaciones', admin: true, control: true, coord: true, teacher: true, student: false, parent: false },
  { module: 'Generación y Emisión de Boletas', admin: true, control: true, coord: true, teacher: false, student: false, parent: false },
  { module: 'Planificación Semanal de Cátedra', admin: true, control: false, coord: true, teacher: true, student: false, parent: false },
  { module: 'Creación de Exámenes y Reactivos', admin: true, control: false, coord: true, teacher: true, student: false, parent: false },
  { module: 'Control de Aulas e Instalaciones', admin: true, control: true, coord: true, teacher: false, student: false, parent: false },
  { module: 'Emisión de Carnets y Diplomas', admin: true, control: true, coord: true, teacher: false, student: false, parent: false },
  { module: 'Control de Asistencias Diarias', admin: true, control: true, coord: true, teacher: true, student: false, parent: false },
  { module: 'Módulo Financiero y Cobranzas', admin: true, control: false, coord: false, teacher: false, student: false, parent: true },
  { module: 'Tablón de Avisos y Circulares', admin: true, control: true, coord: true, teacher: true, student: true, parent: true },
  { module: 'Administración de Usuarios y Seguridad', admin: true, control: false, coord: false, teacher: false, student: false, parent: false }
]
</script>
