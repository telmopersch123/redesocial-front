import { MessageCircle, Play, Send, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { ComentarioPost, Post } from '../../../types'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Separator } from '../../ui/separator'
import CommentItem from './ComentarioItemComponent'
import MentionInput from './components/MentionsInput'
import ActionsPost from './components/SavePostButton'
import ListMarcation from './ListMarcation'

const euUser = true

export interface PostProp {
  valuePost: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[]
  open: boolean
  onOpenChange: (open: boolean) => void
}
export const usuariosMentions = [
  'ana',
  'anderson',
  'andre',
  'telmo',
  'maria',
  'joao',
  'jose',
  'mariana',
  'carlos',
  'paula',
]
const PostComponentDialog = ({
  valuePost,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
  open,
  onOpenChange,
}: PostProp) => {
  const [clickedMention, setClickedMention] = useState(false)
  const [sugestoes, setSugestoes] = useState<string[]>(usuariosMentions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [openMarcation, setOpenMarcation] = useState(false)
  const comentarios = useLimitForms(5000)
  const pathname = useLocation().pathname
  const { id } = useParams()

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

    const adicionarRecursivo = (
      comentarios: ComentarioPost[]
    ): ComentarioPost[] => {
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

  const handleMarcation = (text: string) => {
    const cursorWord = text.split(/\s+/).pop() || ''
    if (cursorWord.startsWith('@')) {
      const termo = cursorWord.slice(1).toLocaleLowerCase()

      const filtrados = usuariosMentions.filter((nome) =>
        nome.toLowerCase().startsWith(termo)
      )

      setSugestoes(filtrados)
      setClickedMention(false)
      setOpenMarcation(true)
    } else {
      setSugestoes([])
      setOpenMarcation(false)
    }
  }

  return (
    <>
      {pathname.includes(`perfil/${id}/config`) && open === true && (
        <div className="fixed inset-0 z-[60] h-screen w-screen bg-black/50" />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger
          className={`rounded-md px-4 py-2 text-white ${pathname.includes(`perfil/${id}/config`) ? 'hidden' : ''}`}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600`}
            aria-label={`Abrir comentários (${valuePost.comentarios.length})`}
          >
            <MessageCircle />
            {valuePost.comentarios.length}
          </Button>
        </DialogTrigger>

        <DialogContent className="z-[70] flex h-[95vh] flex-col -space-y-10 overflow-hidden rounded-xl p-0 sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] [&>button]:hidden">
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
                <DialogTitle className="text-md h-[100px] p-0 font-medium leading-relaxed 2xl:h-[120px]">
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
                <div
                  className={`bg-linear-purple relative flex items-center justify-center overflow-hidden rounded-md md:w-auto 2xl:h-full ${pathname.includes(`perfil/${id}/config`) && open === true ? 'flex-col' : 'flex-row'}`}
                >
                  <div>
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
                  <div>
                    {pathname.includes(`perfil/${id}/config`) &&
                      open === true && (
                        <ActionsPost
                          valuePost={valuePost}
                          novoComentario={novoComentario}
                          setNovoComentario={setNovoComentario}
                          setPosts={setPosts}
                          posts={posts}
                          dialogOpen={dialogOpen}
                          setDialogOpen={setDialogOpen}
                          validated={
                            pathname.includes(`perfil/${id}/config`) &&
                            open === true
                          }
                        />
                      )}
                  </div>
                </div>
              </div>
            )}

            <div
              className={`flex h-full flex-col overflow-y-auto 2xl:max-h-full ${valuePost.imagem === undefined && valuePost.video === undefined ? '2xl:w-full' : 'md:max-h-[48vh] 2xl:w-1/2'}`}
            >
              <div className="relative h-full md:h-2/3 md:max-h-full 2xl:h-full">
                <div className="space-y-4 pb-10 pt-8 2xl:pb-10 2xl:pt-0">
                  {valuePost.comentarios.map((c) => (
                    <CommentItem
                      key={c.id}
                      comentario={c}
                      nivel={0}
                      respondendoA={respondendoA}
                      setRespondendoA={setRespondendoA}
                      textoResposta={textoResposta}
                      setTextoResposta={setTextoResposta}
                      adicionarResposta={adicionarResposta}
                      euUser={euUser}
                    />
                  ))}
                </div>
                <div
                  className={` ${valuePost.imagem === undefined && valuePost.video === undefined ? '2xl:w-full' : '2xl:w-1/2'} !fixed !bottom-0 right-0 mt-3 w-full rounded-xl bg-white p-2`}
                >
                  <form
                    className="flex w-full items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    {openMarcation && (
                      <ListMarcation
                        clickedMention={clickedMention}
                        setClickedMention={setClickedMention}
                        sugestoes={sugestoes}
                        setNovoComentario={setNovoComentario}
                      />
                    )}

                    <MentionInput
                      clickedMention={clickedMention}
                      value={novoComentario}
                      onChange={(e) => {
                        setNovoComentario(e.target.value)
                        comentarios.handleChange(e)
                        handleMarcation(e.target.value)
                      }}
                      onEnter={() => adicionarComentario(valuePost.id)}
                      error={comentarios.error}
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
    </>
  )
}

export default PostComponentDialog
