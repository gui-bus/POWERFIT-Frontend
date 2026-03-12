import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChallengeProgressDialog } from '@/components/gamification/challengeProgressDialog'
import { getChallengeById } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  getChallengeById: vi.fn(),
}))

// Mock ResizeObserver for Radix UI
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

const mockChallengeDetail = {
  id: 'challenge-1',
  name: 'Batalha de Treinos',
  goalTarget: 10,
  goalType: 'WORKOUT_COUNT' as const,
  participants: [
    { userId: 'u1', userName: 'Atleta 1', score: 8, hasWon: false },
    { userId: 'u2', userName: 'Atleta 2', score: 5, hasWon: false },
  ]
}

describe('ChallengeProgressDialog Component', () => {
  it('should render the trigger and load progress when clicked', async () => {
    vi.mocked(getChallengeById).mockResolvedValue({ status: 200, data: mockChallengeDetail } as any)
    
    render(<ChallengeProgressDialog challengeId="challenge-1" />)
    const trigger = screen.getByText('Ver Progresso')
    
    fireEvent.click(trigger)
    
    await waitFor(() => {
      expect(getChallengeById).toHaveBeenCalledWith('challenge-1')
      expect(screen.getByText('RANKING ATUAL')).toBeTruthy()
      expect(screen.getByText('Atleta 1')).toBeTruthy()
      expect(screen.getByText('8 / 10')).toBeTruthy()
    })
  })
})
