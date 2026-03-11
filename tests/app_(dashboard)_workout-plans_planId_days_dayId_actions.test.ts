import { describe, it, expect, vi, beforeEach } from 'vitest'
import { startWorkoutAction, completeWorkoutAction } from '@/app/(dashboard)/workout-plans/[planId]/days/[dayId]/actions'
import { startWorkoutSession, completeWorkoutSession } from '@/lib/api/fetch-generated'
import { revalidatePath } from 'next/cache'


vi.mock('@/lib/api/fetch-generated', () => ({
  startWorkoutSession: vi.fn(),
  completeWorkoutSession: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Workout Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('startWorkoutAction', () => {
    it('should revalidate paths on success', async () => {
      vi.mocked(startWorkoutSession).mockResolvedValue({ status: 201, data: { id: 'session-1' } } as any)
      
      const result = await startWorkoutAction('plan-1', 'day-1')
      
      expect(startWorkoutSession).toHaveBeenCalledWith('plan-1', 'day-1')
      expect(revalidatePath).toHaveBeenCalledWith('/workout-plans/plan-1/days/day-1')
      expect(revalidatePath).toHaveBeenCalledWith('/')
      expect(result).toEqual({ status: 201, data: { id: 'session-1' } })
    })

    it('should not revalidate paths on error', async () => {
      vi.mocked(startWorkoutSession).mockResolvedValue({ error: 'Failed' } as any)
      
      await startWorkoutAction('plan-1', 'day-1')
      
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('completeWorkoutAction', () => {
    it('should revalidate paths on success', async () => {
      const mockBody = { statusMessage: 'Great workout!' }
      vi.mocked(completeWorkoutSession).mockResolvedValue({ status: 204 } as any)
      
      const result = await completeWorkoutAction('plan-1', 'day-1', 'session-1', mockBody)
      
      expect(completeWorkoutSession).toHaveBeenCalledWith('plan-1', 'day-1', 'session-1', mockBody)
      expect(revalidatePath).toHaveBeenCalledWith('/workout-plans/plan-1/days/day-1')
      expect(revalidatePath).toHaveBeenCalledWith('/')
      expect(revalidatePath).toHaveBeenCalledWith('/feed')
      expect(result).toEqual({ status: 204 })
    })

    it('should not revalidate paths on error', async () => {
      vi.mocked(completeWorkoutSession).mockResolvedValue({ error: 'Failed' } as any)
      
      await completeWorkoutAction('plan-1', 'day-1', 'session-1')
      
      expect(revalidatePath).not.toHaveBeenCalled()
    })
  })
})
