import React, { ReactElement, useState } from 'react'

import useMediaQuery from '../../hooks/userMediaQuery'
import NavBar from './NavBar'

const Header = (): ReactElement => {
  const [isMenuToggled, setIsMenuToggled] = useState(false)

  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

  const handleLinkClick = (): void => {
    setIsMenuToggled(!isMenuToggled)
  }

  const desktopNav = (): ReactElement => (
    <NavBar handleClick={handleLinkClick} divLinksClasses='flex gap-2 items-center' extraLinkClasses=''/>
  )

  const hamburgerMenu = (): ReactElement => (
    <button
      onClick={() => setIsMenuToggled(!isMenuToggled)}
    >
      <img
        className='w-full min-w-[35px]'
        src="/src/shared/ui/assets/images/menu-icon.svg" alt="menu-icon" />
    </button>
  )

  const mobileNav = (): ReactElement => (
    <div className={'absolute bg-black top-0 left-0 w-full text-center transition'}>
      <NavBar handleClick={handleLinkClick} extraLinkClasses='block hover:bg-blue' />
      <button
        onClick={() => setIsMenuToggled(!isMenuToggled)}
        className='mt-3'
      >
        <img
          className='w-full min-w-[35px]'
          src="/src/shared/ui/assets/images/close-icon.svg" alt="close-icon" />
      </button>
    </div>
  )
  return (
    <header className='bg-black shadow-md shadow-black/10 py-4 mb-4'>
      <nav className='flex items-center justify-between mx-auto w-5/6'>
        <h4 className='text-3xl font-bold text-white invisible'>I</h4>
        {
          isAboveSmallScreens
            ? desktopNav()
            : hamburgerMenu()
        }
        {!isAboveSmallScreens && isMenuToggled && mobileNav()}
      </nav>
    </header>
  )
}

export default Header
