import { Check, Copy, UserPlus } from 'lucide-react'
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
  const [invite, setInvite] = useState<any>(null)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const { communityName } = useParams()

  const handleInvite = async () => {
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
            Convite Gerado
          </DialogTitle>
        </DialogHeader>

        {invite && (
          <div className="space-y-4 py-2">
            <div>
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                Link do convite:
              </p>

              <div className="flex items-center gap-2 rounded-lg border p-2 dark:border-gray-700">
                <input
                  readOnly
                  value={inviteLink}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none dark:text-white"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvitationDialog
