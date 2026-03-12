import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChallengeCard } from '@/components/gamification/challengeCard'
import { joinChallenge } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  joinChallenge: vi.fn(),
  getChallengeById: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

const mockChallenge = {
  id: '1',
  name: 'Desafio Teste',
  description: 'Descrição do desafio',
  type: 'GLOBAL' as const,
  status: 'ACTIVE' as const,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T00:00:00Z',
  xpReward: 100,
  participantsCount: 10,
  isJoined: false,
  goalType: 'WORKOUT_COUNT' as const,
  goalTarget: 5,
}

describe('ChallengeCard Component', () => {
  it('should render challenge information correctly', () => {
    render(<ChallengeCard challenge={mockChallenge} />)
    
    expect(screen.getByText('Desafio Teste')).toBeTruthy()
    expect(screen.getByText('Descrição do desafio')).toBeTruthy()
    expect(screen.getByText('+100 XP')).toBeTruthy()
    expect(screen.getByText('5 Treinos')).toBeTruthy()
  })

  it('should call joinChallenge when "Participar agora" is clicked', async () => {
    vi.mocked(joinChallenge).mockResolvedValue({ status: 204 } as any)
    
    render(<ChallengeCard challenge={mockChallenge} />)
    const joinButton = screen.getByText('Participar agora')
    
    fireEvent.click(joinButton)
    
    await waitFor(() => {
      expect(joinChallenge).toHaveBeenCalledWith('1')
    })
  })

  it('should show "Inscrito" and "Ver Progresso" when user is already joined', () => {
    const joinedChallenge = { ...mockChallenge, isJoined: true }
    render(<ChallengeCard challenge={joinedChallenge} />)
    
    expect(screen.getByText('Inscrito')).toBeTruthy()
    expect(screen.getByText('Ver Progresso')).toBeTruthy()
  })

  it('should show "Desafio Encerrado" when status is COMPLETED', () => {
    const completedChallenge = { ...mockChallenge, status: 'COMPLETED' as const }
    render(<ChallengeCard challenge={completedChallenge} />)
    
    expect(screen.getByText('Desafio Encerrado')).toBeTruthy()
  })
})
