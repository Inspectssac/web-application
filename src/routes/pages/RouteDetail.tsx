import React, { ReactElement, useEffect, useState } from 'react'
import { FieldReport } from '@/reports/models/field-report.interface'
import { Report } from '@/reports/models/report.interface'
import { ReportsService } from '@/reports/services/report.service'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import Button from '@/shared/ui/components/Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ShowImageEvidence from '../components/ShowImageEvidence'
import { Route } from '../models/route.interface'
import RoutesServices from '../services/route.services'
import { ReportGroup } from '@/reports/models/group.interface'

const ROUTE_INITIAL_STATE = {
  id: '',
  createdAt: '',
  updatedAt: '',
  startLocation: '',
  endLocation: '',
  materialType: '',
  name: '',
  checked: false,
  doubleLicensePlate: false,
  isFull: false,
  vehicles: [],
  reports: [],
  routeProfiles: []
}

const REPORT_TYPE_INITIAL_STATE = {
  createdAt: '',
  updatedAt: '',
  id: 0,
  name: ''
}

const REPORT_INITIAL_STATE = {
  createdAt: '',
  updatedAt: '',
  id: '',
  location: '',
  checked: false,
  type: '',
  checkpoints: [],
  routeId: '',
  reportType: REPORT_TYPE_INITIAL_STATE
}

interface FieldSelected {
  url: string
  name: string
}

const RouteDetail = (): ReactElement => {
  const routesService = new RoutesServices()
  const reportsService = new ReportsService()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [route, setRoute] = useState<Route>(ROUTE_INITIAL_STATE)
  const [report, setReport] = useState<Report>(REPORT_INITIAL_STATE)
  const [fieldReports, setFieldReports] = useState<Map<number, FieldReport[]>>(new Map<number, FieldReport[]>())
  const [groups, setGroups] = useState<ReportGroup[]>([])

  const [fieldSelected, setFieldSelected] = useState<FieldSelected>({
    name: '',
    url: ''
  })
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    const id = searchParams.get('id') ?? 0
    if (id === 0) return
    void routesService.findById(id)
      .then(route => {
        setRoute(route)
        setReport(route.reports[0])

        void reportsService.findAllFieldsByReportId(route.reports[0].id)
          .then(groupFieldReports)
      })
  }, [])

  const groupFieldReports = (fieldReports: FieldReport[]): void => {
    const fieldReportsMap = new Map<number, FieldReport[]>()
    const reportGroups: ReportGroup[] = []

    fieldReports.forEach(fieldReport => {
      const groupId = fieldReport.group.id

      const groupIndex = groups.findIndex(g => g.id === groupId)

      if (groupIndex === -1) reportGroups.push({ id: groupId, name: fieldReport.group.name })

      if (fieldReportsMap.has(groupId)) {
        fieldReportsMap.get(groupId)?.push(fieldReport)
      } else {
        fieldReportsMap.set(groupId, [fieldReport])
      }
    })

    setFieldReports(fieldReportsMap)
    setGroups(reportGroups)
  }

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  return (
    <div className='container-page'>
      <h1 className='uppercase text-3xl font-semibold'>Recorrido {route.name}</h1>
      <div className='w-full border-b-2 mt-2 mb-5'></div>
      <div className='uppercase'>
        <h2 className="font-semibold text-xl after:w-36 after:h-[2px] after:bg-gray-light after:block mb-2">Detalle Recorrido</h2>
        <div className='flex gap-6 mb-1'>
          <p className='font-semibold'>Ubicación de Inicio: </p>
          <p>{route.startLocation}</p>
        </div>
        <div className='flex gap-6 mb-1'>
          <p className='font-semibold'>Ubicación de Llegada: </p>
          <p>{route.endLocation !== null ? route.endLocation : 'Ruta no terminada'}</p>
        </div>
        <div className='flex gap-6 mb-1'>
          <p className='font-semibold'>Fecha de creacion: </p>
          <p>{new Date(route.createdAt).toLocaleDateString('Es-es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h12' })}</p>
        </div>
        <div className='flex gap-6 mb-1'>
          <p className='font-semibold'>Fue revisado: </p>
          <p>{route.checked ? 'Revisado' : 'No revisado'}</p>
        </div>
      </div>
      <div className='uppercase mt-3'>
        <h2 className="font-semibold text-xl after:w-36 after:h-[2px] after:bg-gray-light after:block mb-2">Detalle Personal</h2>
        <div className='grid grid-cols-3 gap-3'>
          {
            route.routeProfiles.map(routeProfile => {
              const { profile } = routeProfile
              return (
                <div key={routeProfile.profileId}>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Rol</p>
                    <p>: {routeProfile.role}</p>
                  </div>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Nombre</p>
                    <p>: {profile.fullName}</p>
                  </div>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Dni</p>
                    <p>: {profile.dni}</p>
                  </div>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Empresa</p>
                    <p>: {profile.company}</p>
                  </div>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Telefono 1</p>
                    <p>: {profile.phone1}</p>
                  </div>
                  <div className='flex gap-6'>
                    <p className='font-semibold w-1/4'>Telefono 2</p>
                    <p>: {profile.phone2}</p>
                  </div>
                </div>
              )
            })
          }
        </div>

      </div>
      <div className='uppercase mt-4'>
        <h2 className="font-semibold text-xl after:w-36 after:h-[2px] after:bg-gray-light after:block mb-2">Detalle Vehículo</h2>
        <div className=''>
          {route.vehicles.map(vehicle => {
            return (
              <div key={vehicle.licensePlate}>
                <div className='flex gap-6'>
                  <p className='font-semibold w-1/6'>Placa</p>
                  <p>: {vehicle.licensePlate}</p>
                </div>
                <div className='flex gap-6'>
                  <p className='font-semibold w-1/6'>Tipo de Unidad</p>
                  <p>: {vehicle.vehicleType.name}</p>
                </div>
                <div className='flex gap-6'>
                  <p className='font-semibold w-1/6'>Imei</p>
                  <p>: {vehicle.imei}</p>
                </div>
                <div className='flex gap-6'>
                  <p className='font-semibold w-1/6'>Último Mantenimiento</p>
                  <p>: {vehicle.lastMaintenance}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <div className='flex gap-3 justify-between items-center mt-6'>
        <h2 className='uppercase text-3xl font-semibold '>Checklist</h2>
        { report.checkpoints.length > 0 ? <Button color='primary' onClick={() => { navigate(`/detalle-checkpoints?report-id=${report.id}&route-id=${route.id}`) }}>Ver Observaciones</Button> : <div></div>}
      </div>
      <div className='w-full border-b-2 mt-2 mb-4'></div>
      <div className='uppercase'>
        <div className='flex gap-6'>
          <p className='font-semibold w-1/6'>Tipo de Reporte</p>
          <p>: {report.reportType.name}</p>
        </div>
        <div className='flex gap-6'>
          <p className='font-semibold w-1/6'>Ubicación</p>
          <p>: {report.location}</p>
        </div>
        <div className='flex gap-6'>
          <p className='font-semibold w-1/6'>Checkpoints</p>
          <p>: {report.checkpoints.length}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6 uppercase'>
        {
          Array.from(fieldReports.entries()).sort((a, b) => a[0] - b[0]).map(([key, value]) => {
            const group = groups.find((g) => g.id === key)
            return (
              <div
                key={key}
                className='my-4'
              >
                <p className='text-xl'>{group?.name.toUpperCase()}</p>
                <div className='w-[80%] border-b-2 my-2'></div>
                <div>
                  {
                    value.map(fieldReport => {
                      return (
                        <div key={fieldReport.fieldId}>
                          <div className='flex items-center gap-4 mb-2'>
                            <p className='font-semibold w-1/3'>{fieldReport.field.name}</p>
                            <div className='flex items-center gap-4'>
                              <p>: {fieldReport.value}</p>
                              {fieldReport.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(fieldReport.imageEvidence, fieldReport.field.name) }}></EyeIcon>}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      {showImage && <ShowImageEvidence imageUrl={fieldSelected.url} name={fieldSelected.name} close={() => { setShowImage(false) }} />}
    </div>

  )
}

export default RouteDetail
