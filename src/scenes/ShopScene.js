// ------------------------------------------------------------
// SHOP SCENE (Spend jar)
// Mama runs a little shop. Each treat shows its price as coin
// pictures. Tap a treat to buy it with Spend jar coins. Connor
// enjoys it with his own little reaction (munching a carrot,
// nibbling a cupcake, licking a lollipop, floating with a
// balloon), Mama thanks him, and it's kept in his basket.
// Not enough coins? The treat just wiggles and the voice gently
// says you can save up for it. Nothing is lost.
// Treats and prices are set in src/config.js (TREATS).
// ------------------------------------------------------------

// Treats Connor eats straight away (the others go into his basket)
const EATEN_TREATS = ['carrot', 'treat-cupcake'];

class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.state = GameState.data;

    this.layout = tall
      ? { floorY: 1080, mama: [530, 520, 260], kiosk: [530, 520], connor: [170, 520, 280],
          treats: [[200, 720], [520, 720], [200, 950], [520, 950]], shelves: [730, 960],
          basket: [360, 1200] }
      : { floorY: 600, mama: [1110, 470, 260], kiosk: [1110, 470], connor: [150, 690, 300],
          treats: [[350, 420], [530, 420], [710, 420], [890, 420]], shelves: [430],
          basket: [620, 660] };

    UI.fadeIn(this);
    UI.paintIndoors(this, this.layout.floorY, true);
    this.drawAwning(w);

    // Shelves for the treats
    const shelf = this.add.graphics();
    const xs = this.layout.treats.map((t) => t[0]);
    const left = Math.min(...xs) - 110, right = Math.max(...xs) + 110;
    this.layout.shelves.forEach((y) => {
      shelf.fillStyle(0x5C3D2B, 1).fillRoundedRect(left, y + 6, right - left, 22, 8);
      shelf.fillStyle(COLOURS.wood, 1).fillRoundedRect(left, y, right - left, 22, 8);
    });

    // Mama behind her shop counter
    const [mx, my, mh] = this.layout.mama;
    this.mama = UI.character(this, 'mama', mx, my, mh, true);
    this.add.image(this.layout.kiosk[0], this.layout.kiosk[1] - 40, 'kiosk').setScale(0.9);   // covers Mama's lower half

    // Connor and his basket
    const [cx, cy, ch] = this.layout.connor;
    this.connor = UI.character(this, MAIN_CHARACTER, cx, cy, ch);
    this.basketItems = this.add.container(0, 0);
    this.basket = this.add.image(this.layout.basket[0], this.layout.basket[1], 'basket');
    this.refreshBasket();

    // The treats
    this.treats = TREATS.map((t, i) => this.makeTreat(t, this.layout.treats[i]));

    // Spend jar coins at the top
    this.counter = UI.counter(this, w / 2, 72, 'label-spend', this.state.jars.spend, 0.75);
    this.backButton = UI.backButton(this, 'JarsScene');
    UI.speakerButton(this, 'shopIntro');
    UI.musicButton(this);
    Music.start(this);
    this.sparkles = UI.sparkles(this);
    UI.parentTip(this, 'shop');   // tip for grown-ups
    this.refreshPrices();

    UI.whenIdle(this, 7, () => this.showNextStep());
    this.events.once('shutdown', () => Voice.stop());
    this.time.delayedCall(500, () => Voice.sayOnce(this, 'shopIntro'));
  }

  drawAwning(w) {
    const g = this.add.graphics();
    const y = 128, stripe = 80;
    for (let x = 0, i = 0; x < w; x += stripe, i++) {
      const c = i % 2 ? COLOURS.cream : COLOURS.gold;
      g.fillStyle(c, 1).fillRect(x, y, stripe, 46);
      g.fillCircle(x + stripe / 2, y + 46, stripe / 2);
    }
  }

  // One treat with its price shown as little coins underneath
  makeTreat(data, [x, y]) {
    const box = this.add.container(x, y);
    const img = this.add.image(0, 0, data.key).setOrigin(0.5, 1);
    img.setScale(Math.min(1.3, 130 / img.height));
    if (data.key === 'treat-balloon') {
      this.tweens.add({ targets: img, y: -10, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    const price = [];
    for (let i = 0; i < data.price; i++) {
      const coin = this.add.image((i - (data.price - 1) / 2) * 38, 62, 'coin').setScale(0.42);
      price.push(coin);
    }
    box.add([img, ...price]);
    box.setInteractive({ hitArea: new Phaser.Geom.Rectangle(-85, -150, 170, 240), hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
    const treat = { data, box, img, price };
    box.on('pointerdown', () => this.tapTreat(treat));
    return treat;
  }

  // Price coins look bright when you have enough, faded when you don't
  refreshPrices() {
    this.treats.forEach((t) => {
      const enough = t.data.price <= this.state.jars.spend;
      t.price.forEach((c) => c.setAlpha(enough ? 1 : 0.4));
    });
  }

  // One clear next step: a treat you can buy, or back to earn more
  showNextStep() {
    if (this.buying) return;
    const canBuy = this.treats.filter((t) => t.data.price <= this.state.jars.spend);
    if (canBuy.length) {
      const t = Phaser.Utils.Array.GetRandom(canBuy);
      canBuy.forEach((c) => UI.pulse(this, c.box, 2));
      UI.guide(this, t.box.x, t.box.y - 55, { radius: 95, voice: 'shopIntro', gap: 25000 });
    } else {
      UI.guideTo(this, this.backButton, { voice: 'noCoins', gap: 15000 });
    }
  }

  tapTreat(treat) {
    const price = treat.data.price;
    if (this.state.jars.spend < price) {
      // Gentle: a wiggle and a kind word. Nothing is lost.
      SFX.play(this, 'boop');
      this.tweens.add({ targets: treat.box, angle: { from: -6, to: 6 }, duration: 90, yoyo: true, repeat: 2,
        onComplete: () => treat.box.setAngle(0) });
      UI.sayNow(this, 'needMore', 4000);
      return;
    }
    if (this.buying) return;
    this.buying = true;

    this.state.jars.spend -= price;
    this.state.treats.push(treat.data.key);
    GameState.save();
    this.counter.set(this.state.jars.spend);
    this.refreshPrices();
    SFX.play(this, 'pop');

    // Coins fly from the counter to Mama
    for (let i = 0; i < price; i++) {
      const c = this.add.image(this.counter.iconPos.x, this.counter.iconPos.y, 'coin').setScale(0.6).setDepth(45);
      this.tweens.add({ targets: c, x: this.mama.x, y: this.mama.y - this.mama.displayHeight * 0.6, delay: i * 150, duration: 600, ease: 'Sine.easeInOut',
        onComplete: () => { c.destroy(); SFX.play(this, 'clink'); } });
    }

    // Then the treat hops over to Connor, who enjoys it
    this.time.delayedCall(price * 150 + 600, () => {
      UI.cheer(this, this.mama);
      const b = treat.box;
      const key = treat.data.key;
      const c = this.connor;
      const paw = { x: c.x + c.displayWidth * 0.18, y: c.y - c.displayHeight * 0.48 };
      const copy = this.add.image(b.x, b.y - 50, key).setScale(treat.img.scale).setDepth(46);
      this.sparkles.explode(14, b.x, b.y - 60);
      this.tweens.add({
        targets: copy, x: paw.x, y: paw.y, scale: treat.img.scale * 0.8, duration: 650, ease: 'Sine.easeInOut',
        onComplete: () => {
          SFX.play(this, 'coin');
          this.enjoy(key, copy, () => {
            this.refreshBasket();
            this.mamaThanks(() => {
              this.buying = false;
              UI.celebrateBook1IfDone(this, 1500);
              const cheapest = Math.min(...TREATS.map((t) => t.price));
              if (this.state.jars.spend < cheapest) this.time.delayedCall(2500, () => this.showNextStep());
            });
          });
        }
      });
    });
  }

  // ---------- Connor enjoys his treat ----------
  // Each treat has its own short, happy reaction. Add a new one here
  // for a new treat (anything else gets a happy hop).
  enjoy(key, copy, done) {
    const c = this.connor;
    UI.holdBob(this, c, true);
    const finish = (keep) => {
      UI.holdBob(this, c, false);
      c.setScale(c.baseScale).setAngle(0);
      // Eaten treats vanish with a sparkle; toys go into the basket
      const target = keep ? { x: this.basket.x, y: this.basket.y - 20, scale: copy.scale * 0.6, alpha: 1 } : { scale: 0, alpha: 0 };
      this.tweens.add({ targets: copy, ...target, duration: 450, ease: 'Sine.easeIn',
        onComplete: () => { copy.destroy(); this.sparkles.explode(10, this.basket.x, this.basket.y - 30); done(); } });
    };
    const crumbs = (tints) => this.add.particles(copy.x, copy.y, 'sparkle', {
      speed: { min: 60, max: 180 }, angle: { min: 200, max: 340 }, gravityY: 500, scale: { start: 0.35, end: 0 },
      lifespan: 700, tint: tints, emitting: false }).setDepth(47);

    if (key === 'carrot' || key === 'treat-cupcake') {
      // Munch, munch, munch: the treat gets smaller with each bite
      const carrot = key === 'carrot';
      const bits = crumbs(carrot ? [0xE8762B, 0x58A845] : [0xF5A9B8, 0x5DADE2, 0xF7DC6F, 0xFFFFFF]);
      Voice.say(this, carrot ? 'yumCarrot' : 'yumCupcake');
      const bites = carrot ? 4 : 3;
      for (let n = 0; n < bites; n++) {
        this.time.delayedCall(n * 420, () => {
          SFX.play(this, carrot ? 'boop' : 'pop');
          bits.explode(8, copy.x, copy.y - 10);
          this.tweens.add({ targets: c, scaleY: c.baseScale * 0.95, scaleX: c.baseScale * 1.03, duration: 110, yoyo: true });
          this.tweens.add({ targets: copy, scale: copy.scale * 0.8, angle: (n % 2 ? 8 : -8), duration: 140 });
        });
      }
      this.time.delayedCall(bites * 420 + 300, () => {
        // A happy tummy pat: a little jump with hearts
        UI.hop(this, c);
        this.sparkles.explode(12, c.x, c.y - c.displayHeight * 0.8);
        this.time.delayedCall(600, () => { bits.destroy(); finish(false); });
      });
    } else if (key === 'treat-lollipop') {
      // Lick, lick: sway happily with sparkles
      Voice.say(this, 'yumLolly');
      this.tweens.add({ targets: copy, y: copy.y - 25, duration: 200 });
      this.tweens.add({ targets: c, angle: { from: -6, to: 6 }, duration: 280, yoyo: true, repeat: 3, ease: 'Sine.easeInOut' });
      for (let n = 0; n < 4; n++) {
        this.time.delayedCall(n * 400, () => {
          SFX.play(this, 'sparkle');
          this.sparkles.explode(8, copy.x, copy.y - 30);
          this.tweens.add({ targets: copy, angle: { from: -12, to: 12 }, duration: 180, yoyo: true });
        });
      }
      this.time.delayedCall(1900, () => finish(true));
    } else if (key === 'treat-balloon') {
      // Wheee! Connor floats up with the balloon, then bounces down
      Voice.say(this, 'balloonFun');
      SFX.play(this, 'boing');
      const startY = c.y, lift = c.displayHeight * 0.35;
      copy.setOrigin(0.5, 1).setY(copy.y + copy.displayHeight * 0.35);
      const startCopy = copy.y;
      this.tweens.add({ targets: c, y: startY - lift, angle: { from: -4, to: 4 }, duration: 1300, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: copy, y: startCopy - lift - 20, angle: { from: -8, to: 8 }, duration: 1300, ease: 'Sine.easeOut',
        onComplete: () => {
          this.tweens.add({ targets: c, y: startY, angle: 0, duration: 800, ease: 'Bounce.easeOut' });
          this.tweens.add({ targets: copy, y: startCopy, angle: 0, duration: 800, ease: 'Bounce.easeOut',
            onComplete: () => { SFX.play(this, 'boing'); this.sparkles.explode(12, c.x, startY - 10); this.time.delayedCall(300, () => finish(true)); } });
        } });
    } else {
      UI.hop(this, c);
      Voice.say(this, 'bought');
      this.time.delayedCall(900, () => finish(true));
    }
  }

  // Mama waves and says thank you
  mamaThanks(done) {
    this.tweens.add({ targets: this.mama, angle: { from: -7, to: 7 }, duration: 200, yoyo: true, repeat: 3,
      onComplete: () => this.mama.setAngle(0) });
    UI.cheer(this, this.mama);
    Voice.whenQuiet(this, () => Voice.sayThen(this, 'thanksShopping', done));
  }

  // Show the last few treats Connor kept (eaten ones are gone: yum!), peeking out of the basket
  refreshBasket() {
    this.basketItems.removeAll(true);
    const recent = this.state.treats.filter((k) => !EATEN_TREATS.includes(k)).slice(-5);
    recent.forEach((key, i) => {
      const img = this.add.image(this.basket.x + (i - (recent.length - 1) / 2) * 40, this.basket.y + 4, key).setOrigin(0.5, 1);
      img.setScale(85 / img.height).setAngle((i - 2) * 8);
      this.basketItems.add(img);
    });
    this.children.bringToTop(this.basket);
  }
}
