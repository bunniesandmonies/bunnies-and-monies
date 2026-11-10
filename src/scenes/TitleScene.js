// ------------------------------------------------------------
// TITLE SCENE
// The first screen children see: the game name, the main bunny
// gently bouncing, falling coins and a big Play button.
// It arranges itself for wide screens and tall (phone) screens.
// ------------------------------------------------------------

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tall = h > w;
    this.starting = false;
    this._leaving = false;
    this.registry.set('rotating', false);

    // Where things go, for each screen shape
    const layout = tall
      ? { titleY: 150, titleSize: 84, titleWrap: true,
          bunnyX: w / 2, bunnyFeetY: 860, bunnyHeight: 560,
          playX: w / 2, playY: 1000, helpY: 1150 }
      : { titleY: 95, titleSize: 96, titleWrap: false,
          bunnyX: w * 0.27, bunnyFeetY: 650, bunnyHeight: 470,
          playX: w * 0.68, playY: 400, helpY: 585 };

    // Gentle coins falling in the background
    this.time.addEvent({ delay: 600, loop: true, callback: () => this.dropCoin() });

    // Wooden floor strip along the bottom
    this.add.rectangle(w / 2, h - 30, w, 60, COLOURS.wood);

    // Game title
    const title = this.add.text(w / 2, layout.titleY,
      layout.titleWrap ? 'Bunnies\n& Monies' : 'Bunnies & Monies', {
        fontFamily: FONT,
        fontSize: layout.titleSize + 'px',
        fontStyle: 'bold',
        color: COLOURS.goldText,
        stroke: COLOURS.woodText,
        strokeThickness: 14,
        align: 'center'
      }).setOrigin(0.5);

    this.tweens.add({
      targets: title, scale: 1.04, duration: 1400,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    this.makeBunny(layout.bunnyX, layout.bunnyFeetY, layout.bunnyHeight);
    this.makePlayButton(layout.playX, layout.playY);
    this.makeHowToPlayButton(layout.playX, layout.helpY);
    UI.musicButton(this);
    // Music starts with the first tap anywhere (browsers need a tap first)
    this.input.once('pointerdown', () => Music.start(this));
    Music.start(this);
    UI.parentTip(this, 'title', true);   // tip for grown-ups (+ start again)
  }

  // The main character, gently bouncing, with a soft shadow
  makeBunny(x, feetY, height) {
    const shadow = this.add.ellipse(x, feetY, height * 0.5, 34, COLOURS.wood, 0.25);

    const bunny = this.add.image(x, feetY, MAIN_CHARACTER).setOrigin(0.5, 1);
    const size = height / bunny.height;
    bunny.setScale(size);

    // Up and down, slowly and softly
    this.tweens.add({
      targets: bunny,
      y: feetY - 35,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // The shadow shrinks a little when the bunny is up
    this.tweens.add({
      targets: shadow,
      scaleX: 0.8,
      alpha: 0.15,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Tapping the bunny makes it wiggle happily
    bunny.setInteractive({ useHandCursor: true, pixelPerfect: false });
    bunny.on('pointerdown', () => {
      this.tweens.add({
        targets: bunny,
        angle: { from: -8, to: 8 },
        duration: 120,
        yoyo: true,
        repeat: 2,
        onComplete: () => bunny.setAngle(0)
      });
    });
  }

  // A big, easy-to-press Play button (good for small fingers)
  // HOW TO PLAY: a question-mark button that opens the tutorial
  makeHowToPlayButton(x, y) {
    const width = 410, height = 96;
    const btn = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(COLOURS.wood, 1).fillRoundedRect(-width / 2, -height / 2 + 8, width, height, 30);
    g.fillStyle(COLOURS.cream, 1).fillRoundedRect(-width / 2, -height / 2, width, height, 30);
    g.lineStyle(6, COLOURS.wood, 1).strokeRoundedRect(-width / 2, -height / 2, width, height, 30);
    UI.buttonTexture(this, 'button-help-small', ICONS.help, 34);
    const icon = this.add.image(-width / 2 + 52, 2, 'button-help-small');
    const label = this.add.text(42, 2, 'HOW TO PLAY', {
      fontFamily: FONT, fontSize: '36px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5);
    btn.add([g, icon, label]);
    btn.setSize(width, height + 8);
    btn.setInteractive({ useHandCursor: true });
    // A little wiggle now and then so children notice the question mark
    this.tweens.add({ targets: icon, angle: { from: -12, to: 12 }, duration: 160, yoyo: true, repeat: 3, repeatDelay: 0, loop: -1, loopDelay: 3500 });
    btn.on('pointerdown', () => { btn.setScale(0.95); SFX.play(this, 'pop'); });
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerup', () => {
      btn.setScale(1);
      if (this.starting) return;
      this.starting = true;
      Music.start(this);
      this.registry.set('tutorialFrom', 'TitleScene');
      this.registry.set('tutorialStep', 0);
      UI.goTo(this, 'TutorialScene');
    });
    return btn;
  }

  makePlayButton(x, y) {
    const width = 420;
    const height = 170;

    const button = this.add.container(x, y);

    const shadow = this.add.graphics();
    shadow.fillStyle(COLOURS.wood, 1);
    shadow.fillRoundedRect(-width / 2, -height / 2 + 14, width, height, 48);

    const face = this.add.graphics();
    face.fillStyle(COLOURS.gold, 1);
    face.fillRoundedRect(-width / 2, -height / 2, width, height, 48);
    face.lineStyle(10, COLOURS.wood, 1);
    face.strokeRoundedRect(-width / 2, -height / 2, width, height, 48);

    const label = this.add.text(0, 0, '▶  PLAY', {
      fontFamily: FONT,
      fontSize: '80px',
      fontStyle: 'bold',
      color: COLOURS.woodText
    }).setOrigin(0.5);

    button.add([shadow, face, label]);

    // The tap area is a bit BIGGER than the button, so near-misses still count
    const pad = 30;
    button.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-width / 2 - pad, -height / 2 - pad, width + pad * 2, height + pad * 2 + 14),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    });

    // Button "breathes" to invite a tap
    const pulse = this.tweens.add({
      targets: button, scale: 1.06, duration: 800,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    const pressDown = () => { face.y = 10; label.y = 10; };
    const pressUp = () => { face.y = 0; label.y = 0; };

    button.on('pointerover', () => { pulse.pause(); button.setScale(1.1); });
    button.on('pointerout', () => { pressUp(); button.setScale(1); pulse.resume(); });
    button.on('pointerdown', pressDown);

    // Start on release. Ignore extra taps once the game is starting.
    button.on('pointerup', () => {
      pressUp();
      if (this.starting) return;
      this.starting = true;
      Music.start(this);
      this.cameras.main.fadeOut(400, 235, 216, 191); // fade to cream
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('VillageScene'));
    });
  }

  // One coin drops from the top and disappears off the bottom
  dropCoin() {
    const w = this.scale.width;
    const h = this.scale.height;
    const coin = this.add.image(Phaser.Math.Between(40, w - 40), -50, 'coin')
      .setScale(Phaser.Math.FloatBetween(0.4, 0.8))
      .setAlpha(0.5)
      .setDepth(-1);

    this.tweens.add({
      targets: coin,
      y: h + 50,
      angle: Phaser.Math.Between(-180, 180),
      duration: Phaser.Math.Between(4000, 7000),
      onComplete: () => coin.destroy()
    });
  }
}
