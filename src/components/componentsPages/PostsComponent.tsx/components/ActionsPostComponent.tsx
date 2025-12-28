import { Bookmark, Heart, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/getMe'
import type { Post } from '../../../../types'
import { TooltipComponent } from '../../../globalcomponents/tooltipComponent'
import { Button } from '../../../ui/button'
import DialogReportPost from '../DialogReportPost'
import PostComponentDialog from '../PostComponentDialog'
import { handleLike, handleSalvar } from './actionsPosts'

interface ActionsPostProps {
  valuePost: Post
  novoComentario: string
  setNovoComentario: React.Dispatch<React.SetStateAction<string>>
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  posts: Post[]
  dialogOpen?: boolean
  validated?: boolean
}

const ActionsPost = ({
  valuePost,
  novoComentario,
  setNovoComentario,
  setPosts,
  posts,
  dialogOpen,
  validated,
}: ActionsPostProps) => {
  const [openDialog, setOpenDialog] = useState(false)
  const { user: authUser } = useAuth()
  useEffect(() => {
    if (dialogOpen) {
      setOpenDialog(true)
    }
  }, [dialogOpen])

  const handleShare = async () => {
    const shareData = {
      title: 'Post da Comunidade',
      text: 'Dá uma olhada neste post!',
      url: `${window.location.origin}/post/${valuePost.id}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log('Compartilhado com sucesso!')
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert(
        'Seu navegador não suporta compartilhamento. O link do post foi copiado!'
      )
    }
  }

  console.log(valuePost.user.id)
  return (
    <>
      <div className="relative">
        {!validated && (
          <div className="pointer-events-auto absolute -right-0.5 z-20 h-full w-12 bg-gradient-to-r from-transparent via-white/20 to-white dark:bg-gradient-to-r dark:from-transparent dark:via-[#1a1a1a]/20 dark:to-[#1a1a1a] dm:hidden" />
        )}

        <div
          className={` ${
            validated
              ? 'my-3 grid grid-cols-2 gap-1 border-t border-gray-200 px-2 py-2 dark:border-gray-700 om:flex om:flex-wrap om:items-center om:justify-between'
              : 'my-3 flex items-center justify-between overflow-x-auto border-t border-gray-200 px-2 py-2 pr-10 dark:border-gray-700 dm:pr-0'
          }`}
        >
          {/* LEFT BLOCK */}
          <div
            className={`${
              validated
                ? 'flex flex-col items-center gap-4 rounded-lg bg-white/40 py-2 shadow-sm backdrop-blur-md dark:bg-white/10 dark:shadow-black/30 om:flex-row om:bg-transparent om:py-0 om:shadow-none'
                : 'flex items-center gap-2 om:gap-4'
            }`}
          >
            <Button
              onClick={() => handleLike({ id: valuePost.id, setPosts, posts })}
              className={`flex items-center gap-1.5 !bg-transparent text-sm font-medium transition-all ${
                valuePost.likes % 2 === 1
                  ? 'text-red-500'
                  : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  valuePost.likes % 2 === 1 ? 'fill-current' : ''
                }`}
              />
              {valuePost.likes}
            </Button>

            <PostComponentDialog
              valuePost={valuePost}
              novoComentario={novoComentario}
              setNovoComentario={setNovoComentario}
              setPosts={setPosts}
              posts={posts}
              open={openDialog}
              onOpenChange={setOpenDialog}
            />

            <Button
              variant="ghost"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Share2 className="h-5 w-5" />
              Compartilhar
            </Button>
          </div>

          {/* RIGHT BLOCK */}
          <div
            className={`${
              validated
                ? 'flex flex-col items-center gap-4 rounded-lg bg-white/40 py-2 shadow-sm backdrop-blur-md dark:bg-white/10 dark:shadow-black/20 om:flex-row om:bg-transparent om:py-0 om:shadow-none'
                : 'flex w-full items-center justify-end gap-4'
            }`}
          >
            {valuePost.user.id !== authUser?.id && <DialogReportPost />}

            <TooltipComponent
              description={valuePost.salvo ? 'Desmarcar Post' : 'Salvar Post'}
            >
              <button
                onClick={() =>
                  handleSalvar({ id: valuePost.id, setPosts, posts })
                }
                className={`rounded-md p-2 transition-all duration-300 ${
                  valuePost.salvo
                    ? 'bg-purple-500 text-white dark:bg-purple-600'
                    : 'bg-transparent text-purple-600 dark:text-purple-400'
                }`}
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </TooltipComponent>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActionsPost
