import { UserRole } from '@/admin/models/role.enum'
import { UsersService } from '@/admin/services/users.service'
import { User } from '@/iam/models/user.model'
import Button from '@/shared/ui/components/Button'
import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface ChangeRoleModalProps {
  user: User | null
  closeModal: () => void
  refreshUser: (user: User) => void
  toastId: string
}

const ChangeRoleModal = ({ user, toastId, closeModal, refreshUser }: ChangeRoleModalProps): ReactElement => {
  const isUserNull = user === null
  const usersService = new UsersService()

  const [userRole, setUserRole] = useState<UserRole>(user?.role ?? UserRole.USER)

  useEffect(() => {
    console.log(user?.role)
  }, [])

  if (isUserNull) {
    return (
      <div className='min-w-[300px] md:min-w-[600px] p-6'>
        <p className='font-bold text-center uppercase mb-4'>Por favor, selecciona un usuario</p>
        <div className='grid place-items-center'>
          <Button color='secondary' onClick={closeModal}>Cerrar</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (user?.role === userRole) {
      closeModal()
      toast('User already has the role selected', { toastId, type: 'info' })
    }

    void usersService.changeRole({ role: userRole }, user.id)
      .then((response) => {
        refreshUser(response)
        toast("User's role changed correctly", { toastId, type: 'success' })
      })
      .catch(() => {
        toast('There was an error, try it later', { toastId, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    const roleEnum = value as UserRole
    setUserRole(roleEnum)
  }

  return (
    <div className='min-w-[300px] md:min-w-[600px] p-6'>
      <div className='mb-4'>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Usuario seleccionado:</span> {user.username}</p>
        <p className='text-center uppercase text-red'><span className='font-bold'>Rol:</span> {user.role}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select onChange={handleChange} name="role" value={userRole} className='block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none mb-4'>
          <option value={UserRole.USER}>{UserRole.USER.toUpperCase()}</option>
          <option value={UserRole.ADMIN}>{UserRole.ADMIN.toUpperCase()}</option>
          <option value={UserRole.SUPERVISOR}>{UserRole.SUPERVISOR.toUpperCase()}</option>
        </select>

        <div className='flex justify-center gap-5'>
          <Button color='secondary' onClick={closeModal}>Cerrar</Button>
          <Button color='primary' type='submit'>Cambiar</Button>
        </div>
      </form>
    </div >
  )
}

export default ChangeRoleModal
