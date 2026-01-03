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
  mediaType: 'image' | 'video' | null
  mediaUrl: string | undefined
  feelingPost: string
  createdAt: Date
  updatedAt: string
  community: string
  likesCount: number
  likedByMe: boolean
  user: User
  comments: ComentarioPost[]
  likes: Like[]
  saves: Save[]
  saved: boolean
  tags: string[]
  _count: {
    likes: number
  }
}

interface User {
  id: string
  name: string
  name_at: string
  avatar: string | null
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
}

export type UserTypeSearch = {
  id: number
  name_at: string
  avatar?: string
  friendsCount: number
}
export interface ResetPassWordProps {
  setPermissionCode: (value: boolean) => void
  setIsLogin: (value: boolean) => void
  setForgotPassword: (value: boolean) => void
}

export interface ValidedCodeResponse {
  resetToken: string
}
