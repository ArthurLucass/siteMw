-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Vá em: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em "Authentication" > "Users" 
-- 4. Clique em "Add user" > "Create new user"
-- 5. Preencha:
--    - Email: seu-email@example.com
--    - Password: sua-senha-segura
--    - Marque "Auto Confirm User" (importante!)
-- 6. Clique em "Create user"
--
-- Depois, execute o SQL abaixo no "SQL Editor":
-- ============================================

-- Adicionar o email do admin na tabela admins
-- SUBSTITUA 'seu-email@example.com' pelo email que você criou acima
INSERT INTO public.admins (email, created_at)
VALUES ('seu-email@example.com', NOW())
ON CONFLICT (email) DO NOTHING;

-- Verificar se foi criado corretamente
SELECT * FROM public.admins;
