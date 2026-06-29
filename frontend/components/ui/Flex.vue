<template>
  <div :class="['flex', directionClasses[direction], justifyClasses[justify], alignClasses[align], gapClasses[gap], wrap ? 'flex-wrap' : '']">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    default: 'row',
    validator: (value) => ['row', 'col'].includes(value)
  },
  justify: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end', 'center', 'between', 'around'].includes(value)
  },
  align: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end', 'center', 'stretch'].includes(value)
  },
  gap: {
    type: Number,
    default: 0
  },
  wrap: {
    type: Boolean,
    default: false
  }
})

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col'
}

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around'
}

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch'
}

const gapClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12'
}
</script>
