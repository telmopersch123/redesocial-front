import toast from 'react-hot-toast'
import { UserRoleToast } from '../utils/components/alertToast'

type Params = {
  userName: string
  action: 'promote' | 'demote' | 'remove'
}

export function showUserRoleToast({ userName, action }: Params) {
  toast.custom(<UserRoleToast userName={userName} action={action} />, {
    duration: 4000,
  })
}
