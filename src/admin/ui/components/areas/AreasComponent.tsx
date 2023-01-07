import React, { ReactElement, useEffect, useState } from 'react'
import { AreasService } from '@/admin/services/areas.service'
import { Area } from '@/iam/models/user.model'
// import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import AreaForm from './AreaForm'

type FormAction = 'add' | 'update'

const AreasComponent = (): ReactElement => {
  const areasServices = new AreasService()
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    void areasServices.findAll()
      .then(setAreas)
  }, [])

  const update = (area: Area): void => {
    setSelectedArea(area)
    setFormAction('update')
  }

  // const remove = (area: Area): void => {
  //   const result = confirm(`Are you sure you want to remove vehicle type ${area.name}`)
  //   if (!result) return

  //   const id = area.id
  //   void areasServices.remove(id)
  //     .then(response => {
  //       updateFieldList(response, id, true)
  //     })
  // }

  const reset = (): void => {
    setSelectedArea(null)
    setFormAction('add')
  }

  const onFinishSubmit = (area: Area): void => {
    reset()
    updateAreaList(area, area.id)
  }

  const updateAreaList = (area: Area, id: number, remove: boolean = false): void => {
    const index = areas.findIndex(area => area.id === id)

    if (index === -1) {
      setAreas([...areas, area])
      return
    }

    if (remove) {
      setAreas(areas.filter(area => area.id !== id))
      return
    }

    const areaList = [...areas.slice(0, index), area, ...areas.slice(index + 1, areas.length)]
    setAreas(areaList)
  }

  return (
    <div>
      <section>
        {
          areas.map(area => (
            <div key={area.id}
              className={'w-full flex justify-between items-center py-2 border-b-2'}>
              <p className='px-2'>{area.name}</p>
              <div className='flex gap-3 px-2'>
                <EditIcon className='cursor-pointer w-5 h-5' onClick={() => update(area)} />
              </div>
            </div>
          ))
        }
        { areas.length <= 0 && (<p>Theres no Areas</p>)}
      </section>
      <section>
        <AreaForm area={selectedArea} formAction={formAction} onFinishSubmit={onFinishSubmit} reset={reset} />
      </section>
    </div>
  )
}

export default AreasComponent
