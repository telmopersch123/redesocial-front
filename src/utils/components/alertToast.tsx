import { AlertCircle, CheckCircle2 } from 'lucide-react'

type AlertToastProps = {
  title: string
  message?: string | null
  type: 'error' | 'success'
}

export function AlertToast({ title, message, type }: AlertToastProps) {
  const isError = type === 'error'

  return (
    <div className="flex min-w-[250px] flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        {isError ? (
          <AlertCircle className="h-6 w-6 text-red-500" />
        ) : (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        )}

        <h2
          className={`text-sm font-semibold ${
            isError ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {title}
        </h2>
      </div>

      {message && (
        <p className="text-xs leading-snug text-gray-700 dark:text-gray-200">
          {message}
        </p>
      )}
    </div>
  )
}

import { Crown, RotateCcw, Trash2 } from 'lucide-react'

export function UserRoleToast({ userName, action, message }: Params) {
  const isPromote = action === 'promote'
  const isRemove = action === 'remove'

  return (
    <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-zinc-800 shadow-lg dark:border-indigo-500/30 dark:bg-[#0b1020] dark:text-zinc-100">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          isPromote
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300'
            : isRemove
              ? 'bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-300'
              : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'
        } `}
      >
        {isPromote ? (
          <Crown className="h-5 w-5" />
        ) : isRemove || message ? (
          <Trash2 className="h-5 w-5" />
        ) : (
          <RotateCcw className="h-5 w-5" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{userName}</span>
        <span className="text-xs opacity-80">
          {!message
            ? isPromote
              ? 'foi promovido a moderador'
              : isRemove
                ? 'foi removido da comunidade'
                : 'foi rebaixado para membro'
            : message}
        </span>
      </div>
    </div>
  )
}

import { CheckCircle, XCircle } from 'lucide-react'
import type { Params } from '../../Helpers/showUserRoleToast'

type ToastType = 'PROMOTION' | 'DEMOTION'

export function AlertCommunityRoleToast({
  type,
  message,
  onAction,
}: {
  type: ToastType
  message: string
  onAction: () => void
}) {
  const isPromotion = type === 'PROMOTION'

  return (
    <div
      className={
        'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ' +
        (isPromotion
          ? 'border-indigo-200 bg-white text-zinc-800 dark:border-indigo-500/30 dark:bg-[#0b1020] dark:text-zinc-100'
          : 'border-red-200 bg-white text-zinc-800 dark:border-red-500/30 dark:bg-[#0b1020] dark:text-zinc-100')
      }
    >
      {isPromotion ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}

      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {isPromotion ? 'Promoção de Cargo!' : 'Alteração de Cargo'}
        </span>
        <span className="text-xs opacity-80">{message}</span>
      </div>

      <button
        onClick={onAction}
        className={
          'ml-auto rounded px-3 py-1 text-xs text-white ' +
          (isPromotion ? 'bg-indigo-500' : 'bg-red-500')
        }
      >
        {isPromotion ? 'Lido' : 'Ok'}
      </button>
    </div>
  )
}
