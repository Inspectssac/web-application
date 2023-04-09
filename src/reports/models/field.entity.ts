import { type FieldType } from './enums/field-type.enum'
import { type FieldValue } from './field-value.interface'

export interface Field {
  id: string
  name: string
  placeholder?: string
  type: FieldType
  active: boolean
  values: FieldValue[]
}
