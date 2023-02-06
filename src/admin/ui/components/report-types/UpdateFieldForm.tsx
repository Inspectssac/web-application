import { ReportTypeFieldDto } from '@/reports/models/interfaces/report-type-field-dto.interface'
import { ReportTypeField } from '@/reports/models/report-type-fields.interface'
import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useState } from 'react'
import { toast } from 'react-toastify'

interface UpdateFieldFormProps {
  toastId: string
  reportType: ReportType
  reportTypeField: ReportTypeField | null
  closeModal: () => void
  onFinishSubmit: (reportTypeField: ReportTypeField) => void
}

const REPORT_FIELD_INITIAL_STATE = {
  length: 0,
  required: true,
  imageValidation: false,
  mainInfo: false
}

const getInitialState = (reportTypeField: ReportTypeField | null): ReportTypeFieldDto => {
  if (reportTypeField === null) return REPORT_FIELD_INITIAL_STATE
  const { field, fieldId, reportTypeId, ...reportTypeFieldDto } = reportTypeField
  return reportTypeFieldDto
}

const UpdateFieldForm = ({ reportType, toastId, reportTypeField, closeModal, onFinishSubmit }: UpdateFieldFormProps): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [inputValue, setInputValue] = useState<ReportTypeFieldDto>(getInitialState(reportTypeField))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = event.target

    setInputValue({
      ...inputValue,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const fieldId = reportTypeField ? reportTypeField.fieldId : 0
    void reportTypesService.updateField(reportType.id, fieldId, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Field updated correctly', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        <h2 className='text-center font-bold uppercase text-xl'>Editar campo</h2>
        <p className='font-medium text-red-dark text-center uppercase'>Campo: {reportTypeField?.field.name}</p>
        <form onSubmit={handleSubmit}>
          {reportTypeField?.field.type === 'text' && (
            <div className='mb-3'>
              <label className='font-medium'>Max caractéres</label>
              <input
                className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
                onChange={handleChange} type="number" name='length' placeholder='max length' min={0} value={inputValue.length} />
            </div>
          )}
          <div className='grid grid-cols-3 place-items-center'>
            <div className='flex items-center gap-5'>
              <label htmlFor='required'>Requerido</label>
              <input onChange={handleChange} id='required' checked={inputValue.required} type="checkbox" name='required' />
            </div>
            <div className='flex items-center gap-5'>
              <label htmlFor='image'>Validación con imagen</label>
              <input onChange={handleChange} id='image' checked={inputValue.imageValidation} type="checkbox" name='imageValidation' />
            </div>
            <div className='flex items-center gap-5'>
              <label htmlFor='main'>Info principal</label>
              <input onChange={handleChange} id='main' checked={inputValue.mainInfo} type="checkbox" name='mainInfo' />
            </div>
          </div>

          <div className='mt-5 flex justify-center gap-3 items-center'>
            <Button color='primary' type='submit'>Editar</Button>
            <Button color='danger' onClick={closeModal}>Cerrar</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UpdateFieldForm
