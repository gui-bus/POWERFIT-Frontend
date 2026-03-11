import { describe, it, expect } from 'vitest'
import { calculateStreak } from '@/lib/utils/consistency'
import dayjs from 'dayjs'

describe('calculateStreak utility', () => {
  const today = dayjs('2026-03-10')

  it('should return 0 if no workouts are completed', () => {
    const data = {
      '2026-03-10': { workoutDayCompleted: false, workoutDayStarted: false },
      '2026-03-09': { workoutDayCompleted: false, workoutDayStarted: false },
    }
    expect(calculateStreak(data, today)).toBe(0)
  })

  it('should calculate streak including today if completed', () => {
    const data = {
      '2026-03-10': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-09': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-08': { workoutDayCompleted: false, workoutDayStarted: false },
    }
    expect(calculateStreak(data, today)).toBe(2)
  })

  it('should maintain streak if today is not yet completed but yesterday was', () => {
    const data = {
      '2026-03-10': { workoutDayCompleted: false, workoutDayStarted: false },
      '2026-03-09': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-08': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-07': { workoutDayCompleted: false, workoutDayStarted: false },
    }
    expect(calculateStreak(data, today)).toBe(2)
  })

  it('should break streak if a past day is missing', () => {
    const data = {
      '2026-03-10': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-09': { workoutDayCompleted: false, workoutDayStarted: false },
      '2026-03-08': { workoutDayCompleted: true, workoutDayStarted: true },
    }
    expect(calculateStreak(data, today)).toBe(1)
  })

  it('should ignore future dates', () => {
    const data = {
      '2026-03-11': { workoutDayCompleted: true, workoutDayStarted: true },
      '2026-03-10': { workoutDayCompleted: true, workoutDayStarted: true },
    }
    expect(calculateStreak(data, today)).toBe(1)
  })
})
