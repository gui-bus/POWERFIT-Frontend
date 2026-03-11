import { describe, it, expect } from 'vitest'
import { createAnimation } from './themeAnimations'

describe('Theme Animations', () => {
  it('should create animation CSS and name', () => {
    const animation = createAnimation()
    expect(animation.name).toBe('diagonal-wipe')
    expect(animation.css).toContain('::view-transition-old(root)')
    expect(animation.css).toContain('@keyframes diagonal-wipe')
    expect(animation.css).toContain('clip-path: inset(0 100% 0 0);')
  })
})
