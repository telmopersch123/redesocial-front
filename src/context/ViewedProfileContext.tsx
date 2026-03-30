// ViewedProfileContext.tsx
import React, { createContext, useCallback, useContext, useState } from 'react'
import { sentimentos } from '../components/componentsPages/componentsPerfil/componentsConfigPerfil/UserPerfilComponent'
import type { AuthMeResponse } from '../types'

interface ViewedProfileData {
  viewedProfile: AuthMeResponse | null
  viewedBio: string
  isViewedLoading: boolean
  isBlocked: boolean
  refreshProfile: (idUser?: number) => Promise<void>
  setViewedProfile: React.Dispatch<React.SetStateAction<AuthMeResponse | null>>
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>
  viewedName: string
}

const ViewedProfileContext = createContext<ViewedProfileData>(
  {} as ViewedProfileData
)

export const ViewedProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [viewedProfile, setViewedProfile] = useState<AuthMeResponse | null>(
    null
  )
  const [viewedBio, setViewedBio] = useState('')
  const [isViewedLoading, setIsViewedLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [viewedName, setViewedName] = useState('')

  const refreshProfile = useCallback(async (idUser?: number) => {
    setIsViewedLoading(true)
    setIsBlocked(false)
    setViewedProfile(null)
    setViewedBio('')

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/users/${idUser}`,
        {
          credentials: 'include',
        }
      )

      // if (!res.ok) {
      //   setViewedProfile(null)
      //   return
      // }

      const data = await res.json()

      if (data.isBlocked) {
        setIsBlocked(true)
        return
      }

      let processed = { ...data }
      if (data.user?.informationUser?.length > 0) {
        const info = data.user.informationUser[0]
        setViewedName(data.user.name_at)
        const feelingSearch = sentimentos.find((s) => s.value === info.feeling)
        processed = {
          ...data,
          user: {
            ...data.user,
            informationUser: [
              {
                ...info,
                feeling: feelingSearch?.value || 'esperancoso',
                emoji: feelingSearch?.emoji || '🌱',
              },
            ],
          },
        }
      }

      setViewedProfile(processed)
      setViewedBio(processed.user?.informationUser?.[0]?.bio || '')
    } catch (err) {
      console.error('Erro ao carregar perfil visualizado:', err)
      setViewedProfile(null)
    } finally {
      setIsViewedLoading(false)
    }
  }, [])

  return (
    <ViewedProfileContext.Provider
      value={{
        viewedProfile,
        viewedBio,
        isViewedLoading,
        isBlocked,
        refreshProfile,
        setViewedProfile,
        setIsBlocked,
        viewedName,
      }}
    >
      {children}
    </ViewedProfileContext.Provider>
  )
}

export const useViewedProfile = () => useContext(ViewedProfileContext)
