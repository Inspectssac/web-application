import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type FormAction = 'add' | 'update'

interface ReportTypeFormProps {
  toastId: string
  reportType: ReportType
  formAction: FormAction
  reset: () => void
  onFinishSubmit: (reportType: ReportType) => void
}

const ReportTypeForm = ({ reportType, toastId, formAction, reset, onFinishSubmit }: ReportTypeFormProps): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [inputValue, setInputValue] = useState<ReportType>(reportType)

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

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
          toast('Report Type updated correctly', { toastId, type: 'success' })
        })
        .catch((error) => {
          const { message } = error.data
          toast(message, { toastId, type: 'error' })
        })
      return
    }

    void reportTypesService.create(newField)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        toast('Report Type updated correctly', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(reportType)
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  return (
    <div>
      <h2 className='font-bold uppercase'>{formAction.toUpperCase()} Report Type</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={inputValue.name}
          name='name' placeholder='name' type='text'
          setValid={setIsValidInput}
          reset={resetInputs}
          setValue={(value) => setInputValue({ ...inputValue, name: value })}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='danger' onClick={resetForm} >Cancel</Button>
          <Button className='py-1' color='primary' type='submit' disabled={!canSubmit}>{formAction}</Button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeForm
