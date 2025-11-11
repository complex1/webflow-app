<template>
  <div class="docs-code-block">
    <!-- Code Header -->
    <div class="docs-code-header" v-if="language || showCopy">
      <span class="docs-code-language" v-if="language">{{ language }}</span>
      <button 
        v-if="showCopy" 
        class="docs-code-copy"
        @click="copyCode"
        :disabled="copying"
      >
        <i class="fas fa-copy" v-if="!copying"></i>
        <i class="fas fa-check" v-else></i>
        {{ copying ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <!-- Code Content -->
    <pre class="docs-code"><code>{{ formattedCode }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  code: string
  language?: string
  showCopy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCopy: true
})

const copying = ref(false)

const formattedCode = computed(() => {
  return props.code.trim()
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(formattedCode.value)
    copying.value = true
    setTimeout(() => {
      copying.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<style scoped>
/* Styles are inherited from documentation.css */
</style>