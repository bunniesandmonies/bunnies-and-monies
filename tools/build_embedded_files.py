"""
Rebuilds the packed picture and sound files:
  assets/images/embedded-images.js  (from assets/images/characters and scenes)
  assets/sounds/embedded-sounds.js  (from assets/sounds)

Why: browsers block games from loading picture files when you
double-click index.html. Turning the pictures into text inside a
.js file gets around that, so the game still opens by double-click.

Run this after adding or changing pictures:
    python3 tools/build_embedded_files.py
(Or just ask Claude to do it.)
"""
import base64
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, 'assets', 'images')
FOLDERS = ['characters', 'scenes']
SOUND_TYPES = {'.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4'}
TYPES = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}

data = {}
for folder in FOLDERS:
    path = os.path.join(IMAGES, folder)
    for name in sorted(os.listdir(path)):
        key, ext = os.path.splitext(name)
        if ext.lower() not in TYPES:
            continue
        with open(os.path.join(path, name), 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('ascii')
        data[key] = {'folder': folder, 'src': f'data:{TYPES[ext.lower()]};base64,{encoded}'}

out = os.path.join(IMAGES, 'embedded-images.js')
with open(out, 'w') as f:
    f.write('// AUTO-MADE FILE. Do not edit by hand.\n')
    f.write('// Rebuild with: python3 tools/build_embedded_files.py\n')
    f.write('const EMBEDDED_IMAGES = ' + json.dumps(data, indent=0) + ';\n')

print(f'Saved {len(data)} pictures into {out}')

# Sounds and voice recordings
SOUNDS = os.path.join(ROOT, 'assets', 'sounds')
sounds = {}
for name in sorted(os.listdir(SOUNDS)):
    key, ext = os.path.splitext(name)
    if ext.lower() not in SOUND_TYPES:
        continue
    with open(os.path.join(SOUNDS, name), 'rb') as f:
        encoded = base64.b64encode(f.read()).decode('ascii')
    sounds[key] = {'src': f'data:{SOUND_TYPES[ext.lower()]};base64,{encoded}'}

out = os.path.join(SOUNDS, 'embedded-sounds.js')
with open(out, 'w') as f:
    f.write('// AUTO-MADE FILE. Do not edit by hand.\n')
    f.write('// Rebuild with: python3 tools/build_embedded_files.py\n')
    f.write('const EMBEDDED_SOUNDS = ' + json.dumps(sounds, indent=0) + ';\n')

print(f'Saved {len(sounds)} sounds into {out}')
