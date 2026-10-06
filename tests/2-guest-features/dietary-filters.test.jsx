import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  DietaryFilterBar,
  DIETARY_FILTERS,
  matchesDietaryFilter,
} from '../../src/components/menu/DietaryFilterBar'
import { MenuPage } from '../../src/pages/MenuPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('BK-29 & BK-14: Dietary & Lifestyle Filter Chips (Regression Suite)', () => {
  describe('Unit: matchesDietaryFilter logic', () => {
    it('matches "all" filter for any dish', () => {
      expect(matchesDietaryFilter({ tags: [] }, 'all')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['GF', 'V'] }, 'all')).toBe(true)
    })

    it('matches Vegetarian (V) for dishes tagged V or VE', () => {
      expect(matchesDietaryFilter({ tags: ['V'] }, 'V')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['VE'] }, 'V')).toBe(true) // Vegan dishes are vegetarian
      expect(matchesDietaryFilter({ tags: ['H'] }, 'V')).toBe(false)
      expect(matchesDietaryFilter({ tags: [] }, 'V')).toBe(false)
    })

    it('matches Plant-Based (VE) strictly for dishes tagged VE', () => {
      expect(matchesDietaryFilter({ tags: ['VE'] }, 'VE')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['V'] }, 'VE')).toBe(false)
    })

    it('matches Gluten-Friendly (GF) for dishes tagged GF or GF*', () => {
      expect(matchesDietaryFilter({ tags: ['GF'] }, 'GF')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['GF*'] }, 'GF')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['V'] }, 'GF')).toBe(false)
    })

    it('matches Halal Friendly (HALAL) for dishes tagged HALAL or H', () => {
      expect(matchesDietaryFilter({ tags: ['HALAL'] }, 'HALAL')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['H'] }, 'HALAL')).toBe(true)
      expect(matchesDietaryFilter({ tags: ['V'] }, 'HALAL')).toBe(false)
    })
  })

  describe('Component: DietaryFilterBar interactive rendering', () => {
    it('renders all 5 dietary filter chips with counts', () => {
      const counts = { all: 24, V: 14, VE: 6, GF: 10, HALAL: 8 }
      const onSelect = vi.fn()

      render(
        <DietaryFilterBar
          activeFilter="all"
          onSelectFilter={onSelect}
          counts={counts}
          theme={AM_THEME}
        />
      )

      expect(screen.getByRole('button', { name: /All Items/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Vegetarian/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Plant-Based/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Gluten-Friendly/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Halal Friendly/i })).toBeInTheDocument()

      // Click vegetarian filter
      const vegButton = screen.getByRole('button', { name: /Vegetarian/i })
      fireEvent.click(vegButton)
      expect(onSelect).toHaveBeenCalledWith('V')
    })
  })

  describe('Integration: MenuPage dietary filtering', () => {
    it('switches active filter and shows active filter notification banner', () => {
      render(
        <MenuPage
          isAM={true}
          theme={AM_THEME}
          flags={{ show_promotions: false }}
          onBookTable={() => {}}
        />
      )

      const vegButton = screen.getByRole('button', { name: /Vegetarian/i })
      fireEvent.click(vegButton)

      // Active filter notification banner appears
      expect(screen.getByText(/Vegetarian dishes/i)).toBeInTheDocument()
      expect(screen.getByText(/Show All Dishes/i)).toBeInTheDocument()

      // Clicking reset returns to All Items
      const resetButton = screen.getByText(/Show All Dishes/i)
      fireEvent.click(resetButton)
      expect(screen.queryByText(/Vegetarian dishes/i)).not.toBeInTheDocument()
    })
  })
})
