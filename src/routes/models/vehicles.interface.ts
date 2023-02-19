import { VehicleType } from './vehicle-type.interface'

export interface Vehicle {
  createdAt: string
  updatedAt: string
  licensePlate: string
  provider: string
  carrier: string
  imei: string
  brand: string
  model: string
  lastMaintenance: string
  vehicleType: VehicleType
}
