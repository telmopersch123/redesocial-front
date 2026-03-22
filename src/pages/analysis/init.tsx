import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, ShieldAlert, UserCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import {
  adminLoginSchema,
  type AdminLoginFormData,
} from '../../lib/validatorSchemas/autoSchemaAutenticator'

export default function AnalysisLogin() {
  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: AdminLoginFormData) => {
    console.log('Dados mascarados enviados:', data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-t-4 border-t-blue-600 shadow-2xl md:w-[600px]">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Suporte</CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" /> Identificador
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-50 dark:bg-white/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Senha (Mascarado) */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Chave de Acesso
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password" // Mascara a senha
                        placeholder="••••••••"
                        className="bg-slate-50 dark:bg-white/5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 py-6 text-lg font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                Autenticar no Painel
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
