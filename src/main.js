// ------------------------------------------------------------
// START THE GAME
// This sets up Phaser and lists every scene (screen) in order.
// The first scene in the list runs first.
// ------------------------------------------------------------

let shape = currentShape();

const config = {
  type: Phaser.AUTO,            // use the fastest drawing method available
  parent: 'game',               // draw inside <div id="game">
  backgroundColor: COLOURS.cream,
  scale: {
    mode: Phaser.Scale.FIT,     // shrink or grow to fit any screen
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: false,        // keep room for the grown-ups tip bar below the game
    width: SIZES[shape].width,
    height: SIZES[shape].height
  },
  input: {
    activePointers: 3           // little hands often touch with more than one finger
  },
  banner: false,                // no messages or links in the browser console
  disableContextMenu: true,     // no right-click / long-press menu
  scene: [BootScene, TitleScene, VillageScene, JarsScene, ShopScene, GiveScene, SaveScene, TutorialScene, FinishScene]
};

const game = new Phaser.Game(config);
NativeApp.setup(game);   // app-only extras (does nothing on the website)

// When a phone or tablet is turned, switch between wide and tall
// and redraw the screen that is showing.
window.addEventListener('resize', () => {
  const newShape = currentShape();
  if (newShape === shape) return;
  shape = newShape;
  game.registry.set('rotating', true);   // so the voice doesn't repeat itself
  game.scale.setGameSize(SIZES[shape].width, SIZES[shape].height);
  game.scene.getScenes(true).forEach((scene) => {
    if (scene.scene.key !== 'BootScene') scene.scene.restart();
  });
});
