import { useTheme } from 'next-themes'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/getMe'
import { socket } from '../../../../services/socket'
import { MessagePerson } from '../../../../utils/components/MessagePerson'
import { Button } from '../../../ui/button'
import { Label } from '../../../ui/label'
import { Switch } from '../../../ui/switch'
import ConfirmDialog2Etapas from './ConfirmTwoStepsDialog'
import DialogConfirmRemoveAccount from './DialogConfirmRemoveAccount'
import DialogEditNome from './EditNomeDialog'
import ListUsersBlock from './ListUsersBlock'
interface SessionPersonProps {
  nomeUser?: string
  twoFactor: boolean
  handleTwoFactorChange: (value: boolean) => void
  confirmDisableTwoFactor: () => void
  open: boolean[]
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  setLocalNome?: (nomeUser: string) => void
}

const SessionPerson = ({
  nomeUser,
  twoFactor,
  handleTwoFactorChange,
  confirmDisableTwoFactor,
  open,
  setOpen,
  setLocalNome,
}: SessionPersonProps) => {
  const [showViewStatus, setShowViewStatus] = useState(true)
  const [anonMode, setAnonMode] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [mentions, setMentions] = useState(true)

  const { theme, setTheme } = useTheme()
  const user = useAuth()

  useEffect(() => {
    if (user.user) {
      setShowStatus(user.user.showOnlineStatus ?? false)
      setShowViewStatus(user.user.showViewStatus ?? false)
      setNotifications(user.user.notificationsEnabled ?? false)
      setAnonMode(user.user.anonMode ?? false)
      setMentions(user.user.mentionPermissed ?? false)
    }
  }, [user.user, open])

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Seção de Perfil */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/40 p-4 shadow-sm transition-all hover:bg-muted/60 hover:shadow-md">
            <div className="flex flex-col items-start">
              <Label
                htmlFor="profileName"
                className="text-sm font-medium tracking-wide text-foreground/80"
              >
                Nome de perfil
              </Label>

              <p
                id="profileName"
                className="my-1 flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-medium text-foreground ring-offset-background"
              >
                @{nomeUser || 'usuario'}
              </p>

              <p className="text-xs text-muted-foreground/80">
                Este é o seu identificador exclusivo. É assim que as pessoas
                encontrarão e mencionarão você.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DialogEditNome
                open={open[3]}
                setOpen={setOpen}
                nomeUser={nomeUser || ''}
                setLocalNome={setLocalNome}
              />
            </div>
          </div>
        </div>

        {/* Seção de Aparência */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">Aparência</h3>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">Modo escuro</Label>
              <p className="text-xs text-muted-foreground">
                Ativar tema escuro no aplicativo.
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light')
              }}
            />
          </div>
        </div>

        {/* Seção de Notificações */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">
            Notificações
          </h3>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">Notificações push</Label>
              <p className="text-xs text-muted-foreground">
                Receba alertas sobre mensagens e atividades.
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={async (checked) => {
                setNotifications(checked)
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/auth/me/statusUser`,
                  {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ notifications: checked }),
                  }
                )
                if (res.ok) {
                  setNotifications(checked)
                  if (user.user && user.setUser) {
                    user.setUser({
                      ...user.user,
                      notificationsEnabled: checked,
                    })
                  }
                } else {
                  MessagePerson('Erro ao atualizar notificações', null, 'error')

                  setNotifications(!checked)
                }
              }}
            />
          </div>
        </div>

        {/* Segurança */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">Segurança</h3>

          <div className="flex flex-col rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Autenticação em duas etapas
                </Label>
                <p className="text-xs text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta.
                </p>
              </div>
              <div>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={handleTwoFactorChange}
                />
              </div>
              <ConfirmDialog2Etapas
                open={open[2]}
                setOpen={setOpen}
                confirmDisableTwoFactor={confirmDisableTwoFactor}
              />
            </div>

            {twoFactor && (
              <div className="mt-3 rounded-lg border border-border/40 bg-background/70 p-3 text-sm text-muted-foreground shadow-inner">
                <p className="mb-1 flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Sua conta está protegida
                </p>
                <p>
                  O sistema solicitará um código enviado ao seu e-mail sempre
                  que detectar um novo login.
                </p>
                <Button
                  onClick={() => handleTwoFactorChange(false)}
                  variant="link"
                  className="h-auto p-0 text-xs text-red-500 hover:text-red-600"
                >
                  Desativar proteção extra
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Privacidade (Modo Anônimo e Status Online) */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">Privacidade</h3>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">Modo anônimo</Label>
              <p className="text-xs text-muted-foreground">
                Oculta seu nome em publicações e interações públicas.
              </p>
            </div>
            <Switch
              checked={anonMode}
              onCheckedChange={async (checked) => {
                setAnonMode(checked)

                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/auth/me/statusUser`,
                  {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ anonMode: checked }),
                  }
                )
                if (res.ok) {
                  setAnonMode(checked)
                  if (user.user && user.setUser) {
                    user.setUser({
                      ...user.user,
                      anonMode: checked,
                    })
                  }
                } else {
                  MessagePerson('Erro ao atualizar privacidade', null, 'error')
                  setAnonMode(!checked)
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">
                Mostrar status online
              </Label>
              <p className="text-xs text-muted-foreground">
                Permitir que outros vejam quando você está ativo.
              </p>
            </div>
            <Switch
              checked={showStatus}
              onCheckedChange={async (checked) => {
                const newStatus = checked
                setShowStatus(newStatus)
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/auth/me/statusUser`,
                  {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      showOnlineStatus: newStatus,
                    }),
                  }
                )

                if (res.ok) {
                  if (user.user && user.setUser) {
                    socket.emit('user:update:privacy', {
                      showOnlineStatus: newStatus,
                    })
                    user.setUser({
                      ...user.user,
                      showOnlineStatus: newStatus,
                    })
                  }
                } else {
                  MessagePerson('Erro ao atualizar privacidade', null, 'error')

                  setShowStatus(!newStatus)
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">
                Mostrar visualização de mensagens
              </Label>
              <p className="text-xs text-muted-foreground">
                Permitir que outros vejam quando você visualiza mensagens.
              </p>
            </div>
            <Switch
              checked={showViewStatus}
              onCheckedChange={async (checked) => {
                setShowViewStatus(checked)
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/auth/me/statusUser`,
                  {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ showViewStatus: checked }),
                  }
                )

                if (res.ok) {
                  if (user.user && user.setUser) {
                    // socket.emit('user:update:privacy', {
                    //   showViewStatus: checked,
                    // })
                    user.setUser({
                      ...user.user,
                      showViewStatus: checked,
                    })
                  }
                } else {
                  MessagePerson('Erro ao atualizar privacidade', null, 'error')

                  setShowViewStatus(!checked)
                }
              }}
            />
          </div>
          <div>
            <ListUsersBlock open={open[0]} setOpen={setOpen} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 p-3 shadow-sm transition-all hover:shadow-md">
            <div>
              <Label className="text-sm font-medium">Permitir Menção</Label>
              <p className="text-xs text-muted-foreground">
                Permitir que outras pessoas te mencionem em postagens.
              </p>
            </div>
            <Switch
              checked={mentions}
              onCheckedChange={async (checked) => {
                setMentions(checked)
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/auth/me/statusUser`,
                  {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mentionPermissed: checked }),
                  }
                )
                if (res.ok) {
                  if (user.user && user.setUser) {
                    user.setUser({
                      ...user.user,
                      mentionPermissed: checked,
                    })
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Seção de Exclusão da Conta */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">Conta</h3>

          <div className="flex items-start justify-between rounded-xl border border-red-300/40 bg-red-50/40 p-4 shadow-sm transition-all hover:bg-red-50 hover:shadow-md dark:border-red-900/40 dark:bg-red-900/20 dark:hover:bg-red-900/30">
            <div className="max-w-[75%]">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Remover conta
              </p>

              <p className="mt-1 text-xs leading-relaxed text-red-600/80 dark:text-red-400/70">
                Sua conta será permanentemente excluída, incluindo posts,
                mensagens e todas as informações associadas.
              </p>
            </div>

            <DialogConfirmRemoveAccount open={open[1]} setOpen={setOpen} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SessionPerson
