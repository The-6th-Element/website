// tests/2-guest-features/festive-menu.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { MenuPage } from '../../src/pages/MenuPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('FEATURE-86: Christmas Festive Menu in Menu Section', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.hash = ''
    vi.restoreAllMocks()
  })

  it('renders Festive Menu tab and switches to festive section when clicked', () => {
    const setBookingOpen = vi.fn()
    render(<MenuPage theme={AM_THEME} setBookingOpen={setBookingOpen} />)

    // Verify tab button exists
    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    expect(festiveTab).toBeInTheDocument()

    // Switch to festive tab
    fireEvent.click(festiveTab)

    // Hero banner elements
    expect(screen.getByText(/Early Reservation Perk/i)).toBeInTheDocument()
    expect(screen.getByText(/Book by/i)).toBeInTheDocument()
    expect(screen.getByText(/31st October/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Festive Dinner/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Christmas Feast/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Festive Bottomless Brunch/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Drinks & Nibbles/i).length).toBeGreaterThanOrEqual(1)

    // Check action buttons in hero card
    const bookTableBtn = screen.getByRole('button', { name: /Book Table/i })
    expect(bookTableBtn).toBeInTheDocument()
    fireEvent.click(bookTableBtn)
    expect(setBookingOpen).toHaveBeenCalledWith(true)

    const groupEnquiryBtn = screen.getByRole('button', { name: /Group & Office Enquiry/i })
    expect(groupEnquiryBtn).toBeInTheDocument()
    fireEvent.click(groupEnquiryBtn)

    expect(screen.getByRole('heading', { name: /Christmas Group & Office Enquiry/i })).toBeInTheDocument()
  })

  it('displays selectable package cards defaulting to Festive Dinner, with smallprint and package switching', () => {
    render(<MenuPage theme={AM_THEME} />)

    // Navigate to festive tab
    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    fireEvent.click(festiveTab)

    // Check 4 package cards exist in the header
    const dinnerCard = screen.getByRole('tab', { name: /FESTIVE DINNER/i })
    const feastCard = screen.getByRole('tab', { name: /CHRISTMAS FEAST/i })
    const brunchCard = screen.getByRole('tab', { name: /BOTTOMLESS BRUNCH/i })
    const drinksCard = screen.getByRole('tab', { name: /DRINKS & NIBBLES/i })

    expect(dinnerCard).toBeInTheDocument()
    expect(feastCard).toBeInTheDocument()
    expect(brunchCard).toBeInTheDocument()
    expect(drinksCard).toBeInTheDocument()

    // Default view: Festive Dinner is active
    expect(dinnerCard).toHaveAttribute('aria-selected', 'true')
    expect(feastCard).toHaveAttribute('aria-selected', 'false')

    // Section headings in default Festive Dinner view
    expect(screen.getAllByRole('heading', { name: /Festive Dinner/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { name: /Festive Dinner · The Main Event \(Choose One\)/i })).toBeInTheDocument()
    // Smallprint subtitle
    expect(screen.getByText(/Served with Naan or Saffron Rice/i)).toBeInTheDocument()

    // Key dishes from Festive Dinner without individual prices
    expect(screen.getAllByText(/Christmas Turkey Tikka/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Winter Ruby Tikki/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Velvet Christmas Makhani/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Midnight Dal Makhani/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/The Christmas Shank/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Christmas Gulab Jamun/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Midnight Chocolate Sphere/i).length).toBeGreaterThanOrEqual(1)

    // Upgrades and special pricing formatting:
    // Individual festive dinner items do not display prices (since it's £35.95 pp), only upgrades show +£10
    expect(screen.getAllByText(/\+£10/i).length).toBeGreaterThanOrEqual(1)

    // Switch to Christmas Feast card
    fireEvent.click(feastCard)
    expect(feastCard).toHaveAttribute('aria-selected', 'true')
    expect(dinnerCard).toHaveAttribute('aria-selected', 'false')

    // Christmas Feast offerings with individual dish lines without prices
    expect(screen.getAllByRole('heading', { name: /Christmas Feast/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { name: /The Signature Feast/i })).toBeInTheDocument()
    expect(screen.getByText(/Golden Jaipur Aloo/i)).toBeInTheDocument()
    expect(screen.getByText(/Saffron Rice & Festive Bread Basket/i)).toBeInTheDocument()
    // Signature Feast extension items
    expect(screen.getByText(/Ember Lamb Chops \(Signature Feast\)/i)).toBeInTheDocument()

    // Switch to Bottomless Brunch card
    fireEvent.click(brunchCard)
    expect(screen.getByRole('heading', { name: /Festive Bottomless Brunch/i })).toBeInTheDocument()
    expect(screen.getByText(/Avocado & Feta Sourdough/i)).toBeInTheDocument()
    expect(screen.getByText(/House Masala Shakshuka/i)).toBeInTheDocument()
    expect(screen.getByText(/90 Mins Bottomless Drinks Pours/i)).toBeInTheDocument()

    // Switch to Drinks & Nibbles card
    fireEvent.click(drinksCard)
    expect(screen.getByRole('heading', { name: /Drinks & Nibbles/i })).toBeInTheDocument()
    expect(screen.getByText(/The Merry Package/i)).toBeInTheDocument()
    expect(screen.getByText(/The Jolly Package/i)).toBeInTheDocument()
    expect(screen.getByText(/Welcome Glass of Prosecco/i)).toBeInTheDocument()
  })

  it('filters festive menu items by dietary tags', () => {
    render(<MenuPage theme={AM_THEME} />)

    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    fireEvent.click(festiveTab)

    // Turkey Tikka should be visible initially
    expect(screen.getAllByText(/Christmas Turkey Tikka/i).length).toBeGreaterThanOrEqual(1)

    // Click Vegetarian filter
    const vegFilterBtn = screen.getByRole('button', { name: /Vegetarian/i })
    fireEvent.click(vegFilterBtn)

    // Turkey Tikka (meat) should NOT be displayed
    expect(screen.queryByText(/Christmas Turkey Tikka/i)).not.toBeInTheDocument()

    // Winter Ruby Tikki (V, GF) and Golden Paneer Lababdar (V, GF) should still be displayed
    expect(screen.getAllByText(/Winter Ruby Tikki/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Golden Paneer Lababdar/i)).toBeInTheDocument()
  })

  it('defaults to Festive Menu tab when URL hash is #festive', () => {
    window.location.hash = '#festive'
    render(<MenuPage theme={AM_THEME} />)

    // Should immediately display festive header without clicking
    expect(screen.getByText(/Early Reservation Perk/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Christmas Turkey Tikka/i).length).toBeGreaterThanOrEqual(1)
  })
})
