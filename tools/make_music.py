"""
Makes the gentle background music for Bunnies & Monies
(assets/sounds/music-village.mp3): a soft, happy music-box tune
that loops smoothly. Everything is created from scratch here, so
there are no rights to worry about.

    python3 tools/make_music.py
    python3 tools/build_embedded_files.py

Needs numpy and ffmpeg.
"""
import os, subprocess, numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'sounds', 'music-village.mp3')
SR = 32000
BPM = 92
BEAT = 60 / BPM

def note_freq(name):
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    return 440 * 2 ** ((names[name[0]] + 12 * (int(name[-1]) - 4)) / 12)

def music_box(f, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3.2) * np.minimum(1, t * 400)
    tone = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
            + 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 9))
    return vol * env * tone

def soft_bass(f, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 1.6) * np.minimum(1, t * 60)
    return vol * env * (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * 2 * f * t))

def pad(freqs, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    return vol * env * sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate(freqs)) / len(freqs)

# 16 bars of 4 beats. Chords and a cheerful pentatonic melody (beats, note).
chords = ['C', 'Am', 'F', 'G'] * 4
chord_notes = {'C': ['C3', 'E3', 'G3'], 'Am': ['A2', 'C3', 'E3'], 'F': ['F2', 'A2', 'C3'], 'G': ['G2', 'B2', 'D3']}
phrase_a = [(0, 'E5'), (1, 'G5'), (2, 'A5'), (3, 'G5'), (4, 'E5'), (5.5, 'D5'), (6, 'C5'), (8, 'D5'), (9, 'E5'), (10, 'G5'), (11, 'E5'), (12, 'D5'), (14, 'G4')]
phrase_b = [(0, 'C5'), (1, 'E5'), (2, 'G5'), (3, 'C6'), (4, 'A5'), (5, 'G5'), (6, 'E5'), (8, 'F5'), (9, 'E5'), (10, 'D5'), (11, 'C5'), (12, 'D5'), (13, 'E5'), (14, 'C5')]
melody = [(b, n) for b, n in phrase_a] + [(b + 16, n) for b, n in phrase_b] + \
         [(b + 32, n) for b, n in phrase_a] + [(b + 48, n) for b, n in phrase_b]

total_beats = 64
loop_len = int(SR * BEAT * total_beats)
track = np.zeros(loop_len * 3)   # render 3 copies and keep the middle one, so the loop joins seamlessly

def add(sig, start_sample):
    end = min(len(track), start_sample + len(sig))
    track[start_sample:end] += sig[:end - start_sample]

for copy in range(3):
    base = copy * loop_len
    for bar, ch in enumerate(chords):
        start = base + int(SR * BEAT * bar * 4)
        add(pad([note_freq(n) * 2 for n in chord_notes[ch]], BEAT * 4, 0.05), start)
        root = note_freq(chord_notes[ch][0])
        add(soft_bass(root, BEAT * 2, 0.16), start)
        add(soft_bass(root * 1.5, BEAT * 2, 0.10), start + int(SR * BEAT * 2))
        for k, n in enumerate(chord_notes[ch] + [chord_notes[ch][1]]):   # gentle broken chord
            add(music_box(note_freq(n) * 4, BEAT * 1.5, 0.045), start + int(SR * BEAT * k))
    for beat, n in melody:
        add(music_box(note_freq(n), BEAT * 2.5, 0.20), base + int(SR * BEAT * beat))

loop = track[loop_len:loop_len * 2]
loop = loop / np.max(np.abs(loop)) * 0.8
pcm = (loop * 32767).astype(np.int16).tobytes()
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                '-af', 'loudnorm=I=-20:TP=-2:LRA=7', '-ar', '32000', '-b:a', '64k', OUT], input=pcm, check=True)
print('Made', OUT, f'({total_beats * BEAT:.1f} seconds, loops smoothly)')
