// ------------------------------------------------------------
// SOUND EFFECTS
// Happy little sounds made with code, so no files are needed.
//
// To use a real recorded sound instead, put a file in
// assets/sounds with the same name (for example coin.mp3),
// then rebuild the packed files (see README.md). The game uses
// the recording automatically if there is one.
//
// Names: 'coin', 'pop', 'splash', 'chirp', 'yay', 'boop',
//        'clink', 'boing', 'drum', 'sparkle'
// ------------------------------------------------------------

const SFX = {
  play(scene, name) {
    // A recorded sound with this name? Use it.
    if (scene.cache.audio.exists(name)) {
      scene.sound.play(name);
      return;
    }
    const ctx = scene.sound.context;          // the browser's sound maker
    if (!ctx) return;                          // sound not available on this device
    if (ctx.state === 'suspended') ctx.resume();
    const recipe = this.recipes[name];
    if (recipe) recipe(ctx, ctx.currentTime);
  },

  // One musical note that fades out
  note(ctx, freq, start, length, type = 'triangle', volume = 0.25) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + length + 0.05);
    return osc;
  },

  recipes: {
    // "Ding-ding!" when a coin is earned
    coin(ctx, t) {
      SFX.note(ctx, 988, t, 0.1, 'square', 0.12);
      SFX.note(ctx, 1319, t + 0.08, 0.45, 'square', 0.12);
      SFX.note(ctx, 2637, t + 0.08, 0.3, 'sine', 0.06);
    },
    // Soft pop when something is tapped
    pop(ctx, t) {
      const osc = SFX.note(ctx, 420, t, 0.12, 'sine', 0.3);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.08);
    },
    // Gentle "boop" when a job is already done
    boop(ctx, t) {
      const osc = SFX.note(ctx, 500, t, 0.18, 'sine', 0.2);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
    },
    // Water splashing
    splash(ctx, t) {
      const length = 0.6;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      const gain = ctx.createGain();
      gain.gain.value = 0.25;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start(t);
    },
    // Chick cheeping
    chirp(ctx, t) {
      [0, 0.15].forEach((d) => {
        const osc = SFX.note(ctx, 2200, t + d, 0.1, 'sine', 0.15);
        osc.frequency.exponentialRampToValueAtTime(3200, t + d + 0.08);
      });
    },
    // Coin dropping into a glass jar
    clink(ctx, t) {
      SFX.note(ctx, 2637, t, 0.15, 'sine', 0.18);
      SFX.note(ctx, 3520, t + 0.06, 0.25, 'sine', 0.12);
    },
    // Ball bouncing
    boing(ctx, t) {
      const osc = SFX.note(ctx, 180, t, 0.35, 'sine', 0.3);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.3);
    },
    // Drum beat
    drum(ctx, t) {
      [0, 0.22, 0.44].forEach((d) => {
        const osc = SFX.note(ctx, 160, t + d, 0.25, 'sine', 0.5);
        osc.frequency.exponentialRampToValueAtTime(60, t + d + 0.2);
      });
    },
    // Magical twinkle (a surprise appearing)
    sparkle(ctx, t) {
      [1568, 2093, 2637, 3136, 2637, 3136].forEach((f, i) => SFX.note(ctx, f, t + i * 0.07, 0.25, 'sine', 0.1));
    },
    // Hooray tune for a celebration
    yay(ctx, t) {
      [523, 659, 784, 1047].forEach((f, i) => SFX.note(ctx, f, t + i * 0.12, 0.3, 'triangle', 0.25));
      SFX.note(ctx, 1319, t + 0.5, 0.6, 'triangle', 0.2);
    }
  }
};
