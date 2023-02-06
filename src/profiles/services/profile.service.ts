import { AppServices } from '@/shared/service/app-api.service'
import { Profile } from '../models/profile.entity'

export class ProfileService extends AppServices {
  constructor () {
    super({ baseUrl: 'profiles', contentType: 'application/json' })
  }

  findAll = async (): Promise<Profile[]> => {
    return await this.get<Profile[]>('')
      .then(response => response.data)
  }

  findById = async (id: string): Promise<Profile> => {
    return await this.get<Profile>(`/id/${id}`)
      .then(response => response.data)
  }
}
