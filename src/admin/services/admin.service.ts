import { AppServices } from '@/shared/service/app-api.service'
import { ExcelResponse } from '../models/excel-response.interface'

export class AdminService extends AppServices {
  constructor () {
    super({ baseUrl: 'admin', contentType: 'application/json' })
  }

  importUserExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-user-excel', file)
      .then(response => response.data)
  }

  importVehicleExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-vehicle-excel', file)
      .then(response => response.data)
  }
}
