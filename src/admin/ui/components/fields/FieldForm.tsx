import { FieldType } from '@/reports/models/enums/field-type.enum'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

type FormAction = 'add' | 'update'

interface FieldFormProps {
  field: Field
  formAction: FormAction
  onFinishSubmit: (fields: Field) => void
  reset: () => void
}

const FieldForm = ({ field, formAction, onFinishSubmit, reset }: FieldFormProps): ReactElement => {
  const [inputValue, setInputValue] = useState<Field>(field)
  const fieldsService = new FieldsService()

  const fieldTypes = Object.values(FieldType)

  const inputNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (formAction === 'update') inputNameRef.current?.focus()
  }, [formAction])

  useEffect(() => {
    setInputValue(field)
  }, [field])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { id, values, ...newField } = inputValue

    if (formAction === 'update') {
      void fieldsService.update(id, newField)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
        })
      return
    }

    void fieldsService.create(newField)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target

    if (name === 'type') {
      if (value !== 'text') inputValue.placeholder = ''
    }

    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const resetForm = (): void => {
    reset()
    setInputValue(field)
  }

  return (
    <div className='mt-5'>
      <h2 className='uppercase font-bold'>Create new Field</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name='name' value={inputValue.name} placeholder='name' onChange={handleChange} ref={inputNameRef}/>
        </div>
        <div>
          <label>Field Type</label>
          <select name="type" value={inputValue.type} onChange={handleChange}>
            {
              fieldTypes.map(fieldType => {
                return (
                  <option key={fieldType} value={fieldType}>{fieldType}</option>
                )
              })
            }
          </select>
        </div>
        {
          inputValue.type === FieldType.TEXT && (
            <div>
              <label>Placeholder</label>
              <input type="text" name='placeholder' value={inputValue.placeholder} placeholder='placeholder' onChange={handleChange} />
            </div>
          )
        }

        <button className='bg-blue px-4 py-1 text-white rounded-lg capitalize'>{formAction}</button>
        <button className='bg-red px-4 py-1 text-white rounded-lg capitalize' type='button' onClick={() => resetForm()}>Cancel</button>
      </form>
    </div>
  )
}

export default FieldForm
