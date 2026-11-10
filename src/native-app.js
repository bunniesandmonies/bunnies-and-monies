// ------------------------------------------------------------
// APP-ONLY EXTRAS (iPhone, iPad and Android apps)
// These only switch on inside the Capacitor app. In a web
// browser this file does nothing, so the website is unchanged.
//
//  - Android back button: goes back one screen (from the title
//    screen it tucks the app away) instead of quitting suddenly.
//  - The voice stops when the app goes into the background.
// ------------------------------------------------------------

const NativeApp = {
  isApp: !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()),

  plugin(name) {
    return this.isApp && window.Capacitor.Plugins ? window.Capacitor.Plugins[name] : null;
  },

  // Where the back button goes from each screen
  BACK_TO: {
    VillageScene: 'TitleScene',
    JarsScene: 'VillageScene',
    ShopScene: 'JarsScene',
    GiveScene: 'JarsScene',
    SaveScene: 'JarsScene',
    FinishScene: 'VillageScene'
  },

  setup(game) {
    const App = this.plugin('App');
    if (!App) return;

    App.addListener('backButton', () => {
      const scene = game.scene.getScenes(true)[0];
      if (!scene) return;
      if (scene.closeOverlay) { scene.closeOverlay(); return; }   // close the parent gate or grown-ups card first
      if (scene.tipOpen) return;
      const target = scene.scene.key === 'TutorialScene'
        ? (game.registry.get('tutorialFrom') || 'TitleScene')    // close the tutorial
        : this.BACK_TO[scene.scene.key];
      if (target) UI.goTo(scene, target);
      else App.minimizeApp();                       // on the title screen: tuck the app away
    });

    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) Voice.stop();
    });
  }
};
