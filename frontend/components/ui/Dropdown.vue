<template>
  <div class="relative" ref="dropdownRef">
    <div @click="toggle">
      <slot name="trigger" />
    </div>
    
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
const isOpen = ref(false)
const dropdownRef = ref(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', close)
})

onUnmounted(() => {
  document.removeEventListener('click', close)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
