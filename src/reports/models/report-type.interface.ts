import { VehicleType } from '@/routes/models/vehicle-type.interface'

export interface ReportType {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  vehicleTypes: VehicleType[]
}
