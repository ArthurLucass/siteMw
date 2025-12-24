# Configurar Variáveis de Ambiente no Vercel

Para o deploy funcionar corretamente, você precisa configurar as variáveis de ambiente no Vercel.

## 📋 Passo a Passo:

### 1. Acesse o Dashboard do Vercel

- Vá em: https://vercel.com/dashboard
- Selecione o projeto **siteMw**

### 2. Vá em Settings > Environment Variables

- No menu lateral, clique em **Settings**
- Clique em **Environment Variables**

### 3. Adicione as seguintes variáveis:

#### **Supabase (obrigatório)**

```
NEXT_PUBLIC_SUPABASE_URL
Valor: https://gemkusxlsckhjuzyjour.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbWt1c3hsc2NraGp1enlqb3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTgzMjgsImV4cCI6MjA3ODE5NDMyOH0._i997WGtsZ8fJwf-wD0AyKRaZfOPZNgF5EQ7Y_11vnY
```

```
SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbWt1c3hsc2NraGp1enlqb3VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYxODMyOCwiZXhwIjoyMDc4MTk0MzI4fQ.5TUF0VxEEDAeDaCunU_qP-SaWh9q1-YUwW3xPrpZFKs
```

#### **Mercado Pago (obrigatório)**

```
MERCADOPAGO_ACCESS_TOKEN
Valor: APP_USR-6605481718654137-101215-4edbe221bf9bf0b0e957441c14250ea3-2919985909
```

```
MERCADOPAGO_PUBLIC_KEY
Valor: APP_USR-496cdddc-465c-4d40-9b81-e55a4d420e35
```

```
NEXT_PUBLIC_MERCADOPAGO_CHECKOUT_URL
Valor: https://mpago.la/1FUDU5S
```

#### **Site URL (obrigatório)**

```
NEXT_PUBLIC_SITE_URL
Valor: https://seu-dominio.vercel.app
(Substitua pelo domínio real após o primeiro deploy)
```

### 4. Para cada variável:

1. Clique em **Add New**
2. Cole o **Name** (nome da variável)
3. Cole o **Value** (valor da variável)
4. Selecione todos os ambientes: **Production**, **Preview**, **Development**
5. Clique em **Save**

### 5. Redeploy

Após adicionar todas as variáveis:

1. Vá em **Deployments**
2. Clique nos **três pontos** do último deployment
3. Clique em **Redeploy**
4. ✅ Pronto! O deploy deve funcionar agora

## 🔒 Segurança

⚠️ **NUNCA** compartilhe estas credenciais publicamente

- São dados sensíveis do seu projeto
- Mantenha-as apenas no Vercel e no seu `.env.local` local

## 📞 Suporte

Se tiver problemas:

1. Verifique se TODAS as variáveis foram adicionadas
2. Verifique se não há espaços extras nos valores
3. Tente fazer um novo deploy

---

✅ Após configurar, o site estará funcionando em produção!
