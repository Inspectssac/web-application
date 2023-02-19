import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { isAuthenticated } from '@/shared/config/store/features/auth-slice'
import { useNavigate } from 'react-router-dom'

import useMediaQuery from '@/shared/hooks/userMediaQuery'
import LoginForm from '../components/LoginForm'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const authenticated = useSelector(isAuthenticated)

  const isAboveSmallScreen = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (authenticated) navigate('/inicio')
  }, [])

  return (
    <div className={`container-page h-screen flex ${isAboveSmallScreen ? 'flex-row justify-center' : 'flex-col justify-between'} items-center`}>
      <div className={`h-100 ${isAboveSmallScreen ? 'w-[50%]' : 'w-full'} pt-5`}>
        <img className='w-full max-w-md'
          src="/login-image.svg" alt="login-image"
        />
      </div>
      <div className={`h-full ${isAboveSmallScreen ? 'w-[50%]' : 'w-full'} flex flex-col justify-center`}>
        <h1 className="text-center mb-5 bold text-xl font-semibold uppercase">Login to InspectESSAC</h1>
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
