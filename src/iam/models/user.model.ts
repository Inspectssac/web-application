import { UserRole } from '@/admin/models/role.enum'

export interface User {
  updatedAt: string
  createdAt: string
  id: string
  username: string
  password: string
  active: boolean
  role: UserRole
  areas: Area[]
}

export interface Area {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}
