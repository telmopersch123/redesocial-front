import { useState } from 'react'

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

import { usePosts } from '../../../../context/PostsContext'
import PostComponentDialog from '../../PostsComponent.tsx/PostComponentDialog'
import { ActivityComponent } from './AcitivyComponent'
import NavbarConfig from './NavbarConfigComponent'
import OptionsCommunity from './OptionsCommunityComponent'
import SessionPerson from './SessionPerson'

interface DialogConfigProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  nomeUser?: string
  setNomeUser?: (nomeUser: string) => void
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
  setNomeUser,
}: DialogConfigProps) {
  const { posts, setPosts } = usePosts()
  const [openDialogPost, setOpenDialogPost] = useState(false)
  const [novoComentario, setNovoComentario] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [anonMode, setAnonMode] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [tab, setTab] = useState(1)
  const [openDialog, setOpenDialog] = useState([false, false, false, false])
  const handleTwoFactorChange = (checked: boolean) => {
    if (!checked && twoFactor) {
      openOnly({ index: 2, setOpenDialog })
    } else {
      setTwoFactor(checked)
    }
  }

  const confirmDisableTwoFactor = () => {
    setTwoFactor(false)
    setOpenDialog((prev) => prev.map(() => false))
  }

  return (
    <>
      {openDialog.some((item) => item === true) && (
        <div className="fixed inset-0 z-[60] h-screen w-screen bg-black/50" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button className="relative bottom-1 right-1 z-10 w-[calc(100vw-5rem)] cursor-pointer select-none rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-purple-600 hover:shadow-lg dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-purple-400 im:absolute im:w-auto 2xl:relative 2xl:mt-20">
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
              setNomeUser={setNomeUser || (() => {})}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              notifications={notifications}
              setNotifications={setNotifications}
              anonMode={anonMode}
              setAnonMode={setAnonMode}
              showStatus={showStatus}
              setShowStatus={setShowStatus}
              twoFactor={twoFactor}
              handleTwoFactorChange={handleTwoFactorChange}
              confirmDisableTwoFactor={confirmDisableTwoFactor}
              open={openDialog}
              setOpen={setOpenDialog}
            />
          ) : tab === 2 ? (
            <OptionsCommunity />
          ) : (
            tab === 3 && (
              <ActivityComponent setOpenDialogPost={setOpenDialogPost} />
            )
          )}

          {tab === 1 && (
            <DialogFooter className="mt-6 gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button className="bg-linear-purple transition-shadow hover:shadow-md">
                Salvar alterações
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      {posts && (
        <div className="absolute hidden">
          <PostComponentDialog
            valuePost={posts[0]}
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
