// Data validation utilities for curated accounts
import type { CuratedAccount, ValidationResult, ValidationError } from '../../types/follow-pack';
import { categories } from './categories';

const VALID_NPUB_PREFIX = 'npub1';
const NPUB_LENGTH_MIN = 60;
const NPUB_LENGTH_MAX = 65;
const MAX_BIO_LENGTH = 160;
const MAX_NAME_LENGTH = 50;

export const validateNpub = (npub: string): boolean => {
  if (!npub || typeof npub !== 'string') return false;
  if (!npub.startsWith(VALID_NPUB_PREFIX)) return false;
  if (npub.length < NPUB_LENGTH_MIN || npub.length > NPUB_LENGTH_MAX) return false;
  // Check if contains only valid bech32 characters
  const validChars = /^[023456789acdefghjklmnpqrstuvwxyz]+$/;
  const npubBody = npub.slice(5); // Remove 'npub1' prefix
  return validChars.test(npubBody);
};

export const validateAccount = (account: CuratedAccount, index: number): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!account.npub) {
    errors.push({ field: 'npub', message: 'npub is required', account: account.name });
  } else if (!validateNpub(account.npub)) {
    errors.push({ field: 'npub', message: `Invalid npub format: ${account.npub}`, account: account.name });
  }

  if (!account.name || account.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required', account: account.npub });
  } else if (account.name.length > MAX_NAME_LENGTH) {
    warnings.push({ field: 'name', message: `Name exceeds ${MAX_NAME_LENGTH} characters`, account: account.name });
  }

  if (!account.bio || account.bio.trim() === '') {
    errors.push({ field: 'bio', message: 'Bio is required', account: account.name || account.npub });
  } else if (account.bio.length > MAX_BIO_LENGTH) {
    warnings.push({ field: 'bio', message: `Bio exceeds ${MAX_BIO_LENGTH} characters (${account.bio.length})`, account: account.name });
  }

  if (!account.categories || account.categories.length === 0) {
    errors.push({ field: 'categories', message: 'At least one category is required', account: account.name || account.npub });
  } else {
    const validCategoryIds = categories.map(c => c.id);
    const invalidCategories = account.categories.filter(c => !validCategoryIds.includes(c));
    if (invalidCategories.length > 0) {
      errors.push({ field: 'categories', message: `Invalid categories: ${invalidCategories.join(', ')}`, account: account.name });
    }
  }

  if (!account.tags || account.tags.length === 0) {
    warnings.push({ field: 'tags', message: 'No tags specified', account: account.name });
  }

  // Activity validation
  const validActivities = ['high', 'medium', 'low'];
  if (!account.activity || !validActivities.includes(account.activity)) {
    warnings.push({ field: 'activity', message: `Invalid activity level: ${account.activity}`, account: account.name });
  }

  // Content types validation
  const validContentTypes = ['text', 'image', 'video', 'article', 'audio'];
  if (!account.contentTypes || account.contentTypes.length === 0) {
    warnings.push({ field: 'contentTypes', message: 'No content types specified', account: account.name });
  } else {
    const invalidTypes = account.contentTypes.filter(t => !validContentTypes.includes(t));
    if (invalidTypes.length > 0) {
      warnings.push({ field: 'contentTypes', message: `Invalid content types: ${invalidTypes.join(', ')}`, account: account.name });
    }
  }

  // Followers validation (warnings only)
  if (!account.followers && account.followers !== undefined) {
    warnings.push({ field: 'followers', message: 'Followers count is 0 or undefined', account: account.name });
  }

  // NIP-05 format validation
  if (account.nip05 && !account.nip05.includes('@')) {
    warnings.push({ field: 'nip05', message: `Invalid NIP-05 format: ${account.nip05}`, account: account.name });
  }

  // Website validation
  if (account.website) {
    try {
      new URL(account.website);
    } catch {
      warnings.push({ field: 'website', message: `Invalid website URL: ${account.website}`, account: account.name });
    }
  }

  // Date validation
  if (!account.addedAt) {
    errors.push({ field: 'addedAt', message: 'addedAt date is required', account: account.name });
  }

  if (!account.updatedAt) {
    warnings.push({ field: 'updatedAt', message: 'updatedAt date is missing', account: account.name });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateAllAccounts = (accounts: CuratedAccount[]): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];
  let validCount = 0;

  accounts.forEach((account, index) => {
    const result = validateAccount(account, index);
    if (result.valid) {
      validCount++;
    }
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  // Check for duplicate npubs
  const npubs = accounts.map(a => a.npub);
  const duplicates = npubs.filter((item, index) => npubs.indexOf(item) !== index);
  if (duplicates.length > 0) {
    allErrors.push({
      field: 'duplicate',
      message: `Duplicate npubs found: ${[...new Set(duplicates)].join(', ')}`
    });
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

export const generateReport = (result: ValidationResult): string => {
  let report = '=== Account Validation Report ===\n\n';
  
  report += `Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}\n`;
  report += `Errors: ${result.errors.length}\n`;
  report += `Warnings: ${result.warnings.length}\n\n`;

  if (result.errors.length > 0) {
    report += 'ERRORS:\n';
    result.errors.forEach((error, i) => {
      report += `  ${i + 1}. [${error.field}] ${error.message}`;
      if (error.account) {
        report += ` (Account: ${error.account})`;
      }
      report += '\n';
    });
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += 'WARNINGS:\n';
    result.warnings.forEach((warning, i) => {
      report += `  ${i + 1}. [${warning.field}] ${warning.message}`;
      if (warning.account) {
        report += ` (Account: ${warning.account})`;
      }
      report += '\n';
    });
  }

  return report;
};
