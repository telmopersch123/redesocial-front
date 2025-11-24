// src/components/auth/LoginComponent.tsx
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
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

interface LoginComponentProps {
  onSwitchToRegister: () => void
}

const LoginComponent = ({ onSwitchToRegister }: LoginComponentProps) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <Card className="m-auto w-full max-w-md border-0 shadow-2xl">
      <CardHeader className="bg-linear-purple rounded-md py-10 text-center text-white">
        <CardTitle className="text-4xl font-bold">
          Bem-vindo de volta!
        </CardTitle>
        <CardDescription className="text-lg text-white/90">
          Acesse sua conta agora
        </CardDescription>
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="space-y-6 pt-8">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="cursor-pointer text-sm">
                Lembrar-me
              </Label>
            </div>
            <a href="#" className="text-sm text-purple-600 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <Button className="bg-linear-purple h-12 w-full text-lg font-bold text-white shadow-lg hover:opacity-90">
            Entrar na conta
          </Button>

          <div className="pt-4 text-center">
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

export default LoginComponent
