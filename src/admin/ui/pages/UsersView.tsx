import { UsersService } from '@/admin/services/users.service'
import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { User } from '@/iam/models/user.model'
import { RootState } from '@/shared/config/store'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AddUserModal from '../components/users/AddUserModal'
import AreasComponent from '../components/areas/AreasComponent'
import ChangeRoleModal from '../components/users/ChangeRoleModal'
import UserComponent from '../components/users/UserComponent'

const UsersView = (): ReactElement => {
  const usersService = new UsersService()
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const currentUser = useSelector<RootState, UserStorage>(getCurrentUser)

  const [canRemove, setCanRemove] = useState<boolean>(false)

  useEffect(() => {
    void usersService.getAll()
      .then(response => {
        setUsers(response.filter(user => user.id !== currentUser.id))
      })
  }, [])

  useEffect(() => {
    setCanRemove(selectedUser !== null)
  }, [selectedUser])

  const handleSelectedUser = (user: User): void => {
    setSelectedUser(user)
  }
  const tableColClassNames = 'text-sm font-bold text-gray-900 px-6 py-4 text-left uppercase'

  const closeModal = (): void => {
    setShowModal(false)
  }

  const refreshUser = (newUser: User): void => {
    refreshUserList(newUser, newUser.id)
  }

  const refreshUserList = (user: User, id: string, remove: boolean = false): void => {
    const index = users.findIndex(user => user.id === id)

    if (index === -1) {
      setUsers([...users, user])
      return
    }
    if (remove) {
      setUsers(users.filter(user => user.id !== id))
      return
    }

    const usersList = [...users.slice(0, index), user, ...users.slice(index + 1, users.length)]
    setUsers(usersList)
  }

  const handleRemove = (): void => {
    if (selectedUser === null) {
      alert('First select a user')
      return
    }

    const result = confirm(`Are you sure you want to delete user ${selectedUser.username}`)

    if (!result) { return }

    const id = selectedUser.id
    void usersService.remove(id)
      .then(response => {
        setSelectedUser(null)
        refreshUserList(response, id, true)
      })
  }

  const handleAddUser = (): void => {
    setShowModal(true)
    setModalContent(<AddUserModal closeModal={closeModal} refreshUserList={refreshUser} />)
  }

  const handleChangeRole = (): void => {
    setShowModal(true)
    setModalContent(<ChangeRoleModal closeModal={closeModal} user={selectedUser} refreshUser={refreshUser} />)
  }

  return (
    <div className='container'>
      <div className='sm:flex sm:justify-between sm:items-center'>
        <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-light-grey after:block after:mt-1 '>Users</h1>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button text='add user' color='bg-blue' onClick={handleAddUser} />
          <Button text='change role' color='bg-success ' onClick={handleChangeRole} />
          <Button text='remove' color={` ${!canRemove ? 'bg-dark-red' : 'bg-red'}`} onClick={handleRemove} disabled={!canRemove} />
        </div>
      </div>

      <main className='flex flex-col md:grid md:grid-cols-table md:gap-10'>
        {showModal &&
          <Modal>
            {modalContent}
          </Modal>
        }

        <div className='order-2 md:order-1 mt-5'>
          <h2 className='text-xl font-bold uppercase '>Areas</h2>
          <AreasComponent />
        </div>

        <div className='w-full order-1 md:order-2'>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
              <p className='text-xl'>Selected user: <span className='font-bold'>{selectedUser ? selectedUser.username : 'No user selected'}</span></p>
              <div className='overflow-hidden'>

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
    </div>

  )
}

export default UsersView
