import { VehicleDto } from '@/routes/models/interface/vehicle-dto.interface'
import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import { VehiclesService } from '@/routes/services/vehicle.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/VehiclesView'

interface AddVehicleFormProps {
  closeModal: () => void
  onFinishSubmit: (vehicle: Vehicle) => void
}

const INITIAL_STATE = {
  licensePlate: '',
  provider: '',
  carrier: '',
  imei: '',
  lastMaintenance: new Date().toISOString()
}
const AddVehicleForm = ({ closeModal, onFinishSubmit }: AddVehicleFormProps): ReactElement => {
  const toastContext = useContext(ToastContext)
  const vehiclesService = new VehiclesService()
  const vehicleTypesService = new VehicleTypesService()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

  const [inputValue, setInputValue] = useState<VehicleDto>(INITIAL_STATE)

  const vehicleTypeRef = useRef<HTMLSelectElement>(null)

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [validInputs, setValidInputs] = useState({
    licensePlate: false,
    provider: false,
    carrier: false,
    imei: false,
    lastMaintenance: false
  })

  useEffect(() => {
    void vehicleTypesService.findAll()
      .then(setVehicleTypes)
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehicleTypeId = parseInt(vehicleTypeRef.current?.value ?? '0')
    void vehiclesService.create(vehicleTypeId, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Vehicle created correctly', { toastId: toastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

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

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='font-medium'>Vehicle Types</label>
          <select
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
            ref={vehicleTypeRef}>
            {vehicleTypes?.map(vehicleType => (
              <option key={vehicleType.id} value={vehicleType.id}>{vehicleType.name}</option>
            ))}
          </select>
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='licensePlate'>License Plate</label>
          <Input
            value={inputValue.licensePlate}
            name='license plate' placeholder='License Plate' type='text'
            setValid={(valid) => setIsValidInput('licensePlate', valid)}
            setValue={(value) => setValueInputValue('licensePlate', value)}></Input>
          {/* <input onChange={handleChange} id='licensePlate' value={inputValue.licensePlate} type="text" name='licensePlate' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='provider'>Provider</label>
          <Input
            value={inputValue.provider}
            name='provider' placeholder='Provider' type='text'
            setValid={(valid) => setIsValidInput('provider', valid)}
            setValue={(value) => setValueInputValue('provider', value)}></Input>
          {/* <input onChange={handleChange} id='provider' value={inputValue.provider} type="text" name='provider' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='carrier'>Carrier</label>
          <Input
            value={inputValue.carrier}
            name='carrier' placeholder='Carrier' type='text'
            setValid={(valid) => setIsValidInput('carrier', valid)}
            setValue={(value) => setValueInputValue('carrier', value)}></Input>
          {/* <input onChange={handleChange} id='carrier' value={inputValue.carrier} type="text" name='carrier' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='imei'>Imei</label>
          <Input
            value={inputValue.imei}
            name='imei' placeholder='Imei' type='text'
            setValid={(valid) => setIsValidInput('imei', valid)}
            setValue={(value) => setValueInputValue('imei', value)}></Input>
          {/* <input onChange={handleChange} id='imei' value={inputValue.imei} type="text" name='imei' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor="lastMaintenance">Last Maintenance</label>
          <Input
            value={new Date(inputValue.lastMaintenance).toISOString().substring(0, 10)}
            name='lastMaintenance' placeholder='Provider' type='date'
            setValid={(valid) => setIsValidInput('lastMaintenance', valid)}
            setValue={(value) => setValueInputValue('lastMaintenance', value)}></Input>
          {/* <input onChange={handleChange} type="date" id='lastMaintenance' name='lastMaintenance' value={new Date(inputValue.lastMaintenance).toISOString().substring(0, 10)} /> */}
        </div>

        <div className='mt-4 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit' disabled={!canSubmit}>Create</Button>
          <Button color='danger' onClick={closeModal}>Close</Button>
        </div>
      </form>
    </>
  )

  const addVehicleMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>There is no vehicle types, please enter a new vehicle type before adding a new vehicle</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='danger' onClick={closeModal}>Close</Button>
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
