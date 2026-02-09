-- ⚠️ COPIE E COLE ISSO NO SUPABASE SQL EDITOR
-- https://supabase.com/dashboard → SQL Editor → New Query

-- Passo 1: Adicionar coluna data_compra (se não existir)
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Passo 2: Atualizar registros existentes com a data de criação
UPDATE public.pedidos 
SET data_compra = created_at 
WHERE data_compra IS NULL;

-- Passo 3: Garantir que seja NOT NULL
ALTER TABLE public.pedidos 
ALTER COLUMN data_compra SET NOT NULL;

-- Passo 4: Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra 
ON public.pedidos(data_compra DESC);

-- ✅ PRONTO! A coluna foi criada.
