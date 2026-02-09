-- Adicionar coluna data de compra à tabela pedidos
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE;

-- Atualizar registros existentes com a data de created_at se data_compra for null
UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;

-- Tornar a coluna obrigatória
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra);
