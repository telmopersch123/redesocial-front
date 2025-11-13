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
      <DialogContent className="fixed flex items-center justify-center border-none bg-transparent p-0 shadow-none [&>button]:hidden">
        <div className="m-1 flex items-center justify-center">
          <img
            src={file!}
            alt="Fullscreen"
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
          <Button
            onClick={() => setIsFullscreen(false)}
            className="bg-linear-purple absolute -top-10 left-0 right-0 m-auto w-[90%] rounded-md p-2 shadow-lg hover:scale-110 sm:w-[83%]"
          >
            <CircleX className="h-8 w-10 text-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FullscreenDialog
