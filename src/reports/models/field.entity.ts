import { FieldType } from './enums/field-type.enum'
import { FieldValue } from './field-value.interface'

export interface Field {
  id: number
  name: string
  placeholder?: string
  type: FieldType
  active: boolean
  values: FieldValue[]
}
