// tests/2-guest-features/events-page.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { EventsPage } from '../../src/pages/EventsPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('FEATURE-76: Dedicated Events Page & Master-Detail Event Viewer', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders left-hand events directory and defaults to Christmas 2026', () => {
    const setBookingOpen = vi.fn()
    render(<EventsPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    // Main Page Title
    expect(screen.getByRole('heading', { name: /Events & Festive Experiences/i })).toBeInTheDocument()

    // Left directory contains the real Christmas event
    const sidebar = screen.getByRole('navigation', { name: /Events list/i })
    expect(sidebar).toBeInTheDocument()
    expect(within(sidebar).getByText(/Make It a Christmas to Remember/i)).toBeInTheDocument()

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

  it('dynamically switches the right-hand view when multiple events exist and are clicked', () => {
    // Seed localStorage with Christmas + a second custom event
    const customEvents = [
      {
        id: 'christmas-2026',
        title: 'Make It a Christmas to Remember',
        subtitle: 'Festive Dinners, Sharing Feasts & Bottomless Celebrations',
        badge: 'CHRISTMAS 2026',
        startDate: '2026-11-20',
        endDate: '2026-12-31',
        dateDisplay: '20 Nov 2026 – 31 Dec 2026',
        timing: 'Daily Lunch & Evening Dining',
        description: 'Celebrate the festive season with modern Indian cuisine.',
        offers: [
          { name: 'Festive Dinner', guests: '2-8 guests', price: '£35.95', description: 'Three courses' }
        ],
        hasGroupEnquiry: true,
      },
      {
        id: 'spring-equinox-2027',
        title: 'Spring Equinox Spice Gala',
        subtitle: 'A Celebratory 5-Course Tasting Journey',
        badge: 'SPRING 2027',
        startDate: '2027-03-20',
        endDate: '2027-03-22',
        dateDisplay: '20 Mar 2027 – 22 Mar 2027',
        timing: 'Evening Sittings from 6:00 PM',
        description: 'Celebrate the spring equinox with botanical cocktails and spiced seasonal plates.',
        offers: [
          { name: 'Chef Tasting Gala', guests: 'Per Guest', price: '£55.00', description: '5-course seasonal tasting' }
        ],
        hasGroupEnquiry: false,
      }
    ]
    localStorage.setItem('tse_events', JSON.stringify(customEvents))

    const setBookingOpen = vi.fn()
    render(<EventsPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    const sidebar = screen.getByRole('navigation', { name: /Events list/i })
    expect(within(sidebar).getByText(/Spring Equinox Spice Gala/i)).toBeInTheDocument()

    // Click on the second event
    const springBtn = within(sidebar).getByText(/Spring Equinox Spice Gala/i)
    fireEvent.click(springBtn)

    // Right-hand view updates dynamically
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: /Spring Equinox Spice Gala/i, level: 2 })).toBeInTheDocument()
    expect(within(main).getByText(/20 Mar 2027 – 22 Mar 2027/i)).toBeInTheDocument()
    expect(within(main).getByText(/Chef Tasting Gala/i)).toBeInTheDocument()
    expect(within(main).getByText(/£55.00/i)).toBeInTheDocument()
  })
})
