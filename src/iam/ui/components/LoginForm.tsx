import React, { ReactElement, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '@/shared/config/store'
import { LoginData } from '@/iam/models/interfaces/login.interface'
import { login } from '@/shared/config/store/features/auth-slice'
import { AUTH_STATUS } from '@/shared/config/store/types'

interface FormState {
  loginData: LoginData
  errors: {
    password: string
    username: string
  }
}

const LoginForm = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const loginStatus = useSelector<RootState>(({ auth }: RootState) => auth.status, shallowEqual)

  useEffect(() => {
    setHasFailed(loginStatus === AUTH_STATUS.FAILED)
    setIsLoading(loginStatus === AUTH_STATUS.PENDING)
  }, [loginStatus])

  const [loginData, setLoginData] = useState<FormState['loginData']>({
    password: '',
    username: ''
  })

  const [errors, setErrors] = useState<FormState['errors']>({
    password: '',
    username: ''
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void dispatch(login(loginData)).unwrap()
      .then(response => {
        navigate('/home')
      })
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (value.trim() === '') {
      setErrors({
        ...errors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} cant no empty`
      })
    } else {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    setLoginData({
      ...loginData,
      [name]: value
    })
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-grey-900 outline-none'

  return isLoading
    ? (
    <p>Loading</p>
      )
    : (

    <form onSubmit={handleSubmit}>
      <div className='mb-4'>
        <input
          className={`${inputClass}`}
          onChange={handleChange}
          type="text" value={loginData.username}
          name='username'
          placeholder='username' />
        <p className='text-red font-bold'>{errors.username}</p>
      </div>

      <div className='mb-4'>
        <input
          className={`${inputClass}`}
          onChange={handleChange}
          type="password"
          value={loginData.password}
          name='password'
          placeholder='password' />
        <p className='text-red font-bold'>{errors.password}</p>
      </div>

      <p className='text-center text-red font-bold mb-4'>{ hasFailed ? errorMessage : ''}</p>
      <button
        type='submit'
        className="bg-red px-4 py-2 text-white rounded-lg w-full"
      >Login</button>
    </form>
      )
}

export default LoginForm
