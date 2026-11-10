// ------------------------------------------------------------
// VILLAGE SCENE
// Bunny Village: the child taps a job in the carrot garden (water
// the carrots, tidy the toys, feed the chicks) to earn a carrot coin.
// Around the village: the savings jars (opens the jars), the shop
// and the giving corner, plus bunnies, butterflies and birds.
// No reading needed: pictures, sounds and a friendly voice.
// ------------------------------------------------------------

// How long (in seconds) a finished job waits before it's ready again
const JOB_RESET_SECONDS = 4;
// A big celebration every this many coins
const CELEBRATE_EVERY = 5;

class VillageScene extends Phaser.Scene {
  constructor() {
    super('VillageScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.lastHintVoice = 0;
    this.lastDoneVoice = 0;

    this.state = GameState.data;   // coins are remembered (see src/state.js)

    // Where everything goes, for wide and tall screens
    this.layout = tall ? this.tallLayout() : this.wideLayout();

    UI.fadeIn(this);
    VillageArt.paintBackground(this, this.layout);
    VillageArt.addLife(this, this.layout);
    this.makeLandmarks();
    this.makeStrollers();
    this.makeConnor();

    this.jobs = {
      water: this.makeJob('water', this.buildWaterJob),
      toys: this.makeJob('toys', this.buildToysJob),
      pet: this.makeJob('pet', this.buildPetJob)
    };

    this.counter = UI.counter(this, w / 2, 72, 'coin', this.state.coins);
    this.counterIcon = this.counter.iconPos;
    UI.homeButton(this);
    UI.speakerButton(this, 'intro');

    // Button to the coin jars (Save, Spend, Give)
    const [jx, jy] = this.layout.jarsButton;
    this.jarsButton = UI.roundButton(this, jx, jy, 'button-jars', ICONS.jars, () => UI.goTo(this, 'JarsScene'));

    // How to play (?) and music on/off
    const [hx, hy] = this.layout.helpButton;
    this.helpButton = UI.helpButton(this, hx, hy);
    UI.musicButton(this);
    Music.start(this);

    this.sparkles = UI.sparkles(this);
    this.makeBook1Badges(w / 2, 152);
    UI.parentTip(this, 'village');   // tip for grown-ups

    // If nobody taps for a while, gently show where to tap
    this.input.on('pointerdown', () => { this.idleTime = 0; });
    this.idleTime = 0;
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.checkIdle() });

    // Say hello (not when the screen is just being turned)
    if (this.registry.get('rotating')) {
      this.registry.set('rotating', false);
    } else {
      this.introTimer = this.time.delayedCall(500, () => Voice.say(this, 'intro'));
    }

    // Brand-new player: show which thing to tap first
    if (this.state.earned === 0) {
      this.time.delayedCall(2600, () => {
        const j = this.jobs.water;
        if (j.ready && !this.tipOpen) UI.guide(this, j.box.x, j.box.y, { radius: this.layout.jobRadius + 12 });
      });
    }

    // Finished Book 1 but the party hasn't been seen yet (e.g. the app was closed): show it now
    if (this.state.book1Done && !this.state.book1Celebrated) {
      this.time.delayedCall(1200, () => { if (!this.tipOpen) UI.goTo(this, 'FinishScene'); });
    }

    this.events.once('shutdown', () => Voice.stop());
  }

  // ---------- Book 1 badges: Earn, Save, Spend, Give ----------
  // Each lights up (with a tick) once that money skill is done.
  // All four lit = Book 1 finished. Tapping them opens the certificate,
  // or says what is still to do.
  makeBook1Badges(x, y) {
    const skills = GameState.book1Skills();
    const icons = [['earn', 'coin', 0.62], ['save', 'label-save', 0.5], ['spend', 'label-spend', 0.5], ['give', 'label-give', 0.5]];
    const gap = 76, pw = gap * 4 + 24, ph = 78;
    if (this.book1Strip) { this.tweens.killTweensOf(this.book1Strip.list); this.book1Strip.destroy(); }
    this.badgePos = [x, y];
    const strip = this.add.container(x, y).setDepth(30);
    const g = this.add.graphics();
    const done = this.state.book1Done;
    g.fillStyle(COLOURS.wood, 0.9).fillRoundedRect(-pw / 2, -ph / 2 + 5, pw, ph, ph / 2);
    g.fillStyle(done ? COLOURS.gold : 0xFFF8EC, 0.95).fillRoundedRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
    g.lineStyle(4, COLOURS.wood, 1).strokeRoundedRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
    strip.add(g);
    this.badges = {};
    icons.forEach(([skill, key, scale], i) => {
      const bx = (i - 1.5) * gap;
      const icon = this.add.image(bx, 0, key).setScale(scale);
      if (!skills[skill]) icon.setAlpha(0.35);
      strip.add(icon);
      if (skills[skill]) strip.add(this.add.image(bx + 22, -20, 'tick').setScale(0.24));
      this.badges[skill] = icon;
    });
    // The next skill to do glows gently, so children can see what's next
    const next = ['earn', 'save', 'spend', 'give'].find((k) => !skills[k]);
    if (next && !done) {
      const icon = this.badges[next].setAlpha(0.85);
      const glow = this.add.circle(icon.x, icon.y, 33, COLOURS.gold, 0.6);
      strip.addAt(glow, 1);
      this.tweens.add({ targets: glow, scale: 1.3, alpha: 0.15, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: icon, scale: icon.scale * 1.15, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    strip.setSize(pw, ph).setInteractive({ useHandCursor: true });
    strip.on('pointerup', () => {
      SFX.play(this, 'pop');
      if (this.state.book1Done) { UI.goTo(this, 'FinishScene'); return; }
      Voice.say(this, 'book1Progress');
      const now = GameState.book1Skills();
      Object.keys(this.badges).filter((k) => !now[k]).forEach((k, i) => {
        this.tweens.add({ targets: this.badges[k], angle: { from: -15, to: 15 }, duration: 120, yoyo: true, repeat: 3, delay: i * 120,
          onComplete: () => this.badges[k].setAngle(0) });
      });
    });
    this.book1Strip = strip;
  }

  // ---------- Where everything goes ----------
  wideLayout() {
    return {
      horizon: 290, sun: [890, 165],
      jobs: { water: [430, 548], toys: [760, 548], pet: [1090, 548] }, jobRadius: 112,
      connor: [140, 705, 265], jarsButton: [940, 72], helpButton: [190, 72],
      savings: { x: 255, y: 318, size: 0.4, spacing: 90 },
      give: { x: 520, feetY: 412, scale: 0.9 },
      shop: { x: 1060, feetY: 416, scale: 0.9 },
      trees: [[55, 335, 0.9], [395, 285, 0.5], [655, 290, 0.5], [1000, 288, 0.55], [1240, 335, 0.85]],
      houses: [[730, 332, 0.6, 1], [880, 322, 0.5, 3]],
      bushes: [[30, 470, 1], [1255, 470, 1], [1250, 700, 0.8]],
      fence: [300, 1230, 446],
      path: [[598, 760], [604, 640], [612, 470], [720, 438], [900, 430], [1060, 428]],
      pathWidth: 52, flowerCount: 90,
      clear: [[430, 548, 120], [760, 548, 120], [1090, 548, 120]],
      clouds: [[0.15, 115], [0.47, 165], [0.72, 105]],
      butterflies: [[320, 470], [700, 640], [1180, 640]], butterflyArea: [280, 400, 960, 290],
      birdY: [40, 150],
      strollers: [['harvey', 640, 925, 405, 80, 7000]]
    };
  }

  tallLayout() {
    return {
      horizon: 300, sun: [520, 215],
      jobs: { water: [230, 600], toys: [490, 830], pet: [240, 1050] }, jobRadius: 118,
      connor: [545, 1250, 270], jarsButton: [90, 1225], helpButton: [76, 290],
      savings: { x: 130, y: 400, size: 0.3, spacing: 72 },
      give: { x: 370, feetY: 470, scale: 0.62 },
      shop: { x: 600, feetY: 472, scale: 0.62 },
      trees: [[30, 365, 0.7], [690, 368, 0.7], [180, 318, 0.38], [545, 312, 0.36]],
      houses: [[255, 322, 0.36, 1], [470, 318, 0.34, 3]],
      bushes: [[30, 720, 1], [690, 700, 1], [690, 1040, 0.9]],
      fence: [20, 700, 505],
      path: [[360, 1300], [380, 1150], [400, 960], [360, 720], [400, 540], [370, 490]],
      pathWidth: 48, flowerCount: 110,
      clear: [[230, 600, 126], [490, 830, 126], [240, 1050, 126]],
      clouds: [[0.15, 120], [0.55, 175], [0.85, 110]],
      butterflies: [[600, 640], [120, 830], [600, 1000]], butterflyArea: [40, 520, 640, 640],
      birdY: [40, 170],
      strollers: [['harvey', 420, 650, 692, 88, 6000], ['dada', 300, 440, 330, 42, 8000]]
    };
  }

  // ---------- Places to visit in the village ----------
  makeLandmarks() {
    const L = this.layout;
    this.landmarks = {};

    // Savings area: three big colourful jars on a shelf, showing your real coins
    const sv = L.savings;
    const shelf = this.add.image(sv.x, sv.y + 125 * sv.size + 6, 'jar-shelf').setOrigin(0.5, 0).setDepth(8);
    shelf.setScale((sv.spacing * 3 + 30) / 340);
    const jars = ['save', 'spend', 'give'].map((type, i) => {
      const jar = new Jar(this, sv.x + (i - 1) * sv.spacing, sv.y, type, sv.size);
      jar.container.setDepth(9);
      jar.setCount(this.state.jars[type]);
      if (type === 'save') { const g = GameState.nextReward(); jar.setGoal(g.goal, g.key); }
      return jar;
    });
    const svW = sv.spacing * 3 + 40, svTop = sv.y - 160 * sv.size, svBottom = sv.y + 236 * sv.size;
    this.landmarks.savings = this.makePlace(sv.x, (svTop + svBottom) / 2, svW, svBottom - svTop,
      jars.map((j) => j.container), 'JarsScene');

    // Giving corner: a heart arch with the Sharing Basket, and Liliana waving beside it
    const gv = L.give;
    const arch = this.add.image(gv.x, gv.feetY, 'give-arch').setOrigin(0.5, 1).setScale(gv.scale).setDepth(8);
    const friend = this.add.image(gv.x + 34 * gv.scale, gv.feetY - 4, FRIEND_CHARACTER).setOrigin(0.5, 1).setFlipX(true).setDepth(9);
    friend.setScale((105 * gv.scale) / friend.height);
    const basket = this.add.image(gv.x - 30 * gv.scale, gv.feetY + 2, 'share-basket-front').setOrigin(0.5, 1).setScale(0.36 * gv.scale).setDepth(10);
    const shown = Math.min(3, this.state.gifts % SHARING_BASKET_SIZE);
    const food = [];
    for (let n = 0; n < shown; n++) {
      food.push(this.add.image(basket.x + (n - 1) * 26 * gv.scale, basket.y - 44 * gv.scale, SHARING_FOODS[n])
        .setOrigin(0.5, 0.8).setScale(0.32 * gv.scale).setDepth(9.5));
    }
    this.tweens.add({ targets: friend, angle: { from: -4, to: 4 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.landmarks.give = this.makePlace(gv.x, gv.feetY - 105 * gv.scale, 230 * gv.scale, 215 * gv.scale,
      [arch, friend, basket, ...food], 'GiveScene');

    // Shop: Mama waves from beside the shop window
    const sp = L.shop;
    const shop = this.add.image(sp.x, sp.feetY, 'shop-building').setOrigin(0.5, 1).setScale(sp.scale).setDepth(8);
    const mama = this.add.image(sp.x - 118 * sp.scale, sp.feetY + 2, 'mama').setOrigin(0.5, 1).setDepth(9);
    mama.setScale((100 * sp.scale) / mama.height);
    this.tweens.add({ targets: mama, y: mama.y - 6, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.landmarks.shop = this.makePlace(sp.x, sp.feetY - 110 * sp.scale, 240 * sp.scale, 225 * sp.scale,
      [shop, mama], 'ShopScene');
  }

  // A big, easy tap area over a place in the village
  makePlace(x, y, w, h, parts, sceneKey) {
    const zone = this.add.zone(x, y, w + 30, h + 30).setDepth(20).setInteractive({ useHandCursor: true });
    const glow = this.add.rectangle(x, y, w + 20, h + 20).setStrokeStyle(8, COLOURS.gold).setAlpha(0).setDepth(19);
    const place = { zone, glow, parts };
    zone.on('pointerdown', () => {
      if (this.introTimer) { this.introTimer.remove(); this.introTimer = null; }
      SFX.play(this, 'pop');
      this.tweens.add({ targets: parts, y: '-=12', duration: 140, yoyo: true, ease: 'Quad.easeOut' });
      this.time.delayedCall(260, () => UI.goTo(this, sceneKey));
    });
    return place;
  }

  // Glow and bounce a place to say "tap me"
  pulsePlace(place) {
    place.glow.setAlpha(0.9).setScale(1);
    this.tweens.add({ targets: place.glow, scale: 1.08, alpha: 0, duration: 800, repeat: 2 });
    this.tweens.add({ targets: place.parts, y: '-=10', duration: 250, yoyo: true, repeat: 2, ease: 'Quad.easeOut' });
  }

  // Bunnies strolling around the village
  makeStrollers() {
    this.layout.strollers.forEach(([key, x1, x2, feetY, height, ms]) =>
      VillageArt.addStroller(this, key, x1, x2, feetY, height, ms));
  }

  // ---------- Connor, who cheers you on ----------
  makeConnor() {
    const [x, feetY, height] = this.layout.connor;
    this.add.ellipse(x, feetY, height * 0.5, 28, COLOURS.wood, 0.2);
    const connor = this.add.image(x, feetY, MAIN_CHARACTER).setOrigin(0.5, 1);
    connor.setScale(height / connor.height);
    this.connor = connor;
    this.connorScale = connor.scale;

    this.tweens.add({ targets: connor, y: feetY - 14, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    connor.setInteractive({ useHandCursor: true });
    connor.on('pointerdown', () => {
      SFX.play(this, 'pop');
      Voice.say(this, 'connor');
      this.connorCheer();
    });
  }

  connorCheer(big = false) {
    this.tweens.add({
      targets: this.connor,
      scaleY: this.connorScale * 1.08,
      scaleX: this.connorScale * 0.95,
      angle: big ? 360 : 0,
      duration: big ? 600 : 180,
      yoyo: !big,
      onComplete: () => { this.connor.setAngle(0).setScale(this.connorScale); }
    });
  }

  // ---------- A job the child can tap ----------
  makeJob(name, buildFn) {
    const [x, y] = this.layout.jobs[name];
    const radius = 140;                                  // drawn at this size...
    const size = (this.layout.jobRadius || 140) / 140;   // ...then scaled to fit the carrot garden
    const job = { name, ready: true, size };

    const box = this.add.container(x, y).setScale(size).setDepth(10);
    const shadow = this.add.circle(0, 12, radius, COLOURS.wood, 0.3);
    const pad = this.add.circle(0, 0, radius, COLOURS.cream).setStrokeStyle(8, COLOURS.wood);
    box.add([shadow, pad]);

    // The glow ring that pulses to say "tap here"
    job.glow = this.add.circle(x, y, (radius + 10) * size).setStrokeStyle(10, COLOURS.gold).setAlpha(0).setDepth(11);

    buildFn.call(this, box, job);

    job.tick = this.add.image(radius * 0.68, -radius * 0.68, 'tick').setScale(0);
    box.add(job.tick);
    job.box = box;

    // Big tap area, a bit bigger than the circle so near-misses count
    box.setInteractive({
      hitArea: new Phaser.Geom.Circle(0, 0, radius + 25),
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      useHandCursor: true
    });
    box.on('pointerdown', () => this.tapJob(job));

    return job;
  }

  tapJob(job) {
    // Child is already playing: skip the welcome so it doesn't talk over them
    if (this.introTimer) { this.introTimer.remove(); this.introTimer = null; }

    if (!job.ready) {
      // Already done: a little shake so the child knows to try another
      SFX.play(this, 'boop');
      this.tweens.add({ targets: job.box, x: job.box.x + 10, duration: 60, yoyo: true, repeat: 2 });
      if (this.time.now - this.lastDoneVoice > 5000) {
        this.lastDoneVoice = this.time.now;
        Voice.say(this, 'done');
      }
      return;
    }

    job.ready = false;
    SFX.play(this, 'pop');
    this.tweens.add({ targets: job.box, scale: job.size * 0.92, duration: 90, yoyo: true });

    // Each job plays its own little animation, then pays a coin
    job.play(() => {
      job.done = true;
      Voice.say(this, job.name);
      this.tweens.add({ targets: job.tick, scale: 1, duration: 300, ease: 'Back.easeOut' });
      this.payCoin(job.box.x, job.box.y - 60);

      this.time.delayedCall(JOB_RESET_SECONDS * 1000, () => {
        job.reset();
        this.tweens.add({ targets: job.tick, scale: 0, duration: 200 });
        this.tweens.add({ targets: job.box, angle: { from: -4, to: 4 }, duration: 100, yoyo: true, repeat: 2,
          onComplete: () => { job.box.setAngle(0); job.ready = true; job.done = false; this.roundDone = false; } });
      });
    });
  }

  // Job 1: water the carrots
  buildWaterJob(box, job) {
    box.add(this.add.image(0, 70, 'soil'));
    const carrots = [-62, 0, 62].map((cx) => this.add.image(cx, 72, 'carrot').setOrigin(0.5, 1).setScale(0.5));
    carrots.forEach((c) => box.add(c));
    const can = this.add.image(-30, -70, 'watering-can').setScale(0.75);
    box.add(can);

    job.play = (done) => {
      SFX.play(this, 'splash');
      this.tweens.add({ targets: can, angle: 30, duration: 250, yoyo: true, hold: 700 });
      for (let i = 0; i < 10; i++) {
        const drop = this.add.image(Phaser.Math.Between(-60, 70), -50, 'drop').setScale(0.8);
        box.add(drop);
        this.tweens.add({ targets: drop, y: 40, alpha: 0, delay: 200 + i * 60, duration: 450, onComplete: () => drop.destroy() });
      }
      this.tweens.add({ targets: carrots, scale: 1, duration: 500, delay: 600, ease: 'Back.easeOut', onComplete: done });
    };
    job.reset = () => this.tweens.add({ targets: carrots, scale: 0.5, duration: 400 });
  }

  // Job 2: tidy the toys into the box
  buildToysJob(box, job) {
    const toyBox = this.add.image(0, 70, 'toybox').setScale(0.9);
    const spots = [
      { key: 'ball', x: -82, y: -40 },
      { key: 'block-blue', x: 10, y: -88 },
      { key: 'block-green', x: 88, y: -30 }
    ];
    const toys = spots.map((s) => this.add.image(s.x, s.y, s.key).setAngle(Phaser.Math.Between(-20, 20)));
    box.add(toys);
    box.add(toyBox);   // box in front, so toys drop "inside"

    job.play = (done) => {
      toys.forEach((toy, i) => {
        this.tweens.add({
          targets: toy, x: -50 + i * 50, y: 34, angle: 0, scale: 0.7,
          delay: i * 180, duration: 380, ease: 'Quad.easeIn',
          onStart: () => SFX.play(this, 'pop')
        });
      });
      this.time.delayedCall(3 * 180 + 380, () => {
        this.tweens.add({ targets: toyBox, scaleY: 0.82, duration: 100, yoyo: true, onComplete: done });
      });
    };
    job.reset = () => {
      toys.forEach((toy, i) => {
        this.tweens.add({ targets: toy, x: spots[i].x, y: spots[i].y, scale: 1,
          angle: Phaser.Math.Between(-20, 20), duration: 450, ease: 'Back.easeOut' });
      });
    };
  }

  // Job 3: feed the pet chicks
  buildPetJob(box, job) {
    const bowl = this.add.image(35, 85, 'bowl').setScale(0.9);
    const chick1 = this.add.image(-50, 30, 'chick');
    const chick2 = this.add.image(70, 0, 'chick').setScale(0.7).setFlipX(true);
    box.add([bowl, chick1, chick2]);
    const chicks = [chick1, chick2];

    // The chicks look hungry: a little hop now and then
    this.tweens.add({ targets: chicks, y: '-=8', duration: 300, yoyo: true, repeat: -1, repeatDelay: 1200 });

    job.play = (done) => {
      for (let i = 0; i < 10; i++) {
        const seed = this.add.image(Phaser.Math.Between(0, 70), -110, 'seed');
        box.add(seed);
        this.tweens.add({ targets: seed, y: 78, delay: i * 50, duration: 450, ease: 'Quad.easeIn', onComplete: () => seed.destroy() });
      }
      this.time.delayedCall(450, () => SFX.play(this, 'chirp'));
      this.tweens.add({ targets: chicks, angle: 25, duration: 120, yoyo: true, repeat: 3, delay: 500, onComplete: done });
    };
    job.reset = () => {};
  }

  // ---------- Coins ----------
  payCoin(x, y) {
    const coin = this.add.image(x, y, 'coin').setScale(0).setDepth(45);
    this.sparkles.explode(14, x, y);

    // Coin pops up, then flies to the counter
    this.tweens.chain({
      targets: coin,
      tweens: [
        { scale: 1.3, y: y - 50, duration: 350, ease: 'Back.easeOut' },
        { x: this.counterIcon.x, y: this.counterIcon.y, scale: 1, duration: 650, ease: 'Cubic.easeIn' }
      ],
      onComplete: () => {
        coin.destroy();
        this.addCoin();
      }
    });
  }

  addCoin() {
    this.state.coins += 1;
    this.state.earned += 1;
    GameState.save();
    this.counter.set(this.state.coins);
    SFX.play(this, 'coin');
    this.sparkles.explode(18, this.counterIcon.x, this.counterIcon.y);
    this.connorCheer();
    UI.celebrateBook1IfDone(this, 2500);

    if (this.state.earned === BOOK1_GOALS.earn) this.makeBook1Badges(...this.badgePos);   // Earn badge lights up

    const allDone = Object.values(this.jobs).every((j) => j.done);
    if (allDone && !this.roundDone) {
      this.roundDone = true;
      this.allJobsDone();
    } else if (this.state.earned % CELEBRATE_EVERY === 0) {
      this.celebrate();
    } else if (this.state.coins >= 3 && !this.registry.get('said-goJars')) {
      // Once there are a few coins, show the way to the jars
      this.time.delayedCall(3000, () => {
        if (!this.scene.isActive() || this.state.coins < 3) return;
        this.registry.set('said-goJars', true);
        UI.guideTo(this, this.jarsButton, { voice: 'goJars', gap: 1 });
      });
    }
  }

  // A shower of coins and sparkles every few coins
  celebrate() {
    this.time.delayedCall(700, () => {
      SFX.play(this, 'yay');
      Voice.say(this, 'hooray');
      this.connorCheer(true);
      UI.rain(this, this.sparkles);
    });
  }

  // All three jobs finished: a cheer, then the way to the jars
  allJobsDone() {
    this.time.delayedCall(800, () => {
      if (!this.scene.isActive()) return;
      SFX.play(this, 'yay');
      this.connorCheer(true);
      UI.rain(this, this.sparkles);
      Voice.say(this, 'allJobsDone');
      this.time.delayedCall(1200, () => UI.guideTo(this, this.jarsButton, { ms: 9000 }));
      this.idleTime = -4;   // give the guide time before any other hint
    });
  }

  // ---------- Gentle help when nobody taps ----------
  // Shows ONE clear next step with the guide hand.
  checkIdle() {
    if (this.tipOpen) return;   // a grown-up is reading: stay quiet
    this.idleTime += 1;
    if (this.idleTime < 6) return;
    this.idleTime = 0;
    this.showNextStep();
  }

  showNextStep() {
    const ready = Object.values(this.jobs).filter((j) => j.ready);
    const coins = this.state.coins;
    const jars = this.state.jars;
    // Coins to sort (or every job is done): off to the jars
    if (coins >= 3 || (coins > 0 && !ready.length)) {
      UI.guideTo(this, this.jarsButton, { voice: 'goJars' });
      return;
    }
    // A job is ready: point at it
    if (ready.length) {
      const job = Phaser.Utils.Array.GetRandom(ready);
      UI.guide(this, job.box.x, job.box.y, { radius: this.layout.jobRadius + 12, voice: 'hint' });
      this.tweens.add({ targets: job.box, scale: job.size * 1.06, duration: 300, yoyo: true, repeat: 2 });
      return;
    }
    // Coins waiting in the jars: go and use them
    if (jars.spend + jars.give + jars.save > 0) UI.guideTo(this, this.jarsButton, { voice: 'visitJars' });
  }
}
