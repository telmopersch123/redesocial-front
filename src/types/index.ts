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

export interface Post {
  id: number
  description: string
  mediaType?: 'image' | 'video' | null
  mediaUrl?: string
  feelingPost?: string
  createdAt: Date
  updatedAt?: string
  community: { id: number; nameComunity: string }
  likesCount: number
  likedByMe: boolean
  user: User
  comments?: ComentarioPost[]
  postTags?: { tag: { id: number; name: string } }[]
  likes: Like[]
  saves: Save[]
  saved: boolean
  tags: string[]
  _count?: { likes: number }
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
}

export type UserType = {
  id: string
  name: string
  name_at: string
  email: string
  image?: string | null
  communities: Record<number, string>
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
  id: number
  name: string
  name_at: string
  email: string
  avatar: string | null
  sexo: string | null
  createdAt: string | Date
  termsAcceptedAt: string | Date
  communities: Record<number, string>
  informationUser: InformationUser[]
}

export interface AuthMeResponse {
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
