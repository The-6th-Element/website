import { describe, it, expect, beforeEach } from 'vitest'
import {
  ROLES,
  hasPermission,
  getStaffUsers,
  deleteStaffUser,
  resetStaffUsersToDefault,
  SECURITY_QUESTIONS,
  setupSecurityQuestion,
  getSecurityQuestionForUser,
  verifySecurityAnswerAndResetPassword,
  authenticateStaff,
} from '../../src/utils/userManager'

describe('BK-14 & BK-38: RBAC & User Management Regression Suite', () => {
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

  it('provides default seeded users with correct roles and NO predefined security answers', () => {
    const users = getStaffUsers()
    const owner = users.find(u => u.username === 'pooja')
    const manager = users.find(u => u.username === 'manager')

    expect(owner).toBeDefined()
    expect(owner.role).toBe('admin')
    expect(owner.isProtected).toBe(true)
    expect(owner.securityQuestion).toBeNull()
    expect(owner.securityAnswerHash).toBeNull()

    expect(manager).toBeDefined()
    expect(manager.role).toBe('manager')
    expect(manager.securityQuestion).toBeNull()
    expect(manager.securityAnswerHash).toBeNull()
  })

  it('BK-38: populates 6-8 predefined questions for dropdown selection', () => {
    expect(SECURITY_QUESTIONS.length).toBeGreaterThanOrEqual(6)
    expect(SECURITY_QUESTIONS.length).toBeLessThanOrEqual(8)
    SECURITY_QUESTIONS.forEach(q => {
      expect(typeof q).toBe('string')
      expect(q.length).toBeGreaterThan(10)
    })
  })

  it('BK-38: rejects password reset when user has not completed one-time security setup', () => {
    expect(() => getSecurityQuestionForUser('deepak')).toThrow(
      /No security question has been set up for 'deepak' yet/i
    )
    expect(() => getSecurityQuestionForUser('nonexistent_user')).toThrow(/No account found/i)
  })

  it('BK-38: allows user to select a question and complete one-time setup, then reset password', async () => {
    // 1. One-time setup: user selects a question from dropdown and submits their secret answer
    const chosenQuestion = SECURITY_QUESTIONS[0]
    const setupRes = await setupSecurityQuestion('deepak', chosenQuestion, 'Greenwood High')
    expect(setupRes.success).toBe(true)
    expect(setupRes.question).toBe(chosenQuestion)

    // 2. Querying user's security question now retrieves their chosen question
    const deepakQ = getSecurityQuestionForUser('deepak')
    expect(deepakQ.question).toBe(chosenQuestion)

    // Alias 'admin' resolves to deepak's question
    const adminQ = getSecurityQuestionForUser('admin')
    expect(adminQ.question).toBe(chosenQuestion)

    // 3. Rejects incorrect answers
    await expect(
      verifySecurityAnswerAndResetPassword('deepak', 'Wrong School', 'NewPass123!')
    ).rejects.toThrow(/Incorrect answer to secret question/i)

    // 4. Accepts valid answer (case-insensitive & trimmed) and resets password
    const resetRes = await verifySecurityAnswerAndResetPassword(
      'deepak',
      '  greenwood high  ',
      'MyBrandNewPass2026!'
    )
    expect(resetRes.success).toBe(true)

    // 5. User logs in with newly reset password
    const loginRes = await authenticateStaff('deepak', 'MyBrandNewPass2026!')
    expect(loginRes.username).toBe('deepak')
    expect(loginRes.hasSecurityQuestion).toBe(true)
    expect(loginRes.token).toBeDefined()
  })
})
