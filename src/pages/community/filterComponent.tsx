import { Lock, Unlock, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover'

interface FilterProps {
  onApply: (filters: {
    privacy: 'all' | 'public' | 'private'
    minMembers: number | null
    maxMembers: number | null
  }) => void
}

export function FilterCommunity({ onApply }: FilterProps) {
  const [privacy, setPrivacy] = useState<'all' | 'public' | 'private'>('all')
  const [minMembers, setMinMembers] = useState<number | null>(null)
  const [maxMembers, setMaxMembers] = useState<number | null>(null)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg"
        >
          <UsersRound className="h-4 w-4" />
          Filtrar Comunidades
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 rounded-xl shadow-md">
        <div className="grid gap-4">
          {/* Título */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Filtros</h4>
            <p className="text-sm text-muted-foreground">
              Refine a exibição das comunidades.
            </p>
          </div>

          {/* Quantidade de membros */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantidade de membros</Label>

            <div className="flex items-center gap-2">
              <Input
                onChange={(e) => setMinMembers(Number(e.target.value) || null)}
                type="number"
                placeholder="Mín"
                className="h-9"
              />
              <span className="text-sm text-muted-foreground">-</span>
              <Input
                onChange={(e) => setMaxMembers(Number(e.target.value) || null)}
                type="number"
                placeholder="Máx"
                className="h-9"
              />
            </div>
          </div>

          {/* Privacidade */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de comunidade</Label>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={privacy === 'all' ? 'default' : 'outline'}
                onClick={() => setPrivacy('all')}
                className="h-9"
              >
                Todas
              </Button>

              <Button
                variant={privacy === 'public' ? 'default' : 'outline'}
                onClick={() => setPrivacy('public')}
                className="flex h-9 items-center gap-1"
              >
                <Unlock className="h-4 w-4" />
                Pública
              </Button>

              <Button
                variant={privacy === 'private' ? 'default' : 'outline'}
                onClick={() => setPrivacy('private')}
                className="flex h-9 items-center gap-1"
              >
                <Lock className="h-4 w-4" />
                Privada
              </Button>
            </div>
          </div>

          {/* Aplicar filtro */}
          <Button
            onClick={() => {
              onApply({
                privacy,
                minMembers,
                maxMembers,
              })
            }}
            className="bg-linear-purple mt-2 w-full rounded-lg hover:shadow-md"
          >
            Aplicar filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
