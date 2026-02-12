import { useEffect, useState } from 'react'
import type {
  ConfigCommunityFormData,
  PostDialogSchema,
} from '../lib/validatorSchemas/autoSchemaAutenticator'
import type { PayloadTypeCreate } from '../pages/community/CreateCommunityPage'
import { type userTypeSearch, type ValidedCodeResponse } from '../types'
import { socket } from './socket'

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
  const [results, setResults] = useState<userTypeSearch[]>([])
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
    if (!res.ok) throw new Error('Erro ao deslogar')

    socket.emit('auth:logout')
    socket.disconnect()
    return res.ok
  } catch (err) {
    console.error('Erro ao deslogar:', err)
    return false
  }
}

export async function verify2FALogin(
  userId: number,
  code: string,
  rememberMe: boolean
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/me/verify-login-2fa`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code, rememberMe }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Código inválido')
  return data.user
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
    return data
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
export async function getPostsByPerfilUser(
  id: string | undefined,
  pageNumber: number
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getPostsMyPerfil/${id}/${pageNumber}`,
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
export async function getPostsByUser(
  id: string | undefined,
  pageNumber: number
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getPostsByUser/${id}/${pageNumber}`,
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
  parentId?: number | null,
  respondendoPara?: string,
  mentionedUserIds: number[] = []
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/createComment`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        postId,
        content,
        parentId,
        respondendoPara,
        mentionedUserIds,
      }),
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
//// ???????????????? olha no profileContext, chama a msm rota?
export async function getUser(id: string | undefined) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/${id}`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Erro ao buscar o usuário')
  }
  const data = await res.json()

  return data
}
export async function getCheckUserChat(id: string | undefined) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/checkUserChat/${id}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar o usuário')
  }
  const data = await res.json()

  return data
}
export async function getMyCommunities() {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/getMyCommunities`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar as comunidades')
  }
  const data = await res.json()

  return data
}
export async function getCommunityPosts(
  targetId: number,
  targetName?: string,
  page: number = 1
) {
  const params = new URLSearchParams()
  if (targetId) {
    params.append('communityId', targetId.toString())
  }
  if (targetName && targetName !== 'all') {
    params.append('communityName', targetName)
  }
  params.append('page', page.toString())

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/getCommunityPosts?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts')
  }
  const data = await res.json()

  return data
}
export async function getConfigCommunities(communityId: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/getDetails/${communityId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar a comunidade')
  }
  const data = await res.json()

  return data
}
export async function updateCommunityDetails(
  communityId: number,
  payload: ConfigCommunityFormData
) {
  const formData = new FormData()
  formData.append('nameComunity', payload.nameComunity)
  formData.append('description', payload.description)
  formData.append('category', payload.category)
  formData.append('whoCanPost', payload.whoCanPost ?? '')
  formData.append('whoCanComment', payload.whoCanComment ?? '')
  formData.append('rules', payload.rules ?? '')
  formData.append('limit', String(payload.limit))
  formData.append('isPrivate', String(payload.isPrivate))
  if (payload.image && payload.image[0]) {
    formData.append('image', payload.image[0])
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/update/${communityId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  )
  const body = await res.json()
  if (!res.ok) {
    throw new Error(body.message || 'Erro ao editar comunidade')
  }

  return body
}

export const createCommunity = async (payload: PayloadTypeCreate) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/CreateCommunities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
  )

  const body = await res.json()
  if (!res.ok) {
    throw new Error(body.message || 'Erro ao criar comunidade')
  }

  return body
}

export const joinCommunity = async (communityId: number) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/join/${communityId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || 'Erro ao entrar na comunidade')
  }
  return await res.json()
}
export const getUsersCommunitys = async (
  communityId: number,
  page: number,
  query: string,
  PAGE_SIZE: number,
  filterRole?: string
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/getUsersCommunity?page=${page}&limit=${PAGE_SIZE}&search=${query}&filterRole=${filterRole}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!res.ok) throw new Error('Erro ao buscar as comunidades')
  return await res.json()
}
export const promoteUser = async (
  communityId: number,
  targetUserId: number
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/promoteUser`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUserId }),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao promover usuário')
  }

  return await res.json()
}
export const demoteUser = async (communityId: number, targetUserId: number) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/demoteUser`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUserId }),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao rebaixar usuário')
  }

  return await res.json()
}
export const removeUserCommunity = async (
  communityId: number,
  targetUserId: number
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/removeUserCommunity`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUserId }),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao remover usuário')
  }

  return await res.json()
}
export const removeUsersSelectedCommuntity = async (
  communityId: number,
  userIds: number[]
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/removeUsersSelectedCommuntity`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds }),
    }
  )
  console.log(res)
  if (!res.ok) throw new Error('Erro ao remover os usuários da comunidade')
  return await res.json()
}
export const generateCommunityInvite = async (communityId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityId}/generateInvite`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
  if (!response.ok) throw new Error('Erro ao gerar convite')
  return await response.json()
}
export const validateCommunityInvite = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/invite/validate/${token}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!response.ok) throw new Error('Convite inválido ou expirado')
  return await response.json()
}
export const getCommunityDetailsByName = async (communityName: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${communityName}/getCommunityByName`,
    {
      credentials: 'include',
    }
  )
  if (!response.ok) throw new Error('Não encontrada')
  return response.json()
}
export const ArchivedPostsCommunity = async (
  postId: string | number,
  mediaType: string,
  mediaUrl: string,
  reason: string,
  communityId: number
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/${postId}/${communityId}/archivedPost`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, mediaType, mediaUrl }),
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao arquivar post')
  }
  return await res.json()
}
export const getArchivedPostsCommunity = async (
  communityId: number,
  page: number = 1
) => {
  const params = new URLSearchParams({
    page: page.toString(),
  })
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/getArchivedPosts/${communityId}?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) {
    throw new Error('Erro ao buscar os posts arquivados')
  }
  const data = await res.json()
  return data
}
export const UnarchivePostCommunity = async (
  postId: string | number,
  communityId: number
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/unarchivePost/${postId}/${communityId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao desarquivar post')
  }
  return await res.json()
}
export const DeletePostCommunity = async (
  postId: string | number,
  communityId: number
) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/comunity/deletePostCommunity/${postId}/${communityId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error ?? 'Erro ao deletar o post')
  }
  return await res.json()
}
export const searchUsersMentions = async (query: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/searchMentions/${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  if (!response.ok) throw new Error('Erro ao buscar usuários')
  return response.json()
}
export const requestFriendship = async (userBId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/requestFriendship`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userBId }),
    }
  )
  if (!response.ok) throw new Error('Erro ao enviar solicitação de seguimento')
  return response.json()
}
export const AcceptFriendship = async (notificationId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/friendship/accept`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      }
    )
    if (!response.ok) throw new Error('Erro ao aceitar')

    return response.json()
  } catch (error) {
    throw new Error('Erro ao aceitar')
  }
}
export const DeclineFriendship = async (notificationId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/friendship/decline`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      }
    )
    if (!response.ok) throw new Error('Erro ao aceitar')

    return response.json()
  } catch (error) {
    throw new Error('Erro ao aceitar')
  }
}

export const unFriendShip = async (userBId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/friendship/unfriend`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userBId }),
    }
  )
  if (!response.ok) throw new Error('Erro ao aceitar')
  return response.json()
}

export const getFriends = async (targetUserId: number, pageNumber: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/friendship/getAllFriendship/${targetUserId}/${pageNumber}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) throw new Error('Erro ao aceitar')
  return response.json()
}
