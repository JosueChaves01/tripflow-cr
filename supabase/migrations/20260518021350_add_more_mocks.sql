-- ============================================================
-- Seed More Hotels and Restaurants
-- ============================================================
do $seed$
declare
  v_provider_id uuid;
  v_user_id uuid;
  v_hotel_id uuid;
  v_restaurant_id uuid;
begin
  select id into v_provider_id from public.providers limit 1;
  select id into v_user_id from public.profiles limit 1;

  if v_provider_id is null then
    return;
  end if;

  -- ============================================================
  -- MORE HOTELS
  -- ============================================================
  
  -- Hotel 7
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'El Silencio Lodge & Spa',
    'Ubicado en los bosques nubosos de Bajos del Toro, El Silencio Lodge & Spa ofrece una experiencia de ecoturismo de lujo. Es un santuario de paz inmerso en la naturaleza, con cascadas privadas y senderos místicos. Las suites están diseñadas para conectarse con el bosque sin sacrificar la comodidad de un resort de cinco estrellas.',
    450.00,
    'Bajos del Toro, Alajuela',
    5,
    'Eco-Lodge',
    array['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
    array['Spa Esmeralda', 'Yoga Deck', 'Senderos Privados', 'Restaurante Farm-to-Table', 'Chimenea en habitación'],
    array['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'No se permiten mascotas', 'Solo adultos en ciertas áreas']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, 'Un lugar mágico. La conexión con la naturaleza es increíble y el spa es de otro nivel.');
  end if;

  -- Hotel 8
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Hotel Grano de Oro',
    'Un verdadero oasis en el corazón de San José. Esta mansión tropical victoriana convertida en hotel boutique ofrece la elegancia del viejo mundo con las comodidades modernas. Conocido por su galardonado restaurante y su servicio personalizado excepcional, es el punto de partida ideal para explorar Costa Rica.',
    180.00,
    'San José Centro',
    4,
    'Boutique',
    array['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', 'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800'],
    array['Wi-Fi de Alta Velocidad', 'Restaurante Galardonado', 'Terraza Jacuzzi', 'Concierge 24/7', 'Bar Cava'],
    array['Check-in: 2:00 PM', 'Check-out: 11:00 PM', 'Política estricta de no fumar']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 4, 'Hermoso hotel clásico en la ciudad. El restaurante es espectacular, aunque las habitaciones estándar son algo pequeñas.');
  end if;

  -- Hotel 9
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'W Costa Rica - Reserva Conchal',
    'Un resort vibrante y lujoso frente a las aguas cristalinas de Playa Conchal. Combina diseño audaz con la naturaleza exuberante de Guanacaste. Ofrece un campo de golf de campeonato, un club de playa privado y múltiples piscinas que invitan al relax o a la fiesta.',
    550.00,
    'Playa Conchal, Guanacaste',
    5,
    'Resort',
    array['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800'],
    array['WET Deck (Piscina Infinita)', 'AWAY Spa', 'Campo de Golf 18 Hoyos', 'Beach Club', '5 Restaurantes'],
    array['Check-in: 4:00 PM', 'Check-out: 12:00 PM', 'Se admiten mascotas (aplica tarifa)', 'Depósito de garantía requerido']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 5, 'Lujo absoluto y diseño impresionante. La atención del staff te hace sentir como una celebridad. La playa es la mejor de la zona.');
  end if;

  -- Hotel 10
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Arenal Observatory Lodge',
    'El único hotel situado dentro del Parque Nacional Volcán Arenal. Originalmente construido como centro de investigación del Smithsonian, ofrece las vistas más cercanas y seguras del majestuoso volcán y del Lago Arenal. Rodeado de 350 hectáreas de selva tropical.',
    145.00,
    'La Fortuna, San Carlos',
    3,
    'Eco-Lodge',
    array['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800'],
    array['Vistas al Volcán', '11 km de Senderos', 'Observatorio Deck', 'Piscina y Jacuzzi', 'Torre de Observación de Aves'],
    array['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'Desayuno Incluido', 'El portón principal cierra a las 10:00 PM']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 4, 'La mejor vista del volcán Arenal, literalmente estás al pie del gigante. Las habitaciones son rústicas pero muy cómodas.');
  end if;

  -- Hotel 11
  insert into public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies)
  values (
    v_provider_id,
    'Tamarindo Diria Beach Resort',
    'El icónico resort frente al mar en el corazón de Tamarindo. Salga de su habitación directamente a las arenas blancas de la playa más famosa de Costa Rica. Mezcla vibrante vida nocturna, excelente surf y comodidades familiares en un entorno tropical.',
    210.00,
    'Tamarindo, Guanacaste',
    4,
    'Resort',
    array['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    array['Acceso Directo a la Playa', '3 Piscinas (1 Solo Adultos)', 'Casino', 'Gimnasio', 'Cancha de Tenis'],
    array['Check-in: 3:00 PM', 'Check-out: 11:00 PM', 'Pulsera de huésped requerida']
  ) returning id into v_hotel_id;

  if v_user_id is not null then
    insert into public.reviews (hotel_id, user_id, rating, comment)
    values
      (v_hotel_id, v_user_id, 4, 'Excelente ubicación, justo en la playa y cerca de todas las tiendas y restaurantes. Las piscinas son geniales.');
  end if;


  -- ============================================================
  -- MORE RESTAURANTS
  -- ============================================================

  -- Restaurant 7: Fine Dining
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Restaurante Grano de Oro',
    'Uno de los mejores restaurantes gastronómicos de San José. Fusiona la cocina tropical costarricense con técnicas clásicas europeas. Su patio interior evoca un ambiente parisino clásico, y su cava de vinos es de las más extensas del país.',
    '$$$$',
    'San José Centro',
    'Europea/Costarricense',
    'Fine Dining',
    array['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800'],
    array['Macadamia Crusted Corvina', 'Lomito al Jalapeño', 'Pie de Limón Deconstruido', 'Filet Mignon', 'Mousse de Maracuyá'],
    array['Todos los días: 7:00 AM - 10:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Clásico, elegante y la comida nunca falla. La corvina con costra de macadamia es un must absoluto.');
  end if;

  -- Restaurant 8: Fine Dining
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'La Pecora Nera',
    'Un tesoro escondido en el Caribe Sur. Un auténtico ristorante italiano dirigido por un chef originario de la Toscana, que utiliza ingredientes locales frescos, pescados del Caribe y pastas hechas a mano. Una experiencia culinaria sin menú fijo.',
    '$$$$',
    'Puerto Viejo, Limón',
    'Italiana Auténtica',
    'Fine Dining',
    array['https://images.unsplash.com/photo-1498579150354-977475b7e8b3?w=800', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800'],
    array['Ravioli de Langosta', 'Carpaccio de Pescado Fresco', 'Pasta con Trufa Negra', 'Tiramisú Clásico', 'Limoncello Casero'],
    array['Martes a Domingo: 6:00 PM - 10:00 PM', 'Lunes: Cerrado']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Increíble encontrar comida italiana de este nivel en medio de la jungla del Caribe. Déjense guiar por las sugerencias del chef.');
  end if;

  -- Restaurant 9: Casual
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Soda Tapia',
    'Una institución culinaria en San José desde 1965. Famosa por sus emparedados monumentales, ensaladas de frutas con helado y ambiente nostálgico. Es el lugar donde convergen todas las generaciones de costarricenses.',
    '$',
    'La Sabana, San José',
    'Costarricense / Cafetería',
    'Casual',
    array['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800'],
    array['Emparedado de Arreglado', 'Ensalada de Frutas con Helado', 'Tacos Ticos', 'Café Chorreado', 'Gallo Pinto Monumental'],
    array['Lunes a Sábado: 6:00 AM - 10:00 PM', 'Domingo: 7:00 AM - 9:00 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 4, 'Un clásico que no pasa de moda. Las porciones son gigantes y la ensalada de frutas es legendaria.');
  end if;

  -- Restaurant 10: Seafood
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'El Pelícano',
    'Situado justo en la arena, este restaurante familiar ofrece la pesca más fresca de Manuel Antonio. Disfrute de mariscos capturados esa misma mañana mientras escucha el sonido de las olas y observa a los monos capuchinos en los árboles cercanos.',
    '$$',
    'Manuel Antonio, Puntarenas',
    'Mariscos',
    'Seafood',
    array['https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=800', 'https://images.unsplash.com/photo-1599084990807-334543b5df5b?w=800'],
    array['Pargo Rojo Entero Frito', 'Cazuela de Mariscos', 'Ceviche de Piña y Pescado', 'Camarones al Ajillo', 'Patacones con Frijoles Molidos'],
    array['Todos los días: 11:00 AM - 9:30 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 4, 'Comer un pargo frito entero con los pies en la arena no tiene precio. Muy buen ambiente y precios razonables para la zona.');
  end if;

  -- Restaurant 11: Cafe
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Cafe Rico',
    'El lugar de desayuno por excelencia en el Caribe Sur. Escondido en un jardín tropical exuberante, ofrece café orgánico tostado en casa, panadería artesanal y opciones saludables y abundantes para empezar el día de exploración o surf.',
    '$$',
    'Puerto Viejo, Limón',
    'Desayunos y Café',
    'Café',
    array['https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800'],
    array['Huevos Rancheros Caribeños', 'Panqueques de Banano y Coco', 'Café Helado con Leche de Coco', 'Avocado Toast', 'Bowl de Frutas Locales'],
    array['Miércoles a Lunes: 7:00 AM - 1:00 PM', 'Martes: Cerrado']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Los mejores desayunos de Puerto Viejo. Hay que tener paciencia porque se llena, pero vale cada minuto de espera. El café es divino.');
  end if;

  -- Restaurant 12: Fusion
  insert into public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule)
  values (
    v_provider_id,
    'Koji''s',
    'Una institución culinaria en Santa Teresa. El chef japonés Koji infunde ingredientes tropicales frescos con maestría en sushi y cocina nipona. Un lugar frecuentado por locales, expatriados y celebridades en busca del mejor sushi de la península.',
    '$$$',
    'Santa Teresa, Puntarenas',
    'Japonesa / Fusión Tropical',
    'Fusion',
    array['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800'],
    array['Volcano Roll', 'Carpaccio de Atún Aleta Amarilla', 'Mahi Mahi en Teriyaki', 'Tempura de Vegetales Locales', 'Sake Artesanal'],
    array['Todos los días: 5:30 PM - 10:30 PM']
  ) returning id into v_restaurant_id;

  if v_user_id is not null then
    insert into public.reviews (restaurant_id, user_id, rating, comment)
    values
      (v_restaurant_id, v_user_id, 5, 'Sushi de clase mundial en una calle de tierra en Costa Rica. Increíble frescura. Asegúrense de reservar con anticipación.');
  end if;

end
$seed$;
