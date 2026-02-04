import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { sentimentos } from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/BasicInformationComponent'
import type { AuthMeResponse } from '../types'

interface ProfileContextData {
  nomeUser: string
  setNomeUser: React.Dispatch<React.SetStateAction<string>>
  file: string | null
  setFile: React.Dispatch<React.SetStateAction<string | null>>
  selectedAvatar: number | null
  setSelectedAvatar: React.Dispatch<React.SetStateAction<number | null>>
  loading: boolean
  refreshProfile: () => Promise<void>
  sentimentoAtual: string[]
  setSentimentoAtual: React.Dispatch<React.SetStateAction<string[]>>
  metodosAutocuidado: string[]
  setMetodosAutocuidado: React.Dispatch<React.SetStateAction<string[]>>
  bio: string
  setBio: React.Dispatch<React.SetStateAction<string>>
  id: string | undefined
  profileUser: AuthMeResponse | null
  setProfileUser: React.Dispatch<React.SetStateAction<AuthMeResponse | null>>
}

const ProfileContext = createContext<ProfileContextData>(
  {} as ProfileContextData
)

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nomeUser, setNomeUser] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [profileUser, setProfileUser] = useState<AuthMeResponse | null>(null)
  const { id } = useParams<{ id?: string }>()
  const [loading, setLoading] = useState(true)
  const [sentimentoAtual, setSentimentoAtual] = useState(['esperancoso', '🌱'])
  const [metodosAutocuidado, setMetodosAutocuidado] = useState<string[]>([])
  const [bio, setBio] = useState('')

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true)

      const endpoint = id ? `/auth/users/${id}` : `/auth/me`

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        credentials: 'include',
      })

      if (!res.ok) {
        setProfileUser(null)
        return
      }

      if (res.ok) {
        const data = await res.json()
        const infoOriginal = data.user.informationUser[0]
        const feelingSlug = infoOriginal?.feeling
        const feelingSearch = sentimentos.find((s) => s.value === feelingSlug)
        const emojiValue = feelingSearch?.emoji || '🌱'
        const labelValue = feelingSearch?.value || 'esperancoso'

        if (data.user.informationUser.length > 0) {
          data.user.informationUser = [
            {
              ...infoOriginal,
              feeling: labelValue,
              emoji: emojiValue,
            },
          ]
        }

        setProfileUser(data)
        setNomeUser(data.user.name)
        if (data.user.avatar?.startsWith('SYMBOLIC_')) {
          const symbolId = parseInt(data.user.avatar.replace('SYMBOLIC_', ''))
          setSelectedAvatar(symbolId)
          setFile(null)
        } else if (data.user.avatar) {
          setFile(data.user.avatar)
          setSelectedAvatar(null)
        } else {
          setFile(null)
          setSelectedAvatar(null)
        }

        if (data.user.informationUser && data.user.informationUser.length > 0) {
          const info = data.user.informationUser[0]
          setBio(info.bio || '')
          setMetodosAutocuidado(info.selfCareMethods || [])

          const feelingObj = sentimentos.find((s) => s.value === info.feeling)

          if (feelingObj) {
            setSentimentoAtual([feelingObj.value, feelingObj.emoji])
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar perfil no contexto:', err)
      setLoading(false)
      setProfileUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile()
  }, [id])

  return (
    <ProfileContext.Provider
      value={{
        nomeUser,
        setNomeUser,
        file,
        setFile,
        selectedAvatar,
        setSelectedAvatar,
        loading,
        refreshProfile,
        sentimentoAtual,
        setSentimentoAtual,
        metodosAutocuidado,
        setMetodosAutocuidado,
        bio,
        setBio,
        id,
        profileUser,
        setProfileUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
