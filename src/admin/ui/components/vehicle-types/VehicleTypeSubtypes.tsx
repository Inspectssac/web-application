import React, { ReactElement, useContext, useMemo } from 'react'
import { VehicleTypeContext } from '../../pages/VehicleTypesView'
import Button from '@/shared/ui/components/Button'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import AssignSubtype from './AssignSubtype'
import { VehicleType } from '@/routes/models/vehicle-type.interface'

const VehicleTypeSubTypes = (): ReactElement => {
  const vehicleTypeContext = useContext(VehicleTypeContext)
  const [showAssignSubtype, setShowAssignSubtype] = React.useState(false)

  const vehicleType = useMemo(
    () => vehicleTypeContext.vehicleType
    , [vehicleTypeContext.vehicleType])

  const subTypes = useMemo(
    () => vehicleType?.children ?? []
    , [vehicleType])

  const update = (subType: VehicleType): void => {
    location.reload()
  }

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Subtipos asignados al <span className='text-red'>tipo de vehiculo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={() => setShowAssignSubtype(true)}>Agregar subtipo</Button>
        </div>
        {
          subTypes.length > 0
            ? (
              <div className='flex gap-4 flex-wrap'>
                {
                  subTypes.map(material => (
                    <div key={material.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{material.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { }} />
                    </div>
                  ))
                }
              </div>
              )
            : (
              <p>{'El tipo de vehiculo no tiene ningún tipo de material asignado'}</p>
              )
        }
        {showAssignSubtype && <AssignSubtype close={() => { setShowAssignSubtype(false) }} update={update} />}
      </section>
    )
  }

  return (
    <div>
      {
        vehicleType !== null && body()
      }
    </div>
  )
}

export default VehicleTypeSubTypes
