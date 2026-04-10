<template>
  <div class="code-block">
    <button type="button" class="copy-btn" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    <pre>{{ text }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  text: string
}>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}
</script>
