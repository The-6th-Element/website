// tests/5-studio/analytics-retention.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import {
  trackEvent,
  trackPageView,
  trackBookTableClick,
  getStoredTelemetryMetrics,
} from '../../src/utils/analytics'
import { AnalyticsDashboard } from '../../src/components/admin/AnalyticsDashboard'
import { AM_THEME } from '../../src/theme/tokens'

describe('Analytics & Telemetry Data Retention & Incremental Tracking', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('preserves and increments cumulative metrics across events without overwriting', () => {
    // 1. First event
    trackPageView('/home')
    let metrics = getStoredTelemetryMetrics()
    expect(metrics.cumulative.uniqueVisitors).toBeGreaterThanOrEqual(1)
    expect(metrics.cumulative.pageViews).toBeGreaterThanOrEqual(1)

    // 2. Track more actions
    trackBookTableClick('hero')
    trackPageView('/menu')

    metrics = getStoredTelemetryMetrics()
    expect(metrics.cumulative.pageViews).toBeGreaterThanOrEqual(2)
    expect(metrics.cumulative.bookClicks).toBeGreaterThanOrEqual(1)
  })

  it('renders AnalyticsDashboard with timeframe pills and retained metrics', async () => {
    // Seed some telemetry into localStorage
    trackPageView('/home')
    trackBookTableClick('menu')

    // Mock fetch to simulate Supabase returning historical daily metrics
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        {
          trading_date: '2026-10-11',
          unique_visitors: 2,
          page_views: 31,
          book_table_clicks: 0,
          directions_clicks: 0,
          menu_tab_switches: 0,
          menu_print_downloads: 0,
          promo_clicks: 0,
          mobile_percentage: 0,
        },
        {
          trading_date: '2026-10-10',
          unique_visitors: 15,
          page_views: 42,
          book_table_clicks: 1,
          directions_clicks: 0,
          menu_tab_switches: 0,
          menu_print_downloads: 0,
          promo_clicks: 15,
          mobile_percentage: 33.3,
        },
      ],
    })

    render(<AnalyticsDashboard theme={AM_THEME} />)

    // Verify header and guarantee banner
    expect(screen.getByText(/Website Traffic & Dining Intent Telemetry/i)).toBeInTheDocument()
    expect(screen.getByText(/Persistent Historical Retention:/i)).toBeInTheDocument()

    // Wait for Supabase live data to merge
    await waitFor(() => {
      // Check timeframe pills
      expect(screen.getByRole('button', { name: /All-Time Cumulative/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Today/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Yesterday/i })).toBeInTheDocument()
      // In All-Time Cumulative view (default), total visitors is >= 17 (15 + 2)
      expect(screen.getByText(/17 visitors/i)).toBeInTheDocument()
    })

    expect(screen.getAllByText('17').length).toBeGreaterThanOrEqual(1)

    // Switch to Yesterday
    const yesterdayBtn = screen.getByRole('button', { name: /Yesterday/i })
    fireEvent.click(yesterdayBtn)

    // Yesterday card shows 15 visitors
    expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1)

    // Switch to Today
    const todayBtn = screen.getByRole('button', { name: /Today/i })
    fireEvent.click(todayBtn)

    // Today card shows at least 2 visitors
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1)
  })
})
