import { useEffect, useState } from 'react'
import type {
  ConfigCommunityFormData,
  PostDialogSchema,
} from '../lib/validatorSchemas/autoSchemaAutenticator'
import type { PayloadTypeCreate } from '../pages/community/CreateCommunityPage'
import {
  type PostType,
  type userTypeSearch,
  type ValidedCodeResponse,
} from '../types'
import { MessagePerson } from '../utils/components/MessagePerson'
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

interface userSearchInterface {
  loadingRef: React.RefObject<boolean>
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  setResults: React.Dispatch<React.SetStateAction<userTypeSearch[]>>
  setIsLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}
export function useUserSearch({
  loadingRef,
  setHasMore,
  setResults,
  setIsLoadingSkeleton,
}: userSearchInterface) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    setPage(1)
    setResults([])
    setHasMore(true)
  }, [debouncedQuery])

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) return
    if (!debouncedQuery) return

    async function fetchUsers() {
      if (loadingRef.current) return
      loadingRef.current = true
      setIsLoadingSkeleton(true)

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/users/search/${page}?q=${debouncedQuery}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        if (data.users.length < 10) {
          setHasMore(false)
        }
        setResults((prev) =>
          page === 1 ? data.users : [...prev, ...data.users]
        )
      } catch (err) {
        console.error(err)
      } finally {
        loadingRef.current = false
        setIsLoadingSkeleton(false)
      }
    }
    fetchUsers()
  }, [debouncedQuery, page])

  return { setQuery, query, setPage }
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

  const data = await res.json()

  return { ...data, ok: res.ok }
}
export async function savedPost(postId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/savePost/${postId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
  const data = await res.json()
  return { ...data, ok: res.ok }
}
export async function getSavedPosts(currentPage: number, itemsPerPage: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getSavedPosts/${currentPage}/${itemsPerPage}`,
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
export async function getLikedPosts(currentPage: number, itemsPerPage: number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getLikedPosts/${currentPage}/${itemsPerPage}`,
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
export async function getMessagePosts(
  currentPage: number,
  itemsPerPage: number
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getMessagePosts/${currentPage}/${itemsPerPage}`,
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
////
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
  payload: ConfigCommunityFormData & { image?: string | null }
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
  formData.append('image', payload.image ?? '')
  // if (payload.image instanceof FileList && payload.image[0]) {
  //   formData.append('image', payload.image[0])
  // }

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

  if (!response.ok) {
    const data = await response.json()
    MessagePerson('Erro', data.error, 'error')
    throw new Error('Erro ao enviar solicitação de seguimento')
  }
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

    if (!response.ok) {
      const data = await response.json()
      MessagePerson('Erro', data.error, 'error')
      throw new Error('Erro ao aceitar')
    }
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

export const blockUser = async (userBId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/blockedUser`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userBId }),
    }
  )
  if (!response.ok) throw new Error('Erro ao bloquear')
  return response.json()
}

export const DesblockedUser = async (blockedUserId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/unblockUser/${blockedUserId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) throw new Error('Erro ao desbloquear')
  return response.json()
}

export const getUsersBlocked = async (pageNumber: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/getBlockedUsers?pageNumber=${pageNumber}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) throw new Error('Erro ao buscar usuários bloqueados')
  return response.json()
}

export const getPostsFeed = async (
  pageNumber: number,
  selectedFeeling?: PostType
) => {
  try {
    const newPosts = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/getGlobalFeed/${pageNumber}/${selectedFeeling}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!newPosts.ok) throw new Error('Erro ao buscar usuários bloqueados')
    return newPosts.json()
  } catch (error) {
    throw new Error('Erro ao buscar usuários bloqueados')
  }
}

export const getEmotionalPersons = async (
  pageNumber: number,
  filtertype: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/getEmotionalUsersAdmin/${pageNumber}/${filtertype}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) throw new Error('Erro ao buscar dados de usuários')
  return response.json()
}
export const getUserReportsAdmin = async (
  pageNumber: number,
  safeStatus: string,
  safeReason: string
) => {
  const filterStatus = encodeURIComponent(safeStatus)
  const filterReason = encodeURIComponent(safeReason)
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/getUserReportsAdmin/${pageNumber}/${filterStatus}/${filterReason}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) throw new Error('Erro ao buscar denuncias de usuarios')
  return response.json()
}

export const applySevenDayBan = async (
  reportId: string,
  userIdReported: number,
  reason: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/apply-ban-seven`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId, userIdReported, reason }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao banir usuário')
  }
  return data
}
export const applyBanPerm = async (
  reportId: string,
  userIdReported: number,
  reason: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/apply-ban-permanent`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId, userIdReported, reason }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao banir usuário')
  }
  return data
}

export const createReportUser = async (
  otherUserId: number,
  description: string,
  reason: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/createUserReport`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ otherUserId, reason, description }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao denunciar usuário')
  }
  return data
}

export const updateStatusReportsUsers = async (
  newStatus: string,
  reportId: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/updateStatusReportsUsers`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus, reportId }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao atualizar status de denuncia')
  }
  return data
}

export const getPostsReports = async (
  pageNumber: number,
  safeStatus: string,
  safeReason: string
) => {
  const url = `${import.meta.env.VITE_API_URL}/auth/admin/getPostsReports/${pageNumber}?status=${encodeURIComponent(safeStatus)}&reason=${encodeURIComponent(safeReason)}`

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error('Erro ao buscar denuncias de posts')
  return response.json()
}

export const banReportsPosts = async (
  reportId: string | undefined,
  PostIdReported: number,
  reason: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/banReportsPosts`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId, reason, PostIdReported }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao banir post')
  }
  return data
}
export const updateStatusReportsPosts = async (
  newStatus: string,
  reportId: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/updateStatusReportsPosts`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus, reportId }),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    MessagePerson('Ops!', data.error, 'error')
    throw new Error('Erro ao atualizar status de denuncia')
  }
  return data
}

export const createReportPost = async ({
  postId,
  reason,
  description,
  imagens,
}: {
  postId: number
  reason: string
  description: string
  imagens: File[]
}) => {
  const imageUrls: string[] = []

  for (const img of imagens) {
    const formData = new FormData()
    formData.append('file', img)
    formData.append('upload_preset', 'posts_tess')
    formData.append('folder', 'perfil')

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/di5dwqjq7/image/upload`,
      { method: 'POST', body: formData }
    )

    const imgData = await cloudinaryRes.json()
    if (imgData.secure_url) {
      imageUrls.push(imgData.secure_url)
    }
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/admin/createPostReport`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        reason,
        description,
        imageUrls,
      }),
    }
  )
  const data = await response.json()

  if (!response.ok) {
    MessagePerson('Ops!', data.error || 'Erro ao processar denúncia', 'error')
    throw new Error(data.error || 'Erro ao denunciar post')
  }

  return data
}
