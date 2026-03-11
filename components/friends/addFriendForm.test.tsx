import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AddFriendForm } from './addFriendForm'
import { addFriend } from '@/lib/api/fetch-generated'
import React from 'react'

// Mock addFriend
vi.mock('@/lib/api/fetch-generated', () => ({
  addFriend: vi.fn(),
}))

describe('AddFriendForm Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock clipboard
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should render the friend code', () => {
    render(<AddFriendForm myFriendCode="ABC-123" />)
    expect(screen.getByText('ABC-123')).toBeTruthy()
  })

  it('should copy code to clipboard when copy button is clicked', async () => {
    render(<AddFriendForm myFriendCode="ABC-123" />)
    const copyButton = screen.getByTitle('Copiar Código')
    
    fireEvent.click(copyButton)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC-123')
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
  })

  it('should show success message on successful form submission', async () => {
    vi.useRealTimers()
    vi.mocked(addFriend).mockResolvedValue({ status: 200 } as any)
    render(<AddFriendForm myFriendCode="ABC-123" />)
    
    const input = screen.getByPlaceholderText('Código ou E-mail')
    const submitButton = screen.getByText('Enviar Pedido')
    
    fireEvent.change(input, { target: { value: 'friend@test.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Pedido enviado!')).toBeTruthy()
    }, { timeout: 2000 })
    
    expect(addFriend).toHaveBeenCalledWith({ codeOrEmail: 'friend@test.com' })
  })

  it('should show error message on failed form submission', async () => {
    vi.useRealTimers()
    vi.mocked(addFriend).mockResolvedValue({ 
      status: 400, 
      data: { error: 'Usuário não encontrado' } 
    } as any)
    
    render(<AddFriendForm myFriendCode="ABC-123" />)
    
    const input = screen.getByPlaceholderText('Código ou E-mail')
    const submitButton = screen.getByText('Enviar Pedido')
    
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Usuário não encontrado')).toBeTruthy()
    }, { timeout: 2000 })
  })
})
