import { AppServices } from '@/shared/service/app-api.service'
import { FieldDto } from '../models/interfaces/field-dto.interface'
import { FieldValue } from '../models/field-value.interface'
import { Field } from '../models/field.entity'
import { FieldApiResponse, transformAllToFieldArrayEntity, transformToFieldEntity } from '../models/interfaces/field-api.interface'
import { FieldValueDto } from '../models/interfaces/field-value-dto.interface'

export class FieldsService extends AppServices {
  constructor () {
    super({ baseUrl: 'fields', contentType: 'application/json' })
  }

  findAll = async (): Promise<Field[]> => {
    return await this.get<FieldApiResponse[]>('')
      .then(response => response.data)
      .then(transformAllToFieldArrayEntity)
  }

  remove = async (id: number): Promise<Field> => {
    return await this.delete<Field>(`/${id}`)
      .then(response => response.data)
  }

  create = async (field: FieldDto): Promise<Field> => {
    return await this.post<FieldApiResponse>('', field)
      .then(response => response.data)
      .then(transformToFieldEntity)
  }

  update = async (id: number, field: FieldDto): Promise<Field> => {
    return await this.patch<FieldApiResponse>(`/${id}`, field)
      .then(response => response.data)
      .then(transformToFieldEntity)
  }

  toggleActive = async (id: number): Promise<Field> => {
    return await this.patch<FieldApiResponse>(`/${id}/toggle-active`)
      .then(response => response.data)
      .then(transformToFieldEntity)
  }

  getAllValues = async (id: number): Promise<FieldValue[]> => {
    return await this.get<FieldValue[]>(`/${id}/field-values`)
      .then(response => response.data)
  }

  createValue = async (id: number, fieldValue: FieldValueDto): Promise<FieldValue> => {
    return await this.post<FieldValue>(`/${id}/field-values`, fieldValue)
      .then(response => response.data)
  }
}
