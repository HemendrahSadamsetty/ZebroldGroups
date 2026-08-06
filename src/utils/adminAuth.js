/**
 * adminAuth.js
 * Admin Authentication & Multi-Account Credentials Management
 * Handles:
 * - Dual Admin Logins (Master Administrator & Operations Manager)
 * - Persistent session & password state in localStorage
 * - Email-based Password Reset Code (OTP) dispatch and validation
 */
import { sendPasswordResetEmail, generatePasswordResetEmailHtml } from '../services/emailService';

const ACCOUNTS_STORAGE_KEY = 'zebrold_admin_accounts';
const SESSION_STORAGE_KEY = 'zebrold_admin_session';
const RESET_CODES_STORAGE_KEY = 'zebrold_admin_reset_codes';

// Default Accounts Configuration
export const DEFAULT_ADMIN_ACCOUNTS = [
  {
    id: 'admin-master',
    role: 'Master Administrator',
    email: 'hemendrahsadamsetty@gmail.com',
    password: 'admin123#',
    department: 'Executive Board',
    permissions: 'Full CMS Control & System Admin',
    lastLogin: null
  },
  {
    id: 'admin-manager',
    role: 'Operations Manager',
    email: 'admin@zebrold.com',
    password: 'manager123#',
    department: 'Global Operations',
    permissions: 'CMS Editor & Application Manager',
    lastLogin: null
  }
];

/**
 * Retrieve admin accounts from localStorage (falls back to defaults)
 */
export function getAdminAccounts() {
  try {
    const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
      return DEFAULT_ADMIN_ACCOUNTS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length < 2) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
      return DEFAULT_ADMIN_ACCOUNTS;
    }
    // Ensure primary email matches hemendrahsadamsetty@gmail.com
    const hasOwnerEmail = parsed.some(a => a.email.toLowerCase() === 'hemendrahsadamsetty@gmail.com');
    if (!hasOwnerEmail) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
      return DEFAULT_ADMIN_ACCOUNTS;
    }
    return parsed;
  } catch {
    return DEFAULT_ADMIN_ACCOUNTS;
  }
}

/**
 * Save updated accounts list to localStorage
 */
export function saveAdminAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save admin accounts', err);
  }
}

/**
 * Get active session
 */
export function getActiveSession() {
  try {
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

/**
 * Save active session
 */
export function setActiveSession(account) {
  try {
    const session = {
      id: account.id,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      department: account.department,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    // Update last login timestamp on account
    const accounts = getAdminAccounts();
    const updated = accounts.map(a => a.id === account.id ? { ...a, lastLogin: new Date().toISOString() } : a);
    saveAdminAccounts(updated);

    return session;
  } catch (err) {
    console.error('Failed to set active session', err);
    return null;
  }
}

/**
 * Logout
 */
export function logoutAdminSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to logout', err);
  }
}

/**
 * Validate login credentials
 */
export function validateAdminLogin(email, password) {
  const accounts = getAdminAccounts();
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  const targetAccount = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
  if (!targetAccount) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (targetAccount.password !== password) {
    return { success: false, error: 'Incorrect password. Please verify credentials.' };
  }

  const session = setActiveSession(targetAccount);
  return { success: true, account: targetAccount, session };
}

/**
 * Request Password Reset Code via Email
 */
export async function requestPasswordResetCode(email) {
  const accounts = getAdminAccounts();
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
  if (!account) {
    return { success: false, error: 'Account email address not recognized in Admin Console.' };
  }

  // Generate 6-digit OTP code
  const resetCode = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

  // Save code to localStorage
  try {
    const codesStr = localStorage.getItem(RESET_CODES_STORAGE_KEY);
    const codesObj = codesStr ? JSON.parse(codesStr) : {};
    codesObj[normalizedEmail] = {
      code: resetCode,
      expiresAt: expiresAt,
      accountName: account.role
    };
    localStorage.setItem(RESET_CODES_STORAGE_KEY, JSON.stringify(codesObj));
  } catch (err) {
    console.error('Failed to store reset code', err);
  }

  // Dispatch Email Notification
  const emailRes = await sendPasswordResetEmail({
    recipientEmail: account.email,
    accountName: account.role,
    resetCode: resetCode
  });

  return {
    success: true,
    emailSent: emailRes.success,
    resetCode: resetCode, // Returned for instant UI preview/testing helper
    accountName: account.role,
    email: account.email,
    htmlPreview: generatePasswordResetEmailHtml({
      recipientEmail: account.email,
      accountName: account.role,
      resetCode: resetCode
    })
  };
}

/**
 * Verify Reset Code and Update Password
 */
export function updatePasswordWithResetCode(email, code, newPassword) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedCode = (code || '').trim();

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  try {
    const codesStr = localStorage.getItem(RESET_CODES_STORAGE_KEY);
    const codesObj = codesStr ? JSON.parse(codesStr) : {};
    const record = codesObj[normalizedEmail];

    if (!record) {
      return { success: false, error: 'No active reset request found for this email. Request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      delete codesObj[normalizedEmail];
      localStorage.setItem(RESET_CODES_STORAGE_KEY, JSON.stringify(codesObj));
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    if (record.code !== trimmedCode) {
      return { success: false, error: 'Invalid 6-digit verification code. Please check and retry.' };
    }

    // Update account password
    const accounts = getAdminAccounts();
    const updatedAccounts = accounts.map(a => {
      if (a.email.toLowerCase() === normalizedEmail) {
        return { ...a, password: newPassword };
      }
      return a;
    });

    saveAdminAccounts(updatedAccounts);

    // Clean up reset code
    delete codesObj[normalizedEmail];
    localStorage.setItem(RESET_CODES_STORAGE_KEY, JSON.stringify(codesObj));

    // Automatically log in user
    const updatedAccount = updatedAccounts.find(a => a.email.toLowerCase() === normalizedEmail);
    const session = setActiveSession(updatedAccount);

    return {
      success: true,
      message: `Password successfully updated for ${updatedAccount.role}.`,
      session,
      account: updatedAccount
    };
  } catch (err) {
    console.error('Failed to reset password', err);
    return { success: false, error: 'An unexpected error occurred during password update.' };
  }
}

/**
 * Directly change password for logged-in user or by email
 */
export function changeAdminPassword(email, oldPassword, newPassword) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const accounts = getAdminAccounts();
  
  const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
  if (!account) {
    return { success: false, error: 'Account not found.' };
  }

  if (account.password !== oldPassword) {
    return { success: false, error: 'Current password does not match.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const updatedAccounts = accounts.map(a => {
    if (a.email.toLowerCase() === normalizedEmail) {
      return { ...a, password: newPassword };
    }
    return a;
  });

  saveAdminAccounts(updatedAccounts);

  return { success: true, message: `Password updated for ${account.role}.` };
}
