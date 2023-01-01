import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { isAuthenticated } from '@/shared/store/features/auth-slice'
import { useNavigate } from 'react-router-dom'

import LoginBody from '../components/LoginBody'
import LoginImage from '../components/LoginImage'
import useMediaQuery from '@/shared/hooks/userMediaQuery'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const authenticated = useSelector(isAuthenticated)

  const isAboveSmallScreen = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (authenticated) navigate('/routes')
  }, [])

  return (
    <div className={`container h-screen flex ${isAboveSmallScreen ? 'flex-row justify-center' : 'flex-col justify-between'} items-center`}>
      <LoginImage isAboveSmallScreen={isAboveSmallScreen}/>
      <LoginBody isAboveSmallScreen={isAboveSmallScreen} />
    </div>
  )
}

export default Login
