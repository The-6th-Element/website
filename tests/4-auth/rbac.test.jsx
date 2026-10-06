import { describe, it, expect, beforeEach } from 'vitest'
import {
  ROLES,
  hasPermission,
  getStaffUsers,
  deleteStaffUser,
  resetStaffUsersToDefault,
} from '../../src/utils/userManager'

describe('BK-14: RBAC & User Management Regression Suite', () => {
  beforeEach(() => {
    resetStaffUsersToDefault()
  })

  it('enforces that ONLY admin has canPublishLive and canManageUsers permissions', () => {
    // Admin
    expect(hasPermission('admin', 'canPublishLive')).toBe(true)
    expect(hasPermission('admin', 'canManageUsers')).toBe(true)

    // Manager
    expect(hasPermission('manager', 'canPublishLive')).toBe(false)
    expect(hasPermission('manager', 'canManageUsers')).toBe(false)
    expect(hasPermission('manager', 'canEditMenu')).toBe(true)

    // Kitchen
    expect(hasPermission('kitchen', 'canPublishLive')).toBe(false)
    expect(hasPermission('kitchen', 'canManageUsers')).toBe(false)
    expect(hasPermission('kitchen', 'canEditMenu')).toBe(true)

    // Staff
    expect(hasPermission('staff', 'canPublishLive')).toBe(false)
    expect(hasPermission('staff', 'canEditMenu')).toBe(false)
    expect(hasPermission('staff', 'canManagePromos')).toBe(false)
  })

  it('guarantees owner account cannot be deleted', () => {
    expect(() => deleteStaffUser('pooja')).toThrow(/Owner account cannot be deleted/i)
  })

  it('provides default seeded users with correct roles', () => {
    const users = getStaffUsers()
    const owner = users.find(u => u.username === 'pooja')
    const manager = users.find(u => u.username === 'manager')

    expect(owner).toBeDefined()
    expect(owner.role).toBe('admin')
    expect(owner.isProtected).toBe(true)

    expect(manager).toBeDefined()
    expect(manager.role).toBe('manager')
  })
})
