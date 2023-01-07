import { AppServices } from '@/shared/service/app-api.service'
import { ReportTypeDto } from '../models/interfaces/report-type-dto.interface'
import { ReportTypeFieldDto } from '../models/interfaces/report-type-field-dto.interface'
import { ReportTypeField } from '../models/report-type-fields.interface'
import { ReportType } from '../models/report-type.interface'

export class ReportTypesService extends AppServices {
  constructor () {
    super({ baseUrl: 'report-types', contentType: 'application/json' })
  }

  findAll = async (): Promise<ReportType[]> => {
    return await this.get<ReportType[]>('')
      .then(response => response.data)
  }

  getAllFields = async (id: number): Promise<ReportTypeField[]> => {
    return await this.get<ReportTypeField[]>(`/${id}/fields`)
      .then(response => response.data)
  }

  create = async (reportType: ReportTypeDto): Promise<ReportType> => {
    return await this.post<ReportType>('', reportType)
      .then(response => response.data)
  }

  update = async (id: number, reportType: ReportTypeDto): Promise<ReportType> => {
    return await this.patch<ReportType>(`/${id}`, reportType)
      .then(response => response.data)
  }

  assignField = async (reportTypeId: number, fieldId: number, reportTypeFieldDto: ReportTypeFieldDto): Promise<ReportTypeField> => {
    return await this.post<ReportTypeField>(`/${reportTypeId}/fields/${fieldId}`, reportTypeFieldDto)
      .then(response => response.data)
  }

  updateField = async (reportTypeId: number, fieldId: number, reportTypeFieldDto: ReportTypeFieldDto): Promise<ReportTypeField> => {
    return await this.patch<ReportTypeField>(`/${reportTypeId}/fields/${fieldId}`, reportTypeFieldDto)
      .then(response => response.data)
  }
}
