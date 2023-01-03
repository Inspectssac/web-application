import { AddUser } from '@/admin/models/add-user.interface'
import { UserRole } from '@/admin/models/role.enum'
import { AreasService } from '@/admin/services/areas.service'
import { UsersService } from '@/admin/services/users.service'
import { Area, User } from '@/iam/models/user.model'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

interface AddUserModalProps {
  closeModal: () => void
  refreshUserList: (user: User) => void
}

const AddUserModal = ({ closeModal, refreshUserList }: AddUserModalProps): ReactElement => {
  const areasService = new AreasService()
  const usersService = new UsersService()

  const [newUser, setNewUser] = useState<AddUser>({
    username: '',
    password: '',
    role: UserRole.USER
  })

  const [areas, setAreas] = useState<Area[]>([])

  const [errorMessage, setErrorMessage] = useState<string>('')

  const areaRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    void areasService.getAll()
      .then(setAreas)
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    // if (value.trim() === '') {
    //   setErrors({
    //     ...errors,
    //     [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} cant no empty`
    //   })
    // } else {
    //   setErrors({
    //     ...errors,
    //     [name]: ''
    //   })
    // }

    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const areaId = areaRef.current?.value ?? areas[0].id.toString()
    void usersService.create(newUser)
      .then(response => {
        void areasService.assignUser(parseInt(areaId), response.id)
          .then(refreshUserList)
      })
      .catch(error => {
        console.log(error)
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
      .finally(() => closeModal())
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  return (
    <div className='min-w-[300px] md:min-w-[600px] p-6'>
      <h1 className='uppercase text-center font-bold mb-4'>Add user modal</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div>
          <input
            className={`${inputClass}`}
            onChange={handleChange}
            type="text" value={newUser.username}
            name='username'
            placeholder='Username' />
          {/* <p className='text-red font-bold'>{errors.username}</p> */}
        </div>
        <div>
          <input
            className={`${inputClass}`}
            onChange={handleChange}
            type="password" value={newUser.password}
            name='password'
            placeholder='Password' />
          {/* <p className='text-red font-bold'>{errors.username}</p> */}
        </div>

        <select name="role" className={`${inputClass}`}>
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
        <p>{errorMessage}</p>
        <div className='flex justify-center gap-5'>
          <button className='bg-black text-white px-4 py-2 uppercase rounded-lg' type='button' onClick={closeModal}>Close</button>
          <button className='bg-red text-white px-4 py-2 uppercase rounded-lg' type='submit'>Add user</button>
        </div>
      </form>
    </div>
  )
}

export default AddUserModal
