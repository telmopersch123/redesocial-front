import { useState } from 'react'

export function useLimitForms(maxLength: number) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.target.value.length > maxLength) {
      setError(`Você atingiu o limite de ${maxLength} caracteres.`)
      return
    }
    setValue(event.target.value)
    setError('')
  }

  return {
    value,
    error,
    handleChange,
    maxLength,
  }
}
