import { User } from '@/iam/models/user.model'
import React, { ReactElement } from 'react'

interface UserProps {
  user: User
  selected: boolean
  setSelectedUser: (user: User) => void
}

const UserComponent = ({ user, selected, setSelectedUser }: UserProps): ReactElement => {
  const userColStyle = 'text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
  return (
    <tr className={`bg-white border-b cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 ${selected ? 'bg-gray-100' : ''}`} onClick={ () => setSelectedUser(user)}>
      <td className={`${userColStyle}`}>{user.username}</td>
      <td className={`${userColStyle}`}>{user.role}</td>
      <td className={`${userColStyle}`}>{user.active ? 'active' : 'no active'}</td>
      <td className={`${userColStyle}`}>{user.areas.map(({ name }) => name)[0]}</td>
    </tr>
  )
}

export default UserComponent
