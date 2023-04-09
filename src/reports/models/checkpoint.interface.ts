import { type Profile } from '@/profiles/models/profile.entity'
import { type Observation } from './observation.interface'

export interface Checkpoint {
  id: string
  checked: boolean
  location: string
  observations: Observation[]
  profile: Profile
}
