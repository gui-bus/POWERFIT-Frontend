import { describe, it, expect } from 'vitest'
import { checkIsPersonalRecord, gramsToKg } from './workout'

describe('Workout Utils', () => {
  describe('checkIsPersonalRecord', () => {
    it('should return true if current weight is higher than any historical weight', () => {
      expect(checkIsPersonalRecord(100, [50, 80, 90])).toBe(true)
    })

    it('should return false if current weight is lower or equal to best historical weight', () => {
      expect(checkIsPersonalRecord(90, [50, 80, 100])).toBe(false)
      expect(checkIsPersonalRecord(100, [50, 80, 100])).toBe(false)
    })

    it('should return false if history is empty', () => {
      expect(checkIsPersonalRecord(100, [])).toBe(false)
    })

    it('should return false if current weight is 0 or negative', () => {
      expect(checkIsPersonalRecord(0, [50, 80])).toBe(false)
      expect(checkIsPersonalRecord(-10, [50, 80])).toBe(false)
    })
  })

  describe('gramsToKg', () => {
    it('should convert grams to kg string correctly', () => {
      expect(gramsToKg(5000)).toBe('5')
      expect(gramsToKg(10500)).toBe('10.5')
    })

    it('should return empty string for 0 or falsy values', () => {
      expect(gramsToKg(0)).toBe('')
      expect(gramsToKg(null as any)).toBe('')
    })
  })
})
