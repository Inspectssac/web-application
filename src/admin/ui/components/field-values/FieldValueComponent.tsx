import { FieldValue } from '@/reports/models/field-value.interface'
import { Field } from '@/reports/models/field.entity'
import React, { ReactElement, useEffect, useState } from 'react'
import FieldValueForm from './FieldValueForm'

interface FieldValueProp {
  field: Field
  addFieldValueToCurrent: (fieldValue: FieldValue) => void
}

const FieldValueComponent = ({ field, addFieldValueToCurrent }: FieldValueProp): ReactElement => {
  const [values, setValues] = useState<FieldValue[]>(field.values)

  useEffect(() => {
    setValues(field.values)
  }, [field])

  const handleUpdateValues = (fieldValue: FieldValue): void => {
    addFieldValueToCurrent(fieldValue)
    // setValues([...values, fieldValue])
  }

  return (
    <div>
      <FieldValueForm field={field} updateFieldValues={handleUpdateValues}/>
      {
        values.length > 0 && (
          <section>
            <h2>Possible Values for Field: { }</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {
                  values.map(value => {
                    return (
                      <tr key={value.id}>
                        <td>{value.id}</td>
                        <td>{value.value}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </section>
        )
      }
    </div>
  )
}

export default FieldValueComponent
