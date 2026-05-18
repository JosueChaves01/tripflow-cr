'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { loginUser } from '@/features/auth/actions'
import { useI18n } from '@/i18n'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { t } = useI18n()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    form.set('email', data.email)
    form.set('password', data.password)
    const result = await loginUser(form as any)
    if (result?.error) alert(result.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">{t('signInHeading')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('email')}
            type="email"
            id="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label={t('password')}
            type="password"
            id="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button type="submit">{t('signIn')}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          {t('dontHaveAccount')}{' '}
          <a href="/register" className="text-emerald-600 hover:underline">{t('createOne')}</a>
        </p>
      </Card>
    </div>
  )
}