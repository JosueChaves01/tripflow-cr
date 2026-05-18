'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createUser } from '@/features/auth/actions'
import { useI18n } from '@/i18n'
import { useNotification } from '@/components/ui/NotificationProvider'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['tourist', 'provider']),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { showAlert } = useNotification()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    form.set('full_name', data.full_name)
    form.set('email', data.email)
    form.set('password', data.password)
    form.set('role', data.role)

    const result = await createUser(form as any)
    if (result?.error) {
      await showAlert(result.error, 'Error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">{t('createAccount')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('fullName')}
            id="full_name"
            {...register('full_name')}
            error={errors.full_name?.message}
          />
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
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-sm font-medium text-slate-700">{t('iAmA')}</label>
            <select
              id="role"
              {...register('role')}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="tourist">{t('tourist')}</option>
              <option value="provider">{t('activityProvider')}</option>
            </select>
          </div>
          <Button type="submit">{t('createAccount')}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          {t('alreadyHaveAccount')}{' '}
          <a href="/login" className="text-emerald-600 hover:underline">{t('signIn')}</a>
        </p>
      </Card>
    </div>
  )
}