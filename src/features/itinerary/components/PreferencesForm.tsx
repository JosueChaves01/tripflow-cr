'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useTripFlowStore } from '@/store'
import { useI18n } from '@/i18n'
import { LocationPicker } from './LocationPicker'

const schema = z.object({
  activity_types: z.string(),
  budget_range: z.enum(['low', 'medium', 'high']),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
  group_size: z.number().min(1).max(20),
})

type FormData = z.infer<typeof schema>

const ACTIVITY_TYPES = ['Tours', 'Adventure', 'Culture', 'Food', 'Nature']

export function PreferencesForm({ className }: { className?: string }) {
  const router = useRouter()
  const { t } = useI18n()
  const setPreferences = useTripFlowStore((s) => s.setPreferences)
  const setCurrentItinerary = useTripFlowStore((s) => s.setCurrentItinerary)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget_range: 'medium',
      group_size: 2,
      location: { lat: 10.4805, lng: -84.6423, address: '' },
    },
  })

  const locationValue = watch('location')
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const onSubmit = async (data: FormData) => {
    const activityTypes = data.activity_types
      ? data.activity_types.split(',').filter(Boolean)
      : []

    const prefs = {
      ...data,
      activity_types: activityTypes,
    }

    setPreferences(prefs as any)

    const res = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences: prefs }),
    })
    const json = await res.json()
    if (json.error) {
      alert(json.error)
    } else {
      setCurrentItinerary(json as any)
      router.push('/itinerary')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4 ${className}`}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">{t('activityTypes')}</label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                value={type.toLowerCase()}
                {...register('activity_types')}
                className="rounded"
              />
              <span className="text-sm text-slate-600">{t(type.toLowerCase() as any) || type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">{t('budget')}</label>
          <select {...register('budget_range')} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="low">{t('lowBudget')}</option>
            <option value="medium">{t('mediumBudget')}</option>
            <option value="high">{t('highBudget')}</option>
          </select>
        </div>
        <Input
          label={t('groupSize')}
          type="number"
          min={1}
          max={20}
          {...register('group_size', { valueAsNumber: true })}
          error={errors.group_size?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('startDate')} type="date" {...register('start_date')} error={errors.start_date?.message} />
        <Input label={t('endDate')} type="date" {...register('end_date')} error={errors.end_date?.message} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">{t('preferredLocation')}</label>
        <LocationPicker
          apiKey={apiKey}
          value={locationValue}
          onChange={(loc) => setValue('location', loc, { shouldValidate: true })}
        />
      </div>
      <Button type="submit">{t('generateItinerary')}</Button>
    </form>
  )
}