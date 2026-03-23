import { Activity, Search, SlidersHorizontal, XCircle } from 'lucide-react'
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

interface TableFiltersEmocionalProps {
  onFilterChange: (filters: {
    search: string
    status: string
    reason: string
  }) => void
}

export function TableFiltersEmocional({
  onFilterChange,
}: TableFiltersEmocionalProps) {
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

  const hasActiveFilters = status !== 'all' || reason !== 'all'

  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Buscar por nome..."
          className="bg-white pl-10 dark:bg-zinc-950"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            onFilterChange({ search: e.target.value, status, reason })
          }}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 border-dashed">
            <SlidersHorizontal className="h-4 w-4 text-green-500" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="end">
          <div className="grid gap-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                Filtros Emocionais
              </h4>
              <Activity className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer status</SelectItem>
                    <SelectItem value="bom">🟢 Bom</SelectItem>
                    <SelectItem value="estavel">🟡 Estável</SelectItem>
                    <SelectItem value="queda">🔴 Em Queda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Tendência
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tendência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer tendência</SelectItem>
                    <SelectItem value="up">📈 Subindo</SelectItem>
                    <SelectItem value="stable">➡️ Estável</SelectItem>
                    <SelectItem value="down">📉 Caindo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleClear}
              >
                <XCircle className="mr-2 h-4 w-4" /> Limpar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                onClick={handleApply}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
