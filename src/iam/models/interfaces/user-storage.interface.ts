import { type Profile } from '@/profiles/models/profile.entity'
import { type Area } from '../user.model'

export interface UserStorage {
  id: string
  role: string
  areas: Area[]
  username: string
  profile: Profile
}
