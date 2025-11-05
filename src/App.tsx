import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
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

function App() {
  const [selectedFeeling, setSelectedFeeling] =
    useState<keyof typeof gradientMap>('Todos')

  return (
    <>
      <div className="m-5 text-center md:mt-24">
        <img
          src="/logo.png"
          alt="Logo da Rede Social"
          width={100}
          height={100}
          className="mx-auto rounded-2xl md:absolute md:left-64 md:top-0"
        />
        <p className="text-1xl text-muted-foreground sm:text-left">
          Um espaço seguro para compartilhar e apoiar 💙
        </p>
        <Button className="mt-5 w-[calc(100vw-5rem)] rounded-xl border-none bg-[linear-gradient(to_right,#a8c8ff,#adc5ff,#b2c2ff,#b6c1ff,#b9c0ff,#bcbfff,#bebdff,#c1bcff,#c4bbff)] p-7 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl active:shadow-md md:w-[calc(100vw-19rem)] xl:w-[950px]">
          + Como você está se sentindo?
        </Button>
        <div className="relative mt-10 grid w-full grid-cols-[repeat(auto-fit,minmax(120px,1fr))] flex-wrap items-center justify-between rounded-md px-4 text-sm text-muted-foreground shadow-md sm:mx-auto sm:flex sm:rounded-full">
          {feelings.map((feeling: keyof typeof gradientMap) => {
            const isSelected = selectedFeeling === feeling
            return (
              <p
                key={feeling}
                onClick={() => {
                  setSelectedFeeling(feeling)
                }}
                className={`hover:shadow-[0_0_0_1px_hsl(var(--ring)] z-10 m-1 cursor-pointer rounded-lg p-3 font-semibold shadow-[0_0_0_1px_hsl(var(--ring))] shadow-gray-400/20 transition-all duration-300 sm:rounded-full sm:px-5 sm:py-1.5 ${
                  isSelected
                    ? `text-gray-800`
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {feeling}
              </p>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
