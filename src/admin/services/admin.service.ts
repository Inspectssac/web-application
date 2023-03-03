import { User } from '@/iam/models/user.model'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { AppServices } from '@/shared/service/app-api.service'

export class AdminService extends AppServices {
  constructor () {
    super({ baseUrl: 'admin', contentType: 'application/json' })
  }

  importUserExcel = async (file: any): Promise<User[]> => {
    return await this.post<User[]>('/import-user-excel', file)
      .then(response => response.data)
  }

  importVehicleExcel = async (file: any): Promise<Vehicle[]> => {
    return await this.post<Vehicle[]>('/import-vehicle-excel', file)
      .then(response => response.data)
  }
}
