-- Ampliar la tabla activities
alter table public.activities 
  add column if not exists included text[] default '{}',
  add column if not exists requirements text[] default '{}',
  add column if not exists lat numeric,
  add column if not exists lng numeric;

-- Crear tabla reviews
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- Habilitar RLS en reviews
alter table public.reviews enable row level security;

-- Crear políticas para reviews si no existen
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'reviews' and policyname = 'Public can view reviews'
  ) then
    create policy "Public can view reviews" on public.reviews for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'reviews' and policyname = 'Users can manage own reviews'
  ) then
    create policy "Users can manage own reviews" on public.reviews for all using (auth.uid() = user_id);
  end if;
end
$$;

-- ============================================================
-- Seeding y Ajuste de Mocks Existentes
-- ============================================================

-- Actualizar actividades de aventura
update public.activities
set 
  included = array['Guía experto certificado', 'Equipo de seguridad de alta calidad', 'Agua embotellada y snacks', 'Entrada al parque/reserva'],
  requirements = array['Zapatos cerrados de senderismo', 'Ropa cómoda y de cambio', 'Protector solar y repelente de insectos', 'Buena condición física']
where category ilike '%adventure%' or category ilike '%aventura%';

-- Actualizar actividades de naturaleza o tours
update public.activities
set 
  included = array['Guía naturalista bilingüe', 'Prismáticos para avistamiento', 'Transporte desde el punto de encuentro', 'Frutas tropicales frescas'],
  requirements = array['Cámara fotográfica o celular', 'Capa para lluvia (según temporada)', 'Repelente de insectos biodegradable', 'Botella de agua reutilizable']
where category ilike '%nature%' or category ilike '%naturaleza%' or category ilike '%tours%';

-- Actualizar actividades de cultura / comida
update public.activities
set 
  included = array['Degustación de platillos tradicionales', 'Bebidas locales (chicha, café)', 'Ingredientes para taller de cocina', 'Recetario digital al finalizar'],
  requirements = array['Informar sobre alergias alimentarias', 'Calzado cómodo para caminar', 'Hambre y entusiasmo por aprender']
where category ilike '%culture%' or category ilike '%cultura%' or category ilike '%food%' or category ilike '%comida%';

-- Para cualquier otra actividad que quede vacía, asignar valores generales
update public.activities
set 
  included = array['Guía local bilingüe', 'Entradas y accesos', 'Snack ligero o bebida'],
  requirements = array['Ropa cómoda para el clima tropical', 'Protector solar', 'Repelente de insectos']
where included = '{}' or included is null;

-- Insertar reseñas de prueba asociadas a algún perfil existente para que el detalle luzca espectacular
do $$
declare
  v_user_id uuid;
  v_activity record;
begin
  -- Intentar obtener el primer perfil de turista o cualquier perfil
  select id into v_user_id from public.profiles limit 1;
  
  if v_user_id is not null then
    -- Para cada actividad, insertar 2 reseñas si no existen ya
    for v_activity in select id, name from public.activities loop
      if not exists (select 1 from public.reviews where activity_id = v_activity.id) then
        -- Reseña 1
        insert into public.reviews (activity_id, user_id, rating, comment)
        values (
          v_activity.id, 
          v_user_id, 
          5, 
          '¡Una experiencia absolutamente increíble! El guía fue super amable y conocía muchísimo sobre la zona. Altamente recomendado.'
        );

        -- Reseña 2
        insert into public.reviews (activity_id, user_id, rating, comment)
        values (
          v_activity.id, 
          v_user_id, 
          4, 
          'Muy bien organizado y puntual. La vista fue hermosa. Definitivamente volvería a contratar con ellos.'
        );
      end if;
    end loop;
  end if;
end
$$;
