import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FriendRequests } from '@/components/friends/friendRequests'
import { acceptFriendRequest, declineFriendRequest } from '@/lib/api/fetch-generated'
import { useRouter } from 'next/navigation'
import React from 'react'


vi.mock('@/lib/api/fetch-generated', () => ({
  acceptFriendRequest: vi.fn(),
  declineFriendRequest: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

const mockRequests: any[] = [
  {
    id: 'req-1',
    user: {
      id: 'user-1',
      name: 'John Doe',
      image: null,
    },
  },
  {
    id: 'req-2',
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      image: 'jane.jpg',
    },
  }
]

describe('FriendRequests Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render multiple requests correctly', () => {
    render(<FriendRequests requests={mockRequests} />)
    
    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.getByText('Jane Smith')).toBeTruthy()
    expect(screen.getAllByText('Quer se conectar')).toHaveLength(2)
  })

  it('should call acceptFriendRequest when Accept button is clicked', async () => {
    const mockRefresh = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh: mockRefresh } as any)
    vi.mocked(acceptFriendRequest).mockResolvedValue({ status: 204 } as any)
    
    render(<FriendRequests requests={[mockRequests[0]]} />)
    
    const acceptButton = screen.getByText('Aceitar')
    fireEvent.click(acceptButton)
    
    expect(acceptFriendRequest).toHaveBeenCalledWith('req-1')
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should call declineFriendRequest when Decline button is clicked', async () => {
    const mockRefresh = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh: mockRefresh } as any)
    vi.mocked(declineFriendRequest).mockResolvedValue({ status: 204 } as any)
    
    render(<FriendRequests requests={[mockRequests[0]]} />)
    
    const declineButton = screen.getByText('Recusar')
    fireEvent.click(declineButton)
    
    expect(declineFriendRequest).toHaveBeenCalledWith('req-1')
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should return null if there are no requests', () => {
    const { container } = render(<FriendRequests requests={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
