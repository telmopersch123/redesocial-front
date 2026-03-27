import { SlidersHorizontal, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

interface TableFiltersProps {
  setFilterStatus: (status: string) => void
  setFilterReason: (reason: string) => void
}

const motives = [
  'Violência',
  'Direitos Autorais',
  'Spam',
  'Conteúdo Impróprio',
  'Fake News',
  'Discurso de Ódio',
  'Bullying/Assédio',
  'Fraude/Golpe',
  'Conteúdo Sensível',
  'Auto-mutilação',
]

export function TableFilters({
  setFilterStatus,
  setFilterReason,
}: TableFiltersProps) {
  const [status, setStatus] = useState('all')
  const [reason, setReason] = useState('all')

  const handleApply = () => {
    setFilterStatus(status)
    setFilterReason(reason)
  }

  const handleClear = () => {
    setStatus('all')
    setReason('all')
    setFilterStatus('all')
    setFilterReason('all')
  }

  const hasActiveFilters = status !== 'all' || reason !== 'all'

  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 border-dashed border-zinc-300 dark:border-zinc-700"
          >
            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="end">
          <div className="grid gap-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                Parâmetros Sentinel
              </h4>
              <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Estado do Processo
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer estágio</SelectItem>
                    <SelectItem value="INITIAL_REVIEW">
                      Nova Denúncia
                    </SelectItem>
                    <SelectItem value="PENDING">Aguardando</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Em Análise</SelectItem>
                    <SelectItem value="RESOLVED">Resolvido</SelectItem>
                    <SelectItem value="REJECTED">Removido/Punido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Tipo de Violação
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer violação</SelectItem>
                    {motives.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-zinc-500 hover:text-red-500"
                onClick={handleClear}
              >
                <XCircle className="mr-2 h-4 w-4" /> Limpar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handleApply}
              >
                Filtrar Dados
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
