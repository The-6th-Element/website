// tests/5-studio/events-manager.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { EventsManager } from '../../src/components/admin/EventsManager'
import { StaffPage } from '../../src/pages/StaffPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('EventsManager: Staff Events & Gatherings Portal Management', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders Events & Gatherings tab in StaffPage next to Offers & Promos', () => {
    const adminAuth = {
      authenticated: true,
      user: 'Pooja',
      username: 'pooja',
      role: 'admin',
      title: 'Co-Founder & Director',
      token: 'jwt-dummy',
      loading: false,
    }

    render(
      <StaffPage
        theme={AM_THEME}
        flags={{}}
        updateFlag={() => {}}
        resetFlags={() => {}}
        adminAuth={adminAuth}
        onLogin={() => {}}
        onLogout={() => {}}
        onOpenStudio={() => {}}
        navigate={() => {}}
      />
    )

    // Verify both tabs exist
    const promosTab = screen.getByRole('button', { name: /Offers & Promos/i })
    const eventsTab = screen.getByRole('button', { name: /Events & Gatherings/i })
    expect(promosTab).toBeInTheDocument()
    expect(eventsTab).toBeInTheDocument()

    // Click on Events & Gatherings tab
    fireEvent.click(eventsTab)

    // Events & Gatherings tab heading and EventsManager content are displayed
    expect(screen.getByRole('heading', { name: /^Events & Gatherings$/i })).toBeInTheDocument()
    expect(screen.getByText('Make It a Christmas to Remember')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Add Event & Gathering/i })).toBeInTheDocument()
  })

  it('renders default events with badges, dates, and edit buttons', () => {
    render(<EventsManager theme={AM_THEME} />)

    // Check default Christmas event is rendered
    expect(screen.getByText('Make It a Christmas to Remember')).toBeInTheDocument()
    expect(screen.getByText(/CHRISTMAS 2026/i)).toBeInTheDocument()

    // Verify Edit button exists for the event
    const editButtons = screen.getAllByRole('button', { name: /Edit ✎/i })
    expect(editButtons.length).toBeGreaterThanOrEqual(1)

    // Verify '+ Add Event & Gathering' button is present
    expect(screen.getByRole('button', { name: /\+ Add Event & Gathering/i })).toBeInTheDocument()
  })

  it('allows staff to edit an existing event title, dates, and package tiers', () => {
    render(<EventsManager theme={AM_THEME} />)

    // Click Edit on the Christmas event (first event)
    const editButtons = screen.getAllByRole('button', { name: /Edit ✎/i })
    fireEvent.click(editButtons[0])

    // Edit form should appear
    expect(screen.getByRole('heading', { name: /Edit Event & Gathering/i })).toBeInTheDocument()

    const titleInput = screen.getByDisplayValue('Make It a Christmas to Remember')
    expect(titleInput).toBeInTheDocument()

    // Change title
    fireEvent.change(titleInput, { target: { value: 'Make It a Christmas to Remember (Staff Updated)' } })

    // Add another package tier
    const addTierBtn = screen.getByRole('button', { name: /\+ Add Package Tier/i })
    fireEvent.click(addTierBtn)

    // Find the new package inputs
    const packageInputs = screen.getAllByPlaceholderText(/e\.g\. Festive Dinner/i)
    expect(packageInputs.length).toBeGreaterThan(4)
    fireEvent.change(packageInputs[packageInputs.length - 1], {
      target: { value: 'VIP Chef Table Experience' },
    })

    const priceInputs = screen.getAllByPlaceholderText(/e\.g\. £35\.95/i)
    fireEvent.change(priceInputs[priceInputs.length - 1], {
      target: { value: '£95.00' },
    })

    // Submit the update
    const updateBtn = screen.getByRole('button', { name: /Update Event/i })
    fireEvent.click(updateBtn)

    // Form closes and updated event is visible in the list
    expect(screen.queryByRole('heading', { name: /Edit Event & Gathering/i })).not.toBeInTheDocument()
    expect(screen.getByText('Make It a Christmas to Remember (Staff Updated)')).toBeInTheDocument()
    expect(screen.getByText(/VIP Chef Table Experience/i)).toBeInTheDocument()
  })

  it('allows staff to create and add a brand new event', () => {
    render(<EventsManager theme={AM_THEME} />)

    // Click Add Event
    const addBtn = screen.getByRole('button', { name: /\+ Add Event & Gathering/i })
    fireEvent.click(addBtn)

    // Form opens
    expect(screen.getByRole('heading', { name: /Add New Event & Gathering/i })).toBeInTheDocument()

    // Fill in required Title
    const titleInput = screen.getByPlaceholderText(/e\.g\. Make It a Christmas to Remember/i)
    fireEvent.change(titleInput, { target: { value: 'Spring Equinox Spice Gala 2027' } })

    const subtitleInput = screen.getByPlaceholderText(/Festive Dinners, Sharing Feasts/i)
    fireEvent.change(subtitleInput, { target: { value: 'Celebratory 5-Course Tasting Menu' } })

    const dateDisplayInput = screen.getByPlaceholderText(/20 Nov 2026 – 31 Dec 2026/i)
    fireEvent.change(dateDisplayInput, { target: { value: '20 Mar 2027 – 22 Mar 2027' } })

    // Submit
    const saveBtn = screen.getByRole('button', { name: /Save & Publish Event/i })
    fireEvent.click(saveBtn)

    // New event is now in the list
    expect(screen.getByText('Spring Equinox Spice Gala 2027')).toBeInTheDocument()
    expect(screen.getByText('Celebratory 5-Course Tasting Menu')).toBeInTheDocument()
    expect(screen.getByText(/20 Mar 2027 – 22 Mar 2027/i)).toBeInTheDocument()
  })

  it('allows staff to delete an event when confirmed', () => {
    // Mock window.confirm to true
    vi.spyOn(window, 'confirm').mockImplementation(() => true)

    // Seed with two events
    const initialEvents = [
      {
        id: 'christmas-2026',
        title: 'Make It a Christmas to Remember',
        badge: 'CHRISTMAS 2026',
        dateDisplay: '20 Nov 2026 – 31 Dec 2026',
        offers: [],
      },
      {
        id: 'temporary-event',
        title: 'Temporary Tasting Session',
        badge: 'ONE NIGHT ONLY',
        dateDisplay: '15 Nov 2026',
        offers: [],
      },
    ]
    localStorage.setItem('tse_events', JSON.stringify(initialEvents))

    render(<EventsManager theme={AM_THEME} />)

    expect(screen.getByText('Temporary Tasting Session')).toBeInTheDocument()

    // Find all delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /Delete ×/i })
    expect(deleteButtons.length).toBe(2)

    // Click delete on the second event
    fireEvent.click(deleteButtons[1])

    expect(window.confirm).toHaveBeenCalled()
    expect(screen.queryByText('Temporary Tasting Session')).not.toBeInTheDocument()
    expect(screen.getByText('Make It a Christmas to Remember')).toBeInTheDocument()
  })
})
