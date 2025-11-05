import { PasswordRequirements } from "@/lib/password-config";

/**
 * Password Requirements Configuration
 *
 * Customize these settings to match your security requirements.
 * All changes will automatically apply to registration and password reset forms.
 */
export const passwordConfig: PasswordRequirements = {
  // Basic length requirements
  minLength: 4, // Minimum password length
  //maxLength: 128,            // Maximum password length (optional)

  // Character type requirements
  requireUppercase: false, // Require at least one uppercase letter (A-Z)
  requireLowercase: false, // Require at least one lowercase letter (a-z)
  requireNumbers: false, // Require at least one number (0-9)
  requireSpecialChars: false, // Require at least one special character

  // Allowed special characters (when requireSpecialChars is true)
  specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",

  // Forbidden patterns (common weak passwords)
  forbiddenPatterns: [
    "123456",
    "password",
    "qwerty",
    "abc123",
    "111111",
    "000000",
    "654321",
    "123123",
  ],

  // Forbidden words (case insensitive)
  forbiddenWords: [
    "password",
    "admin",
    "user",
    "login",
    "welcome",
    "guest",
    "demo",
  ],
};

/**
 * Alternative preset configurations you can use:
 *
 * BASIC - Minimal requirements for less restrictive environments
 * export const passwordConfig: PasswordRequirements = {
 *   minLength: 6,
 *   requireUppercase: false,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: false
 * }
 *
 * STRICT - High security requirements for sensitive applications
 * export const passwordConfig: PasswordRequirements = {
 *   minLength: 12,
 *   maxLength: 256,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true,
 *   specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?~`",
 *   forbiddenPatterns: [
 *     "123456", "password", "qwerty", "abc123", "111111", "000000",
 *     "654321", "123123", "dragon", "master", "monkey", "letmein"
 *   ],
 *   forbiddenWords: [
 *     "password", "admin", "user", "login", "welcome", "guest", "test",
 *     "demo", "secret", "root", "system", "database", "server"
 *   ]
 * }
 */
