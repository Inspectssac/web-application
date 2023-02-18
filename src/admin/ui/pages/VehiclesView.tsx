import Toast from '@/shared/ui/components/Toast'
import React, { ReactElement } from 'react'
import VehicleTypeComponent from '../components/vehicle-types/VehicleTypeComponent'
import VehicleComponent from '../components/vehicles/VehicleComponent'

export const ToastContext = React.createContext({ id: '' })

const TOAST_ID = 'vehicle-id'
const VehiclesView = (): ReactElement => {
  return (
    <ToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-light-gray after:block after:mt-1'>Vehículos</h1>
        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <h2 className='text-xl font-bold uppercase'>Tipo de vehículos</h2>
            <VehicleTypeComponent />
          </div>
          <VehicleComponent />
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </ToastContext.Provider>

  )
}

export default VehiclesView
