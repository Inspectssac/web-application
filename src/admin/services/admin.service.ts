import { User } from '@/iam/models/user.model'
import { AppServices } from '@/shared/service/app-api.service'

export class AdminService extends AppServices {
  constructor () {
    super({ baseUrl: 'admin', contentType: 'application/json' })
  }

  importExcel = async (file: any): Promise<User[]> => {
    return await this.post<User[]>('/import-excel', file)
      .then(response => response.data)
  }
}
