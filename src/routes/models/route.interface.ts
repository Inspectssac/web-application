import { RouteProfile } from '@/profiles/models/route-profile.interface'
import { Report } from '@/reports/models/report.interface'
import { Vehicle } from './vehicles.interface'

export interface Route {
  id: string
  createdAt: string
  updatedAt: string
  startLocation: string
  endLocation: string
  materialType: string
  name: string
  checked: boolean
  doubleLicensePlate: boolean
  isFull: boolean
  vehicles: Vehicle[]
  reports: Report[]
  routeProfiles: RouteProfile[]
}
