import { type LucideIcon } from 'lucide-react'

interface FeatureListProps {
  title: string
  icon: LucideIcon
  items: string[]
  iconColor?: string
  bulletColor?: string
}

export function FeatureList({ title, icon: Icon, items, iconColor = 'text-emerald-600', bulletColor = 'text-emerald-500' }: FeatureListProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Icon size={24} className={iconColor} />
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-700 text-lg">
            <span className={`${bulletColor} mt-1 font-bold`}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
