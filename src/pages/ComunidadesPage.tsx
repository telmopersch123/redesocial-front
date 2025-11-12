import { ChevronLeft, ChevronRight, PlusCircle, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import CardsComponent from '../components/componentsPages/componentsComunidade/Cards'
import { Button } from '../components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination'

const itemsSimulator = 15
const itemsPerPage = 6

const ComunidadesPages = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // total de páginas
  const totalPages = Math.ceil(itemsSimulator / itemsPerPage)

  // calcula quais itens mostrar com base na página atual
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = [...Array(itemsSimulator)].slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // função de troca de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="mt-16 w-full p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <div className="items-left flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 max-w-[90%]">
          <h1 className="text-3xl font-bold">Comunidades</h1>
          <p className="mt-3 whitespace-normal break-words text-left text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
            Encontre apoio em grupos com interesses comuns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/comunidades_usuario">
            <Button className="bg-linear-purple transition-shadow duration-300 ease-in-out hover:shadow-md">
              <Users className="mr-2 h-4 w-4" />
              Minhas comunidades
            </Button>
          </NavLink>

          <Button className="bg-linear-purple transition-shadow duration-300 ease-in-out hover:shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar comunidade
          </Button>
        </div>
      </div>

      {/* cards */}
      <div className="animate-stagger mt-10 grid grid-cols-1 gap-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        {currentItems.map((_, index) => (
          <div key={index} className="h-[280px] w-full">
            <CardsComponent />
          </div>
        ))}
      </div>

      {/* paginação */}
      <div className="mt-10 flex justify-center text-muted-foreground">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationPrevious>
            </PaginationItem>

            {/* links de páginas */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              if (page > 3 && page < totalPages) {
                if (page === 4) {
                  return (
                    <PaginationItem key="ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    size={undefined}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default ComunidadesPages
