import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TemplateCard } from '@/app/(dashboard)/workout-templates/_components/templateCard'
import { applyWorkoutTemplate } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  applyWorkoutTemplate: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const MOCK_TEMPLATE = {
  id: 'template-1',
  name: 'Plano de Hipertrofia',
  description: 'Um plano focado em ganho de massa.',
  category: 'Hipertrofia',
  difficulty: 'ADVANCED',
  imageUrl: null,
  days: [
    { name: 'Dia A', weekDay: 'MONDAY', isRestDay: false, exercises: [], estimatedDurationInSeconds: 3600 }
  ]
} as any

describe('TemplateCard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render template information', () => {
    render(<TemplateCard template={MOCK_TEMPLATE} />)
    
    expect(screen.getByText('Plano de Hipertrofia')).toBeTruthy()
    expect(screen.getByText('Um plano focado em ganho de massa.')).toBeTruthy()
    expect(screen.getByText('Hipertrofia')).toBeTruthy()
    expect(screen.getByText('ADVANCED')).toBeTruthy()
  })

  it('should call applyWorkoutTemplate when apply button is clicked', async () => {
    vi.mocked(applyWorkoutTemplate).mockResolvedValue({ status: 201, data: {} } as any)
    
    render(<TemplateCard template={MOCK_TEMPLATE} />)
    
    // The Plus button is the second one in the card footer's action area usually, 
    // but better to find by icon or sequence.
    // Actually, I'll just use getAllByRole and pick the second one or find by specific selector.
    const buttons = screen.getAllByRole('button')
    const applyBtn = buttons[buttons.length - 1] // The Plus button
    
    fireEvent.click(applyBtn)
    
    await waitFor(() => {
      expect(applyWorkoutTemplate).toHaveBeenCalledWith('template-1')
    })
  })

  it('should open details dialog when eye button is clicked', async () => {
    render(<TemplateCard template={MOCK_TEMPLATE} />)
    
    const buttons = screen.getAllByRole('button')
    const detailsBtn = buttons[buttons.length - 2] // The Eye button
    
    fireEvent.click(detailsBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Detalhes do Protocolo de Treino')).toBeTruthy()
    })
  })
})
