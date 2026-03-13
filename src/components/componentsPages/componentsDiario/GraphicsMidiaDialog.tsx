import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import HumorMedioComponent from './AverageMoodComponent'
import { ChartDailyInteractive } from './Graphics'
export function GraphicsMidiaDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <HumorMedioComponent />
        </DialogTrigger>
        <DialogContent className="w-[98%]">
          <DialogHeader>
            <DialogTitle>Grafico</DialogTitle>
            <DialogDescription>
              aqui sera exibido um grafico de medias mensal/quinzenal
            </DialogDescription>
          </DialogHeader>
          <ChartDailyInteractive />
        </DialogContent>
      </form>
    </Dialog>
  )
}
