import { AlertCircle, Edit2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/getMe'

import { useMyProfile } from '../../../../context/MyProfileContext'
import { useLimitForms } from '../../../../hooks/useLimitForms'
import { MessagePerson } from '../../../../utils/components/MessagePerson'
import { MessageForms } from '../../../formCustomer/MessageForms'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'
import { Input } from '../../../ui/input'

interface DialogEditNomeProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  nomeUser: string | null
  setLocalNome?: (nomeUser: string) => void
}

const EditNomeDialog = ({
  nomeUser,
  open,
  setOpen,
  setLocalNome,
}: DialogEditNomeProps) => {
  const nameUserControl = useLimitForms(30)
  const [isUpdating, setIsUpdating] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [tempNome, setTempNome] = useState(nomeUser || '')
  const [originalName, setOriginalName] = useState<string | null>(null)

  const { setNomeUser } = useMyProfile()
  const { setUser, user } = useAuth()

  useEffect(() => {
    if (open) {
      setTempNome(nomeUser || '')
    }
  }, [open, nomeUser])
  const handleEditName = async () => {
    setIsUpdating(true)
    setBackendError(null)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me/update-name-user`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: tempNome }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        const errorMsg = data.error || 'Erro ao atualizar nome'
        setBackendError(errorMsg)

        return
      }

      MessagePerson('Sucesso', 'Nome alterado com sucesso', 'success')

      setOpen((prev) => prev.map(() => false))
      setBackendError(null)
      setNomeUser(data.newName)
      if (setLocalNome) {
        setLocalNome(data.newName)
      }
      if (user) {
        setUser({
          ...user,
          name_at: data.newName,
        })
      }
    } catch (error) {
      console.error('Erro ao editar o nome', error)
      setBackendError(
        'Falha na conexão com o servidor. Tente novamente mais tarde.'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (open && originalName === null) {
      setOriginalName(tempNome)
    }
    if (!open && originalName !== null && setLocalNome) {
      setLocalNome(originalName)
      setOriginalName(null)
    }
  }, [open, nomeUser])

  const handleCancel = () => {
    if (originalName !== null && setLocalNome) {
      setLocalNome(originalName)
    }
    setBackendError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          handleCancel()
          setOpen((prev) => prev.map((_, i) => i === 3))
        } else {
          setOpen((prev) => prev.map(() => false))
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[70] w-[90%] rounded-md sm:w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar nome</DialogTitle>
          <DialogDescription>
            Escolha um nome que represente você. Ele será sua identidade pública
            por aqui.
          </DialogDescription>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="font-medium">
              Importante: após a alteração, você só poderá alterar novamente em
              7 dias.
            </p>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <Input
            disabled={isUpdating}
            value={tempNome}
            onChange={(e) => {
              const value = e.target.value.toLowerCase().replace(/\s/g, '')
              if (value.length > 31) return
              setTempNome(value)
              if (setLocalNome) setLocalNome(value)
              nameUserControl.handleChange({
                ...e,
                target: { ...e.target, value },
              })

              if (backendError) setBackendError(null)
            }}
          />
          {backendError && (
            <div className="flex w-full items-center gap-2 rounded-md bg-red-50 p-2 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {backendError}
            </div>
          )}
          <MessageForms
            error={nameUserControl.error}
            valueLength={nameUserControl.value.length}
            maxLength={nameUserControl.maxLength}
          />
        </div>

        <DialogFooter className="gap-3 sm:justify-start">
          <DialogClose asChild>
            <Button
              onClick={handleCancel}
              className="shadow-md"
              type="button"
              variant="secondary"
            >
              Fechar
            </Button>
          </DialogClose>
          <Button
            onClick={async () => {
              await handleEditName()
              setOriginalName(null)
            }}
            disabled={isUpdating || !tempNome || !!nameUserControl.error}
            className="bg-linear-purple w-full transition-shadow hover:shadow-md"
          >
            {isUpdating ? (
              <>
                Validando o novo nome
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              'Alterar Nome'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditNomeDialog
