import { CircleX } from 'lucide-react'
import { Button } from '../../ui/button'
import { Dialog, DialogContent } from '../../ui/dialog'

interface DialogFullscreenProps {
  isFullscreen: boolean
  setIsFullscreen: (isFullscreen: boolean) => void
  file: string | null
}

const FullscreenDialog = ({
  isFullscreen,
  setIsFullscreen,
  file,
}: DialogFullscreenProps) => {
  return (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className="fixed flex items-center justify-center border-none bg-transparent p-0 shadow-none [&>button]:hidden dark:[&>button]:hidden">
        <div className="m-1 flex items-center justify-center">
          <img
            src={file!}
            alt="Fullscreen"
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl dark:shadow-black/60"
          />
          <Button
            onClick={() => setIsFullscreen(false)}
            className="bg-linear-purple absolute -top-10 left-0 right-0 m-auto w-[50%] rounded-md p-2 shadow-lg hover:scale-110 dark:bg-gradient-to-r dark:from-[#2a2a2a] dark:via-[#1f1f1f] dark:to-[#1a1a1a] dark:shadow-black/70 sm:w-[18%]"
          >
            <CircleX className="h-8 w-10 text-white dark:text-zinc-200" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FullscreenDialog
