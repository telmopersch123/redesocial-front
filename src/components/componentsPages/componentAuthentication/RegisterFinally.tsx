import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { useAuth } from '@/context/getMe'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useResetPassword } from '../../../context/ResetPasswordContext'
import {
  usernameSchema,
  type UsernameFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'

interface RegisterFormData {
  firstStepData: FirstStepData
  sexo: string
}

export type FirstStepData = {
  password: string
  name: string
}

const RegisterFinally = ({ firstStepData, sexo }: RegisterFormData) => {
  const { refreshUser } = useAuth()
  const { setIsLoading, isLoading } = useResetPassword()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      name_at: '',
    },
  })

  const username = watch('name_at')

  async function onSubmit(data: UsernameFormData) {
    try {
      setIsLoading(true)
      const resCheck = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/username/check`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name_at: data.name_at }),
        }
      )

      if (!resCheck.ok) {
        const error = await resCheck.json()
        throw new Error(error.message || 'Username indisponível')
      }

      const registerData = {
        name: firstStepData.name,
        password: firstStepData.password,
        name_at: data.name_at,
        sexo,
      }

      const resRegister = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerData),
          credentials: 'include',
        }
      )

      if (!resRegister.ok) {
        const error = await resRegister.json()
        setError('name_at', {
          type: 'server',
          message: error.message || 'Nome indisponível. Tente outro!',
        })

        return
      }

      if (resRegister.ok) {
        await refreshUser()
        window.location.href = '/'
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="m-auto w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple rounded-md py-10 text-center text-white">
        <span className="block text-center text-sm font-medium text-white">
          Só mais um passo para concluir seu cadastro ✨
        </span>

        <CardTitle className="text-3xl font-bold">
          Escolha seu nome de usuário
        </CardTitle>
        <CardDescription className="text-base text-white/90">
          É assim que as pessoas vão encontrar você
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 bg-white pt-8">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário</Label>

            <div className="relative">
              <AtSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

              <Input
                {...register('name_at')}
                id="username"
                placeholder="seunome"
                className="h-12 pl-11"
              />
            </div>

            {username && !errors.name_at && !isLoading && (
              <p className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />@{username} atende aos
                requisitos da comunidade
              </p>
            )}

            {errors.name_at && (
              <p className="text-sm text-red-500">{errors.name_at.message}</p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Você pode usar letras, números, ponto ou underline.
            <br />
            Exemplo: <strong>@joao.silva</strong>
          </p>

          <Button
            type="submit"
            className="bg-linear-purple h-12 w-full text-lg font-bold text-white shadow-lg hover:opacity-90"
          >
            Concluir cadastro
          </Button>
        </CardContent>
      </form>

      <CardFooter className="rounded-xl border-t border-[#e5e5e5] bg-black/5 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          Esse nome será único e público
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterFinally
