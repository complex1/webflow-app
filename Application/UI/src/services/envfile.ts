import type { Pagination } from '@/types'
import http from './http'

export interface EnvConfig {
  id: number
  key: string
  description: string
  value: string
}

export interface EnvFile {
  id: number
  name: string
  description: string
  configs: EnvConfig[]
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreateEnvFileRequest {
  name: string
  description?: string
  configs: EnvConfig[]
}

export interface UpdateEnvFileRequest {
  name?: string
  description?: string
  configs?: EnvConfig[]
}

export interface EnvFilesResponse {
  envFiles: EnvFile[]
  pagination: Pagination
}

// Environment File services
export const envFileService = {
  // Get all environment files
  async getAll(page = 1, limit = 10): Promise<EnvFilesResponse> {
    const response = await http.get<EnvFilesResponse>('/env-files', {
      params: { page, limit }
    })
    return response.data
  },

  // Get environment file by ID
  async getById(id: number): Promise<{ envFile: EnvFile }> {
    const response = await http.get<{ envFile: EnvFile }>(`/env-files/${id}`)
    return response.data
  },

  // Create new environment file
  async create(envFileData: CreateEnvFileRequest): Promise<{ message: string; envFile: EnvFile }> {
    const response = await http.post<{ message: string; envFile: EnvFile }>('/env-files', envFileData)
    return response.data
  },

  // Update environment file
  async update(id: number, envFileData: UpdateEnvFileRequest): Promise<{ message: string; envFile: EnvFile }> {
    const response = await http.put<{ message: string; envFile: EnvFile }>(`/env-files/${id}`, envFileData)
    return response.data
  },

  // Delete environment file
  async delete(id: number): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(`/env-files/${id}`)
    return response.data
  },

  // Search environment files
  async search(query: string, page = 1, limit = 10): Promise<EnvFilesResponse> {
    const response = await http.get<EnvFilesResponse>('/env-files/search', {
      params: { q: query, page, limit }
    })
    return response.data
  }
}
