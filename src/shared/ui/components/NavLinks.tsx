import { logout } from '@/shared/config/store/features/auth-slice'
import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

interface NavLinksProps {
  divLinksClasses?: string
  extraLinkClasses?: string
  handleClick: () => void
}

interface Link {
  name: string
  to: string
}

const links: Link[] = [
  { name: 'home', to: '/home' },
  // { name: 'routes', to: '/routes' },
  { name: 'admin', to: '/admin' }
]

const NavLinks = ({ divLinksClasses, extraLinkClasses, handleClick }: NavLinksProps): ReactElement => {
  const dispatch = useDispatch()
  const handleLogout = (): void => {
    dispatch(logout({}))
    location.reload()
  }
  return (
    <div className={`${divLinksClasses ?? ''}`} >
      {links.map(({ name, to }) => {
        return (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              ` uppercase  py-2 font-bold font-m
              ${extraLinkClasses ?? ''} ${isActive ? 'text-red' : 'text-white'}`
            }
            onClick={handleClick}
          >
            {name}
          </NavLink>
        )
      })}
      <a onClick={handleLogout} className={`cursor-pointer text-white uppercase  py-2 font-bold font-m ${extraLinkClasses ?? ''}`}>Logout</a>
    </div>

  )
}

export default NavLinks
