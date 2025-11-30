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

const ActivityComponent = ({
  savedVideos,
  likedVideos,
  setDialogOpen,
}: ActivityComponentProps) => {
  const [tab, setTab] = useState<'saved' | 'liked' | 'comment' | null>(null)

  if (!tab) {
    setTab('saved')
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-center gap-3 border-b pb-4">
        <Button
          variant="ghost"
          className={`flex items-center gap-2 ${tab === 'saved' ? 'bg-blue-400 text-white' : ''}`}
          onClick={() => setTab('saved')}
        >
          <Bookmark className="h-5 w-5" />
          <span className="hidden sm:block">Salvos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex items-center gap-2 ${tab === 'liked' ? 'bg-red-600 text-white' : ''}`}
          onClick={() => setTab('liked')}
        >
          <Heart className="h-5 w-5" />
          <span className="hidden sm:block">Curtidos</span>
        </Button>
        <Button
          variant={`${tab === 'comment' ? 'default' : 'ghost'}`}
          className="flex items-center gap-2"
          onClick={() => setTab('comment')}
        >
          <MessageCircleMore className="h-5 w-5" />
          <span className="hidden sm:block">Comentários</span>
        </Button>
      </div>

      {!tab && (
        <SavedVideosList
          setDialogOpen={setDialogOpen}
          savedVideos={savedVideos}
        />
      )}

      {tab === 'saved' && (
        <SavedVideosList
          setDialogOpen={setDialogOpen}
          savedVideos={savedVideos}
        />
      )}
      {tab === 'liked' && (
        <LikedVideosList
          setDialogOpen={setDialogOpen}
          likedVideos={likedVideos}
        />
      )}

      {tab === 'comment' && (
        <CommentedVideosList
          setDialogOpen={setDialogOpen}
          likedVideos={likedVideos}
        />
      )}
    </div>
  )
}

export default ActivityComponent

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
        <VideoCard setDialogOpen={setDialogOpen} key={video.id} video={video} />
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
    return <EmptyState message="Você ainda não curtiu nenhum vídeo ainda." />

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likedVideos.map((video) => (
        <VideoCard setDialogOpen={setDialogOpen} key={video.id} video={video} />
      ))}
    </div>
  )
}

const CommentedVideosList = ({
  likedVideos,
  setDialogOpen,
}: {
  likedVideos: Video[]
  setDialogOpen: (open: boolean) => void
}) => {
  if (!likedVideos.length)
    return (
      <EmptyState message="Você ainda não comentou em nenhum vídeo ainda." />
    )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {likedVideos.map((video) => (
        <VideoCard setDialogOpen={setDialogOpen} key={video.id} video={video} />
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
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="h-28 w-full overflow-hidden sm:h-32">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="line-clamp-2 p-2 text-xs font-medium text-gray-700">
        {video.title}
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex w-full items-center justify-center py-10 text-sm text-gray-500">
    {message}
  </div>
)
