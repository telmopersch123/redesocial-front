import { TrendingUp } from 'lucide-react'
import { forwardRef } from 'react'

const AverageMoodComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      className="flex h-full cursor-pointer flex-col gap-3 space-y-10 rounded-xl bg-[#f4f5fa] p-4 shadow-md transition-all ease-in-out hover:scale-[103%] dm:w-[300px] xl:w-full"
      ref={ref}
      {...props}
    >
      <div className="flex gap-2 text-gray-600">
        <TrendingUp className="h-5 w-5 text-[#c7eade]" />
        <span className="text-left font-semibold">Última semana</span>
      </div>

      {/* Emojis da semana */}
      <div className="m-auto flex w-full max-w-xs items-center justify-around text-2xl">
        <span>😐</span>
        <span>🙂</span>
        <span>😐</span>
        <span>😔</span>
      </div>

      {/* Humor médio */}
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-500">Humor médio</span>
        <span className="text-lg font-semibold">3.0 / 5</span>
      </div>
    </div>
  )
})

export default AverageMoodComponent
