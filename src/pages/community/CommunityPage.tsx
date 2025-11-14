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
    <div className="mt-16 w-full p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <Outlet />
      <div className="items-left flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 max-w-[90%]">
          <h1 className="text-3xl font-bold">Comunidades</h1>
          <p className="mt-3 whitespace-normal break-words text-left text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
            Encontre apoio em grupos com interesses comuns
          </p>
        </div>
        <div className="flex items-center gap-2">
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
      <div className="animate-stagger mt-10 grid grid-cols-1 gap-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        {currentItems.map((_, index) => (
          <div key={index} className="h-[280px] w-full">
            <CardsCommunityComponent />
          </div>
        ))}
      </div>

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
