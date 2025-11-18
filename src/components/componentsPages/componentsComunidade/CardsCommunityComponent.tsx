import { UserRoundPlus, UsersRound } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card'

const CardsCommunityComponent = () => {
  return (
    // CardsComponent.tsx
    <Card className="!mb-5 w-[calc(100vw-3rem)] flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ease-out will-change-transform hover:z-10 hover:-translate-y-1 hover:scale-100 hover:shadow-lg md:w-full">
      <CardHeader className="m-0 p-0">
        <div className="flex h-[100px] items-center justify-center rounded-lg bg-slate-400/50">
          <p className="text-5xl">😰</p>
        </div>
        <div className="!mt-5 px-5">
          {' '}
          <CardTitle className="mb-2">Ansiedade Social</CardTitle>
          <CardDescription className="max-w-full truncate text-muted-foreground">
            Um espaço seguro para compartilhar experiências sobre ansiedade
            social e encontrar apoio mútuo.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-5 flex items-center justify-between px-5 py-2">
        {/* Membros */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <UsersRound className="h-5 w-5 text-purple-500/70" />
          <p className="text-[13px]">0 membros</p>
        </div>

        {/* Postagens */}
        <div className="flex items-center gap-1 rounded-lg border border-muted-foreground/10 bg-muted/20 px-3 py-1">
          <span className="text-sm font-semibold text-purple-600">5000</span>
          <p className="text-sm text-muted-foreground">postagens</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="bg-linear-purple w-full rounded-xl transition-all ease-linear hover:shadow-md">
          {' '}
          <UserRoundPlus /> Participar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CardsCommunityComponent
