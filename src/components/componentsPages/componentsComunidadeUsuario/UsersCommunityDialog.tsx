'use client'

import {
  CheckSquare,
  ChevronsLeft,
  ChevronsRight,
  Crown,
  RotateCcw,
  Search,
  Trash2,
  UserPlus,
  Users,
  VolumeOff,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../..//ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../..//ui/dialog'
import { Input } from '../..//ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../..//ui/select'
import { Separator } from '../..//ui/separator'
import { TooltipComponent } from '../../globalcomponents/tooltipComponent'
import { Checkbox } from '../../ui/checkbox'
import { ConfirmationRemoveUserDialog } from './ConfirmationRemoveUserDialog'

type User = {
  id: number
  name: string
  username: string
  role: 'member' | 'moderator' | 'admin'
  joinedAt: string
  online: boolean
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Mariana Souza',
    username: 'mariana',
    role: 'admin',
    joinedAt: '2024-03-12',
    online: true,
  },
  {
    id: 2,
    name: 'Carlos Pereira',
    username: 'carlosp',
    role: 'moderator',
    joinedAt: '2024-05-02',
    online: false,
  },
  {
    id: 3,
    name: 'Ana Clara',
    username: 'anac',
    role: 'member',
    joinedAt: '2024-07-08',
    online: true,
  },
  {
    id: 4,
    name: 'Lucas Martins',
    username: 'lucasm',
    role: 'member',
    joinedAt: '2024-10-21',
    online: false,
  },
  {
    id: 5,
    name: 'João Neto',
    username: 'joaon',
    role: 'member',
    joinedAt: '2025-01-03',
    online: true,
  },
  {
    id: 6,
    name: 'Beatriz Lima',
    username: 'beal',
    role: 'moderator',
    joinedAt: '2023-12-18',
    online: false,
  },
  {
    id: 7,
    name: 'Pedro Santos',
    username: 'pedros',
    role: 'member',
    joinedAt: '2025-02-14',
    online: true,
  },
  {
    id: 8,
    name: 'Clara Ribeiro',
    username: 'clarar',
    role: 'member',
    joinedAt: '2024-11-30',
    online: false,
  },
  {
    id: 9,
    name: 'Rafael Gomes',
    username: 'rafaelg',
    role: 'member',
    joinedAt: '2024-08-05',
    online: true,
  },
  {
    id: 10,
    name: 'Marcos Vinícius',
    username: 'mv',
    role: 'member',
    joinedAt: '2024-09-29',
    online: false,
  },
]

const PAGE_SIZE = 6

const ficticioAdminComunidade = true
const ficticioModeradorComunidade = true

const UsersCommunityDialog = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all')
  const [selectedRemove, setSelectedRemove] = useState<number[]>([])
  const [_, setSelectedMuted] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<User[]>(sampleUsers)

  // responsavel por filtrar os usuários com base na no nome e cargo
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (!q) return true
      return (
        u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      )
    })
  }, [users, query, roleFilter])

  // responsavel por calcular e mostrar uma certa quantidade de usuários  por pagina
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // responsavel por distribuir os usuários por pagina
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // responsavel por selecionar ou desselecionar um item
  const toggleSelectMuted = (id: number) => {
    setSelectedMuted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // responsavel por selecionar ou desselecionar todos os itens da página
  const selectAllPage = () => {
    const ids = pageItems.map((u) => u.id)
    const allSelected = ids.every((id) => selectedRemove.includes(id))
    setSelectedRemove((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    )
  }

  // responsavel por remover os itens selecionados
  const removeSelected = () => {
    if (!selectedRemove.length) return
    setUsers((prev) => prev.filter((u) => !selectedRemove.includes(u.id)))
    setSelectedRemove([])
  }

  // responsavel por promover um usuário
  const promote = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: u.role === 'member' ? 'moderator' : 'admin' }
          : u
      )
    )
  }

  // responsavel por demover um usuário
  const demote = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: 'member' } : u))
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* TRIGGER */}
        <TooltipComponent
          Tag={
            <DialogTrigger asChild>
              <div className="bg-linear-purple -mt-1 cursor-pointer rounded-full p-1.5 text-white transition-all hover:opacity-90">
                <Users className="h-5 w-5" />
              </div>
            </DialogTrigger>
          }
          description="Usuários da Comunidade"
        />

        {/* CONTENT */}
        <DialogContent className="h-[700px] w-[98%] overflow-y-auto rounded-xl border-none bg-white p-6 dark:bg-zinc-900 im:h-[800px] md:max-w-3xl">
          <DialogHeader>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                Membros da comunidade
              </DialogTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Lista completa de usuários — gerencie funções, convites e
                moderação.
              </p>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            {/* Barra de busca + filtro + botão convidar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center gap-3 sm:flex-row md:w-full">
                <div className="relative flex w-full items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <Input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setPage(1)
                    }}
                    placeholder="Buscar por nome ou usuário..."
                    className="w-full border-0 px-0 py-0 pl-2 text-sm focus:ring-0 dark:bg-transparent dark:text-zinc-100"
                  />
                </div>

                <Select
                  onValueChange={(v) => {
                    setRoleFilter(v as any)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 sm:w-44">
                    <SelectValue placeholder="Filtrar por função" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                    <SelectItem value="moderator">Moderadores</SelectItem>
                    <SelectItem value="member">Membros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="bg-linear-purple inline-flex items-center gap-2 text-white hover:opacity-90"
                onClick={() => alert('Tela de convite (implementar)')}
              >
                <UserPlus className="h-4 w-4" /> Convidar
              </Button>
            </div>

            <Separator className="dark:bg-zinc-800" />

            {/* Lista */}
            <div
              className={`h-[420px] space-y-3 overflow-y-auto ${pageItems.length === 0 ? 'flex items-center justify-center' : ''}`}
            >
              {pageItems.length > 0 ? (
                pageItems.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <div className="flex w-[120px] items-center gap-3 md:w-[500px]">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 font-semibold text-white">
                        {u.name
                          .split(' ')
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join('')}
                      </div>

                      <NavLink
                        to={`/perfil/${u.id}`}
                        className="flex min-w-0 flex-col"
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {u.name}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            @{u.username}
                          </span>
                          <span
                            className={`-mt-4 ml-2 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                : u.role === 'moderator'
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {u.role === 'admin' && (
                              <Crown className="h-3 w-3" />
                            )}
                            {u.role}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Entrou em {u.joinedAt}
                        </span>
                      </NavLink>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${u.online ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'}`}
                        title={u.online ? 'Online' : 'Offline'}
                      />

                      <div className="flex items-center gap-1">
                        {ficticioAdminComunidade && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => promote(u.id)}
                              title="Promover"
                            >
                              <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => demote(u.id)}
                              title="Demover"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {(ficticioAdminComunidade ||
                          ficticioModeradorComunidade) && (
                          <>
                            <TooltipComponent
                              Tag={
                                <Checkbox
                                  onClick={() => toggleSelectMuted(u.id)}
                                  icon={
                                    <VolumeOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  }
                                  className="h-5 w-5 rounded-md border border-zinc-300 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-50 data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white dark:border-zinc-600 dark:hover:bg-purple-900/30"
                                />
                              }
                              description="Silenciar usuário"
                            />

                            <ConfirmationRemoveUserDialog
                              userName={u.name}
                              onConfirm={() => {
                                setUsers((prev) =>
                                  prev.filter((x) => x.id !== u.id)
                                )
                                setSelectedRemove((s) =>
                                  s.filter((id) => id !== u.id)
                                )
                              }}
                              trigger={
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Nenhum membro encontrado.
                </div>
              )}
            </div>

            {/* Paginação + ações em massa */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between">
              {ficticioAdminComunidade && (
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Button variant="outline" onClick={selectAllPage}>
                    <CheckSquare className="h-4 w-4" /> Selecionar Todos
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={removeSelected}
                    disabled={!selectedRemove.length}
                  >
                    <Trash2 className="h-4 w-4" /> Remover (
                    {selectedRemove.length})
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800">
                <button
                  className="p-1 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <div className="px-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Página {page} / {pageCount}
                </div>
                <button
                  className="p-1 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Total de membros: {users.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Fechar
              </Button>
              <Button
                className="bg-linear-purple text-white"
                onClick={() => alert('Salvar alterações (implementar)')}
              >
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UsersCommunityDialog
