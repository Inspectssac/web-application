import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { VehicleTypeContext } from '../../pages/VehicleTypesView'
import VehicleTypeForm from './VehicleTypeForm'

type FormAction = 'add' | 'update'

const VehicleTypeComponent = (): ReactElement => {
  const vehicleTypeContext = useContext(VehicleTypeContext)
  const vehicleTypesService = new VehicleTypesService()
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    void vehicleTypesService.findAll()
      .then(response => {
        response.sort((a, b) => a.id - b.id)
        setVehicleTypes(response)
      })
  }, [])

  useEffect(() => {
    if (vehicleTypes.length > 0) vehicleTypeContext.setVehicleType(vehicleTypes[0])
  }, [vehicleTypes])

  const reset = (): void => {
    setSelectedVehicleType(null)
    setFormAction('add')
  }

  const update = (vehicleType: VehicleType): void => {
    setSelectedVehicleType(vehicleType)
    setFormAction('update')
  }

  const remove = (vehicleType: VehicleType): void => {
    const result = confirm(`Estás seguro que quieres eliminar el tipo de vehículo: ${vehicleType.name}`)
    if (!result) return

    const id = vehicleType.id
    void vehicleTypesService.remove(id)
      .then(response => {
        updateFieldList(response, id, true)
        toast('Tipo de vehículo eliminado correctamente', { toastId: vehicleTypeContext.toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: vehicleTypeContext.toastId, type: 'error' })
      })
  }

  const onFinishSubmit = (vehicleType: VehicleType): void => {
    reset()
    updateFieldList(vehicleType, vehicleType.id)
  }

  const updateFieldList = (vehicleType: VehicleType, id: string, remove: boolean = false): void => {
    const index = vehicleTypes.findIndex(vehicleType => vehicleType.id === id)

    if (index === -1) {
      setVehicleTypes([...vehicleTypes, vehicleType])
      return
    }

    if (remove) {
      setVehicleTypes(vehicleTypes.filter(vehicleType => vehicleType.id !== id))
      return
    }

    const vehicleTypeList = [...vehicleTypes.slice(0, index), vehicleType, ...vehicleTypes.slice(index + 1, vehicleTypes.length)]
    setVehicleTypes(vehicleTypeList)
  }

  return (
    <div>
      <section>
        {
          vehicleTypes.map(vehicleType => (
            <div key={vehicleType.id}
              onClick={() => { vehicleTypeContext.setVehicleType(vehicleType) }}
              className={`cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${vehicleType.id === vehicleTypeContext.vehicleType?.id ? 'bg-blue text-white' : ''}`}>
              <p className='px-2'>{vehicleType.name}</p>
              <div className='flex gap-3 px-2'>
                <EditIcon className='cursor-pointer w-5 h-5' onClick={() => update(vehicleType)} />
                <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => remove(vehicleType)} />
              </div>
            </div>
          ))
        }
        { vehicleTypes.length <= 0 && (<p>No hay tipo de vehículos</p>)}
      </section>
      <section>
        <VehicleTypeForm vehicleType={selectedVehicleType} formAction={formAction} onFinishSubmit={onFinishSubmit} reset={reset} />
      </section>
    </div>

  )
}

export default VehicleTypeComponent
