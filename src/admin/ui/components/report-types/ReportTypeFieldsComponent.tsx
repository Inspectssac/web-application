import React, { ReactElement, useEffect, useState } from 'react'
import { ReportTypeField } from '@/reports/models/report-type-fields.interface'
import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import AssignFieldForm from './AssignFieldForm'
import UpdateFieldForm from './UpdateFieldForm'
import Table from '@/shared/ui/components/Table'
import Button from '@/shared/ui/components/Button'

interface ReportTypeFieldsComponentProps {
  toastId: string
  reportType: ReportType
}

const ReportTypeFieldsComponent = ({ reportType, toastId }: ReportTypeFieldsComponentProps): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [showFieldModal, setShowFieldModal] = useState<boolean>(false)
  const [reportTypeFields, setReportTypeFields] = useState<ReportTypeField[]>([])

  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [reportTypeFieldForm, setReportTypeFieldForm] = useState<ReportTypeField | null>(null)

  useEffect(() => {
    if (reportType.id !== 0) {
      void reportTypesService.getAllFields(reportType.id)
        .then(setReportTypeFields)
    }
  }, [reportType])

  const handleUpdate = (reportTypeField: ReportTypeField): void => {
    setShowUpdateModal(!showUpdateModal)
    setReportTypeFieldForm(reportTypeField)
  }

  const onFinishSubmit = (newReportTypeField: ReportTypeField): void => {
    updateFieldList(newReportTypeField, newReportTypeField.fieldId)
  }

  const updateFieldList = (newReportTypeField: ReportTypeField, fieldId: number, remove: boolean = false): void => {
    const index = reportTypeFields.findIndex(reportTypeField => reportTypeField.fieldId === fieldId)

    if (index === -1) {
      setReportTypeFields([...reportTypeFields, newReportTypeField])
      return
    }

    const fieldList = [...reportTypeFields.slice(0, index), newReportTypeField, ...reportTypeFields.slice(index + 1, reportTypeFields.length)]
    setReportTypeFields(fieldList)
  }

  const tableHeadStyle = 'text-sm font-medium text-white px-6 py-4 capitalize'
  const tableBodyStyle = 'text-sm text-gray-900 font-light px-6 py-4'
  return (
    <section>
      {reportType.id !== 0 &&
        (
          <div className='flex justify-end'>
            <Button color='primary' onClick={() => setShowFieldModal(!showFieldModal)} className='mb-2'>Asignar campo</Button>
          </div>
        )
      }
      {
        reportTypeFields.length > 0
          ? (
            <Table>
              <thead className='border-b bg-black'>
                <tr>
                  <th scope='col' className={`w-[10px] ${tableHeadStyle} `}>Campo</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Activo</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Max caractéres</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Requerido</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Imagen</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Info Principal</th>
                  <th scope='col' className={`${tableHeadStyle}`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  reportTypeFields.map(reportTypeField => (
                    <tr key={reportTypeField.fieldId} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
                      <td className={`w-[10px] ${tableBodyStyle}`}>{reportTypeField.field.name}</td>
                      <td className={tableBodyStyle}>{reportTypeField.field.active ? 'activo' : 'no activo'}</td>
                      <td className={tableBodyStyle}>{reportTypeField.length}</td>
                      <td className={tableBodyStyle}>{reportTypeField.required ? 'Si' : 'No'}</td>
                      <td className={tableBodyStyle}>{reportTypeField.imageValidation ? 'Si' : 'No'}</td>
                      <td className={tableBodyStyle}>{reportTypeField.mainInfo ? 'Si' : 'No'}</td>
                      <td className={`${tableBodyStyle} flex gap-3 justify-center items-center`}>
                        <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => handleUpdate(reportTypeField)} />
                        {/* <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => console.log('delete')} /> */}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            )
          : (
            <p>{reportType.id !== 0 ? 'No hay campos asignados al tipo de reporte' : 'Seleccionar tipo de reporte'}</p>
            )
      }
      {showFieldModal && <AssignFieldForm toastId={toastId} reportType={reportType} reportTypeFields={reportTypeFields} closeModal={() => setShowFieldModal(!showFieldModal)} onFinishSubmit={onFinishSubmit} />}
      {showUpdateModal && <UpdateFieldForm toastId={toastId} reportType={reportType} reportTypeField={reportTypeFieldForm} closeModal={() => setShowUpdateModal(!showUpdateModal)} onFinishSubmit={onFinishSubmit} />}
    </section>
  )
}

export default ReportTypeFieldsComponent
