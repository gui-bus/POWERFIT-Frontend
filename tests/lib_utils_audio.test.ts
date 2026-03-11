import { describe, it, expect, vi, beforeEach } from 'vitest'
import { playSoftPing } from '@/lib/utils/audio'

describe('Audio Utils', () => {
  let mockOscillator: any;
  let mockGain: any;
  let mockContext: any;

  beforeEach(() => {
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
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockContext = {
      currentTime: 0,
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGain),
      destination: {},
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

  it('should play a sound with correct parameters', () => {
    playSoftPing();

    const instance = mockContext.instance;
    expect(instance.createOscillator).toHaveBeenCalled();
    expect(instance.createGain).toHaveBeenCalled();
    
    expect(mockOscillator.type).toBe('sine');
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(880, 0);
    
    expect(mockGain.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.1, 0.02);
    expect(mockGain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.5);
    
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalledWith(0.6);
  })

  it('should handle missing AudioContext gracefully', () => {
    (global as any).AudioContext = undefined;
    (global as any).webkitAudioContext = undefined;

    expect(() => playSoftPing()).not.toThrow();
  })
})
