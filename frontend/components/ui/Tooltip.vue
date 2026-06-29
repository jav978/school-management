<template>
  <div class="relative inline-block" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Transition name="tooltip">
      <div
        v-if="show"
        :class="[
          'absolute z-10 px-3 py-2 text-sm font-medium text-white rounded-lg shadow-sm',
          positionClasses[position],
          colorClasses[color]
        ]"
      >
        {{ text }}
        <div :class="['absolute w-2 h-2 rotate-45', arrowClasses[position], colorClasses[color]]"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  color: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  }
})

const show = ref(false)

const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
}

const arrowClasses = {
  top: 'bottom-[-4px] left-1/2 transform -translate-x-1/2',
  bottom: 'top-[-4px] left-1/2 transform -translate-x-1/2',
  left: 'right-[-4px] top-1/2 transform -translate-y-1/2',
  right: 'left-[-4px] top-1/2 transform -translate-y-1/2'
}

const colorClasses = {
  dark: 'bg-gray-900',
  light: 'bg-white text-gray-900 border border-gray-200'
}
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
