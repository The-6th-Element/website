// tests/5-studio/operating-hours.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { OperatingHoursManager } from '../../src/components/admin/OperatingHoursManager'
import { StaffPage } from '../../src/pages/StaffPage'
import { ContactPage } from '../../src/pages/ContactPage'
import { Footer } from '../../src/components/layout/Footer'
import { AM_THEME } from '../../src/theme/tokens'
import {
  getOperatingHoursConfig,
  saveOperatingHoursConfig,
  getLiveOperatingStatus,
  getGoogleBusinessProfilePayload,
  getStructuredDataOpeningHours,
  DEFAULT_WEEKLY_SCHEDULE,
} from '../../src/data/operatingHours'

describe('FEATURE-83: Omnichannel Operating Hours & Holiday Schedule Sync', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('1. StaffPage: renders Operating Hours tab and switches to OperatingHoursManager', () => {
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

    const hoursTab = screen.getByRole('button', { name: /Operating Hours/i })
    expect(hoursTab).toBeInTheDocument()

    // Click on Operating Hours tab
    fireEvent.click(hoursTab)

    expect(
      screen.getByRole('heading', { name: /Operating Hours & Service Times/i })
    ).toBeInTheDocument()

    // Verify the 4 channel cards are present
    expect(screen.getByText('🌐 Website')).toBeInTheDocument()
    expect(screen.getByText('📍 Google Maps')).toBeInTheDocument()
    expect(screen.getByText('🛵 Deliveroo')).toBeInTheDocument()
    expect(screen.getByText('🍞 Toast POS')).toBeInTheDocument()
  })

  it('2. OperatingHoursManager: allows editing weekly hours and toggling open/closed', () => {
    render(<OperatingHoursManager theme={AM_THEME} />)

    // Verify days are rendered
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Sunday')).toBeInTheDocument()

    // Toggle Monday closed
    const openButtons = screen.getAllByRole('button', { name: /^OPEN$/i })
    expect(openButtons.length).toBeGreaterThan(0)
    fireEvent.click(openButtons[0]) // Toggle Monday

    // Publish hours
    const publishBtn = screen.getByRole('button', { name: /Publish Hours/i })
    fireEvent.click(publishBtn)

    expect(screen.getByText(/✓ Hours Published!/i)).toBeInTheDocument()
  })

  it('3. Bank Holidays & Special Overrides: adds and removes holiday exceptions', () => {
    render(<OperatingHoursManager theme={AM_THEME} />)

    // Switch to Holidays sub-tab
    const holidaysTab = screen.getByRole('button', { name: /Bank Holidays/i })
    fireEvent.click(holidaysTab)

    expect(screen.getByText('Christmas Eve')).toBeInTheDocument()
    expect(screen.getByText('Christmas Day')).toBeInTheDocument()

    // Add a new custom holiday
    const nameInput = screen.getByPlaceholderText(/e\.g\. Boxing Day/i)
    fireEvent.change(nameInput, { target: { value: 'Staff Appreciation Day' } })

    const addBtn = screen.getByRole('button', { name: /\+ Add Date/i })
    fireEvent.click(addBtn)

    // Error because date is missing
    expect(screen.getByText(/Please select a date for the holiday override/i)).toBeInTheDocument()
  })

  it('4. Omnichannel Payloads: generates correct Google Business Profile API structure', () => {
    const config = getOperatingHoursConfig()
    const gbpPayload = getGoogleBusinessProfilePayload(config)

    expect(gbpPayload).toHaveProperty('regularHours')
    expect(gbpPayload).toHaveProperty('specialHours')
    expect(gbpPayload.regularHours.periods.length).toBe(7)
    expect(gbpPayload.specialHours.specialHourPeriods.length).toBeGreaterThan(0)

    // Check JSON-LD Structured Data generator
    const jsonLdHours = getStructuredDataOpeningHours(DEFAULT_WEEKLY_SCHEDULE)
    expect(jsonLdHours.length).toBe(7)
    expect(jsonLdHours[0]['@type']).toBe('OpeningHoursSpecification')
    expect(jsonLdHours[0].dayOfWeek).toEqual(['Monday'])
  })

  it('5. ContactPage & Footer: displays dynamic live hours and real-time status pill', () => {
    render(<ContactPage theme={AM_THEME} setBookingOpen={() => {}} />)

    // Real-time status pill is rendered
    expect(screen.getByText(/Open Now|Closed|Closing Soon/i)).toBeInTheDocument()

    // Expandable schedule toggle is present
    const toggleBtn = screen.getByRole('button', { name: /View Day-by-Day Schedule ▾/i })
    expect(toggleBtn).toBeInTheDocument()

    fireEvent.click(toggleBtn)
    expect(screen.getByText(/Full Weekly Trading Hours/i)).toBeInTheDocument()
    expect(screen.getByText(/Upcoming Holiday Hours/i)).toBeInTheDocument()

    // Footer check
    const { container } = render(<Footer theme={AM_THEME} navigate={() => {}} />)
    expect(container.textContent).toContain('Mon – Thu:')
    expect(container.textContent).toContain('Friday:')
  })

  it('6. Dynamic Grouping: correctly updates Footer to Mon – Tue: Closed when Mon & Tue are set to closed', () => {
    const customWeekly = DEFAULT_WEEKLY_SCHEDULE.map((d) => {
      if (d.day === 'Monday' || d.day === 'Tuesday') {
        return { ...d, open: false }
      }
      return d
    })

    saveOperatingHoursConfig({
      weekly: customWeekly,
      holidays: [],
      emergencyNotice: { enabled: false },
    })

    const { container } = render(<Footer theme={AM_THEME} navigate={() => {}} />)
    expect(container.textContent).toContain('Mon – Tue: Closed')
    expect(container.textContent).toContain('Wed – Thu: 8am – 10pm')
    expect(container.textContent).toContain('Friday: 8am – 11pm')
  })
})
