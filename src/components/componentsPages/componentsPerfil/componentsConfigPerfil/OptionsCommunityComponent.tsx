import { Crown, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/getMe'
import { getMyCommunities } from '../../../../services/authService'
import type { CommunityInterface } from '../../../../types'
import { LoadingComponent } from '../../../../utils/components/Loading'
import ShowCommunityDialog from './ShowConfigCommunityDialog'

interface OptionsCommunityProps {
  tab: number
}

const OptionsCommunity = ({ tab }: OptionsCommunityProps) => {
  const [communities, setCommunities] = useState<CommunityInterface[]>([])
  const [loading, setLoading] = useState(false)
  const { isAdmin, isModerator } = useAuth()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    async function handleSearchMyComunity() {
      setLoading(true)
      try {
        const res = await getMyCommunities()
        setShowError(false)
        setCommunities(res)
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error)
        setShowError(true)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    handleSearchMyComunity()
  }, [tab])

  if (showError) {
    return (
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Não foi possível carregar as comunidades
          </p>
        </div>
      </div>
    )
  }
  if (loading && !showError) {
    return (
      <div className="absolute left-1/2 top-1/2 flex h-40 w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {communities.map((c) => {
        const Isadmin = isAdmin(c.id)
        const Ismoderator = isModerator(c.id)

        return (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-800"
          >
            {/* Avatar da comunidade */}
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.nameComunity}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {c.nameComunity}
              </h3>

              {/* Dono / Moderador */}
              <span className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                {(Isadmin && (
                  <>
                    <Crown size={14} className="text-yellow-500" />
                    <span>Dono da comunidade</span>
                  </>
                )) ||
                  (Ismoderator && (
                    <>
                      <Shield
                        size={14}
                        className="text-purple-500 dark:text-purple-400"
                      />
                      <span>Moderador</span>
                    </>
                  )) || (
                    <>
                      <Users
                        size={14}
                        className="text-zinc-500 dark:text-zinc-400"
                      />
                      <span>Membro</span>
                    </>
                  )}
              </span>
            </div>

            {Isadmin && <ShowCommunityDialog communityIdMananger={c.id} />}
          </div>
        )
      })}
    </div>
  )
}

export default OptionsCommunity
