import { Heart } from 'lucide-react'
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

// Dados fictícios — substitua depois pela lista real
const seguidores = [
  { id: 1, nome: 'Julia Ferreira', avatar: '' },
  { id: 2, nome: 'Matheus Costa', avatar: '' },
  { id: 3, nome: 'Camila Rocha', avatar: '' },
  { id: 4, nome: 'Enzo Martins', avatar: '' },
  { id: 5, nome: 'Isabela Lima', avatar: '' },
  { id: 6, nome: 'Thiago Almeida', avatar: '' },
  { id: 7, nome: 'Larissa Mendes', avatar: '' },
  { id: 8, nome: 'Gustavo Silva', avatar: '' },
  { id: 9, nome: 'Sofia Ribeiro', avatar: '' },
  { id: 10, nome: 'Renato Oliveira', avatar: '' },
]

export function FollowersDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
          <span className="text-xl font-bold text-foreground">1.2k</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-600" />
            seguidores
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl border bg-background/95 p-6 shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-foreground">
            Seguidores de Carlos Almeida
          </DialogTitle>
          <p className="mt-2 text-center text-muted-foreground">
            {seguidores.length} pessoas seguindo
          </p>
        </DialogHeader>

        <div className="mt-6 max-h-96 space-y-3 overflow-y-auto">
          {seguidores.map((seguidor) => (
            <div
              key={seguidor.id}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={seguidor.avatar} alt={seguidor.nome} />
                <AvatarFallback className="bg-linear-purple font-medium text-white">
                  {seguidor.nome
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium text-foreground">{seguidor.nome}</p>
              </div>

              <Button size="sm" className="bg-linear-purple rounded-full">
                Ver perfil
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
