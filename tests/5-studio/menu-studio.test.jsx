// tests/5-studio/menu-studio.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { MenuStudio } from '../../src/components/admin/MenuStudio'
import { AM_THEME } from '../../src/theme/tokens'

describe('MenuStudio: Staff Festive / Christmas Menu & Dietary Tag Management', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders Daytime, Evening, and Festive Menu tabs in the category switcher', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    // Verify all 3 category tabs are present
    expect(screen.getByRole('button', { name: /Daytime/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Evening/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Festive Menu/i })).toBeInTheDocument()
  })

  it('switches to Festive Menu and displays festive sections and items in editor and preview', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    fireEvent.click(festiveTab)

    // Editor should show festive section inputs
    expect(screen.getByDisplayValue(/Festive Dinner · To Begin/i)).toBeInTheDocument()
    expect(screen.getAllByDisplayValue(/Christmas Turkey Tikka/i).length).toBeGreaterThanOrEqual(1)

    // Live preview should show festive header and icon
    expect(screen.getByText(/● Live Customer Preview/i)).toBeInTheDocument()
    expect(screen.getAllByText(/🎄/i).length).toBeGreaterThanOrEqual(2)
  })

  it('provides HALAL tag toggle so staff can introduce Halal qualifiers whenever desired', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    fireEvent.click(festiveTab)

    // Locate the first "+ HALAL" tag button (on dishes currently without Halal)
    const addHalalButtons = screen.getAllByRole('button', { name: /\+ HALAL/i })
    expect(addHalalButtons.length).toBeGreaterThan(0)

    // Click to add HALAL to the first dish
    fireEvent.click(addHalalButtons[0])

    // Should now toggle to "✓ HALAL"
    expect(screen.getAllByRole('button', { name: /✓ HALAL/i }).length).toBeGreaterThanOrEqual(1)

    // Click again to remove it
    const activeHalalBtn = screen.getByRole('button', { name: /✓ HALAL/i })
    fireEvent.click(activeHalalBtn)

    // Should return to "+ HALAL"
    expect(screen.queryByRole('button', { name: /✓ HALAL/i })).not.toBeInTheDocument()
  })

  it('allows adding a new section within Festive Menu', () => {
    render(
      <MenuStudio
        theme={AM_THEME}
        onClose={vi.fn()}
        userRole="admin"
        userName="deepak"
      />
    )

    const festiveTab = screen.getByRole('button', { name: /Festive Menu/i })
    fireEvent.click(festiveTab)

    const addSectionBtn = screen.getByRole('button', { name: /\+ Add Section/i })
    fireEvent.click(addSectionBtn)

    expect(screen.getByDisplayValue(/New Section/i)).toBeInTheDocument()
  })
})
