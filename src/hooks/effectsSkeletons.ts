// hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react'

interface PropsScroll {
  totalItems: number
  itemsPerPage?: number
  delayInMs?: number
  root?: HTMLElement | null
  rootMargin?: string
  enabled?: boolean
  onLoadMore: () => void
}

export function useInfiniteScroll({
  totalItems,
  itemsPerPage = 10,
  delayInMs = 0,
  root,
  rootMargin = '0px',
  enabled = true,
  onLoadMore,
}: PropsScroll) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return

    // Só recria o observer se algo realmente importante mudou
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && totalItems > itemsPerPage) {
          // Cancela timeout anterior
          if (timeoutRef.current) clearTimeout(timeoutRef.current)

          onLoadMore()
        }
      },
      {
        root,
        rootMargin,
        threshold: 0.1,
      }
    )

    observer.observe(loadMoreRef.current)

    return () => {
      observer.disconnect()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [onLoadMore, root, rootMargin, delayInMs, enabled])

  return { loadMoreRef }
}

interface PropsDialogScroll {
  enabled: boolean
  hasMore: boolean
  onLoadMore: () => void
  rootMargin?: string
  threshold?: number
  openDelayMs?: number // tempo pra esperar o Dialog abrir e montar
}

export function useInfiniteScrollDialog({
  enabled,
  hasMore,
  onLoadMore,
  rootMargin = '200px',
  threshold = 0.1,
  openDelayMs = 300, // tempo da animação do Dialog (Shadcn usa ~250ms)
}: PropsDialogScroll) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !hasMore) return

    const timer = setTimeout(() => {
      if (!loadMoreRef.current || !scrollContainerRef.current) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onLoadMore()
          }
        },
        {
          root: scrollContainerRef.current,
          rootMargin,
          threshold,
        }
      )

      observer.observe(loadMoreRef.current)

      return () => observer.disconnect()
    }, openDelayMs)

    return () => clearTimeout(timer)
  }, [enabled, hasMore, onLoadMore, rootMargin, threshold, openDelayMs])

  // Retorna as duas refs: uma pro container, outra pro sentinel
  return { scrollContainerRef, loadMoreRef }
}
