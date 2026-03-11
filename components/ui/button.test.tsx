import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'
import React from 'react'

describe('Button Component', () => {
  it('should render correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button.className).toContain('bg-primary')
    expect(button.getAttribute('data-variant')).toBe('default')
  })

  it('should apply variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button.className).toContain('bg-destructive')
    expect(button.getAttribute('data-variant')).toBe('destructive')
  })

  it('should apply size classes correctly', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button', { name: /small/i })
    expect(button.className).toContain('h-8')
    expect(button.getAttribute('data-size')).toBe('sm')
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button.className).toContain('custom-class')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.className).toContain('disabled:opacity-50')
  })
})
