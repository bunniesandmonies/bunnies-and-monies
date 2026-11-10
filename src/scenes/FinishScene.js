// ------------------------------------------------------------
// FINISH SCENE: "You finished Book 1!"
// A big party when the child has used all four money skills
// (earn, save, spend, give; goals in src/config.js BOOK1_GOALS).
// It shows a Money Skills certificate with what they did, the
// bunny family celebrating, and a KEEP PLAYING button. The game
// carries on afterwards; nothing is reset.
// It opens once, automatically, and any time from the gold
// badges at the top of the village.
// No names or personal details are asked for.
// ------------------------------------------------------------

class FinishScene extends Phaser.Scene {
  constructor() {
    super('FinishScene');
  }

  create() {
    const w = this.scale.width, h = this.scale.height;
    const tall = h > w;
    const d = GameState.data;
    const firstTime = !d.book1Celebrated;
    d.book1Celebrated = true;
    GameState.save();

    const L = tall
      ? { titleY: 205, titleSize: 58, subY: 330, card: { x: 360, y: 610, w: 660, h: 440 }, grid: true,
          family: [[MAIN_CHARACTER, 185, 1100, 235], [FRIEND_CHARACTER, 540, 1100, 195, true]], playY: 1185 }
      : { titleY: 92, titleSize: 64, subY: 158, card: { x: 640, y: 392, w: 720, h: 300 }, grid: false,
          family: [[MAIN_CHARACTER, 135, 640, 300], [FRIEND_CHARACTER, 1150, 640, 240, true]], playY: 640 };

    UI.fadeIn(this);
    UI.paintVillage(this, tall ? 300 : 290, true);
    this.add.rectangle(0, 0, w, h, COLOURS.cream, 0.5).setOrigin(0);

    // Title
    const title = this.add.text(w / 2, L.titleY, tall ? 'You finished\nBook 1!' : 'You finished Book 1!', {
      fontFamily: FONT, fontSize: L.titleSize + 'px', fontStyle: 'bold', color: COLOURS.goldText,
      stroke: COLOURS.woodText, strokeThickness: 12, align: 'center'
    }).setOrigin(0.5).setScale(0).setDepth(50);
    this.tweens.add({ targets: title, scale: 1, duration: 600, ease: 'Back.easeOut' });
    this.tweens.add({ targets: title, angle: { from: -2, to: 2 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 600 });
    this.add.text(w / 2, L.subY, 'The Carrot Coin Mystery', {
      fontFamily: FONT, fontSize: '32px', fontStyle: 'bold', color: COLOURS.woodText,
      stroke: COLOURS.creamText, strokeThickness: 8
    }).setOrigin(0.5).setDepth(50);

    this.makeCertificate(L, d);

    // The bunnies celebrate
    L.family.forEach(([key, x, feetY, height, flip], i) => {
      const b = UI.character(this, key, x, feetY, height, !!flip);
      this.tweens.add({ targets: b, y: feetY - 45, duration: 280, yoyo: true, repeat: -1, repeatDelay: 700, delay: i * 350, ease: 'Quad.easeOut' });
    });

    // KEEP PLAYING (back to the village; nothing is reset)
    this.makeKeepPlaying(w / 2, L.playY);

    UI.homeButton(this);
    UI.speakerButton(this, 'book1Done');
    UI.musicButton(this);
    Music.start(this);
    UI.parentTip(this, 'finish');

    // Confetti, coins and a hooray
    this.sparkles = UI.sparkles(this, 'sparkle', [COLOURS.gold, 0xFFFFFF, 0xF5A9B8, 0x5DADE2, 0xC86DD7]);
    const party = () => UI.rain(this, this.sparkles);
    party();
    this.time.addEvent({ delay: 3500, repeat: firstTime ? 3 : 0, callback: party });
    SFX.play(this, 'yay');
    this.time.delayedCall(700, () => Voice.say(this, firstTime ? 'book1Done' : 'certificate'));

    this.events.once('shutdown', () => Voice.stop());
  }

  // The Money Skills certificate: one column (or square) per skill, with what the child did
  makeCertificate(L, d) {
    const c = L.card;
    const g = this.add.graphics();
    g.fillStyle(COLOURS.wood, 1).fillRoundedRect(c.x - c.w / 2, c.y - c.h / 2 + 10, c.w, c.h, 30);
    g.fillStyle(0xFFF8EC, 1).fillRoundedRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 30);
    g.lineStyle(8, COLOURS.gold, 1).strokeRoundedRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 30);
    g.lineStyle(3, COLOURS.gold, 1).strokeRoundedRect(c.x - c.w / 2 + 14, c.y - c.h / 2 + 14, c.w - 28, c.h - 28, 22);

    this.add.text(c.x, c.y - c.h / 2 + 46, 'Money Skills Certificate', {
      fontFamily: FONT, fontSize: '32px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5);
    const medal = this.add.image(c.x + c.w / 2 - 40, c.y - c.h / 2 + 30, 'reward-trophy').setScale(0.55);
    this.tweens.add({ targets: medal, angle: { from: -8, to: 8 }, duration: 700, yoyo: true, repeat: -1 });

    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    const skills = [
      { icon: 'coin', word: 'Earn', note: plural(d.earned, 'coin', 'coins') },
      { icon: 'label-save', word: 'Save', note: plural(d.rewards.length, 'surprise', 'surprises') },
      { icon: 'label-spend', word: 'Spend', note: plural(d.treats.length, 'treat', 'treats') },
      { icon: 'label-give', word: 'Give', note: plural(d.gifts, 'heart', 'hearts') }
    ];
    skills.forEach((s, i) => {
      const x = L.grid ? c.x + (i % 2 ? 150 : -150) : c.x + (i - 1.5) * 165;
      const y = L.grid ? c.y - 45 + Math.floor(i / 2) * 165 : c.y + 10;
      const icon = this.add.image(x, y - 25, s.icon).setScale(0);
      this.tweens.add({ targets: icon, scale: s.icon === 'coin' ? 1 : 0.8, duration: 400, delay: 400 + i * 300, ease: 'Back.easeOut' });
      const tick = this.add.image(x + 38, y - 60, 'tick').setScale(0);
      this.tweens.add({ targets: tick, scale: 0.42, duration: 300, delay: 700 + i * 300, ease: 'Back.easeOut',
        onStart: () => SFX.play(this, 'pop') });
      this.add.text(x, y + 38, s.word, { fontFamily: FONT, fontSize: '30px', fontStyle: 'bold', color: COLOURS.woodText }).setOrigin(0.5);
      this.add.text(x, y + 72, s.note, { fontFamily: FONT, fontSize: '22px', color: COLOURS.woodText }).setOrigin(0.5).setAlpha(0.85);
    });
  }

  makeKeepPlaying(x, y) {
    const bw = 440, bh = 100;
    const btn = this.add.container(x, y).setDepth(40);
    const g = this.add.graphics();
    g.fillStyle(COLOURS.wood, 1).fillRoundedRect(-bw / 2, -bh / 2 + 10, bw, bh, 34);
    g.fillStyle(COLOURS.gold, 1).fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 34);
    g.lineStyle(7, COLOURS.wood, 1).strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 34);
    btn.add([g, this.add.text(0, 2, '▶  KEEP PLAYING', { fontFamily: FONT, fontSize: '42px', fontStyle: 'bold', color: COLOURS.woodText }).setOrigin(0.5)]);
    btn.setInteractive({ hitArea: new Phaser.Geom.Rectangle(-bw / 2 - 15, -bh / 2 - 15, bw + 30, bh + 40),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
    this.tweens.add({ targets: btn, scale: 1.05, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    btn.on('pointerdown', () => SFX.play(this, 'pop'));
    btn.on('pointerup', () => UI.goTo(this, 'VillageScene'));
  }
}
