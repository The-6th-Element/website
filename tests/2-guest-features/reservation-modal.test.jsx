import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ReservationModal } from '../../src/components/features/ReservationModal'
import { AM_THEME } from '../../src/theme/tokens'

describe('BK-14: Toast Tables Reservation Modal Regression', () => {
  it('renders dialog with accessibility attributes and Toast Tables embed', () => {
    const handleClose = vi.fn()
    render(<ReservationModal theme={AM_THEME} onClose={handleClose} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText(/Reserve a Table/i)).toBeInTheDocument()
  })

  it('triggers onClose when pressing Escape key', () => {
    const handleClose = vi.fn()
    render(<ReservationModal theme={AM_THEME} onClose={handleClose} />)

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('triggers onClose when clicking close button', () => {
    const handleClose = vi.fn()
    render(<ReservationModal theme={AM_THEME} onClose={handleClose} />)

    const closeBtn = screen.getByRole('button', { name: /Close reservation dialog/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
