import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { RestTimer } from './restTimer'
import React from 'react'

// Mock createPortal to render content inline
vi.mock('react-dom', () => ({
  createPortal: (node: React.ReactNode) => node,
}))

describe('RestTimer Component', () => {
  let mockOscillator: any;
  let mockGain: any;
  let mockContext: any;

  beforeEach(() => {
    vi.useFakeTimers()
    
    // Mock navigator.vibrate
    vi.stubGlobal('navigator', {
      vibrate: vi.fn(),
    })

    mockOscillator = {
      type: '',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    let lastInstance: any;
    (global as any).AudioContext = class {
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => mockOscillator);
      createGain = vi.fn(() => mockGain);
      constructor() {
        lastInstance = this;
      }
    };
    (global as any).webkitAudioContext = (global as any).AudioContext;

    mockContext = {
      get instance() { return lastInstance; }
    };
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should render initial time correctly', () => {
    render(<RestTimer initialSeconds={60} />)
    
    // Advance 0 timer for mounted state
    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(screen.getByText('01:00')).toBeTruthy()
  })

  it('should countdown every second', () => {
    render(<RestTimer initialSeconds={60} />)
    
    act(() => {
      vi.advanceTimersByTime(1) // mount
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('00:59')).toBeTruthy()
  })

  it('should add time when buttons are clicked', () => {
    render(<RestTimer initialSeconds={60} />)
    
    act(() => {
      vi.advanceTimersByTime(1) // mount
    })

    fireEvent.click(screen.getByText('+15s'))
    expect(screen.getByText('01:15')).toBeTruthy()

    fireEvent.click(screen.getByText('+30s'))
    expect(screen.getByText('01:45')).toBeTruthy()
  })

  it('should play sound and vibrate during last 5 seconds', () => {
    render(<RestTimer initialSeconds={6} />)
    
    act(() => {
      vi.advanceTimersByTime(1) // mount
    })

    act(() => {
      vi.advanceTimersByTime(1000) // 5 seconds left
    })

    const instance = mockContext.instance;
    expect(instance.createOscillator).toHaveBeenCalled()
    expect(navigator.vibrate).toHaveBeenCalledWith(50)
  })

  it('should call onFinish when time reaches zero', () => {
    const onFinish = vi.fn()
    render(<RestTimer initialSeconds={1} onFinish={onFinish} />)
    
    act(() => {
      vi.advanceTimersByTime(1) // mount
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('00:00')).toBeTruthy()
    expect(onFinish).toHaveBeenCalled()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<RestTimer initialSeconds={60} onClose={onClose} />)
    
    act(() => {
      vi.advanceTimersByTime(1) // mount
    })

    const closeButton = screen.getAllByRole('button').find(b => 
       b.querySelector('svg')?.classList.contains('ph-x')
    )
    
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(onClose).toHaveBeenCalled()
    }
  })
})
