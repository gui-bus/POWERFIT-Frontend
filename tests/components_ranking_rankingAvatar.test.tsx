import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RankingAvatar } from '@/components/ranking/rankingList/rankingAvatar'

describe('RankingAvatar', () => {
  it('should render avatar with correct initials when no image is provided', () => {
    render(<RankingAvatar name="John Doe" isCurrentUser={false} />)
    expect(screen.getByText(/JO/i)).toBeDefined()
  })

  it('should render pulse indicator when isCurrentUser is true', () => {
    const { container } = render(<RankingAvatar name="John Doe" isCurrentUser={true} />)
    const pulseIndicator = container.querySelector('.animate-pulse')
    expect(pulseIndicator).toBeDefined()
  })
})
