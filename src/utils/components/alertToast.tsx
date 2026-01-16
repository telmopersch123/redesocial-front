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
