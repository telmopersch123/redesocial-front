import { SlidersHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu'

interface PropsMetrics {
  activeLines: {
    [key: string]: boolean
  }
  setActiveLines: React.Dispatch<
    React.SetStateAction<{
      emotionalDiary: boolean
      lvlenergy: boolean
      lvlanxiety: boolean
    }>
  >
  chartConfig: {
    [key: string]: {
      color: string
      label: string
    }
  }
}

export const Metrics = ({
  activeLines,
  setActiveLines,
  chartConfig,
}: PropsMetrics) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200">
          <SlidersHorizontal className="h-3 w-3" />
          Métricas
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2">
        {Object.keys(activeLines).map((key) => {
          const k = key as keyof typeof activeLines
          const active = activeLines[k]
          return (
            <button
              key={k}
              onClick={() =>
                setActiveLines((prev) => ({
                  ...prev,
                  [k as keyof typeof prev]: !prev[k as keyof typeof prev],
                }))
              }
              style={{
                borderColor: active ? chartConfig[k].color : 'transparent',
                backgroundColor: active
                  ? `${chartConfig[k].color}18`
                  : 'transparent',
                color: active ? chartConfig[k].color : '#6b7280',
              }}
              className="mb-1 flex w-full items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-all duration-200 hover:opacity-80"
            >
              <span
                style={{
                  backgroundColor: active ? chartConfig[k].color : '#6b7280',
                }}
                className="h-2 w-2 rounded-full transition-all duration-200"
              />
              {chartConfig[k].label}
            </button>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
