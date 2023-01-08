import { FieldValue } from '@/reports/models/field-value.interface'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import Button from '@/shared/ui/components/Button'
import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const INITIAL_STATE = {
  id: 0,
  value: ''
}

interface FieldValueFormProps {
  toastId: string
  field: Field
  updateFieldValues: (fieldValue: FieldValue) => void
}

const FieldValueForm = ({ field, toastId, updateFieldValues }: FieldValueFormProps): ReactElement => {
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
        toast('Value created correctly', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
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
    <div className='mt-3'>
      {currentField.id !== 0 && (
        <>
          <h2 className='uppercase font-medium'>Insert value</h2>
          <form onSubmit={handleValueSubmit}>
            <input
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
              type="text" placeholder='Field value' name='value' onChange={handleValueChange} />

            <div className='mt-5'>
              <Button color='primary' type='submit'>Add</Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default FieldValueForm
