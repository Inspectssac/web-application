import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import Toast from '@/shared/ui/components/Toast'
import React, { type ReactElement, useState } from 'react'
import VehicleTypeComponent from '../components/vehicle-types/VehicleTypeComponent'
import VehicleTypeMaterialsComponent from '../components/vehicle-types/VehicleTypeMaterialsComponent'
import Button from '@/shared/ui/components/Button'
import VehicleTypeSubTypes from '../components/vehicle-types/VehicleTypeSubtypes'

const TOAST_ID = 'vehicle-types'

type VehicleTypeTab = 'materials' | 'subtypes'

interface VehicleTypeContextInterface {
  toastId: string
  vehicleType: VehicleType | null
  vehicleTypetab: VehicleTypeTab
  setVehicleType: (vehicleType: VehicleType) => void
}

export const VehicleTypeContext = React.createContext<VehicleTypeContextInterface>({
  toastId: '',
  vehicleType: null,
  vehicleTypetab: 'materials',
  setVehicleType: () => { }
})

const VehicleTypesView = (): ReactElement => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)
  const [vehicleTypeTab, setVehicleTypeTab] = useState<VehicleTypeTab>('materials')

  return (
    <VehicleTypeContext.Provider
      value={{
        toastId: TOAST_ID,
        vehicleType: selectedVehicleType,
        vehicleTypetab: vehicleTypeTab,
        setVehicleType: setSelectedVehicleType
      }}>
      <div className='container-page'>
        <div className='flex justify-between items-center'>
          <h1
            className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'
          >
            Tipo de Vehículos
          </h1>
          <div className='flex gap-3'>
            <Button color={vehicleTypeTab === 'materials' ? 'primary' : 'secondary'} onClick={() => setVehicleTypeTab('materials')}>Materiales</Button>
            <Button color={vehicleTypeTab === 'subtypes' ? 'primary' : 'secondary'} onClick={() => setVehicleTypeTab('subtypes')}>Subtipos</Button>
          </div>
        </div>

        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <VehicleTypeComponent />
          </div>
          <div>
            {
              vehicleTypeTab === 'materials'
                ? <VehicleTypeMaterialsComponent />
                : <VehicleTypeSubTypes />
            }
          </div>
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </VehicleTypeContext.Provider>

  )
}

export default VehicleTypesView
