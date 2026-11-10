# Bunnies & Monies: privacy and child safety

Bunnies & Monies is made for children aged 0 to 9. It's built so that it is safe by default.

## What the game does NOT do

- **No ads** of any kind.
- **No links** to other websites, and no way to leave the game by tapping.
- **No chat**, messaging or contact with other people.
- **No personal information collected.** The game never asks for a name, age, email, photo, location or anything else. There are no text boxes to type into.
- **No internet connection.** The game runs entirely from its own files. A built-in browser safety rule (a "Content Security Policy" in `index.html`) blocks any connection to the internet, even by accident.
- **No tracking, analytics or cookies.**
- **No camera, microphone or location access.**
- **No purchases.** The "coins" are pretend, and the shop only sells pretend treats.

## What the game DOES store

To remember a child's progress, the game saves a small note **in the web browser on that device only**. It contains:

- how many coins are in the tray and in each jar (Save, Spend, Give)
- how many coins have been earned in total
- which surprises have been unlocked and which treats bought
- how many coins have been shared

That's all. It's never sent anywhere. It stays until a grown-up clears it.

**To clear it:** on the title screen, press and hold the small lightbulb button, then press and hold "Start the game again from zero". Clearing the browser's site data also removes it.

## The voice

The placeholder voice uses the device's own built-in voice. Some browsers offer "online" voices that send words to the internet to be spoken; the game deliberately **never uses those**. If a device only has online voices, the placeholder voice stays silent. Recorded voice files, once added, work on every device.

## Grown-up areas

The tips for grown-ups are plain text in a bar at the bottom of the page. Nothing in the bar can be tapped, and it contains no links. The grown-ups area (larger tips, the full privacy policy and the "start again" option) is behind a **parent gate**: an adult maths question written in words, answered on a number pad. The full privacy policy can be read inside the game, so no link out is needed.

## Checking it yourself

Run `python3 tools/safety_check.py` (or ask Claude to). It scans the game's files and confirms there are no ads, links, chat, internet connections or personal data.

## If you publish the game

If you put the game on a website or in an app store:

- don't add analytics, ads or "share" buttons to the page that hosts it
- keep the safety rule in `index.html` in place
- check the hosting service's own privacy settings, since some log visitor information

App stores and some countries have specific rules for children's apps, for example COPPA in the US, the UK Age Appropriate Design Code, and the Australian Privacy Principles. This file isn't legal advice, so have the final listing checked before release.
