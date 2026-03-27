import { ShieldAlert, SlidersHorizontal, XCircle } from 'lucide-react'
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
  // Passamos os dois estados para o pai
  setFilterStatus: (status: string) => void
  setFilterReason: (reason: string) => void
}

export function TableFiltersPersons({
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

  const userReasons = [
    'Assédio',
    'Spam',
    'Discurso de Ódio',
    'Falsidade Ideológica',
    'Nudez/Conteúdo Sexual',
    'Desinformação',
    'Fraude/Golpe',
  ]

  const hasActiveFilters = status !== 'all' || reason !== 'all'

  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 border-dashed">
            <SlidersHorizontal className="h-4 w-4 text-red-500" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="end">
          <div className="grid gap-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                Filtros de Usuário
              </h4>
              <ShieldAlert className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Status da Conta
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer status</SelectItem>
                    <SelectItem value="INITIAL_REVIEW">
                      Novo Registro
                    </SelectItem>
                    <SelectItem value="PENDING">Aguardando</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Em Análise</SelectItem>
                    <SelectItem value="RESOLVED">Resolvido</SelectItem>
                    <SelectItem value="REJECTED">Banido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-zinc-500">
                  Motivo da Denúncia
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer motivo</SelectItem>
                    {userReasons.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
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
                className="flex-1"
                onClick={handleClear}
              >
                <XCircle className="mr-2 h-4 w-4" /> Limpar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
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
