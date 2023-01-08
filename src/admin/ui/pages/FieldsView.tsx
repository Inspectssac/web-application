import React, { ReactElement, useEffect, useState } from 'react'
import { FieldType } from '@/reports/models/enums/field-type.enum'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import FieldComponent from '../components/fields/FieldComponent'
import FieldForm from '../components/fields/FieldForm'
import FieldValueComponent from '../components/field-values/FieldValueComponent'
import { FieldValue } from '@/reports/models/field-value.interface'
import Toast from '@/shared/ui/components/Toast'
import Table from '@/shared/ui/components/Table'

const INITIAL_STATE = {
  id: 0,
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

type FormAction = 'add' | 'update'

const TOAST_ID = 'field'

const FieldsView = (): ReactElement => {
  const fieldsService = new FieldsService()
  const fieldTypes = Object.values(FieldType)

  const [fields, setFields] = useState<Field[]>([])

  const [fieldForm, setFieldForm] = useState<Field>(INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [currentField, setCurrentField] = useState<Field>(INITIAL_STATE)

  useEffect(() => {
    void fieldsService.findAll()
      .then(setFields)
  }, [])

  const toggleShowFieldValues = (field: Field): void => {
    if (currentField.id === field.id) { setCurrentField(INITIAL_STATE) } else { setCurrentField(field) }
  }

  const reset = (): void => {
    setFieldForm(INITIAL_STATE)
    setFormAction('add')
  }

  const handleUpdate = (field: Field): void => {
    setFieldForm(field)
    setFormAction('update')
  }

  const onFinishSubmit = (newField: Field): void => {
    reset()
    updateFieldList(newField, newField.id)
  }
  const updateFieldList = (newField: Field, id: number, remove: boolean = false): void => {
    const index = fields.findIndex(field => field.id === id)

    if (index === -1) {
      setFields([...fields, newField])
      return
    }
    if (remove) {
      setFields(fields.filter(field => field.id !== id))
      return
    }

    const fieldList = [...fields.slice(0, index), newField, ...fields.slice(index + 1, fields.length)]
    setFields(fieldList)
  }

  const addFieldValueToCurrent = (fieldValue: FieldValue): void => {
    setFields(
      fields.map(field => {
        if (field.id === currentField.id) {
          field.values.push(fieldValue)
        }
        return field
      })
    )
  }

  const tableColClassNames = 'text-sm font-medium text-white px-6 py-4 capitalize'

  return (
    <div className='container'>
      <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-light-gray after:block after:mt-1'>Fields</h1>
      <div className='md:grid md:grid-cols-table md:gap-4'>
        <div className='mb-5 md:mb-0'>
          <aside className='pr-28 mb-5 md:mb-0'>
            <h2 className='font-bold uppercase '>Field Types</h2>
            {
              fieldTypes.map(fieldType => {
                return (
                  <p className='capitalize border-b last-of-type:border-b-0 px-3' key={fieldType}>{fieldType}</p>
                )
              })
            }
          </aside>
          <FieldForm toastId={TOAST_ID} field={fieldForm} formAction={formAction} onFinishSubmit={onFinishSubmit} reset={reset} />
        </div>
        <section>
          {
            fields.length > 0
              ? (
                <Table>
                  <thead className='border-b bg-black'>
                    <tr>
                      <th scope='col' className={`${tableColClassNames}`}>Id</th>
                      <th scope='col' className={`${tableColClassNames}`}>Name</th>
                      <th scope='col' className={`${tableColClassNames}`}>Placeholder</th>
                      <th scope='col' className={`${tableColClassNames}`}>Active</th>
                      <th scope='col' className={`${tableColClassNames}`}>Type</th>
                      <th scope='col' className={`${tableColClassNames}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      fields.map(field => {
                        return (
                          <FieldComponent toastId={TOAST_ID} key={field.id} field={field} update={handleUpdate} updateList={updateFieldList} toggleShowValues={toggleShowFieldValues} current={currentField.id === field.id} />
                        )
                      })
                    }
                  </tbody>
                </Table>
                )
              : (<p>Theres no fields</p>)
          }

        </section>
        <FieldValueComponent toastId={TOAST_ID} field={currentField} addFieldValueToCurrent={addFieldValueToCurrent} />
      </div>

      <Toast id={TOAST_ID}></Toast>
    </div>
  )
}

export default FieldsView
