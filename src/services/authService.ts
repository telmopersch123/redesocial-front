import { useEffect, useState } from 'react'
import type { UserTypeSearch } from '../types'

export async function logoutUser(): Promise<boolean> {
  try {
    const res = await fetch(`/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.ok
  } catch (err) {
    console.error('Erro ao deslogar:', err)
    return false
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // envia o cookie HTTP-only
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error('Credenciais inválidas')

    const data = await res.json()
    return data.user // já retorna só o usuário
  } catch (err) {
    console.error(err)
    return null
  }
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function useUserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserTypeSearch[]>([])
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery) return

    async function fetchUsers() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/users/search?q=${debouncedQuery}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        setResults(data.users)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [debouncedQuery])

  return { setQuery, query, results }
}
