import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Loader2, Play, Trash2, Users } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { VideoContext, type VideoState } from '../../../context/VideoContext'
import type { Post } from '../../../types'

import { useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/getMe'
import type { ExtendedPost } from '../../../pages/community/PostsArchived'
import { MessagePerson } from '../../../utils/components/MessagePerson'
import { UserAvatar } from '../../../utils/components/UserAvatar'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import ActionsPost from './components/ActionsPostComponent'
import { ModalConfirmArchivePost } from './components/ModalConfirmArqPost'
import { ModalConfirmDelPost } from './components/ModalConfirmDelPost'
import { PostAdminActions } from './components/PostAdminActions'

interface PostCardProps {
  posts: Post[]
  valuePost: Post
  setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>
  communityShowButtonArchived?: boolean
  postsArchived?: boolean
}

const CardsPostComponent = ({
  posts,
  valuePost,
  setPosts,
  communityShowButtonArchived,
  postsArchived,
}: PostCardProps) => {
  const [novoComentario, setNovoComentario] = useState('')
  const { isModerator, isAdmin } = useAuth()
  const params = useLocation()
  const validatedModerator = isModerator(valuePost.communityId ?? 0)
  const validatedAdmin = isAdmin(valuePost.communityId ?? 0)
  const { videoState, setVideoState } = useContext(VideoContext)
  const [isLoadingRemovePost, setIsLoadingRemovePost] = useState(false)
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

  const removePost = async (postId: number) => {
    setIsLoadingRemovePost(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/removePost/${postId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error()

      setPosts((prev) => prev.filter((post) => post.id !== valuePost.id))
      MessagePerson('Post excluido com sucesso', null, 'success')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingRemovePost(false)
    }
  }

  const pauseVideo = () => {
    if (!videoRef.current) return

    const currentTime = videoRef.current.currentTime

    videoRef.current.pause()

    setVideoState((prev) => ({
      ...prev,
      [valuePost.id]: {
        currentTime,
        playing: false,
      },
    }))
  }

  useEffect(() => {
    const state = videoState[valuePost.id]
    if (!videoRef.current || !state) return

    if (Number.isFinite(state.currentTime)) {
      videoRef.current.currentTime = state.currentTime
    }
  }, [videoState, valuePost.id])

  return (
    <Card
      key={valuePost.id}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-[#1b1b1b]"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-4 pb-3 pt-4">
        <div className="flex w-full items-center gap-3">
          {valuePost.user.avatar ? (
            <UserAvatar
              url={valuePost.user.avatar || undefined}
              name={valuePost.user.name}
              className="!h-10 !w-10 shadow-2xl ring-4 ring-white dark:ring-zinc-900 sm:h-32 sm:w-32"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              <Users className="h-5 w-5" />
            </div>
          )}

          <div className="w-full">
            <CardTitle className="flex gap-2 text-base text-gray-800 dark:text-gray-200">
              <div className="flex w-full items-center justify-between gap-2">
                <div>
                  {valuePost.communityId &&
                    params.pathname.split('/').pop()?.replaceAll('-', ' ') !==
                      valuePost.communityName &&
                    params.pathname.split('/').pop()?.replaceAll('-', ' ') !==
                      'archived' && (
                      <TooltipComponent
                        Tag={
                          <span className="font-semibold text-purple-600 hover:underline dark:text-purple-400">
                            {valuePost.communityName}{' '}
                            <span className="mr-[2px]">•</span>
                          </span>
                        }
                        description="Comunidade do Tess"
                      />
                    )}

                  <span className="font-bold">@{valuePost.user.name_at}</span>
                </div>
                {valuePost.user.isFriend && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/50 text-white/80"
                  >
                    Amigo
                  </Badge>
                )}
              </div>
              {valuePost.anonymous &&
                Number(valuePost.user.id) === Number(user?.id) && (
                  <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    Anônimo
                  </span>
                )}
            </CardTitle>

            <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {isNaN(new Date(valuePost.createdAt).getTime())
                ? 'data inválida'
                : formatDistanceToNow(new Date(valuePost.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
            </div>
          </div>
        </div>
        {user?.id === valuePost.user.id && !valuePost.communityId && (
          <div className="flex items-center">
            <TooltipComponent
              description="Excluir Permanentemente"
              Tag={
                <Button
                  variant="outline"
                  className="group relative h-10 w-10 overflow-hidden border-red-200/50 bg-white transition-all duration-300 ease-out hover:w-32 hover:border-red-600 hover:bg-red-600 dark:border-red-900/30 dark:bg-zinc-900"
                  onClick={() => {
                    removePost(valuePost.id)
                  }}
                >
                  <div className="absolute inset-0 z-0 translate-y-full bg-gradient-to-t from-red-800 to-red-800 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                  <div className="relative z-10 flex w-full items-center justify-center font-bold uppercase tracking-tighter">
                    {isLoadingRemovePost ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <div className="flex items-center group-hover:gap-2">
                        <Trash2 className="h-4 w-4 text-red-600 transition-colors duration-300 group-hover:text-white" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] text-white transition-all duration-300 group-hover:max-w-xs">
                          Excluir Post
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-white/10" />
                </Button>
              }
            />
          </div>
        )}
        {communityShowButtonArchived && validatedModerator && !postsArchived ? (
          <ModalConfirmArchivePost
            postId={valuePost.id}
            nameUser={valuePost.user.name_at}
            communityId={valuePost.communityId ?? 0}
          />
        ) : validatedAdmin && communityShowButtonArchived && !postsArchived ? (
          <ModalConfirmDelPost
            nameUser={valuePost.user.name_at}
            postId={valuePost.id}
            communityId={valuePost.communityId ?? 0}
          />
        ) : (
          communityShowButtonArchived &&
          postsArchived &&
          validatedAdmin && (
            <PostAdminActions
              postId={valuePost.id}
              nameUser={valuePost.user.name_at}
              communityId={valuePost.communityId ?? 0}
            />
          )
        )}
      </CardHeader>

      <CardContent className="pb-0 pt-0">
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {valuePost.description}
        </p>
        <div>
          {valuePost.postTags?.map(
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

        {valuePost.mediaUrl && (
          <div className="relative -mx-6 mt-3 h-[500px] overflow-hidden rounded-b-xl bg-gray-100 dark:bg-[#2a2a2a]">
            {valuePost.mediaType === 'video' ? (
              <video
                ref={videoRef}
                src={valuePost.mediaUrl}
                onPlay={() =>
                  setVideoState((prev: VideoState) => ({
                    ...prev,
                    [valuePost.id]: {
                      ...prev[valuePost.id],
                      playing: true,
                    },
                  }))
                }
                onPause={() =>
                  setVideoState((prev: VideoState) => ({
                    ...prev,
                    [valuePost.id]: {
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
                src={valuePost.mediaUrl}
                alt={valuePost.description}
                className="h-full w-full object-cover"
              />
            )}
            {!videoState[valuePost.id]?.playing &&
              valuePost.mediaType === 'video' && (
                <div
                  onClick={() => {
                    if (!videoRef.current) return

                    videoRef.current.play()
                    setVideoState((prev) => ({
                      ...prev,
                      [valuePost.id]: {
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
        )}

        <ActionsPost
          valuePost={valuePost}
          novoComentario={novoComentario}
          setNovoComentario={setNovoComentario}
          setPosts={setPosts}
          posts={posts}
          pauseVideo={pauseVideo}
        />
      </CardContent>
    </Card>
  )
}

export default CardsPostComponent
