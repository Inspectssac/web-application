import React, { type ReactElement, useEffect, useState } from 'react'

interface InputProps {
  value: string | undefined
  type: string
  name: string
  placeholder: string
  disabled?: boolean
  reset?: boolean
  required?: boolean
  setValue: (value: string) => void
  setValid: (valid: boolean) => void
}

const Input = ({ name, placeholder, value, type, reset = false, disabled = false, required = true, setValue, setValid }: InputProps): ReactElement => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!required) {
      setValid(true)
    } else {
      setValid(error === '' && value?.trim() !== '')
    }
  }, [value])

  useEffect(() => {
    setError('')
  }, [reset])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (value.trim() === '') {
      setError(`El campo ${name} no puede estar vacío`)
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
      <p className='m-0 mt-1 text-red-dark'>{error}</p>
    </div>
  )
}

export default Input
