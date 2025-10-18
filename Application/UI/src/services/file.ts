import http from './http'

export interface File {
  id: number
  name: string
  originalName: string
  extension: string
  size: number
  url: string
  fileName: string
  mimetype?: string
  webFlowId?: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface UploadFileRequest {
  file: globalThis.File
  webFlowId?: number
}

export interface FilesResponse {
  files: File[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// File services
export const fileService = {
  // Get all files
  async getAll(page = 1, limit = 10): Promise<FilesResponse> {
    const response = await http.get<FilesResponse>('/files', {
      params: { page, limit }
    })
    return response.data
  },

  // Get file by ID
  async getById(id: number): Promise<{ file: File }> {
    const response = await http.get<{ file: File }>(`/files/${id}`)
    return response.data
  },

  // Upload file
  async upload(file: globalThis.File, webFlowId?: number): Promise<{ message: string; file: File }> {
    const formData = new FormData()
    formData.append('file', file)
    if (webFlowId) {
      formData.append('webFlowId', webFlowId.toString())
    }

    const response = await http.post<{ message: string; file: File }>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update file
  async update(id: number, fileData: Partial<File>): Promise<{ message: string; file: File }> {
    const response = await http.put<{ message: string; file: File }>(`/files/${id}`, fileData)
    return response.data
  },

  // Delete file
  async delete(id: number): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(`/files/${id}`)
    return response.data
  },

  // Download file
  async download(id: number): Promise<Blob> {
    const response = await http.get(`/files/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Get files by web flow ID
  async getByWebFlowId(webFlowId: number): Promise<{ files: File[] }> {
    const response = await http.get<{ files: File[] }>(`/files/web-flow/${webFlowId}`)
    return response.data
  },

  // Search files
  async search(query: string, page = 1, limit = 10): Promise<FilesResponse> {
    const response = await http.get<FilesResponse>('/files/search', {
      params: { q: query, page, limit }
    })
    return response.data
  },

  // Get file URL
  getFileUrl(fileName: string): string {
    return `${http.defaults.baseURL}/uploads/${fileName}`
  },

  // Bulk delete files
  async bulkDelete(fileIds: number[]): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>('/files/bulk', {
      data: { fileIds }
    })
    return response.data
  }
}
