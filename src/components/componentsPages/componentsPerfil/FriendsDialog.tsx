import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import type { Persons } from '../../../types'
import { filter } from '../../../utils/functions'
import { Input } from '../../ui/input'

// Dados fictícios — depois você troca pela lista real
const amigos: Persons[] = [
  { id: 1, nome: 'Ana Clara', avatar: '' },
  { id: 2, nome: 'Pedro Henrique', avatar: '' },
  { id: 3, nome: 'Mariana Silva', avatar: '' },
  { id: 4, nome: 'Lucas Oliveira', avatar: '' },
  { id: 5, nome: 'Beatatriz Costa', avatar: '' },
  { id: 6, nome: 'Gabriel Santos', avatar: '' },
  { id: 7, nome: 'Laura Mendes', avatar: '' },
  { id: 8, nome: 'Rafael Lima', avatar: '' },
]

export function FriendsDialog() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [amigosFiltrados, setAmigosFiltrados] = useState(amigos)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    if (open) {
      setSearch('')
      filter(search, amigos, setAmigosFiltrados, setEmpty)
    }
  }, [open])
  useEffect(() => {
    if (open) {
      filter(search, amigos, setAmigosFiltrados, setEmpty)
    }
  }, [search])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Use onde quiser (ex: no lugar do "150 amigos") */}
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
          <span className="text-xl font-bold text-foreground">150</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-blue-500" />
            amigos
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl border bg-background/95 p-6 shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-foreground">
            Amigos de Carlos Almeida
          </DialogTitle>
          <p className="mt-2 text-center text-muted-foreground">
            {amigos.length} amigos
          </p>
          <div>
            <Input
              type="text"
              placeholder="Buscar seguidores"
              className="mt-4"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="mt-6 h-[500px] space-y-3 overflow-y-auto">
          {amigosFiltrados.map((amigo) => (
            <div
              key={amigo.id}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={amigo.avatar} alt={amigo.nome} />
                <AvatarFallback className="bg-linear-purple font-medium text-white">
                  {amigo.nome
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium text-foreground">{amigo.nome}</p>
              </div>

              <Button size="sm" className="bg-linear-purple rounded-full">
                Ver perfil
              </Button>
            </div>
          ))}
          {empty && (
            <p className="mb-4 flex items-center justify-center text-muted-foreground">
              Nenhum usuário encontrado
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
