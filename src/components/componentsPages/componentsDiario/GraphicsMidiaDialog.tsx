import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/getMe'
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
  const { user } = useAuth()

  const [selectedWidth, setSelectedWidth] = useState(400)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [datesUserGraphics, setDatesUserGraphics] = useState<
    dateUserGrapchis[]
  >([])
  const [isLoadinsdateUserGraphics, setIsLoadingsdateUserGraphics] =
    useState(false)
  const [isLoadingInitialUserGraphics, setIsLoadingInitialUserGraphics] =
    useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    async function fetchDatesUserGraphics() {
      let lastDates: string | number = timeRange.replace(/\D/g, '')
      setIsLoadingsdateUserGraphics(true)
      if (lastDates === '1') lastDates = '365'
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
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingsdateUserGraphics(false)
        setIsLoadingInitialUserGraphics(false)
      }
    }
    fetchDatesUserGraphics()
  }, [open, timeRange])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogTrigger asChild>
            <HumorMedioComponent
              datesUserGraphics={datesUserGraphics}
              isLoadingInitialUserGraphics={isLoadingInitialUserGraphics}
            />
          </DialogTrigger>
          <DialogContent
            style={{
              width: isMobile
                ? '95%'
                : selectedWidth === 98 || selectedWidth === 80
                  ? `${selectedWidth}%`
                  : `${selectedWidth}px`,
            }}
            className={`flex h-auto flex-col overflow-hidden`}
          >
            {datesUserGraphics.length >= 3 && !isLoadinsdateUserGraphics ? (
              <>
                <DialogHeader>
                  <DialogTitle>Grafico diario</DialogTitle>
                  <DialogDescription>
                    Selecione o intervalo de tempo para visualizar o gráfico
                  </DialogDescription>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-auto">
                  {datesUserGraphics.length > 0 &&
                  !isLoadinsdateUserGraphics ? (
                    <ChartDailyInteractive
                      setTimeRange={setTimeRange}
                      timeRange={timeRange}
                      setSelectedWidth={setSelectedWidth}
                      datesUserGraphics={datesUserGraphics}
                    />
                  ) : (
                    <>
                      {!isLoadinsdateUserGraphics && (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-lg font-medium text-purple-600">
                              Nenhum gráfico disponível
                            </p>
                            <p className="text-sm text-gray-500">
                              Não há dados para exibir.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {!isLoadinsdateUserGraphics && user && (
                  <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 text-center">
                    <span className="text-5xl">📓</span>
                    <p className="text-base font-medium text-zinc-200">
                      Ainda sem dados suficientes
                    </p>
                    <p className="max-w-[240px] text-sm text-zinc-500">
                      Registre pelo menos 3 dias no diário para visualizar seu
                      gráfico de humor
                    </p>
                  </div>
                )}
                {isLoadinsdateUserGraphics && user && (
                  <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 overflow-hidden text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}
