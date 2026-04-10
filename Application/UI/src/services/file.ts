import { http } from './http'

export interface FileRecord {
  id: number
  name: string
  originalName?: string
  mimetype?: string
  size: number
}

export const fileService = {
  upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post<{ file: FileRecord; message?: string }>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => res.data)
  },
  delete(id: number) {
    return http.delete<{ message?: string }>(`/files/${id}`).then((res) => res.data)
  },
  download(id: number) {
    return http.get(`/files/${id}/download`, { responseType: 'blob' }).then((res) => res.data)
  },
  getById(id: number) {
    return http.get<{ file: FileRecord }>(`/files/${id}`).then((res) => res.data)
  }
}
