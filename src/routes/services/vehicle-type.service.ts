import { AppServices } from '@/shared/service/app-api.service'
import { VehicleTypeDto } from '../models/interface/vehicle-type-dto.interface'
import { Material } from '../models/material.interface'
import { VehicleType } from '../models/vehicle-type.interface'

export class VehicleTypesService extends AppServices {
  constructor () {
    super({ baseUrl: 'vehicle-types', contentType: 'application/json' })
  }

  findAll = async (): Promise<VehicleType[]> => {
    return await this.get<VehicleType[]>('')
      .then(response => response.data)
  }

  create = async (vehicleTypeDto: VehicleTypeDto): Promise<VehicleType> => {
    return await this.post<VehicleType>('', vehicleTypeDto)
      .then(response => response.data)
  }

  update = async (id: number, vehicleTypeDto: VehicleTypeDto): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}`, vehicleTypeDto)
      .then(response => response.data)
  }

  remove = async (id: number): Promise<VehicleType> => {
    return await this.delete<VehicleType>(`/${id}`)
      .then(response => response.data)
  }

  findAllMaterials = async (id: number): Promise<Material[]> => {
    return await this.get<Material[]>(`/${id}/materials`)
      .then(response => response.data)
  }

  assignMaterial = async (id: number, materialId: number): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}/assign-material/${materialId}`)
      .then(response => response.data)
  }

  removeMaterial = async (id: number, materialId: number): Promise<VehicleType> => {
    return await this.delete<VehicleType>(`/${id}/remove-material/${materialId}`)
      .then(response => response.data)
  }
}
