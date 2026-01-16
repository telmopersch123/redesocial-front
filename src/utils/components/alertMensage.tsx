import toast from 'react-hot-toast'
import { AlertToast } from './alertToast'

type AlertType = 'error' | 'success'

export function alertMessage(
  title: string,
  message: string | null,
  type: AlertType
) {
  return toast(
    () => <AlertToast title={title} message={message} type={type} />,
    {
      className:
        'toast-custom bg-white text-black dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg rounded-xl p-4',
      duration: 5000,
      position: 'top-right',
    }
  )
}
