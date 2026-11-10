// ------------------------------------------------------------
// VILLAGE ART AND LIFE
// The pictures and gentle movement that make Bunny Village feel
// alive: cosy houses, trees, flowers, a winding path, the carrot
// garden fence, the shop, the giving corner, butterflies, birds
// and drifting leaves.
//
// The still background is drawn once and saved as a picture, so
// it stays smooth on phones. Only a few small things move.
// Everything uses the Bunnies & Monies colours.
// ------------------------------------------------------------

const VILLAGE_COLOURS = {
  skyTop: 0x9FD8F2, skyBottom: 0xDDF1F8,
  hillFar: 0xB9DE8A, hillMid: 0xA8D672, grass: 0x8BC34A, grassDark: 0x7CB342,
  leaf: 0x5E9E3A, leafLight: 0x7DBB4F, trunk: 0x6B4A33,
  path: 0xF1E2C8, pathEdge: 0xD9C3A0,
  roofs: [0xE2BA5F, 0xE8762B, 0xC86DD7, 0x5DADE2],
  flowers: [0xF5A9B8, 0xFFFFFF, 0xF4C542, 0xC86DD7, 0xE74C3C]
};

const VillageArt = {
  // ---------- Pictures drawn once at start-up ----------
  makeTextures(scene) {
    const draw = (key, w, h, fn) => {
      if (scene.textures.exists(key)) return;   // a real picture with this name wins
      const g = scene.make.graphics({ add: false });
      fn(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };
    const C = VILLAGE_COLOURS;

    // A round leafy tree
    draw('tree', 150, 190, (g) => {
      g.fillStyle(C.trunk, 1).fillRoundedRect(64, 110, 22, 80, 8);
      g.fillStyle(C.leaf, 1).fillCircle(75, 70, 58).fillCircle(38, 98, 38).fillCircle(112, 98, 38);
      g.fillStyle(C.leafLight, 1).fillCircle(60, 52, 26).fillCircle(98, 66, 18);
      g.fillStyle(0xE74C3C, 1).fillCircle(40, 90, 6).fillCircle(104, 104, 6).fillCircle(78, 40, 6);   // apples
    });

    // A cosy bunny house (one per roof colour)
    C.roofs.forEach((roof, i) => draw('bunny-house-' + i, 170, 170, (g) => {
      g.fillStyle(0xF3E3C8, 1).fillRoundedRect(24, 70, 122, 92, 14);
      g.lineStyle(5, COLOURS.wood, 1).strokeRoundedRect(24, 70, 122, 92, 14);
      g.fillStyle(roof, 1).fillTriangle(6, 80, 164, 80, 85, 8);
      g.lineStyle(5, COLOURS.wood, 1).strokeTriangle(6, 80, 164, 80, 85, 8);
      g.fillStyle(COLOURS.wood, 1).fillRect(118, 18, 16, 40);                         // chimney
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(68, 104, 36, 58, { tl: 18, tr: 18, bl: 0, br: 0 });
      g.fillStyle(COLOURS.gold, 1).fillCircle(96, 134, 4);                            // door knob
      g.fillStyle(0x9FD8F2, 1).fillCircle(46, 102, 13).fillCircle(124, 102, 13);      // round windows
      g.lineStyle(4, COLOURS.wood, 1).strokeCircle(46, 102, 13).strokeCircle(124, 102, 13);
      g.fillStyle(0xF5A9B8, 1).fillCircle(36, 158, 7).fillCircle(130, 158, 7);         // flower pots
    }));

    // The village shop: wooden front, striped awning, sign with a coin
    draw('shop-building', 230, 220, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(14, 70, 202, 146, 12);
      g.fillStyle(0x8A6046, 1);
      [96, 126, 156, 186].forEach((y) => g.fillRect(20, y, 190, 4));
      g.fillStyle(COLOURS.cream, 1).fillRoundedRect(130, 112, 70, 56, 8);              // window
      g.fillStyle(0xF5A9B8, 1).fillCircle(150, 140, 10);                              // treats in the window
      g.fillStyle(0xE74C3C, 1).fillCircle(178, 136, 9);
      g.fillStyle(0x5DADE2, 1).fillEllipse(164, 128, 12, 16);
      for (let i = 0; i < 7; i++) {                                                   // awning stripes
        g.fillStyle(i % 2 ? COLOURS.cream : COLOURS.gold, 1).fillRect(4 + i * 32, 46, 32, 34);
        g.fillCircle(20 + i * 32, 80, 16);
      }
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(46, 4, 138, 46, 12);               // sign board
      g.lineStyle(4, COLOURS.gold, 1).strokeRoundedRect(46, 4, 138, 46, 12);
      g.fillStyle(COLOURS.gold, 1).fillCircle(115, 27, 16);
      g.fillStyle(ART_COLOURS.carrot, 1).fillTriangle(107, 22, 123, 22, 115, 40);
      g.fillStyle(ART_COLOURS.leaf, 1).fillTriangle(115, 22, 110, 12, 113, 22).fillTriangle(115, 22, 120, 12, 117, 22);
    });

    // The giving corner: a wooden arch with a big heart
    draw('give-arch', 220, 210, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(20, 60, 22, 150, 6).fillRoundedRect(178, 60, 22, 150, 6);
      g.lineStyle(20, COLOURS.wood, 1);
      g.beginPath(); g.arc(110, 74, 79, Math.PI, Math.PI * 2); g.strokePath();
      g.lineStyle(8, ART_COLOURS.leaf, 1);
      g.beginPath(); g.arc(110, 74, 79, Math.PI * 1.05, Math.PI * 1.95); g.strokePath();
      VILLAGE_COLOURS.flowers.forEach((c, i) => {
        const a = Math.PI * (1.08 + i * 0.2);
        g.fillStyle(c, 1).fillCircle(110 + Math.cos(a) * 79, 74 + Math.sin(a) * 79, 9);
      });
      g.fillStyle(0xE74C3C, 1).fillCircle(96, 50, 20).fillCircle(124, 50, 20).fillTriangle(77, 57, 143, 57, 110, 96);
      g.fillStyle(0xFFFFFF, 0.5).fillCircle(90, 44, 6);
    });

    // A little wooden bench
    draw('bench', 120, 50, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(0, 8, 120, 14, 6).fillRect(12, 20, 10, 30).fillRect(98, 20, 10, 30);
      g.fillStyle(0x8A6046, 1).fillRoundedRect(4, 0, 112, 10, 5);
    });

    // A wooden shelf for the savings jars
    draw('jar-shelf', 340, 60, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(0, 0, 340, 26, 10).fillRect(24, 24, 18, 36).fillRect(298, 24, 18, 36);
      g.fillStyle(COLOURS.gold, 1).fillRoundedRect(0, 0, 340, 8, 4);
    });

    // A wooden sign post (used for the carrot garden)
    draw('garden-sign', 120, 110, (g) => {
      g.fillStyle(COLOURS.wood, 1).fillRect(54, 40, 12, 70);
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(0, 0, 120, 54, 10);
      g.lineStyle(4, COLOURS.gold, 1).strokeRoundedRect(0, 0, 120, 54, 10);
      [30, 60, 90].forEach((x) => {
        g.fillStyle(ART_COLOURS.leaf, 1).fillTriangle(x, 16, x - 6, 6, x - 2, 16).fillTriangle(x, 16, x + 6, 6, x + 2, 16);
        g.fillStyle(ART_COLOURS.carrot, 1).fillTriangle(x - 8, 16, x + 8, 16, x, 44);
      });
    });

    // A butterfly (wings flap by squashing the picture sideways)
    draw('butterfly', 60, 46, (g) => {
      g.fillStyle(0xC86DD7, 1).fillEllipse(16, 16, 28, 26).fillEllipse(44, 16, 28, 26);
      g.fillStyle(0xF4C542, 1).fillEllipse(18, 34, 20, 18).fillEllipse(42, 34, 20, 18);
      g.fillStyle(0xFFFFFF, 0.6).fillCircle(14, 14, 5).fillCircle(46, 14, 5);
      g.fillStyle(COLOURS.wood, 1).fillRoundedRect(27, 8, 6, 34, 3);
    });

    // A little bird (seen from the side, wing flaps)
    draw('bird', 56, 40, (g) => {
      g.fillStyle(0x5DADE2, 1).fillEllipse(26, 24, 38, 26).fillCircle(42, 16, 11);
      g.fillStyle(0x3D8BBF, 1).fillTriangle(14, 22, 34, 22, 22, 2);   // wing
      g.fillStyle(0xF4C542, 1).fillTriangle(50, 14, 56, 18, 50, 20);   // beak
      g.fillStyle(COLOURS.wood, 1).fillCircle(45, 14, 2.5);
      g.fillStyle(0x5DADE2, 1).fillTriangle(2, 18, 10, 24, 2, 30);    // tail
    });

    // A falling leaf
    draw('falling-leaf', 26, 18, (g) => {
      g.fillStyle(VILLAGE_COLOURS.leafLight, 1).fillEllipse(13, 9, 24, 12);
      g.lineStyle(2, VILLAGE_COLOURS.leaf, 1).lineBetween(3, 9, 23, 9);
    });
  },

  // ---------- The background, drawn once ----------
  // Built in layers into one saved picture: sky and hills, trees, path,
  // flowers and bushes, houses, then the garden fence.
  paintBackground(scene, layout) {
    const w = scene.scale.width, h = scene.scale.height, hz = layout.horizon;
    const key = `village-rich-${w}x${h}`;
    if (!scene.textures.exists(key)) {
      const C = VILLAGE_COLOURS;
      const pic = scene.textures.addDynamicTexture(key, w, h);
      const layer = (fn) => { const g = scene.make.graphics({ add: false }); fn(g); pic.draw(g); g.destroy(); };
      const stamp = (texture, x, y, s) => pic.stamp(texture, null, x, y, { originX: 0.5, originY: 1, scale: s });

      // Sky, sun and hills
      layer((g) => {
        const top = Phaser.Display.Color.ValueToColor(C.skyTop), bottom = Phaser.Display.Color.ValueToColor(C.skyBottom);
        for (let i = 0; i < 40; i++) {
          const c = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, 40, i);
          g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1).fillRect(0, (hz + 60) * i / 40, w, (hz + 60) / 40 + 1);
        }
        const [sx, sy] = layout.sun;
        g.fillStyle(COLOURS.gold, 0.25).fillCircle(sx, sy, 78);
        g.fillStyle(COLOURS.gold, 0.4).fillCircle(sx, sy, 60);
        g.fillStyle(COLOURS.gold, 1).fillCircle(sx, sy, 44);
        g.fillStyle(C.hillFar, 1).fillEllipse(w * 0.18, hz + 10, w * 0.9, 190).fillEllipse(w * 0.85, hz + 20, w * 0.9, 210);
        g.fillStyle(C.hillMid, 1).fillEllipse(w * 0.45, hz + 50, w * 1.1, 170);
        g.fillStyle(C.grass, 1).fillRect(0, hz + 50, w, h - hz);
      });

      // Trees on the hills
      layout.trees.forEach(([x, y, s]) => stamp('tree', x, y, s));

      // Winding sandy path, grass tufts, flowers and bushes
      layer((g) => {
        const path = new Phaser.Curves.Spline(layout.path.map(([x, y]) => new Phaser.Math.Vector2(x, y)));
        const pts = path.getPoints(80);
        g.lineStyle(layout.pathWidth + 12, C.pathEdge, 1).strokePoints(pts);
        g.lineStyle(layout.pathWidth, C.path, 1).strokePoints(pts);

        for (let i = 0; i < layout.flowerCount; i++) {   // evenly spread (the same every time)
          const x = (i * 197.3) % w, y = hz + 70 + ((i * 131.7) % (h - hz - 90));
          if (layout.clear.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r)) continue;
          if (i % 3 === 0) {
            g.fillStyle(C.grassDark, 1).fillTriangle(x - 8, y + 6, x - 2, y - 10, x + 2, y + 6).fillTriangle(x, y + 6, x + 6, y - 12, x + 10, y + 6);
          } else {
            g.fillStyle(C.flowers[i % C.flowers.length], 1);
            [[0, -7], [7, 0], [0, 7], [-7, 0]].forEach(([dx, dy]) => g.fillCircle(x + dx, y + dy, 5.5));
            g.fillStyle(COLOURS.gold, 1).fillCircle(x, y, 4);
          }
        }
        layout.bushes.forEach(([x, y, s]) => {
          g.fillStyle(C.leaf, 1).fillCircle(x - 22 * s, y, 22 * s).fillCircle(x + 22 * s, y, 22 * s).fillCircle(x, y - 12 * s, 26 * s);
          g.fillStyle(C.leafLight, 1).fillCircle(x - 6 * s, y - 18 * s, 10 * s);
        });
      });

      // Cosy bunny houses
      layout.houses.forEach(([x, y, s, roof]) => stamp('bunny-house-' + roof, x, y, s));

      // Carrot garden fence behind the job pads
      if (layout.fence) {
        layer((g) => {
          const [fx1, fx2, fy] = layout.fence;
          g.fillStyle(COLOURS.wood, 1).fillRect(fx1, fy - 20, fx2 - fx1, 8).fillRect(fx1, fy - 2, fx2 - fx1, 8);
          for (let x = fx1; x <= fx2; x += 34) g.fillStyle(0x8A6046, 1).fillRoundedRect(x - 6, fy - 40, 14, 56, { tl: 7, tr: 7, bl: 0, br: 0 });
        });
      }
    }
    scene.add.image(0, 0, key).setOrigin(0);
  },

  // ---------- Things that move gently ----------
  addLife(scene, layout) {
    const w = scene.scale.width;

    // Clouds drifting
    layout.clouds.forEach(([fx, y]) => {
      const cloud = scene.add.image(w * fx, y, 'cloud').setAlpha(0.95);
      scene.tweens.add({ targets: cloud, x: cloud.x + 70, duration: 9000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });

    // Butterflies fluttering between flowers
    layout.butterflies.forEach(([x, y], i) => {
      const b = scene.add.image(x, y, 'butterfly').setScale(0.7).setDepth(30);
      scene.tweens.add({ targets: b, scaleX: 0.2, duration: 160, yoyo: true, repeat: -1 });
      const wander = () => {
        const [ax, ay, bw, bh] = layout.butterflyArea;
        scene.tweens.add({
          targets: b, x: Phaser.Math.Between(ax, ax + bw), y: Phaser.Math.Between(ay, ay + bh),
          duration: Phaser.Math.Between(3000, 5000), ease: 'Sine.easeInOut', onComplete: wander
        });
      };
      scene.time.delayedCall(i * 700, wander);
    });

    // A bird gliding across the sky now and then
    const bird = () => {
      const goingRight = Math.random() < 0.5;
      const y = Phaser.Math.Between(layout.birdY[0], layout.birdY[1]);
      const b = scene.add.image(goingRight ? -40 : w + 40, y, 'bird').setFlipX(!goingRight).setDepth(5);
      scene.tweens.add({ targets: b, scaleY: 0.6, duration: 220, yoyo: true, repeat: -1 });
      scene.tweens.add({ targets: b, x: goingRight ? w + 40 : -40, y: y + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(9000, 13000), onComplete: () => b.destroy() });
    };
    bird();
    scene.time.addEvent({ delay: 11000, loop: true, callback: bird });

    // Leaves floating down from the trees
    scene.add.particles(0, 0, 'falling-leaf', {
      x: { min: 0, max: w }, y: layout.horizon - 40,
      speedY: { min: 25, max: 45 }, speedX: { min: -25, max: 25 },
      rotate: { start: 0, end: 360 }, alpha: { start: 1, end: 0 },
      lifespan: 7000, frequency: 2600, quantity: 1, scale: { min: 0.7, max: 1 }
    }).setDepth(4);
  },

  // A bunny strolling back and forth (reuses the book characters)
  addStroller(scene, key, x1, x2, feetY, height, speedMs) {
    const img = scene.add.image(x1, feetY, key).setOrigin(0.5, 1).setDepth(6);
    img.setScale(height / img.height);
    const base = img.scale;
    scene.tweens.add({ targets: img, scaleY: base * 0.95, y: feetY - 4, duration: 260, yoyo: true, repeat: -1 });
    const walk = (toRight) => {
      img.setFlipX(!toRight);   // characters face right in the book art
      scene.tweens.add({
        targets: img, x: toRight ? x2 : x1, duration: speedMs, ease: 'Linear',
        onComplete: () => scene.time.delayedCall(Phaser.Math.Between(800, 2200), () => walk(!toRight))
      });
    };
    walk(true);
    // Tap a strolling bunny: a happy hop
    img.setInteractive({ useHandCursor: true });
    img.on('pointerdown', () => {
      SFX.play(scene, 'chirp');
      scene.tweens.add({ targets: img, y: feetY - 40, duration: 180, yoyo: true, ease: 'Quad.easeOut' });
    });
    return img;
  }
};
