import toast from 'react-hot-toast'
import { UserRoleToast } from '../utils/components/alertToast'

export type Params = {
  userName: string
  action: 'promote' | 'demote' | 'remove'
  message?: string | undefined
}

export function showUserRoleToast({ userName, action, message }: Params) {
  toast.custom(
    <UserRoleToast userName={userName} action={action} message={message} />,
    {
      duration: 4000,
    }
  )
}
