import { VehicleTypeDto } from '@/routes/models/interface/vehicle-type-dto.interface'
import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { VehicleTypeContext } from '../../pages/VehicleTypesView'

type FormAction = 'add' | 'update'

interface VehicleTypeFormProps {
  vehicleType: VehicleType | null
  formAction: FormAction
  onFinishSubmit: (vehicleType: VehicleType) => void
  reset: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (vehicleType: VehicleType | null): VehicleTypeDto => {
  if (vehicleType === null) return INITIAL_STATE
  const { id, createdAt, updatedAt, materials, ...vehicleTypeDto } = vehicleType
  return vehicleTypeDto
}

const VehicleTypeForm = ({ vehicleType, formAction, onFinishSubmit, reset }: VehicleTypeFormProps): ReactElement => {
  const vehicleTypeContext = useContext(VehicleTypeContext)

  const vehicleTypesService = new VehicleTypesService()
  const [inputValue, setInputValue] = useState<VehicleTypeDto>(getInitialState(vehicleType))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(getInitialState(vehicleType))
  }, [vehicleType])

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(getInitialState(null))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (formAction === 'update') {
      const id = vehicleType ? vehicleType.id : 0
      void vehicleTypesService.update(id, inputValue)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
          toast('Tipo de vehículo editado correctamente', { toastId: vehicleTypeContext.toastId, type: 'success' })
        })
        .catch((error) => {
          const { message } = error.data
          toast(message, { toastId: vehicleTypeContext.toastId, type: 'error' })
        })
      return
    }

    void vehicleTypesService.create(inputValue)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        toast('Tipo de vehículo creado correctamente', { toastId: vehicleTypeContext.toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: vehicleTypeContext.toastId, type: 'error' })
      })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  const setValueInputValue = (name: string, value: string): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={inputValue.name}
          name='name' placeholder='Nombre del tipo de vehículo' type='text'
          setValid={setIsValidInput}
          reset={resetInputs}
          setValue={(value) => setValueInputValue('name', value)}></Input>
        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={resetForm}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default VehicleTypeForm
