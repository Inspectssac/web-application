import { User } from '@/iam/models/user.model'
import React, { ReactElement } from 'react'

interface UserProps {
  user: User
  setSelectedUser: (user: User) => void
}

const UserComponent = ({ user, setSelectedUser }: UserProps): ReactElement => {
  const userColStyle = 'text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'
  return (
    <tr className='bg-white border-b cursor-pointer' onClick={ () => setSelectedUser(user)}>
      <td className={`${userColStyle}`}>{user.username}</td>
      <td className={`${userColStyle}`}>{user.role}</td>
      <td className={`${userColStyle}`}>{user.active ? 'active' : 'no active'}</td>
      <td className={`${userColStyle}`}>{user.areas.map(({ name }) => name)[0]}</td>
    </tr>
  )
}

export default UserComponent
