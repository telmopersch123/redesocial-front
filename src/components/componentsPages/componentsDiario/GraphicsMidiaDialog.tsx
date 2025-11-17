import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import HumorMedioComponent from './AverageMoodComponent'
export function GraphicsMidiaDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <HumorMedioComponent />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Grafico</DialogTitle>
            <DialogDescription>
              aqui sera exibido um grafico de medias mensal/quinzenal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">AREA DO GRAFICO</div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
