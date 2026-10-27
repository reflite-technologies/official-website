CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  quote text NOT NULL CHECK (char_length(quote) BETWEEN 10 AND 600),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add a testimonial" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);