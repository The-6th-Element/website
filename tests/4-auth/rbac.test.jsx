import { describe, it, expect, beforeEach } from 'vitest'
import {
  ROLES,
  hasPermission,
  getStaffUsers,
  deleteStaffUser,
  resetStaffUsersToDefault,
  getSecurityQuestionForUser,
  verifySecurityAnswerAndResetPassword,
  authenticateStaff,
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

  it('BK-38: retrieves configured security questions for users and aliases', () => {
    const deepakQ = getSecurityQuestionForUser('deepak')
    expect(deepakQ.question).toBe('What is your favorite dish at The Sixth Element?')

    const adminQ = getSecurityQuestionForUser('admin')
    expect(adminQ.question).toBe('What is your favorite dish at The Sixth Element?')

    const poojaQ = getSecurityQuestionForUser('pooja')
    expect(poojaQ.question).toBe('What city or town was your mother born in?')

    expect(() => getSecurityQuestionForUser('nonexistent_user')).toThrow(/No account found/i)
  })

  it('BK-38: rejects incorrect security answers during password reset', async () => {
    await expect(
      verifySecurityAnswerAndResetPassword('deepak', 'Wrong Answer', 'NewPass123!')
    ).rejects.toThrow(/Incorrect answer to secret question/i)
  })

  it('BK-38: allows successful password reset with valid security answer and enables login', async () => {
    // Reset Deepak's password using the seeded secret answer ('Spiced Brunch')
    const resetRes = await verifySecurityAnswerAndResetPassword('deepak', 'Spiced Brunch', 'MyBrandNewPass2026!')
    expect(resetRes.success).toBe(true)

    // Verify user can now log in with the new password
    const loginRes = await authenticateStaff('deepak', 'MyBrandNewPass2026!')
    expect(loginRes.username).toBe('deepak')
    expect(loginRes.token).toBeDefined()
  })
})
