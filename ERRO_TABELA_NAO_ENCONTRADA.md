# 🚨 ERRO: Tabela 'pedidos' não encontrada

## ❌ Problema

```
Could not find the table 'public.pedidos' in the schema cache
```

Isso significa que as tabelas do banco de dados **não foram criadas ainda** no Supabase.

---

## ✅ SOLUÇÃO (5 minutos)

### Passo 1: Acessar o Supabase

1. Vá em: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto (gemkusxlsckhjuzyjour)

### Passo 2: Abrir SQL Editor

1. No menu lateral esquerdo, clique em **SQL Editor** (ícone de </> )
2. Clique em **+ New query**

### Passo 3: Copiar e Executar o Script

1. Abra o arquivo: `database/schema.sql`
2. **Copie TODO o conteúdo** do arquivo
3. **Cole** no SQL Editor do Supabase
4. Clique no botão **RUN** (ou pressione Ctrl+Enter)

### Passo 4: Verificar se as tabelas foram criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 2 tabelas:
   - ✅ `pedidos`
   - ✅ `admins`

### Passo 5: Criar seu primeiro admin

1. Volte ao **SQL Editor**
2. Execute este comando (substitua o email):

```sql
INSERT INTO admins (email) VALUES ('seu-email@example.com');
```

### Passo 6: Criar usuário no Supabase Auth

1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Use o **MESMO EMAIL** do passo anterior
4. Defina uma senha segura
5. Clique em **Create user**

---

## 🎯 Depois disso

Volte ao navegador e tente criar um pedido novamente em:
http://localhost:3000/inscricao

O erro deve ser resolvido! ✅

---

## 📋 Script SQL Completo

Se preferir copiar daqui:

\`\`\`sql
-- Criação da tabela admins
CREATE TABLE IF NOT EXISTS admins (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT UNIQUE NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela pedidos
CREATE TABLE IF NOT EXISTS pedidos (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
nome TEXT NOT NULL,
idade INTEGER NOT NULL,
telefone TEXT NOT NULL,
email TEXT NOT NULL,
parroquia TEXT NOT NULL,
cidade TEXT NOT NULL,
tamanho TEXT NOT NULL CHECK (tamanho IN ('P', 'M', 'G', 'GG')),
inclui_almoco BOOLEAN DEFAULT FALSE,
valor_total DECIMAL(10, 2) NOT NULL,
status_pagamento TEXT DEFAULT 'Pendente' CHECK (status_pagamento IN ('Pendente', 'Pago', 'Cancelado')),
mercado_pago_preference_id TEXT,
mercado_pago_payment_id TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_pedidos_mp_payment_id ON pedidos(mercado_pago_payment_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
language 'plpgsql';

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies de segurança (Row Level Security)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública de pedidos
CREATE POLICY "Pedidos são visíveis publicamente" ON pedidos
  FOR SELECT USING (true);

-- Policy para inserção pública de pedidos
CREATE POLICY "Qualquer um pode criar pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);

-- Policy para admins terem acesso total
CREATE POLICY "Admins têm acesso total aos pedidos" ON pedidos
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admins WHERE email = auth.email())
  );

-- Policy para admins
CREATE POLICY "Admins podem ver admins" ON admins
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admins WHERE email = auth.email())
  );
\`\`\`

---

## 🆘 Se continuar com erro

1. Verifique se está usando o projeto correto no Supabase
2. Confirme que as credenciais no `.env.local` estão corretas
3. Verifique se as tabelas aparecem no Table Editor
4. Tente recarregar o schema: Settings > API > Refresh API Schema
$$
