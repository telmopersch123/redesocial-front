// src/components/auth/LoginComponent.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  loginSchema,
  type LoginFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { loginUser } from '../../../services/authService'

interface LoginComponentProps {
  onSwitchToRegister: () => void
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginComponent = ({
  onSwitchToRegister,
  setForgotPassword,
}: LoginComponentProps) => {
  const [rememberMe, setRememberMe] = useState(false)
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: LoginFormData) {
    async function login() {
      const loggedUser = await loginUser(data.email, data.password)
      if (loggedUser) {
        setUser(loggedUser)

        window.location.href = '/'
      } else {
        alert('Email ou senha incorretos')
      }
    }
    login()
  }
  return (
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
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                id="remember"
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
  )
}

export default LoginComponent
