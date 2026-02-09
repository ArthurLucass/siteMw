-- ⚠️ EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR

-- Passo 1: Adicionar coluna data_compra à tabela pedidos
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Passo 2: Atualizar registros existentes com a data de criação (created_at)
-- Isso garante que todos os pedidos antigos recebam a data da inscrição
UPDATE pedidos 
SET data_compra = created_at 
WHERE data_compra IS NULL;

-- Passo 3: Criar índice para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);

-- Passo 4: Verificar se a coluna foi criada corretamente
-- Execute esta query para confirmar:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'pedidos' AND column_name = 'data_compra';

-- ✅ Se tudo funcionou, você verá:
-- column_name    | data_type                    | is_nullable
-- data_compra    | timestamp with time zone     | NO
