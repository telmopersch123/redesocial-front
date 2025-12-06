import { Bookmark, Heart, MessageCircleMore } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../ui/button'

interface Video {
  id: string
  title: string
  thumbnail: string
}

interface ActivityComponentProps {
  savedVideos: Video[]
  likedVideos: Video[]
  setDialogOpen: (open: boolean) => void
}

export const ActivityComponent = ({
  savedVideos,
  likedVideos,
  setDialogOpen,
}: ActivityComponentProps) => {
  const [tab, setTab] = useState<'saved' | 'liked' | 'comment'>('saved')

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'saved'
              ? 'bg-purple-600 text-white shadow-md dark:bg-purple-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => setTab('saved')}
        >
          <Bookmark className="h-5 w-5" />
          <span className="hidden sm:block">Salvos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'liked'
              ? 'bg-red-600 text-white shadow-md dark:bg-red-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => setTab('liked')}
        >
          <Heart className="h-5 w-5" />
          <span className="hidden sm:block">Curtidos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            tab === 'comment'
              ? 'bg-purple-600 text-white shadow-md dark:bg-purple-600'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
          onClick={() => setTab('comment')}
        >
          <MessageCircleMore className="h-5 w-5" />
          <span className="hidden sm:block">Comentários</span>
        </Button>
      </div>

      {/* Conteúdo das abas */}
      {tab === 'saved' && (
        <SavedVideosList
          savedVideos={savedVideos}
          setDialogOpen={setDialogOpen}
        />
      )}
      {tab === 'liked' && (
        <LikedVideosList
          likedVideos={likedVideos}
          setDialogOpen={setDialogOpen}
        />
      )}
      {tab === 'comment' && (
        <CommentedVideosList
          videos={likedVideos}
          setDialogOpen={setDialogOpen}
        />
      )}
    </div>
  )
}

const SavedVideosList = ({
  savedVideos,
  setDialogOpen,
}: {
  savedVideos: Video[]
  setDialogOpen: (open: boolean) => void
}) => {
  if (!savedVideos.length)
    return <EmptyState message="Nenhum vídeo salvo ainda." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {savedVideos.map((video) => (
        <VideoCard key={video.id} video={video} setDialogOpen={setDialogOpen} />
      ))}
    </div>
  )
}

const LikedVideosList = ({
  likedVideos,
  setDialogOpen,
}: {
  likedVideos: Video[]
  setDialogOpen: (open: boolean) => void
}) => {
  if (!likedVideos.length)
    return <EmptyState message="Você ainda não curtiu nenhum vídeo." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likedVideos.map((video) => (
        <VideoCard key={video.id} video={video} setDialogOpen={setDialogOpen} />
      ))}
    </div>
  )
}

const CommentedVideosList = ({
  videos,
  setDialogOpen,
}: {
  videos: Video[]
  setDialogOpen: (open: boolean) => void
}) => {
  if (!videos.length)
    return <EmptyState message="Você ainda não comentou em nenhum vídeo." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} setDialogOpen={setDialogOpen} />
      ))}
    </div>
  )
}

const VideoCard = ({
  video,
  setDialogOpen,
}: {
  video: Video
  setDialogOpen: (open: boolean) => void
}) => {
  return (
    <div
      onClick={() => setDialogOpen(true)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="h-28 w-full overflow-hidden sm:h-32">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="line-clamp-2 p-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {video.title}
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex w-full items-center justify-center py-16 text-center">
    <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
  </div>
)
