import { Profile } from './profile.entity'

export interface RouteProfile {
  profileId: number
  routeId: string
  role: string
  supervisor: boolean
  profile: Profile
}
