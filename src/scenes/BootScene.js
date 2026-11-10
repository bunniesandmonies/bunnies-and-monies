// ------------------------------------------------------------
// BOOT SCENE
// Runs first. Loads all the pictures from the books and any
// recorded sounds (with a loading bar), then opens the title screen.
//
// The pictures live in assets/images/characters and
// assets/images/scenes. They are also packed into
// assets/images/embedded-images.js so the game still works when
// you double-click index.html. See README.md.
//
// Each picture's name is its file name without the ending, e.g.
//   'connor'   = characters/connor.png
//   'page-04'  = scenes/page-04.jpg
// ------------------------------------------------------------

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.makeLoadingBar();

    // Load every picture from the books
    Object.keys(EMBEDDED_IMAGES).forEach((key) => {
      this.load.image(key, EMBEDDED_IMAGES[key].src);
    });

    // Load any recorded sounds or voice lines from assets/sounds
    Object.keys(EMBEDDED_SOUNDS).forEach((key) => {
      this.load.audio(key, EMBEDDED_SOUNDS[key].src);
    });
  }

  create() {
    Art.makeAll(this);           // coin, sparkles and chore pictures (see src/art.js)
    VillageArt.makeTextures(this);   // village houses, trees, shop, butterflies (see src/village-art.js)
    // In the app, wait (at most 1.5 seconds) for saved progress to be read
    const timeout = new Promise((done) => setTimeout(done, 1500));
    Promise.race([GameState.ready, timeout]).then(() => this.scene.start('TitleScene'));
  }

  // A gold bar that fills up while pictures load
  makeLoadingBar() {
    const w = this.scale.width;
    const h = this.scale.height;
    const barWidth = Math.min(500, w * 0.7);

    this.add.text(w / 2, h / 2 - 70, 'Loading...', {
      fontFamily: FONT, fontSize: '48px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5);

    this.add.rectangle(w / 2, h / 2, barWidth + 12, 52, COLOURS.wood).setOrigin(0.5);
    const bar = this.add.rectangle(w / 2 - barWidth / 2, h / 2, 1, 40, COLOURS.gold).setOrigin(0, 0.5);

    this.load.on('progress', (amount) => {
      bar.width = Math.max(1, barWidth * amount);
    });
  }
}
