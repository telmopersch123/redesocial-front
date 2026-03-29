import { AnimatePresence, motion } from 'framer-motion'
import { PlusCircle, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import CardsCommunityComponent from '../../components/componentsPages/componentsComunidade/CardsCommunityComponent'
import PaginationComponent from '../../components/componentsPages/componentsComunidade/PaginationComponent'
import { CommunityCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import { Button } from '../../components/ui/button'
import { useComunidades } from '../../context/CommunityContext'
import { useAuth } from '../../context/getMe'
import type { CommunityInterface } from '../../types'
import { MessagePerson } from '../../utils/components/MessagePerson'
import { FilterCommunity } from './filterComponent'

const CommunityPage = () => {
  const location = useLocation()
  const { user } = useAuth()
  const { setFiltro } = useComunidades()
  const [communities, setCommunities] = useState<CommunityInterface[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    privacy: 'all',
    minMembers: null as number | null,
    maxMembers: null as number | null,
  })

  const itemsPerPage = 6

  const filteredCommunities = communities.filter((community) => {
    if (filters.privacy === 'public' && community.isPrivate) return false
    if (filters.privacy === 'private' && !community.isPrivate) return false
    if (
      filters.minMembers !== null &&
      community._count.members < filters.minMembers
    )
      return false
    if (
      filters.maxMembers !== null &&
      community._count.members > filters.maxMembers
    )
      return false
    return true
  })

  // calcula quais itens mostrar com base na página atual
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filteredCommunities.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const fetchCommunities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/comunity/getAllCommunities`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
      }
    } catch (error) {
      MessagePerson('Erro ao carregar comunidades', null, 'error')

      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  useEffect(() => {
    setFiltro('all')
  }, [filters])

  useEffect(() => {
    if (location.state?.communityError === 'not-found') {
      MessagePerson('Comunidade não encontrada', null, 'error')

      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-4 mt-5 w-full p-2 md:w-[calc(100vw-20rem)]">
        <Outlet />
        <div className="items-left flex flex-col flex-wrap items-center justify-between gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 max-w-[90%]">
            <h1 className="text-center text-xl font-bold md:text-left md:text-4xl">
              Comunidades
            </h1>
            <p className="mt-3 whitespace-normal break-words text-center text-base text-gray-500 text-muted-foreground md:text-left md:text-lg lg:text-xl">
              Encontre apoio em grupos com interesses comuns
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <NavLink to={user ? 'comunidades-do-usuario' : '/auth'}>
              <Button className="bg-linear-purple transition-shadow duration-300 ease-in-out hover:shadow-md">
                <Users className="mr-2 h-4 w-4" />
                Minhas comunidades
              </Button>
            </NavLink>

            <NavLink to={user ? 'criar' : '/auth'}>
              <Button className="bg-linear-purple transition-shadow duration-300 ease-in-out hover:shadow-md">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar comunidade
              </Button>
            </NavLink>

            <div>
              <FilterCommunity onApply={setFilters} />
            </div>
          </div>
        </div>

        {/* cards */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }} // começa 20px abaixo
            animate={{ opacity: 1, height: 'auto', y: 0 }} // sobe para a posição normal
            exit={{ opacity: 0, height: 0, y: 20 }} // sai descendo
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-10 grid min-h-[650px] grid-cols-1 gap-6 gap-y-44 ym:grid-cols-2 xl:grid-cols-3"
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[280px] w-full">
                  <CommunityCardSkeleton />
                </div>
              ))
            ) : currentItems.length > 0 ? (
              currentItems.map((community, index) => (
                <div key={community.id || index} className="h-[280px] w-full">
                  <CardsCommunityComponent
                    valuesComunity={community}
                    user={user}
                    onRefresh={fetchCommunities}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground">
                  Nenhuma comunidade encontrada com esses filtros.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* paginação */}
        {!isLoading && (
          <div
            className={`mt-10 flex justify-center text-muted-foreground ${filteredCommunities.length < 6 && currentItems.length < 6 ? 'hidden' : ''}`}
          >
            <PaginationComponent
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              itemsSimulator={filteredCommunities.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default CommunityPage
