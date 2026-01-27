import toast from 'react-hot-toast'
import { UserRoleToast } from '../utils/components/alertToast'

export type Params = {
  userName: string
  action: 'promote' | 'demote' | 'remove'
  message?: string | undefined
  visible?: boolean
}

export function showUserRoleToast({ userName, action, message }: Params) {
  toast.custom(
    (t) => (
      <UserRoleToast
        visible={t.visible}
        userName={userName}
        action={action}
        message={message}
      />
    ),
    { duration: 4000 }
  )
}
