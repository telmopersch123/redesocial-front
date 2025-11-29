import {
  CornerDownRight,
  MessageCircle,
  MessageCircleX,
  Play,
  Send,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { Post } from '../../../types'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Separator } from '../../ui/separator'

const euUser = true

interface PostProp {
  valuePost: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Comentario = {
  id: number
  autor: string
  texto: string
  respostas?: Comentario[]
  respondendoPara?: string | null
}

const PostComponentDialog = ({
  valuePost,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
  open,
  onOpenChange,
}: PostProp) => {
  const comentarios = useLimitForms(5000)

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

  const [respondendoA, setRespondendoA] = useState<number | null>(null)
  const [textoResposta, setTextoResposta] = useState('')
  const adicionarResposta = (comentarioId: number) => {
    if (!textoResposta.trim()) return

    const adicionarRecursivo = (comentarios: Comentario[]): Comentario[] => {
      return comentarios.map((c) => {
        if (c.id === comentarioId) {
          return {
            ...c,
            respostas: [
              ...(c.respostas || []),
              {
                id: Date.now() + Math.random(),
                autor: 'Você',
                texto: textoResposta,
                respondendoPara: c.autor,
                respostas: [],
              },
            ],
          }
        }
        if (c.respostas) {
          return {
            ...c,
            respostas: adicionarRecursivo(c.respostas),
          }
        }
        return c
      })
    }

    setPosts(
      posts.map((p: Post) => {
        if (p.id === valuePost.id) {
          return {
            ...p,
            comentarios: adicionarRecursivo(p.comentarios),
          }
        }
        return p
      })
    )
  }

  const ComentarioItem = ({
    comentario,
    nivel = 0,
  }: {
    comentario: Comentario
    nivel?: number
  }) => {
    const estaRespondendo = respondendoA === comentario.id

    return (
      <div
        className={`${
          nivel === 1 ? 'border-l-2 border-purple-200 pl-4 sm:pl-6' : ''
        } ${nivel >= 2 ? 'border-none pl-0' : ''} w-full`}
      >
        <div className="relative flex w-full flex-col gap-3 rounded-lg bg-black/[0.02] p-3 sm:flex-row sm:items-start">
          <div className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex w-full items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 shadow-md"
                  aria-hidden
                />

                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">
                    {comentario.autor}
                  </p>

                  {comentario.respondendoPara && (
                    <p className="mt-0.5 text-xs font-medium text-purple-500">
                      ↳ @{comentario.respondendoPara}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-2">
                {euUser && (
                  <TooltipComponent
                    Tag={
                      <Button className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white hover:!bg-red-700/90">
                        <MessageCircleX />
                      </Button>
                    }
                    description="Remover Comentário"
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center justify-center text-xs text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    setRespondendoA(comentario.id)
                    setTextoResposta('')
                  }}
                >
                  <CornerDownRight className="mr-1 h-3.5 w-3.5" />
                  Responder
                </Button>
              </div>
            </div>

            <p className="mt-3 break-words text-sm leading-relaxed text-gray-700">
              {comentario.texto}
            </p>
          </div>
        </div>

        {estaRespondendo && (
          <div className="mt-3 w-full px-3">
            <div className="ml-2 text-xs font-medium text-purple-600">
              Respondendo @{comentario.autor}
            </div>

            <div className="mt-2 flex w-full flex-col flex-wrap justify-start gap-2 ym:flex-row ym:justify-between">
              <div className="w-full ym:w-[60%]">
                <Input
                  placeholder="Escreva sua resposta..."
                  value={textoResposta}
                  onChange={(e) => setTextoResposta(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      adicionarResposta(comentario.id)
                      setRespondendoA(null)
                    }
                  }}
                  className="w-full rounded-full text-sm"
                  autoFocus
                  aria-label={`Resposta para ${comentario.autor}`}
                />
              </div>

              <div className="flex w-full items-center justify-start gap-2 ym:w-[30%] ym:justify-end">
                <Button
                  size="icon"
                  className="bg-linear-purple rounded-full text-white hover:shadow-md"
                  onClick={() => {
                    adicionarResposta(comentario.id)
                    setRespondendoA(null)
                  }}
                  disabled={!textoResposta.trim()}
                  aria-label="Enviar resposta"
                >
                  <Send className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRespondendoA(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {comentario.respostas && comentario.respostas.length > 0 && (
          <div className="mt-3 space-y-3">
            {comentario.respostas.map((resposta) => (
              <ComentarioItem
                key={resposta.id}
                comentario={resposta}
                nivel={nivel + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="rounded-md px-4 py-2 text-white">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600"
          aria-label={`Abrir comentários (${valuePost.comentarios.length})`}
        >
          <MessageCircle />
          {valuePost.comentarios.length}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[95vh] flex-col -space-y-10 overflow-hidden rounded-xl p-0 sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] [&>button]:hidden">
        <DialogHeader className="flex flex-col p-4">
          <div className="absolute right-5 top-2 flex items-center justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-red-100 hover:text-red-600 active:scale-90"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
              <p aria-hidden>{valuePost.avatar}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {valuePost.autor}
            </p>
          </div>

          <div className={`relative w-full`}>
            <div className="max-w-full overflow-y-auto break-all pr-2">
              <DialogTitle className="text-md h-[100px] p-0 font-medium leading-relaxed 2xl:h-[200px]">
                {valuePost.conteudo}
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
                kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
              </DialogTitle>

              <div className="pointer-events-none absolute -bottom-1 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>

          <Separator className="m-0" />
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col justify-between p-4 2xl:flex-row">
          {(valuePost.imagem || valuePost.video) && (
            <div className="z-10 md:h-1/2 2xl:h-auto 2xl:w-1/2">
              <div className="bg-linear-purple relative flex items-center justify-center overflow-hidden rounded-md md:w-auto 2xl:h-full">
                <div className="p-1">
                  <img
                    src={valuePost.imagem}
                    alt={valuePost.community || 'Imagem do post'}
                    className="max-h-[250px] w-full max-w-full rounded-md object-contain shadow-[0_0_10px_3px_rgba(0,0,0,0.3)] 2xl:max-h-[calc(65vh-70px)]"
                  />
                </div>
                {valuePost.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-linear-purple rounded-full p-4 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            className={`flex h-full flex-col overflow-y-auto 2xl:max-h-full ${valuePost.imagem === undefined && valuePost.video === undefined ? '2xl:w-full' : 'md:max-h-[48vh] 2xl:w-1/2'}`}
          >
            <div className="relative h-full md:h-2/3 md:max-h-full 2xl:h-full">
              <div className="space-y-4 pb-10 pt-8 2xl:pb-10 2xl:pt-0">
                {valuePost.comentarios.map((c) => (
                  <ComentarioItem key={c.id} comentario={c} />
                ))}
              </div>
              <div
                className={` ${valuePost.imagem === undefined && valuePost.video === undefined ? '2xl:w-full' : '2xl:w-1/2'} !fixed !bottom-0 right-0 mt-3 w-full rounded-xl bg-white p-2`}
              >
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    adicionarComentario(valuePost.id)
                  }}
                >
                  <Input
                    placeholder="Escreva um comentário..."
                    value={novoComentario}
                    onChange={(e) => {
                      setNovoComentario(e.target.value)
                      comentarios.handleChange(e)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        adicionarComentario(valuePost.id)
                      }
                    }}
                    className={`flex-1 rounded-full border ${
                      comentarios.error
                        ? '!border-rose-300 focus:!ring-rose-500'
                        : 'focus:border-transparent focus:!ring-purple-600'
                    }`}
                    aria-label="Novo comentário"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    onClick={() => adicionarComentario(valuePost.id)}
                    disabled={!novoComentario.trim() || !!comentarios.error}
                    className="bg-linear-purple rounded-full text-white hover:shadow-md disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {comentarios.error && (
                  <p className="mt-2 text-center text-sm text-rose-600">
                    Uau rsrs! Você escreveu bastante! Envie a mensagem atual
                    para continuar.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostComponentDialog
