import { CalendarHeart } from 'lucide-react'
import { Calendario } from '../components/componentsPages/componentsDiario/Calendario'
import FormDiario from '../components/componentsPages/componentsDiario/FormDiario'
import { DialogGraphicsMidia } from '../components/componentsPages/componentsDiario/GraphicsMidia'

const DiarioPage = () => {
  return (
    <div className="mt-16 w-[calc(100vw-2rem)] p-2 md:mt-10 md:w-[calc(100vw-20rem)]">
      <div>
        <h1 className="text-3xl font-bold">Diário Emocional</h1>
        <p className="mt-3 text-left text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
          Registre seus sentimentos e acompanhe sua jornada
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col justify-start space-y-5 xl:flex-row xl:space-x-5">
        {/* calendario */}
        <div className="flex w-full flex-col justify-between gap-2 dm:flex-row xl:w-[400px] xl:flex-col xl:justify-start">
          <div className="m-0 flex max-h-[400px] flex-col items-center rounded-2xl border py-4 shadow-sm dm:w-1/2 xl:my-0 xl:w-auto">
            <div className="flex items-center gap-2 p-1 text-muted-foreground">
              <CalendarHeart />
              <h2> Selecione uma data</h2>
            </div>
            <Calendario />
          </div>

          <DialogGraphicsMidia />
        </div>
        {/* entradas do diario */}
        <div className="mt-5 flex w-full flex-col space-y-3 rounded-2xl border p-5 xl:!mt-0">
          <h2 className="text-xl font-semibold">6 de novembro de 2025</h2>
          <p className="text-muted-foreground">Como você está se sentindo?</p>
          <FormDiario />
        </div>
      </div>
    </div>
  )
}

export default DiarioPage
