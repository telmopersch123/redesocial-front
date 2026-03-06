import { useState } from 'react'

import { Lock, UserRoundPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { joinCommunity } from '../../../services/authService'
import { Button } from '../../ui/button'

interface JoinButtonProps {
  nameComunity: string
  communityId: number
  isPrivate: boolean
  // isMember: boolean
  onRefresh: () => void
}

export const JoinButton = ({
  nameComunity,
  communityId,
  isPrivate,
  // isMember,
  onRefresh,
}: JoinButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleAction = async () => {
    setIsLoading(true)
    try {
      const response = await joinCommunity(communityId)
      console.log(response)
      if (!response.error) {
        toast.success(`Bem-vindo à comunidade! ${nameComunity}`)
        onRefresh()
      } else {
        navigate('/auth')
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Se for pública e não for membro, botão de "Participar"
  return (
    <Button
      disabled={isPrivate || isLoading}
      onClick={handleAction}
      className={`w-full gap-2 !rounded-xl font-bold transition-all active:scale-95 ${
        isPrivate
          ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800'
          : 'bg-linear-purple text-white shadow-md hover:shadow-purple-500/20'
      }`}
    >
      {isPrivate ? (
        <Lock className="h-4 w-4" />
      ) : (
        <UserRoundPlus className="h-4 w-4" />
      )}
      {isPrivate ? 'Comunidade Privada' : 'Participar agora'}
    </Button>
  )
}
