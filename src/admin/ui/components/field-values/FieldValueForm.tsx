import { FieldValue } from '@/reports/models/field-value.interface'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import React, { ReactElement, useEffect, useState } from 'react'

const INITIAL_STATE = {
  id: 0,
  value: ''
}

interface FieldValueFormProps {
  field: Field
  updateFieldValues: (fieldValue: FieldValue) => void
}

const FieldValueForm = ({ field, updateFieldValues }: FieldValueFormProps): ReactElement => {
  const fieldsService = new FieldsService()
  const [newValue, setNewValue] = useState<FieldValue>(INITIAL_STATE)
  const [currentField, setCurrentField] = useState<Field>(field)

  useEffect(() => {
    setCurrentField(field)
  }, [field])

  const handleValueSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setNewValue(INITIAL_STATE)
    const { id, ...value } = newValue
    void fieldsService.createValue(field.id, value)
      .then(response => {
        updateFieldValues(response)
      })
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    setNewValue({
      ...newValue,
      [name]: value
    })
  }
  return (
    <div>
      {currentField.id !== 0 && (
        <>
          <h2>Insert possible value for <span>{field.name}</span></h2>
          <form onSubmit={handleValueSubmit}>
            <label>Value</label>
            <input type="text" placeholder='value' name='value' onChange={handleValueChange} />

            <button className='px-4 py-2 bg-blue text-white rounded-lg'>Add</button>
          </form>
        </>
      )}
    </div>
  )
}

export default FieldValueForm
