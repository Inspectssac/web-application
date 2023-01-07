import React, { ReactElement, useEffect, useState } from 'react'
import { FieldType } from '@/reports/models/enums/field-type.enum'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import FieldComponent from '../components/fields/FieldComponent'
import FieldForm from '../components/fields/FieldForm'
import FieldValueComponent from '../components/field-values/FieldValueComponent'
import { FieldValue } from '@/reports/models/field-value.interface'

const INITIAL_STATE = {
  id: 0,
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

type FormAction = 'add' | 'update'

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

  const tableColClassNames = 'text-sm font-bold text-gray-900 px-4 py-4 text-center uppercase'

  return (
    <div className='container'>
      <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-light-grey after:block after:mt-1 '>Fields</h1>
      <div className='md:grid md:grid-cols-table md:gap-4'>
        <div>
          <aside className='pr-28 mb-5 md:mb-0'>
            <h2 className='font-bold uppercase '>Field Types</h2>
            {
              fieldTypes.map(fieldType => {
                return (
                  <p className='capitalize border-t border-b first-of-type:border-t-0 px-3' key={fieldType}>{fieldType}</p>
                )
              })
            }
          </aside>
          <FieldForm field={fieldForm} formAction={formAction} onFinishSubmit={onFinishSubmit} reset={reset} />
        </div>
        <section>
          {
            fields.length > 0
              ? (
                <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
                    <div className='overflow-hidden'>
                      <table className='min-w-full border-collapse table-auto'>
                        <thead>
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
                                <FieldComponent key={field.id} field={field} update={handleUpdate} updateList={updateFieldList} toggleShowValues={toggleShowFieldValues} current={currentField.id === field.id} />
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                )
              : (<p>Theres no fields</p>)
          }

        </section>

        <FieldValueComponent field={currentField} addFieldValueToCurrent={addFieldValueToCurrent} />
      </div>

    </div>
  )
}

export default FieldsView
