import { type Field } from './field.entity'

export interface GroupField {
  fieldId: string
  groupId: string
  field: Field
  maxLength: number
  isCritical: boolean
  needImage: boolean
  priority: string
}
