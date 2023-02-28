import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { isAuthenticated } from '@/shared/config/store/features/auth-slice'
import { useNavigate } from 'react-router-dom'

// import useMediaQuery from '@/shared/hooks/userMediaQuery'
import LoginForm from '../components/LoginForm'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const authenticated = useSelector(isAuthenticated)

  // const isAboveSmallScreen = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (authenticated) navigate('/inicio')
  }, [])

  return (
    <div className='container-page h-screen flex justify-center items-center flex-col gap-8'>
      <div className='text-center pb-16'>
        <p className='uppercase text-5xl italic font-bold'>Plataforma de monitoreo de unidades</p>
      </div>
      <section className='w-full max-w-[450px]'>
        <img src="/logo.png" alt="ESSAC LOGO" />
      </section>
      <LoginForm />
      <section className='text-center'>
        <img className='w-full max-w-[300px] filter contrast-50' src="/brand.png" alt="ESSAC 40 años" />
        <div className='text-sm mt-3 text-gray-400'>
          <p>ESSAC-Inspect 1.0.0</p>
          <p className='font-bold'>&copy;ESSAC 2023</p>
        </div>
      </section>
    </div>
  )
}

export default Login
