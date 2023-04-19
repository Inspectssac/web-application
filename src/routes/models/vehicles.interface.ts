import { type VehicleType } from './vehicle-type.interface'

export interface Vehicle {
  createdAt: string
  updatedAt: string
  active: boolean
  licensePlate: string
  provider: string
  company: string
  companyWhoHires: string
  imei: string
  brand: string
  model: string
  lastMaintenance: string
  soatExpiration: string
  technicalReviewExpiration: string
  vehicleType: VehicleType
}
