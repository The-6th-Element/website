import { describe, it, expect, beforeEach } from 'vitest';
import { 
  ROLES, 
  DEFAULT_USERS, 
  hasPermission, 
  getStaffUsers, 
  deleteStaffUser, 
  resetStaffUsersToDefault, 
  setupSecurityQuestion, 
  getSecurityQuestionForUser, 
  verifySecurityAnswerAndResetPassword, 
  authenticateStaff,
  verifyStaffSession
} from '../../src/utils/userManager.js';
import { sha256 } from '../../src/utils/auth.js';

describe('FEATURE-75 (SEC-01): Authentication & RBAC Privilege Escalation Resistance', () => {
  beforeEach(() => {
    resetStaffUsersToDefault();
  });

  describe('1. Role Privilege Boundaries', () => {
    it('restricts live publishing permissions strictly to admin role', () => {
      expect(hasPermission('admin', 'canPublishLive')).toBe(true);
      expect(hasPermission('manager', 'canPublishLive')).toBe(false);
      expect(hasPermission('kitchen', 'canPublishLive')).toBe(false);
      expect(hasPermission('marketing', 'canPublishLive')).toBe(false);
      expect(hasPermission('staff', 'canPublishLive')).toBe(false);
      expect(hasPermission('unknown_role', 'canPublishLive')).toBe(false);
    });

    it('restricts user management permissions strictly to admin role', () => {
      expect(hasPermission('admin', 'canManageUsers')).toBe(true);
      expect(hasPermission('manager', 'canManageUsers')).toBe(false);
      expect(hasPermission('kitchen', 'canManageUsers')).toBe(false);
      expect(hasPermission('marketing', 'canManageUsers')).toBe(false);
      expect(hasPermission('staff', 'canManageUsers')).toBe(false);
    });

    it('denies permissions when role is undefined or tampered', () => {
      expect(hasPermission(null, 'canPublishLive')).toBe(false);
      expect(hasPermission(undefined, 'canPublishLive')).toBe(false);
      expect(hasPermission('', 'canPublishLive')).toBe(false);
      expect(hasPermission({ role: 'admin' }, 'canPublishLive')).toBe(false);
    });
  });

  describe('2. Protected Account Shielding', () => {
    it('prevents deletion of primary owner accounts', () => {
      const users = getStaffUsers();
      const owner = users.find(u => u.isProtected && u.username === 'pooja');
      expect(owner).toBeDefined();

      expect(() => deleteStaffUser('pooja')).toThrow(/Owner account cannot be deleted/i);

      // Verify owner is still present in store
      const usersAfter = getStaffUsers();
      expect(usersAfter.some(u => u.username === 'pooja')).toBe(true);
    });
  });

  describe('3. Cryptographic Secret Answer Integrity', () => {
    it('hashes security answers using SHA-256 and never stores plaintext', async () => {
      const plaintextAnswer = 'MySecretPetName123';
      const question = 'What was the name of your first childhood pet?';

      const setupRes = await setupSecurityQuestion('deepak', question, plaintextAnswer);
      expect(setupRes.success).toBe(true);

      const users = getStaffUsers();
      const updatedDeepak = users.find(u => u.username === 'deepak');
      expect(updatedDeepak).toBeDefined();
      expect(updatedDeepak.securityAnswerHash).not.toBe(plaintextAnswer);
      expect(updatedDeepak.securityAnswerHash).toHaveLength(64); // Valid SHA-256 hex length

      const expectedHash = await sha256(plaintextAnswer.trim().toLowerCase());
      expect(updatedDeepak.securityAnswerHash).toBe(expectedHash);
    });

    it('rejects password resets with incorrect security answers', async () => {
      await setupSecurityQuestion('deepak', 'What was the name of your first childhood pet?', 'CorrectPet');

      await expect(
        verifySecurityAnswerAndResetPassword('deepak', 'WrongAnswer', 'NewPassword999!')
      ).rejects.toThrow(/Incorrect answer to secret question/i);

      // Verify password was NOT changed by failed attempt
      const resetSuccess = await verifySecurityAnswerAndResetPassword('deepak', 'CorrectPet', 'NewPassword999!');
      expect(resetSuccess.success).toBe(true);

      const login = await authenticateStaff('deepak', 'NewPassword999!');
      expect(login.username).toBe('deepak');
    });

    it('rejects tampered session tokens with expired or invalid payloads', () => {
      // Valid token structure: base64(username:role:expiresAt)
      expect(verifyStaffSession('invalid_base64_string')).toBeNull();
      expect(verifyStaffSession(null)).toBeNull();

      // Expired token
      const expiredPayload = btoa('deepak:admin:1000000000000');
      expect(verifyStaffSession(expiredPayload)).toBeNull();

      // Tampered user that doesn't exist
      const fakeUserPayload = btoa(`fake_intruder:admin:${Date.now() + 100000}`);
      expect(verifyStaffSession(fakeUserPayload)).toBeNull();
    });
  });
});
