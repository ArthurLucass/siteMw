# Configuração do Webhook Mercado Pago

## Desenvolvimento Local (com ngrok)

### 1. Instalar ngrok

```bash
# Windows
choco install ngrok

# macOS
brew install ngrok

# Ou baixe de: https://ngrok.com/download
```

### 2. Expor localhost

```bash
ngrok http 3000
```

Você verá algo como:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 3. Configurar webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. Clique em **Criar webhook**
3. Configure:
   - **Nome**: Webhook Inscrições
   - **URL**: `https://abc123.ngrok.io/api/webhook/mercadopago`
   - **Eventos**: Selecione "Pagamentos"
4. Clique em **Salvar**

## Produção (Vercel)

### 1. Deploy no Vercel

```bash
vercel --prod
```

### 2. Obter URL de produção

Após o deploy, você terá algo como:

```
https://seu-projeto.vercel.app
```

### 3. Configurar webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. Clique em **Criar webhook**
3. Configure:
   - **Nome**: Webhook Inscrições Produção
   - **URL**: `https://seu-projeto.vercel.app/api/webhook/mercadopago`
   - **Eventos**: Selecione "Pagamentos"
4. Clique em **Salvar**

## Testar Webhook

### Método 1: Via Mercado Pago Dashboard

1. No painel do webhook, clique em **Simular notificação**
2. Envie uma notificação de teste
3. Verifique os logs

### Método 2: Via cURL

```bash
curl -X POST https://seu-dominio/api/webhook/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  }'
```

## Verificar Logs

### Desenvolvimento

Veja os logs no terminal onde o Next.js está rodando.

### Produção (Vercel)

1. Acesse o dashboard da Vercel
2. Clique no seu projeto
3. Vá em **Logs**
4. Filtre por `/api/webhook/mercadopago`

## Solução de Problemas

### Webhook não está recebendo notificações

1. **Verifique a URL**: Certifique-se que está acessível publicamente
2. **Teste manualmente**: Use cURL para testar
3. **Verifique logs**: Procure por erros nos logs
4. **Valide credenciais**: Confirme que `MERCADOPAGO_ACCESS_TOKEN` está correto

### Status não está atualizando

1. **Verifique o pedido**: Certifique-se que o pedido existe no banco
2. **Valide email**: O webhook tenta encontrar por email se não achar por preference_id
3. **Logs do webhook**: Verifique se há erros ao buscar ou atualizar no Supabase

## Eventos do Mercado Pago

Status possíveis:

- `approved` → Atualiza para "Pago"
- `pending` / `in_process` → Mantém "Pendente"
- `rejected` / `cancelled` → Atualiza para "Cancelado"
