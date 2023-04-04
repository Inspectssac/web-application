import { Field } from './field.entity'
import { ReportGroup } from './group.interface'

export interface FieldReport {
  fieldId: string
  reportId: string
  value: string
  type: string
  isCritical: boolean
  imageEvidence: string
  group: ReportGroup
  field: Field
}
