import { Field } from './field.entity'

export interface ReportTypeField {
  fieldId: number
  reportTypeId: number
  field: Field
  length: number
  required: boolean
  imageValidation: boolean
  mainInfo: boolean
}
