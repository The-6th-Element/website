// tests/2-guest-features/events-page.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { EventsPage } from '../../src/pages/EventsPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('FEATURE-76: Dedicated Events Page & Master-Detail Event Viewer', () => {
  it('renders left-hand events directory and defaults to Christmas 2026', () => {
    const setBookingOpen = vi.fn()
    render(<EventsPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    // Main Page Title
    expect(screen.getByRole('heading', { name: /Events & Festive Experiences/i })).toBeInTheDocument()

    // Left directory contains all default events
    const sidebar = screen.getByRole('navigation', { name: /Events list/i })
    expect(sidebar).toBeInTheDocument()
    expect(within(sidebar).getByText(/Make It a Christmas to Remember/i)).toBeInTheDocument()
    expect(within(sidebar).getByText(/Diwali Grand Celebration/i)).toBeInTheDocument()
    expect(within(sidebar).getByText(/New Year's Eve Gala/i)).toBeInTheDocument()
    expect(within(sidebar).getByText(/Natural Wine & Subcontinental Spice Masterclass/i)).toBeInTheDocument()
    expect(within(sidebar).getByText(/Weekend Live Jazz Brunch/i)).toBeInTheDocument()

    // Right-hand detail view displays Christmas 2026 details
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: /Make It a Christmas to Remember/i, level: 2 })).toBeInTheDocument()
    expect(within(main).getByText(/20 Nov 2026/i)).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: /^Festive Dinner$/i })).toBeInTheDocument()
    expect(within(main).getByText(/£35.95/i)).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: /^Christmas Feast$/i })).toBeInTheDocument()
    expect(within(main).getByText(/£37.95/i)).toBeInTheDocument()

    // Book Table button is present in main view
    const bookBtn = within(main).getByRole('button', { name: /Book Table/i })
    expect(bookBtn).toBeInTheDocument()
    fireEvent.click(bookBtn)
    expect(setBookingOpen).toHaveBeenCalledWith(true)
  })

  it('dynamically switches the right-hand view when clicking another event', () => {
    const setBookingOpen = vi.fn()
    render(<EventsPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    // Click Diwali on the left
    const sidebar = screen.getByRole('navigation', { name: /Events list/i })
    const diwaliBtn = within(sidebar).getByText(/Diwali Grand Celebration/i)
    fireEvent.click(diwaliBtn)

    // Right-hand view updates dynamically
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: /Diwali Grand Celebration & Royal Thali/i, level: 2 })).toBeInTheDocument()
    expect(within(main).getByText(/25 Oct 2026/i)).toBeInTheDocument()
    expect(within(main).getByText(/Royal Diwali Thali Banquet/i)).toBeInTheDocument()
    expect(within(main).getByText(/£38.50/i)).toBeInTheDocument()
    expect(within(main).getByText(/Grand Family Diwali Feast/i)).toBeInTheDocument()
    expect(within(main).getByText(/£42.00/i)).toBeInTheDocument()
  })

  it('switches to New Year\'s Eve Gala with sitting packages and pricing', () => {
    const setBookingOpen = vi.fn()
    render(<EventsPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    // Click NYE on the left
    const sidebar = screen.getByRole('navigation', { name: /Events list/i })
    const nyeBtn = within(sidebar).getByText(/New Year's Eve Gala/i)
    fireEvent.click(nyeBtn)

    // Right-hand view shows NYE Gala
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: /New Year's Eve Gala & Midnight Countdown/i, level: 2 })).toBeInTheDocument()
    expect(within(main).getByText(/31 Dec 2026/i)).toBeInTheDocument()
    expect(within(main).getByText(/Early Gala Dinner/i)).toBeInTheDocument()
    expect(within(main).getByText(/£55.00/i)).toBeInTheDocument()
    expect(within(main).getByText(/Midnight Countdown Feast/i)).toBeInTheDocument()
    expect(within(main).getByText(/£75.00/i)).toBeInTheDocument()
  })
})
