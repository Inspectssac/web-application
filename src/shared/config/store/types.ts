import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'

export enum AUTH_STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export interface AUTH_STATE {
  user: UserStorage | null | undefined
  authenticated: boolean
  status: AUTH_STATUS
}
