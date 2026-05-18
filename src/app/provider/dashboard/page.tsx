'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createActivity } from '@/features/providers/actions'

const activitySchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  location: z.string(),
  duration_minutes: z.number().positive(),
  category: z.string(),
  available: z.boolean(),
})

type ActivityForm = z.infer<typeof activitySchema>

export default function ProviderDashboardPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
  })

  const onSubmit = async (data: ActivityForm) => {
    const result = await createActivity({ ...data, images: [] })
    if (result.error) alert(result.error)
    else {
      setActivities((prev) => [...prev, result.data])
      setShowForm(false)
      reset()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Provider Dashboard</h1>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">My Activities</h2>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Activity'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-4">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input label="Activity Name" {...register('name')} error={errors.name?.message} />
                <Input label="Description" {...register('description')} error={errors.description?.message} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Price ($)" type="number" {...register('price', { valueAsNumber: true })} error={errors.price?.message} />
                  <Input label="Duration (min)" type="number" {...register('duration_minutes', { valueAsNumber: true })} error={errors.duration_minutes?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Location" {...register('location')} error={errors.location?.message} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select {...register('category')} className="rounded-lg border border-slate-300 px-3 py-2">
                      <option value="Tours">Tours</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Culture">Culture</option>
                      <option value="Food">Food</option>
                      <option value="Nature">Nature</option>
                    </select>
                  </div>
                </div>
                <Button type="submit">Save Activity</Button>
              </form>
            </Card>
          )}

          {activities.length === 0 ? (
            <Card className="text-center text-slate-500 py-8">No activities yet</Card>
          ) : (
            <div className="flex flex-col gap-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{activity.name}</h3>
                      <p className="text-sm text-slate-500">{activity.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={activity.available ? 'success' : 'neutral'}>
                        {activity.available ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="font-medium text-emerald-600">${activity.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Recent Bookings</h2>
          <Card className="text-center text-slate-500 py-8">No bookings yet</Card>
        </div>
      </div>
    </div>
  )
}