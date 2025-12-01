import { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import { Label } from '../../../ui/label'
import { openOnly } from './ConfigDialog'

interface BlockedUser {
  id: number
  name: string
  avatar: string
}

interface ListUsersBlockProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
}

const ListUsersBlock = ({ open, setOpen }: ListUsersBlockProps) => {
  const [users, setUsers] = useState<BlockedUser[]>([
    { id: 1, name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=12' },
    {
      id: 2,
      name: 'Maria Souza',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: 3,
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    { id: 1, name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=12' },
    {
      id: 2,
      name: 'Maria Souza',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: 3,
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    { id: 1, name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=12' },
    {
      id: 2,
      name: 'Maria Souza',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: 3,
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    { id: 1, name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=12' },
    {
      id: 2,
      name: 'Maria Souza',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: 3,
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    { id: 1, name: 'João Silva', avatar: 'https://i.pravatar.cc/150?img=12' },
    {
      id: 2,
      name: 'Maria Souza',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: 3,
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
  ])
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (value) {
            openOnly({ index: 0, setOpenDialog: setOpen })
          } else {
            setOpen((prev) => prev.map(() => false))
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">Usuários Bloqueados</Label>
              <p className="text-xs text-muted-foreground">
                Gerencie sua lista de usuários bloqueados.
              </p>
            </div>
            <Button variant="ghost">Gerenciar</Button>
          </div>
        </DialogTrigger>

        <DialogContent className="z-[70] w-[95%] rounded-xl om:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Usuários bloqueados
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1">
            {users.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                Você não possui usuários bloqueados.
              </p>
            )}

            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-medium">{user.name}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  Desbloquear Usuário
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ListUsersBlock
