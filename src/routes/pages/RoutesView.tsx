import React, { useState, useEffect, ReactElement, useMemo } from 'react'

import { AppDispatch } from '@/shared/config/store'
import Button from '@/shared/ui/components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { findAllRoutes, getDateRange, getLastDateRequest, getRoutes, getStatus } from '@/shared/config/store/features/routes-slice'
import { STATUS } from '@/shared/config/store/types'
import EnhancedTable from '../../shared/ui/components/EnhancedTable'
import { Route } from '../models/route.interface'
import { SortIconAsc, SortIconDesc } from '../assets/SortIcons'
import { Column } from 'react-table'
import { useNavigate } from 'react-router-dom'
import { DateRange, DateRangeObject } from '@/shared/models/date-range'

const FILTER_COLUMNS = [
  { name: 'Placa', value: 'licensePlate' },
  { name: 'Nombre', value: 'name' },
  { name: 'Ubicación de inicio', value: 'startLocation' }
]

const RoutesView = (): ReactElement => {
  // const routeServices = new RoutesServices()
  const dispatch = useDispatch<AppDispatch>()

  const routes = useSelector(getRoutes)
  const lastDateRequest = useSelector(getLastDateRequest)
  const routeStatus = useSelector(getStatus)
  const dateRangeStore = useSelector(getDateRange)

  const [dateRange, setDateRange] = useState<DateRange>(dateRangeStore)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterColumn, setFilterColumn] = useState<string>('name')
  const [filterText, setFilterText] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const routesJson = localStorage.getItem('routes-request')
    if (!routesJson) {
      void dispatch(findAllRoutes({ dateRange: new DateRange(), profileId: 0 }))
    }
  }, [])

  useEffect(() => {
    setIsLoading(routeStatus === STATUS.PENDING)
  }, [routeStatus])

  const findAll = (): void => {
    void dispatch(findAllRoutes({ dateRange, profileId: 0 }))
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  const handleSortColumn = (column: string): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
    console.log(column)
    setSortColumn(column)
  }

  const handleChangeFilterColumn = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    setFilterText('')
    setFilterColumn(value as keyof Route)
  }

  const getSortIcon = (column: string): React.ReactElement => {
    if (sortColumn !== column) return (<span></span>)
    const className = 'text-white w-6 h-6'
    return sortDirection === 'asc' ? <SortIconAsc className={className} /> : <SortIconDesc className={className} />
  }

  const filteredData = useMemo(() => {
    let filtered = Array.from(routes)
    if (filterText) {
      filtered = filtered.filter(item => {
        if (filterColumn === 'licensePlate') {
          return item.vehicles[0].licensePlate.toString().toLowerCase().includes(filterText.toLowerCase())
        }
        return item[filterColumn as keyof Route].toString().toLowerCase().includes(filterText.toLowerCase())
      })
    }
    if (sortColumn) {
      filtered.sort((a, b) => {
        let valueA
        let valueB
        switch (sortColumn) {
          case 'checkpoints':
            valueA = a.reports[0].checkpoints.length
            valueB = b.reports[0].checkpoints.length
            break
          case 'licensePlate':
            valueA = a.vehicles[0].licensePlate
            valueB = b.vehicles[0].licensePlate
            break
          default:
            valueA = a[sortColumn as keyof Route]
            valueB = b[sortColumn as keyof Route]
            break
        }

        if (valueA > valueB) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return filtered
  }, [routes, filterText, sortColumn, sortDirection])

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
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

  const COLUMN_HEADERS: Array<Column<Route>> = [
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Fecha de Creación', id: 'createdAt', accessor: (row: Route) => formatDate(row.createdAt) },
    { Header: 'Ubicación de inicio', id: 'startLocation', accessor: 'startLocation' },
    { Header: 'Ubicación de Llegada', id: 'endLocation', accessor: (row: Route) => row.endLocation === null ? 'No terminada' : row.endLocation },
    { Header: 'Checkpoints', id: 'checkpoints', accessor: (row: Route) => row.reports[0].checkpoints.length },
    { Header: 'Doble licencia', id: 'doubleLicensePlate', accessor: (row: Route) => row.doubleLicensePlate ? 'Si' : 'No' },
    { Header: '¿Va llena?', id: 'isFull', accessor: (row: Route) => row.isFull ? 'Si' : 'No' },
    { Header: 'Placa', id: 'licensePlate', accessor: (row: Route) => row.vehicles[0].licensePlate }
  ]

  return (
    <div className='container-page'>
      <div className='mt-4 mb-2 flex justify-between items-center'>
        <h2 className="font-bold text-3x text-left  uppercase text-3xl">Recorridos</h2>
        <Button color='primary' onClick={() => { setShowFilter(!showFilter) }}>{showFilter ? 'Ocultar filtros' : 'Mostrar filtros'}</Button>
      </div>
      <div className='w-full border-b-2 mb-3'></div>
      <p className='font-medium uppercase'>Filtro</p>
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
      {showFilter
        ? (<div>

          <div className='flex items-end gap-5 mt-5'>
            <div className='grid grid-cols-filter w-3/4'>
              <p className='font-medium uppercase'>Columna a filtrar</p>
              <input
                type="text"
                value={filterText}
                className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
                placeholder='Ingresa el valor a filtrar'
                onChange={e => { setFilterText(e.target.value) }}
              />
            </div>
            <div className='w-1/4'>
              <select value={filterColumn} onChange={handleChangeFilterColumn} className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none uppercase'>
                {
                  FILTER_COLUMNS.map(({ value, name }, index) => (
                    <option key={index} value={value}>{name}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className='w-full border-b-2 my-3'></div>
        </div>)
        : <div></div>}

      <div className='mb-6'></div>

      {
        isLoading
          ? '...loading'
          : filteredData.length > 0
            ? <EnhancedTable columns={COLUMN_HEADERS} data={filteredData} sortIcon={getSortIcon} setSortColumn={handleSortColumn}
              onRowClick={(id: string) => { navigate(`/detalle-recorrido?id=${id}`) }} />
            : <p className='text-center uppercase font-semibold text-red mt-10'>No hay recorridos en ese rango de fecha</p>
      }

    </div>
  )
}

export default RoutesView
