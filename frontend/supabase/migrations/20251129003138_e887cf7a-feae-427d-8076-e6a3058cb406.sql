-- Tabela de clínicas
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de análises
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leads_marketing INTEGER NOT NULL DEFAULT 0,
  leads_crm INTEGER NOT NULL DEFAULT 0,
  agendamentos INTEGER NOT NULL DEFAULT 0,
  comparecimentos INTEGER NOT NULL DEFAULT 0,
  vendas INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  observations TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, start_date, end_date)
);

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (sem autenticação por enquanto)
CREATE POLICY "Public read clinics" ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Public insert clinics" ON public.clinics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete clinics" ON public.clinics FOR DELETE USING (true);

CREATE POLICY "Public read analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Public insert analyses" ON public.analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update analyses" ON public.analyses FOR UPDATE USING (true);
CREATE POLICY "Public delete analyses" ON public.analyses FOR DELETE USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();