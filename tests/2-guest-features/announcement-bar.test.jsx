import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { AnnouncementBar } from '../../src/components/layout/AnnouncementBar'
import { AM_THEME } from '../../src/theme/tokens'

describe('Christmas Promotion & Ticker Modal Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders the Christmas promotion in the marquee ticker and displays packages in the modal upon click', () => {
    const setBookingOpen = vi.fn()
    const navigate = vi.fn()

    render(
      <AnnouncementBar
        theme={AM_THEME}
        setBookingOpen={setBookingOpen}
        navigate={navigate}
      />
    )

    // Check ticker button presence
    const promoButtons = screen.getAllByRole('button', { name: /Make It a Christmas to Remember/i })
    expect(promoButtons.length).toBeGreaterThan(0)

    // Click ticker item to open modal
    fireEvent.click(promoButtons[0])

    // Verify modal is open and dialog role is present
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    // Verify title and early bird perk inside dialog
    expect(within(dialog).getByRole('heading', { name: /Make It a Christmas to Remember/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/Book by 31st October/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/complimentary glass of Prosecco/i)).toBeInTheDocument()

    // Verify all 4 Christmas packages inside dialog
    expect(within(dialog).getByRole('heading', { name: /^Festive Dinner$/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/£35.95/i)).toBeInTheDocument()

    expect(within(dialog).getByRole('heading', { name: /^Christmas Feast$/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/£37.95/i)).toBeInTheDocument()

    expect(within(dialog).getByRole('heading', { name: /^Festive Bottomless$/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/£45/i)).toBeInTheDocument()

    expect(within(dialog).getByRole('heading', { name: /^Drinks & Nibbles$/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/from £20/i)).toBeInTheDocument()

    // Verify Book a Table button triggers setBookingOpen
    const bookButton = within(dialog).getByRole('button', { name: /Book a Table/i })
    expect(bookButton).toBeInTheDocument()

    fireEvent.click(bookButton)
    expect(setBookingOpen).toHaveBeenCalledWith(true)
  })

  it('opens the Group Enquiry modal and submits details routed to info@the6thelement.co.uk', () => {
    render(<AnnouncementBar theme={AM_THEME} />)

    const promoButtons = screen.getAllByRole('button', { name: /Make It a Christmas to Remember/i })
    fireEvent.click(promoButtons[0])

    // Find and click Group Enquiries button
    const groupEnquiryBtn = screen.getByRole('button', { name: /Group Enquiries/i })
    expect(groupEnquiryBtn).toBeInTheDocument()
    fireEvent.click(groupEnquiryBtn)

    // Verify Group Enquiry dialog opens
    expect(screen.getByRole('heading', { name: /Christmas Group & Office Enquiry/i })).toBeInTheDocument()

    // Fill in required form fields
    fireEvent.change(screen.getByLabelText(/Your Name \*/i), { target: { value: 'Alex Morgan' } })
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), { target: { value: 'alex@example.com' } })
    fireEvent.change(screen.getByLabelText(/Phone Number \*/i), { target: { value: '+44 7987 654321' } })
    fireEvent.change(screen.getByLabelText(/Group Size/i), { target: { value: '14' } })
    fireEvent.change(screen.getByLabelText(/Preferred Date \*/i), { target: { value: '2026-12-15' } })

    // Submit enquiry
    const submitBtn = screen.getByRole('button', { name: /^Submit Enquiry$/i })
    fireEvent.click(submitBtn)

    // Verify submission confirmation screen
    expect(screen.getByRole('heading', { name: /Thank You, Alex Morgan!/i })).toBeInTheDocument()
    expect(screen.getByText(/14 guests/i)).toBeInTheDocument()
    expect(screen.getByText(/info@the6thelement.co.uk/i)).toBeInTheDocument()
  })
})
