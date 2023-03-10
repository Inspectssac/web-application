import { Profile } from '@/profiles/models/profile.entity'
import { Observation } from './observation.interface'

export interface Checkpoint {
  id: number
  checked: boolean
  location: string
  observations: Observation[]
  profile: Profile
}
