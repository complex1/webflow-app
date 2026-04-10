import { http } from './http'
import type { User } from './user'

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  register(payload: RegisterPayload) {
    return http.post<AuthResponse>('/auth/register', payload).then((res) => res.data)
  },
  login(payload: LoginPayload) {
    return http.post<AuthResponse>('/auth/login', payload).then((res) => res.data)
  }
}
