import http from './http'
import type { User } from '@/stores/user'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  avatar?: string
  userType?: 'individual' | 'organization' | 'enterprise'
  userRole?: 'admin' | 'user' | 'moderator'
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface ProfileResponse {
  user: User
}

// User authentication services
export const userService = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/register', userData)
    return response.data
  },

  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    const response = await http.get<ProfileResponse>('/auth/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ProfileResponse> {
    const response = await http.put<ProfileResponse>('/auth/profile', userData)
    return response.data
  },

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await http.put<{ message: string }>('/auth/change-password', data)
    return response.data
  },

  // Delete user account
  async deleteAccount(): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>('/auth/account')
    return response.data
  }
}
