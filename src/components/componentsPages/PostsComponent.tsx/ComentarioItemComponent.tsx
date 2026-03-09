import {
  CornerDownRight,
  Eye,
  EyeOff,
  Loader2,
  MessageCircleX,
  Send,
} from 'lucide-react'

import React, {
  useEffect,
  useRef,
  useState,
  type RefObject,
  type SetStateAction,
} from 'react'
import { useMentionLogic } from '../../../context/openMentions'
import { useLimitForms } from '../../../hooks/useLimitForms'
import type { ComentarioPost } from '../../../types'
import { formatMentions } from '../../../utils/formatMentions'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { Button } from '../../ui/button'

import { useAuth } from '../../../context/getMe'
import type { ExtendedPost } from '../../../pages/community/PostsArchived'
import { deleteComment } from '../../../services/authService'
import { LoadingComponent } from '../../../utils/components/Loading'
import ListMarcation from './ListMarcation'
import { MentionInput } from './components/MentionsInput'

interface ComentarioItemProps {
  comentario: ComentarioPost
  nivel: number
  respondendoA: number | null
  setRespondendoA: React.Dispatch<React.SetStateAction<number | null>>
  textoResposta: string
  setTextoResposta: React.Dispatch<React.SetStateAction<string>>
  adicionarResposta: (comentarioId: number, respondendoPara: string) => void
  openReplies: { [commentId: string]: boolean }
  setOpenReplies: React.Dispatch<
    SetStateAction<{ [commentId: string]: boolean }>
  >
  scrollRef: RefObject<HTMLDivElement | null>
  setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>
  disabled: number
}

const CommentItem = ({
  comentario,
  nivel,
  respondendoA,
  setRespondendoA,
  textoResposta,
  setTextoResposta,
  adicionarResposta,
  openReplies,
  setOpenReplies,
  scrollRef,
  setPosts,
  disabled,
}: ComentarioItemProps) => {
  const isLoadingComment = disabled === comentario.id
  const [clickedMention, setClickedMention] = useState(false)
  const { user: authUser } = useAuth()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const comentarios = useLimitForms(5000)
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<
    { id: number; name_at: string }[]
  >([])
  const openMarcation = useState(false)
  const { getMatches, sugestoes, setActiveInputId, activeInputId } =
    useMentionLogic()
  const estaRespondendo = respondendoA === comentario.id
  const idInput = 'comment-' + comentario.id

  // responsavel por exibir todas as respostas
  const toggleReplies = (commentId: number) => {
    setOpenReplies((prev) => {
      const updated: { [key: string]: boolean } = {
        ...prev,
        [commentId]: !prev[commentId],
      }

      if (!prev[commentId]) {
        function openChildren(comentario: ComentarioPost) {
          comentario.replies?.forEach((r) => {
            updated[String(r.id)] = true
            openChildren(r)
          })
        }

        const original = comentario
        openChildren(original)
      }

      return updated
    })
  }
  //useffect responsavel por controlar o focus no input de respostas
  useEffect(() => {
    if (respondendoA !== comentario.id) return
    let observer: MutationObserver | null = null

    function tryFocus() {
      if (inputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })

          setTimeout(() => {
            scrollRef.current?.scrollBy({
              top: 80,
              behavior: 'smooth',
            })
          }, 120) // delay mínimo
        })

        observer?.disconnect()
        observer = null
      }
    }
    tryFocus()

    observer = new MutationObserver(() => {
      tryFocus()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer?.disconnect()
  }, [respondendoA, comentario.id])
  const deletarComentario = async (comentario: ComentarioPost) => {
    try {
      await deleteComment(comentario.id)
      setPosts((prevPosts) =>
        prevPosts.map((p) => ({
          ...p,
          comments:
            comentario.parentId === null
              ? p.comments?.filter(
                  (c) => c.id !== comentario.id && c.parentId !== comentario.id
                )
              : removerRecursivo(p.comments ?? [], comentario.id),
        }))
      )
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
    }
  }
  const removerRecursivo = (
    comentarios: ComentarioPost[],
    idParaRemover: number
  ): ComentarioPost[] => {
    return comentarios
      .map((c) => ({
        ...c,
        replies: c.replies ? removerRecursivo(c.replies, idParaRemover) : [],
      }))
      .filter((c) => c.id !== idParaRemover)
  }

  return (
    <div
      className={` ${isLoadingComment && 'pointer-events-none animate-pulse opacity-50'} ${
        nivel === 1
          ? `border-l-4 border-purple-200 pl-4 dark:border-purple-900/50 sm:pl-6`
          : ''
      } ${nivel >= 2 ? 'border-none pl-0' : ''} w-full`}
    >
      <div className="relative flex w-full flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-start">
        <div className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {isLoadingComment && (
                <div className="absolute left-0 top-0 z-10 h-full w-full">
                  <div className="flex h-full w-full items-center justify-center">
                    <LoadingComponent />
                  </div>
                </div>
              )}
              <div
                className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 shadow-md"
                aria-hidden
              />

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  {comentario.user.name_at}
                </p>

                {comentario.respondendoPara && (
                  <p className="mt-0.5 text-xs font-medium text-purple-400">
                    ↳ @{comentario.respondendoPara}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`h-8 gap-2 px-2 text-xs text-muted-foreground transition hover:text-foreground ${
                  nivel === 0 &&
                  comentario.replies &&
                  comentario.replies.length > 0
                    ? 'flex'
                    : 'hidden'
                }`}
                onClick={() => toggleReplies(comentario.id)}
              >
                {openReplies[comentario.id] ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:inline">Esconder</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Respostas</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-1 flex items-center gap-2">
              {authUser?.id === comentario.user.id && (
                <TooltipComponent
                  Tag={
                    <Button
                      onClick={() => deletarComentario(comentario)}
                      className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white hover:!bg-red-700/90"
                    >
                      <MessageCircleX />
                    </Button>
                  }
                  description="Remover Comentário"
                />
              )}

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center text-xs text-purple-500 hover:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
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

          <p
            dangerouslySetInnerHTML={{
              __html: formatMentions(comentario.content, comentario.mentions),
            }}
            className="mt-3 break-words text-sm leading-relaxed text-gray-700 dark:text-zinc-300"
          />
        </div>
      </div>

      {estaRespondendo && (
        <div className="mt-3 w-full px-3">
          <div className="ml-2 flex items-end gap-2 text-xs font-medium text-purple-500 dark:text-purple-400">
            <span> Respondendo @{comentario.user.name_at} </span>
            {comentarios.error && textoResposta.trim() !== '' && (
              <span className="mt-2 text-start text-sm text-rose-500 dark:text-rose-400">
                Uau rsrs! Você escreveu bastante! Envie a mensagem atual para
                continuar.
              </span>
            )}
          </div>

          <div className="mt-2 flex w-full flex-col items-end gap-2 om:flex-row">
            <div className="relative w-full">
              {activeInputId === idInput &&
                clickedMention &&
                sugestoes.length > 0 &&
                openMarcation && (
                  <div className="absolute -top-3">
                    <ListMarcation
                      setClickedMention={setClickedMention}
                      sugestoes={sugestoes}
                      setNovoComentario={(valor) => {
                        setTextoResposta(valor)
                      }}
                      onUserClick={(user) => {
                        setUsuariosSelecionados((prev) => {
                          const jaExiste = prev.find((u) => u.id === user.id)
                          if (jaExiste) return prev
                          return [...prev, user]
                        })
                      }}
                      inputRef={inputRef}
                    />
                  </div>
                )}
              <MentionInput
                value={textoResposta}
                usuariosSelecionados={usuariosSelecionados}
                onChange={(e) => {
                  setTextoResposta(e.target.value)
                  comentarios.handleChange(e)
                  setActiveInputId(idInput)
                  getMatches(e.target.value, idInput, setClickedMention)
                }}
                ref={inputRef}
                onEnter={() => {
                  adicionarResposta(comentario.id, comentario.user.name_at)
                  setRespondendoA(null)
                  setActiveInputId(null)
                  setOpenReplies((prev) => ({
                    ...prev,
                    [comentario.id]: true,
                  }))
                }}
                disabled={isLoadingComment}
                error={comentarios.error}
                aria-label={`Resposta para ${comentario.user.name_at}`}
              />
            </div>

            <div className="flex w-fit items-center gap-2">
              <Button
                size="icon"
                className="bg-linear-purple rounded-full text-white hover:shadow-md"
                onClick={() => {
                  adicionarResposta(comentario.id, comentario.user.name_at)
                  setRespondendoA(null)
                  setOpenReplies((prev) => ({
                    ...prev,
                    [comentario.id]: true,
                  }))
                }}
                disabled={
                  !textoResposta.trim() ||
                  !!comentarios.error ||
                  isLoadingComment
                }
                aria-label="Enviar resposta"
              >
                {disabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
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

      {comentario.replies &&
        comentario.replies.length > 0 &&
        openReplies[comentario.id] && (
          <div className="mt-3 space-y-3">
            {comentario.replies.map((resposta) => (
              <CommentItem
                key={resposta.id}
                comentario={resposta}
                nivel={nivel + 1}
                respondendoA={respondendoA}
                setRespondendoA={setRespondendoA}
                textoResposta={textoResposta}
                setTextoResposta={setTextoResposta}
                adicionarResposta={adicionarResposta}
                setOpenReplies={setOpenReplies}
                openReplies={openReplies}
                scrollRef={scrollRef}
                setPosts={setPosts}
                disabled={disabled}
              />
            ))}
          </div>
        )}
    </div>
  )
}

export default CommentItem
