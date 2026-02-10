import { MessageCircle, Play, Send, X } from 'lucide-react'
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
import { VideoContext, type VideoState } from '../../../context/VideoContext'
import { createComment } from '../../../services/authService'

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
  const { openActionPosts, setOpenActionPosts } = useCriarPostDialog()
  const [clickedMention, setClickedMention] = useState(false)
  const idInput = 'comment-' + postAtualizado.id
  const openMarcation = useState(false)
  const comentarios = useLimitForms(5000)
  const pathname = useLocation().pathname
  const videoRef = useRef<HTMLVideoElement>(null)
  const [respondendoA, setRespondendoA] = useState<number | null>(null)
  const [textoResposta, setTextoResposta] = useState('')
  const { videoState, setVideoState } = useContext(VideoContext)
  const { id } = useParams()
  const { setSelectedPost } = usePosts()

  const adicionarComentario = async (postId: number) => {
    if (!novoComentario.trim()) return

    const mentionedUserIds = sugestoes
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
      const newComment = await response.json()
      setPosts(
        posts.map((p: Post) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments ?? []), newComment.comment],
            }
          }
          return p
        }) as ExtendedPost[]
      )
      setSelectedPost(postAtualizado)
      setClickedMention(false)
      setNovoComentario('')
    } catch (err) {
      console.log(err)
    }
  }

  const adicionarResposta = async (
    comentarioId: number,
    respondendoPara?: string
  ) => {
    if (!textoResposta.trim()) return

    const mentionedUserIds = sugestoes
      .filter((u) => novoComentario.includes(`@${u.name_at}`))
      .map((u) => u.id)

    try {
      const response = await createComment(
        postAtualizado.id,
        textoResposta,
        comentarioId,
        respondendoPara,
        mentionedUserIds
      )
      const { comment: novaResposta } = await response.json()

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
      setTextoResposta('')
    } catch (err) {
      console.log(err)
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
        <DialogTrigger
          className={`rounded-md px-4 py-2 text-white ${pathname.includes(`perfil/${id}/config`) || openActionPosts ? 'hidden' : ''}`}
          asChild
        >
          <Button
            onClick={() => {
              if (pauseVideo) {
                pauseVideo()
              }
            }}
            variant="ghost"
            size="sm"
            className={`flex ${typePost === 'NotificaçãoDialog' || pathname.includes(`perfil/${id}/config`) || openActionPosts ? 'hidden' : ''} items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400`}
          >
            <MessageCircle />
            {(postAtualizado.comments ?? []).length}
          </Button>
        </DialogTrigger>

        <DialogContent className="!z-[70] flex h-[95vh] flex-col -space-y-10 overflow-hidden rounded-xl bg-white p-0 dark:bg-[#1a1a1a] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] [&>button]:hidden">
          <DialogHeader className="flex flex-col bg-white p-4 dark:bg-[#1a1a1a]">
            <div className="absolute right-5 top-2 flex items-center justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-600 transition-all duration-200 hover:bg-red-100 hover:text-red-600 active:scale-90 dark:text-gray-400 dark:hover:bg-red-900/40"
                onClick={() => {
                  setOpenActionPosts(false)
                  onOpenChange(false)
                  setOpenReplies({})
                  pauseDialogVideo()
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
                <p aria-hidden>{postAtualizado.user.avatar}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {postAtualizado.user.name_at}
              </p>
            </div>

            <div className="relative w-full">
              <div className="max-w-full overflow-y-auto break-all pr-2">
                <DialogTitle className="text-md h-[100px] p-0 font-medium leading-relaxed text-gray-900 dark:text-gray-100 2xl:h-[120px]">
                  {postAtualizado.description}
                </DialogTitle>
                <div className="pointer-events-none absolute -bottom-2 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent dark:from-[#1a1a1a] dark:to-transparent" />
              </div>
            </div>

            <Separator className="m-0 border-t border-gray-200 dark:border-gray-700" />
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col justify-between p-4 2xl:flex-row">
            {postAtualizado.mediaType && (
              <div className="z-10 flex flex-col md:h-1/2 2xl:h-auto 2xl:w-1/2">
                <div
                  className={`relative flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/10 dark:to-indigo-900/10 md:w-auto 2xl:h-full ${(pathname.includes(`perfil/config`) || openActionPosts) && open === true ? 'flex-col' : 'flex-row'}`}
                >
                  <div>
                    <div className="p-1">
                      {postAtualizado.mediaType === 'video' ? (
                        <video
                          ref={videoRef}
                          src={postAtualizado.mediaUrl}
                          onLoadedMetadata={() => {
                            const state = videoState[postAtualizado.id]
                            if (!state || !videoRef.current) return

                            if (Number.isFinite(state.currentTime)) {
                              videoRef.current.currentTime = state.currentTime
                            }
                          }}
                          onPlay={() =>
                            setVideoState((prev: VideoState) => ({
                              ...prev,
                              [postAtualizado.id]: {
                                ...prev[postAtualizado.id],
                                playing: true,
                              },
                            }))
                          }
                          onPause={() =>
                            setVideoState((prev: VideoState) => ({
                              ...prev,
                              [postAtualizado.id]: {
                                currentTime: videoRef.current?.currentTime ?? 0,
                                playing: false,
                              },
                            }))
                          }
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={postAtualizado.mediaUrl}
                          alt={postAtualizado.communityName}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {!videoState[postAtualizado.id]?.playing &&
                      postAtualizado.mediaType === 'video' && (
                        <div
                          onClick={() => {
                            if (!videoRef.current) return

                            videoRef.current.play()
                            setVideoState((prev) => ({
                              ...prev,
                              [postAtualizado.id]: {
                                currentTime: videoRef.current?.currentTime ?? 0,
                                playing: true,
                              },
                            }))
                          }}
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 dark:bg-black/50"
                        >
                          <div className="rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 p-4 shadow-xl backdrop-blur-sm transition-transform hover:scale-110">
                            <Play className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            <div>
              {(pathname.includes(`perfil/config`) ||
                (openActionPosts && open === true)) && (
                <ActionsPost
                  valuePost={postAtualizado}
                  novoComentario={novoComentario}
                  setNovoComentario={setNovoComentario}
                  setPosts={setPosts}
                  posts={posts}
                  pauseVideo={pauseVideo as () => void}
                  validated={
                    (pathname.includes(`perfil/config`) || openActionPosts) &&
                    open === true
                  }
                />
              )}
            </div>

            <div
              ref={scrollRef}
              className={`flex h-full flex-col overflow-y-auto bg-white dark:bg-[#1a1a1a] 2xl:max-h-full ${
                postAtualizado.mediaType == null ||
                postAtualizado.mediaType === undefined
                  ? '2xl:w-full'
                  : 'md:max-h-[48vh] 2xl:w-1/2'
              }`}
            >
              <div className="relative h-full md:h-2/3 md:max-h-full 2xl:h-full">
                <div className="space-y-4 pb-10 pt-8 2xl:pb-10 2xl:pt-0">
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
                      />
                    ))
                  ) : (
                    <>
                      <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Ainda não há comentários — que tal começar a conversa?
                          😊
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sua voz faz a comunidade crescer 💬✨
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`!fixed !bottom-0 right-0 mt-3 w-full rounded-xl bg-white p-2 shadow-lg dark:bg-[#1a1a1a] ${
                    postAtualizado.mediaType == null ||
                    postAtualizado.mediaType === undefined
                      ? '2xl:w-full'
                      : '2xl:w-1/2'
                  }`}
                >
                  <form
                    className="flex w-full items-center gap-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {activeInputId === idInput &&
                      clickedMention &&
                      sugestoes.length > 0 &&
                      openMarcation && (
                        <div className="absolute -top-1">
                          <ListMarcation
                            setClickedMention={setClickedMention}
                            sugestoes={sugestoes}
                            setNovoComentario={setNovoComentario}
                          />
                        </div>
                      )}

                    <MentionInput
                      value={novoComentario}
                      onChange={(e) => {
                        setNovoComentario(e.target.value)
                        comentarios.handleChange(e)
                        getMatches(e.target.value, idInput, setClickedMention)
                        setActiveInputId(idInput)
                      }}
                      onEnter={() => {
                        setActiveInputId(null)
                        adicionarComentario(postAtualizado.id)
                      }}
                      error={comentarios.error}
                    />

                    <Button
                      type="submit"
                      size="icon"
                      onClick={() => {
                        adicionarComentario(postAtualizado.id)
                        setClickedMention(false)
                      }}
                      disabled={!novoComentario.trim() || !!comentarios.error}
                      className="rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white hover:shadow-md disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>

                  {comentarios.error && (
                    <p className="mt-2 text-center text-sm text-rose-600 dark:text-rose-400">
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
