-- ⚠️ ATUALIZE O SCRIPT NO SUPABASE SQL EDITOR
-- Execute este script se a coluna ainda não existir

-- 1. Adicionar coluna data_compra com DEFAULT NOW()
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pedidos' AND column_name = 'data_compra'
  ) THEN
    ALTER TABLE public.pedidos 
    ADD COLUMN data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    
    -- Preencher registros existentes
    UPDATE public.pedidos 
    SET data_compra = created_at 
    WHERE data_compra IS NULL;
    
    -- Garantir NOT NULL
    ALTER TABLE public.pedidos 
    ALTER COLUMN data_compra SET NOT NULL;
    
    -- Criar índice
    CREATE INDEX idx_pedidos_data_compra ON public.pedidos(data_compra DESC);
  END IF;
END $$;

-- Se a coluna já existe mas tem NULL, preencher com created_at
UPDATE public.pedidos SET data_compra = created_at WHERE data_compra IS NULL;

-- Verificar resultado
SELECT id, nome, created_at, data_compra FROM public.pedidos LIMIT 5;
