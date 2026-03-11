import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StreakBanner } from '@/components/consistency/streakBanner'

describe('StreakBanner', () => {
  it('should render correct streak count', () => {
    render(<StreakBanner streak={5} />)
    expect(screen.getByText('5 Dias')).toBeDefined()
  })

  it('should render singular "Dia" for streak of 1', () => {
    render(<StreakBanner streak={1} />)
    expect(screen.getByText('1 Dia')).toBeDefined()
  })

  it('should render all 5 goal dots as active when streak is 5', () => {
    const { container } = render(<StreakBanner streak={5} />)
    const activeDots = container.querySelectorAll('.bg-primary')
    // One for the icon background + 5 for the goal dots = 6
    expect(activeDots.length).toBe(6)
  })
})
