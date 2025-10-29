import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { webFlowService } from '@/services'
import type { ExtractedAPI, WebFlowConfig } from '@/types'

export interface WebFlowDetails {
  id: number
  name: string
  description?: string
  icon: string
  tags: string[]
  isFolder: boolean
  hasOpenApiConfig: boolean
  openApiConfigType?: 'SERVER' | 'FILE'
  openApiServerUrl?: string
  openApiFileId?: number
  hasPostmanCollection: boolean
  postmanFileId?: number
  basePath?: string
  parentId?: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface WebFlowEnvLink {
  id: number
  name: string
  description?: string
  configs: any[]
}

export const useWebflowPlaygroundStore = defineStore('webflowPlayground', () => {
  // State
  const webflowDetails = ref<WebFlowDetails | null>(null)
  const webflowConfig = ref<WebFlowConfig | null>(null)
  const webflowEnvLinks = ref<WebFlowEnvLink[]>([])
  const openapiApis = ref<ExtractedAPI[]>([])
  
  const isLoadingDetails = ref(false)
  const isLoadingConfig = ref(false)
  const isLoadingEnvLinks = ref(false)
  
  const error = ref<string | null>(null)
  const currentWebFlowId = ref<number | null>(null)

  // Getters
  const isLoading = computed(() => 
    isLoadingDetails.value || isLoadingConfig.value || isLoadingEnvLinks.value
  )
  const hasError = computed(() => error.value !== null)

  // Actions
  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const setCurrentWebFlowId = (id: number) => {
    currentWebFlowId.value = id
  }

  // Load webflow details
  const loadWebflowDetails = async (webFlowId: number) => {
    try {
      isLoadingDetails.value = true
      clearError()
      
      const response = await webFlowService.getById(webFlowId)
      webflowDetails.value = response.webFlow as WebFlowDetails
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load webflow details')
    } finally {
      isLoadingDetails.value = false
    }
  }

  // Load webflow config
  const loadWebflowConfig = async (webFlowId: number) => {
    try {
      isLoadingConfig.value = true
      clearError()
      
      const response = await webFlowService.getConfig(webFlowId)
      webflowConfig.value = response.config
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load webflow config')
    } finally {
      isLoadingConfig.value = false
    }
  }

  // Load webflow environment links
  const loadWebflowEnvLinks = async (webFlowId: number, page = 1, limit = 100) => {
    try {
      isLoadingEnvLinks.value = true
      clearError()
      
      const response = await webFlowService.getLinkedEnvFiles(webFlowId, page, limit)
      webflowEnvLinks.value = response.envFiles as WebFlowEnvLink[]
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load webflow environment links')
    } finally {
      isLoadingEnvLinks.value = false
    }
  }

  const loadWebflowOpenApiDocs = async (webFlowId: number) => {
    try {
      clearError()
      
      const response = await webFlowService.getOpenApiDocs(webFlowId)
      openapiApis.value = response.openApiDocs as ExtractedAPI[]
    } catch {
      openapiApis.value = []
    }
  }

  // Load all data for a webflow
  const loadAll = async (webFlowId: number) => {
    setCurrentWebFlowId(webFlowId)
    
    // Load all data in parallel
    await Promise.all([
      loadWebflowDetails(webFlowId),
      loadWebflowConfig(webFlowId),
      loadWebflowEnvLinks(webFlowId),
      loadWebflowOpenApiDocs(webFlowId)
    ])
  }

  // Update webflow config
  const updateWebflowConfig = async ( nodes: any[], edges: any[]) => {
    try {
      isLoadingConfig.value = true
      clearError()
      if (currentWebFlowId.value === null) {
        throw new Error('No current webflow selected')
      }
      const response = await webFlowService.updateConfig(currentWebFlowId.value, nodes, edges)
      webflowConfig.value = response.config
      return response
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update webflow config')
      throw err
    } finally {
      isLoadingConfig.value = false
    }
  }

  // Reset store
  const reset = () => {
    webflowDetails.value = null
    webflowConfig.value = null
    webflowEnvLinks.value = []
    isLoadingDetails.value = false
    isLoadingConfig.value = false
    isLoadingEnvLinks.value = false
    error.value = null
    currentWebFlowId.value = null
  }

  return {
    // State
    webflowDetails: computed(() => webflowDetails.value),
    webflowConfig: computed(() => webflowConfig.value),
    webflowEnvLinks: computed(() => webflowEnvLinks.value),
    currentWebFlowId: computed(() => currentWebFlowId.value),
    openapiApis: computed(() => openapiApis.value),
    
    // Loading states
    isLoadingDetails: computed(() => isLoadingDetails.value),
    isLoadingConfig: computed(() => isLoadingConfig.value),
    isLoadingEnvLinks: computed(() => isLoadingEnvLinks.value),
    isLoading,
    
    // Error state
    error: computed(() => error.value),
    hasError,

    // Actions
    setError,
    clearError,
    setCurrentWebFlowId,
    loadWebflowDetails,
    loadWebflowConfig,
    loadWebflowEnvLinks,
    loadAll,
    updateWebflowConfig,
    reset
  }
})
