import { useState } from 'react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Label } from '../../ui/label'
import { Separator } from '../../ui/separator'
import { Switch } from '../../ui/switch'
import ConfirmDialog2Etapas from './ConfirmTwoStepsDialog'
import DialogEditNome from './EditNomeDialog'

interface DialogConfigProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  nomeUser?: string
  setNomeUser?: (nomeUser: string) => void
}

export function ConfigDialog({
  open,
  setOpen,
  nomeUser,
  setNomeUser,
}: DialogConfigProps) {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [anonMode, setAnonMode] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleTwoFactorChange = (checked: boolean) => {
    if (!checked && twoFactor) {
      setConfirmDialogOpen(true)
    } else {
      setTwoFactor(checked)
    }
  }

  const confirmDisableTwoFactor = () => {
    setTwoFactor(false)
    setConfirmDialogOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button className="relative bottom-1 right-1 z-10 w-[calc(100vw-5rem)] cursor-pointer select-none rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-[#6b4de6] hover:shadow-lg im:absolute im:w-auto 2xl:relative 2xl:mt-20">
              Configurações
            </Button>
          </div>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 bg-black/0 backdrop-blur-sm" />
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] overflow-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Configurações da Conta
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Personalize sua experiência e preferências na rede social.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

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
                    nomeUser={nomeUser || ''}
                    setNomeUser={setNomeUser || (() => {})}
                  />
                </div>
              </div>
            </div>

            {/* Seção de Aparência */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-medium text-foreground">
                Aparência
              </h3>

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
                  <Label className="text-sm font-medium">
                    Notificações push
                  </Label>
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
              <h3 className="text-base font-medium text-foreground">
                Segurança
              </h3>

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
                    confirmDialogOpen={confirmDialogOpen}
                    setConfirmDialogOpen={setConfirmDialogOpen}
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
              <h3 className="text-base font-medium text-foreground">
                Privacidade
              </h3>

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
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button className="bg-linear-purple transition-shadow hover:shadow-md">
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
