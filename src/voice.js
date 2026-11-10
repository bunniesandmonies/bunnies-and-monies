// ------------------------------------------------------------
// VOICEOVER
// Children don't need to read: a friendly voice says everything.
//
// NOW: every line below has a natural-sounding recording in
// assets/sounds (voice-<name>.mp3), made with the free Kokoro voice
// "Heart" (see tools/make_voice_lines.py). The game plays those.
// The device's built-in computer voice is only a backup for a line
// that has no recording yet.
//
// CHANGED THE WORDS? Remake the recordings with
//     python3 tools/make_voice_lines.py
// then rebuild the packed files (see README.md). Or just ask Claude.
//
// PREFER A REAL VOICE ACTOR? Record each line and save it in
// assets/sounds with the name shown (for example voice-intro.mp3),
// replacing the file there, then rebuild the packed files.
// ------------------------------------------------------------

const VOICE_LINES = {
  intro: 'Welcome to Bunny Village! Tap a job to help, and earn carrot coins!',  // voice-intro
  hint: 'Tap a job to earn a carrot coin!',                                       // voice-hint
  water: 'Splish splash! You watered the carrots. Here is a carrot coin!',        // voice-water
  toys: 'All tidy! You put the toys away. Here is a carrot coin!',                // voice-toys
  pet: 'Yum yum! You fed the chicks. Here is a carrot coin!',                     // voice-pet
  done: 'That job is done. Try another one!',                                     // voice-done
  connor: "Hi! I'm Connor! Helping out earns carrot coins!",                      // voice-connor
  hooray: 'Hooray! Look at all your carrot coins!',                               // voice-hooray
  goJars: 'Tap the jars to put your coins away!',                                 // voice-goJars
  allJobsDone: "Great work! All the jobs are done! Let's put your coins in the jars!", // voice-allJobsDone
  visitJars: 'Tap the jars to visit the shop or the Sharing Basket!',             // voice-visitJars

  askGrownUp: 'This part is for grown-ups. Please ask a grown-up to help!',      // voice-askGrownUp

  // Coin jars
  jarsIntro: 'Drag your coins into the jars! Save for a surprise, spend at the shop, or give to help others.', // voice-jarsIntro
  jarsHint: 'Drag a coin into a jar!',                                            // voice-jarsHint
  intoSave: 'Into the Save jar! Saving for a surprise.',                          // voice-intoSave
  intoSpend: 'Into the Spend jar! Ready for the shop.',                           // voice-intoSpend
  intoGive: 'Into the Give jar! Ready to help others.',                           // voice-intoGive
  tapJar: 'Tap a jar to use your coins!',                                         // voice-tapJar
  noCoins: "Let's earn more coins in the village!",                               // voice-noCoins
  tapSpendJar: 'Tap the Spend jar to visit the shop!',                            // voice-tapSpendJar
  tapGiveJar: 'Tap the Give jar to fill the Sharing Basket!',                     // voice-tapGiveJar
  tapSaveJar: 'Tap the Save jar to see your savings!',                            // voice-tapSaveJar
  goalReached: 'You did it! You saved enough for a surprise!',                    // voice-goalReached

  // Shop (Spend jar)
  shopIntro: 'Welcome to the shop! Tap a treat to buy it with your Spend coins.', // voice-shopIntro
  bought: 'Great choice! Enjoy your treat!',                                      // voice-bought
  needMore: 'That one needs a few more Spend coins. You can save up for it!',     // voice-needMore
  yumCarrot: 'Crunch, crunch! What a yummy carrot!',                              // voice-yumCarrot
  yumCupcake: 'Mmm! This cupcake is so yummy!',                                   // voice-yumCupcake
  yumLolly: 'Yum, yum! My lollipop is so sweet and sparkly!',                   // voice-yumLolly
  balloonFun: 'Look at me! I am floating up, up and away!',                      // voice-balloonFun
  thanksShopping: 'Thank you for shopping!',                                      // voice-thanksShopping

  // Helping others (Give jar): the Sharing Basket. Liliana is the helper.
  giveIntro: 'This is the Sharing Basket! Tap a coin to turn it into food for bunnies who need a little help.', // voice-giveIntro
  giveEmpty: 'Put coins in the Give jar to help bunnies who need it.',             // voice-giveEmpty
  thanks: 'Thank you, Connor! This food will help a bunny family.',              // voice-thanks
  thanks2: 'Yum! Sharing food helps bunnies who need it.',                       // voice-thanks2
  thankCard: 'A thank-you card from the bunny families! Your kindness made them smile.', // voice-thankCard
  basketFull: 'The basket is full! Off it goes to bunny families who need a little help. Hooray!', // voice-basketFull

  // How to play (tutorial), one line per step: src/scenes/TutorialScene.js
  tut1: "Welcome to Bunny Village! Let's learn to earn, save, spend and give carrot coins!",          // voice-tut1
  tut2: 'Help with little jobs, like watering carrots. Every job earns a carrot coin!',             // voice-tut2
  tut3: 'Drag coins into the Save jar. Fill it up to get a surprise!',                              // voice-tut3
  tut4: 'Visit the shop. Use your Spend coins to buy a yummy treat!',                               // voice-tut4
  tut5: 'Give coins to fill the Sharing Basket with food for bunnies who need a little help!',     // voice-tut5
  tut6: "Hooray! Earn, save, spend wisely and give. You're ready to play!",                         // voice-tut6

  // Finishing Book 1 (src/scenes/FinishScene.js) and the badges in the village
  book1Done: 'Hooray! You finished Book One, The Carrot Coin Mystery! You can earn, save, spend and give. Well done!', // voice-book1Done
  book1Progress: 'Earn coins, save for a surprise, buy a treat and help others to finish the book!',             // voice-book1Progress
  certificate: 'Look at everything you did! You can keep playing in Bunny Village.',                                  // voice-certificate

  // Saving (Save jar)
  saveIntro: 'Keep saving coins to get the surprise! Tap your toys to play.',     // voice-saveIntro
  saveMore: 'Earn more coins and put them in the Save jar to get your surprise!'  // voice-saveMore
};

const Voice = {
  current: null,

  say(scene, key) {
    this.stop();
    const recording = 'voice-' + key;
    if (scene.cache.audio.exists(recording)) {
      this.current = scene.sound.add(recording);
      this.current.once('complete', () => Music.duck(false));
      Music.duck(true);
      this.current.play();
      return;
    }
    // Placeholder: the device's built-in voice
    if (!window.speechSynthesis || !VOICE_LINES[key]) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      // Voices are still loading: speak as soon as they're ready
      this.pending = key;
      window.speechSynthesis.onvoiceschanged = () => {
        const k = this.pending;
        this.pending = null;
    Music.duck(false);
        if (k && window.speechSynthesis.getVoices().length) this.say(scene, k);
      };
      return;
    }
    const voice = this.pickVoice();
    if (!voice) return;   // privacy: never use online voices (see below)
    const line = new SpeechSynthesisUtterance(VOICE_LINES[key]);
    line.rate = 0.92;    // a little slower, for small children
    line.pitch = 1.05;   // close to natural (higher pitches sound robotic)
    line.voice = voice;
    window.speechSynthesis.speak(line);
  },

  // Wait until the current line has finished (so lines don't cut each other off)
  whenQuiet(scene, then) {
    const cur = this.current;
    if (!cur || !cur.isPlaying) { then(); return; }
    let done = false;
    const go = () => { if (!done && scene.scene.isActive()) { done = true; then(); } };
    cur.once('complete', go);
    cur.once('stop', go);
    scene.time.delayedCall(4000, go);   // safety net
  },

  // Say a line, then do something when it has finished
  sayThen(scene, key, then) {
    this.say(scene, key);
    let done = false;
    const go = () => { if (!done && scene.scene.isActive()) { done = true; then(); } };
    if (this.current) this.current.once('complete', go);
    scene.time.delayedCall(this.current ? (this.current.duration * 1000 + 1500) : 2500, go);   // safety net
  },

  // Say a line only the first time it's needed while the game is open
  sayOnce(scene, key) {
    const flag = 'said-' + key;
    if (scene.registry.get(flag)) return false;
    scene.registry.set(flag, true);
    this.say(scene, key);
    return true;
  },

  stop() {
    this.pending = null;
    if (this.current) { this.current.stop(); this.current.destroy(); this.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  },

  // PRIVACY: only use voices that run on the device itself.
  // Some browsers offer "online" voices that send the words to the
  // internet to be spoken. We never use those. (The words are only
  // the game's own lines, but nothing should leave the device.)
  // Prefers an Australian English voice, then any English voice.
  pickVoice() {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.localService);
    return voices.find((v) => v.lang === 'en-AU')
      || voices.find((v) => v.lang && v.lang.replace('_', '-').startsWith('en'))
      || null;
  }
};
