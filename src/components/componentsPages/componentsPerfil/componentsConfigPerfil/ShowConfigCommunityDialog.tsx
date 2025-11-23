import ConfigCommunity from '../../../../pages/community/ConfigCommunity'
import { Button } from '../../../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../../../ui/dialog'

const ShowCommunityDialog = () => {
  return (
    <>
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button className="rounded-lg bg-accent px-3 py-1 text-sm text-muted-foreground transition-all hover:bg-accent/70">
            Gerenciar
          </Button>
        </DialogTrigger>

        <DialogContent
          onWheel={(e) => e.stopPropagation()}
          className="h-[calc(100vh-4rem)] w-fit overflow-y-auto rounded-2xl p-4"
        >
          {/* Conteúdo real */}

          <ConfigCommunity methodW_fullscreen={true} showButtonReturn={true} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShowCommunityDialog
