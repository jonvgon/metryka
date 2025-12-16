-- Create gestores table
CREATE TABLE public.gestores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gestores ENABLE ROW LEVEL SECURITY;

-- RLS policies for gestores
CREATE POLICY "Public read gestores" ON public.gestores FOR SELECT USING (true);
CREATE POLICY "Public insert gestores" ON public.gestores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete gestores" ON public.gestores FOR DELETE USING (true);

-- Add gestor_id to clinics table
ALTER TABLE public.clinics ADD COLUMN gestor_id UUID REFERENCES public.gestores(id) ON DELETE CASCADE;

-- Insert João as first gestor
INSERT INTO public.gestores (name) VALUES ('João');

-- Update all existing clinics to belong to João
UPDATE public.clinics SET gestor_id = (SELECT id FROM public.gestores WHERE name = 'João' LIMIT 1);