import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime } from '../dateTimeUtils';

describe('dateTimeUtils', () => {
  it('formats a valid datetime value', () => {
    expect(formatDateTime('2026-09-03T10:15:00.000Z')).toMatch(/^03-09-2026, /);
  });

  it('returns Never for null or invalid datetime values', () => {
    expect(formatDateTime(null)).toBe('Never');
    expect(formatDateTime('not-a-date')).toBe('Never');
  });

  it('formats a valid date value', () => {
    expect(formatDate('2026-09-03T10:15:00.000Z')).toBe('03-09-2026');
  });

  it('returns Never for null or invalid date values', () => {
    expect(formatDate(null)).toBe('Never');
    expect(formatDate('not-a-date')).toBe('Never');
  });
});
