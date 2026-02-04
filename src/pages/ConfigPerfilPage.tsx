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
  metodos: {}
  bio: string
}

const ConfigPerfilPage = () => {
  const navigation = useNavigate()
  const {
    setNomeUser,
    setFile,
    selectedAvatar,
    setSelectedAvatar,
    loading,
    profileUser,
    setProfileUser,
    bio,
    metodosAutocuidado,
    sentimentoAtual,
    file,
  } = useProfile()
  const [initialData, setInitialData] = useState<UserTypeValid | null>(null)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)
  const [dialogConfigOpen, setDialogConfigOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const avatarContainerRef = useRef<HTMLDivElement>(null)
  const [rawFile, setRawFile] = useState<File | null>(null)

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

  useEffect(() => {
    if (!loading && initialData === null) {
      setInitialData({
        nomeUser: profileUser?.user.name_at || '',
        selectedAvatar,
        file: profileUser?.user.avatar || null,
        sentimento:
          profileUser?.user.informationUser[0]?.feeling || 'esperancoso',
        metodos: JSON.stringify(
          profileUser?.user.informationUser[0]?.selfCareMethods || []
        ),
        bio: profileUser?.user.informationUser[0]?.bio || '',
      })
    }
  }, [
    loading,
    profileUser?.user.name_at,
    selectedAvatar,
    profileUser?.user.avatar,
    profileUser?.user.informationUser[0]?.feeling,
    profileUser?.user.informationUser[0]?.selfCareMethods,
    profileUser?.user.informationUser[0]?.bio,
  ])

  const hasChanges = () => {
    if (!initialData) return false

    const isNameChanged = profileUser?.user.name_at !== initialData.nomeUser

    const currentAvatarValue = rawFile
      ? 'new_file'
      : selectedAvatar
        ? `SYMBOLIC_${selectedAvatar}`
        : profileUser?.user.avatar
    const isAvatarChanged = currentAvatarValue !== initialData.file
    const isBioChanged = (bio || '') !== initialData.bio

    const isFeelingChanged =
      (sentimentoAtual[0] || 'esperancoso') !== initialData.sentimento

    const currentMethodsJSON = JSON.stringify(metodosAutocuidado || [])
    const isMethodsChanged = currentMethodsJSON !== initialData.metodos

    return (
      isNameChanged ||
      isAvatarChanged ||
      isFeelingChanged ||
      isBioChanged ||
      isMethodsChanged ||
      rawFile !== null
    )
  }

  const handleSaveInformationPerfil = async () => {
    setIsSaving(true)

    try {
      let finalAvatarValue = profileUser?.user.avatar
      if (rawFile) {
        const formData = new FormData()
        formData.append('file', rawFile || '')
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
      } else if (selectedAvatar) {
        finalAvatarValue = `SYMBOLIC_${selectedAvatar}`
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
            name: profileUser?.user.name_at || '',
            avatar: finalAvatarValue,
            bio: bio,
            feeling: sentimentoAtual[0],
            selfCareMethods: metodosAutocuidado,
          }),
        }
      )

      if (res.ok) {
        toast.success('Informações do perfil atualizadas com sucesso!')
        const updatedUser: AuthMeResponse = {
          ...profileUser!,
          user: {
            ...profileUser!.user,
            avatar: finalAvatarValue ?? profileUser!.user.avatar,
            informationUser: [
              {
                ...profileUser!.user.informationUser[0],
                bio: bio ?? null,
                feeling: sentimentoAtual[0] ?? null,
                emoji: sentimentoAtual[1] || '🌱',
                selfCareMethods: metodosAutocuidado || [],
              },
            ],
          },
        }
        setProfileUser(updatedUser)

        setInitialData({
          nomeUser: profileUser?.user.name_at || '',
          selectedAvatar,
          file: finalAvatarValue || null,
          sentimento: sentimentoAtual[0] || '',
          metodos: JSON.stringify(metodosAutocuidado || []),
          bio: bio || '',
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

  if (loading) return <ConfigPerfilSkeleton />

  return (
    <>
      <div className="mb-2 mt-5 flex w-[calc(100vw-1rem)] flex-col space-y-3 overflow-hidden md:w-[calc(100vw-20rem)] xl:w-auto 2xl:flex-row 2xl:items-start 2xl:space-x-3 2xl:space-y-0">
        <div className="flex flex-col justify-end space-y-1 2xl:w-1/3">
          <UserPerfilComponent
            file={file || profileUser!.user.avatar}
            setFile={setFile}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            isAvatarHovered={isAvatarHovered}
            setIsAvatarHovered={setIsAvatarHovered}
            avatarContainerRef={avatarContainerRef}
            avataresSimbolicos={avataresSimbolicos}
            nomeUser={profileUser?.user.name_at || ''}
            sentimentoAtual={[
              profileUser?.user.informationUser[0]?.feeling || 'esperancoso',
              profileUser?.user.informationUser[0]?.emoji || '🌱',
            ]}
            coresFundos={coresFundos}
            setRawFile={setRawFile}
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
            nomeUser={profileUser?.user.name_at || ''}
            selectedAvatar={selectedAvatar}
            coresFundos={coresFundos}
            setSelectedAvatar={setSelectedAvatar}
            setFile={setFile}
            setNomeUser={setNomeUser}
            avataresSimbolicos={avataresSimbolicos}
            abrirDialogConfig={() => setDialogConfigOpen(true)}
            setRawFile={setRawFile}
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
          nomeUser={profileUser?.user.name_at || ''}
          setNomeUser={setNomeUser}
        />
      </div>
    </>
  )
}

export default ConfigPerfilPage
