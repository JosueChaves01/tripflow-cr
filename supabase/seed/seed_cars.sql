-- Seed: sample cars (inserts only if providers exist)
-- Created: 2026-05-18

-- Insert a few sample cars tied to the first available provider (if any exist in your DB)
INSERT INTO public.cars (provider_id, make, model, year, seats, transmission, price_per_day, location, description, images)
SELECT id, 'Toyota', 'Corolla', 2020, 5, 'Automatic', 45.00, 'San Juan', 'Toyota Corolla automático de 5 puestos, ideal para traslados cómodos y eficientes en la ciudad y viajes de carretera en Costa Rica.', ARRAY['https://images.unsplash.com/photo-1558980664-10a7f3a6f02d']::text[]
FROM public.providers
LIMIT 1;

INSERT INTO public.cars (provider_id, make, model, year, seats, transmission, price_per_day, location, description, images)
SELECT id, 'Hyundai', 'Elantra', 2019, 5, 'Automatic', 40.00, 'San Juan', 'Hyundai Elantra cómodo y espacioso, con excelente economía de combustible y transmisión automática suave.', ARRAY['https://images.unsplash.com/photo-1542367567-3ef6d3c9c3c8']::text[]
FROM public.providers
LIMIT 1;

INSERT INTO public.cars (provider_id, make, model, year, seats, transmission, price_per_day, location, description, images)
SELECT id, 'Toyota', 'RAV4', 2022, 5, 'Automatic', 65.00, 'San Juan', 'Toyota RAV4 4x4 robusto, ideal para explorar caminos difíciles en Monteverde, Arenal o las playas de Uvita con total seguridad y confort.', ARRAY['https://images.unsplash.com/photo-1541447275431-e9a009fa0874']::text[]
FROM public.providers
LIMIT 1;

-- Note: If your project has no providers yet, update the provider_id values or seed profiles/providers first.
