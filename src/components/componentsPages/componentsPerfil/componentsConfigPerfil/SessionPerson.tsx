import type React from 'react'
import { useState } from 'react'
import { Button } from '../../../ui/button'
import { Label } from '../../../ui/label'
import { Switch } from '../../../ui/switch'
import ConfirmDialog2Etapas from './ConfirmTwoStepsDialog'
import DialogConfirmRemoveAccount from './DialogConfirmRemoveAccount'
import DialogEditNome from './EditNomeDialog'
import ListUsersBlock from './ListUsersBlock'
interface SessionPersonProps {
  nomeUser?: string
  setNomeUser?: (nomeUser: string) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  notifications: boolean
  setNotifications: (value: boolean) => void
  twoFactor: boolean
  handleTwoFactorChange: (value: boolean) => void
  confirmDisableTwoFactor: () => void
  anonMode: boolean
  setAnonMode: (value: boolean) => void
  showStatus: boolean
  setShowStatus: (value: boolean) => void
  open: boolean[]
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
}

const SessionPerson = ({
  nomeUser,
  setNomeUser,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  twoFactor,
  handleTwoFactorChange,
  confirmDisableTwoFactor,
  anonMode,
  setAnonMode,
  showStatus,
  setShowStatus,
  open,
  setOpen,
}: SessionPersonProps) => {
  const [mentions, setMentions] = useState(true)
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
                className="mt-1 rounded-sm bg-foreground/5 p-2 text-lg font-semibold text-foreground"
              >
                {nomeUser || 'Usuário'}
              </p>

              <p className="text-xs text-muted-foreground/80">
                Este nome será exibido publicamente no seu perfil.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DialogEditNome
                open={open[3]}
                setOpen={setOpen}
                nomeUser={nomeUser || ''}
                setNomeUser={setNomeUser || (() => {})}
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
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
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
              onCheckedChange={setNotifications}
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
                <p className="mb-1 font-medium text-foreground">
                  ⚠️ Proteja sua conta
                </p>
                <p>
                  Um código será enviado ao seu e-mail cadastrado sempre que
                  você fizer login. Certifique-se de que seu endereço esteja
                  atualizado.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-fit text-xs font-medium"
                >
                  Ativar a verificação em duas etapas
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
            <Switch checked={anonMode} onCheckedChange={setAnonMode} />
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
            <Switch checked={showStatus} onCheckedChange={setShowStatus} />
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
            <Switch checked={mentions} onCheckedChange={setMentions} />
          </div>
        </div>

        {/* Seção de Exclusão da Conta */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">Conta</h3>

          <div className="flex items-start justify-between rounded-xl border border-red-300/40 bg-red-50/40 p-4 shadow-sm transition-all hover:bg-red-50 hover:shadow-md">
            <div className="max-w-[75%]">
              <p className="text-sm font-medium text-red-700">Remover conta</p>
              <p className="mt-1 text-xs leading-relaxed text-red-600/80">
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
