// hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react'

interface PropsScroll {
  totalItems: number
  root?: HTMLElement | null
  rootMargin?: string
  enabled?: boolean
  onLoadMore: () => void
}

export function useInfiniteScroll({
  totalItems,
  root,
  rootMargin = '0px',
  enabled = true,
  onLoadMore,
}: PropsScroll) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadMoreCallback = useRef(onLoadMore)
  useEffect(() => {
    loadMoreCallback.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return

    // Só recria o observer se algo realmente importante mudou
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreCallback.current()
        }
      },
      {
        root,
        rootMargin,
        threshold: 0.1,
      }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [onLoadMore, root, rootMargin, totalItems])

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
  rootMargin,
  threshold = 1,
}: PropsDialogScroll) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (!enabled || !hasMore) {
      return
    }

    let tries = 0

    const init = () => {
      const root = scrollContainerRef.current
      const target = loadMoreRef.current

      if (!root || !target) {
        if (tries < 20) {
          tries++
          requestAnimationFrame(init)
        }
        return
      }

      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore) {
            onLoadMore()
          }
        },
        { root, rootMargin, threshold }
      )

      observerRef.current.observe(target)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(init)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [enabled, hasMore, onLoadMore, rootMargin, threshold])

  return { scrollContainerRef, loadMoreRef }
}
