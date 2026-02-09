#!/usr/bin/env python3
"""
Script para adicionar coluna data_compra à tabela pedidos no Supabase
Execute com: python3 add_data_compra_column.py
"""

import os
import sys
from supabase import create_client, Client

# Configurar credenciais do Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Erro: Configure as variáveis de ambiente")
    print("   NEXT_PUBLIC_SUPABASE_URL")
    print("   SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("🔄 Executando migração...")

# Script SQL para executar
migration_sql = """
-- Adicionar coluna data_compra
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Atualizar registros existentes
UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;

-- Garantir NOT NULL
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);
"""

try:
    # Executar query
    response = supabase.postgrest.execute_sql(migration_sql)
    print("✅ Migração concluída com sucesso!")
    print(f"Resultado: {response}")
except Exception as e:
    print(f"❌ Erro ao executar migração: {e}")
    sys.exit(1)

print("\n✅ Coluna data_compra foi adicionada à tabela pedidos!")
print("   - Registros antigos preenchidos com data de inscrição")
print("   - Novas inscrições usarão timestamp automático")
