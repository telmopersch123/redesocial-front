import { useEffect, useState } from 'react'
import type { PostDialogSchema } from '../lib/validatorSchemas/autoSchemaAutenticator'
import type { UserTypeSearch, ValidedCodeResponse } from '../types'

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
export async function sendVerificationEmail(email: string): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_URL}/auth/send-verification-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}
export async function verifyEmailCode(email: string, code: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/verify-email-code`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, code }),
    }
  )

  return res.ok
}
export async function sendCodigoToEmail(email: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      return false
    }

    return true
  } catch (err) {
    console.log(err)
  }
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
        credentials: 'include',
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
export async function resetPasswordCod(email: string, newPassword: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword }),
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
///////////
export async function createPosts(post: PostDialogSchema): Promise<boolean> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/createPosts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    throw new Error('Erro ao salvar o post')
  }
  return res.ok
}
export async function getPostsByPerfilUser(id: string | undefined) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getPostsMyPerfil/${id}`,
    {
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts do perfil')
  }
  const data = await res.json()

  return data.normalizedPosts
}
export async function getPostsByUser(id: string | undefined) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getPostsByUser/${id}`,
    {
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts do usuário')
  }
  const data = await res.json()
  return data.normalizedPosts
}
export async function createComment(
  postId: number,
  content: string,
  parentId?: number,
  respondendoPara?: string
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/createComment`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ postId, content, parentId, respondendoPara }),
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao criar o comentário')
  }
  return res
}
export async function deleteComment(commentId: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/deleteComment/${commentId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao deletar o comentário')
  }
  return res
}
export async function updateLikedPost(postId: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/posts/${postId}/like`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao atualizar o post')
  }
  return res.json() as Promise<{
    liked: boolean
    likesCount: number
  }>
}
export async function savedPost(postId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/savePost/${postId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao salvar o post')
  }
  return res.json() as Promise<{
    saved: boolean
  }>
}
export async function getSavedPosts() {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getSavedPosts`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts salvos')
  }
  const data = await res.json()

  return data
}
export async function getLikedPosts() {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getLikedPosts`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts salvos')
  }
  const data = await res.json()

  return data
}
export async function getMessagePosts() {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getMessagePosts`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts salvos')
  }
  const data = await res.json()

  return data
}
////////////////
export async function getContatos() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/getContatos`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Erro ao buscar os contatos')
  }
  const data = await res.json()

  return data
}
