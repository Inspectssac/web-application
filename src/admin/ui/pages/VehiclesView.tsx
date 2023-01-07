import React, { ReactElement } from 'react'
import VehicleTypeComponent from '../components/vehicle-types/VehicleTypeComponent'
import VehicleComponent from '../components/vehicles/VehicleComponent'

const VehiclesView = (): ReactElement => {
  return (
    <div className='container'>
      <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-light-grey after:block after:mt-1'>Vehicles</h1>
      <div className='grid grid-cols-table gap-12'>
        <div>
          <h2 className='text-xl font-bold uppercase '>Vehicle types</h2>
          <VehicleTypeComponent />
        </div>
        <VehicleComponent />
      </div>
    </div>
  )
}

export default VehiclesView
