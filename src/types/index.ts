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

  user: {
    id: string
    name: string
    name_at: string
    avatar: string | null
  }

  likes: number
  comments: ComentarioPost[]
  salvo: boolean
  tags: string[]
}

////
export type ComentarioPost = {
  id: number
  autor: string
  content: string
  respondendoPara?: string | null
  respostas?: ComentarioPost[]
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
