import { Check, Settings2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../ui/sheet'

import { Line, LineChart, ResponsiveContainer } from 'recharts'
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const labels = Array.from({ length: 14 }, (_, i) => ({
  x: i,
  a: rand(0, 500),
  b: rand(0, 500),
  c: rand(0, 500),
}))
const colorLabels = Array.from({ length: 14 }, (_, i) => ({
  x: i,
  emotional: rand(1, 5),
  energy: rand(1, 5),
  anxiety: rand(1, 5),
}))

interface ConfigGraphicsProps {
  chartStyle: 'purple' | 'colorful'
  setChartStyle: (style: 'purple' | 'colorful') => void
}

export const ConfigGraphics = ({
  chartStyle,
  setChartStyle,
}: ConfigGraphicsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center rounded-lg border border-zinc-700 p-1.5 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200">
          <Settings2 className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-base">
            Configurações de gráficos
          </SheetTitle>
          <p className="text-xs text-zinc-400">
            Escolha o estilo visual do seu gráfico
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Estilo visual
          </p>

          {/* Card Purple */}
          <div
            onClick={() => {
              localStorage.setItem('chartStyle', 'purple')
              setChartStyle('purple')
            }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
              chartStyle === 'purple'
                ? 'border-purple-500 bg-purple-500/5'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Monocromático
                </p>
                <p className="text-xs text-zinc-500">Tons de roxo</p>
              </div>
              {chartStyle === 'purple' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={labels}>
                  <Line
                    type="monotone"
                    dataKey="a"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="b"
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="c"
                    stroke="#6b21a8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {chartStyle === 'purple' && (
              <p className="mt-2 text-center text-xs text-purple-400">
                Selecionado
              </p>
            )}
          </div>

          {/* Card Colorido */}
          <div
            onClick={() => {
              localStorage.setItem('chartStyle', 'colorful')
              setChartStyle('colorful')
            }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
              chartStyle === 'colorful'
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Colorido</p>
                <p className="text-xs text-zinc-500">
                  Índigo, âmbar e vermelho
                </p>
              </div>
              {chartStyle === 'colorful' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={colorLabels}>
                  <Line
                    type="monotone"
                    dataKey="emotional"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {chartStyle === 'colorful' && (
              <p className="mt-2 text-center text-xs text-indigo-400">
                Selecionado
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
