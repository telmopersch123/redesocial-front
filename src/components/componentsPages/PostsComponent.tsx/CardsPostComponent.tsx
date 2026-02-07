import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Play, Users } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { VideoContext, type VideoState } from '../../../context/VideoContext'
import type { Post } from '../../../types'

import { useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/getMe'
import type { ExtendedPost } from '../../../pages/community/PostsArchived'
import { UserAvatar } from '../../../utils/components/UserAvatar'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
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
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

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
        <div className="flex items-center gap-3">
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

          <div>
            <CardTitle className="flex gap-2 text-base text-gray-800 dark:text-gray-200">
              {valuePost.communityId &&
                params.pathname.split('/').pop()?.replaceAll('-', ' ') !==
                  valuePost.communityName &&
                params.pathname.split('/').pop()?.replaceAll('-', ' ') !==
                  'archived' && (
                  <TooltipComponent
                    Tag={
                      <span className="font-semibold text-purple-600 hover:underline dark:text-purple-400">
                        {valuePost.communityName} •
                      </span>
                    }
                    description="Comunidade do Tess"
                  />
                )}

              <span className="font-bold">@{valuePost.user.name_at}</span>

              {valuePost.anonymous &&
                valuePost.user.id === Number(user?.id) && (
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

              {/* {valuePost.friend && (
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Amigo
                </Badge>
              )} */}
            </div>
          </div>
        </div>
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
