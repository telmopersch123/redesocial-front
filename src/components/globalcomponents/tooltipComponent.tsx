import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function TooltipComponent({
  Tag,
  description,
}: {
  Tag: React.ReactNode
  description: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{Tag}</TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
