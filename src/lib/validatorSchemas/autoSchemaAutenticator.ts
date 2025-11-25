import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Insira um email valido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Você precisa aceitar os termos!',
    }),
    sexo: z.enum(['masculino', 'feminino']).refine((val) => val !== undefined, {
      message: 'Selecione seu sexo',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
