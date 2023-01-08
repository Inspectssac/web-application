import { FieldType } from '@/reports/models/enums/field-type.enum'
import { Field } from '@/reports/models/field.entity'
import { ReportTypeFieldDto } from '@/reports/models/interfaces/report-type-field-dto.interface'
import { ReportTypeField } from '@/reports/models/report-type-fields.interface'
import { ReportType } from '@/reports/models/report-type.interface'
import { FieldsService } from '@/reports/services/field.service'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface AssignFieldFormProps {
  toastId: string
  reportType: ReportType
  reportTypeFields: ReportTypeField[]
  closeModal: () => void
  onFinishSubmit: (reportTypeField: ReportTypeField) => void
}

const FIELD_INITIAL_STATE = {
  id: 0,
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

const REPORT_FIELD_INITIAL_STATE = {
  length: 0,
  required: true,
  imageValidation: false,
  mainInfo: false
}

const AssignFieldForm = ({ reportType, reportTypeFields, toastId, closeModal, onFinishSubmit }: AssignFieldFormProps): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const navigate = useNavigate()

  const fieldsService = new FieldsService()
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState<Field>(FIELD_INITIAL_STATE)
  const [hasMaxLength, setHasMaxLength] = useState<boolean>(false)

  const [inputValue, setInputValue] = useState<ReportTypeFieldDto>(REPORT_FIELD_INITIAL_STATE)
  useEffect(() => {
    void fieldsService.findAll()
      .then(response => {
        const actualFields = reportTypeFields.map(reportTypeField => reportTypeField.fieldId)
        setFields(response.filter(field => !actualFields.includes(field.id) && field.active))
      })
  }, [])

  useEffect(() => {
    if (fields.length > 0) setSelectedField(fields[0])
  }, [fields])

  useEffect(() => {
    if (selectedField.type !== 'text') { inputValue.length = 0 }
    setHasMaxLength(selectedField.type === 'text')
  }, [selectedField])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const field = fields.find(field => field.id === parseInt(value))
    setSelectedField(field ?? FIELD_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void reportTypesService.assignField(reportType.id, selectedField.id, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Field assigned correctly', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = event.target

    setInputValue({
      ...inputValue,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    })
  }

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Assign field</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='font-medium'>Field</label>
          <select
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
            onChange={handleSelectChange} value={selectedField.id}>
            {fields?.map(field => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
        </div>
        {hasMaxLength && (
          <div className='mb-3'>
            <label className='font-medium'>Max Length</label>
            <input
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
              onChange={handleChange} type="number" name='length' placeholder='max length' min={0} value={inputValue.length} />
          </div>
        )}
        <div className='grid grid-cols-3 place-items-center'>
          <div className='flex items-center gap-5'>
            <label htmlFor='required'>Required</label>
            <input onChange={handleChange} id='required' checked={inputValue.required} type="checkbox" name='required' />
          </div>
          <div className='flex items-center gap-5'>
            <label htmlFor='image'>Image</label>
            <input onChange={handleChange} id='image' checked={inputValue.imageValidation} type="checkbox" name='imageValidation' />
          </div>
          <div className='flex items-center gap-5'>
            <label htmlFor='main'>Main info</label>
            <input onChange={handleChange} id='main' checked={inputValue.mainInfo} type="checkbox" name='mainInfo' />
          </div>
        </div>

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Add</Button>
          <Button color='danger' onClick={closeModal}>Close</Button>
        </div>
      </form>
    </>
  )

  const addFieldMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>All fields available are assign, create or active a field if you want to assign a new one</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='primary' onClick={() => navigate('/admin/fields')}>Add Fields</Button>
        <Button color='danger' onClick={closeModal}>Close</Button>
      </div>
    </>
  )

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        {fields.length > 0 ? modal() : addFieldMessage()}
      </div>
    </Modal>
  )
}

export default AssignFieldForm
