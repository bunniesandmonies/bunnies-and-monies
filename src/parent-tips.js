// ------------------------------------------------------------
// TIPS FOR GROWN-UPS
// One sentence per screen explaining the money lesson.
// It's always shown in the brown bar along the bottom of the page.
// Tapping the small lightbulb button (under the speaker button)
// opens the PARENT GATE (a grown-up maths question). After the
// right answer, the grown-ups card shows the tip bigger, and on the
// title screen also the privacy policy and "start again from zero".
//
// Change the words here at any time.
// ------------------------------------------------------------

const PARENT_TIPS = {
  title: 'Bunnies & Monies builds early money habits through play: earning, saving, spending and giving.',
  village: 'Earning: money comes from doing work and helping, so talk about the jobs your family does to earn money.',
  jars: 'Every coin can have a job: sorting into Save, Spend and Give jars shows that we choose what our money is for.',
  shop: 'Spending: things cost money, and when we don\'t have enough yet, we can wait and save up instead.',
  give: 'Giving: some of our money can help people who need it, like giving food to a food bank. Ask your child who they would like to help.',
  save: 'Saving: putting a little aside each time adds up to something special later.',
  finish: 'Book 1 complete! Celebrate together, then talk about something real your child could save up for.',
  tutorial: 'How to play: go through the steps together, and ask your child what they would save, spend or give.'
};

// Shown on the title screen (tip bar and grown-ups card)
const PARENT_PRIVACY_NOTE = 'No ads, no links, no chat, and no personal information collected. Progress is saved only on this device.';

const PARENT_TIP_HEADING = 'For grown-ups: the money lesson';
const PARENT_TIP_CLOSE = 'Tap anywhere to close';
const PARENT_RESET_LABEL = 'Hold to start the game again from zero';
const PARENT_RESET_DONE = 'Done! Progress has been cleared.';

// Parent gate (src/parent-gate.js)
const PARENT_GATE_HEADING = 'Grown-ups only';
const PARENT_GATE_ASK = 'Please answer to continue.';
const PARENT_GATE_WRONG = 'Not quite. Here is a new question.';

// Privacy policy, shown in full inside the game (no link needed).
// Keep it the same as PRIVACY.md and the store privacy policy page.
const PARENT_POLICY_LABEL = 'Read our privacy policy';
const PARENT_POLICY_HEADING = 'Privacy policy: Bunnies & Monies';
const PARENT_PRIVACY_CONTACT = 'admin@learningmonies.com.au';   // CHECK before release
const PARENT_PRIVACY_POLICY =
  'Bunnies & Monies is made for children. It does not collect, store or share any personal information.\n\n' +
  '\u2022 No ads, no tracking, no analytics and no cookies.\n' +
  '\u2022 No links to other websites or apps, no chat and no purchases.\n' +
  '\u2022 No names, ages, photos, location, camera or microphone are ever asked for or used.\n' +
  '\u2022 The game never connects to the internet.\n\n' +
  'Game progress (coins, jars, treats and surprises) is saved only on this device, so it is still there next time. ' +
  'It never leaves the device. A grown-up can clear it at any time with "start the game again from zero".\n\n' +
  'Questions? Contact Learning Monies Pty Ltd at ' + PARENT_PRIVACY_CONTACT + '.';
