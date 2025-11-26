import { MessageCircle, MessageCircleX, Play, Send } from 'lucide-react'
import { useState } from 'react'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { Post } from '../../../types'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Input } from '../../ui/input'

interface PostProp {
  valuePost: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[]
}

const PostComponentDialog = ({
  valuePost,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
}: PostProp) => {
  const comentarios = useLimitForms(5000)
  const [isOpen, setIsOpen] = useState(false)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
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

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex h-screen items-center justify-center !overflow-hidden bg-black/80" />
      )}

      <DialogContent className="fixed left-1/2 top-1/2 max-h-[95vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-0 sm:w-[90vw] lg:w-[85vw]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle>Título do diálogo</DialogTitle>
          <DialogDescription>
            Uma descrição simples explicando o propósito desse diálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-0 lg:flex-row">
          {/* Imagem/Vídeo - lado esquerdo em desktop, cima em mobile */}
          {(valuePost.imagem || valuePost.video) && (
            <div className="relative h-64 w-full shrink-0 overflow-hidden bg-gray-100 lg:h-auto lg:w-1/2 lg:rounded-none">
              <img
                src={valuePost.imagem}
                alt={valuePost.community}
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

          {/* Comentários - lado direito em desktop, abaixo em mobile */}
          <div className="flex w-full flex-col lg:w-1/2">
            <div className="flex-1 overflow-y-auto border-t border-gray-100 p-4 lg:border-l lg:border-t-0 lg:p-6">
              <div className="max-h-[50vh] space-y-4 overflow-y-auto lg:max-h-[60vh]">
                {valuePost.comentarios.map((c) => (
                  <div
                    key={c.id}
                    className="relative flex flex-col justify-between gap-3 rounded-lg bg-black/[0.02] p-4 sm:flex-row sm:items-start"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {c.autor}
                        </p>
                        <p className="mt-1 break-all text-sm text-gray-700">
                          {c.texto}
                        </p>
                      </div>
                    </div>

                    <Button className="h-8 w-8 rounded-full bg-gradient-to-r from-[#a8c8ff] to-[#c4bbff] p-0 text-white transition-all hover:bg-red-700/90">
                      <MessageCircleX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Input de novo comentário */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
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
