export interface PasswordRequirements {
  minLength: number;
  maxLength?: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars?: string;
  forbiddenPatterns?: string[];
  forbiddenWords?: string[];
}

export const defaultPasswordRequirements: PasswordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  forbiddenPatterns: [
    "123456",
    "password",
    "qwerty",
    "abc123",
    "111111",
    "000000",
  ],
  forbiddenWords: ["password", "admin", "user", "login", "welcome"],
};

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number;
}

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;

  // Length scoring (0-30 points)
  if (password.length >= 6) score += 10;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;

  // Character variety scoring (0-40 points)
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/[0-9]/.test(password)) score += 10; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 10; // special chars

  // Complexity bonus (0-20 points)
  const varietyCount = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (varietyCount >= 3) score += 10;
  if (varietyCount === 4) score += 10;

  // Entropy bonus for longer passwords (0-10 points)
  if (password.length >= 20) score += 5;
  if (password.length >= 24) score += 5;

  // Penalty for common patterns (-20 points max)
  const commonPatterns = [
    "123456",
    "password",
    "qwerty",
    "abc123",
    "111111",
    "000000",
  ];
  const lowerPassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      score -= 20;
      break;
    }
  }

  // Penalty for common words (-15 points max)
  const commonWords = ["password", "admin", "user", "login", "welcome"];
  for (const word of commonWords) {
    if (lowerPassword.includes(word)) {
      score -= 15;
      break;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function validatePassword(
  password: string,
  requirements: PasswordRequirements = defaultPasswordRequirements
): PasswordValidationResult {
  const errors: string[] = [];

  // Length checks
  if (password.length < requirements.minLength) {
    errors.push(
      `Password must be at least ${requirements.minLength} characters long`
    );
  }

  if (requirements.maxLength && password.length > requirements.maxLength) {
    errors.push(
      `Password must be no more than ${requirements.maxLength} characters long`
    );
  }

  // Character requirements
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (requirements.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (requirements.requireSpecialChars) {
    const specialChars =
      requirements.specialChars || "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const specialCharRegex = new RegExp(
      `[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`
    );
    if (!specialCharRegex.test(password)) {
      errors.push(
        `Password must contain at least one special character (${specialChars})`
      );
    }
  }

  // Forbidden patterns check
  if (requirements.forbiddenPatterns) {
    const lowerPassword = password.toLowerCase();
    for (const pattern of requirements.forbiddenPatterns) {
      if (lowerPassword.includes(pattern.toLowerCase())) {
        errors.push(
          `Password cannot contain common patterns like "${pattern}"`
        );
        break;
      }
    }
  }

  // Forbidden words check
  if (requirements.forbiddenWords) {
    const lowerPassword = password.toLowerCase();
    for (const word of requirements.forbiddenWords) {
      if (lowerPassword.includes(word.toLowerCase())) {
        errors.push(`Password cannot contain common words like "${word}"`);
        break;
      }
    }
  }

  // Use independent strength calculation
  const score = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    score,
  };
}

export function getPasswordStrengthLabel(score: number): string {
  if (score < 30) return "Very Weak";
  if (score < 50) return "Weak";
  if (score < 70) return "Fair";
  if (score < 85) return "Good";
  return "Strong";
}

export function getPasswordRequirementsText(
  requirements: PasswordRequirements
): string[] {
  const texts: string[] = [];

  texts.push(`At least ${requirements.minLength} characters long`);

  if (requirements.maxLength) {
    texts.push(`No more than ${requirements.maxLength} characters`);
  }

  if (requirements.requireUppercase) {
    texts.push("At least one uppercase letter (A-Z)");
  }

  if (requirements.requireLowercase) {
    texts.push("At least one lowercase letter (a-z)");
  }

  if (requirements.requireNumbers) {
    texts.push("At least one number (0-9)");
  }

  if (requirements.requireSpecialChars) {
    const chars = requirements.specialChars || "!@#$%^&*()_+-=[]{}|;:,.<>?";
    texts.push(`At least one special character (${chars})`);
  }

  return texts;
}
