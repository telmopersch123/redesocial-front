import { Check, Settings2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../ui/sheet'

import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from 'recharts'
import { ChartContainer, type ChartConfig } from '../../../ui/chart'
import { Separator } from '../../../ui/separator'
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const labels = Array.from({ length: 7 }, (_, i) => ({
  x: i,
  a: rand(1, 10),
  b: rand(1, 10),
  c: rand(1, 10),
}))
const colorLabels = Array.from({ length: 7 }, (_, i) => ({
  x: i,
  emotional: rand(1, 5),
  energy: rand(1, 5),
  anxiety: rand(1, 5),
}))

const chartData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (13 - i))
  return {
    date: date.toISOString().split('T')[0],
    emotional: rand(1, 10),
    energy: rand(1, 10),
    anxiety: rand(1, 10),
  }
})

interface ConfigGraphicsProps {
  chartStyle: 'purple' | 'colorful'
  setChartStyle: (style: 'purple' | 'colorful') => void
  chartType: 'Bar' | 'Line'
  setChartType: (type: 'Bar' | 'Line') => void
}

export const ConfigGraphics = ({
  chartStyle,
  setChartStyle,
  chartType,
  setChartType,
}: ConfigGraphicsProps) => {
  const barChartConfig =
    chartStyle === 'purple'
      ? {
          emotional: { label: 'Desempenho Sentimental', color: '#a78bfa' },
          energy: { label: 'Nível de Energia', color: '#9333ea' },
          anxiety: { label: 'Nível de Ansiedade', color: '#6b21a8' },
        }
      : ({
          emotional: { label: 'Desempenho Sentimental', color: '#6366f1' },
          energy: { label: 'Nível de Energia', color: '#f59e0b' },
          anxiety: { label: 'Nível de Ansiedade', color: '#ef4444' },
        } satisfies ChartConfig)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center rounded-lg border border-zinc-700 p-1.5 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200">
          <Settings2 className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] overflow-y-auto p-6">
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
                <AreaChart data={labels}>
                  <defs>
                    <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6b21a8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="a"
                    stroke="#a78bfa"
                    fill="url(#pa)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="b"
                    stroke="#9333ea"
                    fill="url(#pb)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="c"
                    stroke="#6b21a8"
                    fill="url(#pc)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
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
                <AreaChart data={colorLabels}>
                  <defs>
                    <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="emotional"
                    stroke="#6366f1"
                    fill="url(#ce)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#f59e0b"
                    fill="url(#cn)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="anxiety"
                    stroke="#ef4444"
                    fill="url(#ca)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {chartStyle === 'colorful' && (
              <p className="mt-2 text-center text-xs text-indigo-400">
                Selecionado
              </p>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Tipos Visuais
          </p>

          {/* Line */}
          <div
            onClick={() => {
              localStorage.setItem('chartType', 'Line')
              setChartType('Line')
            }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
              chartType === 'Line'
                ? 'border-purple-500 bg-purple-500/5'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Linha</p>
                <p className="text-xs text-zinc-500">
                  Visualização contínua com área
                </p>
              </div>
              {chartType === 'Line' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={colorLabels}>
                  <defs>
                    <linearGradient id="te" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={barChartConfig.emotional.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={barChartConfig.emotional.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="tn" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={barChartConfig.energy.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={barChartConfig.energy.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="ta" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={barChartConfig.anxiety.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={barChartConfig.anxiety.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="emotional"
                    stroke={barChartConfig.emotional.color}
                    fill="url(#te)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke={barChartConfig.energy.color}
                    fill="url(#tn)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="anxiety"
                    stroke={barChartConfig.anxiety.color}
                    fill="url(#ta)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {chartType === 'Line' && (
              <p className="mt-2 text-center text-xs text-purple-400">
                Selecionado
              </p>
            )}
          </div>

          {/* Bar */}
          <div
            onClick={() => {
              localStorage.setItem('chartType', 'Bar')
              setChartType('Bar')
            }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
              chartType === 'Bar'
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Barra</p>
                <p className="text-xs text-zinc-500">
                  Visualização em colunas agrupadas
                </p>
              </div>
              {chartType === 'Bar' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
              <ChartContainer
                config={barChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer={true}
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <Bar
                    dataKey="emotional"
                    fill={barChartConfig.emotional.color}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="energy"
                    fill={barChartConfig.energy.color}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="anxiety"
                    fill={barChartConfig.anxiety.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            {chartType === 'Bar' && (
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
