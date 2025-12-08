import { motion } from 'framer-motion'
import { Wind } from 'lucide-react'
import DialogsLibrariesComponent from '../components/componentsPages/componentsAutoCuidado/DialogsLibrariesComponent'
import MessageDayComponent from '../components/componentsPages/componentsAutoCuidado/MessageDayComponent'
import { Button } from '../components/ui/button'
import { useBreathing } from '../context/BreathingContext'
import { bibliotecaApoioData } from '../data/biblioteca_apoio/bibliotecaApoioConteudo'

const SelfCarePage = () => {
  const { setOpen, setTypeBreathing } = useBreathing()

  return (
    <div className="mb-4 mt-5 flex w-[calc(100vw-0rem)] flex-col px-5 md:w-[calc(100vw-20rem)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Título + Descrição */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h1 className="text-center text-xl font-bold text-zinc-800 dark:text-zinc-100 md:text-left md:text-4xl">
            Autocuidado
          </h1>
          <p className="mt-3 whitespace-normal break-words text-center text-base text-zinc-500 dark:text-zinc-400 md:text-left md:text-lg lg:text-xl">
            Recursos e práticas para seu bem-estar emocional
          </p>
        </motion.div>

        {/* Afirmação do Dia */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <MessageDayComponent />
        </motion.div>

        {/* Exercícios de Respiração */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <h2 className="flex items-center gap-2 font-semibold text-purple-500 dark:text-purple-400">
            <Wind className="h-5 w-5 shrink-0" />{' '}
            <span>Exercícios de Respiração</span>
          </h2>

          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {[
              {
                tempo: '2 minutos',
                metodo: 'Respiração 4-4-4',
                desc: 'Inspire por 4 segundos, segure por 4, expire por 4',
                cor: '#e0eaff',
                corIcon: '#a5c9ff',
              },
              {
                tempo: '5 minutos',
                metodo: 'Respiração Profunda',
                desc: 'Respirações lentas e profundas para acalmar a mente',
                cor: '#e6f7f4',
                corIcon: '#94f3c0',
              },
            ].map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-md transition-shadow hover:shadow-xl dark:bg-zinc-900 dark:shadow-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: ex.cor }}
                  >
                    <Wind className="h-7 w-7" style={{ color: ex.corIcon }} />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {ex.tempo}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {ex.metodo}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {ex.desc}
                </p>
                <Button
                  onClick={() => {
                    setTypeBreathing(ex.metodo)
                    setOpen(true)
                  }}
                  className="w-full font-medium text-white"
                  style={{ backgroundColor: ex.corIcon }}
                >
                  Iniciar Exercício
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Biblioteca de Apoio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0"
        >
          {bibliotecaApoioData.map((data, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.35 + i * 0.05 }}
            >
              <DialogsLibrariesComponent item={data.item} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SelfCarePage
