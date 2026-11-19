'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type TactileSoundKind = 'tap' | 'tick' | 'confirm' | 'soft';

interface TactileSoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playTactile: (kind?: TactileSoundKind) => void;
}

const STORAGE_KEY = 'caffe_te_tactile_sound_v1';

const TactileSoundContext = createContext<TactileSoundContextValue>({
  soundEnabled: true,
  toggleSound: () => {},
  playTactile: () => {},
});

/**
 * Web Audio API Tactile Acoustic & Haptic Engine:
 * Synthesizes ultra-short, physical, sub-20ms mechanical switch transients
 * (filtered impulse noise + rapid pitch-drop body thump) instead of synthetic beeps.
 * Also triggers subtle mobile haptic pulses via `navigator.vibrate` where supported.
 */
export function TactileSoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const soundEnabledRef = useRef<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const lastTriggerRef = useRef<number>(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'muted') {
        setSoundEnabled(false);
        soundEnabledRef.current = false;
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const getAudioEngine = useCallback((): {
    ctx: AudioContext;
    noiseBuffer: AudioBuffer;
  } | null => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return null;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      if (!noiseBufferRef.current) {
        // Pre-compute a 35ms shaped white-noise transient buffer for tactile click texture
        const length = Math.floor(ctx.sampleRate * 0.035);
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
          const env = Math.pow(1 - i / length, 2.6);
          data[i] = (Math.random() * 2 - 1) * env;
        }
        noiseBufferRef.current = buffer;
      }

      return { ctx, noiseBuffer: noiseBufferRef.current };
    } catch {
      return null;
    }
  }, []);

  const triggerHaptic = useCallback((kind: TactileSoundKind) => {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    try {
      if (kind === 'confirm') {
        navigator.vibrate([10, 24, 12]);
      } else if (kind === 'tick') {
        navigator.vibrate(4);
      } else if (kind === 'tap') {
        navigator.vibrate(7);
      } else {
        navigator.vibrate(5);
      }
    } catch {
      // Ignore vibration permission restrictions on unsupported browsers
    }
  }, []);

  const playTactile = useCallback(
    (kind: TactileSoundKind = 'tap') => {
      const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (nowMs - lastTriggerRef.current < 24) return;
      lastTriggerRef.current = nowMs;

      if (!soundEnabledRef.current) return;

      triggerHaptic(kind);

      const engine = getAudioEngine();
      if (!engine) return;
      const { ctx, noiseBuffer } = engine;
      const t0 = ctx.currentTime;

      try {
        if (kind === 'tick') {
          // Rotary watch-crown detent tick (9ms crisp transient + micro body drop)
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const bandpass = ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(1950, t0);
          bandpass.frequency.exponentialRampToValueAtTime(920, t0 + 0.009);
          bandpass.Q.setValueAtTime(4.2, t0);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.16, t0);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.009);

          noise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start(t0);
          noise.stop(t0 + 0.01);

          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, t0);
          osc.frequency.exponentialRampToValueAtTime(115, t0 + 0.009);
          oscGain.gain.setValueAtTime(0.11, t0);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.009);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.01);
          return;
        }

        if (kind === 'confirm') {
          // Two-stage mechanical switch latch + warm espresso-cup harmonic chime
          // Stage 1: Down-stroke click (0ms)
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1320, t0);
          filter.frequency.exponentialRampToValueAtTime(640, t0 + 0.014);
          filter.Q.setValueAtTime(3.0, t0);

          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.22, t0);
          nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.015);
          noise.connect(filter);
          filter.connect(nGain);
          nGain.connect(ctx.destination);
          noise.start(t0);
          noise.stop(t0 + 0.016);

          const thump = ctx.createOscillator();
          const thumpGain = ctx.createGain();
          thump.type = 'triangle';
          thump.frequency.setValueAtTime(170, t0);
          thump.frequency.exponentialRampToValueAtTime(56, t0 + 0.017);
          thumpGain.gain.setValueAtTime(0.22, t0);
          thumpGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.018);
          thump.connect(thumpGain);
          thumpGain.connect(ctx.destination);
          thump.start(t0);
          thump.stop(t0 + 0.019);

          // Stage 2: Up-stroke latch + warm muffled wooden resonance (+34ms)
          const t1 = t0 + 0.034;
          const latch = ctx.createOscillator();
          const latchFilter = ctx.createBiquadFilter();
          const latchGain = ctx.createGain();
          latch.type = 'triangle';
          latch.frequency.setValueAtTime(260, t1);
          latch.frequency.exponentialRampToValueAtTime(145, t1 + 0.024);

          latchFilter.type = 'lowpass';
          latchFilter.frequency.setValueAtTime(980, t1);

          latchGain.gain.setValueAtTime(0.16, t1);
          latchGain.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.028);

          latch.connect(latchFilter);
          latchFilter.connect(latchGain);
          latchGain.connect(ctx.destination);
          latch.start(t1);
          latch.stop(t1 + 0.03);
          return;
        }

        if (kind === 'soft') {
          // Soft cushioned air-thud for drawers & toggles (22ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(135, t0);
          osc.frequency.exponentialRampToValueAtTime(48, t0 + 0.022);
          gain.gain.setValueAtTime(0.15, t0);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.024);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.025);
          return;
        }

        // Default 'tap': Physical matte keycap / wooden espresso tamp tap (16ms)
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1180, t0);
        bandpass.frequency.exponentialRampToValueAtTime(620, t0 + 0.014);
        bandpass.Q.setValueAtTime(3.4, t0);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.19, t0);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.014);

        noise.connect(bandpass);
        bandpass.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t0);
        noise.stop(t0 + 0.015);

        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(165, t0);
        bodyOsc.frequency.exponentialRampToValueAtTime(58, t0 + 0.016);

        bodyGain.gain.setValueAtTime(0.2, t0);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.017);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        bodyOsc.start(t0);
        bodyOsc.stop(t0 + 0.018);
      } catch {
        // Ignore Web Audio errors before user gesture unlock
      }
    },
    [getAudioEngine, triggerHaptic]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEnabledRef.current = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'enabled' : 'muted');
      } catch {
        // Ignore storage write errors
      }
      if (next) {
        setTimeout(() => playTactile('confirm'), 10);
      }
      return next;
    });
  }, [playTactile]);

  // Global Zero-Latency PointerDown Delegation for All Interactive Elements (Touch + Mouse)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!soundEnabledRef.current) return;
      if (e.button !== undefined && e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      const interactive = target.closest(
        'button, a, [role="button"], [role="tab"], input[type="checkbox"], input[type="radio"], select, summary, [data-tactile]'
      ) as HTMLElement | null;

      if (!interactive) return;
      if (
        interactive.hasAttribute('disabled') ||
        interactive.getAttribute('aria-disabled') === 'true'
      ) {
        return;
      }

      const explicitKind = interactive.getAttribute('data-tactile') as TactileSoundKind | null;
      if (explicitKind) {
        playTactile(explicitKind);
        return;
      }

      // Classify tactile response by element role/intent
      if (
        interactive.getAttribute('role') === 'tab' ||
        interactive.hasAttribute('aria-current') ||
        interactive.tagName === 'INPUT' ||
        interactive.tagName === 'SELECT'
      ) {
        playTactile('tick');
        return;
      }

      const classList = interactive.className || '';
      const text = (interactive.textContent || '').toUpperCase();
      if (
        (typeof classList === 'string' && classList.includes('btn-gold-primary')) ||
        text.includes('+ ADD') ||
        text.includes('ADD TO BAG') ||
        text.includes('BOOK A TABLE') ||
        text.includes('RESERVE') ||
        text.includes('ORDER ONLINE')
      ) {
        playTactile('confirm');
        return;
      }

      playTactile('tap');
    };

    document.addEventListener('pointerdown', handlePointerDown, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, {
        capture: true,
      });
    };
  }, [playTactile]);

  return (
    <TactileSoundContext.Provider value={{ soundEnabled, toggleSound, playTactile }}>
      {children}
    </TactileSoundContext.Provider>
  );
}

export function useTactileSound() {
  return useContext(TactileSoundContext);
}
