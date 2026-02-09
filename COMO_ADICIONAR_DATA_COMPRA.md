# 🔧 Como Adicionar a Coluna data_compra no Supabase

## ⚠️ IMPORTANTE: Execute estes passos AGORA

### Passo 1: Acessar o Supabase SQL Editor

1. Abra [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu esquerdo
4. Clique em **New Query**

### Passo 2: Copiar e Executar o SQL

Copie o script abaixo e cole no editor SQL do Supabase:

```sql
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
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos' AND column_name = 'data_compra';
```

### Passo 3: Clicar em "Run"

- Clique no botão **Run** (ou Ctrl+Enter)
- Aguarde a execução

### ✅ Passo 4: Verificar o Resultado

Você deve ver uma tabela com:

```
column_name    | data_type                    | is_nullable
data_compra    | timestamp with time zone     | NO
```

### 🎯 O que acontece:

1. ✅ Adiciona a coluna `data_compra` à tabela
2. ✅ Preenche com a data de inscrição (created_at) para pedidos existentes
3. ✅ Novas inscrições usarão automaticamente o timestamp atual
4. ✅ Cria índice para melhor performance

### 📝 Próximos Passos:

Após executar com sucesso:

1. Parar o servidor: Ctrl+C
2. Executar: `npm run dev`
3. Testar o painel admin - a coluna "Data de Compra" deve aparecer!

---

**Dúvidas?**
Se receber erro na execução, verifique:

- Se você está conectado na conta correta do Supabase
- Se a tabela `pedidos` existe
- Se você tem permissão para modificar o banco de dados
