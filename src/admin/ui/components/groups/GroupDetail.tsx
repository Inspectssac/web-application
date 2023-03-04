import { GroupField } from '@/reports/models/group-field.interface'
import { Group } from '@/reports/models/group.interface'
import { GroupsService } from '@/reports/services/group.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import Table from '@/shared/ui/components/Table'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'
import AssignFieldForm from '../report-types/AssignFieldForm'
import UpdateFieldForm from '../report-types/UpdateFieldForm'

interface GroupDetailProps {
  group: Group
  close: () => void
}

const GroupDetail = ({ group, close }: GroupDetailProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const groupsService = new GroupsService()

  const [groupFields, setGroupFields] = useState<GroupField[]>([])
  const [selectedGroupField, setSelectedGroupField] = useState<GroupField | null>(null)

  const [showAssignField, setShowAssignField] = useState<boolean>(false)
  const [showUpdateField, setShowUpdateField] = useState<boolean>(false)

  useEffect(() => {
    if (group.id !== 0) {
      void groupsService.findAllFields(group.id)
        .then(setGroupFields)
    }
  }, [group])

  const onFinishSubmit = (newGroupField: GroupField): void => {
    updateGroupList(newGroupField, newGroupField.fieldId, false)
    setShowUpdateField(false)
    setShowAssignField(false)
  }

  const handleRemove = (groupField: GroupField): void => {
    const result = confirm(`Estás seguro que quieres desasignar el campo ${groupField.field.name}`)
    if (!result) return

    void groupsService.deleteField(group.id, groupField.fieldId)
      .then((response) => {
        updateGroupList(response, groupField.fieldId, true)
        toast('Campo desasignado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
      .finally(() => {
      })
  }

  const updateGroupList = (newGroupField: GroupField, fieldId: number, remove: boolean): void => {
    if (remove) {
      setGroupFields(groupFields.filter(groupField => groupField.fieldId !== fieldId))
      return
    }

    const index = groupFields.findIndex(groupField => groupField.fieldId === newGroupField.fieldId)
    if (index === -1) {
      setGroupFields([...groupFields, newGroupField])
      return
    }

    const fieldList = [...groupFields.slice(0, index), newGroupField, ...groupFields.slice(index + 1, groupFields.length)]
    setGroupFields(fieldList)
  }

  const handleUpdate = (groupField: GroupField): void => {
    setShowUpdateField(!showUpdateField)
    setShowAssignField(false)
    setSelectedGroupField(groupField)
  }

  const toggleAssignField = (): void => {
    setShowAssignField(!showAssignField)
    setShowUpdateField(false)
  }

  const closeUpdateModal = (): void => {
    setShowUpdateField(!showUpdateField)
    setSelectedGroupField(null)
  }

  const tableHeadStyle = 'text-sm font-medium text-white px-6 py-4 capitalize'
  const tableBodyStyle = 'text-sm text-gray-900 font-light px-6 py-4'

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[800px] p-3'>
        <div className='flex justify-between items-center mb-4 gap-4'>
          <h2 className='text-center text-2xl uppercase'>{group.name}</h2>

          <div className='flex gap-2'>
            <Button color='secondary' onClick={close}>Cerrar</Button>
            <Button color='primary' onClick={toggleAssignField}>Añadir Campo</Button>
          </div>
        </div>
        <div className='border-b-2 mb-3'></div>
        <div className='mb-4'>
          {showAssignField && <AssignFieldForm group={group} groupFields={groupFields} onFinishSubmit={onFinishSubmit} />}
          {showUpdateField && <UpdateFieldForm group={group} groupField={selectedGroupField} onFinishSubmit={onFinishSubmit} closeModal={closeUpdateModal} />}
        </div>

        {
          groupFields.length > 0
            ? (
              <Table>
                <thead className='border-b bg-black'>
                  <tr>
                    <th scope='col' className={`w-[10px] ${tableHeadStyle} `}>Campo</th>
                    <th scope='col' className={`${tableHeadStyle}`}>Activo</th>
                    <th scope='col' className={`${tableHeadStyle}`}>Max caractéres</th>
                    <th scope='col' className={`${tableHeadStyle}`}>Crítico</th>
                    <th scope='col' className={`${tableHeadStyle}`}>Imagen</th>
                    <th scope='col' className={`${tableHeadStyle}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    groupFields.map(groupField => (
                      <tr key={groupField.fieldId} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
                        <td className={`w-[10px] ${tableBodyStyle}`}>{groupField.field.name}</td>
                        <td className={tableBodyStyle}>{groupField.field.active ? 'activo' : 'no activo'}</td>
                        <td className={tableBodyStyle}>{groupField.maxLength}</td>
                        <td className={tableBodyStyle}>{groupField.isCritical ? 'Si' : 'No'}</td>
                        <td className={tableBodyStyle}>{groupField.needImage ? 'Si' : 'No'}</td>
                        <td className={`${tableBodyStyle} flex gap-3 justify-center items-center`}>
                          <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => handleUpdate(groupField)} />
                          <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => handleRemove(groupField)} />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              )
            : (
              <p>{group.id !== 0 ? 'No hay campos asignados al tipo de reporte' : 'Seleccionar tipo de reporte'}</p>
              )
        }
      </div>
    </Modal>
  )
}

export default GroupDetail
