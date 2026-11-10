// ------------------------------------------------------------
// SHARED SCREEN PIECES
// Buttons, the coin counter, sparkles and other bits that every
// screen uses, so they all look and behave the same.
// ------------------------------------------------------------

// Little pictures drawn on the round buttons
const ICONS = {
  home(g) {
    g.fillStyle(COLOURS.wood, 1);
    g.fillTriangle(-28, -2, 28, -2, 0, -28);
    g.fillRect(-20, -4, 40, 30);
    g.fillStyle(COLOURS.gold, 1).fillRect(-7, 8, 14, 18);
  },
  speaker(g) {
    g.fillStyle(COLOURS.wood, 1);
    g.fillRect(-26, -10, 14, 20);
    g.fillTriangle(-14, -10, 6, -26, 6, 26);
    g.fillTriangle(-14, -10, -14, 10, 6, 26);
    g.lineStyle(5, COLOURS.wood, 1);
    g.beginPath(); g.arc(8, 0, 14, -0.9, 0.9); g.strokePath();
    g.beginPath(); g.arc(8, 0, 26, -0.9, 0.9); g.strokePath();
  },
  back(g) {
    g.fillStyle(COLOURS.wood, 1);
    g.fillTriangle(-28, 0, 0, -26, 0, 26);
    g.fillRect(-2, -11, 28, 22);
  },
  jars(g) {
    g.fillStyle(0xFFFFFF, 0.8).fillRoundedRect(-22, -16, 44, 42, 10);
    g.lineStyle(4, 0x9CC9E0, 1).strokeRoundedRect(-22, -16, 44, 42, 10);
    g.fillStyle(COLOURS.gold, 1).fillCircle(-8, 16, 8).fillCircle(8, 16, 8).fillCircle(0, 4, 8);
    g.lineStyle(2, COLOURS.wood, 1).strokeCircle(-8, 16, 8).strokeCircle(8, 16, 8).strokeCircle(0, 4, 8);
    g.fillStyle(0xE74C3C, 1).fillRoundedRect(-26, -28, 52, 14, 6);
  },
  // A big question mark (How to play)
  help(g) {
    g.lineStyle(10, COLOURS.wood, 1);
    g.beginPath(); g.arc(0, -10, 14, Math.PI, Math.PI * 2.5, false); g.strokePath();
    g.lineBetween(0, 4, 0, 12);
    g.fillStyle(COLOURS.wood, 1).fillCircle(0, 25, 6);
  },
  // Music on: two joined notes
  musicOn(g) {
    g.fillStyle(COLOURS.wood, 1).fillEllipse(-14, 16, 18, 13).fillEllipse(12, 10, 18, 13);
    g.fillRect(-7, -20, 5, 36).fillRect(19, -26, 5, 36);
    g.fillPoints([{ x: -7, y: -20 }, { x: 24, y: -26 }, { x: 24, y: -16 }, { x: -7, y: -10 }], true);
  },
  // Music off: the notes, faded, with a red line through them
  musicOff(g) {
    g.fillStyle(COLOURS.wood, 0.45).fillEllipse(-14, 16, 18, 13).fillEllipse(12, 10, 18, 13);
    g.fillRect(-7, -20, 5, 36).fillRect(19, -26, 5, 36);
    g.fillPoints([{ x: -7, y: -20 }, { x: 24, y: -26 }, { x: 24, y: -16 }, { x: -7, y: -10 }], true);
    g.lineStyle(7, 0xE74C3C, 1).lineBetween(-26, 24, 26, -26);
  },
  close(g) {
    g.lineStyle(10, COLOURS.wood, 1).lineBetween(-16, -16, 16, 16).lineBetween(16, -16, -16, 16);
  },
  bulb(g) {
    g.fillStyle(COLOURS.cream, 1).fillCircle(0, -6, 16);
    g.fillRect(-8, 6, 16, 8);
    g.fillStyle(COLOURS.gold, 1).fillRoundedRect(-8, 14, 16, 8, 3);
    g.lineStyle(3, COLOURS.cream, 1);
    g.lineBetween(-26, -6, -21, -6).lineBetween(21, -6, 26, -6).lineBetween(0, -32, 0, -27);
    g.lineBetween(-18, -24, -15, -21).lineBetween(18, -24, 15, -21);
  },
  village(g) {
    g.fillStyle(ART_COLOURS.can, 1).fillRoundedRect(-24, -8, 34, 28, 6);
    g.fillPoints([{ x: 8, y: 0 }, { x: 28, y: -18 }, { x: 32, y: -14 }, { x: 10, y: 10 }], true);
    g.lineStyle(5, ART_COLOURS.outline, 1);
    g.beginPath(); g.arc(-7, -8, 13, Math.PI, Math.PI * 2); g.strokePath();
  }
};

const UI = {
  fadeIn(scene) {
    scene._leaving = false;
    scene.cameras.main.fadeIn(350, 235, 216, 191);
  },

  // Go to another screen with a soft fade (ignores double taps)
  goTo(scene, key) {
    if (scene._leaving) return;
    scene._leaving = true;
    Voice.stop();
    scene.cameras.main.fadeOut(300, 235, 216, 191);
    scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key));
  },

  // A big round gold button with a picture on it
  // The round gold button picture (drawn once, then reused)
  buttonTexture(scene, key, drawIcon, r = 52) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ add: false });
    g.translateCanvas(r + 4, r + 4);
    g.fillStyle(COLOURS.wood, 1).fillCircle(0, 6, r);
    g.fillStyle(COLOURS.gold, 1).fillCircle(0, 0, r);
    g.lineStyle(6, COLOURS.wood, 1).strokeCircle(0, 0, r);
    if (r !== 52) { g.save(); g.scaleCanvas(r / 52, r / 52); drawIcon(g); g.restore(); } else drawIcon(g);
    g.generateTexture(key, r * 2 + 8, r * 2 + 14);
    g.destroy();
  },

  roundButton(scene, x, y, key, drawIcon, onTap, r = 52) {
    const btn = scene.add.container(x, y).setDepth(40);
    this.buttonTexture(scene, key, drawIcon, r);
    btn.add(scene.add.image(0, 3, key));
    btn.setInteractive({ hitArea: new Phaser.Geom.Circle(0, 0, r + 20), hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true });
    btn.on('pointerdown', () => { btn.setScale(0.9); SFX.play(scene, 'pop'); });
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerup', () => { btn.setScale(1); onTap(); });
    return btn;
  },

  homeButton(scene) {
    return this.roundButton(scene, 76, 72, 'button-home', ICONS.home, () => this.goTo(scene, 'TitleScene'));
  },
  backButton(scene, target) {
    return this.roundButton(scene, 76, 72, 'button-back', ICONS.back, () => this.goTo(scene, target));
  },
  speakerButton(scene, voiceKey) {
    return this.roundButton(scene, scene.scale.width - 76, 72, 'button-speaker', ICONS.speaker, () => Voice.say(scene, voiceKey));
  },

  // "?" button: opens the How to Play tutorial, then comes back here
  helpButton(scene, x, y) {
    return this.roundButton(scene, x, y, 'button-help', ICONS.help, () => {
      scene.registry.set('tutorialFrom', scene.scene.key);
      scene.registry.set('tutorialStep', 0);
      this.goTo(scene, 'TutorialScene');
    });
  },

  // Music on/off button (top left, under the home or back button)
  musicButton(scene, x = 76, y = 178) {
    const r = 40;
    this.buttonTexture(scene, 'button-music-on', ICONS.musicOn, r);
    this.buttonTexture(scene, 'button-music-off', ICONS.musicOff, r);
    const btn = this.roundButton(scene, x, y, Music.isOn() ? 'button-music-on' : 'button-music-off', ICONS.musicOn, () => {
      const on = Music.toggle(scene);
      btn.list[0].setTexture(on ? 'button-music-on' : 'button-music-off');
    }, r);
    return btn;
  },

  // Finished Book 1 just now? After the current animation, go to the party.
  // (If the child leaves first, the village shows the party next time.)
  celebrateBook1IfDone(scene, delayMs = 2500) {
    if (!GameState.claimBook1()) return;
    scene.time.delayedCall(delayMs, () => {
      if (scene.scene.isActive() && !scene.tipOpen) this.goTo(scene, 'FinishScene');
    });
  },

  // ---------- The guide: "do this next" ----------
  // One big bouncing pointing hand with a golden glow, on ONE thing at
  // a time. It disappears as soon as the child taps anywhere.
  //   UI.guide(scene, x, y, { radius })         a round glow
  //   UI.guide(scene, x, y, { w, h })           a rounded-box glow
  //   options: voice (line to say), gap (ms between repeats of that
  //   line, default 18 s), dir ('below', 'above', 'left', 'right': where
  //   the hand sits; chosen automatically), ms (how long it shows)
  guide(scene, x, y, opts = {}) {
    this.hideGuide(scene);
    if (scene.tipOpen) return;
    const W = scene.scale.width, H = scene.scale.height;
    const r = opts.radius || 70;
    const hw = opts.w ? opts.w / 2 : r, hh = opts.h ? opts.h / 2 : r;
    let dir = opts.dir;
    if (!dir) {
      if (y + hh + 120 > H - 10) dir = 'above';
      else dir = 'below';
    }
    const parts = [];
    const ring = opts.w
      ? scene.add.rectangle(x, y, hw * 2, hh * 2).setStrokeStyle(10, COLOURS.gold).setFillStyle(0xFFF3C4, 0.16)
      : scene.add.circle(x, y, r).setStrokeStyle(10, COLOURS.gold).setFillStyle(0xFFF3C4, 0.16);
    const ripple = opts.w
      ? scene.add.rectangle(x, y, hw * 2, hh * 2).setStrokeStyle(6, 0xFFFFFF, 0.9)
      : scene.add.circle(x, y, r).setStrokeStyle(6, 0xFFFFFF, 0.9);
    parts.push(ring, ripple);
    scene.tweens.add({ targets: ring, scale: 1.06, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: ripple, scale: 1.3, alpha: 0, duration: 1000, repeat: -1, ease: 'Sine.easeOut' });

    // The hand's fingertip points at the edge of the glow
    const v = { below: [0, 1, 0], above: [0, -1, 180], left: [-1, 0, 90], right: [1, 0, -90] }[dir];
    const gap = (v[0] ? hw : hh) + 10;
    const tipX = x + v[0] * gap, tipY = y + v[1] * gap;
    const hand = scene.add.image(tipX, tipY, 'hand').setOrigin(0.5, 0.03).setAngle(v[2]).setScale(1.05);
    parts.push(hand);
    scene.tweens.add({ targets: hand, x: tipX + v[0] * 24, y: tipY + v[1] * 24, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    parts.forEach((o) => o.setDepth(80));
    scene._guide = parts;
    if (!scene._guideHook) {
      scene._guideHook = true;
      scene.input.on('pointerdown', () => this.hideGuide(scene));
      scene.events.once('shutdown', () => { scene._guide = null; scene._guideHook = false; });
    }
    if (scene._guideTimer) scene._guideTimer.remove();
    scene._guideTimer = scene.time.delayedCall(opts.ms || 7000, () => this.hideGuide(scene));
    if (opts.voice) this.sayNow(scene, opts.voice, opts.gap || 18000);
  },

  // Point at a game object (button, jar, character...)
  guideTo(scene, obj, opts = {}) {
    if (!obj || !obj.active) return;
    const b = obj.getBounds();
    const o = Object.assign({}, opts);
    if (!o.radius && !o.w) o.radius = Math.max(b.width, b.height) / 2 + 14;
    this.guide(scene, b.centerX, b.centerY, o);
  },

  hideGuide(scene) {
    if (!scene._guide) return;
    scene._guide.forEach((o) => { scene.tweens.killTweensOf(o); o.destroy(); });
    scene._guide = null;
  },

  // Pause or restart a character's gentle bobbing (for special moves)
  holdBob(scene, img, hold) {
    scene.tweens.getTweensOf(img).forEach((t) => (hold ? t.pause() : t.resume()));
  },

  // Gently pulse a button or object to say "tap me"
  pulse(scene, target, times = 3) {
    scene.tweens.add({ targets: target, scale: 1.15, duration: 300, yoyo: true, repeat: times - 1, ease: 'Sine.easeInOut',
      onComplete: () => target.setScale(1) });
  },

  // Coin counter panel at the top: a picture and a number
  counter(scene, x, y, iconKey, value, iconScale = 1) {
    if (!scene.textures.exists('counter-panel')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(3, 3, 280, 100, 50);
      g.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(3, 3, 280, 100, 50);
      g.generateTexture('counter-panel', 286, 106);
      g.destroy();
    }
    const box = scene.add.container(x, y).setDepth(40);
    const icon = scene.add.image(-80, 0, iconKey).setScale(iconScale);
    const text = scene.add.text(30, 2, String(value), {
      fontFamily: FONT, fontSize: '68px', fontStyle: 'bold', color: COLOURS.creamText
    }).setOrigin(0.5);
    box.add([scene.add.image(0, 0, 'counter-panel'), icon, text]);
    return {
      box,
      iconPos: { x: x - 80, y },
      set(v) {
        text.setText(String(v));
        scene.tweens.add({ targets: box, scale: 1.15, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
      }
    };
  },

  // Sparkle bursts: call .explode(count, x, y)
  sparkles(scene, texture = 'sparkle', tints = [COLOURS.gold, 0xFFFFFF, 0xFFE9A8]) {
    return scene.add.particles(0, 0, texture, {
      speed: { min: 120, max: 340 },
      scale: { start: texture === 'heart' ? 0.6 : 0.7, end: 0 },
      rotate: texture === 'heart' ? 0 : { min: 0, max: 360 },
      lifespan: 800,
      tint: tints,
      emitting: false
    }).setDepth(50);
  },

  // A book character standing on the ground, gently bobbing
  character(scene, key, x, feetY, height, flip = false) {
    scene.add.ellipse(x, feetY, height * 0.5, 28, COLOURS.wood, 0.2);
    const img = scene.add.image(x, feetY, key).setOrigin(0.5, 1).setFlipX(flip);
    img.setScale(height / img.height);
    img.baseScale = img.scale;
    img.feetY = feetY;
    scene.tweens.add({ targets: img, y: feetY - 12, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return img;
  },

  // A happy squish (or a spin, for big moments)
  cheer(scene, img, big = false) {
    scene.tweens.add({
      targets: img,
      scaleY: img.baseScale * 1.08,
      scaleX: img.baseScale * 0.95 * (img.flipX ? 1 : 1),
      angle: big ? 360 : 0,
      duration: big ? 600 : 180,
      yoyo: !big,
      onComplete: () => { img.setAngle(0).setScale(img.baseScale); }
    });
  },

  // A happy hop
  hop(scene, img) {
    scene.tweens.add({ targets: img, y: img.feetY - 70, duration: 220, yoyo: true, ease: 'Quad.easeOut' });
  },

  // Coins (or another picture) raining down for a celebration
  rain(scene, sparkles, key = 'coin') {
    const w = scene.scale.width;
    for (let i = 0; i < 6; i++) {
      scene.time.delayedCall(i * 120, () => sparkles.explode(16, Phaser.Math.Between(100, w - 100), Phaser.Math.Between(150, 350)));
    }
    for (let i = 0; i < 12; i++) {
      const c = scene.add.image(Phaser.Math.Between(50, w - 50), -40, key).setScale(0.6).setDepth(44);
      scene.tweens.add({ targets: c, y: scene.scale.height + 40, angle: 360, delay: i * 90, duration: 1600, ease: 'Quad.easeIn', onComplete: () => c.destroy() });
    }
  },

  // When nobody taps for a while, run a gentle hint
  whenIdle(scene, seconds, hint) {
    scene.idleTime = 0;
    scene.input.on('pointerdown', () => { scene.idleTime = 0; });
    scene.time.addEvent({ delay: 1000, loop: true, callback: () => {
      if (scene.tipOpen) return;   // a grown-up is reading a tip: stay quiet
      scene.idleTime += 1;
      if (scene.idleTime >= seconds) { scene.idleTime = 0; hint(); }
    } });
  },

  // Speak a line, but not more often than every few seconds
  sayNow(scene, key, gapMs = 6000) {
    scene._lastSaid = scene._lastSaid || {};
    if (scene.time.now - (scene._lastSaid[key] || -99999) < gapMs) return;
    scene._lastSaid[key] = scene.time.now;
    Voice.say(scene, key);
  },

  // The outdoor village background (drawn once, then reused)
  paintVillage(scene, horizon, houses = true) {
    const w = scene.scale.width;
    const h = scene.scale.height;
    const key = `village-${w}x${h}-${houses ? 'houses' : 'meadow'}`;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ add: false });
      const top = Phaser.Display.Color.ValueToColor(0x9FD8F2);
      const bottom = Phaser.Display.Color.ValueToColor(0xDDF1F8);
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, steps, i);
        g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1)
          .fillRect(0, (horizon + 40) * i / steps, w, (horizon + 40) / steps + 1);
      }
      g.fillStyle(0xA8D672, 1).fillEllipse(w * 0.2, horizon + 30, w * 0.8, 160);
      g.fillStyle(0x9ACD6E, 1).fillEllipse(w * 0.8, horizon + 40, w * 0.9, 180);
      g.fillStyle(0x8BC34A, 1).fillRect(0, horizon + 40, w, h - horizon);
      g.fillStyle(COLOURS.gold, 1).fillCircle(w * 0.78, horizon * 0.62, 46);
      g.fillStyle(COLOURS.gold, 0.35).fillCircle(w * 0.78, horizon * 0.62, 66);
      if (houses) {
        [0.12, 0.34, 0.6, 0.9].forEach((fx, i) => {
          const x = w * fx;
          const y = horizon + 10 + (i % 2) * 14;
          g.fillStyle(COLOURS.wood, 1).fillRoundedRect(x - 50, y - 60, 100, 70, 8);
          g.fillStyle(COLOURS.gold, 1).fillTriangle(x - 64, y - 56, x + 64, y - 56, x, y - 116);
          g.fillStyle(0x4A3020, 1).fillRoundedRect(x - 16, y - 34, 32, 44, { tl: 16, tr: 16, bl: 0, br: 0 });
          g.fillStyle(COLOURS.cream, 1).fillCircle(x + 30, y - 32, 10);
        });
      } else {
        // Flowers in the meadow
        for (let i = 0; i < 18; i++) {
          const fx = (i * 0.137 + 0.05) % 1, fy = horizon + 80 + ((i * 97) % (h - horizon - 120));
          g.fillStyle([0xF5A9B8, 0xFFFFFF, 0xF4C542][i % 3], 1);
          [[0, -8], [8, 0], [0, 8], [-8, 0]].forEach(([dx, dy]) => g.fillCircle(w * fx + dx, fy + dy, 6));
          g.fillStyle(COLOURS.gold, 1).fillCircle(w * fx, fy, 5);
        }
      }
      g.fillStyle(COLOURS.cream, 0.7).fillEllipse(w / 2, h - 10, w * 0.9, 120);
      g.generateTexture(key, w, h);
      g.destroy();
    }
    scene.add.image(0, 0, key).setOrigin(0);

    [[0.15, 0.3], [0.5, 0.18], [0.92, 0.42]].forEach(([fx, fy]) => {
      const cloud = scene.add.image(w * fx, horizon * fy, 'cloud');
      scene.tweens.add({ targets: cloud, x: cloud.x + 60, duration: 6000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  },

  // An indoor background: cream wall with soft dots and a wooden floor or table
  paintIndoors(scene, floorY, stripes = false) {
    const w = scene.scale.width;
    const h = scene.scale.height;
    const key = `indoors-${w}x${h}-${floorY}-${stripes}`;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0xF6EBDC, 1).fillRect(0, 0, w, h);
      if (stripes) {
        for (let x = 0; x < w; x += 80) g.fillStyle(COLOURS.gold, 0.18).fillRect(x, 0, 40, floorY);
      } else {
        for (let y = 40; y < floorY; y += 90) {
          for (let x = (y / 90) % 2 ? 45 : 0; x < w; x += 90) g.fillStyle(COLOURS.gold, 0.22).fillCircle(x, y, 8);
        }
      }
      g.fillStyle(COLOURS.wood, 1).fillRect(0, floorY, w, h - floorY);
      g.fillStyle(0x8A6046, 1).fillRect(0, floorY, w, 14);
      g.lineStyle(3, 0x5C3D2B, 0.5);
      for (let y = floorY + 60; y < h; y += 60) g.lineBetween(0, y, w, y);
      g.generateTexture(key, w, h);
      g.destroy();
    }
    scene.add.image(0, 0, key).setOrigin(0);
  },

  // ---------- Tips for grown-ups ----------
  // A small, quiet lightbulb button under the speaker. Tapping it opens
  // the PARENT GATE (src/parent-gate.js); after the right answer, the
  // grown-ups card opens (tip, privacy policy, start again).
  parentTip(scene, tipKey, withReset = false) {
    this.showTipBar(tipKey, withReset);
    const w = scene.scale.width;
    const x = w - 76, y = 178, r = 34;
    if (!scene.textures.exists('button-parent')) {
      const g = scene.make.graphics({ add: false });
      g.translateCanvas(r + 4, r + 4);
      g.fillStyle(COLOURS.wood, 0.85).fillCircle(0, 0, r);
      g.lineStyle(4, COLOURS.cream, 0.9).strokeCircle(0, 0, r);
      g.save(); g.scaleCanvas(0.75, 0.75); ICONS.bulb(g); g.restore();
      g.generateTexture('button-parent', r * 2 + 8, r * 2 + 8);
      g.destroy();
    }
    const btn = scene.add.image(x, y, 'button-parent').setDepth(40).setAlpha(0.85);
    btn.setInteractive({ hitArea: new Phaser.Geom.Circle(r + 4, r + 4, r + 14), hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true });
    btn.on('pointerup', () => ParentGate.ask(scene, () => this.showTip(scene, tipKey, withReset)));
  },

  // The always-visible tip bar at the bottom of the page
  showTipBar(tipKey, withPrivacy) {
    const el = document.getElementById('parent-tip-text');
    if (!el) return;
    el.textContent = PARENT_TIPS[tipKey] || '';
    if (withPrivacy) {
      const note = document.createElement('span');
      note.className = 'privacy';
      note.textContent = PARENT_PRIVACY_NOTE;
      el.appendChild(note);
    }
    // The bar may have changed height: let the game re-fit the space above it
    requestAnimationFrame(() => {
      if (typeof game === 'undefined') return;
      game.scale.getParentBounds();   // measure the space again...
      game.scale.refresh();           // ...and fit the game into it
    });
  },

  // Press-and-hold: a gold ring fills up; letting go early cancels quietly
  holdToActivate(scene, target, ring, x, y, radius, ms, onDone) {
    let hold = null;
    const cancel = () => {
      if (hold) { hold.remove(); hold = null; }
      ring.clear();
    };
    target.on('pointerdown', () => {
      cancel();
      const progress = { v: 0 };
      hold = scene.tweens.add({
        targets: progress, v: 1, duration: ms,
        onUpdate: () => {
          ring.clear();
          ring.lineStyle(8, COLOURS.gold, 1);
          ring.beginPath();
          ring.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress.v);
          ring.strokePath();
        },
        onComplete: () => { hold = null; ring.clear(); onDone(); }
      });
    });
    target.on('pointerup', cancel);
    target.on('pointerout', cancel);
  },

  // The tip card. Tapping anywhere closes it.
  showTip(scene, tipKey, withReset) {
    if (scene.tipOpen) return;
    scene.tipOpen = true;
    Voice.stop();
    const w = scene.scale.width, h = scene.scale.height;
    const cardW = Math.min(w - 60, 900);
    const items = [];

    const shade = scene.add.rectangle(0, 0, w, h, 0x000000, 0.45).setOrigin(0).setDepth(100).setInteractive();
    items.push(shade);

    const textStyle = (size, bold) => ({
      fontFamily: FONT, fontSize: size + 'px', fontStyle: bold ? 'bold' : 'normal',
      color: COLOURS.woodText, align: 'center', wordWrap: { width: cardW - 80 }
    });
    const heading = scene.add.text(w / 2, 0, PARENT_TIP_HEADING, textStyle(30, true)).setOrigin(0.5, 0).setDepth(102);
    const body = scene.add.text(w / 2, 0, PARENT_TIPS[tipKey] || '', textStyle(36, false)).setOrigin(0.5, 0).setDepth(102);
    body.setLineSpacing(8);
    const close = scene.add.text(w / 2, 0, PARENT_TIP_CLOSE, textStyle(24, false)).setOrigin(0.5, 0).setDepth(102).setAlpha(0.7);
    items.push(heading, body, close);
    const privacy = withReset
      ? scene.add.text(w / 2, 0, '🔒 ' + PARENT_PRIVACY_NOTE, textStyle(24, true)).setOrigin(0.5, 0).setDepth(102)
      : null;
    if (privacy) items.push(privacy);
    const privacyH = privacy ? privacy.height + 26 : 0;

    // Title screen only: read the privacy policy, and start again from zero (press-and-hold)
    let resetRing = null, resetText = null;
    const resetH = withReset ? 110 : 0;
    const policyH = withReset ? 90 : 0;

    const cardH = 70 + heading.height + 24 + body.height + 30 + privacyH + policyH + resetH + close.height + 40;
    const top = h / 2 - cardH / 2;
    const card = scene.add.graphics().setDepth(101);
    card.fillStyle(COLOURS.wood, 1).fillRoundedRect(w / 2 - cardW / 2, top + 8, cardW, cardH, 30);
    card.fillStyle(COLOURS.cream, 1).fillRoundedRect(w / 2 - cardW / 2, top, cardW, cardH, 30);
    card.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(w / 2 - cardW / 2, top, cardW, cardH, 30);
    const bulb = scene.add.image(w / 2, top, 'button-parent').setDepth(102);
    items.push(card, bulb);

    let yy = top + 50;
    heading.setY(yy); yy += heading.height + 24;
    body.setY(yy); yy += body.height + 30;
    if (privacy) { privacy.setY(yy); yy += privacyH; }

    const finish = () => {
      items.forEach((o) => o.destroy());
      scene.tipOpen = false;
      scene.closeOverlay = null;
      scene.idleTime = 0;
    };
    scene.closeOverlay = finish;   // the Android back button closes it too

    if (withReset) {
      // The full privacy policy, shown inside the game (no link out)
      const policy = scene.add.text(w / 2, yy + 34, PARENT_POLICY_LABEL, {
        fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: COLOURS.woodText,
        backgroundColor: COLOURS.goldText, padding: { x: 24, y: 14 }
      }).setOrigin(0.5).setDepth(102).setInteractive({ useHandCursor: true });
      policy.on('pointerup', () => { finish(); this.showPolicy(scene); });
      items.push(policy);
      yy += policyH;

      resetText = scene.add.text(w / 2, yy + 40, PARENT_RESET_LABEL, {
        fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: COLOURS.creamText,
        backgroundColor: COLOURS.woodText, padding: { x: 24, y: 16 }
      }).setOrigin(0.5).setDepth(102).setInteractive({ useHandCursor: true });
      resetRing = scene.add.graphics().setDepth(103);
      const rx = w / 2 - resetText.width / 2 - 34;
      this.holdToActivate(scene, resetText, resetRing, rx, yy + 40, 22, 2500, () => {
        GameState.data = GameState.fresh();
        GameState.save();
        resetText.setText(PARENT_RESET_DONE).disableInteractive();
        SFX.play(scene, 'pop');
      });
      items.push(resetText, resetRing);
      yy += resetH;
    }
    close.setY(yy);

    // Close on a fresh tap anywhere outside the buttons
    scene.time.delayedCall(300, () => {
      shade.once('pointerdown', () => { if (scene.closeOverlay === finish) finish(); });
    });
  },

  // The privacy policy, shown in full inside the game
  showPolicy(scene) {
    scene.tipOpen = true;
    const w = scene.scale.width, h = scene.scale.height;
    const cardW = Math.min(w - 60, 960);
    const items = [];
    const shade = scene.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0).setDepth(100).setInteractive();
    const heading = scene.add.text(w / 2, 0, PARENT_POLICY_HEADING, {
      fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5, 0).setDepth(102);
    const body = scene.add.text(w / 2, 0, PARENT_PRIVACY_POLICY, {
      fontFamily: FONT, fontSize: '21px', color: COLOURS.woodText, align: 'left', wordWrap: { width: cardW - 80 }, lineSpacing: 5
    }).setOrigin(0.5, 0).setDepth(102);
    const close = scene.add.text(w / 2, 0, PARENT_TIP_CLOSE, {
      fontFamily: FONT, fontSize: '22px', color: COLOURS.woodText
    }).setOrigin(0.5, 0).setDepth(102).setAlpha(0.7);
    const cardH = Math.min(h - 30, 40 + heading.height + 20 + body.height + 24 + close.height + 30);
    const top = h / 2 - cardH / 2;
    const card = scene.add.graphics().setDepth(101);
    card.fillStyle(COLOURS.cream, 1).fillRoundedRect(w / 2 - cardW / 2, top, cardW, cardH, 26);
    card.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(w / 2 - cardW / 2, top, cardW, cardH, 26);
    heading.setY(top + 30);
    body.setY(top + 30 + heading.height + 20);
    close.setY(top + cardH - close.height - 20);
    items.push(shade, card, heading, body, close);
    const finish = () => {
      items.forEach((o) => o.destroy());
      scene.tipOpen = false;
      scene.closeOverlay = null;
      scene.idleTime = 0;
    };
    scene.closeOverlay = finish;
    scene.time.delayedCall(300, () => shade.once('pointerdown', finish));
  }
};
