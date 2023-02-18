import { Checkpoint } from './checkpoint.interface'
import { ReportType } from './report-type.interface'

export interface Report {
  createdAt: string
  updatedAt: string
  id: string
  location: string
  checked: boolean
  type: string
  checkpoints: Checkpoint[]
  routeId: string
  reportType: ReportType
}
