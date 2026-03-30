import toast from 'react-hot-toast'
import { AlertToast } from './alertToast'

export function MessagePerson(
  title: string,
  message: string | null,
  type: 'error' | 'success' | 'warning' | 'info'
) {
  const typeStyles = {
    success: '!border-l-green-500 shadow-green-500/10',
    error: '!border-l-red-500 shadow-red-500/10',
    warning: '!border-l-yellow-500 shadow-yellow-500/10',
    info: '!border-l-blue-500 shadow-blue-500/10',
  }

  return toast(
    () => <AlertToast title={title} message={message} type={type} />,
    {
      className: ` 

        toast-custom 
        relative overflow-hidden
        bg-white text-black dark:bg-[#1a1a1a] dark:text-white  
        border border-gray-200 dark:border-gray-700
        border-l-4
        ${typeStyles[type] || 'border-l-gray-500'}
        shadow-xl rounded-xl p-4
      `
        .replace(/\s+/g, ' ')
        .trim(),
      duration: type === 'error' ? 7000 : 5000,
      position: 'top-right',
    }
  )
}
