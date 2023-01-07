import { FieldType } from '@/reports/models/enums/field-type.enum'
import { Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToogleOnIcon'
import React, { ReactElement } from 'react'

interface FieldComponentProps {
  field: Field
  update: (field: Field) => void
  updateList: (field: Field, id: number, remove?: boolean) => void
  toggleShowValues: (field: Field) => void
  current: boolean
}

const FieldComponent = ({ field, updateList, update, toggleShowValues, current }: FieldComponentProps): ReactElement => {
  const fieldsService = new FieldsService()

  const handleRemove = (field: Field): void => {
    const confirmRemove = confirm('Are you sure to delete field?')
    if (!confirmRemove) return

    const id = field.id
    void fieldsService.remove(id)
      .then(response => {
        updateList(response, id, true)
      })
  }

  const handleToggle = (fieldToToggle: Field): void => {
    void fieldsService.toggleActive(fieldToToggle.id)
      .then(response => {
        updateList(response, response.id)
      })
  }

  const activeIcon = (): React.ReactElement => {
    return field.active
      ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
      : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
  }

  const currentIcon = (): React.ReactElement => {
    return current
      ? (<EyeIcon className='w-6 h-6 cursor-pointer text-success' />)
      : (<EyeIcon className='w-6 h-6 cursor-pointer' />)
  }

  return (
    <tr>
      <td className='py-3'>{field.id}</td>
      <td className='py-3'>{field.name}</td>
      <td className='py-3'>{field.placeholder ? field.placeholder : '-'}</td>
      <td className='py-3'>{field.active ? 'Active' : 'No active'}</td>
      <td className='py-3'>{field.type}</td>
      <td className='flex justify-center items-center gap-2 py-3'>
        {field.type === FieldType.SELECT &&
          (
            <div className='cursor-pointer' onClick={() => toggleShowValues(field)}>
              {currentIcon()}
            </div>
          )
        }
        <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => handleRemove(field)} />
        <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => update(field)} />
        <div className='cursor-pointer' onClick={() => handleToggle(field)}>
          {activeIcon()}
        </div>
      </td>
    </tr>

  )
}

export default FieldComponent