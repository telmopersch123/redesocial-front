import { Loader2, TrendingUp } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import type { dateUserGrapchis } from '../../../types'
interface AverageMoodProps extends React.HTMLAttributes<HTMLDivElement> {
  datesUserGraphics: dateUserGrapchis[]
  isLoadingInitialUserGraphics: boolean
}

const AverageMoodComponent = forwardRef<HTMLDivElement, AverageMoodProps>(
  (
    {
      datesUserGraphics,

      isLoadingInitialUserGraphics,
      ...props
    },
    ref
  ) => {
    const [averageMod, setAverageMod] = useState(0)

    const valided = datesUserGraphics.map((item: dateUserGrapchis) => {
      const score = (item.lvlenergy + item.lvlanxiety) / 2
      if (score < 1) return '😢'
      if (score < 2) return '😔'
      if (score < 3) return '😐'
      if (score < 4) return '🙂'
      return '😊'
    })

    useEffect(() => {
      const avaregeMood = (entries: dateUserGrapchis[]) => {
        if (!entries.length) return 0

        const total = entries.reduce((acc, entry) => {
          const score =
            (entry.emotionalDiary + entry.lvlenergy + (6 - entry.lvlanxiety)) /
            3
          return acc + score
        }, 0)

        return (total / entries.length).toFixed(1).toString()
      }
      setAverageMod(parseFloat(avaregeMood(datesUserGraphics).toString()))
      console.log(datesUserGraphics)
      console.log(averageMod)
    }, [datesUserGraphics])

    console.log(datesUserGraphics)

    return (
      <div
        className="flex h-full cursor-pointer flex-col gap-3 space-y-10 rounded-xl bg-[#f4f5fa] p-4 shadow-md transition-all ease-in-out hover:scale-[103%] dark:bg-zinc-900 dm:w-[300px] xl:w-full"
        ref={ref}
        {...props}
      >
        <div className="flex gap-2 text-gray-600 dark:text-zinc-400">
          <TrendingUp className="h-5 w-5 text-[#c7eade] dark:text-emerald-400" />
          {!isLoadingInitialUserGraphics ? (
            <span className="text-left font-semibold">
              {valided.length >= 4
                ? 'Última semana'
                : `Últimos ${valided.length} dias`}
            </span>
          ) : (
            <span className="animate-pulse text-left font-semibold">
              Analisando...
            </span>
          )}
        </div>

        {/* Emojis da semana */}
        <div className="m-auto flex w-full max-w-xs items-center justify-around gap-4 text-2xl">
          {isLoadingInitialUserGraphics
            ? Array.from({ length: 4 }).map((_, i) => (
                <p
                  key={i}
                  className="animate-pulse text-2xl grayscale"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  😶
                </p>
              ))
            : valided
                .slice(-4)
                .map((emoji: string | undefined, i: number) => (
                  <p key={i}>{emoji}</p>
                ))}
        </div>

        {/* Humor médio */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 dark:text-zinc-400">
            Humor médio
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
            {isLoadingInitialUserGraphics ? (
              <Loader2 className="animate-spin" />
            ) : (
              `${averageMod} / 5`
            )}
          </span>
        </div>
      </div>
    )
  }
)

export default AverageMoodComponent
