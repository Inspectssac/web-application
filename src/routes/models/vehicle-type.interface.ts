import { type Material } from './material.interface'

export interface VehicleType {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  materials: Material[]
  parent: VehicleType | null
  children: VehicleType[]
}

export const VEHICLE_TYPE_INITIAL_STATE: VehicleType = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  parent: null,
  materials: [],
  children: []
}
