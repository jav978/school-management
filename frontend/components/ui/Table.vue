<template>
  <div class="overflow-x-auto w-full border border-slate-100 rounded-xl bg-white shadow-sm/50">
    <table class="table table-zebra w-full font-sans">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50/50">
          <th
            v-for="column in columns"
            :key="column.key"
            class="text-left py-4 px-4 font-bold font-display text-slate-500 uppercase tracking-wider text-xs"
            :class="column.class"
          >
            {{ column.label }}
          </th>
          <th v-if="$slots.actions" class="text-left py-4 px-4 font-bold font-display text-slate-500 uppercase tracking-wider text-xs">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id || index"
          class="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="py-3.5 px-4 text-sm text-slate-600"
            :class="column.class"
          >
            <slot :name="`column-${column.key}`" :item="item" :value="item[column.key]">
              {{ item[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="py-3.5 px-4">
            <slot name="actions" :item="item" :index="index" />
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="py-12 text-center text-slate-400 font-medium">
            <div class="flex flex-col items-center justify-center space-y-2">
              <svg class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2m-10 0H4" />
              </svg>
              <span class="text-sm">No hay datos disponibles</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})
</script>

