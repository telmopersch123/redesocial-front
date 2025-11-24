// src/components/auth/RegisterComponent.tsx
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
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

interface RegisterComponentProps {
  onSwitchToLogin: () => void
}

const RegisterComponent = ({ onSwitchToLogin }: RegisterComponentProps) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <Card className="m-auto w-full max-w-md border-0 shadow-2xl">
      <CardHeader className="bg-linear-purple rounded-md py-10 text-center text-white">
        <CardTitle className="text-4xl font-bold">Crie sua conta</CardTitle>
        <CardDescription className="text-lg text-white/90">
          É rápido e fácil
        </CardDescription>
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="space-y-6 pt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                placeholder="João Silva"
                className="h-12 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="h-12 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
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
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-tight"
            >
              Aceito os{' '}
              <span className="font-medium text-purple-600">Termos de Uso</span>{' '}
              e{' '}
              <span className="font-medium text-purple-600">
                Política de Privacidade
              </span>
            </Label>
          </div>

          <Button className="bg-linear-purple h-12 w-full text-lg font-bold text-white shadow-lg hover:opacity-90">
            Criar minha conta
          </Button>

          <div className="pt-4 text-center">
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
        </CardContent>
      </form>
      <CardFooter className="rounded-2xl border-t bg-muted/50 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          Seus dados estão 100% seguros
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterComponent
