import React, { type ReactElement, useContext, useMemo } from 'react'
import Button from '@/shared/ui/components/Button'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'
import AssignSubtype from './AssignSubtype'

const VehicleTypeSubTypes = (): ReactElement => {
  const {
    selectedVehicleType: vehicleType
  } = useContext(VehicleTypeContext)
  const [showAssignSubtype, setShowAssignSubtype] = React.useState(false)

  const subTypes = useMemo(
    () => {
      console.log('vehicleType?.children', vehicleType?.children)
      return vehicleType?.children ?? []
    }
    , [vehicleType])

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Subtipos asignados al <span className='text-red'>tipo de vehiculo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={() => { setShowAssignSubtype(true) }}>Agregar subtipo</Button>
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
        {showAssignSubtype && <AssignSubtype close={() => { setShowAssignSubtype(false) }} />}
      </section>
    )
  }

  return (
    <>
      {
        vehicleType !== null && body()
      }
    </>
  )
}

export default VehicleTypeSubTypes
