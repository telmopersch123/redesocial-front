import { useEffect, useState } from 'react'

import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog'

import { useAuth } from '../../../../context/getMe'
import { usePosts } from '../../../../context/PostsContext'
import { MessagePerson } from '../../../../utils/components/MessagePerson'
import PostComponentDialog from '../../PostsComponent.tsx/PostComponentDialog'
import { ActivityComponent } from './AcitivyComponent'
import NavbarConfig from './NavbarConfigComponent'
import OptionsCommunity from './OptionsCommunityComponent'
import SessionPerson from './SessionPerson'

interface DialogConfigProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  nomeUser?: string
  setLocalNome?: (nomeUser: string) => void
}

interface OpenOnlyProps {
  index: number
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean[]>>
}
export const openOnly = ({ index, setOpenDialog }: OpenOnlyProps) => {
  setOpenDialog((prev) => prev.map((_, i) => i === index))
}

export function ConfigDialog({
  open,
  setOpen,
  nomeUser,
  setLocalNome,
}: DialogConfigProps) {
  const { posts, setPosts, selectedPost } = usePosts()
  const [openDialogPost, setOpenDialogPost] = useState(false)
  const [novoComentario, setNovoComentario] = useState('')

  const [twoFactor, setTwoFactor] = useState(false)

  const [tab, setTab] = useState(1)
  const [openDialog, setOpenDialog] = useState([false, false, false, false])
  const { user } = useAuth()
  useEffect(() => {
    if (user?.confirmTwoSteps && user?.confirmTwoSteps.two_factor_enabled) {
      setTwoFactor(true)
    } else {
      setTwoFactor(false)
    }
  }, [user])
  const handleTwoFactorChange = async (checked: boolean) => {
    if (!checked) {
      openOnly({ index: 2, setOpenDialog })
      return
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me/update-2fa`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ twoFactorEnabled: true }),
        }
      )
      if (!res.ok) {
        throw new Error('Erro ao ativar 2fa')
      }
      if (res.ok) {
        setTwoFactor(true)
        MessagePerson('Sucesso', 'Autenticação em duas etapas ativada!', 'success')

      } else {
        MessagePerson('Erro ao ativar 2FA', null, 'error')

      }
    } catch (error) {
      console.log(error)
    }
  }
  const confirmDisableTwoFactor = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me/update-2fa`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ twoFactorEnabled: false }),
        }
      )
      if (res.ok) {
        setTwoFactor(false)
        setOpenDialog((prev) => prev.map(() => false))
        MessagePerson('Sucesso', 'Autenticação em duas etapas desativada!', 'success')

      }
    } catch (error) {
      MessagePerson('Erro ao desativar 2FA', null, 'error')

    }
  }

  return (
    <>
      {openDialog.some((item) => item === true) && (
        <div className="fixed inset-0 z-[60] h-screen w-screen bg-black/50" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button className="-mt-5 mb-7 w-[90vw] cursor-pointer select-none rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-purple-600 hover:shadow-lg dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-purple-400 om:mb-0 om:mt-0 om:w-auto 2xl:relative">
              Configurações
            </Button>
          </div>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 bg-black/0 backdrop-blur-sm" />
        <DialogContent className="flex max-h-[90vh] min-h-[90vh] w-[95vw] max-w-[95vw] flex-col overflow-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Configurações da Conta
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Personalize sua experiência e preferências na rede social.
            </DialogDescription>
            <NavbarConfig activeId={tab} setActiveId={setTab} />
          </DialogHeader>

          {tab === 1 ? (
            <SessionPerson
              nomeUser={nomeUser || ''}
              twoFactor={twoFactor}
              handleTwoFactorChange={handleTwoFactorChange}
              confirmDisableTwoFactor={confirmDisableTwoFactor}
              open={openDialog}
              setOpen={setOpenDialog}
              setLocalNome={setLocalNome}
            />
          ) : tab === 2 ? (
            <OptionsCommunity tab={tab} />
          ) : (
            tab === 3 && (
              <ActivityComponent
                openDialogPost={openDialogPost}
                setOpenDialogPost={setOpenDialogPost}
              />
            )
          )}

          {tab === 1 && (
            <DialogFooter className="mt-6 gap-2">
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
          
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {selectedPost && (
        <div className="absolute hidden">
          <PostComponentDialog
            valuePosts={selectedPost}
            novoComentario={novoComentario}
            setNovoComentario={setNovoComentario}
            setPosts={setPosts}
            posts={posts}
            open={openDialogPost}
            onOpenChange={setOpenDialogPost}
          />
        </div>
      )}
    </>
  )
}
