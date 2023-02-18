import { AppServices } from '@/shared/service/app-api.service'
import { FieldReport } from '../models/field-report.interface'
import { Report } from '../models/report.interface'

export interface FindAllReportsOptions {
  dateStart: string
  dateEnd: string
}

export class ReportsService extends AppServices {
  constructor () {
    super({ baseUrl: 'reports', contentType: 'application/json' })
  }

  findAll = async ({ dateStart, dateEnd }: FindAllReportsOptions): Promise<Report[]> => {
    return await this.get<Report[]>(`?date-start=${dateStart}&date-end=${dateEnd}`)
      .then(response => {
        localStorage.setItem('reports', JSON.stringify(response.data))
        localStorage.setItem('last-request-reports', JSON.stringify(new Date()))
        return response.data
      })
  }

  findAllFieldsByReportId = async (reportId: string): Promise<FieldReport[]> => {
    return await this.get<FieldReport[]>(`/${reportId}/fields`)
      .then(response => response.data)
  }
}
