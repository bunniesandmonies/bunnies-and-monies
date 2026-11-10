// ------------------------------------------------------------
// GAME SETTINGS
// Change values here and they update everywhere in the game.
// ------------------------------------------------------------

// The game has two shapes: wide (computers, tablets turned
// sideways) and tall (phones held upright). It picks the right
// one automatically and switches if the device is turned.
const SIZES = {
  wide: { width: 1280, height: 720 },
  tall: { width: 720, height: 1280 }
};

function currentShape() {
  const box = document.getElementById('game');
  const w = box ? box.clientWidth : window.innerWidth;
  const h = box ? box.clientHeight : window.innerHeight;
  return h > w ? 'tall' : 'wide';
}

// Brand colours.
// Phaser needs two styles: numbers (0x...) for shapes,
// and text strings ('#...') for words.
const COLOURS = {
  gold: 0xE2BA5F,       // coin gold
  wood: 0x765039,       // wood brown
  cream: 0xEBD8BF,      // cream
  white: 0xFFFFFF,
  goldText: '#E2BA5F',
  woodText: '#765039',
  creamText: '#EBD8BF'
};

// Rounded, friendly font that every computer already has.
const FONT = '"Trebuchet MS", "Arial Rounded MT Bold", Verdana, sans-serif';

// The star of the title screen. Change this to 'harvey',
// 'liliana', 'mama' or 'dada' to show a different character.
const MAIN_CHARACTER = 'connor';

// The helper who looks after the Sharing Basket (Give jar)
const FRIEND_CHARACTER = 'liliana';

// Give jar: how many coins (pieces of food) fill one Sharing Basket
// before it is sent off to bunny families who need a little help
const SHARING_BASKET_SIZE = 5;

// The food each coin turns into in the Sharing Basket (pictures in src/art.js)
const SHARING_FOODS = ['carrot', 'food-apple', 'food-bread'];

// Save jar goals: how many coins to save, and the surprise that
// unlocks. After the last one, the last reward repeats.
const SAVE_REWARDS = [
  { key: 'reward-ball', goal: 5 },     // bouncing bunny ball (from the book!)
  { key: 'reward-kite', goal: 8 },
  { key: 'reward-drum', goal: 10 },
  { key: 'reward-trophy', goal: 10 }
];

// Finishing Book 1 (The Carrot Coin Mystery): the child has used all
// four money skills. Change the numbers to make it quicker or longer.
const BOOK1_GOALS = {
  earn: 10,     // coins earned from jobs in the village
  save: 1,      // Save jar surprises unlocked
  spend: 1,     // treats bought in the shop
  give: 1       // coins given to help others (Sharing Basket)
};

// Treats in the shop and their price in coins (Spend jar)
const TREATS = [
  { key: 'carrot', price: 1 },
  { key: 'treat-cupcake', price: 2 },
  { key: 'treat-lollipop', price: 2 },
  { key: 'treat-balloon', price: 3 }
];
