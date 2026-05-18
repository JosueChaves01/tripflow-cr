-- Seed: More Cars, Hotels, and Restaurants
-- Created: 2026-05-18

-- ============================================================
-- 1. SEED 20 CARS
-- ============================================================
INSERT INTO public.cars (provider_id, make, model, year, seats, transmission, price_per_day, location, description, images, available) VALUES
('c3000000-0000-0000-0000-000000000001', 'Toyota', 'Prado', 2022, 7, 'Automatic', 95.00, 'Liberia, Guanacaste', 'SUV 4x4 de lujo, perfecto para familias numerosas que exploran las playas y terrenos difíciles de Guanacaste.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true),

('c3000000-0000-0000-0000-000000000002', 'Suzuki', 'Jimny', 2023, 4, 'Manual', 55.00, 'Monteverde, Puntarenas', 'El todo terreno compacto favorito de Costa Rica. Ideal para parejas de aventura transitando los caminos de Monteverde.', ARRAY['https://images.unsplash.com/photo-1596738141905-51e94b519d69']::text[], true),

('c3000000-0000-0000-0000-000000000003', 'Mitsubishi', 'Montero Sport', 2021, 7, 'Automatic', 85.00, 'Uvita, Puntarenas', 'Poderoso SUV 4x4 con tracción total inteligente. Excelente espacio y confort para paseos en Bahía Ballena.', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70']::text[], true),

('c3000000-0000-0000-0000-000000000004', 'Nissan', 'Frontier', 2022, 5, 'Automatic', 75.00, 'Tamarindo, Guanacaste', 'Pick-up 4x4 de alto rendimiento con cajón espacioso para tablas de surf y equipaje de aventura.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true),

('c3000000-0000-0000-0000-000000000005', 'Toyota', 'Hilux', 2023, 5, 'Manual', 80.00, 'Puerto Viejo, Limón', 'La leyenda de la durabilidad. Un pick-up 4x4 rudo y cómodo para cruzar caminos de lastre en el Caribe Sur.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true),

('c3000000-0000-0000-0000-000000000001', 'Hyundai', 'Tucson', 2022, 5, 'Automatic', 50.00, 'Aeropuerto SJO, Alajuela', 'SUV moderno de tracción simple. Cómodo, espacioso y sumamente económico para rutas nacionales principales.', ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7']::text[], true),

('c3000000-0000-0000-0000-000000000002', 'Kia', 'Sportage', 2021, 5, 'Automatic', 48.00, 'Jacó, Puntarenas', 'Excelente SUV urbano para viajes cortos y traslados cómodos hacia Jacó y Manuel Antonio.', ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7']::text[], true),

('c3000000-0000-0000-0000-000000000003', 'Suzuki', 'Vitara', 2022, 5, 'Automatic', 58.00, 'Quepos, Puntarenas', 'SUV compacto con gran altura y excelente rendimiento de gasolina. Perfecto para ir a las playas locales.', ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7']::text[], true),

('c3000000-0000-0000-0000-000000000004', 'Toyota', 'Yaris Sedan', 2021, 5, 'Automatic', 35.00, 'San José, Centro', 'Auto sedán clásico sumamente confiable y de bajo consumo. Ideal para ejecutivos o traslados en ciudad.', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341']::text[], true),

('c3000000-0000-0000-0000-000000000005', 'Hyundai', 'Accent', 2020, 5, 'Manual', 32.00, 'Aeropuerto LIR, Liberia', 'Sedán económico para presupuestos moderados. Excelente maletero y aire acondicionado potente.', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341']::text[], true),

('c3000000-0000-0000-0000-000000000001', 'Nissan', 'Versa', 2022, 5, 'Automatic', 38.00, 'Manuel Antonio, Puntarenas', 'Compacto espacioso y tecnológico. Conducción suave para visitar reservas y parques nacionales.', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341']::text[], true),

('c3000000-0000-0000-0000-000000000002', 'Toyota', 'Rush', 2022, 7, 'Automatic', 68.00, 'La Fortuna, Arenal', 'SUV familiar de 3 filas de asientos. Espacio y altura perfectos para explorar las faldas del Volcán Arenal.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true),

('c3000000-0000-0000-0000-000000000003', 'Hyundai', 'Santa Fe', 2023, 7, 'Automatic', 88.00, 'Flamingo, Guanacaste', 'Premium SUV de gran tamaño y seguridad superior. Viaja con total estilo por la costa de Guanacaste.', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70']::text[], true),

('c3000000-0000-0000-0000-000000000004', 'Geely', 'Coolray', 2023, 5, 'Automatic', 45.00, 'Escazú, San José', 'SUV compacto deportivo con excelente tecnología y confort para traslados ejecutivos de lujo.', ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7']::text[], true),

('c3000000-0000-0000-0000-000000000005', 'BYD', 'Yuan Plus', 2023, 5, 'Automatic', 70.00, 'San José, Sabana', '100% Eléctrico. Únete al ecoturismo reduciendo tu huella de carbono con gran autonomía y potencia instantánea.', ARRAY['https://images.unsplash.com/photo-1563720223185-11003d516935']::text[], true),

('c3000000-0000-0000-0000-000000000001', 'Tesla', 'Model Y', 2023, 5, 'Automatic', 120.00, 'Santa Ana, San José', 'Eléctrico de lujo con tracción total AWD y autopilot. Máximo estilo y confort sustentable en el país.', ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a']::text[], true),

('c3000000-0000-0000-0000-000000000002', 'Ford', 'Ranger Wildtrak', 2022, 5, 'Automatic', 85.00, 'Monteverde, Bosque Nuboso', 'Pick-up 4x4 de alta gama. Cabina de lujo y suspensión preparada para los caminos difíciles de montaña.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true),

('c3000000-0000-0000-0000-000000000003', 'Chevrolet', 'Tracker', 2022, 5, 'Automatic', 42.00, 'Dominical, Puntarenas', 'SUV compacto ágil e inteligente con excelente conectividad para surfistas y mochileros en el Pacífico Sur.', ARRAY['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7']::text[], true),

('c3000000-0000-0000-0000-000000000004', 'Suzuki', 'Swift', 2022, 5, 'Manual', 28.00, 'Jacó Centro', 'Económico y divertido hatchback. Ideal para parejas jóvenes que buscan movilidad urbana simple y ágil.', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341']::text[], true),

('c3000000-0000-0000-0000-000000000005', 'Toyota', 'Fortuner', 2023, 7, 'Automatic', 110.00, 'Nosara, Guanacaste', 'El rey del todoterreno familiar. 4x4 puro con motor turbo diésel potente para llegar a cualquier rincón de Costa Rica.', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf']::text[], true);


-- ============================================================
-- 2. SEED 6 HOTELS
-- ============================================================
INSERT INTO public.hotels (provider_id, name, description, price_per_night, location, stars, category, images, amenities, policies) VALUES
('c3000000-0000-0000-0000-000000000001', 'El Silencio Lodge & Spa', 'Espectacular eco-luxury retreat rodeado por el nuboso bosque de Bajos del Toro. Un santuario de bienestar, cascadas y alta gastronomía orgánica.', 450.00, 'Bajos del Toro, Alajuela', 5, 'nature', ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945']::text[], ARRAY['Private Deck with Hot Tub', 'Eco-Spa', 'Organic Restaurant', 'Guided Waterfall Trails', 'Free Wifi'], ARRAY['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'No smoking', 'Reservations required for SPA']),

('c3000000-0000-0000-0000-000000000002', 'Hotel Belmar', 'Pionero del ecoturismo premium en Monteverde. Impresionantes vistas al golfo, cervecería artesanal propia y una finca orgánica que abastece su restaurante.', 280.00, 'Monteverde, Puntarenas', 4, 'nature', ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945']::text[], ARRAY['Brewery & Juice Bar', 'Farm-to-Table Restaurant', 'Cloud Forest Jacuzzi', 'Yoga Shala', 'Private Reserve Access'], ARRAY['Check-in: 2:00 PM', 'Check-out: 11:00 AM', 'Pets allowed upon request', 'Environmentally conscious behavior enforced']),

('c3000000-0000-0000-0000-000000000003', 'Nayara Springs Resort', 'Villas ultra exclusivas solo para adultos inmersas en la selva tropical del Volcán Arenal. Cada villa cuenta con su piscina privada de aguas termales naturales.', 750.00, 'La Fortuna, Alajuela', 5, 'luxury', ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6']::text[], ARRAY['Private Natural Hot Springs Pool', 'Award-Winning Spa', 'Boutique Bars & Restaurants', 'Sloth Sanctuary Walk', 'Free Laundry Service'], ARRAY['Check-in: 3:00 PM', 'Check-out: 12:00 PM', 'Adults only (18+)', 'Smart casual dress code for dinner']),

('c3000000-0000-0000-0000-000000000004', 'Arenas del Mar Beachfront Resort', 'Ubicado en un acantilado entre la selva y las arenas blancas de Manuel Antonio. Fauna abundante directo en los balcones y acceso privado a dos playas idílicas.', 380.00, 'Manuel Antonio, Quepos', 5, 'beach', ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6']::text[], ARRAY['Direct Beach Access', 'Ocean-view Pools', 'Wildlife Watching Tours', 'Gluten-Free certified kitchen', 'Spa & Wellness center'], ARRAY['Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Family friendly', 'Do not feed the wild monkeys']),

('c3000000-0000-0000-0000-000000000005', 'Lapa Rios Lodge', 'Eco-lodge de clase mundial ubicado en una reserva natural privada en la Península de Osa. Lujo rústico sustentable frente al mar y la selva más biodiversa.', 550.00, 'Península de Osa, Puntarenas', 5, 'nature', ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945']::text[], ARRAY['Ocean & Jungle Views Balconies', 'Expert Naturalist Guides', 'Saltwater Outdoor Pool', 'Eco-Education Center', 'All-Inclusive Organic Dining'], ARRAY['Check-in: 2:00 PM', 'Check-out: 10:00 AM', 'Eco-focused guidelines', 'Minimum stay 2 nights recommended']),

('c3000000-0000-0000-0000-000000000001', 'Pacuare Lodge', 'Una aventura sin igual enclavada a orillas del majestuoso río Pacuare. Acceso en balsa de rafting, cabinas iluminadas con velas y lujo eco-sustentable de primer nivel.', 620.00, 'Río Pacuare, Limón', 5, 'adventure', ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6']::text[], ARRAY['River Rafting Access', 'Jungle Canopy Canopy Tour', 'Infinity Pool', 'Candlelit Suites', 'Organic Dining Experience'], ARRAY['Check-in via river schedule', 'Check-out: 9:00 AM', 'Eco-sustainable guidelines', 'Adventure physical requirement required']);


-- ============================================================
-- 3. SEED 6 RESTAURANTS
-- ============================================================
INSERT INTO public.restaurants (provider_id, name, description, price_range, location, cuisine, category, images, specialties, schedule) VALUES
('c3000000-0000-0000-0000-000000000001', 'Soda La Parada', 'La parada tradicional favorita en el centro de La Fortuna. Platillos típicos costarricenses (casados, gallo pinto) abundantes, sabrosos y a excelente precio.', '$', 'La Fortuna Centro, Alajuela', 'Traditional Costa Rican', 'food', ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5']::text[], ARRAY['Casado con Carne en Salsa', 'Chifrijo Crujiente', 'Batidos Naturales Frescos'], ARRAY['Open Daily: 6:00 AM - 10:00 PM']::text[]),

('c3000000-0000-0000-0000-000000000002', 'Sapo Dorado Restaurant', 'Cocina fusión orgánica en Monteverde. Vegetales frescos cultivados en su propio huerto y excelentes opciones vegetarianas y libres de gluten en un ambiente acogedor.', '$$', 'Monteverde, Puntarenas', 'Organic Fusion', 'food', ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4']::text[], ARRAY['Organic Pumpkin Soup', 'Quinoa Jampalaya', 'Monteverde Craft Beer Pairing'], ARRAY['Open Tuesday-Sunday: 12:00 PM - 9:30 PM']::text[]),

('c3000000-0000-0000-0000-000000000003', 'Emilios Café', 'Cafetería y restaurante gourmet con una de las mejores vistas panorámicas de Manuel Antonio. Exquisita repostería artesanal, café de especialidad y mariscos frescos.', '$$', 'Manuel Antonio, Quepos', 'Seafood & Cafe', 'food', ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5']::text[], ARRAY['Specialty Cold Brew Coffee', 'Passionfruit Cheesecake', 'Sesame-crusted Seared Tuna'], ARRAY['Open Daily: 7:00 AM - 10:00 PM']::text[]),

('c3000000-0000-0000-0000-000000000004', 'El Lagarto Jacó', 'Restaurante especializado en parrilladas al carbón natural. Cortes de carne nacionales e internacionales premium cocinados a la perfección con leña local.', '$$$', 'Jacó Playa, Puntarenas', 'Steakhouse & BBQ', 'food', ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4']::text[], ARRAY['Wood-fired Ribeye Steak', 'Grilled Ocean Lobster', 'Smoked BBQ Ribs'], ARRAY['Open Daily: 2:00 PM - 11:00 PM']::text[]),

('c3000000-0000-0000-0000-000000000005', 'Organico Puerto Viejo', 'El rincón saludable del Caribe Sur. Deliciosa comida vegetariana, vegana y libre de alérgenos elaborada con ingredientes del huerto y sazón afro-caribeño.', '$$', 'Puerto Viejo, Limón', 'Vegan & Caribbean Wellness', 'food', ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5']::text[], ARRAY['Jerk Tofu Bowl', 'Caribbean Coconut Curry', 'Raw Vegan Cacao Tart'], ARRAY['Open Daily: 8:00 AM - 9:00 PM']::text[]),

('c3000000-0000-0000-0000-000000000001', 'La Esquina de Avellanas', 'Club de playa rústico ubicado bajo la sombra de las palmeras en Playa Avellanas. Pizzas gourmet a la leña, cócteles tropicales creativos y mariscos frescos.', '$$', 'Playa Avellanas, Guanacaste', 'Beach Pizza & Seafood', 'food', ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4']::text[], ARRAY['Wood-fired Avellanas Pizza', 'Jumbo Shrimp Skewers', 'Lola Mojito (Specialty Cocktail)'], ARRAY['Open Wednesday-Monday: 11:00 AM - 8:30 PM']::text[]);
