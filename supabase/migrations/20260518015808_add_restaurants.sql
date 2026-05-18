-- ============================================================
-- Restaurants table
-- ============================================================
create table if not exists public.restaurants (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  name text not null,
  description text,
  price_range text check (price_range in ('$', '$$', '$$$', '$$$$')),
  location text,
  cuisine text,
  category text,
  available boolean default true,
  images text[] default '{}',
  specialties text[] default '{}',
  schedule text[] default '{}',
  lat numeric,
  lng numeric,
  created_at timestamptz default now()
);

alter table public.restaurants enable row level security;

create policy "Public can view available restaurants"
  on public.restaurants for select using (available = true);

create policy "Providers manage own restaurants"
  on public.restaurants for all
  using (provider_id in (
    select id from public.providers where user_id = auth.uid()
  ));

-- ============================================================
-- Make reviews polymorphic for restaurants
-- ============================================================
alter table public.reviews
  add column if not exists restaurant_id uuid references public.restaurants(id) on delete cascade;

alter table public.reviews drop constraint if exists review_target_check;
alter table public.reviews
  add constraint review_target_check
  check (
    num_nonnulls(activity_id, hotel_id, restaurant_id) = 1
  );

-- ============================================================
-- Make bookings polymorphic for restaurants
-- ============================================================
alter table public.bookings
  add column if not exists restaurant_id uuid references public.restaurants(id);

alter table public.bookings drop constraint if exists booking_target_check;
alter table public.bookings
  add constraint booking_target_check
  check (
    num_nonnulls(activity_id, hotel_id, restaurant_id) = 1
  );

-- ============================================================
-- Seed Restaurants
-- ============================================================
do $seed$
declare
  v_provider_id uuid;
  v_user_id uuid;
  v_restaurant_id uuid;
begin
  select id into v_provider_id from public.providers limit 1;
  select id into v_user_id from public.profiles limit 1;

  if v_provider_id is null then
    return;
  end if;

  -- Restaurant 1: Fine Dining
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Silvestre Restaurant',
    'Cocina de autor costarricense que celebra los ingredientes locales con técnicas contemporáneas. El chef reinterpreta los sabores tradicionales de Costa Rica en un menú degustación que cambia según la temporada. Ubicado en una casona histórica con jardín tropical.',
    '$$$$',
    'Barrio Escalante, San José',
    'Costarricense Contemporánea',
    'Fine Dining',
    array['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'],
    array['Menú Degustación 7 Tiempos', 'Ceviche de Corvina del Pacífico', 'Risotto de Palmito', 'Postre de Cacao Turrialba', 'Maridaje con Vinos Orgánicos'],
    array['Martes a Sábado: 6:00 PM - 10:00 PM', 'Domingo Brunch: 10:00 AM - 2:00 PM', 'Lunes: Cerrado']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Una experiencia gastronómica extraordinaria! El menú degustación es una obra de arte. Cada plato cuenta una historia de Costa Rica.'),
      (v_restaurant_id, v_user_id, 5, 'El mejor restaurante de San José sin duda. El ceviche de corvina es celestial y el servicio es impecable.');
  end if;

  -- Restaurant 2: Casual
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Soda La Típica Tica',
    'Una auténtica soda costarricense donde los ticos vienen a comer como en casa. Casados generosos, gallo pinto de abuela y los mejores batidos de frutas naturales.',
    '$',
    'San Ramón, Alajuela',
    'Costarricense Tradicional',
    'Casual',
    array['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
    array['Casado con Pollo en Salsa', 'Gallo Pinto con Natilla', 'Olla de Carne', 'Arroz con Leche Casero', 'Batidos de Cas y Guanábana'],
    array['Lunes a Sábado: 6:00 AM - 7:00 PM', 'Domingo: 7:00 AM - 3:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'El casado más rico de la zona! Porciones enormes y sabor auténtico. Precios súper accesibles.'),
      (v_restaurant_id, v_user_id, 4, 'Excelente soda típica. El gallo pinto es de los mejores que he probado. Lugar sencillo pero la comida habla por sí sola.');
  end if;

  -- Restaurant 3: Seafood
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'El Navegante Marisquería',
    'Frente al océano Pacífico, este restaurante de mariscos trabaja directamente con pescadores artesanales locales. Especialistas en ceviches, pescados a la parrilla y coctelería tropical con vista al atardecer.',
    '$$$',
    'Tamarindo, Guanacaste',
    'Mariscos y Pescados',
    'Seafood',
    array['https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800'],
    array['Ceviche Mixto del Pacífico', 'Pescado del Día a la Parrilla', 'Langosta en Mantequilla de Ajo', 'Arroz con Mariscos', 'Cóctel de Camarones'],
    array['Todos los días: 11:00 AM - 10:00 PM', 'Happy Hour: 4:00 PM - 6:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'El pescado más fresco que he comido. La vista al atardecer es espectacular. El ceviche mixto es una bomba de sabor.'),
      (v_restaurant_id, v_user_id, 4, 'Excelente marisquería con ubicación privilegiada. La langosta estaba perfecta.');
  end if;

  -- Restaurant 4: Café
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Café Kópete',
    'Cafetería de especialidad que trabaja directamente con productores de café de Tarrazú y el Valle Central. Tostión artesanal in-house, repostería francesa con twist tropical y un espacio instagrameable rodeado de plantas.',
    '$$',
    'Escazú, San José',
    'Café de Especialidad',
    'Café',
    array['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'],
    array['Pour Over de Tarrazú', 'Cold Brew con Leche de Coco', 'French Toast de Banano', 'Bowl de Açaí Tropical', 'Croissant de Guayaba y Queso'],
    array['Lunes a Viernes: 7:00 AM - 6:00 PM', 'Sábado y Domingo: 8:00 AM - 5:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'El mejor café de Costa Rica! El Pour Over de Tarrazú es una revelación. Espacio perfecto para trabajar con laptop.'),
      (v_restaurant_id, v_user_id, 4, 'Café exquisito y repostería increíble. El croissant de guayaba es adictivo.');
  end if;

  -- Restaurant 5: Fusion
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Al Mercat Fusion Kitchen',
    'Restaurante de fusión asiático-latinoamericana que combina lo mejor de ambos mundos culinarios. Ramen con chicharrón, tacos de atún con wasabi, y postres que mezclan matcha con ingredientes tropicales.',
    '$$$',
    'Santa Teresa, Puntarenas',
    'Fusión Asiático-Latina',
    'Fusion',
    array['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', 'https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800'],
    array['Ramen de Chicharrón Crujiente', 'Tacos de Atún con Wasabi y Mango', 'Gyozas de Plátano Maduro', 'Bowl de Poke Tropical', 'Helado de Matcha y Maracuyá'],
    array['Miércoles a Lunes: 12:00 PM - 10:00 PM', 'Martes: Cerrado']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Fusión perfecta! El ramen de chicharrón es una locura deliciosa.'),
      (v_restaurant_id, v_user_id, 4, 'Propuesta muy original y bien ejecutada. Los tacos de atún con wasabi son espectaculares.');
  end if;

  -- Restaurant 6: Vegetarian
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Tierra Verde Kitchen',
    'Restaurante 100% plant-based que demuestra que la cocina vegana puede ser extraordinaria. Ingredientes orgánicos de fincas locales, menú creativo que cambia semanalmente.',
    '$$',
    'Montezuma, Puntarenas',
    'Vegana y Vegetariana',
    'Vegetarian',
    array['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'],
    array['Buddha Bowl Tropical', 'Burger de Frijoles Negros y Plátano', 'Ceviche de Palmito y Coco', 'Smoothie de Espirulina y Piña', 'Brownie de Camote y Cacao'],
    array['Todos los días: 8:00 AM - 9:00 PM', 'Brunch Domingo: 8:00 AM - 1:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Incluso no siendo vegano, esta comida me voló la cabeza. El Buddha Bowl es una explosión de sabores y texturas.'),
      (v_restaurant_id, v_user_id, 5, 'Prueba viviente de que la comida plant-based puede ser deliciosa.');
  end if;

end
$seed$;
