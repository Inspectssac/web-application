import { Field } from '../field.entity'

export interface FieldDto extends Omit<Field, 'id' | 'values'> {
}
