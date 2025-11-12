'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Bookmark,
  Clock,
  Heart,
  MessageCircleHeart,
  MessageCircleX,
  Play,
  Send,
  Share2,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useComunidades } from '../context/ComunidadesContext'

interface Comentario {
  id: number
  autor: string
  texto: string
}

interface Post {
  id: number
  comunidade: string
  autor: string
  avatar: string | null
  conteudo: string
  imagem?: string
  video?: boolean
  data: Date
  likes: number
  comentarios: Comentario[]
  salvo: boolean
}

const postsFicticios: Post[] = [
  {
    id: 1,
    comunidade: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
  },
  {
    id: 2,
    comunidade: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
  },
  {
    id: 3,
    comunidade: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
  },
  {
    id: 4,
    comunidade: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
  },
  {
    id: 5,
    comunidade: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
  },
]

export default function ComunidadesPage() {
  const { filtro } = useComunidades()
  const [posts, setPosts] = useState<Post[]>(postsFicticios)

  const [comentarioAberto, setComentarioAberto] = useState<number | null>(null)
  const [novoComentario, setNovoComentario] = useState('')

  const postsFiltrados =
    filtro === 'all' ? posts : posts.filter((p) => p.comunidade === filtro)
  const handleLike = (id: number) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, likes: p.likes + (p.likes % 2 === 0 ? 1 : -1) }
          : p
      )
    )
  }

  const handleSalvar = (id: number) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, salvo: !p.salvo } : p)))
  }

  const toggleComentarios = (id: number) => {
    setComentarioAberto(comentarioAberto === id ? null : id)
  }

  const adicionarComentario = (postId: number) => {
    if (!novoComentario.trim()) return

    setPosts(
      posts.map((p: (typeof postsFicticios)[number]) => {
        if (p.id === postId) {
          return {
            ...p,
            comentarios: [
              ...p.comentarios,
              {
                id: Date.now(),
                autor: 'Você',
                texto: novoComentario,
              },
            ],
          }
        }
        return p
      })
    )

    setNovoComentario('')
  }

  return (
    <div className="mb-4 mt-12 min-h-screen w-[calc(100vw-5rem-17px)] md:w-[calc(100vw-20rem-17px)] 2xl:w-[1000px]">
      <main className={`transition-all duration-300`}>
        <div className="min-h-[600px] space-y-6">
          {postsFiltrados.length > 0 ? (
            postsFiltrados.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {post.avatar ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
                        {post.avatar}
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base text-gray-800">
                        <span className="font-semibold text-purple-600">
                          {post.comunidade}
                        </span>{' '}
                        • {post.autor}
                      </CardTitle>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(post.data, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-0 pt-0">
                  <p className="mb-4 text-gray-700">{post.conteudo}</p>

                  {(post.imagem || post.video) && (
                    <div className="relative -mx-6 mt-3 h-[500px] overflow-hidden rounded-b-xl bg-gray-100">
                      <img
                        src={post.imagem}
                        alt={post.comunidade}
                        className="h-full w-full object-cover"
                      />
                      {post.video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-linear-purple rounded-full p-4 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                            <Play className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="my-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                          post.likes % 2 === 1
                            ? 'text-red-500'
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${post.likes % 2 === 1 ? 'fill-current' : ''}`}
                        />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => toggleComentarios(post.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600"
                      >
                        <div
                          style={
                            comentarioAberto === post.id
                              ? {
                                  width: '20px',
                                  height: '20px',
                                  background:
                                    'linear-gradient(to right, #a8c8ff, #adc5ff, #b2c2ff, #b6c1ff, #b9c0ff, #bcbfff, #bebdff, #c1bcff, #c4bbff)',
                                  maskImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z'/></svg>\")",
                                  maskRepeat: 'no-repeat',
                                  maskSize: 'cover',
                                  maskPosition: 'center',
                                  WebkitMaskImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z'/></svg>\")",
                                  WebkitMaskRepeat: 'no-repeat',
                                  WebkitMaskSize: 'cover',
                                  WebkitMaskPosition: 'center',
                                }
                              : {
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: '#6b7280', // cinza padrão (Tailwind gray-500)
                                  maskImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z'/></svg>\")",
                                  maskRepeat: 'no-repeat',
                                  maskSize: 'cover',
                                  maskPosition: 'center',
                                  WebkitMaskImage:
                                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z'/></svg>\")",
                                  WebkitMaskRepeat: 'no-repeat',
                                  WebkitMaskSize: 'cover',
                                  WebkitMaskPosition: 'center',
                                }
                          }
                          className={`h-5 w-5 ${comentarioAberto === post.id ? 'fill-current' : ''}`}
                        />

                        {post.comentarios.length}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-blue-600">
                        <Share2 className="h-5 w-5" />
                        Compartilhar
                      </button>
                    </div>
                    <button
                      onClick={() => handleSalvar(post.id)}
                      className={`transition-all ${
                        post.salvo
                          ? 'text-purple-600'
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      {post.salvo ? (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            background:
                              'linear-gradient(to right, #a8c8ff, #adc5ff, #b2c2ff, #b6c1ff, #b9c0ff, #bcbfff, #bebdff, #c1bcff, #c4bbff)',
                            maskImage:
                              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg>\")",
                            maskRepeat: 'no-repeat',
                            maskSize: 'cover',
                            maskPosition: 'center',
                            WebkitMaskImage:
                              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg>\")",
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: 'cover',
                            WebkitMaskPosition: 'center',
                          }}
                        />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Seção de Comentários com animação */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      comentarioAberto === post.id
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-gray-100 pt-3">
                      <div className="space-y-2">
                        {post.comentarios.map((c) => (
                          <div
                            key={c.id}
                            className="flex justify-between gap-3 rounded-lg bg-black/[0.02] p-4"
                          >
                            {/* avatar */}
                            <div className="flex gap-3">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400" />

                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-800">
                                  {c.autor}
                                </p>
                                <div className="rounded-lg bg-black/[0.02] p-[2px] text-sm text-gray-700">
                                  <p> {c.texto}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Button
                                className="relative h-6 w-6 text-white transition-all duration-300"
                                style={{
                                  background:
                                    'linear-gradient(to right, #a8c8ff, #b9c0ff, #c4bbff)',
                                  backgroundBlendMode: 'overlay',
                                }}
                              >
                                <span className="absolute inset-0 rounded-md bg-transparent transition-colors duration-300 hover:bg-red-700/90"></span>
                                <MessageCircleX className="relative z-10" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4 ml-1 mt-4 flex justify-between gap-2">
                        <Input
                          placeholder="Escreva um comentário..."
                          value={novoComentario}
                          onChange={(e) => setNovoComentario(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && adicionarComentario(post.id)
                          }
                          className="rounded-full focus:!ring-purple-600"
                        />
                        <Button
                          size="icon"
                          onClick={() => adicionarComentario(post.id)}
                          disabled={!novoComentario.trim()}
                          className="bg-linear-purple cursor-pointer text-white hover:shadow-md"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 shadow-sm">
                <MessageCircleHeart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Ainda não há posts
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Seja o primeiro a compartilhar algo ou crie uma nova
                  comunidade!
                </p>
              </div>
              <NavLink to="/comunidades">
                <Button
                  className="bg-linear-purple mt-2 text-white shadow-md hover:shadow-lg"
                  size="sm"
                  onClick={() => {
                    // Abrir modal de criar post ou redirecionar
                    console.log('Abrir criar post')
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Visualizar Comunidades
                </Button>
              </NavLink>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
