import { AppServices } from '@/shared/service/app-api.service'
import { VehicleDto } from '../models/interface/vehicle-dto.interface'
import { Vehicle } from '../models/vehicles.interface'

export class VehiclesService extends AppServices {
  constructor () {
    super({ baseUrl: 'vehicles', contentType: 'application/json' })
  }

  findAll = async (): Promise<Vehicle[]> => {
    return await this.get<Vehicle[]>('')
      .then(response => response.data)
  }

  create = async (vehicleTypeId: string, vehicleDto: VehicleDto): Promise<Vehicle> => {
    return await this.post<Vehicle>(`/${vehicleTypeId}`, vehicleDto)
      .then(response => response.data)
  }

  update = async (licensePlate: string, vehicleDto: VehicleDto): Promise<Vehicle> => {
    return await this.patch<Vehicle>(`/${licensePlate}`, vehicleDto)
      .then(response => response.data)
  }

  remove = async (licensePlate: string): Promise<Vehicle> => {
    return await this.delete<Vehicle>(`/${licensePlate}`)
      .then(response => response.data)
  }
}
