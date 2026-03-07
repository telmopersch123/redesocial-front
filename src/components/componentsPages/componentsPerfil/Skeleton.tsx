import { Card } from '../../ui/card'
import { Separator } from '../../ui/separator'
import { SidebarFooter } from '../../ui/sidebar'
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
    <div className="flex w-full items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
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

export const ConfigPerfilSkeleton = () => {
  return (
    <div className="mb-2 mt-5 flex w-[80vw] flex-col space-y-3 overflow-hidden md:w-[50vw] 2xl:flex-row 2xl:items-start 2xl:space-x-8 2xl:space-y-0">
      <div className="flex flex-col space-y-4 2xl:w-[20vw]">
        <Card className="p-6">
          <div className="flex w-full flex-col items-center gap-6 im:flex-row">
            <Skeleton className="h-28 w-28 flex-shrink-0 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
          </div>
        </Card>

        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      <div className="2xl:w-[40vw] 2xl:flex-1">
        <Card>
          <div className="space-y-8 p-8">
            <Skeleton className="h-8 w-56" />

            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>

            <Separator />

            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <Separator />

            <div className="space-y-4">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>

            <Separator />

            <div className="space-y-5">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-4 gap-4 dm:grid-cols-8">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </Card>

        <Skeleton className="mt-6 h-[80px] w-full rounded-xl shadow-xl" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <SidebarFooter className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex animate-pulse items-center gap-3 rounded-xl p-3">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />

          <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </SidebarFooter>
  )
}
