import { http } from './http'
import type { WebFlowExecutionSummary } from './webflow'

export interface WebFlowSchedule {
  id: number
  userId: number
  webFlowId: number
  name: string | null
  cronExpression: string
  timezone: string
  enabled: boolean
  envFileId: number | null
  nextRunAt: string | null
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
  webFlow?: { id: number; name: string }
  lastExecution?: {
    id: number
    status: string
    errorSummary: string | null
    createdAt: string
  } | null
}

export interface CreateSchedulePayload {
  webFlowId: number
  name?: string
  cronExpression: string
  timezone?: string
  enabled?: boolean
  envFileId?: number | null
}

export interface UpdateSchedulePayload {
  name?: string | null
  cronExpression?: string
  timezone?: string
  enabled?: boolean
  envFileId?: number | null
}

export const scheduleService = {
  async list() {
    const { data } = await http.get<{ schedules: WebFlowSchedule[] }>('/schedules')
    return data.schedules
  },

  async getById(id: number) {
    const { data } = await http.get<{ schedule: WebFlowSchedule }>(`/schedules/${id}`)
    return data.schedule
  },

  async create(payload: CreateSchedulePayload) {
    const { data } = await http.post<{ schedule: WebFlowSchedule }>('/schedules', payload)
    return data.schedule
  },

  async update(id: number, payload: UpdateSchedulePayload) {
    const { data } = await http.put<{ schedule: WebFlowSchedule }>(`/schedules/${id}`, payload)
    return data.schedule
  },

  async remove(id: number) {
    await http.delete(`/schedules/${id}`)
  },

  async listExecutions(scheduleId: number, page = 1, limit = 20) {
    const { data } = await http.get<{
      executions: WebFlowExecutionSummary[]
      pagination: { page: number; limit: number; total: number; pages: number }
    }>(`/schedules/${scheduleId}/executions`, { params: { page, limit } })
    return data
  },
}
