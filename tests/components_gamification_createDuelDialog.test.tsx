import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateDuelDialog } from '@/components/gamification/createDuelDialog'
import { createChallenge } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  createChallenge: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

// Mock ResizeObserver for Radix UI
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

const mockFriend = {
  id: 'friend-1',
  name: 'Amigo Teste',
}

describe('CreateDuelDialog Component', () => {
  it('should render the trigger button', () => {
    render(<CreateDuelDialog friend={mockFriend} />)
    expect(screen.getByTitle('Desafiar para Duelo')).toBeTruthy()
  })

  it('should open the dialog and show friend name when clicked', async () => {
    render(<CreateDuelDialog friend={mockFriend} />)
    const trigger = screen.getByTitle('Desafiar para Duelo')
    
    fireEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('NOVO DUELO')).toBeTruthy()
      expect(screen.getByText('Desafiar Amigo Teste')).toBeTruthy()
    })
  })

  it('should submit the form correctly', async () => {
    vi.mocked(createChallenge).mockResolvedValue({ status: 201 } as any)
    
    render(<CreateDuelDialog friend={mockFriend} />)
    fireEvent.click(screen.getByTitle('Desafiar para Duelo'))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Desafio/i)).toBeTruthy()
    })

    const nameInput = screen.getByLabelText(/Nome do Desafio/i)
    const descriptionInput = screen.getByLabelText(/Objetivo/i)
    const submitButton = screen.getByText('LANÇAR DESAFIO')

    fireEvent.change(nameInput, { target: { value: 'Duelo de Gigantes' } })
    fireEvent.change(descriptionInput, { target: { value: 'Bora treinar pesado' } })
    
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createChallenge).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Duelo de Gigantes',
        description: 'Bora treinar pesado',
        opponentId: 'friend-1',
      }))
    })
  })
})
