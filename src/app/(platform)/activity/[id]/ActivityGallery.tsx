import Image from 'next/image'

interface ActivityGalleryProps {
  images: string[]
  title: string
}

export function ActivityGallery({ images, title }: ActivityGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mb-8">
        Sin imágenes disponibles
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden mb-8 h-[400px]">
      <div className="relative h-full w-full">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 h-full">
        {images.slice(1, 5).map((img, idx) => (
          <div key={idx} className="relative h-full w-full overflow-hidden">
            <Image
              src={img}
              alt={`${title} - image ${idx + 2}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
              sizes="25vw"
            />
          </div>
        ))}
        {images.length < 5 && Array.from({ length: 4 - (images.length - 1) }).map((_, idx) => (
          <div key={`empty-${idx}`} className="bg-slate-100 h-full w-full" />
        ))}
      </div>
    </div>
  )
}
