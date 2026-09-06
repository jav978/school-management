<template>
  <Teleport to="body">
    <div 
      class="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      aria-live="polite"
    >
      <TransitionGroup 
        name="toast" 
        tag="div" 
        class="flex flex-col gap-2.5 w-full"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto rounded-2xl p-4 border shadow-xl backdrop-blur-xl transition-all duration-300 flex items-start gap-3.5',
            styleMap[toast.type]?.container || styleMap.info.container
          ]"
        >
          <!-- Icon Badge -->
          <div 
            :class="[
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base shadow-xs',
              styleMap[toast.type]?.iconBox || styleMap.info.iconBox
            ]"
          >
            {{ styleMap[toast.type]?.icon || 'ℹ️' }}
          </div>

          <!-- Message Body -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-xs font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white">
                {{ toast.title || styleMap[toast.type]?.defaultTitle }}
              </h4>
              <span 
                :class="[
                  'text-[9px] font-black uppercase px-2 py-0.5 rounded-full border',
                  styleMap[toast.type]?.badge
                ]"
              >
                {{ styleMap[toast.type]?.badgeText }}
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words font-sans">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button 
            @click="removeToast(toast.id)" 
            class="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
            title="Cerrar notificación"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const styleMap = {
  success: {
    container: 'bg-white/95 dark:bg-[#1b1145]/95 border-emerald-500/40 dark:border-emerald-400/40 shadow-emerald-500/10',
    iconBox: 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400',
    icon: '✅',
    defaultTitle: 'Operación Exitosa',
    badgeText: 'Éxito',
    badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  warning: {
    container: 'bg-white/95 dark:bg-[#1b1145]/95 border-amber-500/50 dark:border-brand-gold/50 shadow-amber-500/10',
    iconBox: 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-brand-gold',
    icon: '⚠️',
    defaultTitle: 'Aviso',
    badgeText: 'Atención',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-brand-gold border-amber-200 dark:border-amber-800'
  },
  error: {
    container: 'bg-white/95 dark:bg-[#1b1145]/95 border-red-500/50 dark:border-red-400/50 shadow-red-500/10',
    iconBox: 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    icon: '❌',
    defaultTitle: 'Error',
    badgeText: 'Error',
    badge: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
  },
  info: {
    container: 'bg-white/95 dark:bg-[#1b1145]/95 border-brand-purple/40 dark:border-brand-secondary/40 shadow-brand-purple/10',
    iconBox: 'bg-purple-50 dark:bg-brand-purple/30 border border-brand-purple/30 text-brand-primary dark:text-brand-secondary',
    icon: 'ℹ️',
    defaultTitle: 'Información',
    badgeText: 'Info',
    badge: 'bg-purple-50 dark:bg-brand-purple/30 text-brand-purple dark:text-brand-secondary border-brand-purple/20'
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>
