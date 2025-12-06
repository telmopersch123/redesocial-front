import { HouseHeart } from 'lucide-react'
import { useState } from 'react'
import { useLimitForms } from '../../../hooks/useLimitForms'
import { MessageForms } from '../../formCustomer/MessageForms'
import { Button } from '../../ui/button'
import { Textarea } from '../../ui/textarea'

const FormDailyComponent = () => {
  const [active, setActive] = useState<number | null>(null)
  const [activeList, setActiveList] = useState<number[] | null>(null)
  const [valorEnergia, setValorEnergia] = useState(3)
  const [valorAnsiedade, setValorAnsiedade] = useState(3)
  const notas = useLimitForms(5000)
  const gratidao = useLimitForms(5000)
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
            className={`flex h-[100px] flex-col items-center rounded-2xl border bg-white p-5 shadow-md transition-all duration-300 hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900 ${
              active === item.id
                ? 'border-purple-500 ring-2 ring-purple-500/30 dark:ring-purple-500/50'
                : 'border-zinc-300 dark:border-zinc-700'
            }`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      <div className="mt-10 flex w-full flex-col gap-8 sm:flex-row">
        {/* Energia */}
        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Nível de energia:{' '}
            <span className="text-zinc-500 dark:text-zinc-400">
              {valorEnergia}
            </span>
          </p>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={valorEnergia}
            onChange={(e) => setValorEnergia(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 accent-emerald-500 dark:border-zinc-700"
            style={{
              background: `linear-gradient(to right, #94f3c0 ${(valorEnergia - 1) * 25}%, #27272a ${(valorEnergia - 1) * 25}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Baixa</span>
            <span>Alta</span>
          </div>
        </div>

        {/* Ansiedade */}
        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Nível de ansiedade:{' '}
            <span className="text-zinc-500 dark:text-zinc-400">
              {valorAnsiedade}
            </span>
          </p>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={valorAnsiedade}
            onChange={(e) => setValorAnsiedade(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 accent-orange-400 dark:border-zinc-700"
            style={{
              background: `linear-gradient(to right, #fed7aa ${(valorAnsiedade - 1) * 25}%, #27272a ${(valorAnsiedade - 1) * 25}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Baixa</span>
            <span>Alta</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        {/* Notas e Reflexões */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Notas e reflexões
          </p>
          <Textarea
            value={notas.value}
            onChange={notas.handleChange}
            className="mt-2 h-32 max-h-[400px] w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm transition-all duration-200 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500"
            placeholder="Escreva suas notas aqui..."
          />
          <MessageForms
            error={notas.error}
            valueLength={notas.value.length}
            maxLength={notas.maxLength}
          />
        </div>

        {/* Gratidão */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Pelo que você é grato hoje?
          </p>
          <Textarea
            value={gratidao.value}
            onChange={gratidao.handleChange}
            className="mt-2 h-32 max-h-[400px] w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm transition-all duration-200 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500"
            placeholder="Escreva suas notas aqui..."
          />
          <MessageForms
            error={gratidao.error}
            valueLength={gratidao.value.length}
            maxLength={gratidao.maxLength}
          />
        </div>

        {/* Atividades de autocuidado */}
        <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full">
            <p className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Atividades de autocuidado
            </p>
            <div className="flex flex-wrap gap-2 rounded-xl bg-zinc-50 p-4 shadow-sm dark:bg-zinc-800/50">
              {atividadesAutocuidado.map((atividade) => (
                <span
                  key={atividade.id}
                  onClick={() => toggleActive(atividade.id)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-purple-600 hover:text-white ${
                    activeList?.includes(atividade.id)
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                      : 'bg-white text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  {atividade.nome}
                </span>
              ))}
            </div>
          </div>

          <Button className="bg-linear-purple mt-4 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 sm:mt-0">
            <HouseHeart className="h-4 w-4" />
            Salvar Registro
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FormDailyComponent
