#!/usr/bin/env python3
"""Build js/songs.js for Piano Challenge from the public-domain sources in music/sources/.

Needs: pip install mido music21
Run from the repository root:  python3 tools/build_songs.py

Each song becomes a list of tiles: [beat, durationBeats, pitch1, pitch2, ...]. The first pitch is the
melody note (it decides the column); the other pitches are the chord that sounds with it. Nothing is
typed by hand: every pitch comes from the source files (only transposed or trimmed as listed below).
"""
import json, os, statistics
import mido
from music21 import converter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'music', 'sources')
EPS = 1 / 48

# ---------- readers ----------
KEYS = {'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7, 'F': -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7,
        'Am': 0, 'Em': 1, 'Bm': 2, 'F#m': 3, 'C#m': 4, 'G#m': 5, 'D#m': 6, 'A#m': 7, 'Dm': -1, 'Gm': -2, 'Cm': -3, 'Fm': -4, 'Bbm': -5, 'Ebm': -6, 'Abm': -7}
META = {}

def read_midi(name):
    m = mido.MidiFile(os.path.join(SRC, name))
    tempo = next((msg.tempo for t in m.tracks for msg in t if msg.type == 'set_tempo'), 500000)
    ts = next(((msg.numerator, msg.denominator) for t in m.tracks for msg in t if msg.type == 'time_signature'), (4, 4))
    ks = next((KEYS.get(msg.key, 0) for t in m.tracks for msg in t if msg.type == 'key_signature'), 0)
    META['last'] = {'ts': list(ts), 'ks': ks}
    out = []
    for ti, t in enumerate(m.tracks):
        tick = 0; on = {}
        for msg in t:
            tick += msg.time
            if msg.type == 'note_on' and msg.velocity > 0:
                on.setdefault(msg.note, []).append(tick)
            elif msg.type in ('note_off', 'note_on') and on.get(msg.note):
                st = on[msg.note].pop(0)
                out.append((st / m.ticks_per_beat, max(EPS, (tick - st) / m.ticks_per_beat), msg.note, ti))
    return sorted(out), 60e6 / tempo

def read_m21(name, index=None, bpm=100):
    s = converter.parse(os.path.join(SRC, name))
    if index is not None and hasattr(s, 'scores'):
        s = s.scores[index]
    out = []
    parts = s.parts if hasattr(s, 'parts') and len(s.parts) else [s]
    for pi, p in enumerate(parts):
        for n in p.flatten().notes:
            pitches = [x.midi for x in (n.pitches if n.isChord else [n.pitch])]
            for mp in pitches:
                out.append((float(n.getOffsetInHierarchy(p)), max(EPS, float(n.quarterLength)), mp, pi))
    mm = s.flatten().getElementsByClass('MetronomeMark')
    if mm: bpm = mm[0].getQuarterBPM() or bpm
    tsl = s.flatten().getElementsByClass('TimeSignature')
    ksl = s.flatten().getElementsByClass('KeySignature')
    META['last'] = {'ts': [tsl[0].numerator, tsl[0].denominator] if tsl else [4, 4], 'ks': ksl[0].sharps if ksl else 0}
    return sorted(out), bpm

def abc_tune(fname, tune_id):
    """Pull one tune (by %%id) out of the shared ABC file and parse it."""
    txt = open(os.path.join(SRC, fname), encoding='utf-8').read()
    blocks = txt.split('\nX:')
    for b in blocks:
        if '%%id ' + tune_id + '\n' in b:
            bpm = int(b.split('%%bpm ')[1].split()[0]) if '%%bpm' in b else 100
            tmp = os.path.join(SRC, '_tmp.abc')
            open(tmp, 'w', encoding='utf-8').write('X:' + b.split('\n', 1)[0].strip().lstrip(':') + '\n' + b.split('\n', 1)[1])
            try:
                notes, _ = read_m21('_tmp.abc', bpm=bpm)
            finally:
                os.remove(tmp)
            return notes, bpm
    raise KeyError(tune_id)

# ---------- melody & tiles ----------
def skyline(notes):
    """Melody = notes that are the highest sounding note when they start."""
    mel = []
    for n in notes:
        higher = any(o[2] > n[2] and o[0] <= n[0] + EPS and o[0] + o[1] > n[0] + EPS for o in notes if o is not n)
        if not higher:
            mel.append(n)
    # one melody note per onset (the highest)
    best = {}
    for n in mel:
        k = round(n[0] * 48)
        if k not in best or n[2] > best[k][2]: best[k] = n
    return sorted(best.values())

def build(notes, mode, melody_tracks=None, harmony=True):
    if mode == 'full':
        onsets = {}
        for n in notes: onsets.setdefault(round(n[0] * 48), []).append(n)
        tiles = []
        for k in sorted(onsets):
            ns = sorted(onsets[k], key=lambda n: -n[2])
            tiles.append([ns[0][0], ns[0][1], ns[0][2]] + [n[2] for n in ns[1:]])
        return tiles
    pool = [n for n in notes if melody_tracks is None or n[3] in melody_tracks]
    mel = skyline(pool)
    tiles = []
    for m in mel:
        chord = []
        if harmony:
            chord = [n[2] for n in notes if abs(n[0] - m[0]) < EPS and n is not m and n[2] != m[2]]
        tiles.append([m[0], m[1], m[2]] + sorted(set(chord), reverse=True)[:4])
    return tiles

MIN_GAP = {'beginner': 0.42, 'easy': 0.36, 'medium': 0.27, 'hard': 0.19, 'expert': 0.14}
MAX_TILES = {'beginner': 999, 'easy': 140, 'medium': 170, 'hard': 260, 'expert': 420}

def finish(tiles, bpm, diff, start=0, end=None, transpose=0, max_tiles=None):
    tiles = [t for t in tiles if t[0] >= start - EPS and (end is None or t[0] < end - EPS)]
    tiles = tiles[:max_tiles or MAX_TILES[diff]]
    t0 = tiles[0][0]
    meta = dict(META.get('last', {'ts': [4, 4], 'ks': 0}))
    bar = meta['ts'][0] * 4 / meta['ts'][1]
    meta['bar0'] = round(t0 % bar, 4)   # where the first tile sits inside its bar (for barlines)
    META['song'] = meta
    out, shift, prev = [], 0.0, None
    for t in tiles:
        b = t[0] - t0 - shift
        if prev is not None and b - prev > 4:  # squeeze long rests to 2 beats
            shift += (b - prev) - 2; b = prev + 2
        out.append([round(b, 4), round(min(t[1], 4), 4)] + [p + transpose for p in t[2:]])
        prev = b
    # slow the tempo down if notes come faster than the level can handle
    gaps = [out[i + 1][0] - out[i][0] for i in range(len(out) - 1) if out[i + 1][0] > out[i][0]]
    med = statistics.median(gaps) if gaps else 1
    secs = med * 60 / bpm
    if secs < MIN_GAP[diff]:
        bpm = 60 * med / MIN_GAP[diff]
    return out, round(bpm, 1)

# ---------- the song list (order = unlock order) ----------
TRAD = 'traditional-melodies.abc'
S = []
def song(id, title, title_es, composer, diff, src, credit, tiles_fn, **kw):
    S.append(dict(id=id, title=title, titleEs=title_es, composer=composer, diff=diff, src=src, credit=credit, fn=tiles_fn, kw=kw))

def abc(tid):
    return lambda: (lambda n_b: (build(n_b[0], 'melody', harmony=False), n_b[1]))(abc_tune(TRAD, tid))
def abcfile(f, bpm):
    return lambda: (lambda n_b: (build(n_b[0], 'melody', harmony=False), bpm))(read_m21(f, bpm=bpm))
def mid(f, mode='melody', tracks=None, bpm=None):
    def go():
        notes, b = read_midi(f)
        return build(notes, mode, tracks), bpm or b
    return go
def mxl(f, mode='melody', tracks=None, bpm=72):
    def go():
        notes, b = read_m21(f, bpm=bpm)
        return build(notes, mode, tracks), bpm
    return go

T = 'Traditional'
song('hot-cross-buns', 'Hot Cross Buns', 'Bollos de Pascua (Hot Cross Buns)', T, 'beginner', TRAD, 'trad', abc('hot-cross-buns'))
song('mary-lamb', 'Mary Had a Little Lamb', 'María tenía un corderito', 'Traditional (Lowell Mason)', 'beginner', TRAD, 'trad', abc('mary-lamb'))
song('twinkle', 'Twinkle Twinkle Little Star', 'Estrellita, ¿dónde estás?', T, 'beginner', TRAD, 'trad', abc('twinkle'))
song('jesus-loves-me', 'Jesus Loves Me', 'Cristo me ama', 'William B. Bradbury', 'beginner', 'jesus_loves.mid', 'hymnsinger', mid('jesus_loves.mid', bpm=80))
song('amazing-grace', 'Amazing Grace', 'Sublime gracia', 'Traditional (New Britain)', 'beginner', 'amazing.mid', 'mutopia', mid('amazing.mid', bpm=80))
song('row-boat', 'Row, Row, Row Your Boat', 'Rema, rema, rema tu bote', T, 'beginner', TRAD, 'trad', abc('row-row'))
song('london-bridge', 'London Bridge', 'El puente de Londres', T, 'beginner', TRAD, 'trad', abc('london-bridge'))
song('frere-jacques', 'Frère Jacques', 'Martinillo (Frère Jacques)', T, 'beginner', TRAD, 'trad', abc('frere-jacques'))
song('old-macdonald', 'Old MacDonald', 'En la granja de mi tío', T, 'beginner', TRAD, 'trad', abc('old-macdonald'))
song('baa-baa', 'Baa Baa Black Sheep', 'Bee bee, ovejita negra', T, 'beginner', 'baa-baa-black-sheep.abc', 'jc', abcfile('baa-baa-black-sheep.abc', 100))
song('this-old-man', 'This Old Man', 'Este viejito', T, 'beginner', 'this-old-man.abc', 'kids', abcfile('this-old-man.abc', 100))
song('yankee-doodle', 'Yankee Doodle', 'Yankee Doodle', T, 'beginner', TRAD, 'trad', abc('yankee-doodle'))
song('oh-susanna', 'Oh! Susanna', '¡Oh! Susana', 'Stephen Foster', 'beginner', TRAD, 'trad', abc('oh-susanna'))
song('saints', 'When the Saints Go Marching In', 'Cuando los santos marchan', T, 'beginner', TRAD, 'trad', abc('saints'))
song('jingle-bells', 'Jingle Bells', 'Cascabel', 'James Lord Pierpont', 'beginner', TRAD, 'trad', abc('jingle-bells'))
song('silent-night', 'Silent Night', 'Noche de paz', 'Franz Xaver Gruber', 'beginner', 'silent.mid', 'mutopia', mid('silent.mid', bpm=72))
song('holy-holy-holy', 'Holy, Holy, Holy', 'Santo, santo, santo', 'John Bacchus Dykes', 'beginner', 'holy.mid', 'mutopia', mid('holy.mid', bpm=84))

song('conquering-hero', 'See the Conquering Hero Comes', 'Ved al héroe vencedor', 'George Frideric Handel', 'easy', 'conquering_hero.mid', 'cellist', mid('conquering_hero.mid', tracks=[1]), transpose=2)
song('ombra-mai-fu', 'Largo "Ombra mai fù"', 'Largo «Ombra mai fù»', 'George Frideric Handel', 'easy', 'ombra.mid', 'cellist', mid('ombra.mid', tracks=[1]), start=43)
song('hallelujah', 'Hallelujah Chorus (melody)', 'Coro Aleluya (melodía)', 'George Frideric Handel', 'easy', 'hallelujah.mid', 'mutopia', mid('hallelujah.mid', bpm=72), start=12)
song('sheep-graze', 'Sheep May Safely Graze (melody)', 'Las ovejas pueden pastar seguras (melodía)', 'Johann Sebastian Bach', 'easy', 'sheep.mid', 'mutopia', mid('sheep.mid', tracks=[3], bpm=66), start=16)
song('sleepers-wake', 'Sleepers, Wake! (chorale melody)', 'Despertad, la voz nos llama (coral)', 'Johann Sebastian Bach', 'easy', 'bwv140.7.mxl', 'music21', mxl('bwv140.7.mxl', tracks=[0], bpm=76))

song('minuet-g', 'Minuet in G, BWV Anh. 114', 'Minueto en sol, BWV Anh. 114', 'Notebook for Anna Magdalena Bach (attributed to J. S. Bach; now credited to Christian Petzold)', 'easy', 'minuet_g.mid', 'mutopia', mid('minuet_g.mid', tracks=[1]))
song('minuet-gm', 'Minuet in G minor, BWV Anh. 115', 'Minueto en sol menor, BWV Anh. 115', 'Notebook for Anna Magdalena Bach (attributed to J. S. Bach; now credited to Christian Petzold)', 'easy', 'minuet_gm.mid', 'mutopia', mid('minuet_gm.mid', tracks=[1]))
song('lascia-chio-pianga', "Lascia ch'io pianga (Rinaldo)", "Lascia ch'io pianga (Rinaldo)", 'George Frideric Handel', 'easy', 'Lascia_chio_pianga.mxl', 'music21', mxl('Lascia_chio_pianga.mxl', tracks=[0], bpm=60))
song('water-music-air', 'Air from Water Music, HWV 348', 'Aria de la Música acuática, HWV 348', 'George Frideric Handel', 'easy', 'air_in_f.mid', 'cellist', mid('air_in_f.mid', tracks=[1]))
song('aylesford-menuet', 'Menuet in D (Aylesford Pieces)', 'Minueto en re (Piezas de Aylesford)', 'George Frideric Handel', 'easy', 'aylesford_menuet.mid', 'mutopia', mid('aylesford_menuet.mid', tracks=[1]))

song('jesu-joy', "Jesu, Joy of Man's Desiring", 'Jesús, alegría de los hombres', 'Johann Sebastian Bach', 'medium', 'jesu_joy.mid', 'cellist', mid('jesu_joy.mid', tracks=[3]))
song('air-g-string', 'Air on the G String', 'Aria en la cuerda de Sol', 'Johann Sebastian Bach', 'medium', 'air.mid', 'mutopia', mid('air.mid', tracks=[1]))
song('sarabande-437', 'Sarabande in D minor, HWV 437', 'Zarabanda en re menor, HWV 437', 'George Frideric Handel', 'medium', 'sarabande437.mid', 'cellist', mid('sarabande437.mid', tracks=[1]), transpose=-5)
song('alla-hornpipe', 'Alla Hornpipe (Water Music)', 'Alla Hornpipe (Música acuática)', 'George Frideric Handel', 'medium', 'alla_hornpipe.mid', 'cellist', mid('alla_hornpipe.mid', tracks=[1]), transpose=-3)
song('k545-andante', 'Sonata K. 545, 2nd movement (Andante)', 'Sonata K. 545, 2.º movimiento (Andante)', 'Wolfgang Amadeus Mozart', 'medium', 'k545_2.mid', 'mutopia', mid('k545_2.mid', tracks=[2]))
song('k545-theme', 'Sonata K. 545, 1st movement (opening theme)', 'Sonata K. 545, 1.er movimiento (tema inicial)', 'Wolfgang Amadeus Mozart', 'medium', 'k545_1.mid', 'mutopia', mid('k545_1.mid', tracks=[1]), end=16)

song('musette-d', 'Musette in D, BWV Anh. 126', 'Musette en re, BWV Anh. 126', 'Notebook for Anna Magdalena Bach (attributed to J. S. Bach)', 'medium', 'musette.mid', 'mutopia', mid('musette.mid', tracks=[1]))
song('gavotte-g', 'Gavotte in G, HWV 491', 'Gavota en sol, HWV 491', 'George Frideric Handel', 'medium', 'gavotte_hwv491.mid', 'mutopia', mid('gavotte_hwv491.mid', tracks=[1]))
song('aylesford-air', 'Air in B-flat (Aylesford Pieces)', 'Aria en si bemol (Piezas de Aylesford)', 'George Frideric Handel', 'medium', 'aylesford_air.mid', 'mutopia', mid('aylesford_air.mid', tracks=[1]))
song('passepied', 'Passepied (Aylesford Pieces)', 'Passepied (Piezas de Aylesford)', 'George Frideric Handel', 'medium', 'passepied.mid', 'mutopia', mid('passepied.mid', tracks=[1]))
song('rejouissance', 'La Réjouissance (Royal Fireworks), HWV 351', 'La Réjouissance (Fuegos artificiales), HWV 351', 'George Frideric Handel', 'medium', 'rejouissance.mid', 'mutopia', mid('rejouissance.mid', tracks=[1, 2]))
song('fireworks-bourree', 'Bourrée (Royal Fireworks), HWV 351', 'Bourrée (Fuegos artificiales), HWV 351', 'George Frideric Handel', 'medium', 'fireworks_bourree.mid', 'cellist', mid('fireworks_bourree.mid', tracks=[1]))

song('prelude-c', 'Prelude in C Major, BWV 846', 'Preludio en do mayor, BWV 846', 'Johann Sebastian Bach', 'hard', 'bwv846.mid', 'mutopia', mid('bwv846.mid', 'full'))
song('little-prelude-cm', 'Little Prelude in C minor, BWV 999', 'Pequeño preludio en do menor, BWV 999', 'Johann Sebastian Bach', 'hard', 'bwv999.mid', 'mutopia', mid('bwv999.mid', 'full'))
song('bourree-em', 'Bourrée in E minor, BWV 996', 'Bourrée en mi menor, BWV 996', 'Johann Sebastian Bach', 'hard', 'bwv996.mid', 'mutopia', mid('bwv996.mid', 'full'))
song('badinerie', 'Badinerie, BWV 1067', 'Badinerie, BWV 1067', 'Johann Sebastian Bach', 'hard', 'badinerie.mid', 'cellist', mid('badinerie.mid', 'full'))
song('queen-of-sheba', 'Arrival of the Queen of Sheba', 'La llegada de la reina de Saba', 'George Frideric Handel', 'hard', 'sheba.mid', 'cellist', mid('sheba.mid', 'full'))
song('harmonious-blacksmith', 'The Harmonious Blacksmith', 'El herrero armonioso', 'George Frideric Handel', 'hard', 'blacksmith.mid', 'cellist', mid('blacksmith.mid', 'full'), transpose=-1)
song('k545-rondo', 'Sonata K. 545, 3rd movement (Rondo)', 'Sonata K. 545, 3.er movimiento (Rondó)', 'Wolfgang Amadeus Mozart', 'hard', 'k545_3.mid', 'mutopia', mid('k545_3.mid', 'full'), max_tiles=400)

song('cello-prelude', 'Cello Suite No. 1: Prelude, BWV 1007', 'Suite para violonchelo n.º 1: Preludio, BWV 1007', 'Johann Sebastian Bach', 'hard', 'bwv1007_prelude.mid', 'mutopia', mid('bwv1007_prelude.mid', 'full'))
song('wachet-auf-645', 'Sleepers, Wake! Chorale Prelude, BWV 645', 'Despertad: preludio coral, BWV 645', 'Johann Sebastian Bach', 'hard', 'bwv645.mid', 'mutopia', mid('bwv645.mid', 'full'))

for n in range(1, 16):                      # all fifteen two-part Inventions, BWV 772-786
    f, bwv = 'inv%d.mid' % n, 771 + n
    song('invention-%d' % n, 'Invention No. %d, BWV %d' % (n, bwv), 'Invención n.º %d, BWV %d' % (n, bwv), 'Johann Sebastian Bach', 'expert', f, 'mutopia', mid(f, 'full'), max_tiles=600)
song('prelude-cm-847', 'Prelude in C minor, BWV 847', 'Preludio en do menor, BWV 847', 'Johann Sebastian Bach', 'expert', 'bwv847.mid', 'mutopia', mid('bwv847.mid', 'full'), max_tiles=600)
song('fugue-cm-847', 'Fugue in C minor, BWV 847', 'Fuga en do menor, BWV 847', 'Johann Sebastian Bach', 'expert', 'fugue847.mid', 'mutopia', mid('fugue847.mid', 'full'), max_tiles=600)
song('italian-concerto', 'Italian Concerto, BWV 971, 1st movement', 'Concierto italiano, BWV 971, 1.er movimiento', 'Johann Sebastian Bach', 'expert', 'bwv971_mvt1.mid', 'mutopia', mid('bwv971_mvt1.mid', 'full'))
song('toccata-fugue', 'Toccata and Fugue in D minor, BWV 565', 'Tocata y fuga en re menor, BWV 565', 'Traditionally credited to J. S. Bach', 'expert', 'toccata.mid', 'mutopia', mid('toccata.mid', 'full'))
song('passacaglia', 'Passacaglia in G minor, HWV 432', 'Passacaglia en sol menor, HWV 432', 'George Frideric Handel', 'expert', 'passacaglia.mid', 'cellist', mid('passacaglia.mid', 'full'), max_tiles=520)
song('k545-allegro', 'Sonata K. 545, 1st movement (complete)', 'Sonata K. 545, 1.er movimiento (completo)', 'Wolfgang Amadeus Mozart', 'expert', 'k545_1.mid', 'mutopia', mid('k545_1.mid', 'full'), max_tiles=2000)

out = []
for s in S:
    tiles, bpm = s['fn']()
    kw = s['kw']
    ev, bpm = finish(tiles, bpm, s['diff'], kw.get('start', 0), kw.get('end'), kw.get('transpose', 0), kw.get('max_tiles'))
    meta = META['song']
    shift = (7 * kw.get('transpose', 0)) % 12      # semitones -> steps around the circle of fifths
    if shift > 6: shift -= 12
    ks = meta['ks'] + shift
    if ks > 7: ks -= 12
    if ks < -7: ks += 12
    out.append({'id': s['id'], 'title': s['title'], 'titleEs': s['titleEs'], 'composer': s['composer'], 'diff': s['diff'],
                'bpm': bpm, 'src': s['src'], 'credit': s['credit'], 'ts': meta['ts'], 'ks': max(-7, min(7, ks)), 'bar0': meta['bar0'],
                'ev': ev})
    print('%-22s %-9s tiles=%4d bpm=%6.1f first=%s' % (s['id'], s['diff'], len(ev), bpm, [e[2] for e in ev[:10]]))
with open(os.path.join(ROOT, 'js', 'songs.js'), 'w', encoding='utf-8') as f:
    f.write('/* Generated by tools/build_songs.py from music/sources — do not edit by hand. See CREDITS.md. */\n')
    f.write('window.PIANO_SONGS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(out), 'songs')
