import { UserRole } from '@/admin/models/role.enum'
import { UsersService } from '@/admin/services/users.service'
import { User } from '@/iam/models/user.model'
import React, { ReactElement, useRef, useState } from 'react'

interface ChangeRoleModalProps {
  user: User | null
  closeModal: () => void
  refreshUser: (user: User) => void
}

const ChangeRoleModal = ({ closeModal, user, refreshUser }: ChangeRoleModalProps): ReactElement => {
  const isUserNull = user === null
  const usersService = new UsersService()
  const roleRef = useRef<HTMLSelectElement>(null)
  const [errorMessage, setErrorMessage] = useState('')

  if (isUserNull) {
    return (
      <div className='min-w-[300px] md:min-w-[600px] p-6'>
        <p className='font-bold text-center uppercase mb-4'>Please select a user</p>
        <div className='grid place-items-center'>
          <button className='bg-black text-white px-4 py-2 uppercase rounded-lg' onClick={closeModal}>Close</button>
        </div>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const role = roleRef.current?.value ?? user.role

    if (user?.role === role) {
      closeModal()
    }
    const roleEnum = role as UserRole
    void usersService.changeRole({ role: roleEnum }, user.id)
      .then(refreshUser)
      .catch(error => {
        console.log(error)
        setErrorMessage('There was an error. Try it again later')
      })
      .finally(closeModal)
  }

  return (
    <div className='min-w-[300px] md:min-w-[600px] p-6'>
      <div className='mb-4'>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Current user:</span> {user.username}</p>
        <p className='text-center uppercase text-red'><span className='font-bold'>Role:</span> {user.role}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select name="role" ref={roleRef} defaultValue={user.role} className='block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none mb-4'>
          <option value={UserRole.USER}>{UserRole.USER.toUpperCase()}</option>
          <option value={UserRole.ADMIN}>{UserRole.ADMIN.toUpperCase()}</option>
          <option value={UserRole.SUPERVISOR}>{UserRole.SUPERVISOR.toUpperCase()}</option>
        </select>
        <p>{errorMessage}</p>
        <div className='flex justify-center gap-5'>
          <button className='bg-black text-white px-4 py-2 uppercase rounded-lg' type='button' onClick={closeModal}>Close</button>
          <button className='bg-red text-white px-4 py-2 uppercase rounded-lg' type='submit'>Change</button>
        </div>
      </form>
    </div >
  )
}

export default ChangeRoleModal
