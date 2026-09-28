/**
 * Locale Key Validation Script
 *
 * Validates that English and Bangla locale files have matching key structures.
 * Run with: npx tsx src/app/i18n/validateLocales.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ValidationResult {
  file: string;
  missingInBn: string[];
  missingInEn: string[];
  extraInBn: string[];
  extraInEn: string[];
}

const LOCALE_DIR = path.join(__dirname, '../locales');
const EN_DIR = path.join(LOCALE_DIR, 'en');
const BN_DIR = path.join(LOCALE_DIR, 'bn');

/**
 * Recursively extracts all keys from a nested object
 */
function extractKeys(obj: any, prefix: string = ''): string[] {
  const keys: string[] = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...extractKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys.sort();
}

/**
 * Validates a single locale file pair (EN + BN)
 */
function validateLocaleFile(filename: string): ValidationResult {
  const enPath = path.join(EN_DIR, filename);
  const bnPath = path.join(BN_DIR, filename);

  const result: ValidationResult = {
    file: filename,
    missingInBn: [],
    missingInEn: [],
    extraInBn: [],
    extraInEn: [],
  };

  // Check if both files exist
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Missing EN file: ${filename}`);
    return result;
  }

  if (!fs.existsSync(bnPath)) {
    console.error(`❌ Missing BN file: ${filename}`);
    return result;
  }

  // Load and parse JSON files
  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const bnContent = JSON.parse(fs.readFileSync(bnPath, 'utf-8'));

  // Extract all keys
  const enKeys = extractKeys(enContent);
  const bnKeys = extractKeys(bnContent);

  // Find missing keys
  result.missingInBn = enKeys.filter(key => !bnKeys.includes(key));
  result.missingInEn = bnKeys.filter(key => !enKeys.includes(key));

  // Find extra keys (should be same as missing on other side)
  result.extraInBn = result.missingInEn;
  result.extraInEn = result.missingInBn;

  return result;
}

/**
 * Main validation function
 */
function validateAllLocales() {
  console.log('🔍 Validating locale files...\n');

  // Get all EN locale files
  const enFiles = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.json'));
  const bnFiles = fs.readdirSync(BN_DIR).filter(f => f.endsWith('.json'));

  // Check for missing files
  const missingBnFiles = enFiles.filter(f => !bnFiles.includes(f));
  const extraBnFiles = bnFiles.filter(f => !enFiles.includes(f));

  if (missingBnFiles.length > 0) {
    console.log('❌ Missing BN locale files:');
    missingBnFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  if (extraBnFiles.length > 0) {
    console.log('⚠️  Extra BN locale files (not in EN):');
    extraBnFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  // Validate each file pair
  const results: ValidationResult[] = [];
  let totalErrors = 0;

  for (const filename of enFiles) {
    const result = validateLocaleFile(filename);
    results.push(result);

    const hasErrors = result.missingInBn.length > 0 || result.missingInEn.length > 0;

    if (hasErrors) {
      totalErrors++;
      console.log(`❌ ${filename}:`);

      if (result.missingInBn.length > 0) {
        console.log(`   Missing in BN (${result.missingInBn.length}):`);
        result.missingInBn.slice(0, 5).forEach(key => console.log(`     - ${key}`));
        if (result.missingInBn.length > 5) {
          console.log(`     ... and ${result.missingInBn.length - 5} more`);
        }
      }

      if (result.missingInEn.length > 0) {
        console.log(`   Missing in EN (${result.missingInEn.length}):`);
        result.missingInEn.slice(0, 5).forEach(key => console.log(`     - ${key}`));
        if (result.missingInEn.length > 5) {
          console.log(`     ... and ${result.missingInEn.length - 5} more`);
        }
      }

      console.log('');
    } else {
      console.log(`✅ ${filename}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total locale files: ${enFiles.length}`);
  console.log(`Files with errors: ${totalErrors}`);
  console.log(`Files without errors: ${enFiles.length - totalErrors}`);

  if (totalErrors === 0) {
    console.log('\n✅ All locale files are valid! EN and BN keys match perfectly.');
  } else {
    console.log(`\n❌ Found ${totalErrors} file(s) with missing or extra keys.`);
    console.log('Please fix the key mismatches before proceeding.');
  }

  // Return exit code
  process.exit(totalErrors > 0 ? 1 : 0);
}

// Run validation
validateAllLocales();
