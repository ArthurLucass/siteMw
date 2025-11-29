# Sistema de Inscrição com Mercado Pago

Sistema completo de inscrição com pagamento integrado ao Mercado Pago, desenvolvido com Next.js 14, TypeScript, TailwindCSS e Supabase.

## 🚀 Funcionalidades

### Página de Inscrição (Público)

- Formulário responsivo com validação em tempo real
- Máscara de telefone brasileira (00) 00000-0000
- Cálculo automático do valor total (base R$40 + almoço R$15)
- Integração com Mercado Pago Checkout Pro
- Redirecionamento automático para pagamento

### Painel Administrativo

- Login seguro com Supabase Auth
- Listagem completa de pedidos
- Filtros por status de pagamento
- Busca por nome ou email
- Edição de pedidos
- Exclusão com confirmação
- Atualização manual de status
- Exportação para PDF e Excel

### Webhook Mercado Pago

- Recebe notificações de pagamento automaticamente
- Atualiza status dos pedidos no banco de dados
- Tratamento de todos os status (aprovado, pendente, cancelado)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Conta no Mercado Pago com credenciais de produção/teste

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd siteMw
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

- Supabase: URL, Anon Key e Service Role Key
- Mercado Pago: Access Token e Public Key
- NEXT_PUBLIC_SITE_URL: URL do seu site em produção

4. Configure o banco de dados Supabase:

- Acesse o SQL Editor no Supabase
- Execute o script em `database/schema.sql`
- Adicione pelo menos um email admin na tabela `admins`

5. Crie um usuário admin no Supabase Auth:

- Vá em Authentication > Users
- Clique em "Add user"
- Insira o mesmo email que você adicionou na tabela `admins`

## 🚀 Executando localmente

```bash
npm run dev
```

Acesse:

- Formulário de inscrição: http://localhost:3000/inscricao
- Login admin: http://localhost:3000/login
- Painel admin: http://localhost:3000/admin (requer login)

## 📦 Deploy no Vercel

1. Instale a CLI do Vercel:

```bash
npm i -g vercel
```

2. Faça o deploy:

```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard da Vercel:

- Vá em Settings > Environment Variables
- Adicione todas as variáveis do arquivo `.env.example`
- **IMPORTANTE**: Atualize `NEXT_PUBLIC_SITE_URL` com a URL de produção

4. Configure o webhook no Mercado Pago:

- Acesse https://www.mercadopago.com.br/developers/panel/notifications/webhooks
- Adicione a URL: `https://seu-dominio.vercel.app/api/webhook/mercadopago`
- Selecione o evento: "Pagamentos"

## 🗄️ Estrutura do Banco de Dados

### Tabela: pedidos

- `id` (UUID) - Primary Key
- `nome` (TEXT) - Nome completo
- `idade` (INTEGER) - Idade
- `telefone` (TEXT) - Telefone com máscara
- `email` (TEXT) - E-mail
- `parroquia` (TEXT) - Paróquia que frequenta
- `cidade` (TEXT) - Cidade
- `tamanho` (TEXT) - Tamanho da camisa (P, M, G, GG)
- `inclui_almoco` (BOOLEAN) - Se inclui almoço
- `valor_total` (DECIMAL) - Valor total do pedido
- `status_pagamento` (TEXT) - Pendente, Pago ou Cancelado
- `mercado_pago_preference_id` (TEXT) - ID da preferência MP
- `mercado_pago_payment_id` (TEXT) - ID do pagamento MP
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

### Tabela: admins

- `id` (UUID) - Primary Key
- `email` (TEXT) - E-mail do administrador
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Middleware para proteção de rotas administrativas
- Validações no frontend e backend
- Webhooks validados pelo Mercado Pago

## 📱 Páginas

- `/` - Redireciona para /inscricao
- `/inscricao` - Formulário de inscrição público
- `/inscricao/sucesso` - Página de sucesso pós-pagamento
- `/inscricao/falha` - Página de falha no pagamento
- `/inscricao/pendente` - Página de pagamento pendente
- `/login` - Login administrativo
- `/admin` - Painel administrativo (protegido)

## 📡 API Routes

- `POST /api/pedidos/create` - Cria pedido e preferência MP
- `POST /api/webhook/mercadopago` - Recebe notificações MP
- `GET /api/webhook/mercadopago` - Verifica status do webhook

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: TailwindCSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Pagamentos**: Mercado Pago Checkout Pro
- **Exportação**: jsPDF, jsPDF-autoTable, XLSX
- **Máscaras**: react-input-mask

## 📝 Fluxo de Pagamento

1. Usuário preenche o formulário de inscrição
2. Sistema valida os dados
3. Pedido é salvo no Supabase com status "Pendente"
4. Preferência de pagamento é criada no Mercado Pago
5. Usuário é redirecionado para o checkout do Mercado Pago
6. Usuário realiza o pagamento
7. Mercado Pago envia notificação para o webhook
8. Webhook atualiza o status do pedido no Supabase
9. Admin pode visualizar o status atualizado no painel

## ⚠️ Observações Importantes

1. **Webhook em desenvolvimento local**: Use ngrok ou similar para expor localhost

   ```bash
   ngrok http 3000
   ```

   Configure a URL do ngrok no Mercado Pago

2. **Primeiro admin**: Após executar o schema.sql, insira manualmente o primeiro email admin:

   ```sql
   INSERT INTO admins (email) VALUES ('seu-email@example.com');
   ```

3. **Teste de pagamento**: Use as credenciais de teste do Mercado Pago para desenvolvimento

4. **Logs do webhook**: Verifique os logs no Vercel ou terminal para debug do webhook

## 🤝 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

## 📄 Licença

Este projeto está sob a licença MIT.
