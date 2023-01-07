import React, { ReactElement, useEffect, useState } from 'react'
import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import ReportTypeForm from '../components/report-types/ReportTypeForm'
import ReportTypeFieldsComponent from '../components/report-types/ReportTypeFieldsComponent'

const INITIAL_STATE = {
  createdAt: '',
  updatedAt: '',
  id: 0,
  name: ''
}

type FormAction = 'add' | 'update'

const ReportsView = (): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(INITIAL_STATE)

  const [reportTypeForm, setReportTypeForm] = useState<ReportType>(INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    void reportTypesService.findAll()
      .then(setReportTypes)
  }, [])

  useEffect(() => {
    if (reportTypes.length > 0) setSelectedReportType(reportTypes[0])
  }, [reportTypes])

  const handleUpdate = (reportType: ReportType): void => {
    setReportTypeForm(reportType)
    setFormAction('update')
  }

  const reset = (): void => {
    setReportTypeForm(INITIAL_STATE)
    setFormAction('add')
  }

  const onFinishSubmit = (newReportType: ReportType): void => {
    reset()
    updateReportTypeList(newReportType, newReportType.id)
  }

  const updateReportTypeList = (newReportType: ReportType, id: number, remove: boolean = false): void => {
    const index = reportTypes.findIndex(reportType => reportType.id === id)

    if (index === -1) {
      setReportTypes([...reportTypes, newReportType])
      return
    }
    if (remove) {
      setReportTypes(reportTypes.filter(reportType => reportType.id !== id))
      return
    }

    const reportTypeList = [...reportTypes.slice(0, index), newReportType, ...reportTypes.slice(index + 1, reportTypes.length)]
    setReportTypes(reportTypeList)
  }

  return (
    <div className='container'>
      <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-light-grey after:block after:mt-1'>Report Types</h1>
      <div className='grid grid-cols-table gap-12'>
        <main className=''>
          <ReportTypeForm reportType={reportTypeForm} reset={reset} formAction={formAction} onFinishSubmit={onFinishSubmit} />
          <div>
            <h2 className='uppercase font-bold mt-2 text-center'>Report Types</h2>
            {
              reportTypes.length > 0
                ? (

                    reportTypes.map(reportType =>
                      (
                        <div key={reportType.id}
                          onClick={() => setSelectedReportType(reportType)}
                          className={`w-full flex justify-between items-center py-2 rounded-r-xl cursor-pointer
                                      ${selectedReportType.id === reportType.id ? 'bg-blue text-white' : ''}`}>
                          <p className='px-2'>{reportType.name}</p>
                          <div className='flex gap-3 px-2'>
                            <EditIcon className='cursor-pointer w-5 h-5' onClick={() => handleUpdate(reportType)} />
                            <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => console.log('click')} />
                          </div>
                        </div>
                      ))

                  )
                : (<p>Theres no report types</p>)
            }
          </div>
        </main>

        <ReportTypeFieldsComponent reportType={selectedReportType} />
      </div>

    </div>

  )
}

export default ReportsView
