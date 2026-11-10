"""
Makes the natural-sounding voice recordings for the lines in
src/voice.js that don't have one yet (add --all to remake every line), using the free Kokoro voice model (Apache 2.0 licence,
fine for commercial use). Run it after changing any words:

    pip install kokoro-onnx soundfile        (first time only)
    python3 tools/make_voice_lines.py
    python3 tools/build_embedded_files.py

Needs ffmpeg installed. The first run downloads the voice model
(about 115 MB) into tools/voice-model/. (Or just ask Claude.)

Settings: the "Heart" voice (af_heart), speaking a little slowly
for young children. Change VOICE below to try another, for example
af_bella, af_nicole or bf_emma (British).
"""
import json, os, re, subprocess, urllib.request

VOICE = 'af_heart'
SPEED = 0.92
SLOWER = {'intoSpend': 0.82, 'bought': 0.82}   # spoken a bit slower so the words are clearer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(ROOT, 'tools', 'voice-model')
OUT = os.path.join(ROOT, 'assets', 'sounds')
URL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
FILES = ['kokoro-v1.0.int8.onnx', 'voices-v1.0.bin']

os.makedirs(MODEL_DIR, exist_ok=True)
for f in FILES:
    path = os.path.join(MODEL_DIR, f)
    if not os.path.exists(path):
        print('Downloading', f, '...')
        urllib.request.urlretrieve(URL + f, path)

# Read the lines straight from src/voice.js
src = open(os.path.join(ROOT, 'src', 'voice.js'), encoding='utf-8').read()
block = src[src.index('const VOICE_LINES'):]
block = block[block.index('{'):block.index('};') + 1]
pattern = r"^\s*(\w+):\s*(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\")"
lines = {key: single or double for key, single, double in re.findall(pattern, block, re.M)}

import soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(os.path.join(MODEL_DIR, FILES[0]), os.path.join(MODEL_DIR, FILES[1]))
lang = 'en-us' if VOICE.startswith('a') else 'en-gb'

import sys
remake_all = '--all' in sys.argv   # without --all, existing recordings are kept as they are
for key, text in lines.items():
    if not remake_all and os.path.exists(os.path.join(OUT, f'voice-{key}.mp3')):
        continue
    text = text.replace("\\'", "'")
    samples, rate = k.create(text, voice=VOICE, speed=SLOWER.get(key, SPEED), lang=lang)
    wav = os.path.join(MODEL_DIR, 'tmp.wav')
    sf.write(wav, samples, rate)
    # Trim silence, even out the loudness, save as a small MP3
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-af',
                    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                    'afade=t=in:d=0.02,loudnorm=I=-16:TP=-1.5:LRA=11,apad=pad_dur=0.15',
                    '-ar', '24000', '-ac', '1', '-b:a', '64k',
                    os.path.join(OUT, f'voice-{key}.mp3')], check=True)
    print('Made voice-%s.mp3' % key)

os.remove(os.path.join(MODEL_DIR, 'tmp.wav'))
print('Done. Now run: python3 tools/build_embedded_files.py')
