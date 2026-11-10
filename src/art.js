// ------------------------------------------------------------
// DRAWN PICTURES
// Simple pictures drawn with code: the carrot coin, sparkles and
// the things used in the village chores.
// Swap any of these for real artwork later by putting a picture
// with the same name in assets/images (see README.md).
// ------------------------------------------------------------

const ART_COLOURS = {
  carrot: 0xE8762B,
  leaf: 0x58A845,
  soil: 0x8B5E3C,
  water: 0x5DADE2,
  can: 0x6FA8DC,
  red: 0xE74C3C,
  blue: 0x5DADE2,
  green: 0x58D68D,
  chick: 0xF7DC6F,
  chickWing: 0xF1C40F,
  seed: 0xD4A373,
  tick: 0x2ECC71,
  outline: 0x4A3020
};

const Art = {
  // Draw everything once, when the game starts
  makeAll(scene) {
    const draw = (key, w, h, fn) => {
      if (scene.textures.exists(key)) return;   // a real picture with this name wins
      const g = scene.make.graphics({ add: false });
      fn(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };
    const C = ART_COLOURS;

    // Carrot coin: gold coin with a little carrot on it
    draw('coin', 80, 80, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillCircle(40, 40, 40);
      g.fillStyle(COLOURS.gold, 1).fillCircle(40, 40, 34);
      g.fillStyle(C.leaf, 1);
      g.fillTriangle(40, 30, 32, 14, 38, 30);
      g.fillTriangle(40, 30, 48, 14, 42, 30);
      g.fillStyle(C.carrot, 1);
      g.fillEllipse(40, 31, 18, 8);
      g.fillTriangle(31, 31, 49, 31, 40, 60);
      g.fillStyle(COLOURS.white, 0.5).fillCircle(26, 24, 6);
    });

    // Sparkle: a four-pointed star (coloured when used)
    draw('sparkle', 48, 48, (g) => {
      g.fillStyle(COLOURS.white, 1);
      g.fillPoints([
        { x: 24, y: 0 }, { x: 29, y: 19 }, { x: 48, y: 24 }, { x: 29, y: 29 },
        { x: 24, y: 48 }, { x: 19, y: 29 }, { x: 0, y: 24 }, { x: 19, y: 19 }
      ], true);
    });

    // A fluffy cloud
    draw('cloud', 180, 64, (g) => {
      g.fillStyle(COLOURS.white, 1);
      g.fillEllipse(90, 28, 120, 50);
      g.fillEllipse(50, 38, 80, 40);
      g.fillEllipse(132, 38, 90, 40);
    });

    // Green tick shown when a job is done
    draw('tick', 90, 90, (g) => {
      g.fillStyle(C.tick, 1).fillCircle(45, 45, 42);
      g.lineStyle(6, COLOURS.white, 1).strokeCircle(45, 45, 40);
      g.lineStyle(12, COLOURS.white, 1);
      g.beginPath(); g.moveTo(24, 47); g.lineTo(39, 62); g.lineTo(66, 30); g.strokePath();
    });

    // --- Watering the carrots ---
    draw('soil', 230, 80, (g) => {
      g.fillStyle(C.soil, 1).fillEllipse(115, 45, 226, 66);
      g.fillStyle(COLOURS.wood, 1).fillEllipse(115, 52, 200, 40);
    });
    draw('carrot', 60, 110, (g) => {
      g.fillStyle(C.leaf, 1);
      g.fillTriangle(30, 40, 12, 2, 26, 40);
      g.fillTriangle(30, 40, 30, 0, 36, 40);
      g.fillTriangle(30, 40, 48, 4, 34, 40);
      g.fillStyle(C.carrot, 1);
      g.fillEllipse(30, 44, 40, 16);
      g.fillTriangle(10, 44, 50, 44, 30, 108);
      g.lineStyle(3, 0xC0561A, 1);
      g.lineBetween(20, 60, 30, 60); g.lineBetween(32, 76, 40, 76);
    });
    draw('watering-can', 160, 110, (g) => {
      g.lineStyle(10, C.outline, 1);
      g.beginPath(); g.arc(68, 44, 30, Math.PI, Math.PI * 2); g.strokePath();
      g.fillStyle(C.can, 1);
      g.fillPoints([{ x: 104, y: 62 }, { x: 146, y: 24 }, { x: 154, y: 32 }, { x: 110, y: 80 }], true);
      g.fillCircle(150, 26, 10);
      g.fillRoundedRect(28, 40, 84, 64, 14);
      g.lineStyle(5, C.outline, 1).strokeRoundedRect(28, 40, 84, 64, 14);
      g.fillStyle(COLOURS.white, 0.4).fillRoundedRect(38, 50, 14, 40, 6);
    });
    draw('drop', 22, 30, (g) => {
      g.fillStyle(C.water, 1);
      g.fillCircle(11, 19, 10);
      g.fillTriangle(2, 16, 20, 16, 11, 0);
    });

    // --- Tidying the toys ---
    draw('toybox', 200, 120, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(0, 24, 200, 96, 12);
      g.fillStyle(COLOURS.gold, 1).fillRoundedRect(0, 18, 200, 22, 8);
      g.lineStyle(4, 0x5C3D2B, 1);
      g.lineBetween(10, 68, 190, 68); g.lineBetween(10, 94, 190, 94);
      g.fillStyle(COLOURS.gold, 1).fillCircle(100, 80, 10);
    });
    draw('ball', 72, 72, (g) => {
      g.fillStyle(C.red, 1).fillCircle(36, 36, 34);
      g.lineStyle(9, COLOURS.white, 1);
      g.beginPath(); g.arc(36, 70, 40, Math.PI * 1.2, Math.PI * 1.8); g.strokePath();
      g.lineStyle(4, C.outline, 1).strokeCircle(36, 36, 34);
    });
    const block = (key, colour) => draw(key, 64, 64, (g) => {
      g.fillStyle(colour, 1).fillRoundedRect(2, 2, 60, 60, 10);
      g.lineStyle(4, C.outline, 1).strokeRoundedRect(2, 2, 60, 60, 10);
      g.fillStyle(COLOURS.white, 0.5).fillRoundedRect(16, 16, 32, 32, 6);
    });
    block('block-blue', C.blue);
    block('block-green', C.green);

    // --- Feeding the pet chicks ---
    draw('chick', 100, 96, (g) => {
      g.lineStyle(4, C.carrot, 1);
      g.lineBetween(40, 80, 36, 94); g.lineBetween(58, 80, 62, 94);
      g.fillStyle(C.chick, 1).fillCircle(48, 52, 38);
      g.fillTriangle(40, 18, 46, 4, 50, 18);
      g.fillTriangle(48, 16, 58, 6, 56, 20);
      g.fillStyle(C.chickWing, 1).fillEllipse(36, 60, 34, 22);
      g.fillStyle(C.outline, 1).fillCircle(62, 42, 6);
      g.fillStyle(COLOURS.white, 1).fillCircle(64, 40, 2);
      g.fillStyle(C.carrot, 1).fillTriangle(82, 46, 98, 52, 82, 58);
      g.fillStyle(0xF5B7B1, 1).fillCircle(70, 56, 6);
    });
    draw('seed', 14, 14, (g) => {
      g.fillStyle(C.seed, 1).fillEllipse(7, 7, 12, 8);
    });
    draw('bowl', 130, 56, (g) => {
      g.fillStyle(COLOURS.wood, 1);
      g.fillPoints([{ x: 4, y: 16 }, { x: 126, y: 16 }, { x: 104, y: 54 }, { x: 26, y: 54 }], true);
      g.fillStyle(C.seed, 1).fillEllipse(65, 16, 122, 22);
      g.lineStyle(4, 0x5C3D2B, 1).strokeEllipse(65, 16, 122, 22);
    });

    Art.makeJarArt(scene, draw);
    Art.makeShopArt(scene, draw);
    Art.makeRewardArt(scene, draw);
    Art.makeSharingArt(scene, draw);
  },

  // --- The three jars and their picture labels ---
  makeJarArt(scene, draw) {
    // Glass, in two layers so coins look like they're inside
    draw('jar-back', 220, 260, (g) => {
      g.fillStyle(0xFFFFFF, 0.45).fillRoundedRect(10, 40, 200, 215, 40);
      g.fillStyle(0xFFFFFF, 0.45).fillRect(40, 12, 140, 34);
    });
    draw('jar-front', 220, 260, (g) => {
      g.lineStyle(6, 0x9CC9E0, 1).strokeRoundedRect(10, 40, 200, 215, 40);
      g.lineStyle(6, 0x9CC9E0, 1).strokeRect(40, 12, 140, 34);
      g.fillStyle(0xFFFFFF, 0.7).fillRoundedRect(26, 70, 16, 140, 8);
      g.fillStyle(0xFFFFFF, 0.5).fillRoundedRect(176, 90, 10, 50, 5);
    });

    // Cloth lids, coloured like the jars in the book
    const lid = (key, colour, dark) => draw(key, 180, 70, (g) => {
      g.fillStyle(colour, 1).fillEllipse(90, 26, 170, 44);
      for (let i = 0; i < 9; i++) g.fillStyle(colour, 1).fillCircle(14 + i * 19, 44, 12);
      g.lineStyle(6, dark, 1).lineBetween(16, 38, 164, 38);
      g.fillStyle(0xFFFFFF, 0.35).fillEllipse(70, 16, 70, 12);
    });
    lid('lid-save', 0xE74C3C, 0xB03A2E);
    lid('lid-spend', 0xC86DD7, 0x9B4DAA);
    lid('lid-give', 0xF4C542, 0xC99A1E);

    // Picture labels (no words)
    const card = (key, drawPicture) => draw(key, 110, 110, (g) => {
      g.fillStyle(COLOURS.cream, 1).fillRoundedRect(4, 4, 102, 102, 20);
      g.lineStyle(6, COLOURS.wood, 1).strokeRoundedRect(4, 4, 102, 102, 20);
      drawPicture(g);
    });
    // Save: a piggy bank
    card('label-save', (g) => {
      const pink = 0xF5A9B8, dark = 0xD9788E;
      g.fillStyle(pink, 1).fillRect(32, 70, 10, 16).fillRect(64, 70, 10, 16);
      g.fillStyle(pink, 1).fillEllipse(54, 58, 64, 46);
      g.fillTriangle(56, 38, 66, 24, 72, 42);
      g.fillStyle(dark, 1).fillEllipse(86, 58, 16, 20);
      g.fillStyle(0x4A3020, 1).fillCircle(84, 55, 2).fillCircle(89, 61, 2).fillCircle(70, 50, 4);
      g.lineStyle(5, 0x4A3020, 1).lineBetween(42, 38, 58, 38);
      g.fillStyle(COLOURS.gold, 1).fillCircle(50, 26, 10);
      g.lineStyle(3, dark, 1);
      g.beginPath(); g.arc(20, 54, 6, 0, Math.PI * 1.5); g.strokePath();
    });
    // Spend: a shopping bag with a carrot peeking out
    card('label-spend', (g) => {
      g.fillStyle(ART_COLOURS.leaf, 1).fillTriangle(62, 36, 58, 14, 66, 34).fillTriangle(64, 36, 74, 16, 68, 36);
      g.fillStyle(ART_COLOURS.carrot, 1).fillTriangle(56, 38, 72, 38, 64, 58);
      g.lineStyle(6, 0x9B4DAA, 1);
      g.beginPath(); g.arc(55, 46, 16, Math.PI, Math.PI * 2); g.strokePath();
      g.fillStyle(0xC86DD7, 1).fillRoundedRect(28, 44, 54, 48, 8);
      g.fillStyle(0xFFFFFF, 0.35).fillRoundedRect(34, 50, 10, 34, 4);
    });
    // Give: a big heart
    card('label-give', (g) => {
      g.fillStyle(0xE74C3C, 1);
      g.fillCircle(42, 46, 17).fillCircle(68, 46, 17);
      g.fillTriangle(26, 52, 84, 52, 55, 86);
      g.fillStyle(0xFFFFFF, 0.5).fillCircle(37, 41, 5);
    });

    // A loose heart for sparkly hearts
    draw('heart', 60, 56, (g) => {
      g.fillStyle(0xE74C3C, 1);
      g.fillCircle(18, 18, 16).fillCircle(42, 18, 16);
      g.fillTriangle(3, 24, 57, 24, 30, 54);
      g.fillStyle(0xFFFFFF, 0.5).fillCircle(13, 13, 5);
    });

    // A pointing hand, used to show "drag like this"
    draw('hand', 80, 100, (g) => {
      g.fillStyle(COLOURS.white, 1);
      g.lineStyle(5, COLOURS.wood, 1);
      g.fillRoundedRect(30, 4, 20, 54, 10).strokeRoundedRect(30, 4, 20, 54, 10);
      g.fillRoundedRect(14, 40, 56, 52, 18).strokeRoundedRect(14, 40, 56, 52, 18);
      g.fillStyle(COLOURS.white, 1).fillRect(33, 38, 14, 10);
    });
  },

  // --- Shop treats and the basket ---
  makeShopArt(scene, draw) {
    draw('treat-cupcake', 100, 110, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillPoints([{ x: 14, y: 60 }, { x: 86, y: 60 }, { x: 74, y: 106 }, { x: 26, y: 106 }], true);
      g.lineStyle(4, 0x5C3D2B, 1);
      [32, 50, 68].forEach((x) => g.lineBetween(x, 62, x - (x - 50) * 0.2, 104));
      g.fillStyle(0xF5A9B8, 1).fillEllipse(50, 56, 92, 36).fillEllipse(50, 40, 70, 32).fillEllipse(50, 26, 42, 24);
      g.fillStyle(0xE74C3C, 1).fillCircle(50, 12, 10);
      g.fillStyle(0xFFFFFF, 0.6).fillCircle(46, 9, 3);
      [[30, 50, 0x5DADE2], [62, 44, 0xF4C542], [44, 58, 0x58D68D], [70, 58, 0x5DADE2], [40, 34, 0xF4C542]]
        .forEach(([x, y, c]) => g.fillStyle(c, 1).fillRoundedRect(x, y, 8, 4, 2));
    });
    draw('treat-lollipop', 90, 140, (g) => {
      g.fillStyle(0xFFFFFF, 1).fillRoundedRect(41, 70, 8, 68, 4);
      g.lineStyle(3, 0xCCCCCC, 1).strokeRoundedRect(41, 70, 8, 68, 4);
      g.fillStyle(0xE74C3C, 1).fillCircle(45, 42, 40);
      g.lineStyle(7, 0xFFFFFF, 1);
      [30, 20, 10].forEach((r, i) => { g.beginPath(); g.arc(45 + (i % 2) * 2, 42, r, i, i + Math.PI * 1.4); g.strokePath(); });
    });
    draw('treat-balloon', 90, 150, (g) => {
      g.lineStyle(3, COLOURS.wood, 1);
      g.beginPath(); g.moveTo(45, 100);
      [[40, 112], [50, 124], [40, 136], [46, 148]].forEach(([x, y]) => g.lineTo(x, y));
      g.strokePath();
      g.fillStyle(0x5DADE2, 1).fillEllipse(45, 50, 80, 94);
      g.fillTriangle(38, 96, 52, 96, 45, 104);
      g.fillStyle(0xFFFFFF, 0.5).fillEllipse(30, 32, 16, 28);
    });
    draw('basket', 220, 110, (g) => {
      g.fillStyle(0xE3B778, 1).fillPoints([{ x: 6, y: 30 }, { x: 214, y: 30 }, { x: 190, y: 108 }, { x: 30, y: 108 }], true);
      g.lineStyle(5, 0xB5834A, 1);
      [56, 82].forEach((y) => g.lineBetween(16, y, 204, y));
      [50, 90, 130, 170].forEach((x) => g.lineBetween(x, 34, x + (x - 110) * -0.1, 104));
      g.lineStyle(5, COLOURS.wood, 1).strokePoints([{ x: 6, y: 30 }, { x: 214, y: 30 }, { x: 190, y: 108 }, { x: 30, y: 108 }], true);
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(0, 22, 220, 18, 9);
    });
    draw('kiosk', 340, 120, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRect(10, 24, 320, 96);
      g.lineStyle(5, 0x5C3D2B, 1);
      [90, 170, 250].forEach((x) => g.lineBetween(x, 34, x, 116));
      g.fillStyle(COLOURS.gold, 1).fillRoundedRect(0, 8, 340, 26, 10);
    });
  },

  // --- Give jar: the village Sharing Basket and the food that goes in it ---
  // Coins given turn into food for bunny families who need a little help.
  makeSharingArt(scene, draw) {
    const W = 0xE3B778, W2 = 0xB5834A, O = COLOURS.wood;
    // Back of the basket (drawn behind the food) with its handle
    draw('share-basket-back', 300, 250, (g) => {
      g.lineStyle(16, O, 1);
      g.beginPath(); g.arc(150, 120, 112, Math.PI, 0); g.strokePath();
      g.lineStyle(9, W, 1);
      g.beginPath(); g.arc(150, 120, 112, Math.PI, 0); g.strokePath();
      g.fillStyle(0xC99A62, 1).fillEllipse(150, 128, 276, 54);
      g.lineStyle(5, O, 1).strokeEllipse(150, 128, 276, 54);
    });
    // Front of the basket (drawn in front of the food), a big heart on a cream tag
    draw('share-basket-front', 300, 250, (g) => {
      const pts = [{ x: 12, y: 128 }, { x: 288, y: 128 }, { x: 252, y: 244 }, { x: 48, y: 244 }];
      g.fillStyle(W, 1).fillPoints(pts, true);
      g.lineStyle(6, W2, 1);
      [166, 204].forEach((y) => g.lineBetween(22, y, 278, y));
      [70, 110, 150, 190, 230].forEach((x) => g.lineBetween(x, 132, x + (x - 150) * -0.13, 240));
      g.lineStyle(6, O, 1).strokePoints(pts, true);
      g.fillStyle(O, 1).fillRoundedRect(4, 118, 292, 24, 12);
      g.fillStyle(0xFFF8EC, 1).fillRoundedRect(112, 156, 76, 66, 16);
      g.lineStyle(4, O, 1).strokeRoundedRect(112, 156, 76, 66, 16);
      g.fillStyle(0xE74C3C, 1).fillCircle(138, 180, 13).fillCircle(162, 180, 13).fillTriangle(126, 185, 174, 185, 150, 210);
      g.fillStyle(0xFFFFFF, 0.5).fillCircle(134, 176, 4);
    });
    // A thank-you card from the bunny families: a big heart and two smiling bunny faces
    draw('thank-you-card', 240, 180, (g) => {
      g.fillStyle(0x5C3D2B, 0.35).fillRoundedRect(8, 12, 228, 164, 22);
      g.fillStyle(0xFFF8EC, 1).fillRoundedRect(2, 2, 228, 164, 22);
      g.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(2, 2, 228, 164, 22);
      g.fillStyle(0xE74C3C, 1).fillCircle(98, 66, 26).fillCircle(134, 66, 26).fillTriangle(74, 76, 158, 76, 116, 128);
      g.fillStyle(0xFFFFFF, 0.5).fillCircle(90, 58, 7);
      const face = (x, y, tint) => {
        g.fillStyle(tint, 1).fillEllipse(x - 9, y - 26, 11, 30).fillEllipse(x + 9, y - 26, 11, 30).fillCircle(x, y, 18);
        g.fillStyle(0xF5A9B8, 1).fillEllipse(x - 9, y - 26, 5, 20).fillEllipse(x + 9, y - 26, 5, 20);
        g.fillStyle(0x4A3020, 1).fillCircle(x - 6, y - 3, 2.5).fillCircle(x + 6, y - 3, 2.5);
        g.lineStyle(2.5, 0x4A3020, 1);
        g.beginPath(); g.arc(x, y + 3, 6, 0.3, Math.PI - 0.3); g.strokePath();
        g.fillStyle(0xF5A9B8, 0.8).fillCircle(x - 11, y + 4, 3.5).fillCircle(x + 11, y + 4, 3.5);
      };
      face(40, 130, 0xE9D7C1);
      face(192, 130, 0xF2E6DA);
      g.fillStyle(0xE74C3C, 0.8).fillCircle(32, 34, 6).fillCircle(42, 34, 6).fillTriangle(26, 36, 48, 36, 37, 48);
      g.fillCircle(190, 30, 6).fillCircle(200, 30, 6).fillTriangle(184, 32, 206, 32, 195, 44);
      g.fillStyle(COLOURS.gold, 1).fillCircle(116, 150, 5).fillCircle(96, 152, 3).fillCircle(136, 152, 3);
    });
    draw('food-apple', 80, 84, (g) => {
      g.fillStyle(0x7A4A2A, 1).fillRect(37, 4, 7, 18);
      g.fillStyle(ART_COLOURS.leaf, 1).fillEllipse(54, 12, 24, 12);
      g.fillStyle(0xE74C3C, 1).fillCircle(28, 50, 26).fillCircle(52, 50, 26);
      g.fillStyle(0xFFFFFF, 0.45).fillCircle(24, 40, 7);
      g.lineStyle(4, ART_COLOURS.outline, 0.5);
      g.beginPath(); g.arc(40, 50, 33, 0.25 * Math.PI, 0.75 * Math.PI); g.strokePath();
    });
    draw('food-bread', 110, 70, (g) => {
      g.fillStyle(0xC98A3E, 1).fillRoundedRect(4, 18, 102, 48, 24);
      g.fillStyle(0xE0A657, 1).fillEllipse(55, 26, 96, 36);
      g.lineStyle(5, 0xA86A28, 1);
      [32, 55, 78].forEach((x) => g.lineBetween(x - 8, 16, x + 8, 34));
      g.lineStyle(4, ART_COLOURS.outline, 0.6).strokeRoundedRect(4, 10, 102, 56, 26);
    });
  },

  // --- Save jar rewards (surprises) ---
  makeRewardArt(scene, draw) {
    // Bouncing bunny ball
    draw('reward-ball', 120, 130, (g) => {
      const pink = 0xF1948A;
      g.fillStyle(pink, 1).fillEllipse(38, 30, 22, 56).fillEllipse(82, 30, 22, 56);
      g.fillStyle(0xFADBD8, 1).fillEllipse(38, 32, 10, 38).fillEllipse(82, 32, 10, 38);
      g.fillStyle(pink, 1).fillCircle(60, 80, 48);
      g.lineStyle(5, 0xFFFFFF, 0.8);
      g.beginPath(); g.arc(60, 80, 36, Math.PI * 1.1, Math.PI * 1.5); g.strokePath();
      g.fillStyle(0x4A3020, 1).fillCircle(46, 76, 5).fillCircle(74, 76, 5);
      g.lineStyle(4, 0x4A3020, 1);
      g.beginPath(); g.arc(60, 88, 10, 0.3, Math.PI - 0.3); g.strokePath();
    });
    // Kite
    draw('reward-kite', 130, 180, (g) => {
      g.lineStyle(3, COLOURS.wood, 1);
      g.beginPath(); g.moveTo(65, 120);
      [[55, 140], [72, 156], [58, 176]].forEach(([x, y]) => g.lineTo(x, y));
      g.strokePath();
      [[57, 140], [70, 156]].forEach(([x, y]) => g.fillStyle(0xE74C3C, 1).fillTriangle(x - 10, y - 6, x - 10, y + 6, x, y).fillTriangle(x + 10, y - 6, x + 10, y + 6, x, y));
      g.fillStyle(0x5DADE2, 1).fillTriangle(65, 2, 120, 58, 10, 58);
      g.fillStyle(COLOURS.gold, 1).fillTriangle(10, 58, 120, 58, 65, 122);
      g.lineStyle(4, COLOURS.wood, 1).lineBetween(65, 2, 65, 122).lineBetween(10, 58, 120, 58);
    });
    // Drum
    draw('reward-drum', 130, 120, (g) => {
      g.lineStyle(7, COLOURS.wood, 1).lineBetween(20, 6, 70, 36).lineBetween(110, 6, 60, 36);
      g.fillStyle(0xE74C3C, 1).fillRect(15, 40, 100, 60).fillEllipse(65, 100, 100, 26);
      g.lineStyle(5, COLOURS.gold, 1);
      g.beginPath(); g.moveTo(15, 50);
      for (let i = 1; i <= 6; i++) g.lineTo(15 + i * 16.6, i % 2 ? 92 : 50);
      g.strokePath();
      g.fillStyle(COLOURS.cream, 1).fillEllipse(65, 40, 100, 26);
      g.lineStyle(4, COLOURS.gold, 1).strokeEllipse(65, 40, 100, 26);
    });
    // Trophy
    draw('reward-trophy', 120, 140, (g) => {
      g.lineStyle(9, COLOURS.gold, 1);
      g.beginPath(); g.arc(22, 36, 16, Math.PI * 0.5, Math.PI * 1.5); g.strokePath();
      g.beginPath(); g.arc(98, 36, 16, Math.PI * 1.5, Math.PI * 0.5); g.strokePath();
      g.fillStyle(COLOURS.gold, 1).fillPoints([{ x: 20, y: 10 }, { x: 100, y: 10 }, { x: 84, y: 76 }, { x: 36, y: 76 }], true);
      g.fillRect(52, 74, 16, 30);
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(28, 102, 64, 30, 6);
      g.fillStyle(COLOURS.white, 0.9).fillPoints([
        { x: 60, y: 22 }, { x: 65, y: 36 }, { x: 80, y: 37 }, { x: 68, y: 46 }, { x: 72, y: 61 },
        { x: 60, y: 52 }, { x: 48, y: 61 }, { x: 52, y: 46 }, { x: 40, y: 37 }, { x: 55, y: 36 }
      ], true);
    });
  }
};
