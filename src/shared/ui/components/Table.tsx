import React, { ReactElement } from 'react'

interface FormProps {
  children?: React.ReactNode
}

const Form = ({ children }: FormProps): ReactElement => {
  return (
    <div className='overflow-x-auto'>
    <div className='inline-block min-w-full'>
      <div className='overflow-hidden'>
        <table className='min-w-full text-center '>
          { children}
        </table>
      </div>
    </div>
  </div>
  )
}

export default Form
