import { AnimatePresence, motion } from 'framer-motion'
import { PlusCircle, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import CardsCommunityComponent from '../../components/componentsPages/componentsComunidade/CardsCommunityComponent'
import PaginationComponent from '../../components/componentsPages/componentsComunidade/PaginationComponent'
import { Button } from '../../components/ui/button'

const CommunityPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6
  const itemsSimulator = 15
  // calcula quais itens mostrar com base na página atual
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = [...Array(itemsSimulator)].slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="mb-4 mt-12 w-full p-2 md:w-[calc(100vw-20rem)]">
      <Outlet />
      <div className="items-left flex flex-col flex-wrap items-center justify-between gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 max-w-[90%]">
          <h1 className="text-center text-xl font-bold text-gray-800 md:text-left md:text-4xl">
            Comunidades
          </h1>
          <p className="mt-3 whitespace-normal break-words text-center text-base text-gray-500 text-muted-foreground md:text-left md:text-lg lg:text-xl">
            Encontre apoio em grupos com interesses comuns
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <NavLink to="usuario">
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
          {currentItems.map((_, index) => (
            <div key={index} className="h-[280px] w-full">
              <CardsCommunityComponent />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* paginação */}
      <div className="mt-10 flex justify-center text-muted-foreground">
        <PaginationComponent
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          itemsSimulator={itemsSimulator}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  )
}

export default CommunityPage
