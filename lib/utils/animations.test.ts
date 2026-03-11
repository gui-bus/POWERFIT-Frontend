import { describe, it, expect } from 'vitest'
import { fadeIn, springUp, containerStagger, floatingBadge, pulseGlow } from './animations'

describe('Animation Variants', () => {
  it('fadeIn should have correct properties', () => {
    expect(fadeIn.initial).toEqual({ opacity: 0, y: 20 })
    expect(fadeIn.animate).toEqual({ opacity: 1, y: 0 })
    expect(fadeIn.exit).toEqual({ opacity: 0, y: -20 })
  })

  it('springUp should use spring transition', () => {
    expect(springUp.animate.transition).toMatchObject({
      type: 'spring',
      damping: 12,
      stiffness: 100
    })
  })

  it('containerStagger should have staggerChildren', () => {
    expect(containerStagger.animate.transition).toEqual({
      staggerChildren: 0.15
    })
  })

  it('floatingBadge should have repeat Infinity', () => {
    expect(floatingBadge.animate.transition).toMatchObject({
      repeat: Infinity
    })
  })

  it('pulseGlow should have boxShadow array', () => {
    expect(pulseGlow.animate.boxShadow).toBeInstanceOf(Array)
    expect(pulseGlow.animate.boxShadow).toHaveLength(3)
  })
})
