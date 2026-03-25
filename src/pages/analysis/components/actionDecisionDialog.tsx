import { ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'

interface ActionDecisionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userName: string | undefined
  handleApplySevenDaysBan: () => void
  handleApplyPermBan: () => void
}

export type ActionType = 'TEMP_BAN' | 'PERM_BAN'

const OPTIONS: {
  value: ActionType
  title: string
  desc: string
  color: string
}[] = [
  {
    value: 'TEMP_BAN',
    title: 'Suspensão Temporária',
    desc: 'Bloqueio por 7 dias.',
    color: 'orange',
  },
  {
    value: 'PERM_BAN',
    title: 'Banimento Permanente',
    desc: 'Exclusão definitiva.',
    color: 'red',
  },
]

const ACTIVE_STYLES: Record<string, string> = {
  orange: 'border-orange-500 bg-orange-50/10',
  red: 'border-red-600 bg-red-50/10',
}

const DOT_STYLES: Record<string, string> = {
  orange: 'bg-orange-500',
  red: 'bg-red-600',
}

export function ActionDecisionDialog({
  isOpen,
  onOpenChange,
  userName,
  handleApplySevenDaysBan,
  handleApplyPermBan,
}: ActionDecisionDialogProps) {
  const [decision, setDecision] = useState<ActionType>('TEMP_BAN')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md border-zinc-200 dark:border-zinc-800"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="h-5 w-5" />
            Veredito de Moderação
          </DialogTitle>
          <DialogDescription>
            Punição para <strong>{userName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {OPTIONS.map((opt) => {
            const isActive = decision === opt.value
            return (
              <div
                key={opt.value}
                onClick={() => setDecision(opt.value)}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                  isActive
                    ? ACTIVE_STYLES[opt.color]
                    : 'border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{opt.title}</span>
                  <span className="text-xs text-zinc-500">{opt.desc}</span>
                </div>

                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive
                      ? `border-${opt.color}-500`
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                >
                  {isActive && (
                    <div
                      className={`h-2 w-2 rounded-full ${DOT_STYLES[opt.color]}`}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              if (decision === 'TEMP_BAN') {
                handleApplySevenDaysBan()
              } else {
                handleApplyPermBan()
              }

              onOpenChange(false)
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
