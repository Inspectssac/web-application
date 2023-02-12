import { Group } from '@/reports/models/group.interface'
import { GroupsService } from '@/reports/services/group.service'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/VehiclesView'

type FormAction = 'add' | 'update'

interface CreateGroupProps {
  reportTypeId: number
  group: Group | null
  formAction: FormAction
  close: () => void
  update: (group: Group) => void
  reset: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (group: Group | null): Pick<Group, 'name'> => {
  if (group === null) return INITIAL_STATE
  const { createdAt, updatedAt, id, reportTypeId, fieldsGroups, ...groupDto } = group
  return groupDto
}

const GroupForm = ({ group, reportTypeId, formAction, close, update, reset }: CreateGroupProps): ReactElement => {
  const toastContext = useContext(ToastContext)
  const reportTypesService = new ReportTypesService()
  const groupsService = new GroupsService()

  const [inputValue, setInputValue] = useState<Pick<Group, 'name'>>(getInitialState(group))
  const [validInputs, setValidInputs] = useState({
    name: false
  })

  const setIsValidInput = (name: string, valid: boolean): void => {
    // setCanSubmit(valid)
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  const setValueInputValue = (name: string, value: string): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const action = formAction === 'update' ? groupsService.update : reportTypesService.createGroup
    const actionId = formAction === 'update' ? group?.id ?? 0 : reportTypeId

    void action(actionId, inputValue)
      .then((response) => {
        update(response)
        toast('Field assigned correctly', { toastId: toastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
      .finally(() => {
        reset()
        close()
      })
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
      <form onSubmit={handleSubmit}>
      <div className='mt-2'>
          <label className='font-medium' htmlFor='name'>Nombre</label>
          <Input
            value={inputValue.name}
            name='nombre' placeholder='Nombre' type='text'
            setValid={(valid) => setIsValidInput('name', valid)}
            setValue={(value) => setValueInputValue('name', value)}></Input>
        </div>

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Añadir</Button>
          <Button color='danger' onClick={close}>Cerrar</Button>
        </div>
      </form>
      </div>
    </Modal>

  )
}

export default GroupForm
