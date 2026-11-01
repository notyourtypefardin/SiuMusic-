/**
 * Advanced Dual-Engine Haptic Feedback System
 * Combines hardware vibration (Android/Supported devices) with synthetic
 * low-frequency tactile acoustic micro-clicks (Web Audio API) for ultra-realistic
 * tactile sensations across every single device, browser, and iframe.
 */

class HapticsManager {
  private enabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private lastSeekTime: number = 0;

  constructor() {
    // Lazy initialize Web Audio context on first user interaction
    if (typeof window !== 'undefined') {
      const initAudio = () => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass && !this.audioCtx) {
            this.audioCtx = new AudioContextClass();
          }
        } catch {
          // ignore
        }
        window.removeEventListener('pointerdown', initAudio);
        window.removeEventListener('keydown', initAudio);
      };
      window.addEventListener('pointerdown', initAudio, { once: true, passive: true });
      window.addEventListener('keydown', initAudio, { once: true, passive: true });
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Generates an ultra-short, rich low-frequency tactile click impulse
   * (40Hz to 120Hz shaped burst) replicating Apple Taptic Engine & Android haptics
   */
  private playTactileImpulse(frequency = 75, durationMs = 12, volume = 0.08) {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.audioCtx.currentTime + durationMs / 1000);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationMs / 1000);
    } catch {
      // Gracefully ignore audio glitches
    }
  }

  private triggerVibrate(pattern: number | number[]) {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Gracefully ignore
    }
  }

  /**
   * Ultra-light selection tick for tabs, list rows, and theme chips
   */
  public selection() {
    this.triggerVibrate(6);
    this.playTactileImpulse(95, 10, 0.06);
  }

  public play() {
    this.buttonPress();
  }

  public pause() {
    this.buttonPress();
  }

  public trackChange() {
    this.impact('light');
  }

  /**
   * Soft button press for primary actions, play/pause, and controls
   */
  public buttonPress() {
    this.triggerVibrate(15);
    this.playTactileImpulse(70, 16, 0.12);
  }

  /**
   * Calibrated impact feedback for tactile buttons and glass gestures
   */
  public impact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (style === 'light') {
      this.triggerVibrate(8);
      this.playTactileImpulse(90, 10, 0.07);
    } else if (style === 'medium') {
      this.triggerVibrate(16);
      this.playTactileImpulse(68, 18, 0.14);
    } else {
      this.triggerVibrate(26);
      this.playTactileImpulse(52, 25, 0.22);
    }
  }

  /**
   * Successful state change (e.g. favorited, added to playlist)
   */
  public stateChange() {
    this.triggerVibrate([10, 30, 14]);
    this.playTactileImpulse(110, 14, 0.1);
    setTimeout(() => {
      this.playTactileImpulse(140, 16, 0.14);
    }, 45);
  }

  /**
   * Continuous subtle tick during slider seek with rate throttling (max 22 ticks/sec)
   */
  public seek() {
    const now = performance.now();
    if (now - this.lastSeekTime < 42) return;
    this.lastSeekTime = now;

    this.triggerVibrate(4);
    this.playTactileImpulse(120, 6, 0.04);
  }

  /**
   * Scroll snap tick when crossing list items or sections
   */
  public scrollSnap() {
    const now = performance.now();
    if (now - this.lastSeekTime < 60) return;
    this.lastSeekTime = now;

    this.triggerVibrate(5);
    this.playTactileImpulse(105, 8, 0.04);
  }

  /**
   * Error or invalid action
   */
  public error() {
    this.triggerVibrate([25, 40, 25]);
    this.playTactileImpulse(45, 30, 0.2);
  }
}

export const haptics = new HapticsManager();
