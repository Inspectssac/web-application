import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import React, { ReactElement, useEffect, useState } from 'react'

type FormAction = 'add' | 'update'

interface ReportTypeFormProps {
  reportType: ReportType
  formAction: FormAction
  reset: () => void
  onFinishSubmit: (reportType: ReportType) => void
}

const ReportTypeForm = ({ reportType, reset, formAction, onFinishSubmit }: ReportTypeFormProps): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [inputValue, setInputValue] = useState<ReportType>(reportType)

  useEffect(() => {
    setInputValue(reportType)
  }, [reportType])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { id, createdAt, updatedAt, ...newField } = inputValue

    if (formAction === 'update') {
      void reportTypesService.update(id, newField)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
        })
      return
    }

    void reportTypesService.create(newField)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const resetForm = (): void => {
    reset()
    setInputValue(reportType)
  }

  return (
    <div>
      <h2>Add or Update Report Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name='name' placeholder='name' value={inputValue.name} onChange={handleChange} />
        </div>
        <div className='flex justify-center gap-2 mt-2'>
          <button className='capitalize bg-red px-4 py-1 text-white rounded-lg' type='button' onClick={() => resetForm()}>Cancel</button>
          <button className='capitalize bg-blue px-4 py-1 text-white rounded-lg' type='submit'>{formAction}</button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeForm
