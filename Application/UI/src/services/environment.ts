import { http } from './http'

export interface EnvConfig {
  key: string
  value: string
  description?: string
}

export interface EnvFile {
  id: number
  name: string
  description?: string
  configs: EnvConfig[]
  updatedAt?: string
}

export interface EnvListResponse {
  envFiles: EnvFile[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}

export const environmentService = {
  list(page = 1, limit = 10) {
    return http.get<EnvListResponse>('/env-files', { params: { page, limit } }).then((res) => res.data)
  },
  async search(query = '', page = 1, limit = 10) {
    const res = await http.get<EnvListResponse>('/env-files', { params: { page, limit } })
    if (!query.trim()) return res.data

    const searchValue = query.toLowerCase()
    const filtered = res.data.envFiles.filter((env) => {
      const matchesName = env.name.toLowerCase().includes(searchValue)
      const matchesDescription = env.description ? env.description.toLowerCase().includes(searchValue) : false
      return matchesName || matchesDescription
    })

    return {
      envFiles: filtered,
      pagination: {
        page: 1,
        limit,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        totalItems: filtered.length
      }
    }
  },
  create(payload: { name: string; description?: string; configs: EnvConfig[] }) {
    return http.post<{ envFile: EnvFile }>('/env-files', payload).then((res) => res.data.envFile)
  },
  update(id: number, payload: { name: string; description?: string; configs: EnvConfig[] }) {
    return http.put<{ envFile: EnvFile }>(`/env-files/${id}`, payload).then((res) => res.data.envFile)
  },
  remove(id: number) {
    return http.delete(`/env-files/${id}`)
  }
}
