import React, { ReactElement, useEffect, useState } from 'react'
import Toast from '@/shared/ui/components/Toast'
import { Column } from 'react-table'
import { useSelector } from 'react-redux'
import { SortIconAsc, SortIconDesc } from '@/routes/assets/SortIcons'
import { RootState } from '@/shared/config/store'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { UsersService } from '@/admin/services/users.service'
import { User } from '@/iam/models/user.model'
import Button from '@/shared/ui/components/Button'
import EnhancedTable from '@/shared/ui/components/EnhancedTable'
import AddUserModal from '../components/users/AddUserModal'
import AreasComponent from '../components/areas/AreasComponent'
import ImportModal from '../components/ImportModal'
import UserDetailModal from '../components/users/UserDetailModal'

const TOAST_ID = 'users'

export const ToastContext = React.createContext({ id: '' })

const UsersView = (): ReactElement => {
  const usersService = new UsersService()
  const currentUser = useSelector<RootState, UserStorage>(getCurrentUser)

  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  const [sortColumn, setSortColumn] = useState<string>('username')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    void usersService.getAll()
      .then(response => {
        setUsers(response.filter(user => user.id !== currentUser.id))
      })
  }, [])

  const updateUser = (newUser: User): void => {
    setSelectedUser(newUser)
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

  const handleAddUser = (): void => {
    setShowAddModal(true)
  }

  const onClickUser = (id: string): void => {
    const user = users.find(user => user.id === id)
    setSelectedUser(user ?? null)
    setShowDetailModal(true)
  }

  const handleImportExcel = (): void => {
    setShowImportModal(true)
  }

  const refreshImportedUsers = (newUsers: User[]): void => {
    setUsers(users.concat(newUsers))
  }

  const COLUMN_HEADERS: Array<Column<User>> = [
    { Header: 'Usuario', accessor: 'username' },
    { Header: 'Rol', accessor: 'role' },
    { Header: 'Estado', id: 'status', accessor: (row: User) => row.active ? 'Activo' : 'No activo' },
    { Header: 'Area', id: 'area', accessor: (row: User) => row.areas ? row.areas[0] ? row.areas[0].name : 'area' : 'area' },
    { Header: 'Nombre', id: 'name', accessor: (row: User) => `${row.profile.name} ${row.profile.lastName}` }
  ]

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

  return (
    <ToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <div className='sm:flex sm:justify-between sm:items-center'>
          <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-gray-light after:block after:mt-1'>Usuarios</h1>
          <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
            <Button color='secondary' onClick={handleImportExcel}>Importar Excel</Button>
            <Button color='primary' onClick={handleAddUser}>Añadir usuario</Button>
          </div>
        </div>

        <main className='flex flex-col md:grid md:grid-cols-table md:gap-10'>
          <div className='order-2 md:order-1 '>
            <AreasComponent toastId={TOAST_ID} />
          </div>
          <div className='w-full order-1 md:order-2 mt-3 md:mt-0'>
            <EnhancedTable columns={COLUMN_HEADERS} data={users} sortIcon={getSortIcon} setSortColumn={handleSortColumn}
              onRowClick={onClickUser} />
          </div>
        </main>

        {showAddModal && <AddUserModal close={() => { setShowAddModal(false) }} updateUser={updateUser} />}
        {showDetailModal && <UserDetailModal user={selectedUser} close={() => { setShowDetailModal(false) }} updateUser={updateUser} />}

        {showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshList={refreshImportedUsers} toastId={TOAST_ID} type='user' />}
        <Toast id={TOAST_ID}></Toast>
      </div>
    </ToastContext.Provider>
  )
}

export default UsersView
