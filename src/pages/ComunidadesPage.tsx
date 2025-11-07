import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import CardsComponent from '../components/componentsPages/componentsComunidade/Cards'
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
      <h1 className="text-3xl font-bold">Comunidades</h1>
      <p className="mt-3 text-left text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
        Encontre apoio em grupos com interesses comuns
      </p>

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
