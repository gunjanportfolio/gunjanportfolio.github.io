import { afterEach, describe, expect, it, vi } from "vitest";

import {
  INTERIOR_TRANSITION_SOUND,
  playInteriorTransitionSound,
  resetInteriorTransitionAudioForTests,
} from "./interiorTransitionAudio";

function createMockAudioContext({ state = "running" } = {}) {
  const gainNodes = [];
  const oscillators = [];
  const bufferSources = [];
  const filters = [];

  const audioContext = {
    state,
    currentTime: 10,
    sampleRate: 44100,
    destination: { connect: vi.fn() },
    resume: vi.fn(() => Promise.resolve()),
    createGain: vi.fn(() => {
      const gainNode = {
        gain: {
          value: 1,
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      gainNodes.push(gainNode);
      return gainNode;
    }),
    createOscillator: vi.fn(() => {
      const oscillator = {
        type: "sine",
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillators.push(oscillator);
      return oscillator;
    }),
    createBiquadFilter: vi.fn(() => {
      const filterNode = {
        type: "lowpass",
        Q: { value: 1 },
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      filters.push(filterNode);
      return filterNode;
    }),
    createBuffer: vi.fn((channels, length, sampleRate) => ({
      channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    })),
    createBufferSource: vi.fn(() => {
      const source = {
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      bufferSources.push(source);
      return source;
    }),
  };

  return { audioContext, gainNodes, oscillators, bufferSources, filters };
}

afterEach(() => {
  resetInteriorTransitionAudioForTests();
});

describe("playInteriorTransitionSound", () => {
  it("returns false for unsupported transition types", () => {
    expect(playInteriorTransitionSound("fly")).toBe(false);
  });

  it("returns false when AudioContext is unavailable", () => {
    expect(
      playInteriorTransitionSound(INTERIOR_TRANSITION_SOUND.ENTER, {
        AudioContextConstructor: undefined,
      })
    ).toBe(false);
  });

  it("plays a descending whoosh for enter", () => {
    const { audioContext, bufferSources, oscillators, filters } =
      createMockAudioContext();
    const AudioContextConstructor = vi.fn(() => audioContext);

    const didPlay = playInteriorTransitionSound(
      INTERIOR_TRANSITION_SOUND.ENTER,
      { AudioContextConstructor }
    );

    expect(didPlay).toBe(true);
    expect(bufferSources).toHaveLength(1);
    expect(oscillators).toHaveLength(1);
    expect(filters[0].frequency.setValueAtTime).toHaveBeenCalledWith(
      1400,
      expect.any(Number)
    );
    expect(filters[0].frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      220,
      expect.any(Number)
    );
    expect(bufferSources[0].start).toHaveBeenCalled();
    expect(oscillators[0].start).toHaveBeenCalled();
  });

  it("plays an ascending whoosh for exit and resumes a suspended context", () => {
    const { audioContext, filters } = createMockAudioContext({
      state: "suspended",
    });
    const AudioContextConstructor = vi.fn(() => audioContext);

    const didPlay = playInteriorTransitionSound(
      INTERIOR_TRANSITION_SOUND.EXIT,
      { AudioContextConstructor }
    );

    expect(didPlay).toBe(true);
    expect(audioContext.resume).toHaveBeenCalled();
    expect(filters[0].frequency.setValueAtTime).toHaveBeenCalledWith(
      280,
      expect.any(Number)
    );
    expect(filters[0].frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      1600,
      expect.any(Number)
    );
  });

  it("swallows resume rejection without throwing", () => {
    const { audioContext } = createMockAudioContext({ state: "suspended" });
    audioContext.resume = vi.fn(() => Promise.reject(new Error("blocked")));
    const AudioContextConstructor = vi.fn(() => audioContext);

    expect(() =>
      playInteriorTransitionSound(INTERIOR_TRANSITION_SOUND.ENTER, {
        AudioContextConstructor,
      })
    ).not.toThrow();
  });
});
