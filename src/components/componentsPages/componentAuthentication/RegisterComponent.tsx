// src/components/auth/RegisterComponent.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PasswordRequirements } from '../../../auth/PasswordRequirements'
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
import {
  registerSchema,
  type RegisterFormData,
} from '../../../lib/validatorSchemas/autoSchemaAutenticator'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
interface RegisterComponentProps {
  onSwitchToLogin: () => void
  setShowConfirmPass: React.Dispatch<React.SetStateAction<boolean>>
}
export const hasNumber = (password: string) => /\d/.test(password)
export const hasSpecialChar = (password: string) =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
export const hasMinLength = (password: string) => password.length >= 6

const RegisterComponent = ({
  onSwitchToLogin,
  setShowConfirmPass,
}: RegisterComponentProps) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      sexo: 'feminino',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusPassword, setFocusPassword] = useState(false)

  const password = watch('password', '')

  function onSubmit(data: RegisterFormData) {
    console.log(data)
    setShowConfirmPass(true)
  }

  return (
    <Card className="m-auto w-full max-w-md border-0 bg-white text-black shadow-2xl">
      <CardHeader className="bg-linear-purple rounded-md py-10 text-center text-white">
        <CardTitle className="text-4xl font-bold">Crie sua conta</CardTitle>
        <CardDescription className="text-lg text-white/90">
          É rápido e fácil
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 bg-white pt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('name')}
                id="name"
                placeholder="João Silva"
                className="h-12 pl-11"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Sexo</Label>

            <Controller
              name="sexo"
              control={control}
              defaultValue="feminino"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="masculino"
                      id="masculino"
                      className="border-purple-400 data-[state=checked]:border-purple-600 data-[state=checked]:bg-blue-300"
                    />
                    <Label htmlFor="masculino" className="cursor-pointer">
                      Masculino
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="feminino"
                      id="feminino"
                      className="border-pink-400 data-[state=checked]:border-purple-600 data-[state=checked]:bg-pink-300"
                    />
                    <Label htmlFor="feminino" className="cursor-pointer">
                      Feminino
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.sexo && (
              <p className="text-sm text-red-500">{errors.sexo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="h-12 pl-11"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('password')}
                id="password"
                value={password}
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
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

            <PasswordRequirements
              password={password}
              focusPassword={focusPassword}
              hasNumber={hasNumber}
              hasSpecialChar={hasSpecialChar}
              hasMinLength={hasMinLength}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
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
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start space-y-2">
            <Controller
              name="terms"
              control={control}
              rules={{ required: 'Você precisa aceitar os termos!' }} // opcional se usar Zod
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={field.value} // importante: controla o estado
                    onCheckedChange={(checked) => {
                      field.onChange(checked) // atualiza o form
                    }}
                  />
                  <Label
                    htmlFor="terms"
                    className="cursor-pointer text-sm font-normal leading-tight"
                  >
                    Aceito os{' '}
                    <span className="font-medium text-purple-600">
                      Termos de Uso
                    </span>{' '}
                    e{' '}
                    <span className="font-medium text-purple-600">
                      Política de Privacidade
                    </span>
                  </Label>
                </div>
              )}
            />
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-linear-purple h-12 w-full text-lg font-bold text-white shadow-lg hover:opacity-90"
          >
            Criar minha conta
          </Button>
        </CardContent>
      </form>
      <div className="py-4 text-center">
        <span className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-purple-600 hover:text-purple-700"
          >
            Fazer login
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

export default RegisterComponent
