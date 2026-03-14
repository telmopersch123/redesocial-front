import { useEffect, useState } from 'react'
import type { dateUserGrapchis } from '../../../types'
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
  const [selectedWidth, setSelectedWidth] = useState(400)
  const [datesUserGraphics, setDatesUserGraphics] = useState<
    dateUserGrapchis[]
  >([])
  const [timeRange, setTimeRange] = useState('7d')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    async function fetchDatesUserGraphics() {
      let lastDates: string | number = timeRange.replace(/\D/g, '')
      if (lastDates === '1') lastDates = '365'
      console.log(lastDates)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/getDatesGraphcis/${lastDates}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )
        if (!res.ok) {
          throw new Error('Erro ao buscar as datas')
        }
        const data = await res.json()
        setDatesUserGraphics(data)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDatesUserGraphics()
  }, [open, timeRange])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <HumorMedioComponent />
        </DialogTrigger>
        <DialogContent
          style={{
            width: selectedWidth === 98 ? '98%' : ` ${selectedWidth}px`,
          }}
          className={`flex h-auto flex-col overflow-hidden`}
        >
          <DialogHeader>
            <DialogTitle>Grafico diario</DialogTitle>
            <DialogDescription>
              Selecione o intervalo de tempo para visualizar o gráfico
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto">
            <ChartDailyInteractive
              setTimeRange={setTimeRange}
              timeRange={timeRange}
              setSelectedWidth={setSelectedWidth}
              datesUserGraphics={datesUserGraphics}
            />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
