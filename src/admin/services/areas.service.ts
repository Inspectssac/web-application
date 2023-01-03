import { Area, User } from '@/iam/models/user.model'
import { AppServices } from '@/shared/service/app-api.service'

export class AreasService extends AppServices {
  constructor () {
    super({ baseUrl: 'areas', contentType: 'application/json' })
  }

  getAll = async (): Promise<Area[]> => {
    return await this.get<Area[]>('')
      .then(response => response.data)
  }

  assignUser = async (areaId: number, userId: string): Promise<User> => {
    return await this.post<User>(`/${areaId.toString()}/users/${userId}`)
      .then(response => response.data)
  }
}
