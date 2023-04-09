import React, { type ReactElement, useContext, useState } from 'react'
import { toast } from 'react-toastify'

import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'

import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'
import VehicleTypeForm from './VehicleTypeForm'

type FormAction = 'add' | 'update'

const VehicleTypeComponent = (): ReactElement => {
  const {
    vehicleTypes,
    selectedVehicleType,
    setSelectedVehicleType,
    toastId,
    remove
  } = useContext(VehicleTypeContext)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const reset = (): void => {
    setSelectedVehicleType(null)
    setFormAction('add')
  }

  const updateVehicleType = (vehicleType: VehicleType): void => {
    setSelectedVehicleType(vehicleType)
    setFormAction('update')
  }

  const removeVehicleType = (vehicleType: VehicleType): void => {
    const vehicleTypesService = new VehicleTypesService()
    const result = confirm(`Estás seguro que quieres eliminar el tipo de vehículo: ${vehicleType.name}`)
    if (!result) return

    const id = vehicleType.id
    void vehicleTypesService.remove(id)
      .then(() => {
        remove(id)
        toast('Tipo de vehículo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <div>
      <section>
        {
          vehicleTypes.map(vehicleType => (
            <div key={vehicleType.id}
              onClick={() => { setSelectedVehicleType(vehicleType) }}
              className={`cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${vehicleType.id === selectedVehicleType?.id ? 'bg-blue text-white' : ''}`}>
              <p className='px-2'>{vehicleType.name}</p>
              <div className='flex gap-3 px-2'>
                <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { updateVehicleType(vehicleType) }} />
                <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => { removeVehicleType(vehicleType) }} />
              </div>
            </div>
          ))
        }
        { vehicleTypes.length <= 0 && (<p>No hay tipo de vehículos</p>)}
      </section>
      <section>
        <VehicleTypeForm formAction={formAction} reset={reset} />
      </section>
    </div>

  )
}

export default VehicleTypeComponent
