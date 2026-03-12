import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WaterTracker } from '@/components/waterTracker/waterTracker'
import { getWaterHistory, logWater } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  getWaterHistory: vi.fn(),
  logWater: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('WaterTracker Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getWaterHistory).mockResolvedValue({
      status: 200,
      data: { totalInMl: 1000, logs: [] }
    } as any)
  })

  it('should render the current water intake', async () => {
    render(<WaterTracker />)
    
    await waitFor(() => {
      expect(screen.getByText('1000')).toBeTruthy()
    })
    expect(screen.getByText('Hidratação')).toBeTruthy()
  })

  it('should log water when a quick add button is clicked', async () => {
    vi.mocked(logWater).mockResolvedValue({ status: 201, data: {} } as any)
    
    render(<WaterTracker />)
    
    const add250Btn = screen.getByText('250ml')
    fireEvent.click(add250Btn)
    
    await waitFor(() => {
      expect(logWater).toHaveBeenCalledWith({ amountInMl: 250 })
    })
  })

  it('should show today logs in the dialog', async () => {
    vi.mocked(getWaterHistory).mockResolvedValue({
      status: 200,
      data: { 
        totalInMl: 500, 
        logs: [
          { id: '1', amountInMl: 500, loggedAt: new Date().toISOString() }
        ] 
      }
    } as any)

    render(<WaterTracker />)
    
    const historyBtn = screen.getByText('Histórico')
    fireEvent.click(historyBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Histórico de Hoje')).toBeTruthy()
      expect(screen.getByText('500ml')).toBeTruthy()
    })
  })
})
