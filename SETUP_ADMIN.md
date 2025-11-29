# Guia Rápido: Criar Primeiro Admin

Após configurar o banco de dados, você precisa criar o primeiro usuário administrador.

## Passo 1: Criar usuário no Supabase Auth

1. Acesse seu projeto no Supabase
2. Vá em **Authentication** > **Users**
3. Clique em **Add user** > **Create new user**
4. Preencha:
   - Email: seu-email@example.com
   - Password: sua-senha-segura
   - Confirm Password: sua-senha-segura
5. Clique em **Create user**

## Passo 2: Adicionar email na tabela admins

1. No Supabase, vá em **SQL Editor**
2. Execute o seguinte comando (substituindo pelo seu email):

```sql
INSERT INTO admins (email)
VALUES ('seu-email@example.com');
```

## Passo 3: Fazer login

1. Acesse http://localhost:3000/login
2. Entre com o email e senha que você criou
3. Você será redirecionado para o painel administrativo

## Criar outros administradores

Repita os passos acima para cada novo administrador que você quiser adicionar.

**Importante**: O email usado no Supabase Auth DEVE ser o mesmo da tabela `admins`.
