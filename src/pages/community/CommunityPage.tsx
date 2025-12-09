import { AnimatePresence, motion } from 'framer-motion'
import { PlusCircle, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import CardsCommunityComponent from '../../components/componentsPages/componentsComunidade/CardsCommunityComponent'
import PaginationComponent from '../../components/componentsPages/componentsComunidade/PaginationComponent'
import { Button } from '../../components/ui/button'
import { FilterCommunity } from './filterComponent'
export const communities = [
  {
    id: 1,
    emoji: '😰',
    title: 'Ansiedade Social',
    description:
      'Um espaço seguro para compartilhar experiências e apoio mútuo.',
    members: 523,
    posts: 1200,
    isPrivate: true,
  },
  {
    id: 2,
    emoji: '🔥',
    title: 'Produtividade Máxima',
    description: 'Comunidade focada em hábitos, foco e alta performance.',
    members: 3870,
    posts: 8540,
    isPrivate: false,
  },
  {
    id: 3,
    emoji: '🎮',
    title: 'Gamers do Brasil',
    description: 'Para quem ama jogos e quer fazer novas amizades.',
    members: 19400,
    posts: 32000,
    isPrivate: false,
  },
  {
    id: 4,
    emoji: '💪',
    title: 'Motivação Diária',
    description: 'Desafios, frases e apoio diário para sua jornada.',
    members: 1200,
    posts: 5500,
    isPrivate: false,
  },
  {
    id: 5,
    emoji: '🧠',
    title: 'Psicologia & Vida',
    description: 'Discussões sobre comportamento humano e autoconhecimento.',
    members: 880,
    posts: 2100,
    isPrivate: true,
  },
  {
    id: 6,
    emoji: '🐶',
    title: 'Amantes de Pets',
    description: 'Compartilhe fotos, dicas e momentos com seus pets!',
    members: 4500,
    posts: 15000,
    isPrivate: false,
  },
  {
    id: 7,
    emoji: '📚',
    title: 'Clube do Livro',
    description: 'Indicações, resenhas e conversas sobre literatura.',
    members: 310,
    posts: 880,
    isPrivate: true,
  },
]

const CommunityPage = () => {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    privacy: 'all',
    minMembers: null as number | null,
    maxMembers: null as number | null,
  })

  const itemsPerPage = 6

  const filteredCommunities = communities.filter((community) => {
    if (filters.privacy === 'public' && community.isPrivate) return false
    if (filters.privacy === 'private' && !community.isPrivate) return false
    if (filters.minMembers !== null && community.members < filters.minMembers)
      return false
    if (filters.maxMembers !== null && community.members > filters.maxMembers)
      return false
    return true
  })

  // calcula quais itens mostrar com base na página atual
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filteredCommunities.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  useEffect(() => {
    if (location.state?.communityError === 'not-found') {
      toast.error('Comunidade não encontrada, ou foi removida!')

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
            <NavLink to="comunidades-do-usuario">
              <Button className="bg-linear-purple transition-shadow duration-300 ease-in-out hover:shadow-md">
                <Users className="mr-2 h-4 w-4" />
                Minhas comunidades
              </Button>
            </NavLink>

            <NavLink to="criar">
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
            className="mt-10 grid min-h-[650px] grid-cols-1 gap-6 gap-y-14 ym:grid-cols-2 xl:grid-cols-3"
          >
            {currentItems.map((communities, index) => (
              <div key={index} className="h-[280px] w-full">
                <CardsCommunityComponent valuesComunity={communities} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* paginação */}
        <div
          className={`mt-10 flex justify-center text-muted-foreground ${filteredCommunities.length < 6 && currentItems.length < 6 ? 'hidden' : ''}`}
        >
          <PaginationComponent
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            itemsSimulator={communities.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </>
  )
}

export default CommunityPage
