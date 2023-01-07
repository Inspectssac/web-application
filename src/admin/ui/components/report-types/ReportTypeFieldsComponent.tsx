import React, { ReactElement, useEffect, useState } from 'react'
import { ReportTypeField } from '@/reports/models/report-type-fields.interface'
import { ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import AssignFieldForm from './AssignFieldForm'
import UpdateFieldForm from './UpdateFieldForm'

interface ReportTypeFieldsComponentProps {
  reportType: ReportType
}

const ReportTypeFieldsComponent = ({ reportType }: ReportTypeFieldsComponentProps): ReactElement => {
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

  return (
    <section>
      {
        reportTypeFields.length > 0
          ? (
            <table className='w-full'>
              <thead>
                <tr>
                  <th>ReportType</th>
                  <th>Active</th>
                  <th>Max length</th>
                  <th>Required</th>
                  <th>Image</th>
                  <th>Main info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  reportTypeFields.map(reportTypeField => (
                    <tr key={reportTypeField.fieldId}>
                      <td>{reportTypeField.field.name}</td>
                      <td>{reportTypeField.field.active ? 'active' : 'no active'}</td>
                      <td>{reportTypeField.length}</td>
                      <td>{reportTypeField.required ? 'Yes' : 'No'}</td>
                      <td>{reportTypeField.imageValidation ? 'Yes' : 'No'}</td>
                      <td>{reportTypeField.mainInfo ? 'Yes' : 'No'}</td>
                      <td className='flex gap-3 justify-center'>
                        <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => handleUpdate(reportTypeField)} />
                        {/* <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => console.log('delete')} /> */}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            )
          : (
            <p>{reportType.id !== 0 ? 'There is no field assigned to the report type' : 'Select a report type'}</p>
            )
      }
      {reportType.id !== 0 && <button className='bg-blue px-4 py-1 rounded-lg text-white mt-4' onClick={() => setShowFieldModal(!showFieldModal)}>Assign Field</button>}
      {showFieldModal && <AssignFieldForm reportType={reportType} reportTypeFields={reportTypeFields} closeModal={() => setShowFieldModal(!showFieldModal)} onFinishSubmit={onFinishSubmit} />}
      {showUpdateModal && <UpdateFieldForm reportType={reportType} reportTypeField={reportTypeFieldForm} closeModal={() => setShowUpdateModal(!showUpdateModal)} onFinishSubmit={onFinishSubmit} />}
    </section>
  )
}

export default ReportTypeFieldsComponent
