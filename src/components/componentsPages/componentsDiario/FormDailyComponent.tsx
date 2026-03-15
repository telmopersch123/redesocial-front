import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, HelpCircle, HouseHeart, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/getMe'
import {
  dailyLogSchema,
  type DailyLogFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { getVerifDaily } from '../../../pages/DiaryPage'
import type { dailyBackType } from '../../../types'
import { MessagePerson } from '../../../utils/components/MessagePerson'
import { MessageForms } from '../../formCustomer/MessageForms'
import { Button } from '../../ui/button'
import { Textarea } from '../../ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'

const feelings = [
  { id: 1, emoji: '😢', label: 'Muito mal' },
  { id: 2, emoji: '😔', label: 'Mal' },
  { id: 3, emoji: '😐', label: 'Neutro' },
  { id: 4, emoji: '🙂', label: 'Bem' },
  { id: 5, emoji: '😊', label: 'Muito bem' },
]

const FormDailyComponent = ({
  validedDaily,
  dailyData,
  setDailyData,
  setValidedDaily,
  setLoadingDaily,
  createdDailyToday,
  setCreatedDailyToday,
  today,
}: {
  validedDaily: boolean
  dailyData?: dailyBackType
  setDailyData: React.Dispatch<React.SetStateAction<dailyBackType | undefined>>
  setValidedDaily: React.Dispatch<React.SetStateAction<boolean>>
  setLoadingDaily: React.Dispatch<React.SetStateAction<boolean>>
  createdDailyToday: boolean
  setCreatedDailyToday: React.Dispatch<React.SetStateAction<boolean>>
  today: boolean
}) => {
  const { user: authUser } = useAuth()
  const [loadingDailyCreate, setLoadingDailyCreate] = useState(false)
  let isBlocked = !!dailyData || validedDaily
  if (!createdDailyToday && today) isBlocked = false
  if (!createdDailyToday && today) validedDaily = false
  const formOpacity = validedDaily
    ? 'opacity-60 grayscale-[0.3] pointer-events-none'
    : ''

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: {
      mood: 0,
      energyLevel: 3,
      anxietyLevel: 3,
      gratitude: '',
      futureMessage: '',
    },
  })
  useEffect(() => {
    if (dailyData) {
      reset({
        mood: dailyData.emotionalDiary,
        energyLevel: dailyData.lvlenergy,
        anxietyLevel: dailyData.lvlanxiety,
        gratitude: dailyData.content,
        futureMessage: dailyData.messageUser,
      })
    } else {
      reset({
        mood: 0,
        energyLevel: 3,
        anxietyLevel: 3,
        gratitude: '',
        futureMessage: '',
      })
    }
  }, [dailyData, reset])
  const activeMood = watch('mood')
  const energia = watch('energyLevel')
  const ansiedade = watch('anxietyLevel')
  const gratitude = watch('gratitude')
  const futureMessage = watch('futureMessage')
  async function onSubmit(data: DailyLogFormData) {
    setLoadingDailyCreate(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/dailyLogUser`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      )
      if (!res.ok) {
        throw new Error('Erro ao enviar os dados')
      }

      // const dataRes = await res.json()
      setValidedDaily(true)
      setCreatedDailyToday(true)
      reset({
        mood: 0,
        energyLevel: 3,
        anxietyLevel: 3,
        gratitude: '',
        futureMessage: '',
      })
      MessagePerson('Pronto', 'Registro de hoje concluído!', 'success')
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
    } finally {
      setLoadingDailyCreate(false)
    }
  }

  return (
    <>
      <div className="flex w-full flex-col justify-center">
        {/* Aviso de Registro Concluído */}
        {validedDaily && (
          <div
            className={`mb-6 flex items-center justify-center gap-2 rounded-2xl border p-4 ${
              today
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-500'
            }`}
          >
            {today ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <span className="text-lg">📭</span>
            )}
            {today ? (
              <span className="text-sm font-semibold">
                Registro de hoje concluído! Volte amanhã.
              </span>
            ) : (
              <span className="text-sm font-medium">
                Nenhum registro para esse dia
              </span>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`transition-all duration-500 ${formOpacity}`}
        >
          <div className="flex flex-row">
            {/* Humor */}
            <div className="m-auto mt-3 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 2xl:max-w-2xl">
              {feelings.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  type="button"
                  disabled={isBlocked}
                  onClick={() =>
                    setValue('mood', item.id, { shouldValidate: true })
                  }
                  className={`flex h-[100px] flex-col items-center rounded-2xl border bg-white p-5 shadow-md transition-all duration-300 dark:bg-zinc-900 ${
                    !validedDaily && 'hover:scale-105'
                  } ${
                    activeMood === item.id
                      ? 'border-purple-500 ring-2 ring-purple-500/30 dark:ring-purple-500/50'
                      : 'border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>

            <div className="flex items-start">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-zinc-400 hover:text-purple-500"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-white p-3 text-xs text-purple-600 shadow-xl dark:bg-[#202020] dark:text-white">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      O que cada humor significa
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          emoji: '😢',
                          label: 'Muito mal',
                          desc: 'Sentimentos intensos de tristeza, exaustão ou dor emocional.',
                        },
                        {
                          emoji: '😔',
                          label: 'Mal',
                          desc: 'Dia difícil, desânimo ou sensação de peso emocional.',
                        },
                        {
                          emoji: '😐',
                          label: 'Neutro',
                          desc: 'Nem bem nem mal — um dia comum, sem grandes emoções.',
                        },
                        {
                          emoji: '🙂',
                          label: 'Bem',
                          desc: 'Leveza, tranquilidade e sensação de equilíbrio.',
                        },
                        {
                          emoji: '😊',
                          label: 'Muito bem',
                          desc: 'Alegria, energia e disposição elevada.',
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-start gap-2"
                        >
                          <span className="text-base">{item.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                              {item.label}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {errors.mood && (
            <p className="mt-2 text-center text-xs text-red-500">
              {errors.mood.message}
            </p>
          )}
          {/* Sliders */}
          <div className="mt-10 flex w-full flex-col gap-8 sm:flex-row">
            {/* Energia */}
            <div className="w-full">
              <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Nível de energia:{' '}
                <span className="text-zinc-500 dark:text-zinc-400">
                  {energia}
                </span>
              </p>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                disabled={isBlocked}
                {...register('energyLevel')}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 accent-emerald-500 disabled:cursor-not-allowed dark:border-zinc-700"
                style={{
                  background: validedDaily
                    ? '#3f3f46'
                    : `linear-gradient(to right, #94f3c0 ${(energia - 1) * 25}%, #27272a ${(energia - 1) * 25}%)`,
                }}
              />
            </div>

            {/* Ansiedade */}
            <div className="w-full">
              <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Nível de ansiedade:{' '}
                <span className="text-zinc-500 dark:text-zinc-400">
                  {ansiedade}
                </span>
              </p>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                disabled={isBlocked}
                {...register('anxietyLevel')}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 accent-orange-400 disabled:cursor-not-allowed dark:border-zinc-700"
                style={{
                  background: validedDaily
                    ? '#3f3f46'
                    : `linear-gradient(to right, #fed7aa ${(ansiedade - 1) * 25}%, #27272a ${(ansiedade - 1) * 25}%)`,
                }}
              />
            </div>
          </div>

          {/* Gratidão */}
          <div className="mt-10 flex w-full flex-col gap-6">
            <div className="flex flex-col">
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Pelo que você é grato hoje?
              </p>
              <Textarea
                {...register('gratitude')}
                disabled={isBlocked}
                className="mt-2 h-32 max-h-[400px] w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-700 shadow-sm transition-all duration-200 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:disabled:bg-zinc-800/50"
                placeholder={
                  validedDaily
                    ? 'Você já registrou sua gratidão de hoje.'
                    : 'Pense no pequeno detalhe que te fez sorrir hoje...'
                }
              />
              <div className="mt-2">
                <MessageForms
                  error={errors.gratitude?.message as string}
                  valueLength={gratitude?.length ?? 0}
                  maxLength={5000}
                />
              </div>
            </div>

            {/* Futuro */}
            <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-zinc-100 p-2.5 dark:bg-zinc-800">
                    <HouseHeart className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Mensagem para o futuro
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Sua cápsula do tempo pessoal
                    </p>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-zinc-400 hover:text-purple-500"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-white p-3 text-xs text-purple-600 shadow-xl dark:bg-[#202020] dark:text-white">
                      <p>
                        Escreva algo para ler no futuro. Essa mensagem será
                        exibida daqui a algum tempo.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Textarea
                {...register('futureMessage')}
                disabled={isBlocked}
                placeholder="Ex: Não esqueça que esse sentimento ruim vai passar..."
                className="min-h-[120px] w-full resize-none border-zinc-200 bg-white disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900/50"
              />
              <div className="mt-1 flex justify-between text-xs">
                <MessageForms
                  error={errors.futureMessage?.message as string}
                  valueLength={futureMessage?.length ?? 0}
                  maxLength={5000}
                />
              </div>
            </div>
          </div>
          {!dailyData && (
            <Button
              type="submit"
              disabled={loadingDailyCreate || isBlocked || !authUser}
              className={`m-auto mt-8 flex items-center justify-center gap-2 rounded-xl px-10 py-6 text-sm font-bold text-white transition-all duration-300 sm:w-max sm:self-end ${
                validedDaily
                  ? 'cursor-not-allowed bg-zinc-400 grayscale dark:bg-zinc-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
              }`}
            >
              {loadingDailyCreate ? (
                <>
                  Salvando registro <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : validedDaily ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Concluído por hoje
                </>
              ) : (
                <>
                  <HouseHeart className="h-5 w-5" />
                  Salvar Registro de Hoje
                </>
              )}
            </Button>
          )}
        </form>
        {dailyData && (
          <Button
            type="button"
            disabled={!dailyData}
            onClick={() => {
              setDailyData(undefined)
              getVerifDaily({
                setLoadingDaily,
                setValidedDaily,
                setCreatedDailyToday,
              })
            }}
            className={`m-auto mt-8 flex items-center justify-center gap-2 rounded-xl px-10 py-6 text-sm font-bold text-white transition-all duration-300 sm:w-max sm:self-end ${
              validedDaily
                ? 'cursor-not-allowed bg-zinc-400 grayscale dark:bg-zinc-700'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
            }`}
          >
            <>
              <HouseHeart className="h-5 w-5" />
              Criar um Registro
            </>
          </Button>
        )}
      </div>
    </>
  )
}

export default FormDailyComponent
