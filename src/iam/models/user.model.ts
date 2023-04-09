import { type UserRole } from '@/admin/models/role.enum'
import { type Profile } from '@/profiles/models/profile.entity'

export interface User {
  updatedAt: string
  createdAt: string
  id: string
  username: string
  password: string
  active: boolean
  role: UserRole
  areas: Area[]
  profile: Profile
}

export interface Area {
  id: string
  name: string
  updatedAt: string
  createdAt: string
}
