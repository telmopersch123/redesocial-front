import { AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

type AlertType = 'error' | 'success'

export function alertMessage(
  title: string,
  message: string | null,
  type: AlertType
) {
  const isError = type === 'error'

  return toast(
    () => (
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
          <p className="text-xs leading-snug text-gray-700">{message}</p>
        )}
      </div>
    ),
    {
      style: {
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: `1px solid ${isError ? '#f5c2c2' : '#a7f3d0'}`,
      },
      duration: 5000,
      position: 'top-right',
    }
  )
}
