import { VehicleType } from '@/routes/models/vehicle-type.interface'
import Toast from '@/shared/ui/components/Toast'
import React, { ReactElement, useState } from 'react'
import VehicleTypeComponent from '../components/vehicle-types/VehicleTypeComponent'
import VehicleTypeMaterialsComponent from '../components/vehicle-types/VehicleTypeMaterialsComponent'

const TOAST_ID = 'vehicle-types'

interface VehicleTypeContextInterface {
  toastId: string
  vehicleType: VehicleType | null
  setVehicleType: (vehicleType: VehicleType) => void
}

export const VehicleTypeContext = React.createContext<VehicleTypeContextInterface>({ toastId: '', vehicleType: null, setVehicleType: (vehicleType) => { console.log(vehicleType) } })

const VehicleTypesView = (): ReactElement => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)

  return (
    <VehicleTypeContext.Provider value={{ toastId: TOAST_ID, vehicleType: selectedVehicleType, setVehicleType: setSelectedVehicleType }}>
      <div className='container-page'>
        <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'>Tipo de Vehículos</h1>
        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <VehicleTypeComponent />
          </div>
          <div>
            <VehicleTypeMaterialsComponent />
          </div>
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </VehicleTypeContext.Provider>

  )
}

export default VehicleTypesView
