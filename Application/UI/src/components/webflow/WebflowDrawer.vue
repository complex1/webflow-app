<template>
  <Drawer :open="open" :title="form.id ? 'Edit web flow' : 'Create web flow'" @close="$emit('close')">
    <form class="webflow-form" @submit.prevent="submit">
      <Stack gap="lg">
        <Stack gap="sm">
          <FormField label="Type" :hint="isEditing ? 'Type cannot be changed when editing' : undefined" required>
            <template #default>
              <div class="radio-group">
                <label v-for="option in typeOptions" :key="option.value" class="radio-option">
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="form.type"
                    :disabled="isEditing"
                  />
                  <span>{{ option.label }}</span>
                </label>
              </div>
            </template>
          </FormField>
          <SelectInput v-model="form.icon" label="Icon" :options="iconOptions" hint="Prime icon key" />
          <TextInput v-model="form.name" label="Name" placeholder="Workspace API" required />
          <TextareaInput v-model="form.description" label="Description" :rows="3" />
          <FormField label="Tags" hint="Press enter to add a tag">
            <template #default="{ id }">
              <div class="tag-input">
                <input
                  :id="id"
                  v-model="tagDraft"
                  type="text"
                  placeholder="security, billing"
                  @keydown.enter.prevent="addTag"
                />
                <Button type="button" size="sm" variant="ghost" @click="addTag">Add</Button>
              </div>
            </template>
          </FormField>
          <div v-if="form.tags.length" class="tag-list">
            <span v-for="tag in form.tags" :key="tag" class="tag">
              {{ tag }}
              <button type="button" @click="removeTag(tag)" aria-label="Remove tag">&times;</button>
            </span>
          </div>
          <TextInput
            v-if="!isFolder"
            v-model="form.basePath"
            label="Base path"
            placeholder="/api/v1"
            hint="Optional. Must start with /"
          />
        </Stack>

        <Stack v-if="!isFolder" gap="sm">
          <Inline justify="space-between" align="center">
            <div>
              <Text variant="sm" tone="secondary">OpenAPI configuration</Text>
              <Text variant="xs" tone="muted">Link a server URL or upload a file.</Text>
            </div>
            <Switch v-model="form.hasOpenApiConfig">Enable</Switch>
          </Inline>

          <div v-if="form.hasOpenApiConfig" class="section-surface">
            <FormField label="Source">
              <template #default>
                <div class="radio-group">
                  <label v-for="option in openApiOptions" :key="option.value" class="radio-option">
                    <input type="radio" :value="option.value" v-model="form.openApiConfigType" />
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </template>
            </FormField>
            <TextInput
              v-if="form.openApiConfigType === 'SERVER'"
              v-model="form.openApiServerUrl"
              label="Server URL"
              placeholder="https://api.example.com/openapi.json"
            />
            <div v-else class="file-field">
              <label>OpenAPI file</label>
              <FileUpload v-model="form.openApiFileId" accept=".json,.yaml,.yml" />
            </div>
          </div>

          <Inline justify="space-between" align="center">
            <div>
              <Text variant="sm" tone="secondary">Postman collection</Text>
              <Text variant="xs" tone="muted">Attach a Postman collection to this flow.</Text>
            </div>
            <Switch v-model="form.hasPostmanCollection">Enable</Switch>
          </Inline>

          <div v-if="form.hasPostmanCollection" class="file-field">
            <label>Collection file</label>
            <FileUpload v-model="form.postmanFileId" accept=".json" />
          </div>
        </Stack>

        <ErrorText v-if="formError">{{ formError }}</ErrorText>

        <Inline gap="sm" justify="flex-end">
          <Button variant="ghost" type="button" @click="$emit('close')">Cancel</Button>
          <Button type="submit">Save</Button>
        </Inline>
      </Stack>
    </form>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Drawer } from '@/components/common/overlay'
import { Stack, Inline } from '@/components/common/foundation'
import { TextInput, TextareaInput, SelectInput, Switch, ErrorText, FormField } from '@/components/common/forms'
import { Button } from '@/components/common/buttons'
import { Text } from '@/components/common/typography'
import { FileUpload } from '@/components/common/fileupload'
import type { WebFlow, OpenApiConfigType } from '@/services/webflow'

const props = defineProps<{
  open: boolean
  webflow: WebFlow | null
}>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'save', payload: any): void }>()

type WebflowType = 'flow' | 'folder'

const route = useRoute()

const getParentIdFromQuery = () => {
  const queryValue = route.query.id
  if (!queryValue) return null
  const value = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const createDefaultForm = () => ({
  id: null as number | null,
  type: 'flow' as WebflowType,
  icon: 'sitemap',
  name: '',
  description: '',
  tags: [] as string[],
  basePath: '',
  hasOpenApiConfig: false,
  openApiConfigType: 'SERVER' as OpenApiConfigType,
  openApiServerUrl: '',
  openApiFileId: null as number | null,
  hasPostmanCollection: false,
  postmanFileId: null as number | null,
  parentId: getParentIdFromQuery()
})

const form = reactive(createDefaultForm())
const tagDraft = ref('')
const formError = ref('')

const isFolder = computed(() => form.type === 'folder')
const isEditing = computed(() => form.id !== null)

const typeOptions = [
  { label: 'Web flow (file)', value: 'flow' },
  { label: 'Folder', value: 'folder' }
]

const iconOptions = [
  { label: 'Sitemap', value: 'sitemap' },
  { label: 'Folder', value: 'folder' },
  { label: 'Folder open', value: 'folder-open' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Database', value: 'database' },
  { label: 'Send', value: 'send' },
  { label: 'Table', value: 'table' },
  { label: 'Bolt', value: 'bolt' }
]

const openApiOptions = [
  { label: 'Server URL', value: 'SERVER' },
  { label: 'File upload', value: 'FILE' }
]

const resetForm = () => {
  Object.assign(form, createDefaultForm())
}

const populateForm = (webflow: WebFlow | null) => {
  resetForm()
  if (!webflow) return
  form.id = webflow.id
  form.type = webflow.isFolder ? 'folder' : 'flow'
  form.icon = webflow.icon || 'sitemap'
  form.name = webflow.name
  form.description = webflow.description || ''
  form.tags = [...(webflow.tags || [])]
  form.basePath = webflow.basePath || ''
  form.hasOpenApiConfig = !!webflow.hasOpenApiConfig
  form.openApiConfigType = (webflow.openApiConfigType as OpenApiConfigType) || 'SERVER'
  form.openApiServerUrl = webflow.openApiServerUrl || ''
  form.openApiFileId = webflow.openApiFileId ?? null
  form.hasPostmanCollection = !!webflow.hasPostmanCollection
  form.postmanFileId = webflow.postmanFileId ?? null
  form.parentId = webflow.parentId ?? null
}

watch(
  () => props.webflow,
  (value) => {
    populateForm(value)
  },
  { immediate: true }
)

watch(
  () => props.open,
  (opened) => {
    if (opened && !props.webflow) {
      resetForm()
    }
  }
)

watch(
  () => route.query.id,
  () => {
    if (!isEditing.value) {
      form.parentId = getParentIdFromQuery()
    }
  }
)

watch(isFolder, (folder) => {
  if (folder) {
    form.basePath = ''
    form.hasOpenApiConfig = false
    form.hasPostmanCollection = false
  }
})

const addTag = () => {
  const tag = tagDraft.value.trim()
  if (!tag) return
  if (!form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagDraft.value = ''
}

const removeTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index >= 0) {
    form.tags.splice(index, 1)
  }
}

const validate = () => {
  formError.value = ''
  if (!form.name.trim()) {
    formError.value = 'Name is required.'
    return false
  }
  if (!isFolder.value && form.basePath && !form.basePath.startsWith('/')) {
    formError.value = 'Base path must start with /.'
    return false
  }
  if (!isFolder.value && form.hasOpenApiConfig && form.openApiConfigType === 'SERVER') {
    if (!form.openApiServerUrl.trim()) {
      formError.value = 'Server URL is required for OpenAPI.'
      return false
    }
  }
  return true
}

const submit = () => {
  if (!validate()) return
  const payload = {
    id: form.id,
    name: form.name.trim(),
    description: form.description?.trim() || undefined,
    icon: form.icon,
    tags: [...form.tags],
    isFolder: isFolder.value,
    basePath: !isFolder.value && form.basePath ? form.basePath : undefined,
    hasOpenApiConfig: !isFolder.value ? form.hasOpenApiConfig : false,
    openApiConfigType:
      !isFolder.value && form.hasOpenApiConfig ? form.openApiConfigType : undefined,
    openApiServerUrl:
      !isFolder.value && form.hasOpenApiConfig && form.openApiConfigType === 'SERVER'
        ? form.openApiServerUrl
        : undefined,
    openApiFileId:
      !isFolder.value && form.hasOpenApiConfig && form.openApiConfigType === 'FILE'
        ? form.openApiFileId ?? undefined
        : undefined,
    hasPostmanCollection: !isFolder.value ? form.hasPostmanCollection : false,
    postmanFileId:
      !isFolder.value && form.hasPostmanCollection ? form.postmanFileId ?? undefined : undefined,
    parentId: form.parentId ?? undefined
  }
  emit('save', payload)
}
</script>

<style scoped>
.webflow-form {
  min-width: 360px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag-input {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.tag-input input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--accent-blue) 20%, transparent);
  font-size: var(--text-xs);
}

.tag button {
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.radio-option {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
}

.radio-option input {
  accent-color: var(--accent-blue);
}

.radio-option input:disabled + span {
  opacity: 0.6;
}

.section-surface {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.file-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.file-field label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
