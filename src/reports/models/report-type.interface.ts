import { type VehicleType } from '@/routes/models/vehicle-type.interface'

export interface ReportType {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  vehicleTypes: VehicleType[]
}
