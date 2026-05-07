import { describe, expect, test } from 'vitest';
import { validateReleaseVersion } from '../scripts/release-version.mjs';

describe('release version helper', () => {
  test('accepts stable versions for stable releases', () => {
    expect(validateReleaseVersion('stable', '1.2.3')).toBe('1.2.3');
  });

  test('accepts beta versions for beta releases', () => {
    expect(validateReleaseVersion('beta', '1.2.3-beta-4')).toBe('1.2.3-beta-4');
  });

  test('rejects beta versions for stable releases', () => {
    expect(() => validateReleaseVersion('stable', '1.2.3-beta-4')).toThrow(
      /stable release/
    );
  });

  test('rejects non-beta versions for beta releases', () => {
    expect(() => validateReleaseVersion('beta', '1.2.3')).toThrow(/beta release/);
  });
});
