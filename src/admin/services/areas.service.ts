import { Area, User } from '@/iam/models/user.model'
import { AppServices } from '@/shared/service/app-api.service'
import { AreaDto } from '../models/area-dto.interface'

export class AreasService extends AppServices {
  constructor () {
    super({ baseUrl: 'areas', contentType: 'application/json' })
  }

  findAll = async (): Promise<Area[]> => {
    return await this.get<Area[]>('')
      .then(response => response.data)
  }

  assignUser = async (areaId: number, userId: string): Promise<User> => {
    return await this.post<User>(`/${areaId.toString()}/users/${userId}`)
      .then(response => response.data)
  }

  create = async (areaDto: AreaDto): Promise<Area> => {
    return await this.post<Area>('', areaDto)
      .then(response => response.data)
  }

  update = async (id: number, areaDto: AreaDto): Promise<Area> => {
    return await this.patch<Area>(`/${id}`, areaDto)
      .then(response => response.data)
  }
}
