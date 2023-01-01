import React, { ReactElement } from 'react'

interface LoginImageProps {
  isAboveSmallScreen: boolean
}

const LoginImage = ({ isAboveSmallScreen }: LoginImageProps): ReactElement => {
  return (
    <div className={`h-100 ${isAboveSmallScreen ? 'w-[50%]' : 'w-full'} pt-5`}>
      <img className='w-full max-w-md'
        src="./src/iam/assets/login-image.svg" alt="login-image"
      />
    </div>
  )
}

export default LoginImage
