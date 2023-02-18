import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { Report } from '@/reports/models/report.interface'
import { Route } from '@/routes/models/route.interface'
import { DateRange } from '@/shared/models/date-range'

export enum STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export interface AUTH_STATE {
  user: UserStorage | null | undefined
  authenticated: boolean
  status: STATUS
}

export interface ROUTES_STATE {
  routes: Route[]
  reports: Report[]
  dateRange: DateRange
  lastRequest: Date | null
  status: STATUS
}

export interface REPORTS_STATE {
  reports: Report[]
  lastRequest: Date | null
  status: STATUS
}
