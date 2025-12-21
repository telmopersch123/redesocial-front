import { useEffect, useState } from 'react'
import type { UserTypeSearch } from '../types'

export async function logoutUser(): Promise<boolean> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.ok
  } catch (err) {
    console.error('Erro ao deslogar:', err)
    return false
  }
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean | undefined
) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // envia o cookie HTTP-only
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        rememberMe: rememberMe ?? false,
      }),
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

export async function sendCodigoToEmail(email: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      throw new Error('Erro ao enviar o email')
    }
  } catch (err) {
    console.log(err)
  }
}
interface ValidedCodeResponse {
  resetToken: string
}
export async function valided_code(
  email: string,
  code: string
): Promise<ValidedCodeResponse | null | undefined> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/validate-code`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      }
    )

    if (!res.ok) {
      return null
    }
    const data = await res.json()
    return { resetToken: data.resetToken }
  } catch (err) {
    console.log(err)
  }
}

export async function resetPasswordCod(
  resetToken: string | undefined,
  email: string,
  newPassword: string
) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, email, newPassword }),
      }
    )

    if (!res.ok) {
      throw new Error('Erro ao validar o codigo')
    }

    return true
  } catch (err) {
    console.log(err)
  }
}
