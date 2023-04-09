import Toast from '@/shared/ui/components/Toast'
import React, { type ReactElement } from 'react'
import VehicleComponent from '../components/vehicles/VehicleComponent'

const TOAST_ID = 'vehicle-types'
export const VehicleToastContext = React.createContext({ id: '' })

const VehiclesView = (): ReactElement => {
  return (
    <VehicleToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'>Vehículos</h1>
        <div className='mb-5 sm:mb-0'>
          <VehicleComponent />
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </VehicleToastContext.Provider>

  )
}

export default VehiclesView
