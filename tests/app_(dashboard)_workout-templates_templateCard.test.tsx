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

// Mock matchMedia for components that use it (Sheet/Drawer)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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
    expect(screen.getByText('Avançado')).toBeTruthy()
  })

  it('should call applyWorkoutTemplate when confirm in AlertDialog', async () => {
    vi.mocked(applyWorkoutTemplate).mockResolvedValue({ status: 201, data: {} } as any)
    
    render(<TemplateCard template={MOCK_TEMPLATE} />)
    
    const applyBtn = screen.getByText('Ativar Plano')
    fireEvent.click(applyBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Alterar Protocolo Ativo')).toBeTruthy()
    })

    const confirmBtn = screen.getByText('Ativar Novo Plano')
    fireEvent.click(confirmBtn)
    
    await waitFor(() => {
      expect(applyWorkoutTemplate).toHaveBeenCalledWith('template-1')
    })
  })

  it('should open details sheet when explore button is clicked', async () => {
    render(<TemplateCard template={MOCK_TEMPLATE} />)
    
    const exploreBtn = screen.getByText('Explorar')
    fireEvent.click(exploreBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Detalhamento do Protocolo')).toBeTruthy()
    })
  })
})
