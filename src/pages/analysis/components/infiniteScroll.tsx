// hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  enabled: boolean
  hasMore: boolean
  rootMargin?: string
  threshold?: number
  onLoadMore: () => void
}

export function useInfiniteScrollAdmin({
  enabled,
  hasMore,
  rootMargin = '50px',
  threshold = 0.1,
  onLoadMore,
}: UseInfiniteScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !hasMore) return
    if (!sentinelRef.current || !scrollContainerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin,
        threshold,
      }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [enabled, hasMore, onLoadMore])

  return { scrollContainerRef, sentinelRef }
}
