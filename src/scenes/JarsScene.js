// ------------------------------------------------------------
// JARS SCENE
// Three jars: Save (piggy bank), Spend (shopping bag) and
// Give (heart). The child drags coins from the tray into a jar.
// Tapping a jar opens it:
//   Save  -> see the goal and the surprises collected
//   Spend -> the shop
//   Give  -> share with a friend
// Nothing can go wrong here: a coin dropped anywhere else simply
// floats back to the tray.
// ------------------------------------------------------------

const TRAY_MAX_SHOWN = 10;

class JarsScene extends Phaser.Scene {
  constructor() {
    super('JarsScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.state = GameState.data;
    this.pile = [];

    this.layout = tall
      ? { jarY: 560, jarSize: 0.9, jarX: [170, 390, 610], floorY: 700,
          tray: { x: 360, y: 1110, w: 660, h: 230 }, perRow: 5, gap: 116, rowGap: 96 }
      : { jarY: 320, jarSize: 0.95, jarX: [330, 640, 950], floorY: 440,
          tray: { x: 640, y: 638, w: 760, h: 120 }, perRow: 10, gap: 70, rowGap: 0 };

    UI.fadeIn(this);
    UI.paintIndoors(this, this.layout.floorY);

    // The three jars
    const types = ['save', 'spend', 'give'];
    const opens = { save: 'SaveScene', spend: 'ShopScene', give: 'GiveScene' };
    this.jars = types.map((type, i) => {
      const jar = new Jar(this, this.layout.jarX[i], this.layout.jarY, type, this.layout.jarSize);
      jar.setCount(this.state.jars[type]);
      jar.onTap(() => UI.goTo(this, opens[type]));
      return jar;
    });
    this.saveJar = this.jars[0];
    const goal = GameState.nextReward();
    this.saveJar.setGoal(goal.goal, goal.key);

    // The tray of coins still to sort
    this.drawTray();
    this.buildPile();

    this.counter = UI.counter(this, w / 2, 72, 'coin', this.state.coins);
    UI.roundButton(this, 76, 72, 'button-village', ICONS.village, () => UI.goTo(this, 'VillageScene'));
    UI.speakerButton(this, 'jarsIntro');
    UI.musicButton(this);
    Music.start(this);
    this.sparkles = UI.sparkles(this);
    UI.parentTip(this, 'jars');   // tip for grown-ups

    this.setupDragging();
    UI.whenIdle(this, 5, () => this.giveHint());
    this.events.once('shutdown', () => Voice.stop());

    this.time.delayedCall(500, () => {
      if (this.state.coins > 0) Voice.sayOnce(this, 'jarsIntro');
      else if (!Voice.sayOnce(this, 'tapJar')) { /* already heard */ }
    });
  }

  drawTray() {
    const t = this.layout.tray;
    const g = this.add.graphics();
    g.fillStyle(0x5C3D2B, 1).fillRoundedRect(t.x - t.w / 2, t.y - t.h / 2 + 8, t.w, t.h, 30);
    g.fillStyle(0x8A6046, 1).fillRoundedRect(t.x - t.w / 2, t.y - t.h / 2, t.w, t.h, 30);
    g.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(t.x - t.w / 2, t.y - t.h / 2, t.w, t.h, 30);

    // Shown only when the tray is empty: a button back to the village to earn more
    this.earnButton = UI.roundButton(this, t.x, t.y, 'button-village', ICONS.village, () => UI.goTo(this, 'VillageScene'), 52);
    this.earnButton.setDepth(5);
  }

  // Lay out the coins in the tray (up to 10 at a time)
  buildPile() {
    this.pile.forEach((c) => c.destroy());
    this.pile = [];
    const t = this.layout.tray;
    const n = Math.min(this.state.coins, TRAY_MAX_SHOWN);
    const rows = Math.ceil(n / this.layout.perRow) || 1;

    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / this.layout.perRow);
      const inRow = Math.min(this.layout.perRow, n - row * this.layout.perRow);
      const col = i % this.layout.perRow;
      const x = t.x + (col - (inRow - 1) / 2) * this.layout.gap;
      const y = t.y + (row - (rows - 1) / 2) * this.layout.rowGap;
      const coin = this.add.image(x, y, 'coin').setScale(0.9).setDepth(10);
      coin.home = { x, y };
      // A bigger grab area than the coin itself
      coin.setInteractive({ hitArea: new Phaser.Geom.Circle(40, 40, 58), hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true, draggable: true });
      this.pile.push(coin);
    }
    this.earnButton.setVisible(n === 0);
    if (n === 0) this.earnButton.setInteractive(); else this.earnButton.disableInteractive();
  }

  setupDragging() {
    this.input.on('dragstart', (pointer, coin) => {
      this.hideHint();
      coin.setDepth(60);
      this.tweens.add({ targets: coin, scale: 1.15, duration: 120 });
      SFX.play(this, 'pop');
    });

    this.input.on('drag', (pointer, coin, x, y) => {
      coin.x = x;
      coin.y = y;
      this.jars.forEach((jar) => jar.highlight(jar.contains(pointer.x, pointer.y)));
    });

    this.input.on('dragend', (pointer, coin) => {
      this.jars.forEach((jar) => jar.highlight(false));
      const jar = this.jars.find((j) => j.contains(pointer.x, pointer.y));
      if (jar) {
        this.putInJar(jar, coin);
        return;
      }
      // Not over a jar: float gently back (no "wrong" sound)
      this.tweens.add({ targets: coin, x: coin.home.x, y: coin.home.y, scale: 0.9, duration: 350, ease: 'Back.easeOut',
        onComplete: () => coin.setDepth(10) });
      const moved = Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY);
      if (moved < 20) this.showDragHint();   // they tapped: show them how to drag
    });
  }

  putInJar(jar, coin) {
    coin.disableInteractive();
    this.pile = this.pile.filter((c) => c !== coin);
    this.state.coins -= 1;
    this.state.jars[jar.type] += 1;
    GameState.save();
    this.counter.set(this.state.coins);
    this.buildPile();

    const m = jar.mouth();
    this.tweens.add({
      targets: coin, x: m.x, y: m.y, scale: 0.55, duration: 220,
      onComplete: () => {
        coin.destroy();
        jar.setCount(this.state.jars[jar.type], true);
        jar.wiggle();
        SFX.play(this, 'clink');
        this.sparkles.explode(10, m.x, m.y);

        // Say which jar, unless we just said it
        const line = { save: 'intoSave', spend: 'intoSpend', give: 'intoGive' }[jar.type];
        if (this.lastJar !== jar.type) Voice.say(this, line);
        this.lastJar = jar.type;

        if (jar.type === 'save' && this.state.jars.save >= GameState.nextReward().goal) {
          this.reachGoal();
        } else if (this.state.coins === 0) {
          // All sorted! Show where to go next
          this.time.delayedCall(1300, () => this.giveHint());
        }
      }
    });
  }

  // ---------- Save goal reached: a surprise! ----------
  reachGoal() {
    const w = this.scale.width;
    const h = this.scale.height;
    const reward = GameState.nextReward();
    this.state.jars.save -= reward.goal;
    this.state.rewards.push(reward.key);
    this.state.rewardIndex += 1;
    GameState.save();
    this.input.enabled = false;

    this.time.delayedCall(450, () => {
      SFX.play(this, 'sparkle');
      Voice.say(this, 'goalReached');

      // The saved coins whoosh up out of the jar as sparkles
      const m = this.saveJar.mouth();
      this.saveJar.setCount(this.state.jars.save);
      for (let i = 0; i < 6; i++) this.time.delayedCall(i * 90, () => this.sparkles.explode(10, m.x, m.y));

      // The surprise appears, big, in the middle of the screen
      const shine = this.add.image(w / 2, h / 2, 'sparkle').setScale(0).setDepth(70).setTint(COLOURS.gold).setAlpha(0.6);
      const prize = this.add.image(m.x, m.y, reward.key).setScale(0).setDepth(71);
      this.tweens.add({ targets: shine, scale: 9, angle: 180, duration: 900, ease: 'Back.easeOut' });
      this.tweens.add({ targets: shine, angle: 360, duration: 4000, repeat: -1 });
      this.tweens.add({
        targets: prize, x: w / 2, y: h / 2, scale: 2.2, duration: 800, ease: 'Back.easeOut',
        onComplete: () => {
          SFX.play(this, 'yay');
          UI.rain(this, this.sparkles, 'sparkle');
          this.tweens.add({ targets: prize, angle: { from: -8, to: 8 }, duration: 300, yoyo: true, repeat: 4 });
        }
      });

      // Then it flies into the Save jar's picture label (the collection)
      this.time.delayedCall(3400, () => {
        const label = this.saveJar.container;
        this.tweens.add({ targets: shine, alpha: 0, duration: 400, onComplete: () => shine.destroy() });
        this.tweens.add({
          targets: prize, x: label.x, y: label.y + 186 * this.saveJar.size, scale: 0.3, duration: 700, ease: 'Cubic.easeIn',
          onComplete: () => {
            prize.destroy();
            const next = GameState.nextReward();
            this.saveJar.setGoal(next.goal, next.key);
            this.saveJar.wiggle();
            this.input.enabled = true;
            UI.celebrateBook1IfDone(this, 800);
            if (!GameState.data.book1Done || GameState.data.book1Celebrated) this.time.delayedCall(1500, () => this.giveHint());
          }
        });
      });
    });
  }

  // ---------- Gentle hints ----------
  giveHint() {
    if (!this.input.enabled) return;   // a surprise is showing: don't talk over it
    if (!this.scene.isActive() || this.hint) return;
    if (this.state.coins > 0) {
      this.showDragHint();
      return;
    }
    // Tray empty: point at ONE jar to open, the most useful first
    const j = this.state.jars;
    const cheapest = Math.min(...TREATS.map((t) => t.price));
    const pick = j.spend >= cheapest ? ['spend', 'tapSpendJar']
      : j.give > 0 ? ['give', 'tapGiveJar']
      : j.save > 0 ? ['save', 'tapSaveJar']
      : null;
    if (pick) {
      const jar = this.jars.find((x) => x.type === pick[0]);
      const c = jar.container, sz = jar.size;
      jar.wiggle();
      UI.guide(this, c.x, c.y + 35 * sz, { w: 250 * sz, h: 410 * sz, voice: pick[1], gap: 15000 });
    } else {
      UI.guideTo(this, this.earnButton, { voice: 'noCoins', gap: 15000 });
    }
  }

  // A see-through coin and a hand show how to drag a coin into a jar
  showDragHint() {
    if (this.hint || !this.pile.length) return;
    const from = this.pile[0].home;
    this.hintJar = ((this.hintJar === undefined ? -1 : this.hintJar) + 1) % this.jars.length;
    const jar = this.jars[this.hintJar];
    UI.hideGuide(this);
    const to = jar.mouth();
    const ghost = this.add.image(from.x, from.y, 'coin').setAlpha(0.6).setDepth(65);
    const hand = this.add.image(from.x + 20, from.y + 40, 'hand').setDepth(66).setScale(0.8);
    this.hint = [ghost, hand];
    this.tweens.add({ targets: ghost, x: to.x, y: to.y + 30, duration: 1100, ease: 'Sine.easeInOut', repeat: 1, repeatDelay: 300 });
    this.tweens.add({ targets: hand, x: to.x + 20, y: to.y + 70, duration: 1100, ease: 'Sine.easeInOut', repeat: 1, repeatDelay: 300,
      onComplete: () => this.hideHint() });
    UI.sayNow(this, 'jarsHint', 15000);
  }

  hideHint() {
    if (!this.hint) return;
    this.hint.forEach((o) => { this.tweens.killTweensOf(o); o.destroy(); });
    this.hint = null;
  }
}
