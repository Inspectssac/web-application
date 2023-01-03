import { UsersService } from '@/admin/services/users.service'
import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { User } from '@/iam/models/user.model'
import { RootState } from '@/shared/config/store'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AddUserModal from '../components/AddUserModal'
import ChangeRoleModal from '../components/ChangeRoleModal'
import UserComponent from '../components/UserComponent'

const Users = (): ReactElement => {
  const usersService = new UsersService()
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const currentUser = useSelector<RootState, UserStorage>(getCurrentUser)

  useEffect(() => {
    void usersService.getAll()
      .then(response => {
        setUsers(response.filter(user => user.id !== currentUser.id))
      })
  }, [])

  const handleSelectedUser = (user: User): void => {
    setSelectedUser(user)
  }
  const tableColClassNames = 'text-sm font-bold text-gray-900 px-6 py-4 text-left uppercase'

  const closeModal = (): void => {
    setShowModal(false)
  }

  const refreshUserList = (user: User): void => {
    setUsers([...users, user])
  }

  const refreshUser = (newUser: User): void => {
    users.forEach((user) => {
      if (user.id === newUser.id) {
        Object.assign(user, newUser)
      }
    })
  }

  const handleAddUser = (): void => {
    setShowModal(true)
    setModalContent(<AddUserModal closeModal={closeModal} refreshUserList={refreshUserList} />)
  }

  const handleChangeRole = (): void => {
    setShowModal(true)
    setModalContent(<ChangeRoleModal closeModal={closeModal} user={selectedUser} refreshUser={refreshUser} />)
  }

  return (
    <main className='md:flex md:gap-5 md:items-start'>
      {showModal &&
        <Modal>
          {modalContent}
        </Modal>
      }
      <div className='flex gap-2 justify-center md:order-2 md:flex-col md:w-[20%]'>
        <Button text='add user' color='bg-black' onClick={handleAddUser} />
        <Button text='change role' color='bg-black' onClick={handleChangeRole} />
      </div>

      <div className='flex flex-col md:order-1 md:w-[80%]'>
        <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='overflow-hidden'>
              <p>Selected user: {selectedUser ? selectedUser.username : 'No user selected'}</p>
              <table className='min-w-full border-collapse table-auto'>
                <thead className='border-b'>
                  <tr>
                    <th scope='col' className={`${tableColClassNames}`}>Username</th>
                    <th scope='col' className={`${tableColClassNames}`}>Role</th>
                    <th scope='col' className={`${tableColClassNames}`}>State</th>
                    <th scope='col' className={`${tableColClassNames}`}>Areas</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map(user => {
                      return (
                        <UserComponent key={user.id} user={user} setSelectedUser={handleSelectedUser} />
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}

export default Users
