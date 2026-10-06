import { describe, it, expect, vi, afterEach } from 'vitest'
import { computeIsAM, defaultMenuTab } from '../../src/utils/time'
import { AM_THEME, PM_THEME, COLORS } from '../../src/theme/tokens'

describe('BK-14: Dual Theming & Time Calculations', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('provides complete and valid color palettes for AM and PM themes', () => {
    expect(AM_THEME.bg).toBeDefined()
    expect(AM_THEME.heading).toBeDefined()
    expect(AM_THEME.accent).toBe(COLORS.warmAmber)

    expect(PM_THEME.bg).toBeDefined()
    expect(PM_THEME.heading).toBeDefined()
    expect(PM_THEME.accent).toBe(COLORS.warmAmber)
  })

  it('computes AM (daylight) during morning hours (e.g. 10:00 AM London)', () => {
    // 10:00 UTC / London
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-06T10:00:00Z'))

    expect(computeIsAM(14)).toBe(true)
  })

  it('computes PM (evening lounge) after the switch hour (e.g. 15:00 London with switch at 14:00)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-06T15:00:00Z'))

    expect(computeIsAM(14)).toBe(false)
  })

  it('computes correct default menu tab: daytime for lunch, evening for dinner', () => {
    vi.useFakeTimers()
    // Lunch time (12:00)
    vi.setSystemTime(new Date('2026-10-06T12:00:00Z'))
    expect(defaultMenuTab({ menu_evening_hour: 17 })).toBe('daytime')

    // Evening dinner time (18:30)
    vi.setSystemTime(new Date('2026-10-06T18:30:00Z'))
    expect(defaultMenuTab({ menu_evening_hour: 17 })).toBe('evening')
  })
})
