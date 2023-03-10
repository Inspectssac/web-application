import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import Modal from '@/shared/ui/components/Modal'
import Button from '@/shared/ui/components/Button'
import { useNavigate } from 'react-router-dom'
import { ReportTypesService } from '@/reports/services/report-type.service'
import { ReportType } from '@/reports/models/report-type.interface'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'

interface AssingVehicleTypeProps {
  reportTypeVehicleTypes: VehicleType[]
  reportType: ReportType
  update: (vehicleTypes: VehicleType[]) => void
  close: () => void
}

const VEHICLE_TYPE_INITIAL_STATE: VehicleType = {
  id: 0,
  name: '',
  createdAt: '',
  updatedAt: '',
  materials: []
}

const AssingVehicleType = ({ reportType, reportTypeVehicleTypes, update, close }: AssingVehicleTypeProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const vehicleTypeService = new VehicleTypesService()
  const reportTypesService = new ReportTypesService()

  const navigate = useNavigate()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>(VEHICLE_TYPE_INITIAL_STATE)

  useEffect(() => {
    void vehicleTypeService.findAll()
      .then(response => {
        const actualVehicleTypeIds = reportTypeVehicleTypes.map(vehicleType => vehicleType.id)
        setVehicleTypes(response.filter(vehicleType => !actualVehicleTypeIds.includes(vehicleType.id)))
      })
  }, [reportTypeVehicleTypes])

  useEffect(() => {
    if (vehicleTypes.length > 0) setSelectedVehicleType(vehicleTypes[0])
  }, [vehicleTypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const vehicleType = vehicleTypes.find(vehicleType => vehicleType.id === parseInt(value))
    setSelectedVehicleType(vehicleType ?? VEHICLE_TYPE_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void reportTypesService.assignVehicleType(reportType.id, selectedVehicleType.id)
      .then(response => {
        update(response.vehicleTypes)
        close()
        toast('Tipo de veh??culo asignado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Tipo de veh??culos</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedVehicleType.id}>
          {vehicleTypes.map(vehicleType => (
            <option key={vehicleType.id} value={vehicleType.id}>{vehicleType.name}</option>
          ))}
        </select>
        <div className='mt-4'>
          <Button color='primary' type='submit'>Asignar</Button>
        </div>
      </form>
    )
  }

  const addVehicleTypeMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los tipos de veh??culo est??n asignados, crea alg??n tipo de veh??culo si deseas asignar m??s</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={() => navigate('/admin/tipo-vehiculos')}>A??adir tipo de veh??culos</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='uppercase font-bold'>Asignar tipo de veh??culo al checklist { reportType.name }</h2>
          <Button color='secondary' onClick={close}>Cerrar</Button>
        </div>
        {
          vehicleTypes.length > 0 ? modal() : addVehicleTypeMessage()
        }
      </div>

    </Modal >
  )
}

export default AssingVehicleType
