# 📌 RESUMO EXECUTIVO - Adicionar data_compra

## O Problema:

❌ A coluna `data_compra` não foi encontrada na tabela `pedidos`

## A Solução:

Executar o script SQL no Supabase para criar a coluna

---

## 3 FORMAS DE RESOLVER:

### ✅ FORMA 1: Supabase Dashboard (RECOMENDADA - Mais Fácil)

**Tempo**: 2 minutos

```
1. Abrir https://supabase.com/dashboard
2. Ir para SQL Editor → New Query
3. Copiar e colar o script
4. Clicar RUN
```

**Script**:

```sql
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW();
UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);
```

---

### ✅ FORMA 2: Terminal/Command Line

**Tempo**: 5 minutos

Se você tem `psql` instalado:

```bash
psql postgresql://usuario:senha@db.XXXXX.supabase.co:5432/postgres

-- Cole o script aqui
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW();
UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);
```

---

### ✅ FORMA 3: Script Python (Se tiver Python)

**Tempo**: 3 minutos

```bash
# 1. Instalar dependência
pip install supabase-py

# 2. Definir variáveis de ambiente
export NEXT_PUBLIC_SUPABASE_URL="sua_url"
export SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role"

# 3. Executar script
python3 add_data_compra_column.py
```

---

## ✅ VERIFICAR SE FUNCIONOU:

Execute esta query no Supabase:

```sql
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_name = 'pedidos' AND column_name = 'data_compra';
```

Você deve ver:

```
column_name  | data_type                    | is_nullable
data_compra  | timestamp with time zone     | false
```

---

## 🚀 PRÓXIMOS PASSOS:

1. ✅ Executar um dos scripts acima
2. ✅ Verificar se funcionou
3. ✅ Voltar no terminal
4. ✅ Parar o servidor (Ctrl+C)
5. ✅ Executar: `npm run dev`
6. ✅ Acessar http://localhost:3000/admin
7. ✅ Confirmar que coluna "Data de Compra" aparece

---

## 📁 Arquivos de Referência:

- `INSTRUCOES_DATA_COMPRA.md` - Instruções detalhadas
- `database/EXECUTE_NO_SUPABASE.sql` - Script principal
- `database/EXECUTE_NO_SUPABASE_ALTERNATIVO.sql` - Script alternativo
- `add_data_compra_column.py` - Script Python

---

## 💡 DICA PRO:

Se você tem acesso ao banco de dados diretamente, pode chamar via código Node.js:

```javascript
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(url, key);

await supabase.rpc("exec_sql", {
  query: `
    ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;
  `,
});
```

---

**Qual você prefere?** 👇

- [ ] Forma 1 (Supabase Dashboard) - Mais fácil
- [ ] Forma 2 (Terminal) - Se tem psql
- [ ] Forma 3 (Python) - Se tem Python

Escolha um e me diga quando terminar! ✅
