import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import {
  saveSoldOutItems,
  getStoredSoldOutItems,
} from '../../src/hooks/useItemAvailability'
import { MenuPage } from '../../src/pages/MenuPage'
import { ItemAvailabilityManager } from '../../src/components/admin/ItemAvailabilityManager'
import { AM_THEME } from '../../src/theme/tokens'

describe('BK-12 & BK-14: Menu Item Availability / 86 Toggle Regression Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    saveSoldOutItems([])
  })

  it('manages sold-out storage correctly via utility functions', () => {
    expect(getStoredSoldOutItems()).toEqual([])

    saveSoldOutItems(['Avocado & Feta Sourdough', 'Masala Beans on Toast'])
    expect(getStoredSoldOutItems()).toEqual(['Avocado & Feta Sourdough', 'Masala Beans on Toast'])

    saveSoldOutItems([])
    expect(getStoredSoldOutItems()).toEqual([])
  })

  it('renders "Sold Out Today" badge on MenuPage when an item is 86ed', () => {
    const testFlags = { show_promotions: false, menu_evening_hour: 24 }

    // 1. Initially, no sold out badges
    const { unmount } = render(
      <MenuPage
        theme={AM_THEME}
        flags={testFlags}
        onBookTable={() => {}}
      />
    )
    expect(screen.queryByText(/Sold Out Today/i)).not.toBeInTheDocument()
    unmount()

    // 2. Mark Avocado & Feta Sourdough as sold out
    act(() => {
      saveSoldOutItems(['Avocado & Feta Sourdough'])
    })

    render(
      <MenuPage
        theme={AM_THEME}
        flags={testFlags}
        onBookTable={() => {}}
      />
    )

    // Now Avocado & Feta Sourdough displays Sold Out Today badge
    expect(screen.getByText(/Sold Out Today/i)).toBeInTheDocument()
  })

  it('ItemAvailabilityManager renders dish toggles and allows 86ing an item', () => {
    render(<ItemAvailabilityManager theme={AM_THEME} />)

    // Manager header and zero sold out count initially
    expect(screen.getByText(/86 \/ Item Availability Manager/i)).toBeInTheDocument()
    expect(screen.getByText(/All Items Available/i)).toBeInTheDocument()

    // Find the toggle for the first dish
    const toggleButtons = screen.getAllByRole('button', { name: /Available/i })
    expect(toggleButtons.length).toBeGreaterThan(0)

    // Click to 86 the item
    fireEvent.click(toggleButtons[0])

    // Storage updated with 1 item
    expect(getStoredSoldOutItems().length).toBe(1)
    expect(screen.getByText(/1 Sold Out Today/i)).toBeInTheDocument()
  })

  it('allows filtering dishes by search query in ItemAvailabilityManager', () => {
    render(<ItemAvailabilityManager theme={AM_THEME} />)

    const searchInput = screen.getByPlaceholderText(/Search dish or section/i)
    fireEvent.change(searchInput, { target: { value: 'Shakshuka' } })

    expect(screen.getByText(/House Masala Shakshuka/i)).toBeInTheDocument()
  })
})
