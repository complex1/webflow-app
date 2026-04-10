<template>
  <FormField :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id }">
      <div class="af-dropdown" ref="rootRef">
        <button class="af-dropdown__control" type="button" :id="id" @click="toggle">
          <span>{{ selectedOption?.label || placeholder }}</span>
          <Icon name="chevron-down" />
        </button>

        <Transition name="af-scale">
          <div v-if="open" class="af-dropdown__panel">
            <div class="af-dropdown__search">
              <Icon name="search" />
              <input v-model="query" type="text" placeholder="Search" />
            </div>
            <div class="af-dropdown__list">
              <button
                v-for="option in filteredOptions"
                :key="String(option.value)"
                type="button"
                :class="{ 'is-active': option.value === modelValue }"
                @click="select(option.value)"
              >
                {{ option.label }}
              </button>
              <p v-if="!filteredOptions.length" class="af-dropdown__empty">No results</p>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import FormField from './FormField.vue'
import Icon from '@/components/common/utils/Icon.vue'

interface Option {
  label: string
  value: string | number | boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | boolean | null
    options: Option[]
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    required?: boolean
  }>(),
  {
    placeholder: 'Select option'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | boolean | null): void }>()

const open = ref(false)
const query = ref('')
const rootRef = ref<HTMLElement | null>(null)

const filteredOptions = computed(() =>
  props.options.filter((option) => option.label.toLowerCase().includes(query.value.toLowerCase()))
)

const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue))

const toggle = () => {
  open.value = !open.value
}

const select = (value: string | number | boolean) => {
  emit('update:modelValue', value)
  open.value = false
  query.value = ''
}

const onDocumentClick = (event: MouseEvent) => {
  if (!rootRef.value?.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.af-dropdown {
  position: relative;
}

.af-dropdown__control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
}

.af-dropdown__panel {
  position: absolute;
  inset: auto 0 0 0;
  transform: translateY(calc(100% + 8px));
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: var(--z-overlay);
}

.af-dropdown__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
}

.af-dropdown__search input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  outline: none;
}

.af-dropdown__list {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.af-dropdown__list button {
  padding: 8px 12px;
  background: transparent;
  border: none;
  text-align: left;
  color: var(--text-secondary);
  cursor: pointer;
}

.af-dropdown__list button.is-active {
  background: color-mix(in srgb, var(--accent-blue) 20%, transparent);
  color: var(--text-primary);
}

.af-dropdown__empty {
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-3);
}

.af-scale-enter-active,
.af-scale-leave-active {
  transition: opacity var(--transition-default), transform var(--transition-default);
  transform-origin: top;
}

.af-scale-enter-from,
.af-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
