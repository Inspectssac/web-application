import { AppServices } from '@/shared/service/app-api.service'
import { StatusCodes } from 'http-status-codes'
import { LoginData } from '../models/interfaces/login.interface'
import { UserApiResponse } from '../models/interfaces/user-api.interface'
import { UserStorage } from '../models/interfaces/user-storage.interface'
import { User } from '../models/user.model'
import { TokenService } from './token.service'

export class AuthServices extends AppServices {
  constructor () {
    super({ baseUrl: 'auth', contentType: 'application/json' })
  }

  login = async (loginData: LoginData): Promise<UserStorage | null | undefined> => {
    return await this.post<UserApiResponse>('/login', loginData)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, username, role, areas } = authenticatedUser

          const userStorage: UserStorage = {
            id,
            username,
            role,
            areas
          }

          TokenService.saveToken(tokens.accessToken)
          localStorage.setItem('user', JSON.stringify(userStorage))

          return userStorage
        }
      })
  }

  logout = (): void => {
    TokenService.removeToken()
    localStorage.removeItem('user')
  }

  currentUser = async (): Promise<User | null> => {
    const response = await this.post<UserApiResponse>('/user')

    if (response.status === StatusCodes.CREATED) {
      return response.data.authenticatedUser
    }

    return null
  }
}
