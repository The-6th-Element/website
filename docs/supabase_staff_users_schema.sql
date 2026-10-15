-- ==============================================================================
-- THE SIXTH ELEMENT (RICHMOND / LONDON)
-- Supabase Cloud Staff Users & RBAC Cross-Device Synchronization
-- Project: https://crjtogivsllhsxuznufn.supabase.co
-- ==============================================================================

-- 1. Create table for staff accounts and credentials
CREATE TABLE IF NOT EXISTS public.staff_users (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    role TEXT NOT NULL DEFAULT 'staff',
    password_hash TEXT NOT NULL,
    security_question TEXT,
    security_answer_hash TEXT,
    is_protected BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance index on username (primary key index is automatic)
CREATE INDEX IF NOT EXISTS idx_staff_users_role ON public.staff_users (role);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:

-- Allow public frontend (anon) and staff to read user records for authentication and profile display
DROP POLICY IF EXISTS "Allow staff read" ON public.staff_users;
CREATE POLICY "Allow staff read"
    ON public.staff_users
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

-- Allow creating new staff accounts
DROP POLICY IF EXISTS "Allow staff insert" ON public.staff_users;
CREATE POLICY "Allow staff insert"
    ON public.staff_users
    FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Allow updating credentials, passwords, and security questions
DROP POLICY IF EXISTS "Allow staff update" ON public.staff_users;
CREATE POLICY "Allow staff update"
    ON public.staff_users
    FOR UPDATE
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- Allow deleting un-protected staff accounts
DROP POLICY IF EXISTS "Allow staff delete" ON public.staff_users;
CREATE POLICY "Allow staff delete"
    ON public.staff_users
    FOR DELETE
    TO anon, authenticated, service_role
    USING (is_protected = false);

-- 5. Seed Core Accounts (Default password hash corresponds to 'thesixthelement')
INSERT INTO public.staff_users (username, name, title, role, password_hash, is_protected)
VALUES
    ('admin', 'System Administrator', 'Administrator', 'admin', 'b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4', true),
    ('pooja', 'Pooja Somani', 'Owner', 'admin', 'b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4', true),
    ('deepak', 'Deepak', 'Administrator', 'admin', 'b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4', true),
    ('manager', 'Duty Manager', 'General Manager', 'manager', '32730f193cd7a81697cf9d63fb33c8f72442de952e511ea152f8d81a9bc7244c', false),
    ('chef', 'Kitchen & Bar Lead', 'Head Chef', 'kitchen', 'eb95682c0d9d8896842b70c71ce6af9a430f22231cdbcb709cb51fb63dbc5fd8', false)
ON CONFLICT (username) DO NOTHING;
