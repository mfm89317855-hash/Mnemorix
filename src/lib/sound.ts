/**
 * MNEMORIX Sentinel — Tactical Sound Synthesizer
 * Web Audio API–powered, zero-dependency audio feedback.
 * All sounds generated via oscillators and gain envelopes.
 */

const STORAGE_KEY = 'mnemorix_sound_muted';

let _audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_audioCtx) {
    try {
      _audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return _audioCtx;
}

export function isSoundMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function toggleSoundMute(): boolean {
  const next = !isSoundMuted();
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {}
  return next;
}

function play(
  freq: number,
  type: OscillatorType,
  durationSec: number,
  volume = 0.18,
  freqEnd?: number,
  detune = 0,
) {
  if (isSoundMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;

  // Resume suspended context (required after user gesture)
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + durationSec);
  }
  osc.detune.setValueAtTime(detune, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSec);
}

/** Short UI click blip */
export function soundClick() {
  play(880, 'sine', 0.07, 0.08);
}

/** Layer scan step ping */
export function soundScanPing() {
  play(520, 'sine', 0.12, 0.12, 640);
}

/** Threat detected — harsh alarm */
export function soundThreatAlert() {
  play(220, 'sawtooth', 0.5, 0.25, 110);
  setTimeout(() => play(180, 'sawtooth', 0.4, 0.2), 180);
}

/** Memory sealed / commit success */
export function soundMemorySealed() {
  play(880, 'sine', 0.12, 0.14);
  setTimeout(() => play(1100, 'sine', 0.12, 0.12), 90);
  setTimeout(() => play(1320, 'sine', 0.18, 0.1), 180);
}

/** Self-heal successful — rising harmonic chord */
export function soundSelfHeal() {
  play(440, 'triangle', 0.35, 0.15);
  setTimeout(() => play(660, 'triangle', 0.3, 0.12), 80);
  setTimeout(() => play(880, 'triangle', 0.35, 0.1), 160);
  setTimeout(() => play(1320, 'sine', 0.3, 0.1), 260);
}

/** Tamper detected — descending warning */
export function soundTamperWarning() {
  play(1000, 'square', 0.18, 0.15, 400);
  setTimeout(() => play(800, 'square', 0.25, 0.18, 300), 200);
}

/** All-clear / chain verified — clean chime */
export function soundChainVerified() {
  play(740, 'sine', 0.2, 0.1);
  setTimeout(() => play(988, 'sine', 0.18, 0.1), 100);
}

// Convenience alias exports
export const soundScan = soundScanPing;
export const soundAlert = soundThreatAlert;
export const soundHeal = soundSelfHeal;

