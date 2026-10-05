-- ==============================================================================
-- THE SIXTH ELEMENT (RICHMOND / LONDON)
-- Supabase Schema Migration: Privacy-Conscious First-Party Web Traffic Analytics
-- Feature: BK-28 (Monitor Website Traffic & Build Business Analytics)
-- ==============================================================================

-- 1. Create table for raw telemetry events
CREATE TABLE IF NOT EXISTS public.site_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    page_path TEXT NOT NULL DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes for event queries and date rollups
CREATE INDEX IF NOT EXISTS idx_site_events_created_at 
    ON public.site_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_site_events_event_name 
    ON public.site_events (event_name);

CREATE INDEX IF NOT EXISTS idx_site_events_session_id 
    ON public.site_events (session_id);

CREATE INDEX IF NOT EXISTS idx_site_events_date_london 
    ON public.site_events ((created_at AT TIME ZONE 'Europe/London'));

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:
-- Allow the public website (anon key) to INSERT events, but NEVER read raw events
DROP POLICY IF EXISTS "Allow anon inserts" ON public.site_events;
CREATE POLICY "Allow anon inserts"
    ON public.site_events
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow service_role (used by toast_xero_integrator nightly sync) full access
DROP POLICY IF EXISTS "Allow service_role full access" ON public.site_events;
CREATE POLICY "Allow service_role full access"
    ON public.site_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (staff / admin) read access
DROP POLICY IF EXISTS "Allow authenticated read" ON public.site_events;
CREATE POLICY "Allow authenticated read"
    ON public.site_events
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Analytical Aggregate View: Daily Web Metrics
-- Rolls up traffic into UK London calendar trading days
CREATE OR REPLACE VIEW public.daily_web_metrics AS
SELECT
    date(created_at AT TIME ZONE 'Europe/London') AS trading_date,
    COUNT(DISTINCT session_id) AS unique_visitors,
    COUNT(*) FILTER (WHERE event_name = 'page_view') AS page_views,
    COUNT(*) FILTER (WHERE event_name = 'book_table_click') AS book_table_clicks,
    COUNT(*) FILTER (WHERE event_name = 'directions_click') AS directions_clicks,
    COUNT(*) FILTER (WHERE event_name = 'menu_tab_switch') AS menu_tab_switches,
    COUNT(*) FILTER (WHERE event_name = 'menu_print_pdf') AS menu_print_downloads,
    COUNT(*) FILTER (WHERE event_name = 'promo_banner_click') AS promo_clicks,
    COUNT(*) FILTER (WHERE event_name = 'contact_click') AS contact_clicks,
    COUNT(DISTINCT session_id) FILTER (WHERE device_type = 'mobile') AS mobile_visitors,
    COUNT(DISTINCT session_id) FILTER (WHERE device_type = 'desktop') AS desktop_visitors,
    ROUND(
        100.0 * COUNT(DISTINCT session_id) FILTER (WHERE device_type = 'mobile') / 
        NULLIF(COUNT(DISTINCT session_id), 0), 
        1
    ) AS mobile_percentage,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE event_name = 'book_table_click') / 
        NULLIF(COUNT(DISTINCT session_id), 0), 
        1
    ) AS booking_intent_rate_pct
FROM public.site_events
GROUP BY date(created_at AT TIME ZONE 'Europe/London')
ORDER BY trading_date DESC;

-- Grant SELECT access on the aggregate view to anon and service_role
-- (Safe to expose aggregate counts without exposing raw user records)
GRANT SELECT ON public.daily_web_metrics TO anon;
GRANT SELECT ON public.daily_web_metrics TO authenticated;
GRANT SELECT ON public.daily_web_metrics TO service_role;

-- 6. Helper Function: Get Traffic Summary for Date Range
CREATE OR REPLACE FUNCTION public.get_web_traffic_summary(p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    trading_date DATE,
    unique_visitors BIGINT,
    page_views BIGINT,
    book_table_clicks BIGINT,
    directions_clicks BIGINT,
    menu_tab_switches BIGINT,
    menu_print_downloads BIGINT,
    promo_clicks BIGINT,
    contact_clicks BIGINT,
    mobile_percentage NUMERIC,
    booking_intent_rate_pct NUMERIC
) LANGUAGE sql STABLE AS $$
    SELECT 
        trading_date,
        unique_visitors,
        page_views,
        book_table_clicks,
        directions_clicks,
        menu_tab_switches,
        menu_print_downloads,
        promo_clicks,
        contact_clicks,
        mobile_percentage,
        booking_intent_rate_pct
    FROM public.daily_web_metrics
    WHERE trading_date BETWEEN p_start_date AND p_end_date
    ORDER BY trading_date DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_web_traffic_summary TO anon, authenticated, service_role;
