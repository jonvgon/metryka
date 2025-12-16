-- Add new columns for additional sales data
ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS valor_fechamento numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS orcamento_aberto numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_perdidos integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS motivo_perdido text DEFAULT ''::text;