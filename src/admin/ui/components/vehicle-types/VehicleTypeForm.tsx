import { VehicleTypeDto } from '@/routes/models/interface/vehicle-type-dto.interface'
import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import React, { ReactElement, useEffect, useState } from 'react'

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
  const { id, createdAt, updatedAt, ...vehicleTypeDto } = vehicleType
  return vehicleTypeDto
}

const VehicleTypeForm = ({ vehicleType, formAction, onFinishSubmit, reset }: VehicleTypeFormProps): ReactElement => {
  const vehicleTypesService = new VehicleTypesService()
  const [inputValue, setInputValue] = useState<VehicleTypeDto>(getInitialState(vehicleType))

  useEffect(() => {
    setInputValue(getInitialState(vehicleType))
  }, [vehicleType])

  const resetForm = (): void => {
    reset()
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
        })
      return
    }

    void vehicleTypesService.create(inputValue)
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

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>Create new Vehicle Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name='name' value={inputValue.name} placeholder='name' onChange={handleChange} />
        </div>
        <button className='bg-blue px-4 py-1 text-white rounded-lg capitalize'>{formAction}</button>
        <button className='bg-red px-4 py-1 text-white rounded-lg capitalize' type='button' onClick={() => resetForm()}>Cancel</button>
      </form>
    </div>
  )
}

export default VehicleTypeForm
