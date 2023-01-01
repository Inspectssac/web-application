import React, { ReactElement } from 'react'
import LoginForm from './LoginForm'

interface LoginBodyProps {
  isAboveSmallScreen: boolean
}

const LoginBody = ({ isAboveSmallScreen }: LoginBodyProps): ReactElement => {
  return (
    <div className={`h-full ${isAboveSmallScreen ? 'w-[50%]' : 'w-full'} flex flex-col justify-center`}>
      <h1 className="text-center mb-5 bold text-xl font-semibold uppercase">Login to Inspectorssac</h1>
      <LoginForm isAboveSmallScreen={isAboveSmallScreen} />
    </div>
  )
}

export default LoginBody
