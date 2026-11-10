// ------------------------------------------------------------
// GAME MEMORY
// Remembers the child's coins, jars, treats and rewards, even
// after the game is closed. It's kept in this browser on this
// device only. Nothing is sent anywhere.
//
// In the iPhone/iPad/Android app, a second copy is also kept in
// the app's own storage, so progress is safe even if the phone
// tidies away website data.
//
// To start again from zero: on the title screen, press and hold the
// lightbulb, then hold "start the game again". (On the website,
// adding  ?reset  to the end of the address also works.)
// ------------------------------------------------------------

const SAVE_NAME = 'bunnies-and-monies-v1';

const GameState = {
  data: null,
  ready: Promise.resolve(),   // the app waits for this before showing the title screen

  fresh() {
    return {
      coins: 0,                              // coins not yet put in a jar
      earned: 0,                             // all coins ever earned
      jars: { save: 0, spend: 0, give: 0 },
      rewardIndex: 0,                        // which Save reward is next
      rewards: [],                           // rewards unlocked so far
      treats: [],                            // treats bought in the shop
      gifts: 0,                              // coins given to a friend
      savedAt: 0,                            // when progress was last saved (to pick the newest copy)
      musicOn: true,                         // background music on or off (the music button)
      book1Done: false,                      // finished Book 1 (all four money skills used)
      book1Celebrated: false                 // the "You finished Book 1!" party has been shown
    };
  },

  load() {
    let saved = null;
    try {
      if (window.location.search.includes('reset')) localStorage.removeItem(SAVE_NAME);
      saved = JSON.parse(localStorage.getItem(SAVE_NAME));
    } catch (e) { /* private browsing or storage blocked: just start fresh */ }
    this.use(saved || {});

    // App only: check the app's own copy too, and keep whichever is newest
    const prefs = this.appStorage();
    if (prefs) {
      this.ready = prefs.get({ key: SAVE_NAME })
        .then(({ value }) => {
          const appCopy = value ? JSON.parse(value) : null;
          if (appCopy && (appCopy.savedAt || 0) > (this.data.savedAt || 0)) this.use(appCopy);
        })
        .catch(() => { /* fine: the browser copy is used */ });
    }
  },

  use(saved) {
    this.data = Object.assign(this.fresh(), saved);
    this.data.jars = Object.assign({ save: 0, spend: 0, give: 0 }, this.data.jars);
  },

  // The app's own storage (only exists inside the iPhone/iPad/Android app)
  appStorage() {
    const cap = window.Capacitor;
    return cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins ? cap.Plugins.Preferences : null;
  },

  save() {
    this.data.savedAt = Date.now();
    const text = JSON.stringify(this.data);
    try { localStorage.setItem(SAVE_NAME, text); } catch (e) { /* ignore */ }
    const prefs = this.appStorage();
    if (prefs) prefs.set({ key: SAVE_NAME, value: text }).catch(() => {});
  },

  // Book 1: which of the four money skills are done (see BOOK1_GOALS in config.js)
  book1Skills() {
    const d = this.data;
    return {
      earn: d.earned >= BOOK1_GOALS.earn,
      save: d.rewards.length >= BOOK1_GOALS.save,
      spend: d.treats.length >= BOOK1_GOALS.spend,
      give: d.gifts >= BOOK1_GOALS.give
    };
  },

  // True only once: the moment all four skills are done for the first time
  claimBook1() {
    if (this.data.book1Done) return false;
    if (!Object.values(this.book1Skills()).every(Boolean)) return false;
    this.data.book1Done = true;
    this.save();
    return true;
  },

  // The reward the Save jar is working towards now
  nextReward() {
    const i = Math.min(this.data.rewardIndex, SAVE_REWARDS.length - 1);
    return SAVE_REWARDS[i];
  }
};

GameState.load();
