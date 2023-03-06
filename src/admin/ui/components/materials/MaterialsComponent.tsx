import { Material } from '@/routes/models/material.interface'
import { MaterialsService } from '@/routes/services/materials.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import Button from '@/shared/ui/components/Button'
import Table from '@/shared/ui/components/Table'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MaterialToastContext } from '../../pages/MaterialsView'
import MaterialForm from './MaterialForm'

type FormAction = 'add' | 'update'

const MaterialsComponent = (): ReactElement => {
  const materialToastContext = useContext(MaterialToastContext)
  const materialsService = new MaterialsService()
  const [materials, setMaterials] = useState<Material[]>([])

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [showFormModal, setShowFormModal] = useState<boolean>(false)

  useEffect(() => {
    void materialsService.findAll()
      .then(setMaterials)
  }, [])

  const onFinishSubmit = (material: Material): void => {
    updateMaterialList(material, material.id)
  }

  const updateMaterialList = (material: Material, id: number, remove: boolean = false): void => {
    const index = materials.findIndex(material => material.id === id)

    if (index === -1) {
      setMaterials([...materials, material])
      return
    }

    if (remove) {
      setMaterials(materials.filter(material => material.id !== id))
      return
    }

    const materialList = [...materials.slice(0, index), material, ...materials.slice(index + 1, materials.length)]
    setMaterials(materialList)
  }

  const update = (material: Material): void => {
    setSelectedMaterial(material)
    setFormAction('update')
    setShowFormModal(true)
  }

  const add = (): void => {
    setSelectedMaterial(null)
    setFormAction('add')
    setShowFormModal(true)
  }

  const remove = (material: Material): void => {
    const result = confirm(`Estas seguro que quieres eliminar el tipo de material ${material.name}`)
    if (!result) return

    const id = material.id
    void materialsService.remove(id)
      .then(response => {
        updateMaterialList(response, id, true)
        toast('Tipo de material eliminado correctamente', { toastId: materialToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: materialToastContext.id, type: 'error' })
      })
  }

  const tableHeadStyle = 'text-sm font-medium text-white px-6 py-4 capitalize'
  const tableBodyStyle = 'text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'

  return (
    <div className=''>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button color='primary' onClick={add}>Añadir Tipo de Material</Button>
        </div>
      </div>
      {
        materials.length > 0
          ? (
            <Table>
              <thead className='border-b bg-black'>
                <tr>
                  <th scope='col' className={tableHeadStyle}>Nombre</th>
                  <th scope='col' className={tableHeadStyle}>Fecha de creación</th>
                  <th scope='col' className={tableHeadStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  materials.map(material => (
                    <tr key={material.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
                      <td className={tableBodyStyle}>{material.name}</td>
                      <td className={tableBodyStyle}>{material.createdAt}</td>
                      <td className={` ${tableBodyStyle} flex justify-center gap-3`}>
                        <EditIcon className='cursor-pointer w-5 h-5' onClick={() => update(material) } />
                        <DeleteIcon className='cursor-pointer w-5 h-5 text-red' onClick={() => remove(material)} />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            )
          : (<p>No hay tipo de materiales registrados</p>)

      }
      { showFormModal && <MaterialForm close={() => { setShowFormModal(false) }} formAction={formAction} material={selectedMaterial} onFinishSubmit={onFinishSubmit}/>}
    </div>
  )
}

export default MaterialsComponent
