-- ============================================================
-- Hotels table
-- ============================================================
create table if not exists public.hotels (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  name text not null,
  description text,
  price_per_night numeric(10,2) not null,
  location text,
  stars integer check (stars >= 1 and stars <= 5),
  category text,
  available boolean default true,
  images text[] default '{}',
  amenities text[] default '{}',
  policies text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);

alter table public.hotels enable row level security;

create policy "Public can view available hotels"
  on public.hotels for select using (available = true);

create policy "Providers manage own hotels"
  on public.hotels for all
  using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- ============================================================
-- Make reviews polymorphic (activity OR hotel)
-- ============================================================
alter table public.reviews
  add column if not exists hotel_id uuid references public.hotels(id) on delete cascade;

alter table public.reviews
  alter column activity_id drop not null;

-- Constraint: exactly one target must be set
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'review_target_check'
  ) then
    alter table public.reviews
      add constraint review_target_check
      check (
        (activity_id is not null and hotel_id is null) or
        (activity_id is null and hotel_id is not null)
      );
  end if;
end
$$;

-- ============================================================
-- Make bookings polymorphic (activity OR hotel)
-- ============================================================
alter table public.bookings
  add column if not exists hotel_id uuid references public.hotels(id);

alter table public.bookings
  alter column activity_id drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'booking_target_check'
  ) then
    alter table public.bookings
      add constraint booking_target_check
      check (
        (activity_id is not null and hotel_id is null) or
        (activity_id is null and hotel_id is not null)
      );
  end if;
end
$$;

-- ============================================================
-- Seed Hotels
-- ============================================================
do $$
declare
  v_provider_id uuid;
  v_user_id uuid;
  v_hotel_id uuid;
begin
  -- Use first provider, or create a dummy if none exists
  select id into v_provider_id from public.providers limit 1;
  select id into v_user_id from public.profiles limit 1;

  if v_provider_id is null then
    -- Skip seeding if no provider exists
    return;
  end if;

  -- Hotel 1: Resort
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Tabacón Thermal Resort & Spa',
    'Ubicado al pie del Volcán Arenal, este resort de lujo ofrece acceso exclusivo a aguas termales naturales rodeadas de exuberante vegetación tropical. Disfruta de tratamientos de spa de clase mundial, gastronomía gourmet y vistas espectaculares al volcán desde tu habitación.',
    285,
    'La Fortuna, Arenal',
    5,
    'Resort',
    array['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    array['Aguas Termales Naturales', 'Spa de Lujo', 'Restaurante Gourmet', 'Wi-Fi Gratuito', 'Piscina Infinity', 'Servicio al Cuarto 24h', 'Estacionamiento Gratuito', 'Gimnasio'],
    array['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'No se permiten mascotas', 'Cancelación gratuita hasta 48h antes']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, '¡Las aguas termales son un paraíso! La vista al volcán desde la habitación es simplemente mágica. El servicio es excepcional.'),
      (v_hotel_id, v_user_id, 5, 'Sin duda el mejor resort de Costa Rica. Las cenas en el restaurante son una experiencia gastronómica increíble. Volveremos sin duda.');
  end if;

  -- Hotel 2: Boutique
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Hotel Boutique Nayara Gardens',
    'Un santuario íntimo de lujo con bungalows privados en medio de jardines tropicales. Cada habitación cuenta con su propia terraza con jacuzzi y vistas panorámicas al Volcán Arenal. Perfecto para parejas que buscan una escapada romántica.',
    350,
    'La Fortuna, Arenal',
    5,
    'Boutique',
    array['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
    array['Bungalows Privados', 'Jacuzzi en Terraza', 'Desayuno Gourmet Incluido', 'Wi-Fi Gratuito', 'Bar de Cócteles', 'Tours Organizados', 'Servicio de Concierge'],
    array['Check-in: 2:00 PM', 'Check-out: 11:00 AM', 'Solo adultos (mayores de 16)', 'Cancelación gratuita hasta 72h antes']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, 'Nuestra luna de miel fue perfecta aquí. El bungalow con jacuzzi privado y la vista al volcán... ¡de ensueño!'),
      (v_hotel_id, v_user_id, 4, 'Hermoso lugar, muy tranquilo y romántico. El desayuno incluido es espectacular. Un poco caro pero vale cada colón.');
  end if;

  -- Hotel 3: Eco-Lodge
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Lapa Ríos Eco Lodge',
    'Enclavado en una reserva privada de 1,000 acres en la Península de Osa, este eco-lodge pionero ofrece una inmersión total en la selva tropical. Cabañas abiertas al bosque, avistamiento de fauna silvestre y compromiso genuino con la conservación.',
    195,
    'Puerto Jiménez, Osa',
    4,
    'Eco-Lodge',
    array['https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800', 'https://images.unsplash.com/photo-1615571022219-eb45cf7faa36?w=800', 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800'],
    array['Reserva Privada 1000 acres', 'Tours de Naturaleza Incluidos', 'Comidas Orgánicas', 'Avistamiento de Fauna', 'Yoga al Amanecer', 'Kayak', 'Sin TV (desconexión total)'],
    array['Check-in: 1:00 PM', 'Check-out: 11:00 AM', 'Niños bienvenidos (mayores de 6)', 'Incluye 3 comidas diarias', 'Cancelación con 7 días de anticipación']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, 'Despertar con el sonido de los monos aulladores y ver tucanes desde tu cama. Una experiencia de reconexión con la naturaleza que cambia la vida.'),
      (v_hotel_id, v_user_id, 4, 'Increíble para amantes de la naturaleza. Las caminatas guiadas son excelentes. No esperes lujo convencional, pero la experiencia compensa con creces.');
  end if;

  -- Hotel 4: Hostel
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Selina Manuel Antonio',
    'Un hostel boutique vibrante para viajeros jóvenes y nómadas digitales. Con espacios de coworking, piscina, clases de surf y una comunidad internacional. Ubicado a pasos del Parque Nacional Manuel Antonio.',
    45,
    'Manuel Antonio, Puntarenas',
    3,
    'Hostel',
    array['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
    array['Coworking Space', 'Piscina', 'Clases de Surf', 'Wi-Fi de Alta Velocidad', 'Bar & Restaurante', 'Tours Organizados', 'Cocina Compartida', 'Lavandería'],
    array['Check-in: 2:00 PM', 'Check-out: 10:00 AM', 'Mascotas no permitidas', 'Cancelación gratuita hasta 24h antes', 'Edad mínima: 18 años']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 4, 'Perfecto para mochileros y nómadas digitales. El coworking es genial y la piscina es ideal después de un día en la playa.'),
      (v_hotel_id, v_user_id, 4, 'Buena vibra, gente increíble de todo el mundo. Las habitaciones privadas son cómodas. Las clases de surf son un must.');
  end if;

  -- Hotel 5: All-Inclusive
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Planet Hollywood Costa Rica',
    'Resort todo incluido frente al mar en la deslumbrante costa del Pacífico. Disfruta de piscinas de borde infinito, múltiples restaurantes temáticos, actividades acuáticas y entretenimiento nocturno. Ideal para familias y grupos.',
    420,
    'Papagayo, Guanacaste',
    5,
    'All-Inclusive',
    array['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800'],
    array['Todo Incluido', 'Playa Privada', 'Piscina Infinity', '5 Restaurantes', 'Deportes Acuáticos', 'Kids Club', 'Shows Nocturnos', 'Spa', 'Gimnasio', 'Cancha de Tenis'],
    array['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'Niños bienvenidos', 'All-inclusive desde el check-in', 'Cancelación con 14 días de anticipación']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, '¡Vacaciones perfectas en familia! Los niños amaron el Kids Club y nosotros disfrutamos del spa. La comida es variada y deliciosa.'),
      (v_hotel_id, v_user_id, 4, 'Excelente relación calidad-precio para un todo incluido. La playa privada es hermosa. Los shows nocturnos son muy entretenidos.');
  end if;

  -- Hotel 6: Eco-Lodge 2
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Pacuare Lodge',
    'Accesible únicamente por rafting a través del río Pacuare, este lodge exclusivo es la aventura definitiva en Costa Rica. Suites sobre el dosel del bosque, tirolesas privadas y experiencias culturales con la comunidad indígena Cabécar.',
    520,
    'Valle del Pacuare, Turrialba',
    5,
    'Eco-Lodge',
    array['https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', 'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800'],
    array['Acceso por Rafting', 'Suite sobre el Dosel', 'Tirolesa Privada', 'Experiencia Cultural Cabécar', 'Comidas Gourmet Incluidas', 'Senderismo Guiado', 'Spa al Aire Libre'],
    array['Check-in: por la mañana (acceso por río)', 'Check-out: 8:00 AM', 'Incluye transporte en rafting', 'Mínimo 2 noches', 'Cancelación con 14 días de anticipación']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, 'La experiencia más extraordinaria de mi vida. Llegar en rafting, la suite sobre los árboles, la cultura Cabécar... absolutamente único en el mundo.'),
      (v_hotel_id, v_user_id, 5, 'Si buscas algo realmente diferente, este es el lugar. Cada momento es mágico. El precio es alto pero es una experiencia que no tiene comparación.');
  end if;

end
$$;
