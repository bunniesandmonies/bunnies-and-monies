# Bunnies & Monies

A financial literacy game for children aged 0 to 9, made with Phaser 3.

## How to play it

Double-click **index.html**. It opens in your web browser. There's nothing to install and you don't need the internet.

It works on computers, tablets and phones. The screen arranges itself for wide screens and tall (phone) screens, and changes if the device is turned.

## What's in the folder

| Folder or file | What it is |
|---|---|
| `index.html` | The front door. Open this to start the game. |
| `lib/phaser.min.js` | Phaser, the game engine. You never edit this file. |
| `src/config.js` | Settings: brand colours, font, the star bunny, the Sharing Basket helper and basket size, **shop treats and prices**, **Save goals and surprises**. |
| `src/state.js` | The game's memory: coins, jars, treats and surprises are remembered between visits. |
| `src/ui.js` | Shared pieces: buttons, coin counter, sparkles, backgrounds. |
| `src/jar.js` | The glass coin jar used on the jar screens. |
| `src/voice.js` | **The words the voice says.** Change them here. |
| `src/parent-tips.js` | **The tips for grown-ups** on each screen. Change them here. |
| `src/sounds.js` | The happy sound effects (coin "ding", splash, chick cheep and so on). |
| `src/music.js` | The gentle background music and the music on/off button. |
| `src/village-art.js` | The village scenery: houses, trees, flowers, path, shop, giving arch, butterflies, birds, leaves and strolling bunnies. |
| `src/art.js` | Simple drawn pictures: carrot coin, sparkles, chores, jars and labels, treats, surprises. |
| `src/main.js` | Starts the game and lists every screen. |
| `src/native-app.js` | Extras that switch on only in the iPhone/iPad/Android app (back button, pausing the voice). |
| `src/scenes/` | One file for each screen (we call screens "scenes"). |
| `assets/images/characters/` | The bunny family, cut out from the book pictures. |
| `assets/images/scenes/` | Pages from *The Carrot Coin Mystery*, made smaller for the web. |
| `assets/sounds/` | Put recorded sounds and voice lines here. |
| `tools/` | Helpers: one packs pictures and sounds so double-clicking works; one runs the child safety check. |
| `PRIVACY.md` | Plain-English privacy and child safety statement. |

## The screens (scenes)

1. **BootScene**: shows a loading bar while pictures and sounds load.
2. **TitleScene**: game name, the main bunny gently bouncing (tap him and he wiggles), falling coins and a big Play button.
3. **VillageScene (Bunny Village)**: the child taps a job in the carrot garden to earn a carrot coin, and taps the savings jars, the shop or the giving corner to visit them.
4. **JarsScene (Coin Jars)**: drag coins into the Save, Spend and Give jars.
5. **ShopScene**: spend coins from the Spend jar on treats.
6. **GiveScene**: help others: coins from the Give jar become food in the village Sharing Basket for bunnies who need a little help.
7. **SaveScene**: see the Save goal and play with the surprises collected.
8. **TutorialScene (How to Play)**: a 6-step illustrated guide to the whole game.
9. **FinishScene (You finished Book 1!)**: the party and Money Skills certificate when all four money skills are done.

How to get around: in the village, tap the **jar button** (next to the coin counter on wide screens, bottom-left on phones) to go to the jars. On the jars screen, tap a jar to open it. The **arrow button** (top left) always goes back.

## Bunny Village

The village is a cheerful bunny community: cosy houses, apple trees, flowers, a winding path and a fenced **carrot garden**. Harvey strolls along the path, Liliana waves beside the Sharing Basket under the giving arch, Mama waits by her shop, and butterflies, birds and floating leaves drift by. The scenery is drawn once and saved as one picture, so it stays smooth on phones.

Three places can be tapped (each one glows and bounces now and then as a hint):

| Place | What it is | Opens |
|---|---|---|
| Savings jars | Three big jars (Save, Spend, Give) on a shelf, showing your real coins | The coin jars screen |
| Shop | Wooden shop with a striped awning, Mama beside it | The shop |
| Giving corner | A flowery arch with a big heart, the Sharing Basket and Liliana | Helping others (Sharing Basket) |

Tap a strolling bunny and it hops. The layout changes for phones held upright, with everything stacked to fit.

## Music

A gentle music-box tune (`assets/sounds/music-village.mp3`, made by `tools/make_music.py`, so there are no rights to worry about) plays quietly on every screen. It gets quieter while the voice talks. The **musical-note button** (top left, under the home or back button) turns it off and on, and the game remembers the choice.

## How to Play (tutorial)

A big **HOW TO PLAY** button with a question mark sits on the title screen, and a **?** button in the village opens it any time. The 6 steps are:

1. Welcome to Bunny Village
2. Earn Carrot Coins
3. Save Your Coins
4. Spend Your Coins
5. Give to Others
6. Complete Your Adventure, ending with **LET'S PLAY!**, which goes to the village

Each step has a big moving picture made from the game's own characters (for example, a hand dragging coins into the Save jar until a surprise pops out), a short sentence, a spoken line, **BACK** and **NEXT** buttons, dots and "Step 2 of 6" to show progress, and **✕** to leave. The arrow keys also work on computers. To change the words, edit `TUTORIAL_STEPS` at the top of `src/scenes/TutorialScene.js` and the `tut1` to `tut6` lines in `src/voice.js`, then remake the recordings.

## Finishing Book 1

The game has a happy ending for Book 1 (The Carrot Coin Mystery), but it never stops: children can keep playing afterwards and nothing is taken away.

Book 1 is finished when the child has used all **four money skills**:

| Skill | What the child does |
|---|---|
| Earn | earns 10 coins doing jobs in the village |
| Save | fills the Save jar and unlocks a surprise |
| Spend | buys a treat in the shop |
| Give | gives a coin to the Sharing Basket to help others |

- Four small badges under the coin counter in the village show progress. Each one lights up with a green tick when that skill is done. Tapping them while unfinished makes the voice say what is still to do, and the unfinished badges wiggle.
- When the last skill is done (from any screen), the game moves to **"You finished Book 1!"**: confetti, the bunnies cheering, a **Money Skills Certificate** showing what the child did, and a big **KEEP PLAYING** button back to the village.
- The party opens automatically only once. After that, tapping the gold badges in the village opens the certificate again.
- If the app is closed just before the party, it shows the next time the village opens.
- "Start the game again from zero" (grown-ups card) resets Book 1 too.
- To make Book 1 quicker or longer, change the numbers in `BOOK1_GOALS` in `src/config.js`.

## Showing the way: what to do next

So children always know how to move on, the game shows **one** clear next step at a time: a big bouncing pointing hand with a golden glow, plus a short spoken line. It disappears as soon as the child taps anything, and comes back after a few quiet seconds. The spoken hints repeat gently (about every 15 to 25 seconds), not only once.

| Where | What it points to |
|---|---|
| Village, first visit | The first job (watering the carrots) |
| Village, a job is ready | A job: "Tap a job to earn a carrot coin!" |
| Village, all 3 jobs done | A cheer, "Great work! All the jobs are done! Let's put your coins in the jars!", then the jars button |
| Village, 3 or more coins | The jars button: "Tap the jars to put your coins away!" |
| Village, coins waiting in jars | The jars button: "Tap the jars to visit the shop or the Sharing Basket!" |
| Jars, coins in the tray | A see-through coin and hand show how to drag a coin into a jar |
| Jars, all coins sorted | The one jar to open next (Spend first, then Give, then Save): "Tap the Spend jar to visit the shop!" |
| Jars, no coins anywhere | The village button: "Let's earn more coins in the village!" |
| Shop | A treat the child can afford, or, when the Spend jar is empty, the back arrow |
| Sharing Basket | The basket, or, when the Give jar is empty, the back arrow |
| Save | The toys to play with, then the back arrow: "Earn more coins and put them in the Save jar to get your surprise!" |

In the village, the next **Book 1 badge** still to do (Earn, Save, Spend or Give) glows gently, so children can see what's left. The guide hand is `UI.guide()` and `UI.guideTo()` in `src/ui.js`; each screen decides its next step in `showNextStep()` (or `giveHint()` on the jars screen).

## How the jobs work

There are three jobs, each shown as a big round picture:

| Job | What happens when tapped |
|---|---|
| Water the carrots | The watering can tips, water drips and the carrots grow. |
| Tidy the toys | The ball and blocks hop into the toy box. |
| Feed the pet chicks | Seeds fall into the bowl and the chicks peck happily. |

Each time a job is done:

- the voice says what happened ("Splish splash! You watered the carrots. Here is a carrot coin!")
- a carrot coin pops out with sparkles and flies up to the **coin counter** at the top
- a happy "ding" plays and the counter jumps
- a green tick shows the job is done. After 4 seconds the job is ready again.

Extras for little ones:

- **Every 5 coins:** a celebration with a hooray tune, falling coins and Connor doing a spin.
- **Nobody tapping?** After 6 seconds a job glows and wiggles to show where to tap, and the voice gives a gentle hint now and then.
- **Tapping a finished job:** it gives a soft shake and says "try another one".
- **Speaker button (top right):** hear the instructions again.
- **Home button (top left):** back to the title screen.
- **Tap Connor:** he says hello.

There's no reading anywhere: only pictures, numbers, sounds and the voice.

To change timings, look at the top of `src/scenes/VillageScene.js`: `JOB_RESET_SECONDS` and `CELEBRATE_EVERY`.

## Tips for grown-ups

Every screen shows a one-sentence tip about its money lesson in a **brown "For grown-ups" bar along the bottom of the page**. The bar sits outside the play area, so it never covers anything children tap, and children who can't read simply ignore it. The tip changes with each screen:

| Screen | Tip |
|---|---|
| Title | Bunnies & Monies builds early money habits through play: earning, saving, spending and giving. |
| Village | Earning: money comes from doing work and helping, so talk about the jobs your family does to earn money. |
| Coin jars | Every coin can have a job: sorting into Save, Spend and Give jars shows that we choose what our money is for. |
| Shop | Spending: things cost money, and when we don't have enough yet, we can wait and save up instead. |
| Give | Giving: sharing some of what we have helps others and feels good too. |
| Save | Saving: putting a little aside each time adds up to something special later. |

On the title screen, the bar also shows the privacy note.

There's also a small **lightbulb button** under the speaker button. Tapping it opens the **parent gate**: a grown-up maths question written in words (for example "What is fourteen times six?"), answered on a number pad, with a voice asking children to fetch a grown-up. After the right answer, a card shows the tip in large text. On the title screen, the card also offers the full **privacy policy** (read inside the game) and a **"Hold to start the game again from zero"** button. Apple's Kids Category and Google's Families policy expect this kind of gate in front of settings, links and purchases. Any link or real purchase added in future must use `ParentGate.ask` (see `src/parent-gate.js`).

To change the words, edit `src/parent-tips.js`.

## Child safety and privacy

- **No ads, no links, no chat, no personal information.** There are no text boxes, so nothing can be typed in.
- **No internet.** A safety rule in `index.html` tells the browser to block every connection outside the game's own files.
- **Progress is saved in the browser on that device only** (coins, jars, treats, surprises, hearts). Nothing identifies the child, and nothing is sent anywhere.
- The placeholder voice uses **device voices only**, never online voices.
- No right-click or long-press menus, and no "save image" pop-ups.

Full details are in **PRIVACY.md**. To check the game at any time, run `python3 tools/safety_check.py` (or ask Claude). It should end with "All clear".

## The coin jars

Coins earned in the village wait in a tray. The child **drags** each coin into a jar. Each jar has a picture label, so there's no reading:

| Jar | Lid | Picture | Tap the jar to... |
|---|---|---|---|
| Save | Red | Piggy bank | See the goal and the surprises collected |
| Spend | Purple | Shopping bag | Go to the shop |
| Give | Yellow | Heart | Help others (Sharing Basket) |

- Coins stack up inside the glass, and the number on the lid shows how many.
- **A coin dropped anywhere else just floats back.** There's no "wrong" sound.
- If a child taps a coin instead of dragging it, a see-through coin and a pointing hand show how to drag. The same hint appears if nobody touches anything for a while.
- When the tray is empty, a watering-can button in the tray leads back to the village to earn more.

**Save:** the jar has a dotted goal line, with the surprise shown as a mystery shape beside it. When enough coins are saved, the surprise appears with sparkles and a hooray, and joins the collection. The goals start small and grow. The surprises are a bouncing bunny ball (5 coins, from the book), a kite (8), a drum (10), then trophies (10 each). On the Save screen, the coin spaces fill up so the child can see how close they are, and they can tap collected surprises to play with them (the ball bounces, the kite flies, the drum plays).

**Spend:** Mama's shop has a carrot (1 coin), cupcake (2), lollipop (2) and balloon (3). Prices are shown as coin pictures, which look faded when there aren't enough coins. Tapping a treat the child can afford sends the coins to Mama, and Connor enjoys it with his own little reaction: he munches the carrot (crunch, crunch!), nibbles the cupcake with flying sprinkles, licks the lollipop with sparkles, or floats up with the balloon and bounces back down. Then Mama waves and says "Thank you for shopping!" Eaten treats are gone (yum!); the lollipop and balloon go into Connor's basket. To add a reaction for a new treat, see `enjoy()` in `src/scenes/ShopScene.js` (other treats get a happy hop). If there aren't enough coins, the treat just wiggles and the voice says "You can save up for it!" Nothing is lost.

**Give (helping others):** the village **Sharing Basket** collects food for bunny families who need a little help. Liliana is the cheerful helper who looks after it. Tap a coin, drag it to the basket, or just tap the basket: the coin flies to Liliana, who catches it as food (a carrot, an apple or a loaf of bread) with a happy reaction (a sniff, a wiggle or a twirl) and tosses it into the basket while Connor jumps for joy. Hearts float up, and a new heart joins the kindness row at the top: one heart for every coin ever given. When the basket is full (5 coins), everyone cheers, it is sent off to the bunny families who need it, a fresh empty basket arrives, and a **thank-you card** from the bunny families flutters in ("Your kindness made them smile") before joining the kindness hearts.

We use the gentle words "bunnies who need a little help" rather than "the poor", and nobody in the game is shown as sad or in need. That keeps it kind and positive for young children, and grown-ups can talk about real food banks using the parent tip.

**Gentle by design:** no timers, no losing, no failure screens, and nothing is ever taken away.

To change treats, prices, goals or surprises, edit `TREATS` and `SAVE_REWARDS` in `src/config.js`. To change the basket helper, edit `FRIEND_CHARACTER`. To change how many coins fill a basket, or the foods, edit `SHARING_BASKET_SIZE` and `SHARING_FOODS` (the food pictures are drawn in `src/art.js`).

## The game remembers

Coins, jars, treats, surprises and hearts are saved in the browser on that device after every change. They're still there next time the game is opened. Nothing is sent anywhere.

To start again from zero: on the title screen, press and hold the lightbulb, then press and hold "Start the game again from zero". (For testing, adding `?reset` to the end of the address also works.)

Note: progress belongs to that browser on that device. A different browser or device starts fresh. Clearing the browser's site data or using private browsing also starts fresh.

## The voiceover

Every spoken line now has a **natural-sounding recording** in `assets/sounds`, made with the free Kokoro voice model's warm female voice "Heart", spoken a little slowly for young children. Because they're real audio files, they sound the same on every device, **including Android**. The voice works fully offline, and nothing is sent anywhere.

The device's built-in computer voice is now only a backup, for any new line that doesn't have a recording yet.

**New or changed words?** Edit the line in `src/voice.js`. For a new line, run `python3 tools/make_voice_lines.py`, which records only lines that don't have a recording yet, so existing recordings are never overwritten. For a changed line, delete its old `voice-<name>.mp3` first, or use `--all` to remake every line. Then run `python3 tools/build_embedded_files.py` (or ask Claude). To try a different voice, change `VOICE` at the top of `tools/make_voice_lines.py`, for example to `af_bella` or `bf_emma` (British).

Credit: voice made with Kokoro-82M by hexgrad (Apache 2.0 licence, free for commercial use).

**Prefer a real voice actor?** Record each line and replace the matching file in `assets/sounds`, then rebuild the packed files. The file names are:

   | File name | Line |
   |---|---|
   | `voice-intro.mp3` | Welcome to Bunny Village! Tap a job to help, and earn carrot coins! |
   | `voice-hint.mp3` | Tap a job to earn a carrot coin! |
   | `voice-water.mp3` | Splish splash! You watered the carrots. Here is a carrot coin! |
   | `voice-toys.mp3` | All tidy! You put the toys away. Here is a carrot coin! |
   | `voice-pet.mp3` | Yum yum! You fed the chicks. Here is a carrot coin! |
   | `voice-done.mp3` | That job is done. Try another one! |
   | `voice-connor.mp3` | Hi! I'm Connor! Helping out earns carrot coins! |
   | `voice-hooray.mp3` | Hooray! Look at all your carrot coins! |
   | `voice-goJars.mp3` | Tap the jars to put your coins away! |
   | `voice-jarsIntro.mp3` | Drag your coins into the jars! Save for a surprise, spend at the shop, or give to help others. |
   | `voice-jarsHint.mp3` | Drag a coin into a jar! |
   | `voice-intoSave.mp3` | Into the Save jar! Saving for a surprise. |
   | `voice-intoSpend.mp3` | Into the Spend jar! Ready for the shop. |
   | `voice-intoGive.mp3` | Into the Give jar! Ready to help others. |
   | `voice-tapJar.mp3` | Tap a jar to use your coins! |
   | `voice-noCoins.mp3` | Let's earn more coins in the village! |
   | `voice-goalReached.mp3` | You did it! You saved enough for a surprise! |
   | `voice-shopIntro.mp3` | Welcome to the shop! Tap a treat to buy it with your Spend coins. |
   | `voice-bought.mp3` | Great choice! Enjoy your treat! |
   | `voice-needMore.mp3` | That one needs a few more Spend coins. You can save up for it! |
   | `voice-giveIntro.mp3` | This is the Sharing Basket! Tap a coin to turn it into food for bunnies who need a little help. |
   | `voice-giveEmpty.mp3` | Put coins in the Give jar to help bunnies who need it. |
   | `voice-thanks.mp3` | Thank you, Connor! This food will help a bunny family. |
   | `voice-thanks2.mp3` | Yum! Sharing food helps bunnies who need it. |
   | `voice-basketFull.mp3` | The basket is full! Off it goes to bunny families who need a little help. Hooray! |
   | `voice-thankCard.mp3` | A thank-you card from the bunny families! Your kindness made them smile. |
   | `voice-allJobsDone.mp3` | Great work! All the jobs are done! Let's put your coins in the jars! |
   | `voice-visitJars.mp3` | Tap the jars to visit the shop or the Sharing Basket! |
   | `voice-tapSpendJar.mp3` | Tap the Spend jar to visit the shop! |
   | `voice-tapGiveJar.mp3` | Tap the Give jar to fill the Sharing Basket! |
   | `voice-tapSaveJar.mp3` | Tap the Save jar to see your savings! |
   | `voice-saveMore.mp3` | Earn more coins and put them in the Save jar to get your surprise! |
   | `voice-yumCarrot.mp3` | Crunch, crunch! What a yummy carrot! |
   | `voice-yumCupcake.mp3` | Mmm! This cupcake is so yummy! |
   | `voice-yumLolly.mp3` | Yum, yum! My lollipop is so sweet and sparkly! |
   | `voice-balloonFun.mp3` | Look at me! I am floating up, up and away! |
   | `voice-thanksShopping.mp3` | Thank you for shopping! |
   | `voice-saveIntro.mp3` | Keep saving coins to get the surprise! Tap your toys to play. |
   | `voice-askGrownUp.mp3` | This part is for grown-ups. Please ask a grown-up to help! |

Any line with a recording uses it automatically.

Sound effects work the same way. To replace a made-up sound, add `coin.mp3`, `pop.mp3`, `splash.mp3`, `chirp.mp3`, `yay.mp3`, `boop.mp3`, `clink.mp3`, `boing.mp3`, `drum.mp3` or `sparkle.mp3`.

Tip: keep sound files short and small. MP3 works on every device.

## The characters

| Name in the game | Who |
|---|---|
| `connor` | Connor: glasses and satchel (the star, and the shopper) |
| `harvey` | Harvey: red overalls |
| `liliana` | Liliana: pink bow and apron (the Sharing Basket helper in the Give screen) |
| `mama` | Mama Bunny (runs the shop) |
| `dada` | Dada Bunny: builder's hat |

To make a different bunny the star, open `src/config.js` and change `MAIN_CHARACTER = 'connor'`.

## Brand colours

- Coin gold `#E2BA5F`
- Wood brown `#765039`
- Cream `#EBD8BF`

To change a colour everywhere, edit `src/config.js`.

## Adding or changing pictures

1. Put the picture in `assets/images/characters` (cut-out characters, PNG) or `assets/images/scenes` (backgrounds, JPG).
2. Rebuild the packed files (see below).
3. The picture's name in the game is its file name without the ending. For example, `characters/connor.png` is called `'connor'`.

To replace a drawn picture with real artwork, give your file the same name, for example `coin.png`, `watering-can.png`, `treat-cupcake.png`, `reward-kite.png` or `label-save.png`. The full list is in `src/art.js`.

Tip: keep pictures under about 1000 pixels on their longest side so the game loads quickly on phones.

## Rebuilding the packed files

Browsers have a safety rule: when you double-click a file on your computer, a game can't load separate picture or sound files. To get around this, pictures and sounds are packed into two files: `assets/images/embedded-images.js` and `assets/sounds/embedded-sounds.js`.

After adding or changing pictures or sounds, run `python3 tools/build_embedded_files.py`, or just ask Claude to do it.
