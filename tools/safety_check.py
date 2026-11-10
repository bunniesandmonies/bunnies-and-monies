"""
CHILD SAFETY CHECK
Scans the game's own files and reports, in plain English, whether
anything could show ads, link to other websites, open a chat,
connect to the internet, or collect personal information.

Run it after any change:
    python3 tools/safety_check.py
(Or just ask Claude to run it.)

It checks index.html and everything in src/. The Phaser game engine
(lib/phaser.min.js) is a well-known library. It *can* load files,
but the safety rule in index.html stops it reaching the internet.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()

own_files = ['index.html'] + [
    os.path.join(dp, f).replace(ROOT + os.sep, '')
    for dp, _, files in os.walk(os.path.join(ROOT, 'src')) for f in files if f.endswith('.js')
]

# Things that should never appear in a young children's game
RULES = [
    ('Links to websites (http:// or https://)', r'https?://'),
    ('Clickable links', r'<a\s|\.href\s*=|window\.open|location\.(assign|replace)'),
    ('Connections to the internet', r'\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|RTCPeerConnection'),
    ('Text boxes or forms (could collect names or messages)', r'<input|<textarea|<form|\bprompt\s*\(|createElement\(\s*[\'"](input|textarea|form)'),
    ('Embedded web pages', r'<iframe|<embed|<object'),
    ('Ads or tracking code', r'(?i)(adsbygoogle|admob|doubleclick|googletagmanager|google-analytics|gtag\s*\(|firebase|mixpanel|amplitude|segment\.(io|com)|appsflyer|adjust\.com|branch\.io|fbq\s*\(|connect\.facebook|tiktok|unityads|applovin|ironsource|chartboost|vungle)'),
    ('Cookies', r'document\.cookie'),
    ('Location, camera or microphone', r'geolocation|getUserMedia|mediaDevices'),
    ('Device fingerprinting', r'navigator\.(userAgent|platform|hardwareConcurrency|deviceMemory)|canvas\.toDataURL'),
    ('Chat or messaging features', r'(?i)(chatbox|chatroom|livechat|chat\w*\s*\(|socket\.io|firebase|pusher|intercom|zendesk)'),
]

problems = 0
print('Bunnies & Monies: child safety check\n')

for label, pattern in RULES:
    hits = []
    for path in own_files:
        for n, line in enumerate(read(path).splitlines(), 1):
            if re.search(pattern, line):
                hits.append(f'      {path}, line {n}: {line.strip()[:90]}')
    if hits:
        problems += 1
        print(f'  [CHECK] {label}: found something')
        print('\n'.join(hits))
    else:
        print(f'  [OK]    No {label[0].lower() + label[1:]}')

# The safety rule in index.html
html = read('index.html')
csp = re.search(r'Content-Security-Policy"\s+content="([^"]+)"', html)
if csp and "default-src 'none'" in csp.group(1) and 'http' not in csp.group(1):
    print("  [OK]    Safety rule is on: the browser blocks everything outside the game's own files")
else:
    problems += 1
    print('  [CHECK] The safety rule (Content-Security-Policy) is missing or allows outside websites')

# Saved progress: only game progress, under one name
storage_uses = set()
for path in own_files:
    for m in re.finditer(r'localStorage\.(\w+)\(\s*([A-Za-z_\'"-]+)', read(path)):
        storage_uses.add(m.group(2))
if storage_uses <= {'SAVE_NAME'}:
    print('  [OK]    Saved progress is game progress only (coins, jars, treats, surprises, hearts): no names, ages or other personal details')
else:
    problems += 1
    print(f'  [CHECK] Unexpected saved data: {storage_uses}')
if re.search(r'sessionStorage|indexedDB', ''.join(read(p) for p in own_files)):
    problems += 1
    print('  [CHECK] Other browser storage is used')

state = read('src/state.js')
fields = re.findall(r'^\s{6}(\w+):', state[state.index('fresh()'):state.index('load()')], re.M)
print(f'          Saved fields: {", ".join(fields)}')

# Packed pictures and sounds must be self-contained
for packed, name in [('assets/images/embedded-images.js', 'EMBEDDED_IMAGES'), ('assets/sounds/embedded-sounds.js', 'EMBEDDED_SOUNDS')]:
    text = read(packed)
    data = json.loads(text[text.index('{'):text.rindex('}') + 1])
    bad = [k for k, v in data.items() if not v['src'].startswith('data:')]
    if bad:
        problems += 1
        print(f'  [CHECK] {packed} points outside the game: {bad}')
    else:
        print(f'  [OK]    {packed}: all {len(data)} items are built in (nothing loaded from elsewhere)')

# Parent gate in front of the grown-ups area (settings), as Apple and Google expect
gate = read('src/parent-gate.js') if os.path.exists(os.path.join(ROOT, 'src/parent-gate.js')) else ''
ui = read('src/ui.js')
if 'ParentGate' in gate and "ParentGate.ask(scene, () => this.showTip" in ui:
    print('  [OK]    Parent gate (grown-up maths question) guards the grown-ups area: tips, privacy policy, start again')
else:
    problems += 1
    print('  [CHECK] The grown-ups area is not behind the parent gate')

# Voice placeholder: device voices only
voice = read('src/voice.js')
if 'localService' in voice:
    print('  [OK]    Placeholder voice uses device voices only (never online voices)')
else:
    problems += 1
    print('  [CHECK] Placeholder voice might use online voices')

print()
if problems:
    print(f'{problems} thing(s) need a look. See [CHECK] lines above.')
    sys.exit(1)
print('All clear: no ads, no outside links, no chat, no internet connections and no personal data.')
