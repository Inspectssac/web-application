import React, { ReactElement, useEffect, useState } from 'react'
// import useMediaQuery from '@/shared/hooks/userMediaQuery'
import { AppDispatch } from '@/shared/config/store'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/Button'
import { findAllRoutes, getDateRange, getLastDateRequest, getReports } from '@/shared/config/store/features/routes-slice'
import { DateRange, DateRangeObject } from '@/shared/models/date-range'

const Home = (): ReactElement => {
  // const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')
  const dispatch = useDispatch<AppDispatch>()
  const reports = useSelector(getReports)
  const lastDateRequest = useSelector(getLastDateRequest)
  const dateRangeFromStore = useSelector(getDateRange)

  const [reportsByType, setReportsByType] = useState<Map<string, number>>(new Map<string, number>())

  const [dateRange, setDateRange] = useState<DateRange>(dateRangeFromStore)

  useEffect(() => {
    const reportsJson = localStorage.getItem('routes-request')
    if (!reportsJson) {
      void dispatch(findAllRoutes({ dateRange: new DateRange(), profileId: 0 }))
    }
  }, [reports])

  useEffect(() => {
    groupReportsByReportType()
  }, [reports])

  const findAll = (): void => {
    void dispatch(findAllRoutes({ dateRange, profileId: 0 }))
  }

  const onChangeInputDate = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    const aux: DateRangeObject = {
      'date-start': dateRange.formattedDateStart(),
      'date-end': dateRange.formattedDateEnd()
    }

    aux[name as keyof DateRangeObject] = value

    setDateRange(DateRange.fromJson(aux))
  }

  const groupReportsByReportType = (): void => {
    const reportsByReportType: Map<string, number> = new Map<string, number>()
    reports.forEach(report => {
      const name = report.reportType.name
      const value = reportsByReportType.get(name) ?? 0
      reportsByReportType.set(name, reportsByReportType.has(name) ? value + 1 : 1)
    })

    setReportsByType(reportsByReportType)
  }

  return (
    <div className='container-page'>
      <main>
        <h1 className='text-4xl font-bold'>Inspect<span className='text-red-logo'>ESSAC</span></h1>
        <div className='w-full border-b-2 mt-2 mb-4'></div>

        <div className='flex gap-7 items-center justify-between mt-2'>
          <div className='flex justify-between w-3/5 gap-5'>
            <div className='w-1/2'>
              <p>Fecha Inicio</p>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type="date"
                name='date-start'
                value={dateRange.formattedDateStart()}
                onChange={onChangeInputDate}
              />
            </div>
            <div className='w-1/2'>
              <p>Fecha Fin</p>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type="date"
                name='date-end'
                value={dateRange.formattedDateEnd()}
                onChange={onChangeInputDate}
              />
            </div>
          </div>

          <div className='flex gap-3 justify-end items-center w-2/5'>
            <div>
              <p className='font-bold'>Fecha de última búsqueda</p>
              <p>{lastDateRequest !== null ? lastDateRequest.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h12' }) : ''}</p>
            </div>
            <Button color='secondary' onClick={findAll}>Buscar recorridos</Button>
          </div>
        </div>

        <div className='mt-4'>
          <p className='uppercase font-semibold text-xl'>Cantidad de Reportes</p>
          {Array.from(reportsByType.entries()).length > 0
            ? (
              <div className='flex gap-5 mt-5'>
                {
                  Array.from(reportsByType.entries()).map(([key, value]) => {
                    return (
                      <div
                        className='inline-block p-8 bg-black text-white rounded-md text-center'
                        key={key}>
                        <p className='text-xl'>{key.toUpperCase()}</p>
                        <p className='text-2xl'>{value}</p>
                      </div>
                    )
                  })
                }
              </div>
              )
            : (
              <p className='uppercase mt-3 text-red font-semibold'>No hay recorridos registrados en ese rango de fecha</p>
              )
          }

        </div>
      </main>
    </div>
  )
}

export default Home
