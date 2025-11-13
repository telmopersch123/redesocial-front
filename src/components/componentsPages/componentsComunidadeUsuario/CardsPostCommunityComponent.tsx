import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Bookmark,
  Clock,
  Heart,
  MessageCircleX,
  Play,
  Send,
  Share2,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { Post } from '../../../pages/AreaCommunitiesUserPage'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'

interface PostCardProps {
  posts: Post[]
  valuePost: Post
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}
const CardsPostCommunityComponent = ({
  posts,
  valuePost,
  setPosts,
}: PostCardProps) => {
  const [comentarioAberto, setComentarioAberto] = useState<number | null>(null)
  const [novoComentario, setNovoComentario] = useState('')
  const comentarios = useLimitForms(5000)
  const handleLike = (id: number) => {
    setPosts(
      posts.map((p: Post) =>
        p.id === id
          ? { ...p, likes: p.likes + (p.likes % 2 === 0 ? 1 : -1) }
          : p
      )
    )
  }

  const handleSalvar = (id: number) => {
    setPosts(
      posts.map((p: Post) => (p.id === id ? { ...p, salvo: !p.salvo } : p))
    )
  }

  const toggleComentarios = (id: number) => {
    setComentarioAberto(comentarioAberto === id ? null : id)
  }

  const adicionarComentario = (postId: number) => {
    if (!novoComentario.trim()) return

    setPosts(
      posts.map((p: Post) => {
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
    <Card
      key={valuePost.id}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {valuePost.avatar ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
              {valuePost.avatar}
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
              <Users className="h-5 w-5" />
            </div>
          )}
          <div>
            <CardTitle className="text-base text-gray-800">
              <span className="font-semibold text-purple-600">
                {valuePost.comunidade}
              </span>{' '}
              • {valuePost.autor}
            </CardTitle>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(valuePost.data, {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-0 pt-0">
        <p className="mb-4 text-gray-700">{valuePost.conteudo}</p>

        {(valuePost.imagem || valuePost.video) && (
          <div className="relative -mx-6 mt-3 h-[500px] overflow-hidden rounded-b-xl bg-gray-100">
            <img
              src={valuePost.imagem}
              alt={valuePost.comunidade}
              className="h-full w-full object-cover"
            />
            {valuePost.video && (
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
              onClick={() => handleLike(valuePost.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                valuePost.likes % 2 === 1
                  ? 'text-red-500'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${valuePost.likes % 2 === 1 ? 'fill-current' : ''}`}
              />
              {valuePost.likes}
            </button>
            <button
              onClick={() => toggleComentarios(valuePost.id)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600"
            >
              <div
                style={
                  comentarioAberto === valuePost.id
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
                className={`h-5 w-5 ${comentarioAberto === valuePost.id ? 'fill-current' : ''}`}
              />

              {valuePost.comentarios.length}
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-blue-600">
              <Share2 className="h-5 w-5" />
              Compartilhar
            </button>
          </div>
          <button
            onClick={() => handleSalvar(valuePost.id)}
            className={`transition-all ${
              valuePost.salvo
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            {valuePost.salvo ? (
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
            comentarioAberto === valuePost.id
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mb-4 max-h-[300px] overflow-y-auto border-t border-gray-100 pt-3">
            <div className="space-y-2">
              {valuePost.comentarios.map((c) => (
                <div
                  key={c.id}
                  className="relative justify-between gap-2 rounded-lg bg-black/[0.02] p-4 sm:flex"
                >
                  {/* Container do conteúdo principal com padding para evitar sobreposição */}
                  <div className="sm:pr-0">
                    {' '}
                    {/* Reserva espaço para o botão no mobile */}
                    <div className="gap-3 sm:flex sm:flex-row sm:gap-3">
                      {/* Avatar - absolute no mobile */}
                      <div className="absolute left-4 top-4 h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 sm:static" />

                      {/* Autor e texto */}
                      <div className="sm:flex sm:flex-col sm:pl-0">
                        {/* Autor - absolute no mobile */}
                        <p className="absolute left-16 top-4 text-sm font-medium text-gray-800 sm:static">
                          {c.autor}
                        </p>

                        {/* Parágrafo - ocupa todo o espaço disponível */}
                        <div className="mt-10 max-h-[100px] max-w-[1000px] overflow-x-auto rounded-lg bg-black/[0.02] text-sm text-gray-700 sm:mt-0 sm:max-h-[200px] sm:!max-w-[800px] sm:p-1">
                          <p className="break-all">{c.texto}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão de remover - absolute no mobile */}
                  <div className="absolute right-4 top-4 sm:static">
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

            <div className="my-2 ml-1 flex justify-between gap-2">
              <Input
                placeholder="Escreva um comentário..."
                value={novoComentario}
                onChange={(e) => {
                  setNovoComentario(e.target.value)
                  comentarios.handleChange(e)
                }}
                onKeyDown={(e) =>
                  e.key === 'Enter' && adicionarComentario(valuePost.id)
                }
                className={`rounded-full border border-muted-foreground/50 transition-colors ${
                  comentarios.error
                    ? '!border-rose-200 focus:!ring-rose-600'
                    : 'focus:border-transparent focus:!ring-purple-600'
                }`}
              />

              <Button
                size="icon"
                onClick={() => adicionarComentario(valuePost.id)}
                disabled={!novoComentario.trim() || !!comentarios.error}
                className="bg-linear-purple cursor-pointer text-white hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {comentarios.error && (
              <div className="mt-1 flex items-center justify-center rounded-md bg-rose-200/40 p-1">
                <p className="text-sm text-rose-600/70">
                  Uau rsrs! Você escreveu bastante! Envie a mensagem atual para
                  continuar.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardsPostCommunityComponent
