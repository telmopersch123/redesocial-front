import { useState } from 'react'
import { postsFicticiosGlobal } from '../../../../pages/FeedPage'
import type { Post } from '../../../../types'
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
import PostComponentDialog from '../../PostsComponent.tsx/PostComponentDialog'
import AcitivyComponent from './AcitivyComponent'
import NavbarConfig from './NavbarConfigComponent'
import OptionsCommunity from './OptionsCommunityComponent'
import SessionPerson from './SessionPerson'

interface DialogConfigProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  nomeUser?: string
  setNomeUser?: (nomeUser: string) => void
}

const savedVideos = [
  {
    id: '1',
    title: 'Como criar animações com Tailwind',
    thumbnail: 'https://via.placeholder.com/300x180?text=Video+1',
    duration: '12:45',
  },
  {
    id: '2',
    title: 'React + Shadcn para iniciantes',
    thumbnail: 'https://via.placeholder.com/300x180?text=Video+2',
    duration: '08:20',
  },
]

const likedVideos = [
  {
    id: '3',
    title: 'Criando UI moderna com Framer Motion',
    thumbnail: 'https://via.placeholder.com/300x180?text=Video+3',
    duration: '06:10',
  },
  {
    id: '4',
    title: 'Consumindo APIs REST com React',
    thumbnail: 'https://via.placeholder.com/300x180?text=Video+4',
    duration: '10:25',
  },
]

export function ConfigDialog({
  open,
  setOpen,
  nomeUser,
  setNomeUser,
}: DialogConfigProps) {
  const [novoComentario, setNovoComentario] = useState('')
  const [posts, setPosts] = useState<Post[]>([postsFicticiosGlobal[2]])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [anonMode, setAnonMode] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [tab, setTab] = useState(1)

  const handleTwoFactorChange = (checked: boolean) => {
    if (!checked && twoFactor) {
      setConfirmDialogOpen(true)
    } else {
      setTwoFactor(checked)
    }
  }

  const confirmDisableTwoFactor = () => {
    setTwoFactor(false)
    setConfirmDialogOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button className="relative bottom-1 right-1 z-10 w-[calc(100vw-5rem)] cursor-pointer select-none rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-[#6b4de6] hover:shadow-lg im:absolute im:w-auto 2xl:relative 2xl:mt-20">
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
              confirmDialogOpen={confirmDialogOpen}
              setConfirmDialogOpen={setConfirmDialogOpen}
            />
          ) : tab === 2 ? (
            <OptionsCommunity />
          ) : (
            tab === 3 && (
              <AcitivyComponent
                setDialogOpen={setDialogOpen}
                savedVideos={savedVideos}
                likedVideos={likedVideos}
              />
            )
          )}

          {tab === 1 && (
            <DialogFooter className="mt-6">
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
      {posts.map((valuePost) => (
        <>
          <div key={valuePost.id} className="absolute">
            <PostComponentDialog
              valuePost={valuePost}
              novoComentario={novoComentario}
              setNovoComentario={setNovoComentario}
              setPosts={setPosts}
              posts={posts}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          </div>
        </>
      ))}
    </>
  )
}
