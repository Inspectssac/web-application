import React, { ReactElement } from 'react'

interface FormProps {
  children?: React.ReactNode
}

const Form = ({ children }: FormProps): ReactElement => {
  return (
    <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
    <div className='inline-block min-w-full sm:px-6 lg:px-8'>
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
