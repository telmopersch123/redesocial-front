import { Card } from '../../ui/card'
import { Skeleton } from '../../ui/skeleton'

export const PostCardSkeleton = () => {
  return (
    <Card className="h-[300px] overflow-hidden rounded-3xl border-none bg-white/90 shadow-lg">
      <div className="flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  )
}
export const FollowerSkeleton = () => {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors">
      {/* Avatar */}
      <Skeleton className="h-12 w-12 rounded-full" />

      {/* Nome */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" /> {/* nome completo */}
        <Skeleton className="h-3.5 w-28 opacity-60" />{' '}
        {/* @username ou subtítulo opcional */}
      </div>

      {/* Botão "Ver perfil" opcional no skeleton */}
      <Skeleton className="h-9 w-24 rounded-full" />
    </div>
  )
}
