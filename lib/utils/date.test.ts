import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeTime, formatDisplayDate } from './date'
import dayjs from 'dayjs'

describe('Date Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatRelativeTime', () => {
    it('should format a recent date as "há poucos segundos"', () => {
      const recentDate = dayjs().subtract(5, 'seconds').toISOString()
      expect(formatRelativeTime(recentDate)).toBe('há poucos segundos')
    })

    it('should format a date from 2 hours ago correctly', () => {
      const pastDate = dayjs().subtract(2, 'hours').toISOString()
      expect(formatRelativeTime(pastDate)).toBe('há 2 horas')
    })

    it('should format a date from 3 days ago correctly', () => {
      const pastDate = dayjs().subtract(3, 'days').toISOString()
      expect(formatRelativeTime(pastDate)).toBe('há 3 dias')
    })

    it('should return empty string for empty input', () => {
      expect(formatRelativeTime('')).toBe('')
    })
  })

  describe('formatDisplayDate', () => {
    it('should format date to DD/MM/YYYY', () => {
      expect(formatDisplayDate('2026-03-10')).toBe('10/03/2026')
    })

    it('should return empty string for empty input', () => {
      expect(formatDisplayDate('')).toBe('')
    })
  })
})
