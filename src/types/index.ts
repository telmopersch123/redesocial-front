export type PostType =
  | 'feliz'
  | 'triste'
  | 'esperancoso'
  | 'agradecido'
  | 'ansioso'
  | 'todos'

export type BibliotecaApoioItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  cor: string
  titulo: string
  categoria: string
  tempo: string
  desc: string // preview curto
  conteudo?: string // texto longo em Markdown
}

export type BibliotecaApoioItems = {
  item: BibliotecaApoioItem
}

// tipos para os posts

export type Persons = {
  id: number
  nome: string
  avatar: string
}

export type dailyBackType = {
  content: string
  emotionalDiary: number
  lvlanxiety: number
  lvlenergy: number
  messageUser: string
}
export type dateUserGrapchis = {
  id: number
  emotionalDiary: number
  lvlanxiety: number
  lvlenergy: number
  createdAt: string
}

export interface Post {
  id: number
  description: string
  mediaType?: 'image' | 'video' | null
  mediaUrl?: string
  feelingPost?: string
  createdAt: Date
  updatedAt?: string
  communityId: number
  communityName: string
  likesCount: number
  likedByMe: boolean
  user: User
  comments?: ComentarioPost[]
  postTags?: {
    postId: number
    tag: { id: number; name: string }
    tagId: number
  }[]
  likes: Like[]
  saves: Save[]
  saved: boolean
  _count?: { likes: number; comments?: number }
  anonymous?: boolean
}

export interface Like {
  userId: number
}

interface Save {
  id: number
  userId: number
  postId: number
}

////

interface MencaoSimples {
  id: number | string
  name_at: string
}

// O formato que vem do Prisma (Banco)
interface MencaoBanco {
  id: number
  commentId: number
  userId: number
  user: {
    id: number
    name_at: string
  }
}

export type ListaMencoes = (MencaoSimples | MencaoBanco)[]

export type ComentarioPost = {
  id: number
  user: {
    id: string
    name: string
    name_at: string
    avatar: string | null
  }
  content: string
  parentId?: number | null
  respondendoPara?: string | null
  replies?: ComentarioPost[]
  mentions?: { id: number; name_at: string }[]
}

export type UserType = {
  id: string
  name: string
  name_at: string
  avatar: string
  email: string
  image?: string | null
  sexo: string | null
  createdAt: string | Date
  termsAcceptedAt: string | Date
  showOnlineStatus: boolean
  showViewStatus: boolean
  anonMode: boolean
  mentionPermissed: boolean
  lastNameUpdate: string
  informationUser: InformationUser[]
  notificationsEnabled: boolean
  confirmTwoSteps: {
    two_factor_enabled: boolean
  }
  communities: Record<number, string>
}

export type TypeFriend = {
  id: number
  name_at: string
  avatar: string
}

export interface InformationUser {
  id: number
  bio: string | null
  feeling: string | null
  selfCareMethods: string[]
  userId: number
  emoji: string
}

export interface User {
  id: string
  name: string
  name_at: string
  email: string
  avatar: string | null
  sexo: string | null
  isFriend: boolean
  createdAt: string | Date
  termsAcceptedAt: string | Date
  communities: Record<number, string>
  informationUser: InformationUser[]
}

export interface AuthMeResponse {
  HasTheUserBeenBanned: boolean
  friendship: {
    IsSender: boolean
    status: string
  }
  user: User
}

export interface ResetPassWordProps {
  setPermissionCode: (value: boolean) => void
  setIsLogin: (value: boolean) => void
  setForgotPassword: (value: boolean) => void
}

export interface ValidedCodeResponse {
  resetToken: string
}
export interface userTypeSearch {
  avatar: string
  friends: number
  id: number
  name: string
  name_at: string
}
export interface CommunityInterface {
  image: string
  id: number
  category: string
  description: string
  isPrivate: boolean
  nameComunity: string
  rules: string
  _count: {
    members: number
    posts: number
  }
  members: { userId: string }[]
}
