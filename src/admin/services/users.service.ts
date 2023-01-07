import { User } from '@/iam/models/user.model'
import { AppServices } from '@/shared/service/app-api.service'
import { AddUser } from '../models/add-user.interface'
import { ChangeRole } from '../models/change-role.interface'

export class UsersService extends AppServices {
  constructor () {
    super({ baseUrl: 'users', contentType: 'application/json' })
  }

  getAll = async (): Promise<User[]> => {
    return await this.get<User[]>('')
      .then(response => response.data)
  }

  create = async (user: AddUser): Promise<User> => {
    return await this.post<User>('', user)
      .then(response => response.data)
  }

  changeRole = async (changeRole: ChangeRole, userId: string): Promise<User> => {
    return await this.patch<User>(`/${userId}`, changeRole)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<User> => {
    return await this.delete<User>(`/${id}`)
      .then(response => response.data)
  }
}
