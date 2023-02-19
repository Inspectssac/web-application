import { AddUser } from '@/admin/models/add-user.interface'
import { UserRole } from '@/admin/models/role.enum'
import { AreasService } from '@/admin/services/areas.service'
import { UsersService } from '@/admin/services/users.service'
import { Area, User } from '@/iam/models/user.model'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface AddUserModalProps {
  closeModal: () => void
  refreshUserList: (user: User) => void
  toastId: string
}

interface UserFormErrors {
  username: string
  password: string
}

const ERROR_INITIAL_STATE: UserFormErrors = {
  username: '',
  password: ''
}

const AddUserModal = ({ closeModal, refreshUserList, toastId }: AddUserModalProps): ReactElement => {
  const areasService = new AreasService()
  const usersService = new UsersService()

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  const [newUser, setNewUser] = useState<AddUser>({
    username: '',
    password: '',
    role: UserRole.USER
  })

  const [areas, setAreas] = useState<Area[]>([])
  const [errors, setErrors] = useState<UserFormErrors>(ERROR_INITIAL_STATE)

  const areaRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    void areasService.findAll()
      .then(setAreas)
  }, [])

  useEffect(() => {
    setCanSubmit(
      (errors.username === '' && newUser.username !== '') &&
      (errors.password === '' && newUser.password !== '')
    )
  }, [errors, newUser])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, tagName } = event.target

    if (tagName === 'INPUT') {
      if (value.trim() === '') {
        setErrors({
          ...errors,
          [name]: `${name} está vacío`
        })
      } else {
        setErrors({
          ...errors,
          [name]: ''
        })
      }
    }

    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const areaId = areaRef.current?.value ?? areas[0].id.toString()
    void usersService.create(newUser)
      .then((response) => {
        void areasService.assignUser(parseInt(areaId), response.id)
          .then(refreshUserList)
          .catch(error => {
            const { message } = error.data
            toast(message, { toastId, type: 'error' })
          })
        toast('User created correctly', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  const setValueInputValue = (name: string, value: string): void => {
    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  return (
    <div className='min-w-[300px] sm:min-w-[600px] p-6'>
      <h1 className='uppercase text-center font-bold mb-4'>Añadir Usuario</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <Input
          value={newUser.username}
          name='username' placeholder='Username' type='text'
          setValid={setIsValidInput}
          setValue={(value) => setValueInputValue('username', value)}></Input>
        <Input
          value={newUser.password}
          name='password' placeholder='Contraseña' type='password'
          setValid={setIsValidInput}
          setValue={(value) => setValueInputValue('password', value)}></Input>

        <select name="role" className={`${inputClass}`} onChange={handleChange}>
          <option value={`${UserRole.USER}`}>{UserRole.USER.toUpperCase()}</option>
          <option value={`${UserRole.ADMIN}`}>{UserRole.ADMIN.toUpperCase()}</option>
          <option value={`${UserRole.SUPERVISOR}`}>{UserRole.SUPERVISOR.toUpperCase()}</option>
        </select>

        <select name="area" ref={areaRef} className={`${inputClass}`}>
          {
            areas.map(area => {
              return (
                <option key={area.id} value={area.id}>{area.name.toUpperCase()}</option>
              )
            })
          }
        </select>
        <div className='flex justify-center gap-5'>
          <Button color='secondary' onClick={closeModal}>Cerrar</Button>
          <Button color='primary' type='submit' disabled={!canSubmit}>Añadir Usuario</Button>
        </div>
      </form>
    </div>
  )
}

export default AddUserModal
