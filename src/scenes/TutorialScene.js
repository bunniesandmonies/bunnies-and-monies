// ------------------------------------------------------------
// HOW TO PLAY (tutorial)
// A friendly, step-by-step guide to the whole game, opened from
// the HOW TO PLAY button on the title screen or the "?" button in
// the village. Each step has a big moving picture made from the
// game's own characters, a short sentence, a spoken line, Back
// and Next buttons, and dots that show how many steps are left.
//
// The words for each step are below: change them any time. If you
// change the spoken words (src/voice.js), remake the recordings
// with tools/make_voice_lines.py.
// ------------------------------------------------------------

const TUTORIAL_STEPS = [
  { title: 'Welcome to Bunny Village!', text: "Let's learn to earn, save, spend and give carrot coins!", voice: 'tut1', picture: 'welcome' },
  { title: 'Earn Carrot Coins', text: 'Help with little jobs, like watering carrots. Every job earns a carrot coin!', voice: 'tut2', picture: 'earn' },
  { title: 'Save Your Coins', text: 'Drag coins into the Save jar. Fill it up to get a surprise!', voice: 'tut3', picture: 'save' },
  { title: 'Spend Your Coins', text: 'Visit the shop. Use your Spend coins to buy a yummy treat!', voice: 'tut4', picture: 'spend' },
  { title: 'Help Others', text: 'Give coins to fill the Sharing Basket with food for bunnies who need a little help!', voice: 'tut5', picture: 'give' },
  { title: 'Complete Your Adventure!', text: "Hooray! Earn, save, spend wisely and give. You're ready to play!", voice: 'tut6', picture: 'done' }
];

class TutorialScene extends Phaser.Scene {
  constructor() {
    super('TutorialScene');
  }

  create() {
    const w = this.scale.width, h = this.scale.height;
    const tall = h > w;
    this.from = this.registry.get('tutorialFrom') || 'TitleScene';
    if (this.from === 'TutorialScene') this.from = 'TitleScene';
    this.step = Phaser.Math.Clamp(this.registry.get('tutorialStep') || 0, 0, TUTORIAL_STEPS.length - 1);
    this.items = [];

    this.L = tall
      ? { dotsY: 58, countY: 100, titleY: 262, titleSize: 44, titleWrap: 500, panel: { x: 360, y: 590, w: 660, h: 470 },
          textY: 915, textW: 640, textSize: 38, navY: 1150, backX: 185, nextX: 535, navW: 290, navH: 104 }
      : { dotsY: 40, countY: 78, titleY: 125, titleSize: 46, panel: { x: 640, y: 338, w: 1000, h: 330 },
          textY: 562, textW: 780, textSize: 34, navY: 662, backX: 150, nextX: 1130, navW: 240, navH: 88 };
    const P = this.L.panel;
    this.k = Math.min(P.w / 740, P.h / 340);   // how big the pictures are drawn

    UI.fadeIn(this);
    UI.paintVillage(this, tall ? 300 : 290, true);
    this.add.rectangle(0, 0, w, h, COLOURS.cream, 0.55).setOrigin(0);

    // The picture frame
    const frame = this.add.graphics();
    frame.fillStyle(COLOURS.wood, 1).fillRoundedRect(P.x - P.w / 2, P.y - P.h / 2 + 10, P.w, P.h, 34);
    frame.fillStyle(0xFFF8EC, 1).fillRoundedRect(P.x - P.w / 2, P.y - P.h / 2, P.w, P.h, 34);
    frame.lineStyle(8, COLOURS.gold, 1).strokeRoundedRect(P.x - P.w / 2, P.y - P.h / 2, P.w, P.h, 34);

    // Title, sentence and progress
    this.titleText = this.add.text(w / 2, this.L.titleY, '', {
      fontFamily: FONT, fontSize: this.L.titleSize + 'px', fontStyle: 'bold', color: COLOURS.goldText,
      stroke: COLOURS.woodText, strokeThickness: 10, align: 'center', wordWrap: { width: this.L.titleWrap || w - 80 }
    }).setOrigin(0.5);
    this.sentence = this.add.text(w / 2, this.L.textY, '', {
      fontFamily: FONT, fontSize: this.L.textSize + 'px', fontStyle: 'bold', color: COLOURS.woodText,
      align: 'center', wordWrap: { width: this.L.textW }, lineSpacing: 6
    }).setOrigin(0.5);
    this.countText = this.add.text(w / 2, this.L.countY, '', {
      fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5).setAlpha(0.8);
    this.dots = TUTORIAL_STEPS.map((s, i) => this.add.circle(w / 2 + (i - (TUTORIAL_STEPS.length - 1) / 2) * 44, this.L.dotsY, 13));

    // Top buttons: close (back to where you were), hear it again, music
    UI.roundButton(this, 76, 72, 'button-close', ICONS.close, () => this.leave(this.from));
    UI.roundButton(this, w - 76, 72, 'button-speaker', ICONS.speaker, () => Voice.say(this, TUTORIAL_STEPS[this.step].voice));
    UI.musicButton(this);
    Music.start(this);

    // Back and Next
    this.backBtn = this.navButton(this.L.backX, '◀  BACK', false, () => this.go(-1));
    this.nextBtn = this.navButton(this.L.nextX, 'NEXT  ▶', true, () => this.go(1));
    // On phones held upright there's less room, so LET'S PLAY sits where NEXT was
    this.playBtn = tall
      ? this.navButton(this.L.nextX, "LET'S PLAY!", true, () => this.leave('VillageScene'), false, 40)
      : this.navButton(w / 2, "LET'S PLAY!", true, () => this.leave('VillageScene'), true);

    // Keyboard arrows also work on computers
    this.input.keyboard.on('keydown-RIGHT', () => this.go(1));
    this.input.keyboard.on('keydown-LEFT', () => this.go(-1));
    this.input.keyboard.on('keydown-ESC', () => this.leave(this.from));

    this.sparkles = UI.sparkles(this);
    this.hearts = UI.sparkles(this, 'heart', [0xE74C3C, 0xF5A9B8, 0xFFFFFF]);

    // If nobody taps for a while, the Next button gives a little bounce
    UI.whenIdle(this, 9, () => {
      const btn = this.step === TUTORIAL_STEPS.length - 1 ? this.playBtn : this.nextBtn;
      this.tweens.add({ targets: btn, scale: 1.1, duration: 250, yoyo: true, repeat: 2 });
    });

    UI.parentTip(this, 'tutorial');   // tip for grown-ups
    this.events.once('shutdown', () => Voice.stop());
    this.showStep(this.step);
  }

  // A big, friendly Back / Next / Let's Play button
  navButton(x, label, primary, onTap, big = false, fontSize = null) {
    const bw = big ? this.L.navW + 120 : this.L.navW, bh = big ? this.L.navH + 12 : this.L.navH;
    const btn = this.add.container(x, this.L.navY).setDepth(40);
    const g = this.add.graphics();
    g.fillStyle(COLOURS.wood, 1).fillRoundedRect(-bw / 2, -bh / 2 + 8, bw, bh, 30);
    g.fillStyle(primary ? COLOURS.gold : COLOURS.cream, 1).fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 30);
    g.lineStyle(6, COLOURS.wood, 1).strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 30);
    btn.add([g, this.add.text(0, 2, label, {
      fontFamily: FONT, fontSize: (fontSize || (big ? 44 : 34)) + 'px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5)]);
    btn.setInteractive({ hitArea: new Phaser.Geom.Rectangle(-bw / 2 - 15, -bh / 2 - 15, bw + 30, bh + 30),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
    btn.on('pointerdown', () => { btn.setScale(0.94); SFX.play(this, 'pop'); });
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerup', () => { btn.setScale(1); onTap(); });
    return btn;
  }

  go(delta) {
    const next = this.step + delta;
    if (next < 0 || next >= TUTORIAL_STEPS.length || this._leaving) return;
    this.showStep(next);
  }

  leave(target) {
    this.registry.set('tutorialStep', 0);
    UI.goTo(this, target);
  }

  // ---------- Show one step ----------
  showStep(i) {
    this.step = i;
    this.registry.set('tutorialStep', i);
    const s = TUTORIAL_STEPS[i];
    const last = i === TUTORIAL_STEPS.length - 1;

    // Clear the last step's picture and its animations
    this.items.forEach((o) => { this.tweens.killTweensOf(o); o.destroy(); });
    this.items = [];
    (this.timers || []).forEach((t) => t.remove());
    this.timers = [];

    this.titleText.setText(s.title);
    this.sentence.setText(s.text);
    this.countText.setText(`Step ${i + 1} of ${TUTORIAL_STEPS.length}`);
    this.dots.forEach((d, n) => {
      d.setFillStyle(n <= i ? COLOURS.gold : COLOURS.cream).setStrokeStyle(5, COLOURS.wood).setScale(n === i ? 1.35 : 1);
    });

    this.backBtn.setVisible(i > 0);
    if (i > 0) this.backBtn.setInteractive(); else this.backBtn.disableInteractive();
    this.nextBtn.setVisible(!last);
    if (!last) this.nextBtn.setInteractive(); else this.nextBtn.disableInteractive();
    this.playBtn.setVisible(last);
    if (last) {
      this.playBtn.setInteractive();
      this.tweens.add({ targets: this.playBtn, scale: 1.06, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else {
      this.tweens.killTweensOf(this.playBtn);
      this.playBtn.disableInteractive().setScale(1);
    }

    // Gentle entrance for the new picture
    this['picture_' + s.picture]();
    this.items.forEach((o) => {
      if (o.alpha === undefined) return;
      const a = o.alpha;
      o.setAlpha(0);
      this.tweens.add({ targets: o, alpha: a, duration: 300 });
    });

    Voice.stop();
    this.timers.push(this.time.delayedCall(350, () => Voice.say(this, s.voice)));
  }

  // ---------- Helpers for drawing inside the picture frame ----------
  // Pictures are designed on an 800 x 340 board, centred in the frame
  P(x, y) { return [this.L.panel.x + x * this.k, this.L.panel.y + y * this.k]; }

  img(key, x, y, size, opts = {}) {
    const [px, py] = this.P(x, y);
    const o = this.add.image(px, py, key).setDepth(20);
    if (opts.bottom) o.setOrigin(0.5, 1);
    if (opts.height) o.setScale((opts.height * this.k) / o.height); else o.setScale(size * this.k);
    if (opts.flip) o.setFlipX(true);
    this.items.push(o);
    return o;
  }

  label(str, x, y, size) {
    const [px, py] = this.P(x, y);
    const t = this.add.text(px, py, str, {
      fontFamily: FONT, fontSize: Math.round(size * this.k) + 'px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5).setDepth(21);
    this.items.push(t);
    return t;
  }

  pad(x, y, r) {
    const [px, py] = this.P(x, y);
    const c = this.add.circle(px, py, r * this.k, COLOURS.cream).setStrokeStyle(6, COLOURS.wood).setDepth(18);
    this.items.push(c);
    return c;
  }

  ground(color = 0x9ACD6E) {
    const P = this.L.panel;
    const g = this.add.graphics().setDepth(17);
    g.fillStyle(color, 1).fillRoundedRect(P.x - P.w / 2 + 8, P.y + 95 * this.k, P.w - 16, P.h / 2 - 95 * this.k - 8, { tl: 0, tr: 0, bl: 28, br: 28 });
    this.items.push(g);
  }

  hand(x, y) {
    const h = this.img('hand', x, y, 0.8);
    h.setOrigin(0.4, 0.05).setDepth(30);
    return h;
  }

  every(ms, fn) {
    fn();
    this.timers.push(this.time.addEvent({ delay: ms, loop: true, callback: fn }));
  }

  hop(o, height = 30, delay = 0) {
    this.tweens.add({ targets: o, y: o.y - height * this.k, duration: 260, yoyo: true, repeat: -1, repeatDelay: 900, delay, ease: 'Quad.easeOut' });
  }

  fly(key, from, to, size, ms, onDone) {
    const [fx, fy] = this.P(...from), [tx, ty] = this.P(...to);
    const o = this.add.image(fx, fy, key).setScale(size * this.k).setDepth(29);
    this.items.push(o);
    this.tweens.add({ targets: o, x: tx, y: ty, duration: ms, ease: 'Sine.easeInOut', onComplete: () => {
      o.setVisible(false);
      if (onDone) onDone();
    } });
    return o;
  }

  // ---------- Step pictures ----------
  // 1. Welcome: the bunny family in their village, coins twinkling
  picture_welcome() {
    this.ground();
    this.img('bunny-house-0', -300, 105, 0.85, { bottom: true });
    this.img('tree', -175, 100, 0.65, { bottom: true });
    this.img('bunny-house-2', 305, 105, 0.85, { bottom: true });
    this.img('tree', 185, 95, 0.55, { bottom: true });
    const harvey = this.img('harvey', -130, 150, 0, { bottom: true, height: 170 });
    const connor = this.img(MAIN_CHARACTER, 0, 155, 0, { bottom: true, height: 250 });
    const lili = this.img(FRIEND_CHARACTER, 135, 150, 0, { bottom: true, height: 150, flip: true });
    this.hop(connor, 30, 0); this.hop(harvey, 22, 300); this.hop(lili, 22, 600);
    [[-330, -110], [-90, -130], [110, -120], [330, -100]].forEach(([x, y], n) => {
      const c = this.img('coin', x, y, 0.55);
      this.tweens.add({ targets: c, y: c.y - 14 * this.k, duration: 900, yoyo: true, repeat: -1, delay: n * 200, ease: 'Sine.easeInOut' });
    });
    this.every(1600, () => this.sparkles.explode(8, ...this.P(Phaser.Math.Between(-330, 330), -110)));
  }

  // 2. Earn: a hand taps each job, a coin pops out and flies to the counter
  picture_earn() {
    const jobs = [-260, 0, 260];
    jobs.forEach((x) => this.pad(x, 25, 105));
    this.img('soil', -260, 70, 0.55);
    [-305, -260, -215].forEach((x) => this.img('carrot', x, 72, 0.45, { bottom: true }));
    this.img('watering-can', -285, -20, 0.45);
    this.img('toybox', 0, 70, 0.5);
    this.img('ball', -45, -5, 0.55); this.img('block-blue', 45, -20, 0.55);
    this.img('bowl', 285, 75, 0.5); this.img('chick', 235, 45, 0.6);
    const coinIcon = this.img('coin', -40, -135, 0.55);
    const count = this.label('0', 25, -133, 48);
    const hand = this.hand(-260, 60);
    let n = 0;
    this.every(1700, () => {
      const i = n % 3;
      this.tweens.add({ targets: hand, x: this.P(jobs[i], 60)[0], y: this.P(jobs[i], 60)[1], duration: 450, ease: 'Sine.easeInOut',
        onComplete: () => {
          this.tweens.add({ targets: hand, scale: hand.scale * 0.85, duration: 100, yoyo: true });
          SFX.play(this, 'pop');
          this.sparkles.explode(8, ...this.P(jobs[i], -40));
          this.fly('coin', [jobs[i], -40], [-40, -135], 0.55, 600, () => {
            n += 1;
            count.setText(String(n % 3 === 0 ? 3 : n % 3));
            if (n % 3 === 0) this.timers.push(this.time.delayedCall(900, () => count.setText('0')));
            this.tweens.add({ targets: coinIcon, scale: coinIcon.scale * 1.25, duration: 120, yoyo: true });
            SFX.play(this, 'coin');
          });
        } });
    });
  }

  // 3. Save: coins are dragged into the Save jar until it's full, then a surprise!
  picture_save() {
    const pile = [[-250, 30], [-170, 60], [-250, 95]].map(([x, y]) => this.img('coin', x, y, 0.8));
    this.img(MAIN_CHARACTER, -350, 160, 0, { bottom: true, height: 200 });
    const [jx, jy] = this.P(170, -25);
    const jar = new Jar(this, jx, jy, 'save', 0.72 * this.k);
    jar.container.setDepth(20);
    jar.setGoal(3, 'reward-ball');
    jar.setCount(0);
    this.items.push(jar.container);
    const hand = this.hand(-280, 60);
    let n = 0;
    this.every(1900, () => {
      if (n >= 3) {   // full: the surprise appears, then start again
        const ball = this.img('reward-ball', 170, -80, 0.1);
        this.tweens.add({ targets: ball, scale: 0.9 * this.k, y: ball.y - 70 * this.k, duration: 500, ease: 'Back.easeOut' });
        this.sparkles.explode(20, ...this.P(170, -90));
        SFX.play(this, 'sparkle');
        this.timers.push(this.time.delayedCall(1500, () => {
          ball.destroy(); n = 0; jar.setCount(0); pile.forEach((c) => c.setVisible(true));
        }));
        n = 4;
        return;
      }
      if (n > 3) return;
      const from = pile[n];
      from.setVisible(false);
      const [sx, sy] = [from.x, from.y];
      hand.setPosition(sx, sy + 10 * this.k);
      const ghost = this.add.image(sx, sy, 'coin').setScale(0.65 * this.k).setDepth(29);
      this.items.push(ghost);
      const [tx, ty] = this.P(170, -110);
      this.tweens.add({ targets: [ghost, hand], x: tx, y: (t) => (t === hand ? ty + 20 * this.k : ty), duration: 900, ease: 'Sine.easeInOut',
        onComplete: () => { ghost.destroy(); n += 1; jar.setCount(n, true); SFX.play(this, 'clink'); } });
    });
  }

  // 4. Spend: Connor buys a cupcake from Mama's shop
  picture_spend() {
    const mama = this.img('mama', 270, 70, 0, { bottom: true, height: 190, flip: true });
    this.tweens.add({ targets: mama, y: mama.y - 6 * this.k, duration: 900, yoyo: true, repeat: -1 });
    this.img('kiosk', 270, 105, 0.62);
    const shelfY = 20;
    const [sx, sy] = this.P(-10, shelfY);
    const shelf = this.add.rectangle(sx, sy, 300 * this.k, 14 * this.k, COLOURS.wood).setDepth(19);
    this.items.push(shelf);
    const treats = [['treat-cupcake', -100, 2], ['treat-lollipop', -10, 2], ['treat-balloon', 80, 3]];
    const shown = treats.map(([key, x, price]) => {
      const t = this.img(key, x, shelfY - 6, 0, { bottom: true, height: 95 });
      for (let p = 0; p < price; p++) this.img('coin', x + (p - (price - 1) / 2) * 26, shelfY + 30, 0.28);
      return t;
    });
    this.img(MAIN_CHARACTER, -310, 160, 0, { bottom: true, height: 220 });
    this.img('basket', -190, 150, 0.45);
    const hand = this.hand(-100, -20);
    this.every(3200, () => {
      this.tweens.add({ targets: hand, scale: hand.scale * 0.85, duration: 120, yoyo: true });
      SFX.play(this, 'pop');
      this.fly('coin', [-280, 20], [250, -40], 0.45, 700);
      this.timers.push(this.time.delayedCall(180, () => this.fly('coin', [-280, 20], [250, -40], 0.45, 700, () => SFX.play(this, 'clink'))));
      this.timers.push(this.time.delayedCall(1100, () => {
        const c = this.fly('treat-cupcake', [-100, -45], [-190, 115], 0.55, 700, () => {
          SFX.play(this, 'coin');
          this.sparkles.explode(12, ...this.P(-190, 120));
        });
        c.setScale(0.6 * this.k);
        shown[0].setAlpha(0.3);
        this.timers.push(this.time.delayedCall(1900, () => shown[0].setAlpha(1)));
      }));
    });
  }

  // 5. Give: coins from the Give jar turn into food in the Sharing Basket,
  //    for bunnies who need a little help. Liliana, the helper, hops for joy.
  picture_give() {
    const [jx, jy] = this.P(-280, -25);
    const jar = new Jar(this, jx, jy, 'give', 0.72 * this.k);
    jar.container.setDepth(20);
    jar.setCount(3);
    this.items.push(jar.container);
    this.img(MAIN_CHARACTER, -70, 160, 0, { bottom: true, height: 210 });
    const lili = this.img(FRIEND_CHARACTER, 320, 160, 0, { bottom: true, height: 175, flip: true });
    this.img('share-basket-back', 150, 160, 0.62, { bottom: true });
    this.img('share-basket-front', 150, 160, 0.62, { bottom: true }).setDepth(22);
    const baseY = lili.y;
    const spots = [[-48, 86], [48, 86], [0, 80]];
    let food = [];
    let left = 3;
    this.every(2400, () => {
      this.fly('coin', [-280, -110], [150, 40], 0.6, 800, () => {
        left = left > 1 ? left - 1 : 3;
        jar.setCount(left);
        if (food.length >= 3) { food.forEach((f) => f.destroy()); food = []; }
        const n = food.length;
        const [px, py] = this.P(150 + spots[n][0] * 0.62, spots[n][1]);
        const f = this.add.image(px, py, SHARING_FOODS[n]).setOrigin(0.5, 0.75).setDepth(21).setScale(0);
        this.items.push(f);
        food.push(f);
        this.tweens.add({ targets: f, scale: 0.55 * this.k, duration: 400, ease: 'Back.easeOut' });
        SFX.play(this, 'coin');
        this.hearts.explode(10, ...this.P(150, 20));
        this.tweens.add({ targets: lili, y: baseY - 45 * this.k, duration: 220, yoyo: true, ease: 'Quad.easeOut' });
      });
    });
  }

  // 6. Done: the whole family celebrates, with a tick for each skill
  picture_done() {
    this.ground();
    const fam = [['dada', -290, 190], ['mama', -150, 175], [MAIN_CHARACTER, 0, 230], ['harvey', 145, 165], [FRIEND_CHARACTER, 280, 145]];
    fam.forEach(([key, x, hgt], n) => {
      const b = this.img(key, x, 158, 0, { bottom: true, height: hgt, flip: x > 0 && key === FRIEND_CHARACTER });
      this.hop(b, 26, n * 160);
    });
    ['coin', 'label-save', 'label-spend', 'label-give'].forEach((key, n) => {
      const x = -210 + n * 140;
      this.img(key, x, -120, key === 'coin' ? 0.6 : 0.5);
      const tick = this.img('tick', x + 34, -145, 0.01);
      this.timers.push(this.time.delayedCall(500 + n * 450, () => {
        this.tweens.add({ targets: tick, scale: 0.4 * this.k, duration: 300, ease: 'Back.easeOut' });
        SFX.play(this, 'pop');
      }));
    });
    this.timers.push(this.time.delayedCall(2500, () => SFX.play(this, 'yay')));
    this.every(1300, () => this.sparkles.explode(14, ...this.P(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-150, 0))));
  }
}
