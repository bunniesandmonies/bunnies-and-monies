// ------------------------------------------------------------
// BACKGROUND MUSIC
// A gentle music-box tune (assets/sounds/music-village.mp3, made by
// tools/make_music.py) plays quietly in the background on every
// screen. It gets quieter while the voice is talking.
//
// The music button (a musical note, on every screen) turns it on
// and off. The choice is remembered next time.
// ------------------------------------------------------------

const Music = {
  KEY: 'music-village',
  VOLUME: 0.22,      // normal background level
  DUCKED: 0.07,      // while the voice is talking
  sound: null,

  isOn() {
    return GameState.data.musicOn !== false;
  },

  // Start the music (safe to call from any screen, any number of times)
  start(scene) {
    if (!this.isOn() || !scene.cache.audio.exists(this.KEY)) return;
    const manager = scene.sound;
    if (!this.sound) this.sound = manager.add(this.KEY, { loop: true, volume: this.VOLUME });
    if (this.sound.isPlaying) return;
    const go = () => { if (this.isOn() && !this.sound.isPlaying) this.sound.play(); };
    // Browsers only allow sound after the first tap
    if (manager.locked) manager.once('unlocked', go); else go();
  },

  stop() {
    if (this.sound) this.sound.stop();
  },

  toggle(scene) {
    GameState.data.musicOn = !this.isOn();
    GameState.save();
    if (this.isOn()) this.start(scene); else this.stop();
    return this.isOn();
  },

  // Quieter while the voice talks, back to normal afterwards
  duck(on) {
    if (this.sound && this.sound.isPlaying) this.sound.setVolume(on ? this.DUCKED : this.VOLUME);
  }
};
