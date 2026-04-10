import type { EnvConfig } from './environment'
import { http } from './http'

export type OpenApiConfigType = 'SERVER' | 'FILE'

export interface WebFlowShareSettings {
  enabled: boolean
  shareToken: string | null
  /** App path, e.g. `/share/<token>` — prepend origin for a full URL. */
  publicPath: string | null
}

export interface WebFlow {
  id: number
  name: string
  description?: string
  icon?: string
  tags?: string[]
  isFolder: boolean
  hasOpenApiConfig: boolean
  openApiConfigType?: OpenApiConfigType
  openApiServerUrl?: string
  openApiFileId?: number | null
  hasPostmanCollection: boolean
  postmanFileId?: number | null
  basePath?: string
  parentId?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface PublicWebFlowSharePayload {
  webFlow: Pick<
    WebFlow,
    'id' | 'name' | 'description' | 'icon' | 'tags' | 'basePath' | 'hasOpenApiConfig'
  >
  config: {
    nodes: unknown[]
    edges: unknown[]
  }
}

export interface WebFlowListResponse {
  webFlows: WebFlow[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UpsertWebFlowPayload {
  name: string
  description?: string
  icon?: string
  tags?: string[]
  isFolder: boolean
  hasOpenApiConfig?: boolean
  openApiConfigType?: OpenApiConfigType
  openApiServerUrl?: string
  openApiFileId?: number | null
  hasPostmanCollection?: boolean
  postmanFileId?: number | null
  basePath?: string
  parentId?: number | null
}

export interface WebflowHierarchyItem {
  id: number
  name: string
  icon?: string
  isFolder: boolean
  parentId?: number | null
}

export interface WebflowLinkedEnvFiles {
    id: number
    name: string
    description?: string
    configs: EnvConfig[]
    linkedAt?: string
  }

export interface WebflowLinkedEnvFilesResponse {
  envFiles: Array<WebflowLinkedEnvFiles>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export type WebFlowExecutionStatus = 'running' | 'completed' | 'failed'

export interface WebFlowExecutionSummary {
  id: number
  webFlowId: number
  status: WebFlowExecutionStatus
  errorSummary: string | null
  createdAt: string
  updatedAt: string
}

export interface NodeTimelineEntry {
  nodeId: string
  nodeName: string | null
  nodeType: string
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' | 'SKIPPED' | string
  startedAt: string
  finishedAt?: string
  output?: unknown
  error?: string
  httpStatus?: number
}

export interface WebFlowExecutionDetail extends WebFlowExecutionSummary {
  nodeTimeline: NodeTimelineEntry[]
  /** Server execution variable pool (Variable.id → value); same shape as editor globalVariableStore. */
  variablePool?: Record<string, unknown> | null
}

export const webFlowService = {
  async list(parentId: number | null = null, page = 1, limit = 10000) {
    return http.get<WebFlowListResponse>('/web-flows', { params: { parentId, page, limit } }).then((res) => res.data)
  },
  async getById(id: number) {
    return http.get<{ webFlow: WebFlow }>(`/web-flows/${id}`).then((res) => res.data.webFlow)
  },
  async create(payload: UpsertWebFlowPayload) {
    return http.post<{ webFlow: WebFlow }>('/web-flows', payload).then((res) => res.data.webFlow)
  },
  async update(id: number, payload: UpsertWebFlowPayload) {
    return http.put<{ webFlow: WebFlow }>(`/web-flows/${id}`, payload).then((res) => res.data.webFlow)
  },
  async remove(id: number) {
    return http.delete(`/web-flows/${id}`)
  },
  async getHierarchy(id: number) {
    return http
      .get<{ hierarchy: WebflowHierarchyItem[]; targetId: number; totalLevels: number }>(`/web-flows/${id}/hierarchy`)
      .then((res) => res.data)
  },
  async getConfig(webFlowId: number) {
    return http.get<{ config: any }>(`/web-flows/${webFlowId}/config`).then((res) => res.data.config)
  },

  /** Unauthenticated snapshot for `/share/:token` (no env files or execution data). */
  async getPublicShareByToken(token: string) {
    return http
      .get<PublicWebFlowSharePayload>(`/public/web-flows/share/${encodeURIComponent(token)}`)
      .then((res) => res.data)
  },

  async getShareSettings(webFlowId: number) {
    return http
      .get<WebFlowShareSettings>(`/web-flows/${webFlowId}/share`)
      .then((res) => res.data)
  },

  async updateShareSettings(webFlowId: number, enabled: boolean) {
    return http
      .put<WebFlowShareSettings>(`/web-flows/${webFlowId}/share`, { enabled })
      .then((res) => res.data)
  },
    // Update web flow configuration
  async updateConfig(webFlowId: number, nodes: any[], edges: any[]): Promise<{ message: string; config: any }> {
    return http.put<{ message: string; config: any }>(`/web-flows/${webFlowId}/config`, {
      nodes,
      edges
    }).then((res) => res.data)
  },
  async getLinkedEnvFiles(webFlowId: number, page = 1, limit = 50) {
    return http
      .get<WebflowLinkedEnvFilesResponse>(`/web-flows/${webFlowId}/env-files`, { params: { page, limit } })
      .then((res) => res.data)
  },
  async linkEnvFile(webFlowId: number, envFileId: number) {
    return http.post<{ message: string }>(`/web-flows/link-env`, { webFlowId, envFileId }).then((res) => res.data)
  },
  async unlinkEnvFile(webFlowId: number, envFileId: number) {
    return http.delete<{ message: string }>(`/web-flows/${webFlowId}/env-files/${envFileId}`).then((res) => res.data)
  },
  async getOpenApiDocs(webFlowId: number): Promise<{ openApiDocs: any }> {
    const response = await http.get<{ openApiDocs: any }>(`/web-flows/${webFlowId}/openapi-docs`)
    return response.data
  },
  async createFromImport(importData: any): Promise<{ message: string; webFlow: WebFlow }> {
    const response = await http.post<{ message: string; webFlow: WebFlow }>('/web-flows/import', importData)
    return response.data
  },

  async startServerExecution(webFlowId: number, env: Record<string, string>) {
    const { data } = await http.post<{
      message: string
      execution: { id: number; status: WebFlowExecutionStatus; webFlowId: number }
    }>(`/web-flows/${webFlowId}/execute`, { env })
    return data.execution
  },

  async listExecutions(webFlowId: number, page = 1, limit = 20, q?: string) {
    const { data } = await http.get<{
      executions: WebFlowExecutionSummary[]
      pagination: { page: number; limit: number; total: number; pages: number }
    }>(`/web-flows/${webFlowId}/executions`, {
      params: { page, limit, ...(q != null && q !== '' ? { q } : {}) },
    })
    return data
  },

  async getExecution(webFlowId: number, executionId: number) {
    const { data } = await http.get<{ execution: WebFlowExecutionDetail }>(
      `/web-flows/${webFlowId}/executions/${executionId}`
    )
    return data.execution
  },

  async waitForExecution(
    webFlowId: number,
    executionId: number,
    intervalMs = 800,
    maxAttempts = 120
  ): Promise<WebFlowExecutionDetail> {
    for (let i = 0; i < maxAttempts; i++) {
      const execution = await webFlowService.getExecution(webFlowId, executionId)
      if (execution.status !== 'running') {
        return execution
      }
      await new Promise((r) => setTimeout(r, intervalMs))
    }
    return webFlowService.getExecution(webFlowId, executionId)
  },
}
