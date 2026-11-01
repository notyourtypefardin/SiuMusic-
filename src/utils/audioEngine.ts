import { Song, EqualizerSettings } from '../types/music';

/**
 * High-performance Web Audio Synthesizer & Player Engine
 * Supports:
 * - Real-time algorithmic music synthesis for offline sample songs
 * - Real audio playback for user-imported device audio files
 * - 5-Band BiquadFilter Equalizer
 * - Real-time FFT AnalyserNode for audio visualization
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  
  // Real media element for user-imported files
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;

  // Synthesizer scheduler state for sample playback
  private synthInterval: number | null = null;
  private isSynthesizing = false;
  private currentSong: Song | null = null;
  private currentPlayheadSeconds = 0;
  private playheadTimer: number | null = null;

  // Callbacks
  public onTimeUpdate: ((currentTime: number) => void) | null = null;
  public onTrackEnded: (() => void) | null = null;

  private isMuted = false;
  private currentVolume = 0.85;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentVolume;

      // FFT Analyser for visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      // 5-Band Equalizer Nodes:
      // Band 1: LowShelf 100Hz (Bass)
      const b1 = this.ctx.createBiquadFilter();
      b1.type = 'lowshelf';
      b1.frequency.value = 100;

      // Band 2: Peaking 400Hz (Low-Mid)
      const b2 = this.ctx.createBiquadFilter();
      b2.type = 'peaking';
      b2.frequency.value = 400;
      b2.Q.value = 1.0;

      // Band 3: Peaking 1000Hz (Mid)
      const b3 = this.ctx.createBiquadFilter();
      b3.type = 'peaking';
      b3.frequency.value = 1000;
      b3.Q.value = 1.0;

      // Band 4: Peaking 3500Hz (High-Mid / Vocals)
      const b4 = this.ctx.createBiquadFilter();
      b4.type = 'peaking';
      b4.frequency.value = 3500;
      b4.Q.value = 1.0;

      // Band 5: HighShelf 10000Hz (Treble)
      const b5 = this.ctx.createBiquadFilter();
      b5.type = 'highshelf';
      b5.frequency.value = 10000;

      this.eqFilters = [b1, b2, b3, b4, b5];

      // Chain: EQ[0] -> EQ[1] -> EQ[2] -> EQ[3] -> EQ[4] -> Analyser -> MasterGain -> Destination
      b1.connect(b2);
      b2.connect(b3);
      b3.connect(b4);
      b4.connect(b5);
      b5.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Apply 5-band equalizer gains
   */
  public applyEqualizer(eq: EqualizerSettings) {
    if (this.eqFilters.length < 5) return;
    const [b1, b2, b3, b4, b5] = this.eqFilters;
    if (!eq.enabled) {
      b1.gain.value = 0;
      b2.gain.value = 0;
      b3.gain.value = 0;
      b4.gain.value = 0;
      b5.gain.value = 0;
      return;
    }
    b1.gain.value = eq.bass;
    b2.gain.value = eq.lowMid;
    b3.gain.value = eq.mid;
    b4.gain.value = eq.highMid;
    b5.gain.value = eq.treble;
  }

  /**
   * Pre-load a song track without immediate playback
   */
  public loadTrack(song: Song) {
    this.currentSong = song;
    this.currentPlayheadSeconds = 0;
  }

  /**
   * Load and play a song, or resume current track
   */
  public play(song?: Song, startFromSeconds?: number) {
    this.initContext();
    this.stopInternal();

    const targetSong = song || this.currentSong;
    if (!targetSong) return;

    this.currentSong = targetSong;
    const startTime = startFromSeconds !== undefined ? startFromSeconds : this.currentPlayheadSeconds;
    this.currentPlayheadSeconds = startTime;

    if (targetSong.audioFileBlob) {
      // Real file imported from device!
      this.playRealAudioBlob(targetSong.audioFileBlob, startTime);
    } else {
      // Synthesize realistic musical piece for the sample song
      this.startSynthesizerPlayback(targetSong, startTime);
    }

    // Start playhead ticker
    this.startPlayheadTicker(targetSong.duration);
  }

  private playRealAudioBlob(blob: Blob, startTime: number) {
    if (!this.ctx || !this.eqFilters[0]) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.mediaSource = this.ctx.createMediaElementSource(this.audioElement);
      this.mediaSource.connect(this.eqFilters[0]);

      this.audioElement.addEventListener('ended', () => {
        if (this.onTrackEnded) this.onTrackEnded();
      });
    }

    const objectUrl = URL.createObjectURL(blob);
    this.audioElement.src = objectUrl;
    this.audioElement.currentTime = startTime;
    this.audioElement.play().catch(e => console.log('Audio playback resumed on interaction', e));
  }

  /**
   * Generates pleasing melodic synthesizer textures based on musical keys
   */
  private startSynthesizerPlayback(song: Song, startTime: number) {
    if (!this.ctx || !this.eqFilters[0]) return;
    this.isSynthesizing = true;

    // Musical scale frequencies (Hz)
    const scaleMap: Record<string, number[]> = {
      A_MINOR: [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440],
      C_MAJOR: [261.63, 293.66, 329.63, 349.23, 392.0, 440, 493.88, 523.25],
      E_MINOR: [164.81, 185.0, 196.0, 220, 246.94, 261.63, 293.66, 329.63],
      G_MAJOR: [196.0, 220, 246.94, 261.63, 293.66, 329.63, 392.0, 440],
      D_MINOR: [146.83, 164.81, 174.61, 196.0, 220, 233.08, 261.63, 293.66],
      F_MAJOR: [174.61, 196.0, 220, 233.08, 261.63, 293.66, 329.63, 349.23],
      Bb_MAJOR: [233.08, 261.63, 293.66, 311.13, 349.23, 392.0, 440, 466.16],
      G_MINOR: [196.0, 220, 233.08, 261.63, 293.66, 311.13, 349.23, 392.0],
    };

    const notes = scaleMap[song.melodyKey || 'A_MINOR'] || scaleMap.A_MINOR;
    const bpm = song.bpm || 100;
    const beatIntervalMs = (60 / bpm) * 1000;

    let step = 0;

    const playChordAndBass = () => {
      if (!this.isSynthesizing || !this.ctx || !this.eqFilters[0]) return;
      const now = this.ctx.currentTime;

      // Bass note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      const rootNote = notes[step % 4] / 2; // Octave lower
      bassOsc.frequency.setValueAtTime(rootNote, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + (beatIntervalMs * 1.5) / 1000);

      bassOsc.connect(bassGain);
      bassGain.connect(this.eqFilters[0]);
      bassOsc.start(now);
      bassOsc.stop(now + (beatIntervalMs * 1.5) / 1000);

      // Pad chord note
      const padOsc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      padOsc.type = 'sine';
      const chordNote = notes[(step * 2) % notes.length];
      padOsc.frequency.setValueAtTime(chordNote, now);

      padGain.gain.setValueAtTime(0.001, now);
      padGain.gain.linearRampToValueAtTime(0.09, now + 0.2);
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + (beatIntervalMs * 3) / 1000);

      padOsc.connect(padGain);
      padGain.connect(this.eqFilters[0]);
      padOsc.start(now);
      padOsc.stop(now + (beatIntervalMs * 3) / 1000);

      // Light ambient bell chime on every second beat
      if (step % 2 === 0) {
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = 'sine';
        const bellNote = notes[(step + 4) % notes.length] * 2; // Octave higher
        bellOsc.frequency.setValueAtTime(bellNote, now + 0.1);

        bellGain.gain.setValueAtTime(0.001, now + 0.1);
        bellGain.gain.linearRampToValueAtTime(0.06, now + 0.14);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        bellOsc.connect(bellGain);
        bellGain.connect(this.eqFilters[0]);
        bellOsc.start(now + 0.1);
        bellOsc.stop(now + 1.3);
      }

      step++;
    };

    // Trigger initial burst
    playChordAndBass();
    this.synthInterval = window.setInterval(playChordAndBass, beatIntervalMs);
  }

  private startPlayheadTicker(totalDuration: number) {
    if (this.playheadTimer) window.clearInterval(this.playheadTimer);

    this.playheadTimer = window.setInterval(() => {
      this.currentPlayheadSeconds += 0.5;

      if (this.audioElement && !this.audioElement.paused) {
        this.currentPlayheadSeconds = this.audioElement.currentTime;
      }

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentPlayheadSeconds);
      }

      if (this.currentPlayheadSeconds >= totalDuration) {
        if (this.onTrackEnded) {
          this.onTrackEnded();
        }
      }
    }, 500);
  }

  public pause() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.playheadTimer) {
      window.clearInterval(this.playheadTimer);
      this.playheadTimer = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public resume() {
    if (!this.currentSong) return;
    this.play(this.currentSong, this.currentPlayheadSeconds);
  }

  public seek(seconds: number) {
    this.currentPlayheadSeconds = seconds;
    if (this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(seconds);
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx?.currentTime || 0);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.currentVolume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx?.currentTime || 0);
    }
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  /**
   * Get FFT byte frequency data for live visualizer
   */
  public getVisualizerData(buffer: Uint8Array): void {
    if (this.analyser && (this.isSynthesizing || (this.audioElement && !this.audioElement.paused))) {
      this.analyser.getByteFrequencyData(buffer as any);
    } else {
      buffer.fill(0);
    }
  }

  private stopInternal() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.playheadTimer) {
      window.clearInterval(this.playheadTimer);
      this.playheadTimer = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public destroy() {
    this.stopInternal();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}

export const globalAudioEngine = new AudioEngine();
