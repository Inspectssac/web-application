
import React, { Fragment, ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import ProfileIcon from '../../assets/icons/EyeIcon'
import UserIcon from '../../assets/icons/UserIcon'
import DropDown from './DropDown'

interface DesktopUserOptionsProps {
  handleLogout: () => void
}

export const DesktopUserOptions = ({ handleLogout }: DesktopUserOptionsProps): ReactElement => {
  const userIcon = <UserIcon className='w-8 h-8 text-blue'/>
  const items = [
    { to: 'profile', name: 'Profile', icon: <ProfileIcon className='w-5 h-5 mr-2' /> }
  ]
  return (
    <DropDown menu={userIcon} items={items} logout={true} handleLogout={handleLogout}/>
  )
}

interface MobileUserOptionsProps {
  handleLogout: () => void
  handleClick: () => void
}

export const MobileUserOptions = ({ handleClick, handleLogout }: MobileUserOptionsProps): React.ReactElement => {
  return (
    <>
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `block py-3 font-m text-white px-6 hover:bg-blue ${isActive ? 'bg-blue' : ''}`
        }
        onClick={handleClick}
      >
        Profile
      </NavLink>
      <a onClick={handleLogout} className='block cursor-pointer py-1 font-m text-white px-6 hover:bg-blue'>Logout</a>
    </>
  )
}
