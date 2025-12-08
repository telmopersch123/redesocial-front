import { motion } from 'framer-motion'
import { CalendarHeart } from 'lucide-react'
import { CalendaryComponent } from '../components/componentsPages/componentsDiario/CalendaryComponent'
import FormDailyComponent from '../components/componentsPages/componentsDiario/FormDailyComponent'
import { GraphicsMidiaDialog } from '../components/componentsPages/componentsDiario/GraphicsMidiaDialog'

const DiaryPage = () => {
  return (
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
            <CalendaryComponent />
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
            6 de novembro de 2025
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Como você está se sentindo?
          </p>
          <FormDailyComponent />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DiaryPage
