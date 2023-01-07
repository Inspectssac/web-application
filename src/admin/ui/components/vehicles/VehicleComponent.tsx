import React, { ReactElement, useEffect, useState } from 'react'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'
import AddVehicleForm from './AddVehicleForm'
import UpdateVehicleForm from './UpdateVehicleForm'

const VehicleComponent = (): ReactElement => {
  const vehiclesService = new VehiclesService()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false)
  const [showUpdateVehicleModal, setShowUpdateVehicleModal] = useState<boolean>(false)

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    void vehiclesService.findAll()
      .then(setVehicles)
  }, [])

  const toggleAddModal = (): void => {
    setShowAddVehicleModal(!showAddVehicleModal)
  }

  const toggleUpdateModal = (): void => {
    setShowUpdateVehicleModal(!showUpdateVehicleModal)
  }

  const onFinishSubmit = (vehicle: Vehicle): void => {
    refreshList(vehicle, vehicle.licensePlate)
  }

  const refreshList = (vehicle: Vehicle, licensePlate: string, remove: boolean = false): void => {
    const index = vehicles.findIndex(vehicle => vehicle.licensePlate === licensePlate)

    if (index === -1) {
      setVehicles([...vehicles, vehicle])
      return
    }
    if (remove) {
      setVehicles(vehicles.filter(vehicle => vehicle.licensePlate !== licensePlate))
      return
    }

    const vehiclesList = [...vehicles.slice(0, index), vehicle, ...vehicles.slice(index + 1, vehicles.length)]
    setVehicles(vehiclesList)
  }

  const remove = (vehicle: Vehicle): void => {
    const result = confirm(`Are you sure you want to delete car with license plate ${vehicle.licensePlate}`)

    if (!result) return

    const { licensePlate } = vehicle
    void vehiclesService.remove(licensePlate)
      .then(response => {
        refreshList(response, licensePlate, true)
      })
  }

  const update = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleUpdateModal()
  }

  return (
    <div>
      {showAddVehicleModal && <AddVehicleForm closeModal={toggleAddModal} onFinishSubmit={onFinishSubmit} />}
      {showUpdateVehicleModal && <UpdateVehicleForm closeModal={toggleUpdateModal} vehicle={selectedVehicle} onFinishSubmit={onFinishSubmit} />}
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-xl font-bold uppercase '>Vehicles</h2>
        <Button text='Add Vehicle' color='bg-blue' onClick={toggleAddModal} />
      </div>
      {
        vehicles.length > 0
          ? (
          <table className='w-full'>
            <thead>
              <tr>
                <th>License Plate</th>
                <th>Provider</th>
                <th>Carrier</th>
                <th>Imei</th>
                <th>Last Maintenance</th>
                <th>Vehicle Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                vehicles.map(vehicle => (
                  <tr key={vehicle.licensePlate}>
                    <td>{vehicle.licensePlate}</td>
                    <td>{vehicle.provider}</td>
                    <td>{vehicle.carrier}</td>
                    <td>{vehicle.imei}</td>
                    <td>{new Date(vehicle.lastMaintenance).toDateString()}</td>
                    <td>{vehicle.vehicleType.name}</td>
                    <td className='flex justify-center gap-3'>
                      <EditIcon className='cursor-pointer w-5 h-5' onClick={() => update(vehicle)} />
                      <DeleteIcon className='cursor-pointer w-5 h-5 text-red' onClick={() => remove(vehicle)} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
            )
          : (<p>Theres no vehicles</p>)

      }
    </div>
  )
}

export default VehicleComponent
