import {
  ArrowLeft,
  Cloud,
  Flower2,
  Heart,
  Leaf,
  Moon,
  Sparkles,
  Star,
  Sun,
  UserRoundCheck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import BasicInformationComponent from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/BasicInformationComponent'
import { ConfigDialog } from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/ConfigDialog'
import UserPerfilComponent from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/UserPerfilComponent'
import { Button } from '../components/ui/button'

const ConfigPerfilPage = () => {
  const navigation = useNavigate()
  const [file, setFile] = useState<string | null>(null)
  const [nomeUser, setNomeUser] = useState('Carlos Almeida')
  const [sentimentoAtual, setSentimentoAtual] = useState(['esperancoso', '🌱'])
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const [dialogConfigOpen, setDialogConfigOpen] = useState(false)
  const avatarContainerRef = useRef<HTMLDivElement>(null)

  const coresFundos = [
    'bg-[#a5c9ff]', // Flor
    'bg-[#c7b9ff]', // Nuvem
    'bg-[#ffd4a3]', // Estrela
    'bg-[#efe8ff]', // Lua
    'bg-[#ffb8d1]', // Sol
    'bg-[#b8e6d5]', // Folha
    'bg-[#ffb8c8]', // Coração
    'bg-[#d4a5ff]', // Brilho
  ]

  const avataresSimbolicos = [
    { icon: Flower2, nome: 'Flor', id: 1 },
    { icon: Cloud, nome: 'Nuvem', id: 2 },
    { icon: Star, nome: 'Estrela', id: 3 },
    { icon: Moon, nome: 'Lua', id: 4 },
    { icon: Sun, nome: 'Sol', id: 5 },
    { icon: Leaf, nome: 'Folha', id: 6 },
    { icon: Heart, nome: 'Coração', id: 7 },
    { icon: Sparkles, nome: 'Brilho', id: 8 },
  ]

  // Fechar hover ao clicar fora (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        avatarContainerRef.current &&
        !avatarContainerRef.current.contains(e.target as Node)
      ) {
        setIsAvatarHovered(false)
      }
    }

    if (isAvatarHovered) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchend', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [isAvatarHovered])

  return (
    <>
      <div className="mb-2 mt-5 flex w-[calc(100vw-1rem)] flex-col space-y-3 overflow-hidden md:w-[calc(100vw-20rem)] xl:w-auto 2xl:flex-row 2xl:items-start 2xl:space-x-3 2xl:space-y-0">
        <div className="flex flex-col justify-end space-y-1 2xl:w-1/3">
          <UserPerfilComponent
            file={file}
            setFile={setFile}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            isAvatarHovered={isAvatarHovered}
            setIsAvatarHovered={setIsAvatarHovered}
            avatarContainerRef={avatarContainerRef}
            avataresSimbolicos={avataresSimbolicos}
            nomeUser={nomeUser}
            setNomeUser={setNomeUser}
            sentimentoAtual={sentimentoAtual}
            coresFundos={coresFundos}
          />
          <Button
            variant="outline"
            onClick={() => navigation(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
        </div>
        <div className="2xl:w-1/2">
          {/* ===== INFORMAÇÕES BÁSICAS ===== */}
          <BasicInformationComponent
            nomeUser={nomeUser}
            selectedAvatar={selectedAvatar}
            coresFundos={coresFundos}
            sentimentoAtual={sentimentoAtual}
            setSentimentoAtual={setSentimentoAtual}
            setSelectedAvatar={setSelectedAvatar}
            setFile={setFile}
            avataresSimbolicos={avataresSimbolicos}
            abrirDialogConfig={() => setDialogConfigOpen(true)}
          />

          <Button className="bg-linear-purple mt-5 w-full rounded-xl border-none p-7 text-lg font-semibold text-white shadow-lg transition-all hover:text-black/50 hover:shadow-xl active:shadow-md">
            <UserRoundCheck className="mr-2 !h-6 !w-6" /> Salvar alterações
          </Button>
        </div>
      </div>

      <div className="hidden">
        <ConfigDialog
          open={dialogConfigOpen}
          setOpen={setDialogConfigOpen}
          nomeUser={nomeUser}
          setNomeUser={setNomeUser}
        />
      </div>
    </>
  )
}

export default ConfigPerfilPage
