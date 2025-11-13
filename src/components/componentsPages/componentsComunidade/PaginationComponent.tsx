import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/pagination'

interface PaginationProps {
  itemsSimulator: number
  itemsPerPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number
}

const PaginationComponent = ({
  itemsSimulator,
  itemsPerPage,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  // função de troca de página
  const totalPages = Math.ceil(itemsSimulator / itemsPerPage)
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex cursor-pointer items-center justify-center"
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
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
                size={undefined}
                className="flex cursor-pointer items-center justify-center"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex cursor-pointer items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent
