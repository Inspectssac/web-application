import useMediaQuery from '@/shared/hooks/userMediaQuery'
import Button from '@/shared/ui/components/Button'
import React, { ReactElement, useState } from 'react'
import Reports from '../components/Reports'
import Users from './UsersView'

const AdminView = (): ReactElement => {
  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

  const [selectedSection, setSelectedSection] = useState('users')

  return (
    <div className='container'>
      <div className={`flex ${isAboveSmallScreens ? 'justify-start' : 'justify-center'} gap-3 mb-3`}>
        <Button text='users' onClick={() => { setSelectedSection('users') }} color='bg-red'/>
        <Button text='reports' onClick={() => { setSelectedSection('reports') }} color='bg-red'/>
      </div>

      { selectedSection === 'users'
        ? <Users />
        : <Reports />
      }
    </div>
  )
}

export default AdminView
