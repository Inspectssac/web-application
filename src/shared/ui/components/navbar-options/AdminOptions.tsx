import React, { ReactElement } from 'react'
import FieldIcon from '../../assets/icons/FieldIcon'
import ReportIcon from '../../assets/icons/ReportIcon'
import UserIcon from '../../assets/icons/UserIcon'
import VehicleIcon from '../../assets/icons/VehicleIcon'
import DropDown from './DropDown'

export const DesktopAdminOptions = (): ReactElement => {
  const adminMenu = (
    <a className='text-white pr-4'>
      Admin
    </a>
  )
  const items = [
    { to: 'admin/users', name: 'Users', icon: <UserIcon className='w-5 h-5 mr-2'/> },
    { to: 'admin/reports', name: 'Reports', icon: <ReportIcon className='w-5 h-5 mr-2'/> },
    { to: 'admin/fields', name: 'Fields', icon: <FieldIcon className='w-5 h-5 mr-2'/> },
    { to: 'admin/vehicles', name: 'Vehicles', icon: <VehicleIcon className='w-5 h-5 mr-2'/> }
  ]
  return (
    <DropDown menu={adminMenu} items={items} logout={false}/>
  )
}
