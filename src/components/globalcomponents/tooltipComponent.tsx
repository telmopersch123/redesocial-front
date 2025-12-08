import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

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
    <TooltipProvider delayDuration={150}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild tabIndex={-1}>
          {Element}
        </TooltipTrigger>
        <TooltipContent className="z-[90] bg-purple-600 font-medium">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
