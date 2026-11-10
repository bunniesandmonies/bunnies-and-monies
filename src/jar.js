// ------------------------------------------------------------
// A COIN JAR
// A glass jar with a coloured lid and a picture label.
// Coins stack up inside so children can SEE how many there are.
// type is 'save', 'spend' or 'give'.
// The Save jar also shows a dotted goal line, with a mystery
// picture of the surprise next to it.
// ------------------------------------------------------------

const JAR_MAX_SHOWN = 18;   // after this many, the jar just looks full

class Jar {
  constructor(scene, x, y, type, size = 1) {
    this.scene = scene;
    this.type = type;
    this.size = size;
    this.count = 0;

    const c = scene.add.container(x, y).setScale(size);
    this.container = c;

    c.add(scene.add.image(0, 0, 'jar-back'));
    this.coinLayer = scene.add.container(0, 0);
    c.add(this.coinLayer);

    if (type === 'save') {
      this.goalLine = scene.add.graphics();
      this.goalIcon = scene.add.image(-150, 0, 'reward-ball').setScale(0.5);
      c.add([this.goalLine, this.goalIcon]);
    }

    c.add(scene.add.image(0, 0, 'jar-front'));
    c.add(scene.add.image(0, -118, 'lid-' + type));
    this.countText = scene.add.text(0, -122, '0', {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: '#FFFFFF',
      stroke: COLOURS.woodText, strokeThickness: 8
    }).setOrigin(0.5);
    c.add(this.countText);
    this.label = scene.add.image(0, 186, 'label-' + type);
    c.add(this.label);
  }

  // Where coin number i sits inside the jar (3 per row, stacked up)
  coinSpot(i) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return { x: (col - 1) * 50 + (row % 2 ? 12 : -12), y: 98 - row * 30 };
  }

  setCount(n, dropLast = false) {
    this.count = n;
    this.countText.setText(String(n));
    this.coinLayer.removeAll(true);
    const shown = Math.min(n, JAR_MAX_SHOWN);
    for (let i = 0; i < shown; i++) {
      const spot = this.coinSpot(i);
      const coin = this.scene.add.image(spot.x, spot.y, 'coin').setScale(0.62);
      this.coinLayer.add(coin);
      if (dropLast && i === shown - 1) {
        coin.y = -110;
        this.scene.tweens.add({ targets: coin, y: spot.y, duration: 380, ease: 'Bounce.easeOut' });
      }
    }
  }

  // Save jar only: draw the goal line at the height the coins will reach
  setGoal(goal, rewardKey) {
    if (this.type !== 'save') return;
    const rows = Math.ceil(goal / 3);
    const y = 98 - (rows - 1) * 30 - 26;
    this.goalLine.clear();
    this.goalLine.lineStyle(5, COLOURS.gold, 1);
    for (let x = -96; x < 96; x += 22) this.goalLine.lineBetween(x, y, x + 12, y);
    this.goalLine.lineBetween(-130, y, -112, y);
    this.goalIcon.setTexture(rewardKey).setY(y);
    this.goalIcon.setScale(60 / this.goalIcon.height);
    this.goalIcon.setTintFill(COLOURS.wood).setAlpha(0.55);   // a mystery shape
  }

  // Top of the jar, in screen position (where coins go in)
  mouth() {
    const c = this.container;
    return { x: c.x, y: c.y - 120 * this.size };
  }

  // Is this screen position over the jar? (generous, for small fingers)
  contains(px, py) {
    const c = this.container, s = this.size;
    return px > c.x - 140 * s && px < c.x + 140 * s && py > c.y - 175 * s && py < c.y + 245 * s;
  }

  onTap(fn) {
    this.container.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-120, -160, 240, 400),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    });
    this.container.on('pointerdown', fn);
  }

  wiggle() {
    this.scene.tweens.add({ targets: this.container, angle: { from: -5, to: 5 }, duration: 90, yoyo: true, repeat: 1,
      onComplete: () => this.container.setAngle(0) });
  }

  highlight(on) {
    this.container.setScale(this.size * (on ? 1.08 : 1));
  }
}
