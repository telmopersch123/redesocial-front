import { Search, SlidersHorizontal, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
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
  onFilterChange: (filters: {
    search: string
    status: string
    reason: string
  }) => void
}

export function TableFilters({ onFilterChange }: TableFiltersProps) {
  const [status, setStatus] = useState('all')
  const [reason, setReason] = useState('all')
  const [search, setSearch] = useState('')

  const handleApply = () => {
    onFilterChange({ search, status, reason })
  }

  const handleClear = () => {
    setSearch('')
    setStatus('all')
    setReason('all')
    onFilterChange({ search: '', status: 'all', reason: 'all' })
  }

  // Pegamos os motivos exatamente como estão no seu Mock
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

  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="ID ou nome do autor..."
          className="bg-white pl-10 dark:bg-zinc-950"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 border-dashed border-zinc-300 dark:border-zinc-700"
          >
            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
            Filtros Avançados
            {(status !== 'all' || reason !== 'all') && (
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
              {/* Filtro por Status (Baseado na sua tipagem status) */}
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

              {/* Filtro por Motivo (Baseado no seu reason: string) */}
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
