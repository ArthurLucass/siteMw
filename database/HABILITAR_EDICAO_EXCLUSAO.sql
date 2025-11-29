-- ============================================
-- CORRIGIR POLÍTICAS RLS PARA EDIÇÃO E EXCLUSÃO
-- ============================================

-- 1. CORRIGIR TABELA ADMINS
-- Remover política antiga incorreta
DROP POLICY IF EXISTS "Admins podem ver admins" ON public.admins;

-- Criar política correta para leitura de admins
CREATE POLICY "Usuários autenticados podem ler admins" 
ON public.admins 
FOR SELECT 
TO authenticated
USING (true);

-- 2. CORRIGIR TABELA PEDIDOS
-- Remover política antiga que está causando problemas
DROP POLICY IF EXISTS "Admins têm acesso total aos pedidos" ON public.pedidos;

-- Criar políticas específicas para UPDATE e DELETE
-- Permitir UPDATE para usuários autenticados que são admins
CREATE POLICY "Admins podem atualizar pedidos" 
ON public.pedidos 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt()->>'email'
  )
);

-- Permitir DELETE para usuários autenticados que são admins
CREATE POLICY "Admins podem excluir pedidos" 
ON public.pedidos 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt()->>'email'
  )
);

-- 3. VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('admins', 'pedidos')
ORDER BY tablename, policyname;

-- 4. TESTAR SE ESTÁ FUNCIONANDO
-- Execute este SELECT para verificar se consegue ler a tabela admins:
SELECT * FROM public.admins;

-- Execute este SELECT para verificar se consegue ler pedidos:
SELECT * FROM public.pedidos LIMIT 5;
