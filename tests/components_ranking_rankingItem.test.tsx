import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RankingItem } from '@/components/ranking/rankingList/rankingItem'

const mockItem = {
  id: '1',
  name: 'John Doe',
  level: 5,
  xp: 5000,
  streak: 10,
  image: null,
}

describe('RankingItem', () => {
  it('should render correct name and position', () => {
    render(<RankingItem item={mockItem} position={4} type="XP" isCurrentUser={false} />)
    expect(screen.getByText('John Doe')).toBeDefined()
    expect(screen.getByText('4º')).toBeDefined()
  })

  it('should render XP value when type is XP', () => {
    render(<RankingItem item={mockItem} position={4} type="XP" isCurrentUser={false} />)
    expect(screen.getByText('5000')).toBeDefined()
  })

  it('should render streak value when type is STREAK', () => {
    render(<RankingItem item={mockItem} position={4} type="STREAK" isCurrentUser={false} />)
    expect(screen.getByText('10')).toBeDefined()
  })

  it('should render "Você" badge when isCurrentUser is true', () => {
    render(<RankingItem item={mockItem} position={4} type="XP" isCurrentUser={true} />)
    expect(screen.getByText('Você')).toBeDefined()
  })
})
