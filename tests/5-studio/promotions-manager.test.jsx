import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { PromotionsManager } from '../../src/components/admin/PromotionsManager'
import { AM_THEME } from '../../src/theme/tokens'

describe('PromotionsManager: Staff Offers & Promotions Editing', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders promotions list with Edit button and allows editing a promotion', () => {
    render(<PromotionsManager theme={AM_THEME} />)

    // Verify existing promotions rendered
    expect(screen.getByText('Make It a Christmas to Remember')).toBeInTheDocument()

    // Find all Edit buttons
    const editButtons = screen.getAllByRole('button', { name: /Edit ✎/i })
    expect(editButtons.length).toBeGreaterThan(0)

    // Click Edit on the Christmas promotion (first one)
    fireEvent.click(editButtons[0])

    // Verify the edit form appears with title pre-populated
    expect(screen.getByText(/Edit Promotion/i)).toBeInTheDocument()
    const titleInput = screen.getByDisplayValue('Make It a Christmas to Remember')
    expect(titleInput).toBeInTheDocument()

    // Modify the title
    fireEvent.change(titleInput, { target: { value: 'Make It a Christmas to Remember (Updated)' } })

    // Click "Update Promotion"
    const updateButton = screen.getByRole('button', { name: /Update Promotion/i })
    fireEvent.click(updateButton)

    // Form closes and the updated title is displayed in the list
    expect(screen.getByText('Make It a Christmas to Remember (Updated)')).toBeInTheDocument()
  })
})
