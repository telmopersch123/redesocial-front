import { CalendarHeart } from 'lucide-react'
import { Calendario } from '../components/componentsPages/componentsDiario/Calendario'

const DiarioPage = () => {
  return (
    <div className="mt-16 w-[calc(100vw-2rem)] p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <div>
        <h1 className="text-3xl font-bold">Diário Emocional</h1>
        <p className="mt-3 text-left text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
          Registre seus sentimentos e acompanhe sua jornada
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col justify-between space-y-5 xl:flex-row xl:space-x-5">
        {/* calendario */}
        <div className="dm:w-[300px] m-auto flex w-full flex-col items-center rounded-2xl border py-4 shadow-sm">
          <div className="flex items-center gap-2 p-1 text-muted-foreground">
            <CalendarHeart />
            <h2> Selecione uma data</h2>
          </div>
          <Calendario />
        </div>
        {/* entradas do diario */}
        <div className="mt-5 w-full rounded-2xl border p-5 xl:!mt-0">
          <h2 className="text-xl font-semibold">6 de novembro de 2025</h2>
          <p className="text-muted-foreground">Como você está se sentindo?</p>
        </div>
      </div>
    </div>
  )
}

export default DiarioPage
