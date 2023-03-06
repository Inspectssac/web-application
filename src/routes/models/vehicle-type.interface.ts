import { Material } from './material.interface'

export interface VehicleType {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  materials: Material[]
}
