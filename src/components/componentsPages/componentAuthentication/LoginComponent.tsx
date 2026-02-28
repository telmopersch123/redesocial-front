// src/components/auth/LoginComponent.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Checkbox } from '../../../components/ui/checkbox'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useAuth } from '../../../context/getMe'
import { useResetPassword } from '../../../context/ResetPasswordContext'
import {
  loginSchema,
  type LoginFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { loginUser } from '../../../services/authService'
import ValidatedCodeLogin from './ValidatedCodeLogin'

interface LoginComponentProps {
  onSwitchToRegister: () => void
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginComponent = ({
  onSwitchToRegister,
  setForgotPassword,
}: LoginComponentProps) => {
  const { setUser } = useAuth()
  const { setIsLoading } = useResetPassword()
  const [step, setStep] = useState<'login' | '2fa'>('login')
  const [twoFactorData, setTwoFactorData] = useState<{
    userId: number
    rememberMe: boolean
    email: string
  } | null>(null)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  function onSubmit(data: LoginFormData) {
    async function login() {
      try {
        setIsLoading(true)
        const response = await loginUser(
          data.email,
          data.password,
          data.rememberMe
        )
        if (response.twoFactorRequired) {
          setTwoFactorData({
            userId: response.userId,
            rememberMe: data.rememberMe ?? false,
            email: data.email,
          })
          setStep('2fa')
        } else if (response.user) {
          setUser(response.user)
          window.location.href = '/'
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    login()
  }

  return step === 'login' ? (
    <Card className="m-auto w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple rounded-md py-10 text-center text-white">
        <CardTitle className="text-4xl font-bold">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription className="text-lg text-white/90">
          Acesse sua conta agora
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="on" action="#">
        <CardContent className="space-y-6 bg-white pt-8">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                name="email"
                autoComplete="username email"
                placeholder="seu@email.com"
                className="h-12 pl-11"
              />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('password')}
                id="password"
                name="password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                )}
              />
              <Label htmlFor="remember" className="cursor-pointer text-sm">
                Lembrar-me
              </Label>
            </div>
            <a
              onClick={() => setForgotPassword(true)}
              className="cursor-pointer text-sm text-purple-600 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>

          <Button
            type="submit"
            className="bg-linear-purple h-12 w-full text-lg font-bold text-white shadow-lg hover:opacity-90"
          >
            Entrar na conta
          </Button>
        </CardContent>
      </form>
      <div className="py-4 text-center">
        <span className="text-sm text-muted-foreground">
          Ainda não tem conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-purple-600 hover:text-purple-700"
          >
            Criar agora
          </button>
        </span>
      </div>
      <CardFooter className="rounded-xl border-t border-[#e5e5e5] bg-black/5 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          Seus dados estão 100% seguros
        </p>
      </CardFooter>
    </Card>
  ) : (
    <ValidatedCodeLogin
      userId={twoFactorData?.userId || 0}
      rememberMe={twoFactorData?.rememberMe || false}
      onBack={() => setStep('login')}
    />
  )
}

export default LoginComponent
