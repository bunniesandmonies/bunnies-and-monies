// ------------------------------------------------------------
// GIVE SCENE (Give jar): the village Sharing Basket
// Connor helps bunnies who need a little help. Tap a coin (or drag
// it to the basket, or just tap the basket) and it flies to Liliana,
// the cheerful helper, who catches it as food (a carrot, an apple or
// bread) with a happy little reaction and pops it into the Sharing
// Basket. When the basket is full, it is sent off to bunny families
// who need it, a fresh empty basket arrives, and a thank-you card
// from the bunny families flutters in. A new heart joins the
// kindness row at the top for every coin given.
// The basket size is SHARING_BASKET_SIZE in src/config.js.
// ------------------------------------------------------------

const HEARTS_SHOWN = 10;

class GiveScene extends Phaser.Scene {
  constructor() {
    super('GiveScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.state = GameState.data;
    this.pile = [];

    this.layout = tall
      ? { horizon: 360, connor: [150, 900, 270], friend: [625, 860, 210], basket: [440, 905, 0.9],
          tray: { x: 360, y: 1110, w: 640, h: 230 }, perRow: 5, gap: 112, rowGap: 96,
          hearts: { y: 220, perRow: 5, gap: 70 } }
      : { horizon: 290, connor: [220, 600, 330], friend: [1185, 590, 250], basket: [950, 610, 1],
          tray: { x: 580, y: 560, w: 420, h: 200 }, perRow: 5, gap: 76, rowGap: 76,
          hearts: { y: 190, perRow: 10, gap: 58 } };

    UI.fadeIn(this);
    UI.paintVillage(this, this.layout.horizon, false);

    const [cx, cy, ch] = this.layout.connor;
    this.connor = UI.character(this, MAIN_CHARACTER, cx, cy, ch);
    const [fx, fy, fh] = this.layout.friend;
    this.friend = UI.character(this, FRIEND_CHARACTER, fx, fy, fh, true);   // Liliana, the basket helper
    this.makeBasket();

    // Tapping the basket (or Liliana) gives the next coin
    const tapToGive = () => {
      if (this.pile.length) this.giveCoin(this.pile[this.pile.length - 1]);
      else { UI.cheer(this, this.friend); UI.sayNow(this, 'giveEmpty', 5000); }
    };
    this.friend.setInteractive({ useHandCursor: true }).on('pointerdown', tapToGive);
    this.basketZone.on('pointerdown', tapToGive);

    this.drawTray();
    this.buildPile();

    this.heartsRow = this.add.container(0, 0);
    this.refreshHearts();

    this.counter = UI.counter(this, w / 2, 72, 'label-give', this.state.jars.give, 0.75);
    this.backButton = UI.backButton(this, 'JarsScene');
    UI.speakerButton(this, this.state.jars.give > 0 ? 'giveIntro' : 'giveEmpty');
    UI.musicButton(this);
    Music.start(this);
    this.sparkles = UI.sparkles(this);
    UI.parentTip(this, 'give');   // tip for grown-ups
    this.hearts = UI.sparkles(this, 'heart', [0xE74C3C, 0xF5A9B8, 0xFFFFFF]);

    this.setupDragging();
    UI.whenIdle(this, 7, () => this.showNextStep());
    this.events.once('shutdown', () => Voice.stop());
    const startGifts = this.state.gifts;
    this.time.delayedCall(500, () => {
      if (this.state.gifts !== startGifts) return;   // already giving: don't talk over it
      if (this.state.jars.give > 0) Voice.sayOnce(this, 'giveIntro');
      else UI.sayNow(this, 'giveEmpty');
    });
  }

  // One clear next step: give a coin, or go back and earn more
  showNextStep() {
    if (this.sending || this.cardShowing || (this.flying || 0) > 0) return;
    if (this.pile.length) {
      const b = this.basketBase;
      UI.pulse(this, this.pile[this.pile.length - 1], 2);
      UI.guide(this, b.x, b.y - 125 * b.scale, { radius: 150 * b.scale, voice: 'giveIntro', gap: 25000 });
    } else {
      UI.guideTo(this, this.backButton, { voice: 'noCoins', gap: 15000 });
    }
  }

  // The Sharing Basket: back, food, front (so food sits inside it)
  makeBasket() {
    const [bx, by, bs] = this.layout.basket;
    this.basket = this.add.container(bx, by).setScale(bs).setDepth(20);
    this.basketBase = { x: bx, y: by, scale: bs };
    this.food = this.add.container(0, 0);
    this.basket.add([
      this.add.image(0, 0, 'share-basket-back').setOrigin(0.5, 1),
      this.food,
      this.add.image(0, 0, 'share-basket-front').setOrigin(0.5, 1)
    ]);
    this.basketZone = this.add.zone(bx, by - 140 * bs, 310 * bs, 290 * bs).setInteractive({ useHandCursor: true });
    this.refreshFood();
  }

  // Where food item n sits in the basket (relative to the basket's bottom middle)
  foodSlot(n) {
    const spots = [[-80, -142], [80, -140], [0, -150], [-40, -166], [42, -168], [-92, -164], [92, -162], [0, -184]];
    const [x, y] = spots[n % spots.length];
    return { x, y };
  }

  foodKey(n) { return SHARING_FOODS[n % SHARING_FOODS.length]; }

  // Show the food already given into the current basket
  refreshFood() {
    this.food.removeAll(true);
    const inBasket = this.state.gifts % SHARING_BASKET_SIZE;
    for (let n = 0; n < inBasket; n++) this.food.add(this.foodItem(n));
  }

  foodItem(n) {
    const slot = this.foodSlot(n);
    const key = this.foodKey(n);
    const img = this.add.image(slot.x, slot.y, key).setOrigin(0.5, 0.75);
    img.setScale(key === 'carrot' ? 0.9 : 0.85).setAngle((n % 2 ? 1 : -1) * (8 + n * 3));
    return img;
  }

  drawTray() {
    const t = this.layout.tray;
    const g = this.add.graphics();
    g.fillStyle(0x5C3D2B, 1).fillRoundedRect(t.x - t.w / 2, t.y - t.h / 2 + 8, t.w, t.h, 30);
    g.fillStyle(0xF4C542, 1).fillRoundedRect(t.x - t.w / 2, t.y - t.h / 2, t.w, t.h, 30);
    g.lineStyle(6, COLOURS.wood, 1).strokeRoundedRect(t.x - t.w / 2, t.y - t.h / 2, t.w, t.h, 30);
    // When the Give jar is empty: a button back to the jars
    this.jarsButton = UI.roundButton(this, t.x, t.y, 'button-jars', ICONS.jars, () => UI.goTo(this, 'JarsScene'));
    this.jarsButton.setDepth(5);
  }

  buildPile() {
    this.pile.forEach((c) => c.destroy());
    this.pile = [];
    const t = this.layout.tray;
    const n = Math.min(this.state.jars.give, TRAY_MAX_SHOWN);
    const rows = Math.ceil(n / this.layout.perRow) || 1;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / this.layout.perRow);
      const inRow = Math.min(this.layout.perRow, n - row * this.layout.perRow);
      const x = t.x + ((i % this.layout.perRow) - (inRow - 1) / 2) * this.layout.gap;
      const y = t.y + (row - (rows - 1) / 2) * this.layout.rowGap;
      const coin = this.add.image(x, y, 'coin').setScale(0.85).setDepth(10);
      coin.home = { x, y };
      coin.setInteractive({ hitArea: new Phaser.Geom.Circle(40, 40, 50), hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true, draggable: true });
      this.pile.push(coin);
    }
    this.jarsButton.setVisible(n === 0);
    if (n === 0) this.jarsButton.setInteractive(); else this.jarsButton.disableInteractive();
  }

  // Tap a coin, or drag it to the Sharing Basket: either way it's given
  setupDragging() {
    this.input.on('dragstart', (p, coin) => { if (coin.type !== 'Image') return; coin.setDepth(60); coin.setScale(1.05); });
    this.input.on('drag', (p, coin, x, y) => { coin.x = x; coin.y = y; });
    this.input.on('dragend', (p, coin) => {
      const moved = Phaser.Math.Distance.Between(p.downX, p.downY, p.upX, p.upY);
      const nearBasket = Phaser.Math.Distance.Between(p.x, p.y, this.basketBase.x, this.basketBase.y - 130 * this.basketBase.scale) < 220;
      if (moved < 20 || nearBasket) {
        this.giveCoin(coin);
      } else {
        this.tweens.add({ targets: coin, x: coin.home.x, y: coin.home.y, scale: 0.85, duration: 350, ease: 'Back.easeOut' });
      }
    });
  }

  giveCoin(coin) {
    if (!coin.active || !coin.input) return;
    if (this.sending) {   // the full basket is on its way: put the coin back for a moment
      this.tweens.add({ targets: coin, x: coin.home.x, y: coin.home.y, scale: 0.85, duration: 350, ease: 'Back.easeOut' });
      return;
    }
    coin.disableInteractive();
    this.pile = this.pile.filter((c) => c !== coin);
    this.state.jars.give -= 1;
    this.state.gifts += 1;
    GameState.save();
    this.counter.set(this.state.jars.give);
    SFX.play(this, 'pop');
    UI.cheer(this, this.connor);

    const n = (this.state.gifts - 1) % SHARING_BASKET_SIZE;   // this coin's place in the basket
    const full = n === SHARING_BASKET_SIZE - 1;
    if (full) this.sending = true;
    this.flying = (this.flying || 0) + 1;
    const target = this.lilianaPaws();
    this.tweens.add({
      targets: coin, x: target.x, y: target.y, scale: 0.5, duration: 600, ease: 'Sine.easeInOut',
      onComplete: () => {
        coin.destroy();
        this.foodArrives(n, full);
        // Tidy the tray once every flying coin has arrived
        this.flying -= 1;
        if (this.flying === 0) this.buildPile();
      }
    });
  }

  // Where Liliana catches the food (in front of her, towards the basket)
  lilianaPaws() {
    const f = this.friend;
    return { x: f.x - f.displayWidth * 0.2, y: f.y - f.displayHeight * 0.45 };
  }

  // Liliana catches the coin as food, reacts happily, then pops it in the basket
  foodArrives(n, full) {
    UI.celebrateBook1IfDone(this, full ? 7500 : 3500);
    SFX.play(this, 'coin');
    this.time.delayedCall(150, () => SFX.play(this, 'chirp'));
    const paws = this.lilianaPaws();
    const key = this.foodKey(n);
    const food = this.add.image(paws.x, paws.y, key).setDepth(30).setScale(0);
    const size = key === 'carrot' ? 0.9 : 0.85;
    this.tweens.add({ targets: food, scale: size * this.basketBase.scale, duration: 300, ease: 'Back.easeOut' });
    this.hearts.explode(8, paws.x, paws.y - 40);
    this.lilianaReacts();
    UI.hop(this, this.connor);

    // A new heart floats up to the kindness row
    const slot = this.heartSlot(this.state.gifts - 1);
    const heart = this.add.image(paws.x, paws.y - 40, 'heart').setScale(0.4).setDepth(45);
    this.tweens.add({ targets: heart, x: slot.x, y: slot.y, scale: 0.75, duration: 700, ease: 'Cubic.easeOut',
      onComplete: () => { heart.destroy(); this.refreshHearts(); } });

    // Then a little toss into the basket
    const b = this.basketBase, spot = this.foodSlot(n);
    const sx = paws.x, sy = paws.y, ex = b.x + spot.x * b.scale, ey = b.y + (spot.y - 20) * b.scale;
    this.time.delayedCall(750, () => {
      this.tweens.addCounter({ from: 0, to: 1, duration: 550, ease: 'Sine.easeInOut',
        onUpdate: (tw) => {
          const t = tw.getValue();
          food.setPosition(Phaser.Math.Linear(sx, ex, t), Phaser.Math.Linear(sy, ey, t) - Math.sin(Math.PI * t) * 90 * b.scale);
          food.setAngle(t * 360);
        },
        onComplete: () => {
          food.destroy();
          const item = this.foodItem(n);
          this.food.add(item);
          const endY = item.y;
          item.setY(endY - 30);
          this.tweens.add({ targets: item, y: endY, duration: 300, ease: 'Bounce.easeOut' });
          this.tweens.add({ targets: this.basket, scaleY: b.scale * 0.94, duration: 110, yoyo: true });
          SFX.play(this, 'pop');
          if (full) this.time.delayedCall(600, () => this.sendBasket());
          else if (!this.pile.length && (this.flying || 0) === 0) this.time.delayedCall(3500, () => this.showNextStep());
        } });
    });

    if (!full && !this.cardShowing) UI.sayNow(this, Phaser.Math.RND.pick(['thanks', 'thanks2']), 3500);
  }

  // Liliana's happy reactions, taking turns: a sniff, an ear wiggle, a twirl
  lilianaReacts() {
    const f = this.friend;
    this.reactN = ((this.reactN || 0) + 1) % 3;
    if (this.reactN === 0) {
      // Sniff sniff: a lean towards the food with little bobs
      this.tweens.add({ targets: f, angle: -9, duration: 160, yoyo: true, hold: 420 });
      this.tweens.add({ targets: f, scaleY: f.baseScale * 1.04, duration: 90, yoyo: true, repeat: 3, delay: 120,
        onComplete: () => f.setScale(f.baseScale) });
    } else if (this.reactN === 1) {
      // Happy wiggle
      this.tweens.add({ targets: f, angle: { from: -7, to: 7 }, duration: 110, yoyo: true, repeat: 3,
        onComplete: () => f.setAngle(0) });
    } else {
      // A twirl and a hop
      this.tweens.add({ targets: f, scaleX: -f.baseScale, duration: 200, yoyo: true, repeat: 1, ease: 'Sine.easeInOut',
        onComplete: () => f.setScale(f.baseScale) });
      UI.hop(this, f);
    }
  }

  // A full basket goes off to bunny families who need a little help,
  // and a fresh empty basket arrives
  sendBasket() {
    const b = this.basketBase;
    Voice.say(this, 'basketFull');
    SFX.play(this, 'yay');
    UI.cheer(this, this.connor, true);
    UI.rain(this, this.sparkles);
    this.tweens.add({ targets: this.basket, y: b.y - 30, duration: 250, yoyo: true, repeat: 1, ease: 'Quad.easeOut',
      onComplete: () => {
        this.time.addEvent({ delay: 120, repeat: 8, callback: () => this.hearts.explode(2, this.basket.x, this.basket.y - 150 * b.scale) });
        this.tweens.add({ targets: this.basket, x: this.scale.width + 260, y: b.y - 120, angle: 8, duration: 1600, ease: 'Sine.easeIn',
          onComplete: () => {
            this.refreshFood();
            this.basket.setPosition(b.x, b.y - 500).setAngle(0).setAlpha(0);
            this.tweens.add({ targets: this.basket, y: b.y, alpha: 1, duration: 700, ease: 'Bounce.easeOut', delay: 300,
              onComplete: () => { this.sending = false; this.thankYouCard(); } });
          } });
      } });
  }

  // A thank-you card from the bunny families flutters in, then joins the hearts
  thankYouCard() {
    const w = this.scale.width, h = this.scale.height;
    const tall = h > w;
    const tx = w / 2, ty = tall ? 520 : 330;
    this.cardShowing = true;
    const card = this.add.image(w + 160, tall ? 300 : 160, 'thank-you-card').setDepth(70).setScale(0.7).setAngle(-12);
    SFX.play(this, 'chirp');
    this.tweens.add({ targets: card, x: tx, duration: 1600, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: card, y: ty, duration: 1600, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: card, angle: 12, duration: 400, yoyo: true, repeat: 1, ease: 'Sine.easeInOut',
      onComplete: () => this.tweens.add({ targets: card, angle: 0, duration: 200 }) });
    this.time.delayedCall(1650, () => {
      SFX.play(this, 'sparkle');
      this.hearts.explode(18, tx, ty);
      UI.cheer(this, this.friend);
      UI.hop(this, this.connor);
      this.tweens.add({ targets: card, scale: tall ? 1.45 : 1.35, duration: 450, ease: 'Back.easeOut' });
      Voice.whenQuiet(this, () => Voice.sayThen(this, 'thankCard', () => {
        const top = this.heartSlot(Math.max(0, Math.min(this.state.gifts, HEARTS_SHOWN) - 1));
        this.tweens.add({ targets: card, x: top.x, y: top.y, scale: 0.15, alpha: 0, duration: 700, ease: 'Cubic.easeIn',
          onComplete: () => {
            card.destroy();
            this.cardShowing = false;
            this.tweens.add({ targets: this.heartsRow, y: -8, duration: 150, yoyo: true });
            if (!this.pile.length) this.time.delayedCall(1500, () => this.showNextStep());
          } });
      }));
    });
  }

  // Kindness hearts: one for every coin ever given
  heartSlot(i) {
    const hs = this.layout.hearts;
    const shown = Math.min(this.state.gifts, HEARTS_SHOWN);
    const idx = Math.min(i, HEARTS_SHOWN - 1);
    const row = Math.floor(idx / hs.perRow);
    const inRow = Math.min(hs.perRow, shown - row * hs.perRow);
    return { x: this.scale.width / 2 + ((idx % hs.perRow) - (inRow - 1) / 2) * hs.gap, y: hs.y + row * 64 };
  }

  refreshHearts() {
    this.heartsRow.removeAll(true);
    const shown = Math.min(this.state.gifts, HEARTS_SHOWN);
    for (let i = 0; i < shown; i++) {
      const s = this.heartSlot(i);
      this.heartsRow.add(this.add.image(s.x, s.y, 'heart').setScale(0.75));
    }
    if (this.state.gifts > HEARTS_SHOWN) {
      const last = this.heartSlot(HEARTS_SHOWN - 1);
      this.heartsRow.add(this.add.text(last.x + 46, last.y, String(this.state.gifts), {
        fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: '#FFFFFF', stroke: COLOURS.woodText, strokeThickness: 8
      }).setOrigin(0, 0.5));
    }
  }
}
