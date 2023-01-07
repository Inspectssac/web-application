import { AreaDto } from '@/admin/models/area-dto.interface'
import { AreasService } from '@/admin/services/areas.service'
import { Area } from '@/iam/models/user.model'
import React, { ReactElement, useEffect, useState } from 'react'

type FormAction = 'add' | 'update'

interface AreaFormProps {
  area: Area | null
  formAction: FormAction
  onFinishSubmit: (area: Area) => void
  reset: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (area: Area | null): AreaDto => {
  if (area === null) return INITIAL_STATE
  const { id, createdAt, updatedAt, ...areaDto } = area
  return areaDto
}

const AreaForm = ({ area, formAction, onFinishSubmit, reset }: AreaFormProps): ReactElement => {
  const areasService = new AreasService()
  const [inputValue, setInputValue] = useState<AreaDto>(getInitialState(area))

  useEffect(() => {
    setInputValue(getInitialState(area))
  }, [area])

  const resetForm = (): void => {
    reset()
    setInputValue(getInitialState(null))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (formAction === 'update') {
      const id = area ? area.id : 0
      void areasService.update(id, inputValue)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
        })
      return
    }

    void areasService.create(inputValue)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>Create new Area</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name='name' value={inputValue.name} placeholder='name' onChange={handleChange} />
        </div>
        <button className='bg-blue px-4 py-1 text-white rounded-lg capitalize'>{formAction}</button>
        <button className='bg-red px-4 py-1 text-white rounded-lg capitalize' type='button' onClick={() => resetForm()}>Cancel</button>
      </form>
    </div>
  )
}

export default AreaForm
