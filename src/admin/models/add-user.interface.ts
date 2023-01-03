import { UserRole } from './role.enum'

export interface AddUser {
  username: string
  password: string
  role: UserRole
}
