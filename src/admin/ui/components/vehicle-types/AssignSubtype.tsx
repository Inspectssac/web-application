import React, { type ReactElement, useContext, useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { VEHICLE_TYPE_INITIAL_STATE, type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { VehicleTypeContext } from '../../pages/VehicleTypesView'

interface AssignSubtypeProps {
  update: (vehicleType: VehicleType) => void
  close: () => void
}

const AssignSubtype = ({ update, close }: AssignSubtypeProps): ReactElement => {
  const vehicleTypeContext = useContext(VehicleTypeContext)
  const vehicleTypeService = new VehicleTypesService()

  const [subtypes, setSubtypes] = useState<VehicleType[]>([])
  const [selectedSubtype, setSelectedSubtype] = useState<VehicleType>(VEHICLE_TYPE_INITIAL_STATE)

  const vehicleType = useMemo(
    () => vehicleTypeContext.vehicleType
    , [vehicleTypeContext.vehicleType])

  useEffect(() => {
    void vehicleTypeService.findAll()
      .then(response => {
        const actualSubtypes = vehicleType?.children.map(vehicleType => vehicleType.id)
        setSubtypes(response.filter(subtype => !actualSubtypes?.includes(subtype.id) && subtype.id !== vehicleType?.id && subtype.parent === null))
      })
  }, [vehicleType])

  useEffect(() => {
    if (subtypes.length > 0) setSelectedSubtype(subtypes[0])
  }, [subtypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const subtype = subtypes.find(subtype => subtype.id === value)
    setSelectedSubtype(subtype ?? VEHICLE_TYPE_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void vehicleTypeService.assingParent(selectedSubtype.id ?? '', vehicleType?.id ?? '')
      .then(response => {
        update(response)
        close()
        toast('Subtipo asignado correctamente', { toastId: vehicleTypeContext.toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId: vehicleTypeContext.toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Subtipos</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedSubtype.id}>
          {subtypes.map(subtype => (
            <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
          ))}
        </select>
        <div className='mt-4'>
          <Button color='primary' type='submit'>Asignar</Button>
        </div>
      </form>
    )
  }

  const addMaterialMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los subtipos están asignados, crea algún tipo de vehículo si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={close}>Añadir tipo de vehículos</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='uppercase font-bold'>Asignar subtipos al tipo de vehiculo { vehicleType?.name }</h2>
          <Button color='secondary' onClick={close}>Cerrar</Button>
        </div>
        {
          subtypes.length > 0 ? modal() : addMaterialMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignSubtype
