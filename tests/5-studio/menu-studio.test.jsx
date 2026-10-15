// tests/5-studio/menu-studio.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { MenuStudio } from '../../src/components/admin/MenuStudio'
import { AM_THEME } from '../../src/theme/tokens'

describe('MenuStudio: Staff Standard Menu (Daytime & Evening) & Dietary Tag Management', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders Daytime and Evening tabs in category switcher and excludes promotional Festive Menu', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    // Standard menu tabs must be present
    expect(screen.getByRole('button', { name: /Daytime/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Evening/i })).toBeInTheDocument()

    // Festive Menu is a temporary promotion managed outside Menu Studio
    expect(screen.queryByRole('button', { name: /Festive Menu/i })).not.toBeInTheDocument()
  })

  it('displays Daytime sections by default and switches to Evening sections and preview', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    // Default active category is Daytime
    expect(screen.getByText(/● Live Customer Preview/i)).toBeInTheDocument()
    expect(screen.getAllByText(/☀️/i).length).toBeGreaterThanOrEqual(1)

    const eveningTab = screen.getByRole('button', { name: /Evening/i })
    fireEvent.click(eveningTab)

    // Live preview should now reflect Evening dining
    expect(screen.getAllByText(/🌙/i).length).toBeGreaterThanOrEqual(1)
  })

  it('provides DF tag toggle so staff can manage Dairy-Free qualifiers and ensures Halal is removed', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    // Halal tag must not be present
    expect(screen.queryByRole('button', { name: /\+ HALAL/i })).not.toBeInTheDocument()

    // Locate the first "+ DF" tag button on daytime dishes
    const addDfButtons = screen.getAllByRole('button', { name: /\+ DF/i })
    expect(addDfButtons.length).toBeGreaterThan(0)

    // Click to add DF to the first dish
    fireEvent.click(addDfButtons[0])

    // Should now toggle to "✓ DF"
    expect(screen.getAllByRole('button', { name: /✓ DF/i }).length).toBeGreaterThanOrEqual(1)

    // Click again to remove it
    const activeDfBtn = screen.getByRole('button', { name: /✓ DF/i })
    fireEvent.click(activeDfBtn)

    // Should return to "+ DF"
    expect(screen.queryByRole('button', { name: /✓ DF/i })).not.toBeInTheDocument()
  })

  it('allows adding a new section within the Standard Menu', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    const addSectionBtn = screen.getByRole('button', { name: /\+ Add Section/i })
    fireEvent.click(addSectionBtn)

    expect(screen.getByDisplayValue(/New Section/i)).toBeInTheDocument()
  })
})
