import { defineStore } from 'pinia'
import { ref } from 'vue'
import { webFlowService, type WebFlow, type WebflowLinkedEnvFilesResponse } from '@/services/webflow'
import type { ExtractedAPI } from '@/types'

type WebflowConfig = any

export const useWebflowEditorStore = defineStore('webflowEditor', () => {
  const webflow = ref<WebFlow | null>(null)
  const webflowConfig = ref<WebflowConfig | null>(null)
  const linkedEnvFiles = ref<WebflowLinkedEnvFilesResponse['envFiles']>([])
  const openapiApis = ref<ExtractedAPI[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const reset = () => {
    webflow.value = null
    webflowConfig.value = null
    linkedEnvFiles.value = []
    openapiApis.value = []
    isLoading.value = false
    isSaving.value = false
    error.value = null
  }

  const load = async (webflowId: number, onLoad: any) => {
    if (!webflowId) {
      error.value = 'Webflow id is required'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const [webflowDetails, config, envLinks] = await Promise.all([
        webFlowService.getById(webflowId),
        webFlowService.getConfig(webflowId),
        webFlowService.getLinkedEnvFiles(webflowId),
      ])
      webflow.value = webflowDetails
      webflowConfig.value = config
      linkedEnvFiles.value = envLinks?.envFiles || []
      if (webflow.value.hasOpenApiConfig) {
        webFlowService.getOpenApiDocs(webflowId)
          .then(({ openApiDocs }) => {
            openapiApis.value = openApiDocs || []
          })
      }
      onLoad(config)
    } catch (err: any) {
      error.value = err?.message || 'Failed to load webflow data'
    } finally {
      isLoading.value = false
    }
  }

  const updateWebflowConfig = async ( nodes: any[], edges: any[]) => {
    try {
      isSaving.value = true
      if (webflow.value === null) {
        throw new Error('No current webflow selected')
      }
      const response = await webFlowService.updateConfig(webflow.value.id, nodes, edges)
      webflowConfig.value = response.config
      return response
    } catch (err: any) {
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    webflow,
    webflowConfig,
    linkedEnvFiles,
    openapiApis,
    isLoading,
    isSaving,
    error,
    load,
    reset,
    updateWebflowConfig,
  }
})
