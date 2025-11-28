import {
  CornerDownRight,
  MessageCircle,
  MessageCircleX,
  Play,
  Send,
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
        className={`${nivel == 1 ? 'ml-10 border-l-2 border-purple-200 pl-5' : ''} ${nivel >= 2 ? 'ml-0 pl-0' : ''}`}
      >
        <div className="relative flex flex-col gap-3 rounded-lg bg-black/[0.02] p-4 sm:flex-row sm:items-start">
          <div className="flex flex-1 gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {comentario.autor}
              </p>
              <p className="mt-1 break-all text-sm text-gray-700">
                {comentario.texto}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {euUser && (
              <TooltipComponent
                Tag={
                  <Button className="h-8 w-8 rounded-full bg-purple-600 p-0 text-white hover:!bg-red-700/90">
                    <MessageCircleX className="h-4 w-4" />
                  </Button>
                }
                description="Remover Comentário"
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-600 hover:bg-purple-50"
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

        {estaRespondendo && (
          <div className="mr-4 mt-3 flex w-full items-center gap-2">
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
              className="flex-1 rounded-full text-sm"
              autoFocus
            />
            <Button
              size="icon"
              className="bg-linear-purple rounded-full text-white hover:shadow-md"
              onClick={() => {
                adicionarResposta(comentario.id)
                setRespondendoA(null)
              }}
              disabled={!textoResposta.trim()}
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
        )}

        {comentario.respostas && comentario.respostas.length > 0 && (
          <div className="mt-3">
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
        >
          <MessageCircle />
          {valuePost.comentarios.length}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`${valuePost.imagem === undefined && valuePost.video === undefined ? 'h-[85vh] w-[80vw]' : 'max-h-[99vh] w-[95vw] sm:w-[90vw] lg:w-[85vw]'} rounded-xl p-0`}
      >
        <DialogHeader className="mb-0 flex flex-col p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
              <p> {valuePost.avatar}</p>
            </div>
            <p>{valuePost.autor}</p>
          </div>
          <div
            className={`relative ${valuePost.imagem === undefined && valuePost.video === undefined ? 'h-[200px]' : 'max-h-[80px]'}`}
          >
            {/* CONTEÚDO COM SCROLL */}
            <div className={`h-full overflow-y-auto pr-1`}>
              <DialogTitle className="text-md p-0 pb-5 font-medium">
                {valuePost.conteudo} Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit. Amet soluta vel, cumque libero expedita
                ducimus, a quibusdamLorem ipsum dolor sit, amet consectetur
                adipisicing elit.Lorem ipsum dolor sit, amet consectetur
                adipisicing elit.
              </DialogTitle>
              <div className="pointer-events-none absolute -bottom-1 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>
          <Separator className="m-0" />
        </DialogHeader>

        <div
          className={`cm:ml-1 flex flex-col justify-normal gap-0 ym:justify-between vm:flex-row ${valuePost.imagem === undefined && valuePost.video === undefined ? 'h-auto' : 'h-[80vh]'}`}
        >
          {(valuePost.imagem || valuePost.video) && (
            <div className="bg-linear-purple relative flex items-center justify-center overflow-hidden !rounded-md py-10 om:py-28 sm:h-full md:py-44 lg:rounded-none vm:w-1/2">
              <img
                src={valuePost.imagem}
                alt={valuePost.community}
                className="max-h-[120%] max-w-[90%] rounded-md object-contain shadow-[0_0_10px_3px_rgba(0,0,0,0.3)] om:max-h-[28vh] md:max-h-[38vh] vm:max-h-[70vh] vm:max-w-[95%]"
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

          <div
            className={`flex flex-col ${valuePost.imagem === undefined && valuePost.video === undefined ? 'w-full vm:h-[580px]' : 'vm:w-1/2'}`}
          >
            <div
              className={`space-y-4 overflow-y-auto border-gray-100 p-1 vm:h-full ${valuePost.imagem === undefined && valuePost.video === undefined ? '!h-[45vh] vm:mt-0 vm:!h-[70vh]' : 'h-[40vh] md:h-[30vh]'}`}
            >
              {valuePost.comentarios.map((c) => (
                <ComentarioItem key={c.id} comentario={c} />
              ))}
            </div>

            <div
              className={`w-full ${valuePost.imagem === undefined && valuePost.video === undefined ? 'vm:mb-0' : 'mb-7 ym:mb-4 vm:mb-0'} rounded-xl border-t border-none border-gray-100 bg-white p-1 ym:relative`}
            >
              <div className="flex gap-2">
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
                />
                <Button
                  size="icon"
                  onClick={() => adicionarComentario(valuePost.id)}
                  disabled={!novoComentario.trim() || !!comentarios.error}
                  className="bg-linear-purple rounded-full text-white hover:shadow-md disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {comentarios.error && (
                <p className="mt-2 text-center text-sm text-rose-600">
                  Uau rsrs! Você escreveu bastante! Envie a mensagem atual para
                  continuar.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostComponentDialog
