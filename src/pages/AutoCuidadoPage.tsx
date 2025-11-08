import { Sparkles, Wind } from 'lucide-react'
import DialogsBibliotecas from '../components/componentsPages/componentsAutoCuidado/DialogsBiblioteca'
import { Button } from '../components/ui/button'
import { bibliotecaApoioData } from '../data/biblioteca_apoio/bibliotecaApoioConteudo'

const AutoCuidadoPage = () => {
  return (
    <div className="mt-16 flex w-[calc(100vw-2rem)] flex-col gap-8 p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <h1 className="truncate text-3xl font-bold">Autocuidado</h1>
      <p className="truncate text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
        Recursos e práticas para seu bem-estar emocional
      </p>

      {/* Afirmação do Dia */}
      <div className="flex flex-col gap-4 rounded-2xl bg-[#F3F7FE] p-5 text-center shadow-md transition-shadow hover:shadow-lg">
        <p className="truncate text-sm font-medium text-muted-foreground">
          Afirmação do Dia
        </p>
        <h2 className="truncate text-lg font-semibold">
          "Eu sou suficiente exatamente como sou 💙"
        </h2>
        <Button className="m-auto flex w-fit items-center gap-2 rounded-full bg-white text-[#a5d3ff] hover:bg-gray-100">
          <Sparkles className="shrink-0" />
          <span className="truncate">Nova Afirmação</span>
        </Button>
      </div>

      {/* Exercícios de Respiração */}
      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 truncate font-semibold text-[#a5c9ff]">
          <Wind className="shrink-0" /> <span>Exercícios de Respiração</span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
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
              <p className="truncate font-medium text-gray-700">{ex.tempo}</p>
              {/* Ícone com fundo adaptável */}
              <div
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl p-3"
                style={{ backgroundColor: ex.cor }}
              >
                <Wind className="h-6 w-6" style={{ color: ex.corIcon }} />
              </div>
              <p className="truncate font-semibold">{ex.metodo}</p>
              <p className="truncate text-sm text-gray-500">{ex.desc}</p>
              <Button
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
      <div className="grid gap-4 md:grid-cols-3">
        {bibliotecaApoioData.map((data, i) => (
          <DialogsBibliotecas key={i} item={data.item} />
        ))}
      </div>
    </div>
  )
}

export default AutoCuidadoPage
