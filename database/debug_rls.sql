-- ============================================
-- DEBUG: Verificar RLS e dados da tabela admins
-- ============================================

-- 1. Ver todos os registros da tabela admins
SELECT * FROM public.admins;

-- 2. Verificar se RLS está ativado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admins';

-- 3. Ver políticas RLS ativas
SELECT * FROM pg_policies WHERE tablename = 'admins';

-- 4. Desabilitar temporariamente RLS para teste (CUIDADO: apenas para debug)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- 5. Após desabilitar RLS, teste o login novamente
-- Se funcionar, o problema é RLS. Então reabilite:
-- ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 6. Criar política que permite leitura para usuários autenticados
DROP POLICY IF EXISTS "Permitir leitura de admins" ON public.admins;
CREATE POLICY "Permitir leitura de admins" 
ON public.admins 
FOR SELECT 
USING (true);

-- 7. Verificar novamente
SELECT * FROM public.admins;
