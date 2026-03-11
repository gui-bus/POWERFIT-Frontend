import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeTime, formatDisplayDate, WEEKDAY_TRANSLATIONS, WEEKDAYS_LABELS } from '@/lib/utils/date'
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

  describe('WEEKDAY_TRANSLATIONS', () => {
    it('should have correct translations for each day', () => {
      expect(WEEKDAY_TRANSLATIONS.MONDAY).toBe('Segunda-feira')
      expect(WEEKDAY_TRANSLATIONS.TUESDAY).toBe('Terça-feira')
      expect(WEEKDAY_TRANSLATIONS.WEDNESDAY).toBe('Quarta-feira')
      expect(WEEKDAY_TRANSLATIONS.THURSDAY).toBe('Quinta-feira')
      expect(WEEKDAY_TRANSLATIONS.FRIDAY).toBe('Sexta-feira')
      expect(WEEKDAY_TRANSLATIONS.SATURDAY).toBe('Sábado')
      expect(WEEKDAY_TRANSLATIONS.SUNDAY).toBe('Domingo')
    })
  })

  describe('WEEKDAYS_LABELS', () => {
    it('should have 7 labels starting with S (Segunda)', () => {
      expect(WEEKDAYS_LABELS).toHaveLength(7)
      expect(WEEKDAYS_LABELS[0]).toBe('S') // Segunda
      expect(WEEKDAYS_LABELS[1]).toBe('T') // Terça
      expect(WEEKDAYS_LABELS[2]).toBe('Q') // Quarta
      expect(WEEKDAYS_LABELS[3]).toBe('Q') // Quinta
      expect(WEEKDAYS_LABELS[4]).toBe('S') // Sexta
      expect(WEEKDAYS_LABELS[5]).toBe('S') // Sábado
      expect(WEEKDAYS_LABELS[6]).toBe('D') // Domingo
    })
  })
})
