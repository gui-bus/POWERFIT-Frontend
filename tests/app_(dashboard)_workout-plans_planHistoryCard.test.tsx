import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlanHistoryCard } from '@/app/(dashboard)/workout-plans/_components/planHistoryCard'
import { activateWorkoutPlan, deleteWorkoutPlan } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  activateWorkoutPlan: vi.fn(),
  deleteWorkoutPlan: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

const MOCK_PLAN_INACTIVE = {
  id: 'plan-1',
  name: 'Plano Antigo',
  isActive: false,
  workoutDays: [
    { id: '1', name: 'Dia 1', weekDay: 'MONDAY', exercises: [] }
  ]
} as any

const MOCK_PLAN_ACTIVE = {
  id: 'plan-2',
  name: 'Plano Atual',
  isActive: true,
  workoutDays: [
    { id: '2', name: 'Dia 1', weekDay: 'MONDAY', exercises: [] }
  ]
} as any

describe('PlanHistoryCard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render plan information', () => {
    render(<PlanHistoryCard plan={MOCK_PLAN_INACTIVE} />)
    
    expect(screen.getByText('Plano Antigo')).toBeTruthy()
    expect(screen.getByText('Reativar')).toBeTruthy()
  })

  it('should show "Ativo" badge if plan is active', () => {
    render(<PlanHistoryCard plan={MOCK_PLAN_ACTIVE} />)
    
    expect(screen.getByText('Ativo')).toBeTruthy()
    expect(screen.getByText('Status: Em Operação')).toBeTruthy()
  })

  it('should call activateWorkoutPlan when confirm activation', async () => {
    vi.mocked(activateWorkoutPlan).mockResolvedValue({ status: 200, data: {} } as any)
    
    render(<PlanHistoryCard plan={MOCK_PLAN_INACTIVE} />)
    
    const activateBtn = screen.getByText('Reativar')
    fireEvent.click(activateBtn)
    
    // Check if dialog opened
    expect(screen.getByText('Retomar Protocolo')).toBeTruthy()
    
    const confirmBtn = screen.getByText('Ativar Agora')
    fireEvent.click(confirmBtn)
    
    await waitFor(() => {
      expect(activateWorkoutPlan).toHaveBeenCalledWith('plan-1')
    })
  })

  it('should call deleteWorkoutPlan when confirm deletion', async () => {
    vi.mocked(deleteWorkoutPlan).mockResolvedValue({ status: 204, data: {} } as any)
    
    render(<PlanHistoryCard plan={MOCK_PLAN_INACTIVE} />)
    
    // Find trash button by its icon container or similar, or just get by role
    const buttons = screen.getAllByRole('button')
    const deleteBtn = buttons[buttons.length - 1] 
    
    fireEvent.click(deleteBtn)
    
    expect(screen.getByText('Remover Definitivamente')).toBeTruthy()
    
    const confirmDeleteBtn = screen.getByText('Sim, Excluir')
    fireEvent.click(confirmDeleteBtn)
    
    await waitFor(() => {
      expect(deleteWorkoutPlan).toHaveBeenCalledWith('plan-1')
    })
  })
})
