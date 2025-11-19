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
interface Comentario {
  id: number
  autor: string
  texto: string
}

export type Persons = {
  id: number
  nome: string
  avatar: string
}

export interface Post {
  id: number
  typePosts: 'Feliz' | 'Esperançoso' | 'Ansioso' | 'Agradecido' | 'Triste'
  community?: string
  autor: string
  avatar: string | null
  friend: boolean
  conteudo: string
  imagem?: string
  video?: boolean
  data: Date
  likes: number
  comentarios: Comentario[]
  salvo: boolean
  tags: string[]
}
