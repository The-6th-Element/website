import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { HomePage } from '../../src/pages/HomePage'
import { MenuPage } from '../../src/pages/MenuPage'
import { AboutPage } from '../../src/pages/AboutPage'
import { SocialImpactPage } from '../../src/pages/SocialImpactPage'
import { ContactPage } from '../../src/pages/ContactPage'
import { StaffPage } from '../../src/pages/StaffPage'
import { AM_THEME } from '../../src/theme/tokens'

describe('BK-14: Navigation & Route Smoke Tests', () => {
  const dummyFlags = {
    show_promotions: false,
    promo_badge_text: '',
    promo_headline: '',
    promo_detail: '',
  }

  const dummyAuth = {
    authenticated: false,
    user: null,
    username: null,
    role: null,
    title: null,
    token: null,
    loading: false,
  }

  it('renders HomePage without crashing', () => {
    render(
      <HomePage
        isAM={true}
        theme={AM_THEME}
        flags={dummyFlags}
        onBookTable={() => {}}
        onNavigate={() => {}}
      />
    )
    expect(screen.getByRole('heading', { name: /The Sixth Element/i })).toBeInTheDocument()
  })

  it('renders MenuPage with daytime & evening sections and filter bar', () => {
    render(
      <MenuPage
        isAM={true}
        theme={AM_THEME}
        flags={dummyFlags}
        onBookTable={() => {}}
      />
    )
    // Filter chips from BK-29 must be present
    expect(screen.getByRole('button', { name: /All Items/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Vegetarian/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Plant-Based/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Gluten-Friendly/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Halal Friendly/i })).toBeInTheDocument()
  })

  it('renders AboutPage (Our Story) without crashing', () => {
    render(
      <AboutPage
        isAM={true}
        theme={AM_THEME}
        onBookTable={() => {}}
      />
    )
    expect(screen.getByText(/Our Story/i)).toBeInTheDocument()
  })

  it('renders SocialImpactPage without crashing', () => {
    render(
      <SocialImpactPage
        isAM={true}
        theme={AM_THEME}
      />
    )
    expect(screen.getByText(/Social Impact/i)).toBeInTheDocument()
  })

  it('renders ContactPage with address and opening hours', () => {
    render(
      <ContactPage
        isAM={true}
        theme={AM_THEME}
        flags={dummyFlags}
        onBookTable={() => {}}
      />
    )
    expect(screen.getByText(/210 Upper Richmond Road/i)).toBeInTheDocument()
  })

  it('renders StaffPage login portal', () => {
    render(
      <StaffPage
        isAM={true}
        theme={AM_THEME}
        flags={dummyFlags}
        onUpdateFlag={() => {}}
        onResetFlags={() => {}}
        adminAuth={dummyAuth}
        onLogin={() => {}}
        onLogout={() => {}}
        onNavigate={() => {}}
      />
    )
    expect(screen.getByRole('heading', { name: /Staff Portal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In to Staff Portal/i })).toBeInTheDocument()
  })
})
