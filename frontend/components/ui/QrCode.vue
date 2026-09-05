<template>
  <div class="inline-flex items-center justify-center bg-white p-2 rounded-xl shadow-xs border border-slate-200/80">
    <img 
      v-if="qrDataUrl" 
      :src="qrDataUrl" 
      :alt="`QR Code: ${value}`" 
      :style="{ width: `${size}px`, height: `${size}px` }"
      class="object-contain"
    />
    <div 
      v-else 
      :style="{ width: `${size}px`, height: `${size}px` }"
      class="animate-pulse bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400"
    >
      Generando QR...
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 128
  },
  darkColor: {
    type: String,
    default: '#0f172a'
  },
  lightColor: {
    type: String,
    default: '#ffffff'
  }
})

const qrDataUrl = ref('')

const generateQr = async () => {
  if (!props.value) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(props.value, {
      width: props.size * 2,
      margin: 1,
      color: {
        dark: props.darkColor,
        light: props.lightColor
      }
    })
  } catch (err) {
    console.error('QR Code generation error:', err)
  }
}

watch(() => [props.value, props.size, props.darkColor], generateQr)
onMounted(generateQr)
</script>
