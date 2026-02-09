# 🚀 ADIÇÃO DA COLUNA data_compra - INSTRUÇÕES FINAIS

## ⚡ QUICK START (Recomendado)

### Opção 1: Executar diretamente no Supabase (Mais Fácil) ✅ RECOMENDADO

1. **Abra o Supabase Dashboard**
   - Acesse: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Vá para SQL Editor**
   - Clique em "SQL Editor" (menu esquerdo)
   - Clique em "New Query"

3. **Copie este script**:

```sql
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW();
UPDATE pedidos SET data_compra = created_at WHERE data_compra IS NULL;
ALTER TABLE pedidos ALTER COLUMN data_compra SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pedidos_data_compra ON pedidos(data_compra DESC);
```

4. **Clique em "RUN"**
   - Espere a execução

5. **Verifique com**:

```sql
SELECT * FROM pedidos LIMIT 1;
```

Você deve ver a coluna `data_compra` preenchida!

---

## O que o script faz:

✅ **Linha 1**: Adiciona coluna `data_compra` (se não existe)
✅ **Linha 2**: Preenche com `created_at` para inscrições antigas
✅ **Linha 3**: Garante que seja NOT NULL
✅ **Linha 4**: Cria índice para performance

---

## 🔍 Se der erro:

### Erro: "column already exists"

- A coluna já está lá, tudo certo! ✅

### Erro: "permission denied"

- Use a chave `SUPABASE_SERVICE_ROLE_KEY` em vez da anon key
- O service role key tem mais permissões

### Erro: "table doesn't exist"

```sql
-- Verifique se a tabela existe:
SELECT * FROM information_schema.tables WHERE table_name = 'pedidos';
```

---

## 📱 Depois de executar:

1. Volte ao VS Code
2. Pare o servidor se estiver rodando: `Ctrl+C`
3. Execute: `npm run dev`
4. Acesse http://localhost:3000/admin
5. Você verá a coluna "Data de Compra" na tabela!

---

## 📋 Checklist:

- [ ] Abri Supabase Dashboard
- [ ] Fui para SQL Editor
- [ ] Copiei o script
- [ ] Executei com RUN
- [ ] Verifiquei com SELECT
- [ ] Voltei ao VS Code
- [ ] Executei npm run dev
- [ ] Testei o painel admin

---

## 🆘 Suporte

Se mesmo assim não funcionar:

1. **Verifique se as credenciais estão corretas em `.env.local`**

```
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

2. **Execute este comando para listar todas as colunas da tabela**:

```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'pedidos' ORDER BY ordinal_position;
```

3. **Se `data_compra` não aparecer na lista, copie e execute**:

```sql
ALTER TABLE pedidos ADD COLUMN data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;
UPDATE pedidos SET data_compra = created_at;
CREATE INDEX idx_pedidos_data_compra ON pedidos(data_compra DESC);
```

---

**Status**: Pronto para usar! 🎉
