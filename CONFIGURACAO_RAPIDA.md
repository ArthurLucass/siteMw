# 🚀 Guia de Configuração Rápida

## ⚠️ ERRO ATUAL: "supabaseUrl is required"

Este erro ocorre porque as variáveis de ambiente não estão configuradas. Siga os passos abaixo:

---

## 📝 Passo 1: Configurar Supabase

### 1.1 - Criar projeto no Supabase
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Anote a URL e as chaves do projeto

### 1.2 - Obter credenciais
No dashboard do Supabase:
1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 - Criar tabelas
1. Vá em **SQL Editor**
2. Cole e execute o conteúdo do arquivo `database/schema.sql`
3. Verifique se as tabelas `pedidos` e `admins` foram criadas

### 1.4 - Criar primeiro admin
Execute no SQL Editor:
```sql
INSERT INTO admins (email) VALUES ('seu-email@example.com');
```

### 1.5 - Criar usuário no Auth
1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Use o MESMO email do passo anterior
4. Defina uma senha

---

## 💳 Passo 2: Configurar Mercado Pago

### 2.1 - Criar conta de desenvolvedor
1. Acesse https://www.mercadopago.com.br/developers
2. Faça login ou crie uma conta

### 2.2 - Obter credenciais de TESTE
1. Vá em **Suas integrações** > **Credenciais**
2. Selecione **Credenciais de teste**
3. Copie:
   - **Access Token** → `MERCADOPAGO_ACCESS_TOKEN`
   - **Public Key** → `MERCADOPAGO_PUBLIC_KEY`

---

## 🔧 Passo 3: Configurar variáveis de ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
# Variáveis de ambiente - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Variáveis de ambiente - Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abcdefg...
MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-ghi789...

# URL do site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **IMPORTANTE**: Substitua TODOS os valores de exemplo pelas suas credenciais reais!

---

## 🔄 Passo 4: Reiniciar o servidor

Após configurar o `.env.local`:

```bash
# Pare o servidor (Ctrl+C)
# Reinicie:
npm run dev
```

---

## ✅ Passo 5: Testar

1. Acesse http://localhost:3000/inscricao
2. Preencha o formulário
3. O pedido deve ser criado com sucesso
4. Você será redirecionado para o Mercado Pago

---

## 🐛 Solução de Problemas

### Erro: "supabaseUrl is required"
- ✅ Verifique se o arquivo `.env.local` existe
- ✅ Verifique se as variáveis começam com `NEXT_PUBLIC_` quando necessário
- ✅ Reinicie o servidor após editar o `.env.local`

### Erro ao criar pedido
- ✅ Verifique se as tabelas foram criadas no Supabase
- ✅ Verifique se as credenciais do Supabase estão corretas
- ✅ Verifique os logs do terminal

### Erro no Mercado Pago
- ✅ Use credenciais de TESTE para desenvolvimento
- ✅ Verifique se o Access Token está correto
- ✅ Verifique os logs do terminal

---

## 📚 Documentação Completa

- [README.md](./README.md) - Guia completo do projeto
- [SETUP_ADMIN.md](./SETUP_ADMIN.md) - Como criar administradores
- [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) - Configurar webhook MP
- [database/schema.sql](./database/schema.sql) - Script do banco de dados

---

## 🆘 Precisa de Ajuda?

Se continuar com problemas:
1. Verifique os logs no terminal
2. Verifique o console do navegador (F12)
3. Certifique-se que todas as credenciais estão corretas
