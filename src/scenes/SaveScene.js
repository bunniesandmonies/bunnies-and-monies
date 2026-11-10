// ------------------------------------------------------------
// SAVE SCENE (Save jar)
// Shows how close the child is to the next surprise:
//  - the surprise as a mystery shape, with a "?" sparkle
//  - a row of coin spaces, filled in for every coin saved
//  - the Save jar itself
//  - a shelf with every surprise: collected ones in colour (tap
//    to play with them), the rest as mystery shapes.
// Goals and surprises are set in src/config.js (SAVE_REWARDS).
// ------------------------------------------------------------

class SaveScene extends Phaser.Scene {
  constructor() {
    super('SaveScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.state = GameState.data;
    const next = GameState.nextReward();

    this.layout = tall
      ? { floorY: 1060, mystery: [360, 300], slots: { y: 450, perRow: 5, gap: 76 },
          jar: [360, 720, 0.95], shelf: { y: 1160, left: 50, right: 670 } }
      : { floorY: 560, mystery: [820, 250], slots: { y: 400, perRow: 10, gap: 66 },
          jar: [300, 330, 0.95], shelf: { y: 650, left: 520, right: 1230 } };

    UI.fadeIn(this);
    UI.paintIndoors(this, this.layout.floorY);

    // The next surprise, as a mystery shape
    const [mx, my] = this.layout.mystery;
    const glow = this.add.image(mx, my, 'sparkle').setScale(5).setTint(COLOURS.gold).setAlpha(0.35);
    this.tweens.add({ targets: glow, angle: 360, duration: 8000, repeat: -1 });
    const mystery = this.add.image(mx, my, next.key);
    mystery.setScale(170 / mystery.height).setTintFill(COLOURS.wood).setAlpha(0.6);
    this.tweens.add({ targets: mystery, y: my - 10, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const q = this.add.text(mx + 90, my - 70, '?', {
      fontFamily: FONT, fontSize: '90px', fontStyle: 'bold', color: COLOURS.goldText, stroke: COLOURS.woodText, strokeThickness: 10
    }).setOrigin(0.5);
    this.tweens.add({ targets: q, angle: { from: -10, to: 10 }, duration: 600, yoyo: true, repeat: -1 });
    mystery.setInteractive({ useHandCursor: true });
    mystery.on('pointerdown', () => { SFX.play(this, 'sparkle'); Voice.say(this, 'saveIntro'); });

    this.drawSlots(next.goal);

    // The Save jar
    const [jx, jy, js] = this.layout.jar;
    const jar = new Jar(this, jx, jy, 'save', js);
    jar.setCount(this.state.jars.save);
    jar.setGoal(next.goal, next.key);

    this.drawShelf();

    UI.counter(this, w / 2, 72, 'label-save', this.state.jars.save, 0.75);
    this.backButton = UI.backButton(this, 'JarsScene');
    UI.speakerButton(this, 'saveIntro');
    UI.musicButton(this);
    Music.start(this);
    this.sparkles = UI.sparkles(this);
    UI.parentTip(this, 'save');   // tip for grown-ups

    // When idle: take turns showing the toys to play with, and the way
    // back to earn more coins for the next surprise
    this.idleTurn = 0;
    UI.whenIdle(this, 8, () => {
      this.idleTurn += 1;
      const toys = this.toys.filter((t) => t.unlocked);
      if (toys.length && this.idleTurn % 2 === 1) toys.forEach((t) => UI.pulse(this, t.img, 1));
      else UI.guideTo(this, this.backButton, { voice: 'saveMore', gap: 20000 });
    });
    this.events.once('shutdown', () => Voice.stop());
    this.time.delayedCall(500, () => Voice.sayOnce(this, 'saveIntro'));
  }

  // One space per coin needed: filled with a coin when saved
  drawSlots(goal) {
    const s = this.layout.slots;
    const saved = Math.min(this.state.jars.save, goal);
    const rows = Math.ceil(goal / s.perRow);
    const g = this.add.graphics();
    for (let i = 0; i < goal; i++) {
      const row = Math.floor(i / s.perRow);
      const inRow = Math.min(s.perRow, goal - row * s.perRow);
      const x = this.layout.mystery[0] + ((i % s.perRow) - (inRow - 1) / 2) * s.gap;
      const y = s.y + row * 72 - ((rows - 1) * 72) / 2 + (rows > 1 ? 36 : 0);
      g.fillStyle(COLOURS.white, 0.7).fillCircle(x, y, 27);
      g.lineStyle(4, COLOURS.wood, 0.5).strokeCircle(x, y, 27);
      if (i < saved) {
        const coin = this.add.image(x, y, 'coin').setScale(0);
        this.tweens.add({ targets: coin, scale: 0.62, delay: 300 + i * 90, duration: 250, ease: 'Back.easeOut' });
      }
    }
  }

  // The shelf of surprises
  drawShelf() {
    const sh = this.layout.shelf;
    const g = this.add.graphics();
    g.fillStyle(0x5C3D2B, 1).fillRoundedRect(sh.left, sh.y + 8, sh.right - sh.left, 24, 8);
    g.fillStyle(COLOURS.gold, 1).fillRoundedRect(sh.left, sh.y, sh.right - sh.left, 24, 8);

    const keys = SAVE_REWARDS.map((r) => r.key).filter((k, i, all) => all.indexOf(k) === i);
    const step = (sh.right - sh.left) / keys.length;
    this.toys = keys.map((key, i) => {
      const count = this.state.rewards.filter((r) => r === key).length;
      const x = sh.left + step * (i + 0.5);
      const img = this.add.image(x, sh.y + 4, key).setOrigin(0.5, 1);
      img.setScale(110 / img.height);
      img.baseY = img.y;
      const toy = { key, img, unlocked: count > 0 };
      if (!toy.unlocked) {
        img.setTintFill(COLOURS.wood).setAlpha(0.3);   // still a mystery
      } else {
        img.setInteractive({ useHandCursor: true });
        img.on('pointerdown', () => this.playWith(toy));
        if (count > 1) {
          this.add.text(x + 50, sh.y - 100, '×' + count, {
            fontFamily: FONT, fontSize: '36px', fontStyle: 'bold', color: '#FFFFFF', stroke: COLOURS.woodText, strokeThickness: 8
          }).setOrigin(0.5);
        }
      }
      return toy;
    });
  }

  // Each surprise does something fun when tapped
  playWith(toy) {
    const img = toy.img;
    if (this.tweens.isTweening(img)) return;
    this.sparkles.explode(10, img.x, img.y - img.displayHeight / 2);
    const base = img.baseY;
    switch (toy.key) {
      case 'reward-ball':
        SFX.play(this, 'boing');
        this.tweens.chain({ targets: img, tweens: [
          { y: base - 160, duration: 300, ease: 'Quad.easeOut' }, { y: base, duration: 300, ease: 'Bounce.easeOut' },
          { y: base - 80, duration: 200, ease: 'Quad.easeOut' }, { y: base, duration: 250, ease: 'Bounce.easeOut' }
        ] });
        break;
      case 'reward-kite':
        SFX.play(this, 'sparkle');
        this.tweens.chain({ targets: img, tweens: [
          { y: base - 220, angle: 15, duration: 700, ease: 'Sine.easeOut' },
          { angle: -15, duration: 400, yoyo: true, repeat: 1 },
          { y: base, angle: 0, duration: 700, ease: 'Sine.easeIn' }
        ] });
        break;
      case 'reward-drum':
        SFX.play(this, 'drum');
        this.tweens.add({ targets: img, scaleY: img.scaleY * 0.85, duration: 110, yoyo: true, repeat: 2 });
        break;
      default:
        SFX.play(this, 'yay');
        this.tweens.add({ targets: img, angle: 360, y: base - 40, duration: 700, yoyo: false,
          onComplete: () => { img.setAngle(0); this.tweens.add({ targets: img, y: base, duration: 200 }); } });
    }
  }
}
