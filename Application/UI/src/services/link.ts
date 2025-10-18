import http from './http'

export interface WebFlowEnvFileLink {
  id: number
  webFlowId: number
  envFileId: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreateLinkRequest {
  webFlowId: number
  envFileId: number
}

export interface LinksResponse {
  links: WebFlowEnvFileLink[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Web Flow - Environment File Link services
export const linkService = {
  // Get all links
  async getAll(page = 1, limit = 10): Promise<LinksResponse> {
    const response = await http.get<LinksResponse>('/links', {
      params: { page, limit }
    })
    return response.data
  },

  // Get link by ID
  async getById(id: number): Promise<{ link: WebFlowEnvFileLink }> {
    const response = await http.get<{ link: WebFlowEnvFileLink }>(`/links/${id}`)
    return response.data
  },

  // Create new link
  async create(linkData: CreateLinkRequest): Promise<{ message: string; link: WebFlowEnvFileLink }> {
    const response = await http.post<{ message: string; link: WebFlowEnvFileLink }>('/links', linkData)
    return response.data
  },

  // Delete link
  async delete(id: number): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(`/links/${id}`)
    return response.data
  },

  // Get links by web flow ID
  async getByWebFlowId(webFlowId: number): Promise<{ links: WebFlowEnvFileLink[] }> {
    const response = await http.get<{ links: WebFlowEnvFileLink[] }>(`/links/web-flow/${webFlowId}`)
    return response.data
  },

  // Get links by environment file ID
  async getByEnvFileId(envFileId: number): Promise<{ links: WebFlowEnvFileLink[] }> {
    const response = await http.get<{ links: WebFlowEnvFileLink[] }>(`/links/env-file/${envFileId}`)
    return response.data
  },

  // Bulk create links
  async bulkCreate(linksData: CreateLinkRequest[]): Promise<{ message: string; links: WebFlowEnvFileLink[] }> {
    const response = await http.post<{ message: string; links: WebFlowEnvFileLink[] }>('/links/bulk', {
      links: linksData
    })
    return response.data
  },

  // Bulk delete links
  async bulkDelete(linkIds: number[]): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>('/links/bulk', {
      data: { linkIds }
    })
    return response.data
  }
}
