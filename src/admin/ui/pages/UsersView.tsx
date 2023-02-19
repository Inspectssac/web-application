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
import Toast from '@/shared/ui/components/Toast'
import { toast } from 'react-toastify'
import { Column } from 'react-table'
import EnhancedTable from '@/shared/ui/components/EnhancedTable'
import { SortIconAsc, SortIconDesc } from '@/routes/assets/SortIcons'
import ImportModal from '../components/ImportModal'

const TOAST_ID = 'users'

const UsersView = (): ReactElement => {
  const usersService = new UsersService()
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const currentUser = useSelector<RootState, UserStorage>(getCurrentUser)

  const [canRemove, setCanRemove] = useState<boolean>(false)

  useEffect(() => {
    void usersService.getAll()
      .then(response => {
        // TODO: Delete assertion with username postman
        setUsers(response.filter(user => user.id !== currentUser.id && user.username !== 'postman'))
      })
  }, [])

  useEffect(() => {
    setCanRemove(selectedUser !== null)
  }, [selectedUser])

  const closeModal = (): void => {
    setShowModal(false)
  }

  const refreshUser = (newUser: User): void => {
    setSelectedUser(newUser)
    refreshUserList(newUser, newUser.id)
  }

  const refreshImportedUsers = (newUsers: User[]): void => {
    setUsers(users.concat(newUsers))
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
      alert('Primero selecciona un usuario')
      return
    }

    const result = confirm(`Estás seguro que quieres eliminar el usuario '${selectedUser.username}'`)

    if (!result) { return }

    const id = selectedUser.id
    void usersService.remove(id)
      .then(response => {
        setSelectedUser(null)
        refreshUserList(response, id, true)
        toast('Usuario eliminado correctamente', { toastId: TOAST_ID, type: 'success' })
      })
      .catch(() => {
        toast('Hubo un error, intente nuevamente luego', { toastId: TOAST_ID, type: 'error' })
      })
  }

  const handleAddUser = (): void => {
    setShowModal(true)
    setModalContent(<AddUserModal closeModal={closeModal} refreshUserList={refreshUser} toastId={TOAST_ID} />)
  }

  const handleChangeRole = (): void => {
    setShowModal(true)
    setModalContent(<ChangeRoleModal closeModal={closeModal} user={selectedUser} refreshUser={refreshUser} toastId={TOAST_ID} />)
  }

  const COLUMN_HEADERS: Array<Column<User>> = [
    { Header: 'Usuario', accessor: 'username' },
    { Header: 'Rol', accessor: 'role' },
    { Header: 'Estado', id: 'status', accessor: (row: User) => row.active ? 'Activo' : 'No activo' },
    { Header: 'Area', id: 'area', accessor: (row: User) => row.areas ? row.areas[0] ? row.areas[0].name : 'area' : 'area' }
  ]

  const [sortColumn, setSortColumn] = useState<string>('username')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const getSortIcon = (column: string): React.ReactElement => {
    if (sortColumn !== column) return (<span></span>)
    const className = 'text-white w-6 h-6'
    return sortDirection === 'asc' ? <SortIconAsc className={className} /> : <SortIconDesc className={className} />
  }

  const handleSortColumn = (column: string): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
    console.log(column)
    setSortColumn(column)
  }

  const onClickUser = (id: string): void => {
    if (selectedUser?.id === id) {
      setSelectedUser(null)
      return
    }

    const user = users.find(user => user.id === id)
    setSelectedUser(user ?? null)
  }

  const handleImportExcel = (): void => {
    setShowImportModal(true)
  }

  return (
    <div className='container-page'>
      <div className='sm:flex sm:justify-between sm:items-center'>
        <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-gray-light after:block after:mt-1'>Usuarios</h1>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button color='primary' onClick={handleImportExcel}>ImportExcel</Button>
          <Button color='secondary' onClick={handleRemove} disabled={!canRemove}>Eliminar</Button>
          <Button color='success' onClick={handleChangeRole}>Cambiar rol</Button>
          <Button color='primary' onClick={handleAddUser}>Añadir usuario</Button>
        </div>
      </div>

      <main className='flex flex-col md:grid md:grid-cols-table md:gap-10'>
        {showModal &&
          <Modal>
            {modalContent}
          </Modal>
        }

        <div className='order-2 md:order-1 '>
          <AreasComponent toastId={TOAST_ID} />
        </div>

        <div className='w-full order-1 md:order-2 mt-3 md:mt-0'>
          <p className='text-xl mb-2'>Usuario seleccionado: <span className='font-bold'>{selectedUser ? selectedUser.username : 'Ningún usuario fue seleccionado'}</span></p>
          <EnhancedTable columns={COLUMN_HEADERS} data={users} sortIcon={getSortIcon} setSortColumn={handleSortColumn}
            onRowClick={onClickUser} />
        </div>

      </main>
      { showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshUserList={refreshImportedUsers} toastId={TOAST_ID} />}
      <Toast id={TOAST_ID}></Toast>

    </div>

  )
}

export default UsersView
