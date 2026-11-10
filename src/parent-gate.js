// ------------------------------------------------------------
// PARENT GATE (grown-ups only)
// Apple's Kids Category and Google's Families policy expect a
// "parental gate" in front of anything meant for grown-ups:
// settings, links out of the game, and purchases.
//
// This asks an adult-level maths question written in WORDS
// (for example "What is fourteen times six?"), answered on a big
// number pad. Children who can't read yet can't follow it, and
// it's tricky for young readers. A voice tells little ones to
// fetch a grown-up, as Apple suggests for pre-readers.
//
// HOW TO USE IT for anything new meant for grown-ups:
//     ParentGate.ask(scene, () => { ...what to do after... });
// The game has NO links or real purchases today. If you ever add
// one, it MUST go through ParentGate.ask first.
// ------------------------------------------------------------

const ParentGate = {
  WORDS: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
  MAX_TRIES: 3,

  ask(scene, onPass) {
    if (scene.tipOpen) return;
    scene.tipOpen = true;               // pauses hints and voice while the gate is open
    Voice.say(scene, 'askGrownUp');

    const w = scene.scale.width, h = scene.scale.height;
    const cardW = Math.min(w - 60, 720), cardH = 600;
    const left = w / 2 - cardW / 2, top = h / 2 - cardH / 2;
    const items = [];
    let answer = 0, typed = '', tries = 0;

    const add = (obj) => { obj.setDepth(obj.depth || 102); items.push(obj); return obj; };
    const text = (x, y, str, size, bold, colour = COLOURS.woodText) => add(scene.add.text(x, y, str, {
      fontFamily: FONT, fontSize: size + 'px', fontStyle: bold ? 'bold' : 'normal', color: colour,
      align: 'center', wordWrap: { width: cardW - 80 }
    }).setOrigin(0.5));

    // Dim and block everything behind the gate
    add(scene.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0).setInteractive().setDepth(100));

    const card = add(scene.add.graphics().setDepth(101));
    card.fillStyle(COLOURS.wood, 1).fillRoundedRect(left, top + 8, cardW, cardH, 30);
    card.fillStyle(COLOURS.cream, 1).fillRoundedRect(left, top, cardW, cardH, 30);
    card.lineStyle(6, COLOURS.gold, 1).strokeRoundedRect(left, top, cardW, cardH, 30);

    text(w / 2, top + 48, PARENT_GATE_HEADING, 34, true);
    const note = text(w / 2, top + 90, PARENT_GATE_ASK, 22, false);
    const question = text(w / 2, top + 140, '', 34, true);

    const box = add(scene.add.graphics());
    box.fillStyle(0xFFFFFF, 1).fillRoundedRect(w / 2 - 130, top + 175, 260, 64, 14);
    box.lineStyle(4, COLOURS.wood, 1).strokeRoundedRect(w / 2 - 130, top + 175, 260, 64, 14);
    const shown = text(w / 2, top + 207, '', 44, true);

    const newQuestion = () => {
      const a = Phaser.Math.Between(11, 19), b = Phaser.Math.Between(3, 9);
      answer = a * b;
      typed = '';
      shown.setText('');
      question.setText(`What is ${this.WORDS[a]} times ${this.WORDS[b]}?`);
    };

    const close = () => {
      items.forEach((o) => o.destroy());
      scene.tipOpen = false;
      scene.closeOverlay = null;
      scene.idleTime = 0;
    };
    scene.closeOverlay = close;          // the Android back button closes it too

    const check = () => {
      if (typed !== '' && parseInt(typed, 10) === answer) {
        close();
        onPass();
        return;
      }
      tries += 1;
      SFX.play(scene, 'boop');
      if (tries >= this.MAX_TRIES) { close(); return; }
      note.setText(PARENT_GATE_WRONG);
      scene.tweens.add({ targets: question, x: { from: w / 2 - 10, to: w / 2 + 10 }, duration: 60, yoyo: true, repeat: 2,
        onComplete: () => question.setX(w / 2) });
      newQuestion();
    };

    // Number pad: 1-9, then delete, 0, OK
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];
    const kw = 120, kh = 64, gap = 12;
    const padLeft = w / 2 - (kw * 3 + gap * 2) / 2, padTop = top + 262;
    keys.forEach((k, i) => {
      const x = padLeft + (i % 3) * (kw + gap) + kw / 2;
      const y = padTop + Math.floor(i / 3) * (kh + gap) + kh / 2;
      const key = add(scene.add.container(x, y));
      const g = scene.add.graphics();
      const isOk = k === 'OK';
      g.fillStyle(isOk ? COLOURS.wood : COLOURS.gold, 1).fillRoundedRect(-kw / 2, -kh / 2, kw, kh, 14);
      key.add([g, scene.add.text(0, 2, k, {
        fontFamily: FONT, fontSize: '34px', fontStyle: 'bold', color: isOk ? COLOURS.creamText : COLOURS.woodText
      }).setOrigin(0.5)]);
      key.setInteractive({ hitArea: new Phaser.Geom.Rectangle(-kw / 2, -kh / 2, kw, kh), hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
      key.on('pointerdown', () => key.setScale(0.94));
      key.on('pointerout', () => key.setScale(1));
      key.on('pointerup', () => {
        key.setScale(1);
        if (k === 'OK') return check();
        if (k === '⌫') typed = typed.slice(0, -1);
        else if (typed.length < 3) typed += k;
        shown.setText(typed);
      });
    });

    // Close button (top right of the card)
    const x = add(scene.add.text(left + cardW - 40, top + 40, '✕', {
      fontFamily: FONT, fontSize: '40px', fontStyle: 'bold', color: COLOURS.woodText
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    x.on('pointerup', close);

    newQuestion();
  }
};
