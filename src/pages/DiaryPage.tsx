import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { CalendarHeart, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import loading from '../assets/animations/loading.json'
import { CalendaryComponent } from '../components/componentsPages/componentsDiario/CalendaryComponent'
import FormDailyComponent from '../components/componentsPages/componentsDiario/FormDailyComponent'
import { GraphicsMidiaDialog } from '../components/componentsPages/componentsDiario/GraphicsMidiaDialog'
import type { dailyBackType } from '../types'

interface PropsgetDaily {
  setValidedDaily: React.Dispatch<React.SetStateAction<boolean>>
  setLoadingDaily: React.Dispatch<React.SetStateAction<boolean>>
  setCreatedDailyToday: React.Dispatch<React.SetStateAction<boolean>>
}

export async function getVerifDaily({
  setValidedDaily,
  setLoadingDaily,
  setCreatedDailyToday,
}: PropsgetDaily) {
  setLoadingDaily(true)

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/analysingDaily`,
      { method: 'GET', credentials: 'include' }
    )
    const data = await res.json()
    if (data.hasRegisteredToday) {
      setValidedDaily(true)
      setCreatedDailyToday(true)
    } else {
      setValidedDaily(false)
      setCreatedDailyToday(false)
    }
  } catch (error) {
    console.log(error)
  } finally {
    setLoadingDaily(false)
  }
}

const DiaryPage = () => {
  const [validedDaily, setValidedDaily] = useState(false)
  const [loadingDaily, setLoadingDaily] = useState(true)
  const [createdDailyToday, setCreatedDailyToday] = useState(false)
  const [loadingDailyCalendar, setLoadingDailyCalendar] = useState(false)
  const [today, setToday] = useState<boolean>(false)
  const [dailyData, setDailyData] = useState<dailyBackType>()
  useEffect(() => {
    getVerifDaily({ setLoadingDaily, setValidedDaily, setCreatedDailyToday })
  }, [])

  return (
    <>
      {loadingDaily ? (
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 sm:h-80 sm:w-80">
          <Lottie
            animationData={loading}
            loop={true}
            className="h-full w-full"
          />
        </div>
      ) : (
        <>
          {loadingDailyCalendar && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-[1px] transition-all dark:bg-zinc-950/50">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          )}
          <div className="mb-4 mt-5 w-[calc(100vw-0rem)] px-5 md:w-[calc(100vw-20rem)]">
            {/* Título + Descrição */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-center text-xl font-bold text-zinc-800 dark:text-zinc-100 md:text-left md:text-4xl">
                Diário Emocional
              </h1>
              <p className="mt-3 whitespace-normal break-words text-center text-base text-zinc-500 dark:text-zinc-400 md:text-left md:text-lg lg:text-xl">
                Registre seus sentimentos e acompanhe sua jornada
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="mt-8 flex w-full flex-col justify-start space-y-5 xl:flex-row xl:space-x-5"
            >
              {/* Calendário + Gráfico */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="flex w-full flex-col justify-between gap-2 dm:flex-row dm:items-center xl:w-[400px] xl:flex-col xl:items-stretch xl:justify-start"
              >
                {/* Calendário */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                  className="m-0 flex max-h-[400px] flex-col items-center rounded-2xl border border-zinc-200 bg-white py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dm:w-1/2 xl:my-0 xl:w-auto"
                >
                  <div className="flex items-center gap-2 p-1 text-zinc-600 dark:text-zinc-400">
                    <CalendarHeart className="h-5 w-5" />
                    <h2 className="font-medium">Selecione uma data</h2>
                  </div>
                  <CalendaryComponent
                    setValidedDaily={setValidedDaily}
                    setDailyData={setDailyData}
                    setLoadingDailyCalendar={setLoadingDailyCalendar}
                    setToday={setToday}
                  />
                </motion.div>

                {/* Gráfico */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.18 }}
                >
                  <GraphicsMidiaDialog />
                </motion.div>
              </motion.div>

              {/* Formulário do dia */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.12 }}
                className="mt-5 flex w-full flex-col space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:!mt-0"
              >
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {new Intl.DateTimeFormat('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date())}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Como você está se sentindo?
                </p>
                <FormDailyComponent
                  validedDaily={validedDaily}
                  dailyData={dailyData}
                  setDailyData={setDailyData}
                  setValidedDaily={setValidedDaily}
                  setLoadingDaily={setLoadingDaily}
                  createdDailyToday={createdDailyToday}
                  setCreatedDailyToday={setCreatedDailyToday}
                  today={today}
                />
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </>
  )
}

export default DiaryPage
