import { Loader2, MessageCircle, Send, User, X } from 'lucide-react'
import { useContext, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useMentionLogic } from '../../../context/openMentions'
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

import { useCriarPostDialog } from '../../../context/ContextDialogPost'
import { VideoContext } from '../../../context/VideoContext'
import { createComment } from '../../../services/authService'

import toast from 'react-hot-toast'
import { usePosts } from '../../../context/PostsContext'
import type { ExtendedPost } from '../../../pages/community/PostsArchived'
import ListMarcation from './ListMarcation'
import ActionsPost from './components/ActionsPostComponent'
import { MentionInput } from './components/MentionsInput'

export interface PostProp {
  valuePosts: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>
  posts: Post[]
  open: boolean
  onOpenChange: (open: boolean) => void
  typePost?: string
  pauseVideo?: () => void
}

const PostComponentDialog = ({
  valuePosts,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
  open,
  onOpenChange,
  typePost,
  pauseVideo,
}: PostProp) => {
  if (valuePosts === undefined || valuePosts === null) return null
  const postFromContext = posts.find((p) => p.id === valuePosts.id)

  const postAtualizado: Post = {
    ...(postFromContext ?? valuePosts),
    likedByMe: valuePosts.likedByMe,
    saved: valuePosts.saved,
    likesCount: valuePosts.likesCount,
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const { getMatches, sugestoes, setActiveInputId, activeInputId } =
    useMentionLogic()
  const [openReplies, setOpenReplies] = useState<{
    [commentId: string]: boolean
  }>({})
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<
    { id: number; name_at: string }[]
  >([])
  const { openActionPosts, setOpenActionPosts } = useCriarPostDialog()
  const [clickedMention, setClickedMention] = useState(false)
  const [isLoadingComment, setIsLoadingComment] = useState(false)
  const [sendingLoadingCommentId, setSendingLoadingCommentId] =
    useState<number>(0)
  const idInput = 'comment-' + postAtualizado.id

  const comentarios = useLimitForms(5000)
  const pathname = useLocation().pathname
  const videoRef = useRef<HTMLVideoElement>(null)
  const [respondendoA, setRespondendoA] = useState<number | null>(null)
  const [textoResposta, setTextoResposta] = useState('')
  const { videoState, setVideoState } = useContext(VideoContext)
  const { id } = useParams()
  const { setSelectedPost } = usePosts()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const adicionarComentario = async (postId: number) => {
    if (!novoComentario.trim()) return
    setIsLoadingComment(true)
    const mentionedUserIds = usuariosSelecionados
      .filter((u) => novoComentario.includes(`@${u.name_at}`))
      .map((u) => u.id)

    try {
      const response = await createComment(
        postId,
        novoComentario,
        null,
        undefined,
        mentionedUserIds
      )
      const data = await response.json()

      if (!response.ok) {
        return toast.error(data.error || 'Você não pode comentar nesse post', {
          icon: '🚫',
        })
      }
      const newComment = data.comment
      setPosts(
        posts.map((p: Post) => {
          if (p?.id === postId) {
            return {
              ...p,
              comments: [...(p.comments ?? []), newComment],
            }
          }
          return p
        }) as ExtendedPost[]
      )
      setSelectedPost((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comments: { ...(prev.comments ?? []), newComment },
        }
      })
      setUsuariosSelecionados([])
      setClickedMention(false)
      setNovoComentario('')
    } catch (err) {
      console.log(err)
      toast.error('Erro de conexão.')
    } finally {
      setIsLoadingComment(false)
    }
  }

  const adicionarResposta = async (
    comentarioId: number,
    respondendoPara?: string
  ) => {
    if (!textoResposta.trim()) return
    setIsLoadingComment(true)
    const mentionedUserIds = usuariosSelecionados
      .filter((u) => novoComentario.includes(`@${u.name_at}`))
      .map((u) => u.id)

    try {
      setSendingLoadingCommentId(comentarioId)
      const response = await createComment(
        postAtualizado.id,
        textoResposta,
        comentarioId,
        respondendoPara,
        mentionedUserIds
      )
      const data = await response.json()

      if (!response.ok) {
        return toast.error(
          data.error || 'Você não pode responder esse comentário',
          { icon: '🚫' }
        )
      }
      const novaResposta = data.comment
      setPosts(
        posts.map((p: Post) => {
          if (p.id === postAtualizado.id) {
            return {
              ...p,
              comments: adicionarRecursivo(
                p.comments ?? [],
                comentarioId,
                novaResposta
              ),
            }
          }
          return p
        }) as ExtendedPost[]
      )
      setSelectedPost(postAtualizado)
      setUsuariosSelecionados([])
      setTextoResposta('')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message, { icon: '🚫' })
    } finally {
      setIsLoadingComment(false)
      setSendingLoadingCommentId(0)
    }
  }

  const adicionarRecursivo = (
    comments: ComentarioPost[],
    comentarioId: number,
    novaResposta: ComentarioPost
  ): ComentarioPost[] => {
    return comments.map((c) => {
      if (
        c.id === comentarioId ||
        (c.replies && c.replies.some((r) => r.id === comentarioId))
      ) {
        return {
          ...c,
          replies: [...(c.replies || []), novaResposta], // adiciona sempre no mesmo nível
        }
      }
      return c
    })
  }

  const pauseDialogVideo = () => {
    if (!videoRef.current) return

    const currentTime = videoRef.current.currentTime
    videoRef.current.pause()

    setVideoState((prev) => ({
      ...prev,
      [postAtualizado.id]: {
        currentTime,
        playing: false,
      },
    }))
  }

  return (
    <>
      {pathname.includes(`perfil/${id}/config`) && open === true && (
        <div className="fixed inset-0 z-[60] h-screen w-screen bg-black/50 dark:bg-black/80" />
      )}
      <Dialog
        open={open}
        onOpenChange={(state) => {
          if (!state) {
            pauseDialogVideo()
            setOpenReplies({})
            setOpenActionPosts(false)
          }
          onOpenChange(state)
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={() => pauseVideo?.()}
            variant="ghost"
            size="sm"
            className={`flex ${
              typePost === 'NotificaçãoDialog' ||
              pathname.includes(`perfil/${id}/config`) ||
              openActionPosts
                ? 'hidden'
                : ''
            } items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400`}
          >
            <MessageCircle className="h-4 w-4" />
            {(postAtualizado.comments ?? []).length}
          </Button>
        </DialogTrigger>

        <DialogContent className="!z-[70] flex h-[95vh] w-[95vw] max-w-[95vw] flex-col overflow-hidden rounded-xl bg-white p-0 dark:bg-[#1a1a1a] lg:flex-row xl:max-w-[80vw] 2xl:max-w-[70vw] [&>button]:hidden">
          {/* LADO ESQUERDO: MÍDIA */}
          <div
            className={`h-1/3 flex-[1] justify-center lg:h-full lg:items-center ${postAtualizado.mediaUrl ? 'flex' : 'hidden'}`}
          >
            {postAtualizado.mediaUrl ? (
              <div className="relative flex max-h-[600px] min-h-[300px] items-center justify-center overflow-hidden border-r bg-black/5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-50 h-8 w-8 rounded-full bg-black/10 text-gray-600 hover:bg-red-500 hover:text-white dark:text-gray-400 lg:hidden"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>

                {postAtualizado.mediaType === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <video
                      ref={videoRef}
                      src={postAtualizado.mediaUrl}
                      onLoadedMetadata={() => {
                        const state = videoState[postAtualizado.id]
                        if (state?.currentTime && videoRef.current)
                          videoRef.current.currentTime = state.currentTime
                      }}
                      controls
                      className="h-full w-full object-contain" // Garante que o vídeo preencha o espaço sem sumir
                    />
                  </div>
                ) : (
                  <img
                    src={postAtualizado.mediaUrl}
                    alt="Post"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ) : null}
          </div>
          {/* LADO DIREITO: INFO + COMENTÁRIOS */}
          <div className="flex h-[60vh] flex-1 flex-col lg:h-full lg:min-h-0 lg:w-[450px] xl:w-[500px]">
            {/* Header com Autor e Botão Fechar */}
            <DialogHeader className="flex flex-col border-b p-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {postAtualizado.user.avatar ? (
                    <img
                      src={postAtualizado.user.avatar || ''}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}

                  <p className="text-sm font-semibold dark:text-gray-100">
                    {postAtualizado.user.name_at}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 lg:flex"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 max-h-[120px] overflow-y-auto pr-2">
                <DialogTitle className="break-words text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-300">
                  {postAtualizado.description}
                </DialogTitle>
              </div>
              <div>
                {' '}
                {postAtualizado.postTags?.map(
                  (tag: { tag: { name: string; id: number } }, index) => (
                    <span
                      key={index}
                      className="mr-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      @{tag.tag.name}
                    </span>
                  )
                )}
              </div>
            </DialogHeader>

            {/* Ações (Like/Save/Share) */}
            <div className="px-4 py-2">
              <ActionsPost
                valuePost={postAtualizado}
                novoComentario={novoComentario}
                setNovoComentario={setNovoComentario}
                setPosts={setPosts}
                posts={posts}
                pauseVideo={pauseVideo as () => void}
                validated={true}
                open={open}
              />
            </div>

            <Separator className="dark:bg-gray-800" />

            {/* ÁREA DE SCROLL DOS COMENTÁRIOS */}
            <div
              ref={scrollRef}
              className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
            >
              {(postAtualizado.comments?.length ?? 0) > 0 ? (
                postAtualizado.comments?.map((c: ComentarioPost) => (
                  <CommentItem
                    key={c.id}
                    comentario={c}
                    nivel={0}
                    respondendoA={respondendoA}
                    setRespondendoA={setRespondendoA}
                    textoResposta={textoResposta}
                    setTextoResposta={setTextoResposta}
                    adicionarResposta={adicionarResposta}
                    setOpenReplies={setOpenReplies}
                    openReplies={openReplies}
                    scrollRef={scrollRef}
                    setPosts={setPosts}
                    disabled={sendingLoadingCommentId}
                  />
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ainda não há comentários — que tal começar? 😊
                  </p>
                </div>
              )}
            </div>

            {/* FORMULÁRIO DE COMENTÁRIO (FIXO NO RODAPÉ DO PAINEL) */}
            <div className="border-t bg-white p-4 dark:border-gray-800 dark:bg-[#1a1a1a]">
              <form
                className="relative flex w-full items-center gap-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault()
                }}
                onSubmit={(e) => e.preventDefault()}
              >
                {activeInputId === idInput &&
                  clickedMention &&
                  sugestoes.length > 0 && (
                    <div className="absolute bottom-full left-0 mb-2 w-full">
                      <ListMarcation
                        setClickedMention={setClickedMention}
                        sugestoes={sugestoes}
                        setNovoComentario={setNovoComentario}
                        onUserClick={(user) => {
                          setUsuariosSelecionados((prev) =>
                            prev.find((u) => u.id === user.id)
                              ? prev
                              : [...prev, user]
                          )
                        }}
                        inputRef={inputRef}
                      />
                    </div>
                  )}

                <div className="flex-1">
                  <MentionInput
                    value={novoComentario}
                    onChange={(e) => {
                      setNovoComentario(e.target.value)
                      comentarios.handleChange(e)
                      getMatches(e.target.value, idInput, setClickedMention)
                      setActiveInputId(idInput)
                    }}
                    disabled={isLoadingComment}
                    error={comentarios.error}
                    usuariosSelecionados={usuariosSelecionados}
                    ref={inputRef}
                  />
                </div>

                <Button
                  type="submit"
                  size="icon"
                  onClick={() => adicionarComentario(postAtualizado.id)}
                  disabled={
                    !novoComentario.trim() ||
                    !!comentarios.error ||
                    isLoadingComment
                  }
                  className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                >
                  {isLoadingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {comentarios.error && (
                <p className="mt-2 text-xs text-rose-500">
                  Uau! Você escreveu demais. Envie para continuar.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostComponentDialog
