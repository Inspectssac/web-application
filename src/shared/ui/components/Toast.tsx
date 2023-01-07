import React, { ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'

export interface ToastOption {
  text: string
  type: 'success' | 'error' | 'info'
}

interface ToastProps {
  id: string
}

const Toast = ({ id }: ToastProps): ReactElement => {
  return (
    <ToastContainer containerId={id} pauseOnHover={false} theme={'colored'} autoClose={2000} position={'bottom-right'}/>
  )
}

export default Toast
