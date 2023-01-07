import { VehicleDto } from '@/routes/models/interface/vehicle-dto.interface'
import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import { VehiclesService } from '@/routes/services/vehicle.service'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

interface AddVehicleFormProps {
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
const AddVehicleForm = ({ closeModal, onFinishSubmit }: AddVehicleFormProps): ReactElement => {
  const vehiclesService = new VehiclesService()
  const vehicleTypesService = new VehicleTypesService()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

  const [inputValue, setInputValue] = useState<VehicleDto>(INITIAL_STATE)

  const vehicleTypeRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    void vehicleTypesService.findAll()
      .then(setVehicleTypes)
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log(inputValue)
    const vehicleTypeId = parseInt(vehicleTypeRef.current?.value ?? '0')
    void vehiclesService.create(vehicleTypeId, inputValue)
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

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehicle Types</label>
          <select className='w-full' ref={vehicleTypeRef}>
            {vehicleTypes?.map(vehicleType => (
              <option key={vehicleType.id} value={vehicleType.id}>{vehicleType.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='licensePlate'>License Plate</label>
          <input onChange={handleChange} id='licensePlate' value={inputValue.licensePlate} type="text" name='licensePlate' />
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
          <button className='bg-blue px-4 py-1 rounded-lg text-white' type='submit'>Add</button>
          <button className='bg-red px-4 py-1 rounded-lg text-white' type='button' onClick={closeModal}>Close</button>
        </div>
      </form>
    </>
  )

  const addVehicleMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>There is no vehicle types, please enter a new vehicle type before adding a new vehicle</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button text={'Close'} color={'bg-red'} onClick={closeModal} />
      </div>
    </>
  )

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        {vehicleTypes.length > 0 ? modal() : addVehicleMessage()}
      </div>
    </Modal>
  )
}

export default AddVehicleForm
