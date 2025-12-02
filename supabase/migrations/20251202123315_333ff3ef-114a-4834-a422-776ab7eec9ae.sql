-- Add new columns to analyses table for commercial analysis
ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS cpl_bom boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS leads_interessados boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS comercial_bom boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS comercial_aplicou_cpip boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS link_atendimentos_ruins text DEFAULT '',
ADD COLUMN IF NOT EXISTS link_atendimentos_bons text DEFAULT '',
ADD COLUMN IF NOT EXISTS proximos_passos text DEFAULT '',
ADD COLUMN IF NOT EXISTS diagnostico_comercial text DEFAULT '',
ADD COLUMN IF NOT EXISTS explicacao_tecnica text DEFAULT '',
ADD COLUMN IF NOT EXISTS recomendacoes_ia text DEFAULT '';