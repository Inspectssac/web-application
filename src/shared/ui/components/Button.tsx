import React, { ReactElement } from 'react'

interface ButtonProps {
  text: string
  color: string
  onClick: () => void
}

const Button = ({ text, color, onClick }: ButtonProps): ReactElement => {
  return (
    <button
      className={`${color} text-white uppercase px-4 py-2 rounded-lg`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
