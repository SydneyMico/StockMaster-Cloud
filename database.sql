-- ==========================================================
-- STOCKMASTER PROFESSIONAL CLOUD - CLEAN SLATE SCHEMA
-- ==========================================================
-- INSTRUCTIONS: Run this entire script in your Supabase SQL Editor.

-- 0. CLEANUP
DROP TABLE IF EXISTS system_configs;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS support_messages;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS companies;

-- 1. COMPANIES TABLE
CREATE TABLE companies (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'RWF',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    role TEXT NOT NULL CHECK (role IN ('manager', 'worker', 'super-admin')),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
    company_id TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'growth', 'pro')),
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    payer_name TEXT, 
    payer_phone TEXT,
    unlock_pin TEXT, 
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT DEFAULT 'EA',
    stock INTEGER DEFAULT 0,
    cost_price NUMERIC DEFAULT 0,
    selling_price NUMERIC DEFAULT 0,
    category TEXT DEFAULT 'General',
    low_stock_threshold INTEGER DEFAULT 5,
    last_restocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SALES TABLE
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    seller_name TEXT,
    seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SUPPORT MESSAGES TABLE
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT, 
    user_name TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved')),
    admin_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT, 
    user_name TEXT,
    user_email TEXT, -- Added missing column to prevent insert failures
    action TEXT NOT NULL,
    details TEXT,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SYSTEM CONFIGS
CREATE TABLE system_configs (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- REALTIME ENABLEMENT
-- ==========================================================

-- Enable realtime for the tables we want to auto-refresh
begin;
  -- remove the publication if it exists
  drop publication if exists supabase_realtime;

  -- create a new publication
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table sales;
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table activity_logs;

-- ==========================================================
-- SECURITY POLICIES (RLS)
-- ==========================================================

ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for configs" ON system_configs FOR SELECT USING (true);
CREATE POLICY "Admin bypass configs" ON system_configs FOR ALL USING (true);
CREATE POLICY "Admin total access" ON support_messages FOR ALL USING (true);
CREATE POLICY "Admin logs access" ON activity_logs FOR ALL USING (true);
CREATE POLICY "Admin sales access" ON sales FOR ALL USING (true);
CREATE POLICY "Admin products access" ON products FOR ALL USING (true);

-- Users can insert their own logs
CREATE POLICY "Users can insert logs" ON activity_logs FOR INSERT WITH CHECK (true);
-- Managers can view their company logs
CREATE POLICY "Managers can view logs" ON activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id::text = auth.uid()::text 
    AND profiles.role = 'manager' 
    AND profiles.company_id = activity_logs.company_id
  )
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

INSERT INTO system_configs (key, value) VALUES 
('momo_number', '0795009861'),
('price_growth_monthly', '6000'),
('price_growth_yearly', '54000'),
('price_pro_monthly', '10000'),
('price_pro_yearly', '108000'),
('discount_label', 'Save 30% on yearly'),
('support_whatsapp', '0795009861'),
('support_phone', '0795009861'),
('support_email', 'support@stockmaster.rw')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ==========================================================
-- PERFORMANCE INDEXES
-- ==========================================================

CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_sales_company ON sales(company_id);
CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_logs_company ON activity_logs(company_id);
CREATE INDEX idx_logs_timestamp ON activity_logs(timestamp DESC);