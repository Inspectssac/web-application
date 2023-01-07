import { FieldType } from '../enums/field-type.enum'
import { FieldValue } from '../field-value.interface'
import { Field } from '../field.entity'

export interface FieldApiResponse {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  value: string
  placeholder?: string
  type: FieldType
  active: boolean
  values: FieldValue[]
}

export const transformAllToFieldArrayEntity = (fieldsApi: FieldApiResponse[]): Field[] => {
  return fieldsApi.map((fieldApi) => {
    const { createdAt, updatedAt, value, ...field } = fieldApi
    return field
  })
}

export const transformToFieldEntity = (fieldApi: FieldApiResponse): Field => {
  const { createdAt, updatedAt, value, ...field } = fieldApi
  return field
}
