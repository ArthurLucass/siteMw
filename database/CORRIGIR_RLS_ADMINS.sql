-- ============================================
-- CORRIGIR RLS DA TABELA ADMINS
-- ============================================

-- Remover política antiga que está errada
DROP POLICY IF EXISTS "Admins podem ver admins" ON public.admins;

-- Criar nova política: permitir leitura para TODOS usuários autenticados
-- (já que a verificação de admin é feita no código da aplicação)
CREATE POLICY "Usuários autenticados podem ler admins" 
ON public.admins 
FOR SELECT 
TO authenticated
USING (true);

-- OU se preferir permitir leitura pública (mais simples para este caso):
-- DROP POLICY IF EXISTS "Usuários autenticados podem ler admins" ON public.admins;
-- CREATE POLICY "Permitir leitura pública de admins" 
-- ON public.admins 
-- FOR SELECT 
-- USING (true);

-- Verificar se funcionou
SELECT * FROM public.admins;
