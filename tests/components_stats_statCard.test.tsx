import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatCard } from '@/components/stats/statCards/statCard'
import { BarbellIcon } from '@phosphor-icons/react'

describe('StatCard', () => {
  it('should render label and value correctly', () => {
    render(<StatCard label="Volume Total" value="1000kg" icon={BarbellIcon} />)
    expect(screen.getByText('Volume Total')).toBeDefined()
    expect(screen.getByText('1000kg')).toBeDefined()
  })

  it('should render subValue when provided', () => {
    render(<StatCard label="Volume Total" value="1000kg" icon={BarbellIcon} subValue="≈ 5 Carros" />)
    expect(screen.getByText('≈ 5 Carros')).toBeDefined()
  })
})
