import { Card } from '../../ui/card'
import { Skeleton } from '../../ui/skeleton'

export const PostCardSkeleton = ({ value }: { value?: number }) => {
  return (
    <Card
      className={`!mb-10 ${value ? `w-[${value}px]` : 'w-full'} h-[300px] overflow-hidden rounded-3xl border-none bg-gradient-to-b dark:shadow-zinc-800`}
    >
      <div className="flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700" />
              <Skeleton className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-200 dark:bg-zinc-700" />
          <Skeleton className="h-4 w-full bg-zinc-200 dark:bg-zinc-700" />
          <Skeleton className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Skeleton className="h-8 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <Skeleton className="h-8 w-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <Skeleton className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </Card>
  )
}

export const ProfileHeaderSkeleton = () => {
  return (
    <header className="bg-gradient-to-b px-5 pb-10 pt-8">
      <div>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end">
          {/* Avatar + botão */}
          <div className="flex flex-col items-center">
            <Skeleton className="h-28 w-28 rounded-full shadow-2xl sm:h-32 sm:w-32" />

            <Skeleton className="mt-3 h-9 w-36 rounded-lg" />
          </div>

          {/* Info do usuário */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />

            <Skeleton className="h-5 w-40" />

            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-4/5 max-w-md" />

            {/* Stats */}
            <div className="mt-5 flex gap-8">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Botões direita */}
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  )
}

export const FollowerSkeleton = () => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
      {/* Avatar */}
      <Skeleton className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />

      {/* Nome + username */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700" />
        <Skeleton className="h-3.5 w-28 bg-zinc-200/60 dark:bg-zinc-700/60" />
      </div>

      {/* Botão */}
      <Skeleton className="h-9 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  )
}

export const CommunityCardSkeleton = () => {
  return (
    <Card className="h-[280px] w-full overflow-hidden rounded-2xl border-none bg-white shadow-md dark:bg-zinc-900/80">
      <Skeleton className="h-24 w-full rounded-none bg-zinc-200 dark:bg-zinc-800" />

      <div className="relative flex flex-col items-center px-4 pb-6">
        <Skeleton className="z-10 -mt-8 h-16 w-16 rounded-2xl border-4 border-white bg-zinc-300 dark:border-zinc-900 dark:bg-zinc-700" />

        <Skeleton className="mt-3 h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-4 w-full space-y-2">
          <Skeleton className="h-3 w-full bg-zinc-200/60 dark:bg-zinc-800/60" />
          <Skeleton className="mx-auto h-3 w-5/6 bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>

        <div className="mt-6 flex w-full items-center justify-between">
          <Skeleton className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </Card>
  )
}
