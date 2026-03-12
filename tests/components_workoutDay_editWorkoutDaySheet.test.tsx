import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditWorkoutDaySheet } from '@/app/(dashboard)/workout-plans/[planId]/days/[dayId]/_components/editWorkoutDaySheet'
import { updateWorkoutDay } from '@/lib/api/fetch-generated'
import React from 'react'

vi.mock('@/lib/api/fetch-generated', () => ({
  updateWorkoutDay: vi.fn(),
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

const MOCK_WORKOUT_DAY = {
  id: 'day-1',
  name: 'Treino A',
  weekDay: 'MONDAY',
  isRestDay: false,
  estimatedDurationInSeconds: 3600,
  exercises: [
    { id: 'ex-1', name: 'Supino', sets: 4, reps: 10, restTimeInSeconds: 60, order: 0 }
  ],
  sessions: []
} as any

describe('EditWorkoutDaySheet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render and open the sheet', async () => {
    render(<EditWorkoutDaySheet workoutDay={MOCK_WORKOUT_DAY} planId="plan-1" dayId="day-1" />)
    
    const trigger = screen.getByText('Editar Protocolo')
    fireEvent.click(trigger)
    
    expect(screen.getByText('Ajustar Protocolo')).toBeTruthy()
    expect(screen.getByDisplayValue('Treino A')).toBeTruthy()
    expect(screen.getByDisplayValue('Supino')).toBeTruthy()
  })

  it('should add a new exercise field', async () => {
    render(<EditWorkoutDaySheet workoutDay={MOCK_WORKOUT_DAY} planId="plan-1" dayId="day-1" />)
    fireEvent.click(screen.getByText('Editar Protocolo'))
    
    const addBtn = screen.getByText('Adicionar')
    fireEvent.click(addBtn)
    
    const exerciseInputs = screen.getAllByPlaceholderText('Nome do Exercício')
    expect(exerciseInputs.length).toBe(2)
  })

  it('should submit the form with updated values', async () => {
    vi.mocked(updateWorkoutDay).mockResolvedValue({ status: 204, data: {} } as any)
    
    render(<EditWorkoutDaySheet workoutDay={MOCK_WORKOUT_DAY} planId="plan-1" dayId="day-1" />)
    fireEvent.click(screen.getByText('Editar Protocolo'))
    
    const nameInput = screen.getByDisplayValue('Treino A')
    fireEvent.change(nameInput, { target: { value: 'Treino A Atualizado' } })
    
    const submitBtn = screen.getByText('Salvar Protocolo')
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(updateWorkoutDay).toHaveBeenCalledWith(
        'plan-1', 
        'day-1', 
        expect.objectContaining({ name: 'Treino A Atualizado' })
      )
    })
  })
})
