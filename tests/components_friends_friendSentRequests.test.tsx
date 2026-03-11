import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FriendSentRequests } from '@/components/friends/friendSentRequests'
import { declineFriendRequest } from '@/lib/api/fetch-generated'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  declineFriendRequest: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockSentRequests: any[] = [
  {
    id: 'req-1',
    user: {
      id: 'user-1',
      name: 'John Doe',
      image: null,
    },
  }
]

describe('FriendSentRequests Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sent requests correctly', () => {
    render(<FriendSentRequests requests={mockSentRequests} />)
    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.getByText('Aguardando resposta')).toBeTruthy()
  })

  it('should call declineFriendRequest and toast success when Cancel button is clicked', async () => {
    const mockRefresh = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh: mockRefresh } as any)
    vi.mocked(declineFriendRequest).mockResolvedValue({ status: 204 } as any)
    
    render(<FriendSentRequests requests={mockSentRequests} />)
    
    const cancelButton = screen.getByTitle('Cancelar Pedido')
    fireEvent.click(cancelButton)
    
    expect(declineFriendRequest).toHaveBeenCalledWith('req-1')
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Solicitação cancelada.')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should return null if there are no requests', () => {
    const { container } = render(<FriendSentRequests requests={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
