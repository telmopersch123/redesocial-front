import { HouseHeart } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../ui/button'

const FormDiario = () => {
  const [active, setActive] = useState<number | null>(null)
  const [activeList, setActiveList] = useState<number[] | null>(null)
  const [valorEnergia, setValorEnergia] = useState(3)
  const [valorAnsiedade, setValorAnsiedade] = useState(3)

  const toggleActive = (id: number) => {
    setActiveList((prev: number[] | null) =>
      prev?.includes(id)
        ? prev.filter((item) => item !== id)
        : [...(prev || []), id]
    )
  }

  const feelings = [
    { id: 1, emoji: '😢', label: 'Muito mal' },
    { id: 2, emoji: '😔', label: 'Mal' },
    { id: 3, emoji: '😐', label: 'Neutro' },
    { id: 4, emoji: '🙂', label: 'Bem' },
    { id: 5, emoji: '😊', label: 'Muito bem' },
  ]
  const atividadesAutocuidado = [
    { id: 1, nome: 'Meditação' },
    { id: 2, nome: 'Exercício físico' },
    { id: 3, nome: 'Leitura' },
    { id: 4, nome: 'Conversa com amigos' },
    { id: 5, nome: 'Música' },
    { id: 6, nome: 'Caminhada' },
    { id: 7, nome: 'Hobbies criativos' },
    { id: 8, nome: 'Respiração profunda' },
    { id: 9, nome: 'Tempo com família' },
  ]

  return (
    <div className="flex w-full flex-col justify-center">
      {/* Emojis de humor */}
      <div className="m-auto mt-3 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 2xl:max-w-2xl">
        {feelings.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => setActive(item.id)}
            className={`flex h-[100px] flex-col items-center rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:scale-105 ${
              active === item.id
                ? 'border-[#a5c9ff] ring-2 ring-[#a5c9ff]'
                : 'border-[#d3d3d3] ring-2 ring-[#d3d3d3]'
            }`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      <div className="mt-10 flex w-full flex-col gap-8 sm:flex-row">
        {/* Energia */}
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">
            Nível de energia:{' '}
            <span className="text-muted-foreground">{valorEnergia}</span>
          </p>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={valorEnergia}
            onChange={(e) => setValorEnergia(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg border-[1px] border-[#1a1a1a6b] accent-[#b8e6d5]"
            style={{
              background: `linear-gradient(to right, #b8e6d5 ${(valorEnergia - 1) * 25}%, rgb(59, 59, 59) ${(valorEnergia - 1) * 25}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Baixa</span>
            <span>Alta</span>
          </div>
        </div>

        {/* Ansiedade */}
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">
            Nível de ansiedade:{' '}
            <span className="text-muted-foreground">{valorAnsiedade}</span>
          </p>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={valorAnsiedade}
            onChange={(e) => setValorAnsiedade(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg border-[1px] border-[#1a1a1a6b] accent-[#ffd4a3]"
            style={{
              background: `linear-gradient(to right, #ffd4a3 ${(valorAnsiedade - 1) * 25}%, rgb(59, 59, 59) ${(valorAnsiedade - 1) * 25}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Baixa</span>
            <span>Alta</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        {/* Notas e Reflexões */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-black">
            Notas e reflexões
          </p>
          <textarea
            className="mt-2 h-32 max-h-[400px] w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-black shadow-sm transition-all duration-200 hover:text-muted-foreground focus:border-[#a5c9ff] focus:outline-none focus:ring-1 focus:ring-[#a5c9ff]"
            placeholder="Escreva suas notas aqui..."
          ></textarea>
        </div>

        {/* Gratidão */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-black">
            Pelo que você é grato hoje? 🙏
          </p>
          <textarea
            className="mt-2 h-32 max-h-[400px] w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-black shadow-sm transition-all duration-200 hover:text-muted-foreground focus:border-[#a5c9ff] focus:outline-none focus:ring-1 focus:ring-[#a5c9ff]"
            placeholder="Escreva suas notas aqui..."
          ></textarea>
        </div>

        {/* Atividades e botão */}
        <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full">
            <p className="mb-2 text-base font-semibold text-black">
              Atividades de autocuidado
            </p>
            <div className="flex flex-wrap gap-2 rounded-xl bg-[#f8f5f2] p-4 shadow-sm">
              {atividadesAutocuidado.map((atividade) => (
                <span
                  key={atividade.id}
                  onClick={() => toggleActive(atividade.id)}
                  className={`cursor-pointer rounded-full bg-white px-4 py-1 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-[#a5c9ff] hover:text-white ${
                    activeList?.includes(atividade.id)
                      ? 'bg-linear-purple text-white'
                      : 'text-black'
                  }`}
                >
                  {atividade.nome}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="bg-linear-purple mt-4 flex items-center justify-center gap-2 rounded-xl !p-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 sm:mt-0">
          <HouseHeart className="h-4 w-4" />
          Salvar Registro
        </button>
      </div>
    </div>
  )
}

export default FormDiario
