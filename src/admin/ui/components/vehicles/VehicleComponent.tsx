import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'
import AddVehicleForm from './AddVehicleForm'
import UpdateVehicleForm from './UpdateVehicleForm'
import { ToastContext } from '../../pages/VehiclesView'
import { toast } from 'react-toastify'
import Table from '@/shared/ui/components/Table'

const VehicleComponent = (): ReactElement => {
  const toastContext = useContext(ToastContext)
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
        toast('Vehicle deleted correctly', { toastId: toastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
  }

  const update = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleUpdateModal()
  }

  const tableHeadStyle = 'text-sm font-medium text-white px-6 py-4 capitalize'
  const tableBodyStyle = 'text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'

  return (
    <div>
      {showAddVehicleModal && <AddVehicleForm closeModal={toggleAddModal} onFinishSubmit={onFinishSubmit} />}
      {showUpdateVehicleModal && <UpdateVehicleForm closeModal={toggleUpdateModal} vehicle={selectedVehicle} onFinishSubmit={onFinishSubmit} />}
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-xl font-bold uppercase'>Vehículos</h2>
        <Button color='primary' onClick={toggleAddModal}>Añadir vehículo</Button>
      </div>
      {
        vehicles.length > 0
          ? (
            <Table>
              <thead className='border-b bg-black'>
                <tr>
                  <th scope='col' className={tableHeadStyle}>Placa</th>
                  <th scope='col' className={tableHeadStyle}>Proveedor</th>
                  <th scope='col' className={tableHeadStyle}>Transportista</th>
                  <th scope='col' className={tableHeadStyle}>Imei</th>
                  <th scope='col' className={tableHeadStyle}>Último Mantenimiento</th>
                  <th scope='col' className={tableHeadStyle}>Tipo de vehículo</th>
                  <th scope='col' className={tableHeadStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  vehicles.map(vehicle => (
                    <tr key={vehicle.licensePlate} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
                      <td className={tableBodyStyle}>{vehicle.licensePlate}</td>
                      <td className={tableBodyStyle}>{vehicle.provider}</td>
                      <td className={tableBodyStyle}>{vehicle.carrier}</td>
                      <td className={tableBodyStyle}>{vehicle.imei}</td>
                      <td className={tableBodyStyle}>{new Date(vehicle.lastMaintenance).toDateString()}</td>
                      <td className={tableBodyStyle}>{vehicle.vehicleType.name}</td>
                      <td className={` ${tableBodyStyle} flex justify-center gap-3`}>
                        <EditIcon className='cursor-pointer w-5 h-5' onClick={() => update(vehicle)} />
                        <DeleteIcon className='cursor-pointer w-5 h-5 text-red' onClick={() => remove(vehicle)} />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            )
          : (<p>No hay vehiculos registrados</p>)

      }
    </div>
  )
}

export default VehicleComponent
