-- ⚠️ SCRIPT ALTERNATIVO - Se o anterior não funcionar

-- Desabilitar RLS temporariamente (se necessário)
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;

-- Adicionar coluna data_compra
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Atualizar registros existentes
UPDATE pedidos SET data_compra = COALESCE(data_compra, created_at) WHERE TRUE;

-- Garantir que seja NOT NULL
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;
ALTER TABLE pedidos ALTER COLUMN data_compra SET DEFAULT CURRENT_TIMESTAMP;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);

-- Reabilitar RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Verificar coluna
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position;
