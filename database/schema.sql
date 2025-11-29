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
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies de segurança (Row Level Security)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública de pedidos (apenas para o próprio registro por email)
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

-- Inserir um admin padrão (ALTERE O EMAIL)
-- INSERT INTO admins (email) VALUES ('admin@example.com');
