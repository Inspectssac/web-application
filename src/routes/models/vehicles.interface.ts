import { VehicleType } from './vehicle-type.interface'

export interface Vehicle {
  createdAt: string
  updatedAt: string
  licensePlate: string
  provider: string
  company: string
  imei: string
  brand: string
  model: string
  lastMaintenance: string
  soatExpiration: string
  technicalReviewExpiration: string
  vehicleType: VehicleType
}
