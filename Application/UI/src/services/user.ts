import { http } from './http'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  userType: 'individual' | 'organization' | 'enterprise'
  userRole: 'admin' | 'user' | 'moderator'
}

export interface ProfileResponse {
  user: User
}

export const userService = {
  // Get user profile
  getProfile() {
    return http.get<ProfileResponse>('/auth/profile').then((res) => res.data)
  },

  // Update user profile
  updateProfile(userData: Partial<User>) {
    return http.put<ProfileResponse>('/auth/profile', userData).then((res) => res.data)
  }
}
