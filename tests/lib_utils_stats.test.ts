import { describe, it, expect } from 'vitest'
import { formatTime, formatVolume, getVolumeComparison } from '@/lib/utils/stats'

describe('Stats Utils', () => {
  describe('formatTime', () => {
    it('should format seconds to minutes only if less than an hour', () => {
      expect(formatTime(300)).toBe('5m')
      expect(formatTime(3540)).toBe('59m')
    })

    it('should format seconds to hours and minutes', () => {
      expect(formatTime(3660)).toBe('1h1m')
      expect(formatTime(7200)).toBe('2h')
      expect(formatTime(7320)).toBe('2h2m')
    })
  })

  describe('formatVolume', () => {
    it('should format grams to kg', () => {
      expect(formatVolume(5000)).toBe('5kg')
      expect(formatVolume(500)).toBe('1kg')
      expect(formatVolume(0)).toBe('0kg')
    })

    it('should format large grams to tons', () => {
      expect(formatVolume(1000000)).toBe('1.0t')
      expect(formatVolume(2500000)).toBe('2.5t')
    })
  })

  describe('getVolumeComparison', () => {
    it('should return correct comparisons for different weights', () => {
      expect(getVolumeComparison(5000 * 1000)).toBe('≈ 1.0 Elefantes')
      expect(getVolumeComparison(1200 * 1000)).toBe('≈ 1.0 Carros')
      expect(getVolumeComparison(500 * 1000)).toBe('≈ 25 Sacos de Cimento')
      expect(getVolumeComparison(100 * 1000)).toBe('≈ 20 Galões de Água')
      expect(getVolumeComparison(50 * 1000)).toBe('Rumo ao topo! 🚀')
    })
  })
})
