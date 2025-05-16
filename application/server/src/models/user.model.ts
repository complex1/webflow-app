export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  avatar: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}