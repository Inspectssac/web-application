import { ReportTypeFieldDto } from '@/reports/models/interfaces/report-type-field-dto.interface'
import { ReportTypeField } from '@/reports/models/report-type-fields.interface'
import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useState } from 'react'

interface UpdateFieldFormProps {
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

const UpdateFieldForm = ({ reportType, reportTypeField, closeModal, onFinishSubmit }: UpdateFieldFormProps): ReactElement => {
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
      .then(onFinishSubmit)
      .finally(closeModal)
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        <h2>Updating field {reportTypeField?.field.name}</h2>
        <form onSubmit={handleSubmit}>
          {reportTypeField?.field.type === 'text' && (
            <div>
              <label>Max Length</label>
              <input onChange={handleChange} type="number" name='length' placeholder='max length' min={0} value={inputValue.length} />
            </div>
          )}
          <div>
            <label htmlFor='required'>Required</label>
            <input onChange={handleChange} id='required' checked={inputValue.required} type="checkbox" name='required' />
          </div>
          <div>
            <label htmlFor='image'>Image Validation</label>
            <input onChange={handleChange} id='image' checked={inputValue.imageValidation} type="checkbox" name='imageValidation' />
          </div>
          <div>
            <label htmlFor='main'>Main info</label>
            <input onChange={handleChange} id='main' checked={inputValue.mainInfo} type="checkbox" name='mainInfo' />
          </div>

          <div className='flex justify-center gap-3 items-center'>
            <button className='bg-blue px-4 py-1 rounded-lg text-white' type='submit'>Update</button>
            <button className='bg-red px-4 py-1 rounded-lg text-white' type='button' onClick={closeModal}>Close</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UpdateFieldForm
