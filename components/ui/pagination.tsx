"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  const { isMobile } = useMobile()

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first and last page
    const firstPage = 1
    const lastPage = totalPages

    // Calculate range of pages to show around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage)

    // Determine if we need to show ellipses
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1

    // Mobile view shows fewer pages
    if (isMobile) {
      return [
        firstPage,
        ...(currentPage !== firstPage && currentPage !== lastPage ? [currentPage] : []),
        ...(lastPage !== firstPage ? [lastPage] : []),
      ]
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      // No left dots, but right dots
      const leftRange = Array.from({ length: rightSiblingIndex }, (_, i) => i + 1)
      return [...leftRange, "...", lastPage]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Left dots, but no right dots
      const rightRange = Array.from({ length: lastPage - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i)
      return [firstPage, "...", ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      // Both left and right dots
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      )
      return [firstPage, "...", ...middleRange, "...", lastPage]
    }

    // No dots
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = generatePagination()

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) => {
        if (page === "...") {
          return (
            <Button key={`ellipsis-${i}`} variant="outline" size="icon" disabled className="cursor-default">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </Button>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size={isMobile ? "icon" : "default"}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
