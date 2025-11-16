import { Wind } from 'lucide-react'
import DialogsLibrariesComponent from '../components/componentsPages/componentsAutoCuidado/DialogsLibrariesComponent'
import MessageDayComponent from '../components/componentsPages/componentsAutoCuidado/MessageDayComponent'
import { Button } from '../components/ui/button'
import { useBreathing } from '../context/BreathingContext'
import { bibliotecaApoioData } from '../data/biblioteca_apoio/bibliotecaApoioConteudo'

const SelfCarePage = () => {
  const { setOpen, setTypeBreathing } = useBreathing()
  return (
    <div className="mt-16 flex w-[calc(100vw-2rem)] flex-col p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <div className="space-y-6">
        <div>
          <h1 className="truncate text-3xl font-bold">Autocuidado</h1>
          <p className="mt-3 truncate text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
            Recursos e práticas para seu bem-estar emocional
          </p>
        </div>
        {/* Afirmação do Dia */}
        <MessageDayComponent />
        {/* Exercícios de Respiração */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 truncate font-semibold text-[#a5c9ff]">
            <Wind className="shrink-0" /> <span>Exercícios de Respiração</span>
          </h2>
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {[
              {
                tempo: '2 minutos',
                metodo: 'Respiração 4-4-4',
                desc: 'Inspire por 4 segundos, segure por 4, expire por 4',
                cor: '#f3f7fe',
                corIcon: '#a5c9ff',
              },
              {
                tempo: '5 minutos',
                metodo: 'Respiração Profunda',
                desc: 'Respirações lentas e profundas para acalmar a mente',
                cor: '#f5fbf9',
                corIcon: '#b8e6d5',
              },
            ].map((ex, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
              >
                {/* Ícone com fundo adaptável */}
                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl p-3"
                    style={{ backgroundColor: ex.cor }}
                  >
                    <Wind className="h-6 w-6" style={{ color: ex.corIcon }} />
                  </div>
                  <p className="truncate rounded-full bg-[#f8f5f2] px-1 text-xs font-medium text-gray-700 text-muted-foreground">
                    {ex.tempo}
                  </p>
                </div>
                <p className="truncate font-semibold">{ex.metodo}</p>
                <p className="truncate text-sm text-gray-500">{ex.desc}</p>
                <Button
                  onClick={() => {
                    setTypeBreathing(ex.metodo)
                    setOpen(true)
                  }}
                  className="w-full truncate"
                  style={{ backgroundColor: ex.corIcon, color: '#fff' }}
                >
                  Iniciar Exercício
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Biblioteca de Apoio */}
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {bibliotecaApoioData.map((data, i) => (
            <DialogsLibrariesComponent key={i} item={data.item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelfCarePage
