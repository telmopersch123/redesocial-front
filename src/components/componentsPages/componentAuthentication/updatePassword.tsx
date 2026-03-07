import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Eye, EyeOff } from 'lucide-react'

import { PasswordRequirements } from '../../../auth/PasswordRequirements'
import { useResetPassword } from '../../../context/ResetPasswordContext'
import {
  resetSchema,
  type ResetFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { resetPasswordCod } from '../../../services/authService'

import { MessagePerson } from '../../../utils/components/MessagePerson'
import { Button } from '../../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { hasMinLength, hasNumber, hasSpecialChar } from './RegisterComponent'
interface ResetPassWordProps {
  setPermissionCode: (value: boolean) => void
  setIsLogin: (value: boolean) => void
  setForgotPassword: (value: boolean) => void
}

const ResetPasswordComponent = ({
  setPermissionCode,
  setIsLogin,
  setForgotPassword,
}: ResetPassWordProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focusPassword, setFocusPassword] = useState(false)
  const { email, setMessageConfirm, setIsLoading } = useResetPassword()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })
  const password = watch('password', '')
  const onSubmit = async (data: ResetFormData) => {
    try {
      setIsLoading(true)
      const success = await resetPasswordCod(email, data.password)
      if (!success) {
        MessagePerson(
          'Ops! algo deu errado',
          'Por favor, tente novamente mais tarde',
          'error'
        )
        setMessageConfirm(false)
      }
      if (success) {
        setIsLogin(true)
        setPermissionCode(false)
        setForgotPassword(false)
        setMessageConfirm(true)
      }
    } catch (err) {
      setIsLoading(false)
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="m-auto mt-44 w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple relative rounded-md py-10 text-center text-white">
        <CardTitle className="text-3xl font-bold">Redefinir senha</CardTitle>
        <CardDescription className="text-white/90">
          Crie uma nova senha segura para sua conta
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 bg-white pt-8">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>

            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 pr-12"
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <PasswordRequirements
              password={password}
              focusPassword={focusPassword}
              hasNumber={hasNumber}
              hasSpecialChar={hasSpecialChar}
              hasMinLength={hasMinLength}
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>

            <div className="relative">
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* BOTÃO */}
          <Button
            type="submit"
            className="bg-linear-purple h-12 w-full text-white shadow-lg shadow-purple-300/30 transition-all hover:shadow-purple-400/40"
          >
            Salvar nova senha
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

export default ResetPasswordComponent
