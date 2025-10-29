import type { WebflowHierarchy, WebFlowConfig } from '@/types'
import http from './http'

export interface WebFlow {
  id: number
  name: string
  description: string
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

export interface CreateWebFlowRequest {
  name: string
  description?: string
  icon?: string
  tags?: string[]
  isFolder?: boolean
  hasOpenApiConfig?: boolean
  openApiConfigType?: 'SERVER' | 'FILE'
  openApiServerUrl?: string
  openApiFileId?: number
  hasPostmanCollection?: boolean
  postmanFileId?: number
  basePath?: string
  parentId?: number
}

export interface UpdateWebFlowRequest {
  name?: string
  description?: string
  icon?: string
  tags?: string[]
  isFolder?: boolean
  hasOpenApiConfig?: boolean
  openApiConfigType?: 'SERVER' | 'FILE'
  openApiServerUrl?: string
  openApiFileId?: number
  hasPostmanCollection?: boolean
  postmanFileId?: number
  basePath?: string
  parentId?: number
}

export interface WebFlowsResponse {
  webFlows: WebFlow[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Web Flow services
export const webFlowService = {
  // Get all web flows
  async getAll(page = 1, limit = 10): Promise<WebFlowsResponse> {
    const response = await http.get<WebFlowsResponse>('/web-flows', {
      params: { page, limit }
    })
    return response.data
  },

  // Get web flow by ID
  async getById(id: number): Promise<{ webFlow: WebFlow }> {
    const response = await http.get<{ webFlow: WebFlow }>(`/web-flows/${id}`)
    return response.data
  },

  // Create new web flow
  async create(webFlowData: CreateWebFlowRequest): Promise<{ message: string; webFlow: WebFlow }> {
    const response = await http.post<{ message: string; webFlow: WebFlow }>('/web-flows', webFlowData)
    return response.data
  },

  // Update web flow
  async update(id: number, webFlowData: UpdateWebFlowRequest): Promise<{ message: string; webFlow: WebFlow }> {
    const response = await http.put<{ message: string; webFlow: WebFlow }>(`/web-flows/${id}`, webFlowData)
    return response.data
  },

  // Delete web flow
  async delete(id: number): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(`/web-flows/${id}`)
    return response.data
  },

  // Search web flows
  async search(query: string, page = 1, limit = 10): Promise<WebFlowsResponse> {
    const response = await http.get<WebFlowsResponse>('/web-flows/search', {
      params: { q: query, page, limit }
    })
    return response.data
  },

  // Get web flows by parent ID (for folder structure)
  async getByParentId(parentId: number | null, page = 1, limit = 10): Promise<WebFlowsResponse> {
    const response = await http.get<WebFlowsResponse>('/web-flows', {
      params: { parentId, page, limit }
    })
    return response.data
  },

  // Get root web flows (no parent)
  async getRootWebFlows(page = 1, limit = 10): Promise<WebFlowsResponse> {
    return this.getByParentId(null, page, limit)
  },

  // Move web flow to different parent
  async moveToParent(webFlowId: number, parentId: number | null): Promise<{ message: string; webFlow: WebFlow }> {
    const response = await http.patch<{ message: string; webFlow: WebFlow }>(`/web-flows/${webFlowId}/move`, {
      parentId
    })
    return response.data
  },

  async getHierarchy(id: number): Promise<{ hierarchy: WebflowHierarchy[], targetId: number, totalLevels: number }> {
    const response = await http.get<{ hierarchy: WebflowHierarchy[], targetId: number, totalLevels: number }>(`/web-flows/${id}/hierarchy`)
    return response.data
  },

  // Get environment files linked to a web flow
  async getLinkedEnvFiles(webFlowId: number, page = 1, limit = 10): Promise<{ envFiles: any[], pagination: { page: number, limit: number, total: number, pages: number } }> {
    const response = await http.get<{ envFiles: any[], pagination: { page: number, limit: number, total: number, pages: number } }>(`/web-flows/${webFlowId}/env-files`, {
      params: { page, limit }
    })
    return response.data
  },

  async linkToEnvFile(webFlowId: number, envFileId: number): Promise<{ message: string }> {
    const response = await http.post<{ message: string }>(`/web-flows/link-env`, { webFlowId, envFileId })
    return response.data
  },

  async unlinkFromEnvFile(webFlowId: number, envFileId: number): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(`/web-flows/${webFlowId}/env-files/${envFileId}`)
    return response.data
  },

  // Get web flow configuration
  async getConfig(webFlowId: number): Promise<{ config: WebFlowConfig }> {
    const response = await http.get<{ config: WebFlowConfig }>(`/web-flows/${webFlowId}/config`)
    return response.data
  },

  // Update web flow configuration
  async updateConfig(webFlowId: number, nodes: any[], edges: any[]): Promise<{ message: string; config: WebFlowConfig }> {
    const response = await http.put<{ message: string; config: WebFlowConfig }>(`/web-flows/${webFlowId}/config`, {
      nodes,
      edges
    })
    return response.data
  },

  async getOpenApiDocs(webFlowId: number): Promise<{ openApiDocs: any }> {
    const response = await http.get<{ openApiDocs: any }>(`/web-flows/${webFlowId}/openapi-docs`)
    return response.data
  }
}
