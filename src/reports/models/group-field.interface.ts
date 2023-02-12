import { Field } from './field.entity'

export interface GroupField {
  fieldId: number
  groupId: number
  field: Field
  maxLength: number
  isCritical: boolean
  needImage: boolean
}
