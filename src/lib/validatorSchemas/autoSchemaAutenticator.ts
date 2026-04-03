import { z } from 'zod'
const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres')
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos um número e um caractere especial'
      ),
    confirmPassword: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Insira um email válido'),
})

export const loginSchema = z.object({
  email: z.string().email('Insira um email valido'),
  password: z
    .string()
    .min(6, 'A senha precisa ter pelo menos 6 caracteres')
    .regex(
      passwordRegex,
      'A senha deve conter pelo menos um número e um caractere especial'
    ),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    password: z
      .string()
      .min(6, 'A senha precisa ter pelo menos 6 caracteres')
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos um número e um caractere especial'
      ),
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

export const createCommunitySchema = z.object({
  nameComunity: z
    .string()
    .min(10, 'Nome muito curto, escreva pelo menos 10 caracteres')
    .max(50, 'Nome muito longo'),
  description: z
    .string()
    .min(50, 'Descrição muito curta, escreva pelo menos 50 caracteres')
    .max(256, 'Descrição muito longa'),
  category: z.string().min(1, 'Selecione uma categoria'),
  limit: z.number().min(10).max(999),
  whoCanPost: z.enum(['members', 'admins']),
  whoCanComment: z.enum(['members', 'admins']),
  isPrivate: z.boolean(),
  image: z
    .union([z.string(), z.instanceof(File)])
    .nullable()
    .optional(),
  rules: z.string().max(256).nullable().optional(),
})

export const configCommunitySchema = z.object({
  image: z.instanceof(FileList).optional(),
  nameComunity: z
    .string()
    .min(10, 'Nome muito curto, escreva pelo menos 10 caracteres')
    .max(50, 'Nome muito longo'),
  description: z
    .string()
    .min(50, 'Descrição muito curta, escreva pelo menos 50 caracteres')
    .max(256, 'Descrição muito longa'),
  category: z.string().min(1, 'Selecione uma categoria'),
  whoCanPost: z.enum(['members', 'admins']).optional(),
  whoCanComment: z.enum(['members', 'admins']).optional(),
  limit: z.number().min(10).max(999).optional(),
  rules: z.string().max(256).nullable().optional(),
  isPrivate: z.boolean().optional(),
})

export const postDialogSchema = z
  .object({
    feeling: z.string().min(1, 'Selecione um sentimento'),
    description: z
      .string()
      .min(10, 'Descrição muito curta, escreva pelo menos 10 caracteres')
      .max(5000, 'Descrição muito longa'),
    tags: z
      .array(z.string().min(1))
      .max(10, 'Você pode adicionar no máximo 10 tags')
      .optional(),
    media: z
      .object({
        url: z.string().refine(
          (val) => {
            try {
              new URL(val)
              return true
            } catch {
              return false
            }
          },
          { message: 'URL de mídia inválida' }
        ),
        type: z.enum(['image', 'video']),
      })
      .optional()
      .nullable(),

    destination: z
      .object({
        type: z.enum(['geral', 'comunidade']),
        communityId: z.number().int().positive().nullable().optional(),
      })
      .optional(),
    anonymous: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // regra condicional: se for comunidade, precisa de communityId
    if (
      data.destination?.type === 'comunidade' &&
      !data.destination.communityId
    ) {
      ctx.addIssue({
        path: ['destination', 'communityId'],
        message: 'Selecione uma comunidade',
        code: 'custom',
      })
    }
  })

export const usernameSchema = z.object({
  name_at: z
    .string()
    .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
    .max(20, 'O nome de usuário pode ter no máximo 20 caracteres')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9._]*$/,
      'Use apenas letras, números, ponto (.) ou underline (_), começando com letra'
    ),
})
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg']

export const archivePostSchema = z.object({
  motivo: z
    .string()
    .min(10, 'A justificativa deve ter pelo menos 10 caracteres')
    .max(5000, 'A justificativa é muito longa'),

  imagens: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Formato inválido (apenas PNG ou JPG)'
        )
        .refine(
          (file) => file.size <= MAX_IMAGE_SIZE,
          'Imagem muito grande (máx. 5MB)'
        )
    )
    .optional(),
})

export const dailyLogSchema = z.object({
  mood: z.number().min(1, 'Selecione o humor').max(5),
  energyLevel: z.coerce.number().min(1).max(5),
  anxietyLevel: z.coerce.number().min(1).max(5),
  gratitude: z
    .string()
    .min(3, 'Conte um pouco mais sobre sua gratidão.')
    .max(5000, 'O texto é muito longo (máximo 5000 caracteres).'),
  futureMessage: z
    .string()
    .min(1, 'Conte algo para o seu eu do futuro 💌')
    .max(5000, 'A mensagem para o futuro deve ter no máximo 5000 caracteres.'),
})

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(7, 'O nome de usuário deve ter pelo menos 7 caracteres'),
  password: z.string().min(10, 'A senha precisa ter pelo menos 10 caracteres'),
})

export const reportUser = z.object({
  reason: z.enum(
    [
      'assedio_ou_bullying',
      'discurso_de_odio',
      'conteudo_improprio',
      'spam_ou_comportamento_suspeito',
      'falsa_identidade',
      'outro',
    ],
    {
      errorMap: () => ({
        message: 'Por favor, selecione um motivo válido da lista.',
      }),
    }
  ),
})
export const reportPostSchema = z.object({
  reason: z.enum(
    [
      'assedio_ou_bullying',
      'discurso_de_odio',
      'conteudo_improprio',
      'spam_ou_comportamento_suspeito',
      'falsa_identidade',
      'outro',
    ],
    {
      errorMap: () => ({
        message: 'Por favor, selecione um motivo válido da lista.',
      }),
    }
  ),
  description: z
    .string()
    .min(80, 'A descrição deve ter no mínimo 80 caracteres.'),
})

export type ReportPostFormData = z.infer<typeof reportPostSchema>
export type CreateReportUserFormData = z.infer<typeof reportUser>
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>
export type ArchivePostFormData = z.infer<typeof archivePostSchema>
export type UsernameFormData = z.infer<typeof usernameSchema>
export type DailyLogFormData = z.infer<typeof dailyLogSchema>
export type PostDialogSchema = z.infer<typeof postDialogSchema>
export type CreateCommunityFormData = z.infer<typeof createCommunitySchema>
export type ConfigCommunityFormData = z.infer<typeof configCommunitySchema>
export type ResetFormData = z.infer<typeof resetSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
