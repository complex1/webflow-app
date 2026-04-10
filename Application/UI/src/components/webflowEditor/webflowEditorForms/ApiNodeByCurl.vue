<template>
  <div class="curl-import">
    <TextareaInput
      v-model="curl"
      label="Paste cURL command"
      :rows="8"
      :error="error"
      placeholder="curl -X GET https://api.service/resource"
      hint="Supports URL, method, headers, query/body data. Uses parseCurlToHttpNode."
    />

    <div class="actions">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" @click="handleConvert">Convert to API node</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseCurlToHttpNode } from '@/apifluxCore/utils/curlCmd'
import type HttpNode from '@/apifluxCore/classes/httpNode'
import { TextareaInput } from '@/components/common/forms'
import { Button } from '@/components/common/buttons'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'converted', node: HttpNode): void
}>()

const curl = ref('')
const error = ref<string | undefined>('')

const handleConvert = () => {
  error.value = ''
  const { success, httpNode, error: parseError } = parseCurlToHttpNode(curl.value)
  if (!success || !httpNode) {
    error.value = parseError || 'Unable to parse cURL command'
    return
  }
  emit('converted', httpNode)
}
</script>

<style scoped>
.curl-import {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
