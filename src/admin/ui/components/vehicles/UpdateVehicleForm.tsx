import React, { ReactElement, useEffect, useState } from 'react'
import { VehicleDto } from '@/routes/models/interface/vehicle-dto.interface'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import Modal from '@/shared/ui/components/Modal'

interface UpdateVehicleFormProps {
  vehicle: Vehicle | null
  closeModal: () => void
  onFinishSubmit: (vehicle: Vehicle) => void
}

const INITIAL_STATE = {
  licensePlate: '',
  provider: '',
  carrier: '',
  imei: '',
  lastMaintenance: new Date().toDateString()
}

const getInitialState = (vehicle: Vehicle | null): VehicleDto => {
  if (vehicle === null) return INITIAL_STATE
  const { createdAt, updatedAt, vehicleType, ...vehicleDto } = vehicle

  return vehicleDto
}

const UpdateVehicleForm = ({ vehicle, closeModal, onFinishSubmit }: UpdateVehicleFormProps): ReactElement => {
  const vehiclesService = new VehiclesService()

  const [inputValue, setInputValue] = useState<VehicleDto>(getInitialState(vehicle))

  useEffect(() => {
    setInputValue(getInitialState(vehicle))
  }, [vehicle])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void vehiclesService.update(inputValue.licensePlate, inputValue)
      .then(onFinishSubmit)
      .finally(() => closeModal())
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        <h2 className='text-center font-bold uppercase text-xl'>Update Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Vehicle Type</label>
            <p>{vehicle?.vehicleType.name}</p>
          </div>
          <div>
            <label htmlFor='licensePlate'>License Plate</label>
            <input disabled id='licensePlate' value={inputValue.licensePlate} type="text" name='licensePlate' />
          </div>
          <div>
            <label htmlFor='provider'>Provider</label>
            <input onChange={handleChange} id='provider' value={inputValue.provider} type="text" name='provider' />
          </div>
          <div>
            <label htmlFor='carrier'>Carrier</label>
            <input onChange={handleChange} id='carrier' value={inputValue.carrier} type="text" name='carrier' />
          </div>
          <div>
            <label htmlFor='imei'>Imei</label>
            <input onChange={handleChange} id='imei' value={inputValue.imei} type="text" name='imei' />
          </div>
          <div>
            <label htmlFor="lastMaintenance">Last Maintenance</label>
            <input onChange={handleChange} type="date" id='lastMaintenance' name='lastMaintenance' value={new Date(inputValue.lastMaintenance).toISOString().substring(0, 10)} />
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

export default UpdateVehicleForm
