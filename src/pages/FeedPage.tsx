import { useState } from 'react'
import { DialogPost } from '../components/componentsPages/componentsFeed/DialogPost'

const feelings: Array<keyof typeof gradientMap> = [
  'Todos',
  'Feliz',
  'Esperançoso',
  'Ansioso',
  'Agradecido',
  'Triste',
]

const gradientMap = {
  Todos: 'from-gray-100 via-gray-50 to-gray-100',
  Feliz: 'from-yellow-100 via-yellow-50 to-amber-100',
  Esperançoso: 'from-green-100 via-emerald-50 to-green-200',
  Ansioso: 'from-violet-100 via-purple-50 to-violet-200',
  Agradecido: 'from-sky-100 via-blue-50 to-indigo-100',
  Triste: 'from-blue-200 via-slate-50 to-blue-300',
}

const emojiMap: Record<string, string> = {
  Todos: '🌍',
  Feliz: '😊',
  Esperançoso: '🌱',
  Ansioso: '😰',
  Agradecido: '🙏',
  Triste: '😢',
}

const itemsSimulation: Array<string> = []

const FeedPage = () => {
  const [selectedFeeling, setSelectedFeeling] =
    useState<keyof typeof gradientMap>('Todos')
  return (
    <>
      <div className="m-5 mt-10 text-center">
        <img
          src="/logo.png"
          alt="Logo da Rede Social"
          width={100}
          height={100}
          className="mx-auto rounded-2xl md:hidden"
        />
        <p className="text-1xl text-muted-foreground sm:text-left">
          Um espaço seguro para compartilhar e apoiar 💙
        </p>
        <DialogPost />
        <div
          className="scroll-show m-auto mt-3 flex max-w-[calc(100vw-3rem)] justify-between overflow-x-auto whitespace-nowrap rounded-lg bg-white/50 p-2 shadow-sm backdrop-blur-md sm:w-[calc(100vw-19rem)] xl:w-[950px]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {feelings.map((feeling: keyof typeof gradientMap) => {
            const isSelected = selectedFeeling === feeling
            return (
              <p
                key={feeling}
                onClick={() => setSelectedFeeling(feeling)}
                className={`m-1 cursor-pointer rounded-full px-5 py-2 font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${gradientMap[feeling]} scale-105 text-gray-800 shadow-md`
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {emojiMap[feeling]} {feeling}
              </p>
            )
          })}
        </div>
        <div className="mt-24">
          {itemsSimulation.length ? (
            itemsSimulation.map((item, index) => <div key={index}>{item}</div>)
          ) : (
            <>
              <p className="m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eeeefa] p-3 text-4xl">
                🌱
              </p>
              <p className="mt-5 text-xs font-semibold text-muted-foreground sm:text-xl">
                Nenhum post ainda. Seja o primeiro a compartilhar!
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default FeedPage
