import { Check, Copy, Loader2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { generateCommunityInvite } from '../../../services/authService'

interface MyComponentGenerateProps {
  communityIdFromState: number
}

const InvitationDialog = ({
  communityIdFromState,
}: MyComponentGenerateProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Novo estado de loading
  const [invite, setInvite] = useState<{
    token: string
    expiresAt: string
  } | null>(null)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const { communityName } = useParams()

  const handleInvite = async () => {
    setIsLoading(true)
    setInvite(null) // Reseta para mostrar o loading ao gerar um novo
    try {
      const data = await generateCommunityInvite(communityIdFromState)
      const token = data.token
      const safeName = encodeURIComponent(communityName || '')
      const link = `${window.location.origin}/comunidades/comunidades-do-usuario/${safeName}/${token}`

      setInviteLink(link)
      setInvite(data)
      setCopied(false)
    } catch (error) {
      toast.error('Não foi possível gerar o link de convite.')
      setOpen(false) // Fecha o dialog em caso de erro
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-linear-purple inline-flex items-center gap-2 text-white hover:opacity-90"
          onClick={handleInvite}
        >
          <UserPlus className="h-4 w-4" /> Convidar
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-md rounded-2xl border bg-white/90 backdrop-blur dark:bg-[#121212]/90">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isLoading ? 'Gerando convite...' : 'Convite Gerado'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              Link do convite:
            </p>

            {isLoading ? (
              <div className="flex animate-pulse items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex w-full items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            ) : invite?.token ? (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <input
                  readOnly
                  value={inviteLink}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none dark:text-white"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  Ops! algo deu errado com o link de convite
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvitationDialog
