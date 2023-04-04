import { Material } from './material.interface'

export interface VehicleType {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  materials: Material[]
}
