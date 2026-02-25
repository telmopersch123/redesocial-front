// MyProfileContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { sentimentos } from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/UserPerfilComponent'
import type { UserType } from '../types'
import { useAuth } from './getMe'

interface MyProfileContextData {
  myProfile: UserType | null
  isMyLoading: boolean
  nomeUser: string
  setNomeUser: React.Dispatch<React.SetStateAction<string>>
  file: string | null
  setFile: React.Dispatch<React.SetStateAction<string | null>>
  selectedAvatar: number | null
  setSelectedAvatar: React.Dispatch<React.SetStateAction<number | null>>
  bio: string
  setBio: React.Dispatch<React.SetStateAction<string>>
  sentimentoAtual: string[]
  setSentimentoAtual: React.Dispatch<React.SetStateAction<string[]>>
  metodosAutocuidado: string[]
  setMetodosAutocuidado: React.Dispatch<React.SetStateAction<string[]>>
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
  refreshMyProfile: () => Promise<void>
  setMyProfile: React.Dispatch<React.SetStateAction<UserType | null>>
}

const MyProfileContext = createContext<MyProfileContextData>(
  {} as MyProfileContextData
)

export const MyProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: authUser, refreshUser: refreshAuth, isAuthLoading } = useAuth()
  const [myProfile, setMyProfile] = useState<UserType | null>(null)
  const [isMyLoading, setIsMyLoading] = useState(true)
  console.log(authUser)
  // Estados de edição
  const [nomeUser, setNomeUser] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [bio, setBio] = useState('')
  const [sentimentoAtual, setSentimentoAtual] = useState<string[]>([
    'esperancoso',
    '🌱',
  ])
  const [metodosAutocuidado, setMetodosAutocuidado] = useState<string[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (isAuthLoading) {
      setIsMyLoading(true)
      return
    }

    if (!authUser) {
      setMyProfile(null)
      setIsMyLoading(false)
      return
    }

    console.log('Sincronizando myProfile com authUser atualizado')

    let processed = { ...authUser }
    if (authUser.informationUser?.length > 0) {
      const info = authUser.informationUser[0]
      const feelingSearch = sentimentos.find((s) => s.value === info.feeling)
      processed = {
        ...authUser,
        informationUser: [
          {
            ...info,
            feeling: feelingSearch?.value || 'esperancoso',
            emoji: feelingSearch?.emoji || '🌱',
          },
        ],
      }
    }

    setMyProfile(processed)
    setNomeUser(authUser.name_at || '')
    setBio(authUser.informationUser?.[0]?.bio || '')

    if (authUser.avatar?.startsWith('SYMBOLIC_')) {
      setSelectedAvatar(parseInt(authUser.avatar.replace('SYMBOLIC_', '')))
      setFile(null)
    } else {
      setFile(authUser.avatar || null)
      setSelectedAvatar(null)
    }

    setMetodosAutocuidado(authUser.informationUser?.[0]?.selfCareMethods || [])
    setIsMyLoading(false)
  }, [authUser, isAuthLoading])

  const refreshMyProfile = useCallback(async () => {
    console.log('refreshMyProfile chamado - atualizando auth global')
    setIsMyLoading(true)
    try {
      await refreshAuth()
    } catch (err) {
      console.error('Erro no refresh:', err)
    } finally {
      setIsMyLoading(false)
    }
  }, [refreshAuth])
  // useEffect(() => {
  //   refreshMyProfile()
  // }, [refreshMyProfile])

  return (
    <MyProfileContext.Provider
      value={{
        myProfile,
        isMyLoading,
        nomeUser,
        setNomeUser,
        file,
        setFile,
        selectedAvatar,
        setSelectedAvatar,
        bio,
        setBio,
        sentimentoAtual,
        setSentimentoAtual,
        metodosAutocuidado,
        setMetodosAutocuidado,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        refreshMyProfile,
        setMyProfile,
      }}
    >
      {children}
    </MyProfileContext.Provider>
  )
}

export const useMyProfile = () => useContext(MyProfileContext)
