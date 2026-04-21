class AudioEngine {
  ctx: AudioContext | null = null;
  muted: boolean = false;
  bgmInterval: any = null;
  bgmStep: number = 0;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.stopBGM();
    else this.startBGM();
  }

  playNote(freq: number, type: OscillatorType, duration: number, vol = 0.03) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playMove() {
    this.playNote(200, 'sine', 0.1, 0.02);
  }

  playRotate() {
    this.playNote(300, 'square', 0.1, 0.02);
  }

  playDrop() {
    this.playNote(100, 'triangle', 0.15, 0.04);
  }

  playClear() {
    this.playNote(600, 'sine', 0.1, 0.05);
    setTimeout(() => this.playNote(800, 'sine', 0.2, 0.05), 100);
    setTimeout(() => this.playNote(1000, 'sine', 0.3, 0.05), 200);
  }

  playLevelUp() {
    [400, 500, 600, 700, 800].forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, 'square', 0.2, 0.05), i * 150);
    });
  }

  startBGM() {
    if (this.muted) return;
    this.init();
    if (this.bgmInterval) clearInterval(this.bgmInterval);
    
    // Very quiet, ambient background pulses
    const melody = [220, 0, 261.63, 0, 329.63, 0, 293.66, 0];
    this.bgmStep = 0;
    
    this.bgmInterval = setInterval(() => {
      const note = melody[this.bgmStep % melody.length];
      if (note !== 0) {
        this.playNote(note / 2, 'sine', 0.4, 0.015);
      }
      this.bgmStep++;
    }, 500);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audio = new AudioEngine();
