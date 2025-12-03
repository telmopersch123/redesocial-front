import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function TooltipComponent({
  Tag,
  children,
  description,
}: {
  Tag?: React.ReactNode
  children?: React.ReactNode
  description: string
}) {
  const Element = Tag ?? children
  return (
    <Tooltip>
      <TooltipTrigger asChild>{Element}</TooltipTrigger>
      <TooltipContent className="z-[80] bg-purple-600 font-medium">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
