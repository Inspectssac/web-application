import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Vehicle } from '@/routes/models/vehicles.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'
import AddVehicleForm from './AddVehicleForm'
import UpdateVehicleForm from './UpdateVehicleForm'
import { toast } from 'react-toastify'
// import Table from '@/shared/ui/components/Table'
import ImportModal from '../ImportModal'
import { VehicleToastContext } from '../../pages/VehiclesView'
import Table, { Action, Column } from '@/shared/ui/components/table/Table'

const VehicleComponent = (): ReactElement => {
  const toastContext = useContext(VehicleToastContext)
  const vehiclesService = new VehiclesService()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false)
  const [showUpdateVehicleModal, setShowUpdateVehicleModal] = useState<boolean>(false)
  const [showImportModal, setShowImportModal] = useState<boolean>(false)

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

  const refreshImportedVehicles = (newVehicles: Vehicle[]): void => {
    setVehicles(vehicles.concat(newVehicles))
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
    const result = confirm(`Estás seguro que quieres eliminar el vehículo con placa: ${vehicle.licensePlate}`)

    if (!result) return

    const { licensePlate } = vehicle
    void vehiclesService.remove(licensePlate)
      .then(response => {
        refreshList(response, licensePlate, true)
        toast('Vehículo eliminado correctamente', { toastId: toastContext.id, type: 'success' })
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

  const handleImportExcel = (): void => {
    setShowImportModal(true)
  }

  const VEHICLE_COLUMNS: Array<Column<Vehicle>> = [
    {
      id: 'licensePlate',
      columnName: 'Placa',
      filterFunc: (vehicle) => vehicle.licensePlate,
      sortFunc: (a, b) => a.licensePlate > b.licensePlate ? 1 : -1,
      render: (vehicle) => vehicle.licensePlate
    },
    {
      id: 'provider',
      columnName: 'Proveedor',
      filterFunc: (vehicle) => vehicle.provider,
      sortFunc: (a, b) => a.provider > b.provider ? 1 : -1,
      render: (vehicle) => vehicle.provider
    },
    {
      id: 'company',
      columnName: 'Empresa',
      filterFunc: (vehicle) => vehicle.company,
      sortFunc: (a, b) => a.company > b.company ? 1 : -1,
      render: (vehicle) => vehicle.company
    },
    {
      id: 'imei',
      columnName: 'Imei',
      filterFunc: (vehicle) => vehicle.imei.length > 0 ? vehicle.imei : 'Imei registrado',
      sortFunc: (a, b) => {
        const imeiA = a.imei.length > 0 ? a.imei : 'Imei registrado'
        const imeiB = b.imei.length > 0 ? b.imei : 'Imei registrado'
        return imeiA > imeiB ? 1 : -1
      },
      render: (vehicle) => vehicle.imei.length > 0 ? vehicle.imei : 'Imei registrado'
    },
    {
      id: 'lastMaintenance',
      columnName: 'Último Mantenimiento',
      filterFunc: (vehicle) => {
        if (!vehicle.lastMaintenance) {
          return 'No registrado'
        }
        return vehicle.lastMaintenance.trim().length > 0 ? new Date(vehicle.lastMaintenance).toDateString() : 'No registrado'
      },
      sortFunc: (a, b) => {
        const aLastMaintenance = a.lastMaintenance ?? 'No registrado'
        const bLastMaintenance = b.lastMaintenance ?? 'No registrado'

        if (isNaN(Date.parse(aLastMaintenance)) && isNaN(Date.parse(bLastMaintenance))) {
          return aLastMaintenance > bLastMaintenance ? 1 : -1
        }

        return new Date(aLastMaintenance).getTime() - new Date(bLastMaintenance).getTime()
      },
      render: (vehicle) => {
        if (vehicle.lastMaintenance === null) {
          return 'No registrado'
        }

        if (vehicle.lastMaintenance.length === 0) {
          return 'No registrado'
        }

        return new Date(vehicle.lastMaintenance).toDateString()
      }
    },
    {
      id: 'soatExpiration',
      columnName: 'F. Venc. Soat',
      filterFunc: (vehicle) => new Date(vehicle.soatExpiration).toDateString(),
      sortFunc: (a, b) => new Date(a.soatExpiration).getTime() - new Date(b.soatExpiration).getTime(),
      render: (vehicle) => new Date(vehicle.soatExpiration).toDateString()
    },
    {
      id: 'technicalReviewExpiration',
      columnName: 'F. Venc. Revisión Técnica',
      filterFunc: (vehicle) => new Date(vehicle.technicalReviewExpiration).toDateString(),
      sortFunc: (a, b) => {
        const aTime = new Date(a.technicalReviewExpiration).getTime()
        const bTime = new Date(b.technicalReviewExpiration).getTime()

        return aTime - bTime
      },
      render: (vehicle) => new Date(vehicle.technicalReviewExpiration).toDateString()
    },
    {
      id: 'vehicleType',
      columnName: 'Tipo de vehículo',
      filterFunc: (vehicle) => vehicle.vehicleType.name,
      sortFunc: (a, b) => a.vehicleType.name > b.vehicleType.name ? 1 : -1,
      render: (vehicle) => vehicle.vehicleType.name
    },
    {
      id: 'brand',
      columnName: 'Marca',
      filterFunc: (vehicle) => vehicle.brand,
      sortFunc: (a, b) => a.brand > b.brand ? 1 : -1,
      render: (vehicle) => vehicle.brand
    },
    {
      id: 'model',
      columnName: 'Modelo',
      filterFunc: (vehicle) => vehicle.model,
      sortFunc: (a, b) => a.model > b.model ? 1 : -1,
      render: (vehicle) => vehicle.model
    }
  ]

  const PAGINATION = [5, 10, 20]

  const VEHICLE_ACTIONS: Array<Action<Vehicle>> = [
    {
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: update
    },
    {
      icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
      actionFunc: remove
    }
  ]

  return (
    <div className=''>
      {showAddVehicleModal && <AddVehicleForm closeModal={toggleAddModal} onFinishSubmit={onFinishSubmit} />}
      {showUpdateVehicleModal && <UpdateVehicleForm closeModal={toggleUpdateModal} vehicle={selectedVehicle} onFinishSubmit={onFinishSubmit} />}
      {showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshList={refreshImportedVehicles} toastId={toastContext.id} type='vehicle' />}

      <div className='flex justify-between items-center mb-5'>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button color='primary' onClick={handleImportExcel}>Importar Excel</Button>
          <Button color='primary' onClick={toggleAddModal}>Añadir vehículo</Button>
        </div>
      </div>
      {
        vehicles.length > 0
          ? <Table columns={VEHICLE_COLUMNS} data={vehicles} showFilter={true} pagination={PAGINATION} actions={VEHICLE_ACTIONS} />
          : (<p>No hay vehiculos registrados</p>)

      }
    </div>
  )
}

export default VehicleComponent
