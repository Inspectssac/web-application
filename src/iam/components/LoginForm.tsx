import React, { ReactElement, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '@/shared/store/store'
import { LoginData } from '@/iam/models/interfaces/login.interface'
import { AUTH_STATUS, AUTH_STORE, getLoginError, login, loginHasFail } from '@/shared/store/features/auth-slice'

interface LoginFormProps {
  isAboveSmallScreen: boolean
}

interface FormState {
  loginData: LoginData
  errors: {
    password: string
    username: string
  }
}

const LoginForm = ({ isAboveSmallScreen }: LoginFormProps): ReactElement => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [hasFail, setHasFail] = useState(false)
  const loginState = useSelector((state: AUTH_STORE) => state.status, shallowEqual)

  // const error = useSelector(getLoginError)

  useEffect(() => {
    console.log('state', loginState)
    setHasFail(loginState === AUTH_STATUS.FAILED)
  }, [loginState])

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
    console.log(loginData)
    void dispatch(login(loginData))
      .then(response => {
        console.log(response)
      }).finally(() => {
        console.log(hasFail)
      })

    // if (hasFail) {
    //   console.log(error)
    // }
    // navigate('/routes')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (value.trim() === '') {
      setErrors({
        ...errors,
        [name]: `${name} cant no empty`
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

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  return (
    <form onSubmit={handleSubmit}>

      <div className='mb-4'>
        <input
          className={`${inputClass}`}
          onChange={handleChange}
          type="text" value={loginData.username}
          name='username'
          placeholder='username' />
        <p className='text-red-900 font-bold'>{errors.username}</p>
      </div>

      <div className='mb-4'>
        <input
          className={`${inputClass}`}
          onChange={handleChange}
          type="password"
          value={loginData.password}
          name='password'
          placeholder='password' />
        <p className='text-red-900 font-bold'>{errors.password}</p>
      </div>

      <button
        type='submit'
        className="bg-purple-900 px-4 py-2 text-white rounded-lg w-full"
      >Login</button>
    </form>
  )
}

export default LoginForm
