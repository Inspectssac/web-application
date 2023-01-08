import React, { ReactElement, useEffect, useState } from 'react'

interface InputProps {
  value: string | undefined
  type: string
  name: string
  placeholder: string
  disabled?: boolean
  reset?: boolean
  setValue: (value: string) => void
  setValid: (valid: boolean) => void
}

const Input = ({ name, placeholder, value, type, reset = false, disabled = false, setValue, setValid }: InputProps): ReactElement => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setValid(error === '' && value?.trim() !== '')
  }, [value])

  useEffect(() => {
    setError('')
  }, [reset])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (value.trim() === '') {
      setError(`${name} is empty`)
    } else {
      setError('')
    }

    setValue(value)
  }

  return (
    <div>
      <input
        className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
        disabled={disabled} type={type} name={name} placeholder={placeholder} value={value} onChange={handleChange} />
      <p className='m-0 mt-1 lowercase text-red-dark'>{error}</p>
    </div>
  )
}

export default Input
