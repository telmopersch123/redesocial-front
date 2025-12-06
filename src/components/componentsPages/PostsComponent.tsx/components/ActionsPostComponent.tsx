import { Bookmark, Heart, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (dialogOpen) {
      setOpenDialog(true)
    }
  }, [dialogOpen])

  return (
    <>
      <div className="relative">
        {!validated && (
          <div className="pointer-events-auto absolute -right-2 z-50 h-full w-8 bg-gradient-to-tr from-white via-white/80 to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a]/80 dark:to-transparent dm:hidden" />
        )}
        <div
          className={` ${
            validated
              ? 'my-3 grid grid-cols-2 gap-1 border-t border-gray-100 px-2 pt-3 dark:border-gray-700 om:flex om:flex-wrap om:items-center om:justify-between'
              : 'my-3 flex items-center justify-between overflow-x-auto border-t border-gray-100 px-2 pr-10 pt-3 dark:border-gray-700 dm:pr-0'
          }`}
        >
          <div
            className={` ${
              validated
                ? 'flex flex-col items-center gap-4 bg-white/5 py-2 shadow-md dark:bg-white/5 dark:shadow-black/20 om:flex-row om:bg-transparent om:py-0 om:shadow-none'
                : 'flex items-center gap-0 om:gap-4'
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
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-all hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Share2 className="h-5 w-5" />
              Compartilhar
            </Button>
          </div>

          <div
            className={` ${
              validated
                ? 'flex flex-col items-center gap-4 bg-white/5 py-2 shadow-md dark:bg-white/5 dark:shadow-black/10 om:flex-row om:bg-transparent om:py-0 om:shadow-none'
                : 'flex w-full items-center justify-end gap-4'
            }`}
          >
            <DialogReportPost />

            <TooltipComponent
              description={valuePost.salvo ? 'Desmarcar Post' : 'Salvar Post'}
            >
              <Button
                onClick={() =>
                  handleSalvar({ id: valuePost.id, setPosts, posts })
                }
                className={`transition-all ${
                  valuePost.salvo
                    ? 'bg-purple-400 text-white hover:!bg-transparent hover:text-purple-400 dark:bg-purple-500 dark:hover:bg-transparent dark:hover:text-purple-300'
                    : '!bg-transparent text-purple-600 hover:!bg-purple-400 hover:text-white dark:text-purple-400 dark:hover:bg-purple-500'
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </TooltipComponent>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActionsPost
