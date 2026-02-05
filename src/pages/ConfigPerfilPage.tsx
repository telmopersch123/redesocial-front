import { ArrowLeft, Loader2, UserRoundCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import BasicInformationComponent from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/BasicInformationComponent'
import { ConfigDialog } from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/ConfigDialog'
import UserPerfilComponent from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/UserPerfilComponent'
import { ConfigPerfilSkeleton } from '../components/componentsPages/componentsPerfil/Skeleton'
import { Button } from '../components/ui/button'
import { useProfile } from '../context/ProfileContext'
import type { AuthMeResponse } from '../types'
import { avataresSimbolicos, coresFundos } from '../utils/components/UserAvatar'

interface UserTypeValid {
  nomeUser: string
  selectedAvatar: number | null
  file: string | null
  sentimento: string
  metodos: string
  bio: string
}

const ConfigPerfilPage = () => {
  const navigation = useNavigate()
  const {
    setNomeUser: setGlobalNome,
    setFile: setGlobalFile,
    setSelectedAvatar: setGlobalAvatar,
    loading,
    profileUser,
    setProfileUser,
    setHasUnsavedChanges,
  } = useProfile()

  // --- ESTADOS LOCAIS PARA EDIÇÃO ---
  const [localNome, setLocalNome] = useState('')
  const [localFile, setLocalFile] = useState<string | null>(null)
  const [localSelectedAvatar, setLocalSelectedAvatar] = useState<number | null>(
    null
  )
  const [localBio, setLocalBio] = useState('')
  const [localSentimento, setLocalSentimento] = useState<string>('esperancoso')
  const [localMetodos, setLocalMetodos] = useState<string[]>([])

  const [initialData, setInitialData] = useState<UserTypeValid | null>(null)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const [dialogConfigOpen, setDialogConfigOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const avatarContainerRef = useRef<HTMLDivElement>(null)
  const [rawFile, setRawFile] = useState<File | null>(null)

  const handleSaveInformationPerfil = async () => {
    setIsSaving(true)

    try {
      let finalAvatarValue = profileUser?.user.avatar
      if (rawFile) {
        const formData = new FormData()
        formData.append('file', rawFile)
        formData.append('upload_preset', 'posts_tess')
        formData.append('folder', 'perfil')

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/di5dwqjq7/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const cloudinaryData = await cloudinaryRes.json()
        finalAvatarValue = cloudinaryData.secure_url
        setLocalSelectedAvatar(null)
      } else if (localSelectedAvatar) {
        finalAvatarValue = `SYMBOLIC_${localSelectedAvatar}`
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me/update-user`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: localNome,
            avatar: finalAvatarValue,
            bio: localBio,
            feeling: localSentimento,
            selfCareMethods: localMetodos,
          }),
        }
      )

      if (res.ok) {
        toast.success('Informações do perfil atualizadas com sucesso!')
        setGlobalNome(localNome)
        setRawFile(null)
        const novoAvatarUrl = finalAvatarValue || null
        setLocalFile(novoAvatarUrl)
        setGlobalFile(novoAvatarUrl)
        setGlobalAvatar(localSelectedAvatar)

        const updatedUser: AuthMeResponse = {
          ...profileUser!,
          user: {
            ...profileUser!.user,
            name_at: localNome,
            avatar: novoAvatarUrl ?? profileUser!.user.avatar,
            informationUser: [
              {
                ...profileUser!.user.informationUser[0],
                bio: localBio,
                feeling: localSentimento,
                emoji: '🌱',
                selfCareMethods: localMetodos,
              },
            ],
          },
        }
        setProfileUser(updatedUser)

        setInitialData({
          nomeUser: localNome,
          selectedAvatar: localSelectedAvatar,
          file: novoAvatarUrl,
          sentimento: localSentimento,
          metodos: JSON.stringify(localMetodos),
          bio: localBio,
        })
        setRawFile(null)
      }
    } catch (error) {
      toast.error('Erro ao atualizar informações do perfil')
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = () => {
    if (!initialData) return false

    const isNameChanged = localNome !== initialData.nomeUser
    const currentAvatar = localSelectedAvatar
      ? `SYMBOLIC_${localSelectedAvatar}`
      : localFile
    const isAvatarChanged =
      rawFile !== null || currentAvatar !== initialData.file
    const isBioChanged = localBio !== initialData.bio
    const isFeelingChanged = localSentimento !== initialData.sentimento
    const isMethodsChanged =
      JSON.stringify(localMetodos) !== initialData.metodos

    return (
      isNameChanged ||
      isAvatarChanged ||
      isFeelingChanged ||
      isBioChanged ||
      isMethodsChanged ||
      rawFile !== null
    )
  }

  const handleBack = () => {
    if (hasChanges()) {
      const proceed = window.confirm(
        'Você tem alterações não salvas. Deseja realmente sair e perder as mudanças?'
      )
      if (!proceed) return
    }
    navigation(-1)
  }

  useEffect(() => {
    setHasUnsavedChanges(hasChanges())
  }, [
    localNome,
    localFile,
    localSelectedAvatar,
    localBio,
    localSentimento,
    localMetodos,
    rawFile,
  ])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault()
        e.returnValue = true
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      setHasUnsavedChanges(false)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [initialData, localNome, localBio, localSentimento, localMetodos, rawFile])

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

  useEffect(() => {
    if (!loading && initialData === null && profileUser) {
      const data = {
        nomeUser: profileUser.user.name_at || '',
        selectedAvatar: profileUser.user.avatar?.startsWith('SYMBOLIC_')
          ? parseInt(profileUser.user.avatar.split('_')[1])
          : null,
        file: profileUser.user.avatar || null,
        sentimento:
          profileUser.user.informationUser[0]?.feeling || 'esperancoso',
        metodos: JSON.stringify(
          profileUser.user.informationUser[0]?.selfCareMethods || []
        ),
        bio: profileUser.user.informationUser[0]?.bio || '',
      }

      setInitialData(data)
      // Alimenta os estados locais inicialmente
      setLocalNome(data.nomeUser)
      setLocalFile(data.file)
      setLocalSelectedAvatar(data.selectedAvatar)
      setLocalBio(data.bio)
      setLocalSentimento(data.sentimento)
      const metodosParsed = JSON.parse(data.metodos || '[]')
      setLocalMetodos(Array.isArray(metodosParsed) ? metodosParsed : [])
    }
  }, [loading, profileUser])

  if (loading) return <ConfigPerfilSkeleton />

  return (
    <>
      <div className="mb-2 mt-5 flex w-[calc(100vw-1rem)] flex-col space-y-3 overflow-hidden md:w-[calc(100vw-20rem)] xl:w-auto 2xl:flex-row 2xl:items-start 2xl:space-x-3 2xl:space-y-0">
        <div className="flex flex-col justify-end space-y-1 2xl:w-1/3">
          <UserPerfilComponent
            file={localFile}
            setFile={setLocalFile}
            selectedAvatar={localSelectedAvatar}
            setSelectedAvatar={setLocalSelectedAvatar}
            isAvatarHovered={isAvatarHovered}
            setIsAvatarHovered={setIsAvatarHovered}
            avatarContainerRef={avatarContainerRef}
            avataresSimbolicos={avataresSimbolicos}
            nomeUser={localNome}
            localSentimento={localSentimento}
            coresFundos={coresFundos}
            setRawFile={setRawFile}
          />
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Voltar
          </Button>
        </div>
        <div className="2xl:w-1/2">
          <BasicInformationComponent
            nomeUser={localNome}
            selectedAvatar={localSelectedAvatar}
            coresFundos={coresFundos}
            setSelectedAvatar={setLocalSelectedAvatar}
            setFile={setLocalFile}
            setNomeUser={setLocalNome}
            avataresSimbolicos={avataresSimbolicos}
            abrirDialogConfig={() => setDialogConfigOpen(true)}
            setRawFile={setRawFile}
            localBio={localBio}
            setLocalBio={setLocalBio}
            localSentimento={localSentimento}
            setLocalSentimento={setLocalSentimento}
            localMetodos={localMetodos}
            setLocalMetodos={setLocalMetodos}
          />

          <Button
            disabled={isSaving || !hasChanges()}
            onClick={handleSaveInformationPerfil}
            className="bg-linear-purple mt-5 w-full rounded-xl border-none p-7 text-lg font-semibold text-white shadow-lg transition-all hover:text-black/50 hover:shadow-xl active:shadow-md"
          >
            <UserRoundCheck className="mr-2 !h-6 !w-6" />
            {isSaving ? (
              <div className="flex items-center gap-2">
                <p>Salvando alterações</p>
                <Loader2 className="!h-8 !w-8 animate-spin text-current" />
              </div>
            ) : (
              <>Salvar alterações</>
            )}
          </Button>
        </div>
      </div>

      <div className="hidden">
        <ConfigDialog
          open={dialogConfigOpen}
          setOpen={setDialogConfigOpen}
          nomeUser={localNome}
          setNomeUser={setLocalNome}
        />
      </div>
    </>
  )
}

export default ConfigPerfilPage
