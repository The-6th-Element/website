import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  syncStaffUsersFromCloud,
} from '../../src/utils/userManager'

describe('BK-14 & BK-38: RBAC & User Management Regression Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
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

  it('guarantees core administrator accounts (pooja, admin, deepak) cannot be deleted', () => {
    expect(() => deleteStaffUser('pooja')).toThrow(/Owner account cannot be deleted/i)
    expect(() => deleteStaffUser('admin')).toThrow(/Core administrator accounts cannot be deleted/i)
    expect(() => deleteStaffUser('deepak')).toThrow(/Core administrator accounts cannot be deleted/i)
  })

  it('provides default seeded users with distinct admin, pooja, and deepak accounts', () => {
    const users = getStaffUsers()
    const admin = users.find(u => u.username === 'admin')
    const owner = users.find(u => u.username === 'pooja')
    const deepak = users.find(u => u.username === 'deepak')
    const manager = users.find(u => u.username === 'manager')

    expect(admin).toBeDefined()
    expect(admin.role).toBe('admin')
    expect(admin.isProtected).toBe(true)

    expect(owner).toBeDefined()
    expect(owner.role).toBe('admin')
    expect(owner.isProtected).toBe(true)

    expect(deepak).toBeDefined()
    expect(deepak.role).toBe('admin')
    expect(deepak.isProtected).toBe(true)

    expect(manager).toBeDefined()
    expect(manager.role).toBe('manager')
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
    expect(() => getSecurityQuestionForUser('admin')).toThrow(
      /No security question has been set up for 'System Administrator' yet/i
    )
    expect(() => getSecurityQuestionForUser('nonexistent_user')).toThrow(/No account found/i)
  })

  it('BK-38: independently sets up secret questions for admin, deepak, and pooja and retains them', async () => {
    // Setup for admin
    await setupSecurityQuestion('admin', SECURITY_QUESTIONS[0], 'Oxford Academy')
    // Setup for deepak
    await setupSecurityQuestion('deepak', SECURITY_QUESTIONS[1], 'London')
    // Setup for pooja
    await setupSecurityQuestion('pooja', SECURITY_QUESTIONS[2], 'Mini Cooper')

    // Each account retains its own distinct question
    expect(getSecurityQuestionForUser('admin').question).toBe(SECURITY_QUESTIONS[0])
    expect(getSecurityQuestionForUser('administrator').question).toBe(SECURITY_QUESTIONS[0]) // alias
    expect(getSecurityQuestionForUser('deepak').question).toBe(SECURITY_QUESTIONS[1])
    expect(getSecurityQuestionForUser('pooja').question).toBe(SECURITY_QUESTIONS[2])
    expect(getSecurityQuestionForUser('owner').question).toBe(SECURITY_QUESTIONS[2]) // alias
  })

  it('BK-38: resets password via secret answer and enforces changed password revocation of default password', async () => {
    const chosenQuestion = SECURITY_QUESTIONS[0]
    await setupSecurityQuestion('deepak', chosenQuestion, 'Greenwood High')

    // Rejects incorrect answers
    await expect(
      verifySecurityAnswerAndResetPassword('deepak', 'Wrong School', 'NewPass123!')
    ).rejects.toThrow(/Incorrect answer to secret question/i)

    // Accepts valid answer and resets password
    const resetRes = await verifySecurityAnswerAndResetPassword(
      'deepak',
      '  greenwood high  ',
      'MyBrandNewPass2026!'
    )
    expect(resetRes.success).toBe(true)

    // User logs in with newly reset password
    const loginRes = await authenticateStaff('deepak', 'MyBrandNewPass2026!')
    expect(loginRes.username).toBe('deepak')
    expect(loginRes.hasSecurityQuestion).toBe(true)
    expect(loginRes.token).toBeDefined()

    // Default password must now fail (revoked!)
    await expect(
      authenticateStaff('deepak', 'thesixthelement')
    ).rejects.toThrow(/Invalid username or password/i)
  })

  it('BK-38: synchronizes staff accounts from Supabase cloud database across devices', async () => {
    const cloudMockData = [
      {
        username: 'deepak',
        name: 'Deepak',
        title: 'Administrator',
        role: 'admin',
        password_hash: 'mocked_remote_hash_123',
        security_question: SECURITY_QUESTIONS[0],
        security_answer_hash: 'mocked_answer_hash_456',
        is_protected: true,
      },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => cloudMockData,
    })

    const synced = await syncStaffUsersFromCloud()
    const deepak = synced.find(u => u.username === 'deepak')
    expect(deepak).toBeDefined()
    expect(deepak.passwordHash).toBe('mocked_remote_hash_123')
    expect(deepak.securityQuestion).toBe(SECURITY_QUESTIONS[0])
    expect(deepak.securityAnswerHash).toBe('mocked_answer_hash_456')
  })

  it('BK-38: gracefully falls back to local storage and default accounts when Supabase is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    const fallbackUsers = await syncStaffUsersFromCloud()
    expect(fallbackUsers.length).toBeGreaterThanOrEqual(5)
    expect(fallbackUsers.find(u => u.username === 'admin')).toBeDefined()
  })
})
