import React, { ReactElement, useEffect } from 'react'
import { LoginData } from '../models/interfaces/login.interface'
import { useDispatch, useSelector } from 'react-redux'
import { isAuthenticated, login } from '@/shared/store/features/auth-slice'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '@/shared/store/store'

const Login = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const authenticated = useSelector(isAuthenticated)

  useEffect(() => {
    if (authenticated) navigate('/routes')
  }, [])

  const handleLogin = (): void => {
    const loginData: LoginData = {
      username: 'renato',
      password: 'password'
    }

    void dispatch(login(loginData))
      .then(response => {
        navigate('/routes')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className='mx-2'>
      <h1>Login</h1>
      <button className="bg-purple-900 px-4 py-2 text-white rounded-lg"
        onClick={handleLogin}
      >Login</button>
    </div>
  )
}

export default Login
