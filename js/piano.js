/* Piano Challenge — falling piano tiles played with the keyboard (real Salamander Grand Piano samples) */
'use strict';

// ---------- piano sound ----------
const PianoAudio = (() => {
  const SAMPLE_NAMES = ['C', 'Ds', 'Fs', 'A'];
  let ac = null, master = null;
  const buffers = {}, loading = {};
  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function setVolume(v) { ctx(); if (master) master.gain.value = Math.max(0, Math.min(1, v)) * 0.9; }
  // nearest recorded sample (every 3 semitones from C2 to C7)
  function sampleFor(midi) {
    const m = Math.max(36, Math.min(96, midi));
    const k = Math.round((m - 36) / 3);
    const sm = 36 + k * 3;
    const name = SAMPLE_NAMES[(sm % 12) / 3] + (Math.floor(sm / 12) - 1);
    return { name, rate: Math.pow(2, (midi - sm) / 12) };
  }
  function load(name) {
    if (buffers[name]) return Promise.resolve(buffers[name]);
    if (!loading[name]) {
      const a = ctx();
      loading[name] = fetch('audio/piano/' + name + '.mp3')
        .then(r => { if (!r.ok) throw new Error('sample'); return r.arrayBuffer(); })
        .then(b => new Promise((res, rej) => a.decodeAudioData(b, res, rej)))
        .then(buf => { buffers[name] = buf; return buf; })
        .catch(() => { loading[name] = null; return null; });
    }
    return loading[name];
  }
  // load only the samples a song needs
  function preload(pitches) {
    const names = new Set([...pitches].map(p => sampleFor(p).name));
    names.add('C3'); names.add('Ds3');
    return Promise.all([...names].map(load));
  }
  function play(midi, dur = 0.6, vel = 0.8) {
    const a = ctx(); if (!a) return;
    const { name, rate } = sampleFor(midi);
    const t = a.currentTime;
    const g = a.createGain();
    g.connect(master);
    const buf = buffers[name];
    if (buf) {
      const src = a.createBufferSource();
      src.buffer = buf; src.playbackRate.value = rate;
      src.connect(g);
      const len = Math.max(0.25, Math.min(2.6, dur));
      g.gain.setValueAtTime(vel, t);
      g.gain.setValueAtTime(vel, t + len);
      g.gain.exponentialRampToValueAtTime(0.001, t + len + 0.35);
      src.start(t); src.stop(t + len + 0.4);
    } else {
      // fallback when samples cannot load (e.g. opened as a local file)
      const o = a.createOscillator();
      o.type = 'triangle'; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      o.connect(g);
      g.gain.setValueAtTime(vel * 0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + Math.min(1.5, dur + 0.3));
      o.start(t); o.stop(t + 1.6);
    }
  }
  function chord(pitches, dur) {
    const v = pitches.length > 3 ? 0.55 : 0.75;
    pitches.forEach((p, i) => play(p, dur, i === 0 ? v + 0.1 : v * 0.8));
  }
  function wrong() { play(40, 0.18, 0.7); play(41, 0.18, 0.7); play(46, 0.18, 0.5); }
  // applause: many short noise bursts through a band-pass filter, fading out
  function clap(sec = 2.4) {
    const a = ctx(); if (!a) return;
    const len = Math.floor(a.sampleRate * 0.035);
    const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.8; bp.connect(master);
    const t0 = a.currentTime;
    for (let i = 0; i < sec * 50; i++) {
      const tt = Math.random() * sec, s = a.createBufferSource(), g = a.createGain();
      s.buffer = buf; s.playbackRate.value = 0.75 + Math.random() * 0.6;
      g.gain.value = (0.3 + Math.random() * 0.4) * Math.min(1, (1 - tt / sec) * 1.8 + 0.08);
      s.connect(g); g.connect(bp); s.start(t0 + tt);
    }
  }
  return { ctx, setVolume, preload, play, chord, wrong, clap, sampleFor };
})();

// ---------- the mode ----------

// ---------- Piano Xpert: Play mode (tap the tiles) and Learn mode (letter keys) ----------
const Piano = (() => {
  const $ = id => document.getElementById(id);
  const DIFFS = ['beginner', 'easy', 'medium', 'hard', 'expert'];
  const KEYS = { beginner: ['d', 'f', 'j', 'k'], easy: ['d', 'f', 'j', 'k'], medium: ['s', 'd', 'f', 'j', 'k', 'l'],
    hard: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], expert: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'] };   // Learn mode lanes (Play mode always uses 4)
  const PHONE_KEYS = ['d', 'f', 'j', 'k'];
  const PLAY_LANES = 4;
  const PER_LEVEL = 3;          // Play mode: three songs per level
  const STARS_PER_LEVEL = 5;    // stars needed to open each next level
  const LAP_SPEEDUP = 1.15;     // Play mode: every completed round is 15% faster
  const DIFF_HUE = { beginner: 198, easy: 204, medium: 210, hard: 216, expert: 222 };   // blues only
  const ROW_SPEED = { beginner: 1.9, easy: 2.1, medium: 2.3, hard: 2.5, expert: 2.7 };   // Play mode: tile rows per second in round 1
  const CONFETTI = ['#ffffff', '#8fd3ff', '#4aa3ff', '#1565c0'];
  let U = null, P = null, raf = 0, canvas, cx, mode = 'play';

  function songs() { return window.PIANO_SONGS || []; }
  const title = s => U.lang() === 'es' ? s.titleEs : s.title;
  // each mode keeps its own progress
  function data(profile) {
    const pd = profile.piano = profile.piano || {};
    if (pd.songs && !pd.learn) { pd.learn = { songs: pd.songs }; delete pd.songs; }   // older saves = Learn mode
    pd.learn = pd.learn || { songs: {} };
    pd.play = pd.play || { songs: {} };
    pd.plays = pd.plays || 0; pd.notes = pd.notes || 0; pd.best = pd.best || 0;
    return pd;
  }
  const modeData = (profile, m) => data(profile)[m || mode];
  function keysFor(diff, phone) { const k = KEYS[diff]; return phone && k.length > 4 ? PHONE_KEYS : k; }
  const diffName = d => t('pd_' + d);

  // ---------- Learn mode unlocks: in order, finished songs stay open ----------
  function learnOpen(profile, i) {
    const d = modeData(profile, 'learn').songs, list = songs();
    return i === 0 || !!(d[list[i - 1].id] && d[list[i - 1].id].done) || !!(d[list[i].id] && d[list[i].id].done);
  }
  // ---------- Play mode: levels of three songs, opened with stars ----------
  function playStars(profile) {
    return Object.values(modeData(profile, 'play').songs).reduce((a, r) => a + Math.min(3, r.stars || 0), 0);
  }
  const levelNeed = k => k * STARS_PER_LEVEL;

  // ---------- Piano Xpert home: choose Play or Learn ----------
  function openHome() {
    const profile = U.profile(); if (!profile) return;
    data(profile);
    U.show('scr-piano-home'); U.applyStatic();
    $('ph-coins').textContent = profile.coins;
  }
  function openMenu(m) {
    if (m) mode = m;
    const profile = U.profile(); if (!profile) return;
    U.show('scr-piano-menu'); U.applyStatic();
    $('pm-title').textContent = mode === 'play' ? '▶ ' + t('playMode') : '⌨ ' + t('learnMode');
    $('pm-coins').textContent = profile.coins;
    const body = $('pm-body'); body.innerHTML = '';
    body.classList.toggle('play-list', mode === 'play');
    if (mode === 'play') playList(profile, body); else learnList(profile, body);
    const next = body.querySelector('.pm-song.next');
    if (next) requestAnimationFrame(() => next.scrollIntoView({ block: 'center' }));
  }
  function songCard(s, i, r, locked, extraCls, hue, onclick) {
    const stars = Math.min(3, r.stars || 0), crowns = Math.max(0, (r.stars || 0) - 3);
    const card = U.h('button', { class: 'pm-song' + (locked ? ' locked' : '') + (r.done || stars ? ' done' : '') + (extraCls || ''),
      style: locked ? '' : `--h:${hue}` },
      U.h('span', { class: 'pm-note' }, locked ? '🔒' : '♪'),
      U.h('span', { class: 'pm-text' }, U.h('b', {}, title(s)), U.h('small', {}, s.composer)),
      U.h('span', { class: 'pm-right' },
        U.h('span', { class: 'pm-stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars) + (crowns ? ' 👑' + crowns : '')),
        r.top ? U.h('small', { class: 'pm-best' }, t('bestScore') + ' ' + r.top) : ''));
    card.addEventListener('click', onclick);
    return card;
  }
  function playList(profile, body) {
    const list = songs(), d = modeData(profile, 'play').songs, have = playStars(profile);
    body.append(U.h('div', { class: 'pm-banner' }, U.h('b', {}, '★ ' + have), U.h('span', {}, t('playIntro'))));
    let nextMarked = false;
    for (let k = 0; k * PER_LEVEL < list.length; k++) {
      const open = have >= levelNeed(k);
      const hue = 198 + (k % 5) * 6;
      body.append(U.h('div', { class: 'pm-level' + (open ? '' : ' locked'), style: `--h:${hue}` },
        U.h('b', {}, t('levelN', k + 1)),
        open ? '' : U.h('span', {}, '🔒 ' + t('needStars', levelNeed(k)))));
      list.slice(k * PER_LEVEL, (k + 1) * PER_LEVEL).forEach((s, j) => {
        const i = k * PER_LEVEL + j, r = d[s.id] || {};
        let cls = '';
        if (open && !r.stars && !nextMarked) { cls = ' next'; nextMarked = true; }
        body.append(songCard(s, i, r, !open, cls, hue + j * 2, () => {
          if (!open) { Sound.play('nope'); U.toast(t('needStarsToast', levelNeed(k) - have)); return; }
          songIntro(i);
        }));
      });
    }
  }
  function learnList(profile, body) {
    const list = songs(), d = modeData(profile, 'learn').songs, phone = U.isPhone();
    body.append(U.h('div', { class: 'pm-banner' }, U.h('span', {}, t('learnIntro'))));
    let nextMarked = false;
    DIFFS.forEach(diff => {
      const group = list.map((s, i) => ({ s, i })).filter(x => x.s.diff === diff);
      if (!group.length) return;
      body.append(U.h('div', { class: 'pm-level', style: `--h:${DIFF_HUE[diff]}` },
        U.h('b', {}, diffName(diff)),
        U.h('span', { class: 'pm-keys' }, keysFor(diff, phone).map(k => U.h('span', { class: 'pm-key' }, k.toUpperCase())))));
      group.forEach(({ s, i }, j) => {
        const r = d[s.id] || {};
        const locked = !learnOpen(profile, i);
        let cls = '';
        if (!locked && !r.done && !nextMarked) { cls = ' next'; nextMarked = true; }
        body.append(songCard(s, i, r, locked, cls, DIFF_HUE[diff] + (j % 3) * 2, () => {
          if (locked) { Sound.play('nope'); U.toast(t('pianoLocked')); return; }
          songIntro(i);
        }));
      });
    });
  }
  function songIntro(i) {
    const s = songs()[i], profile = U.profile();
    const play = mode === 'play';
    const keys = keysFor(s.diff, U.isPhone());
    const practice = !play && profile.settings.mode === 'practice';
    const sheetBox = U.h('div', { class: 'sheet-box hidden' });
    const sheetBtn = U.h('button', { class: 'btn btn-ghost sheet-btn', onclick: () => {
      if (!sheetBox.firstChild) sheetBox.append(sheetMusic(s));
      sheetBox.classList.toggle('hidden');
      sheetBtn.textContent = '🎼 ' + (sheetBox.classList.contains('hidden') ? t('showSheet') : t('hideSheet'));
    } }, '🎼 ' + t('showSheet'));
    const box = U.openModal(
      U.h('h2', {}, '🎹 ' + title(s)),
      U.h('p', { class: 'center' }, s.composer),
      U.h('p', { class: 'center small' }, diffName(s.diff)),
      play ? U.h('p', { class: 'center' }, '👆 ' + t('playHow'))
        : U.h('div', { class: 'intro-keys' }, keys.map(k => U.h('div', { class: 'kcap', style: 'background:#fff' }, k.toUpperCase()))),
      U.h('p', { class: 'center small' }, t('pianoHow')),
      U.h('p', { class: 'center' }, U.h('b', {}, play ? t('playRule') : practice ? t('pianoPracticeRule') : t('pianoChallengeRule'))),
      U.h('div', { class: 'row-btns' },
        U.h('button', { class: 'btn btn-ghost', onclick: U.closeModal }, t('back')),
        U.h('button', { class: 'btn btn-gold', onclick: () => { U.closeModal(); start(i); } }, t('start') + ' ▶')),
      U.h('div', { class: 'center' }, sheetBtn),
      sheetBox);
    box.classList.add('wide');
  }

  // ---------- sheet music (simplified score drawn from the song's notes) ----------
  const SHARP_SP = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
  const FLAT_SP = [[0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0], [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0]];
  function sheetMusic(s) {
    const ks = s.ks || 0, ts = s.ts || [4, 4], bar = ts[0] * 4 / ts[1], bar0 = s.bar0 || 0;
    const keyAcc = [0, 0, 0, 0, 0, 0, 0];
    [3, 0, 4, 1, 5, 2, 6].slice(0, Math.max(0, ks)).forEach(l => { keyAcc[l] = 1; });
    [6, 2, 5, 1, 4, 0, 3].slice(0, Math.max(0, -ks)).forEach(l => { keyAcc[l] = -1; });
    const spell = m => { const [l, a] = (ks >= 0 ? SHARP_SP : FLAT_SP)[((m % 12) + 12) % 12]; return { d: (Math.floor(m / 12) - 1) * 7 + l, l, a }; };
    const gaps = []; for (let k = 1; k < s.ev.length; k++) { const g = s.ev[k][0] - s.ev[k - 1][0]; if (g > 0) gaps.push(g); }
    gaps.sort((a, b) => a - b);
    const med = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 1;
    const W = 760, x0 = 58 + Math.abs(ks) * 9 + 22;
    let ppb = Math.max(20, Math.min(64, 22 / med));
    let mw = bar * ppb + 14;
    if (mw > W - x0 - 10) { ppb = (W - x0 - 24) / bar; mw = bar * ppb + 14; }
    const perSys = Math.max(1, Math.floor((W - x0 - 10) / mw));
    const lastM = Math.floor((s.ev[s.ev.length - 1][0] + bar0) / bar);
    const systems = Math.ceil((lastM + 1) / perSys), SH = 190;
    const out = [];
    const sym = (x, y, ch, size, anchor) => out.push(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor || 'middle'}" class="sm">${ch}</text>`);
    const line = (x1, y1, x2, y2, w) => out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w || 1.2}"/>`);
    for (let sy = 0; sy < systems; sy++) {
      const top = 26 + sy * SH, tT = top + 10, bT = top + 90;   // treble & bass top lines
      for (let k = 0; k < 5; k++) { line(10, tT + k * 8, W - 10, tT + k * 8); line(10, bT + k * 8, W - 10, bT + k * 8); }
      line(10, tT, 10, bT + 32, 1.6); line(W - 10, tT, W - 10, bT + 32, 1.4);
      sym(26, tT + 30, '𝄞', 40); sym(25, bT + 25, '𝄢', 30);
      // key signature
      const tPos = { 1: [38, 35, 39, 36, 33, 37, 34], '-1': [34, 37, 33, 36, 32, 35, 31] };
      const bPos = { 1: [24, 21, 25, 22, 19, 23, 20], '-1': [20, 23, 19, 22, 18, 21, 17] };
      for (let k = 0; k < Math.abs(ks); k++) {
        const g = ks > 0 ? '♯' : '♭', sg = ks > 0 ? 1 : -1;
        sym(48 + k * 9, tT + (38 - tPos[sg][k]) * 4 + 4, g, 15); sym(48 + k * 9, bT + (26 - bPos[sg][k]) * 4 + 4, g, 15);
      }
      if (sy === 0) { [tT, bT].forEach(y => { sym(x0 - 12, y + 14, ts[0], 17); sym(x0 - 12, y + 30, ts[1], 17); }); }
      for (let m = 1; m <= perSys; m++) { const x = x0 + m * mw - 4; if (sy * perSys + m <= lastM + 1) line(x, tT, x, bT + 32, 1.2); }
      sym(12, top + 4, sy * perSys + 1, 10, 'start');
    }
    const shown = {};
    s.ev.forEach(e => {
      const pos = e[0] + bar0, m = Math.floor(pos / bar), sy = Math.floor(m / perSys);
      const x = x0 + (m - sy * perSys) * mw + (pos - m * bar) * ppb + 8;
      const top = 26 + sy * SH, tT = top + 10, bT = top + 90;
      const q = [4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25, 0.125].reduce((a, b) => Math.abs(b - e[1]) < Math.abs(a - e[1]) ? b : a);
      const hollow = q >= 2, dotted = q === 3 || q === 1.5 || q === 0.75, flags = q <= 0.125 ? 3 : q <= 0.25 ? 2 : q <= 0.75 ? 1 : 0;
      const groups = { t: [], b: [] };
      [...new Set(e.slice(2))].forEach(p => groups[p >= 60 ? 't' : 'b'].push(p));
      ['t', 'b'].forEach(st => {
        const ps = groups[st]; if (!ps.length) return;
        const T = st === 't' ? tT : bT, topD = st === 't' ? 38 : 26, botD = topD - 8, mid = topD - 4;
        const ys = [];
        ps.forEach(p => {
          const sp = spell(p), y = T + (topD - sp.d) * 4;
          ys.push(y);
          for (let L = botD - 2; L >= sp.d; L -= 2) if (L % 2 === botD % 2) line(x - 7, T + (topD - L) * 4, x + 7, T + (topD - L) * 4);
          for (let L = topD + 2; L <= sp.d; L += 2) line(x - 7, T + (topD - L) * 4, x + 7, T + (topD - L) * 4);
          const key = m + ':' + sp.d, want = sp.a;
          const cur = key in shown ? shown[key] : keyAcc[sp.l];
          if (want !== cur) { sym(x - 11, y + 4, want === 1 ? '♯' : want === -1 ? '♭' : '♮', 13); shown[key] = want; }
          out.push(`<ellipse cx="${x}" cy="${y}" rx="5" ry="3.8" transform="rotate(-20 ${x} ${y})" class="${hollow ? 'nh hollow' : 'nh'}"/>`);
          if (dotted) out.push(`<circle cx="${x + 9}" cy="${y - 1}" r="1.6" class="nh"/>`);
        });
        if (q < 4) {
          const up = (Math.min(...ys) + Math.max(...ys)) / 2 > T + (topD - mid) * 4;
          const sx = up ? x + 4.6 : x - 4.6, y1 = up ? Math.max(...ys) : Math.min(...ys), y2 = up ? Math.min(...ys) - 28 : Math.max(...ys) + 28;
          line(sx, y1, sx, y2, 1.3);
          for (let f = 0; f < flags; f++) { const fy = y2 + (up ? 1 : -1) * f * 6; out.push(`<path d="M${sx} ${fy} q 8 ${up ? 6 : -6} 6 ${up ? 14 : -14}" class="flag"/>`); }
        }
      });
    });
    const H = systems * SH + 20;
    const wrap = U.h('div', { class: 'sheet' });
    wrap.innerHTML = `<p class="sheet-note">${t('sheetNote')}</p><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${t('showSheet')}"><g stroke="#1e2536" fill="#1e2536">${out.join('')}</g></svg>`;
    return wrap;
  }

  // ---------- columns follow the melody's shape ----------
  function assignColumns(ev, n) {
    const cols = [];
    let prevP = null, prevC = Math.floor((n - 1) / 2);
    for (let i = 0; i < ev.length; i++) {
      const p = ev[i][2];
      let lo = Infinity, hi = -Infinity;
      for (let j = Math.max(0, i - 6); j <= Math.min(ev.length - 1, i + 6); j++) { lo = Math.min(lo, ev[j][2]); hi = Math.max(hi, ev[j][2]); }
      let c = hi > lo ? Math.round((p - lo) / (hi - lo) * (n - 1)) : prevC;
      if (prevP !== null) {
        if (p > prevP && c <= prevC) c = Math.min(n - 1, prevC + 1);
        else if (p < prevP && c >= prevC) c = Math.max(0, prevC - 1);
        else if (p === prevP) c = prevC;
      }
      cols.push(c); prevP = p; prevC = c;
    }
    return cols;
  }

  // ---------- play ----------
  function start(i) {
    const profile = U.profile();
    const s = songs()[i];
    const play = mode === 'play';
    const phone = U.isPhone();
    const keys = play ? PHONE_KEYS.slice(0, PLAY_LANES) : keysFor(s.diff, phone);
    const gaps = [];
    for (let k = 1; k < s.ev.length; k++) { const g = s.ev[k][0] - s.ev[k - 1][0]; if (g > 0) gaps.push(g); }
    gaps.sort((a, b) => a - b);
    const medGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 1;
    const last = s.ev[s.ev.length - 1];
    P = {
      song: s, index: i, keys, cols: assignColumns(s.ev, keys.length), play,
      practice: !play && profile.settings.mode === 'practice', phone,
      beat: s.ev[0][0], next: 0, hits: 0, misses: 0, wrongs: 0, combo: 0, bestCombo: 0, score: 0,
      started: false, over: false, paused: false, flashes: [], pops: [], pressed: {},
      medGap, t: 0, loaded: false, lap: 0, lapLen: last[0] + Math.max(last[1], medGap) + 2, banner: null,
      notes: Array.from({ length: 22 }, (_, k) => ({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random(), c: k % 3 }))
    };
    if (play) setupRows();
    document.body.classList.toggle('phone', phone);
    U.show('scr-piano'); U.applyStatic();
    $('scr-piano').classList.toggle('tap', play);
    $('pp-title').textContent = title(s);
    buildKeyRow();
    Sound.pauseMusic(true);   // no background music while a piece plays
    PianoAudio.setVolume((profile.settings.volume == null ? 80 : profile.settings.volume) / 100);
    const pitches = new Set();
    s.ev.forEach(e => e.slice(2).forEach(p => pitches.add(p)));
    $('pp-loading').classList.remove('hidden');
    PianoAudio.preload(pitches).then(() => { if (P && P.song === s) { P.loaded = true; $('pp-loading').classList.add('hidden'); } });
    if (phone && !play) focusInput();
    resize();
    cancelAnimationFrame(raf);
    let lastT = performance.now();
    const loop = now => {
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      if (P && !P.paused) update(dt);
      if (P) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    hud();
  }
  // Play mode (music tiles): every tile is one row tall, long notes are taller hold tiles,
  // and two tiles in a row never share a lane
  function setupRows() {
    const ev = P.song.ev, n = ev.length, L = P.keys.length, c = P.cols;
    P.rowOf = []; P.rowLen = [];
    let row = 0;
    for (let i = 0; i < n; i++) {
      const gap = i + 1 < n ? ev[i + 1][0] - ev[i][0] : Math.max(ev[i][1], P.medGap);
      const ratio = gap / P.medGap;
      const len = ratio >= 1.9 ? Math.min(4, Math.max(2, Math.round(ratio / 1.5))) : 1;
      P.rowOf.push(row); P.rowLen.push(len); row += len;
    }
    P.lapRows = row;
    for (let i = 1; i < n; i++) {
      if (c[i] !== c[i - 1]) continue;
      const dir = ev[i][2] > ev[i - 1][2] ? 1 : ev[i][2] < ev[i - 1][2] ? -1 : (c[i - 1] < L / 2 ? 1 : -1);
      let nc = c[i - 1] + dir;
      if (nc < 0 || nc >= L) nc = c[i - 1] - dir;
      c[i] = nc;
    }
    // the last tile also differs from the first one of the next round
    if (n > 2 && c[n - 1] === c[0]) {
      for (const dlt of [1, -1, 2, -2, 3, -3]) { const nc = c[n - 1] + dlt; if (nc >= 0 && nc < L && nc !== c[n - 2] && nc !== c[0]) { c[n - 1] = nc; break; } }
    }
    Object.assign(P, { row: 0, lapStartK: 0, hold: null, fill: {}, roundPending: 0, celebrate: null, confetti: [] });
  }
  const rowLenK = k => P.rowLen[k % nTiles()];
  const rowStart = k => P.rowOf[k % nTiles()] + Math.floor(k / nTiles()) * P.lapRows;
  const rowSpeed = () => ROW_SPEED[P.song.diff] * Math.pow(LAP_SPEEDUP, P.lap);
  function playTap(pid) {
    if (!P || P.over || P.paused) return;
    PianoAudio.ctx();
    const k = P.next, col = tileCol(k), len = rowLenK(k), e = tileEv(k);
    P.pressed[col] = 0.15;
    P.started = true;
    PianoAudio.chord(e.slice(2), Math.min(2.5, len / rowSpeed() + 0.15));
    P.hits++; P.combo++; P.bestCombo = Math.max(P.bestCombo, P.combo);
    P.score += 1;
    P.pops.push({ col, t: 0.4, q: 1 });
    P.fill[k] = len > 1 ? 0 : 1;
    if (len > 1) P.hold = { k, pid, h0: Math.min(P.row, rowStart(k)), got: 0 };
    P.next++;
    if (P.next % nTiles() === 0) P.roundPending = 0.35;
    hud();
  }
  function release(pid) { if (P && P.hold && (pid == null || P.hold.pid === pid)) P.hold = null; }
  function playUpdate(dt) {
    P.confetti = P.confetti.filter(c => { c.vy += 0.45 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt; return c.y < 1.2; });
    if (P.celebrate) {
      // clapping break between rounds: the screen is clear, then the next round waits for START
      P.celebrate.t -= dt;
      if (P.celebrate.t <= 0) { P.celebrate = null; P.lapStartK = P.next; P.row = rowStart(P.next); P.started = false; P.fill = {}; hud(); }
      return;
    }
    if (!P.started || P.over) return;
    P.row += dt * rowSpeed();
    if (P.hold) {
      const h = P.hold, len = rowLenK(h.k), p = Math.min(1, (P.row - h.h0) / len);
      P.fill[h.k] = Math.max(P.fill[h.k] || 0, p);
      const earned = Math.floor(p * len + 1e-6);   // keep holding: +1 for every row the fill climbs
      if (earned > h.got) { P.score += earned - h.got; h.got = earned; P.pops.push({ col: tileCol(h.k), t: 0.4, q: 1, plus: true }); hud(); }
      if (p >= 1) P.hold = null;
    }
    if (P.roundPending) {
      if (!P.hold) P.roundPending -= dt;
      if (P.roundPending <= 0) {
        P.roundPending = 0; P.hold = null; P.lap++;
        P.celebrate = { t: 2.8 };
        Sound.play('star'); PianoAudio.clap();
        for (let i = 0; i < 90; i++) P.confetti.push({ x: Math.random(), y: Math.random() * 0.45, vx: (Math.random() - 0.5) * 0.3, vy: -0.1 - Math.random() * 0.35, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, c: CONFETTI[i % 4] });
        hud();
      }
      return;
    }
    if (P.row - rowStart(P.next) > 0.3) {   // a tile slid past the line: the song ends (one life)
      P.flashes.push({ k: P.next, t: 0.6 });
      P.misses++; P.combo = 0; PianoAudio.wrong();
      hud(); finish();
    }
  }
  function stop() { cancelAnimationFrame(raf); if (P) Sound.pauseMusic(false); P = null; }

  // tile k (Play mode repeats the song in faster rounds)
  const nTiles = () => P.song.ev.length;
  const tileEv = k => P.song.ev[k % nTiles()];
  const tileBeat = k => tileEv(k)[0] + Math.floor(k / nTiles()) * P.lapLen;
  const tileCol = k => P.cols[k % nTiles()];
  function speedMul() {
    if (P.play) return Math.pow(LAP_SPEEDUP, Math.floor(P.next / nTiles()));   // steady inside a round
    const prog = P.next / nTiles();
    return P.practice ? 0.85 + 0.2 * prog : 1 + 0.25 * prog;
  }
  const lives = () => P.play ? 1 : 3;   // Play mode: one mistake ends the song (music tiles); Learn mode: three lives
  function secPerBeat() {
    const bps = P.song.bpm / 60 * speedMul();
    if (P.play && P.ppb) return 1 / Math.max(bps, speedMul() * 0.62 * P.hcss / P.ppb);   // music-tiles pace: tiles keep falling quickly
    return 1 / bps;
  }

  function update(dt) {
    P.t += dt;
    P.notes.forEach(n => { n.y -= dt * 0.03 * n.s; if (n.y < -0.05) { n.y = 1.05; n.x = Math.random(); } });
    P.flashes = P.flashes.filter(f => (f.t -= dt) > 0);
    P.pops = P.pops.filter(f => (f.t -= dt) > 0);
    if (P.banner) { P.banner.t -= dt; if (P.banner.t <= 0) P.banner = null; }
    if (P.play) { playUpdate(dt); return; }
    if (!P.started || P.over) return;
    const nb = (!P.play && P.next >= nTiles()) ? Infinity : tileBeat(P.next);
    let adv = dt / secPerBeat();
    if (P.practice && P.beat + adv > nb) adv = Math.max(0, nb - P.beat);   // Learn practice: wait for the right key
    P.beat += adv;
    // a tile that slides past the line is a miss
    if (!P.practice && nb !== Infinity && (P.beat - nb) * secPerBeat() > 0.3) {
      P.flashes.push({ k: P.next, t: 0.45 });
      P.misses++; P.combo = 0; PianoAudio.wrong();
      advance();
      hud();
      if (P.misses + P.wrongs >= lives()) finish();
    }
  }
  function advance() {
    P.next++;
    if (P.next % nTiles() === 0) {
      if (P.play) {
        // round complete: a star (then crowns), and the song starts again faster
        P.lap++;
        P.banner = { text: P.lap <= 3 ? '★'.repeat(P.lap) : '👑 ' + (P.lap - 3), t: 1.6 };
        Sound.play('star');
        P.beat = Math.max(P.beat, tileBeat(P.next) - 1.5);
      } else finish();
    }
  }
  function key(ch, tapCol) {
    if (!P || P.over || P.paused) return;
    ch = (ch || '').toLowerCase();
    const col = tapCol != null ? tapCol : P.keys.indexOf(ch);
    if (col < 0 && !/^[a-z;]$/.test(ch)) return;
    PianoAudio.ctx();
    if (col >= 0) { P.pressed[col] = 0.15; pressKeyRow(col); }
    const k = P.next;
    if (!P.started) {
      // like music tiles: the first tile waits at the bottom; pressing it starts the piece
      if (col !== tileCol(0)) return;
      P.started = true; P.beat = tileBeat(0);
    }
    const e = tileEv(k);
    const early = (tileBeat(k) - P.beat) * secPerBeat();
    if (col === tileCol(k)) {
      if (!P.play && early > 1.4) return;                  // Learn mode: right key, far too early: ignored, no penalty
      PianoAudio.chord(e.slice(2), Math.min(e[1], 2) * secPerBeat());
      const err = Math.abs(early);
      const q = err < 0.09 ? 1 : err < 0.2 ? 0.8 : 0.6;
      P.hits++; P.combo++; P.bestCombo = Math.max(P.bestCombo, P.combo);
      P.score += 1;   // like music tiles: one point per tile, so scores stay small and easy to remember
      P.pops.push({ col, t: 0.4, q });
      // the music keeps its own steady speed: hitting early never pulls the tiles faster
      advance();
      hud();
    } else {
      P.wrongs++; P.combo = 0;
      PianoAudio.wrong();
      P.flashes.push({ col: col >= 0 ? col : tileCol(k), t: 0.45 });
      hud();
      if (!P.practice && P.misses + P.wrongs >= lives()) finish();
    }
  }
  // Play mode: tapping empty space (or the wrong tile) is a mistake
  function missTap(col, y) {
    if (!P || P.over || P.paused) return;
    P.wrongs++; P.combo = 0; P.hold = null;
    PianoAudio.wrong();
    P.flashes.push({ col, y, t: 0.6 });
    hud();
    if (P.misses + P.wrongs >= lives()) finish();
  }
  function accuracy() { const n = P.hits + P.misses + P.wrongs; return n ? P.hits / n * 100 : 100; }
  function finish() {
    if (P.over) return;
    P.over = true;
    const profile = U.profile(), all = data(profile), md = modeData(profile), s = P.song;
    const acc = accuracy();
    let stars, done;
    if (P.play) { stars = P.lap; done = P.lap > 0; }
    else {
      done = P.next >= nTiles();
      stars = 0;
      if (done) { stars = 1; if (acc >= 90) stars = 2; if (acc >= 97 && P.misses === 0) stars = 3; }
    }
    let coins = P.play ? Math.min(3, stars) * 15 + Math.max(0, stars - 3) * 10 + Math.floor(P.hits / 10)
      : (done ? stars * 15 + Math.floor(P.hits / 10) : Math.floor(P.hits / 20));
    if (P.practice) coins = Math.floor(coins / 2);
    const r = md.songs[s.id] || { stars: 0, best: 0, bestAcc: 0, plays: 0, done: false };
    const firstDone = done && !r.done;
    r.plays++; r.stars = Math.max(r.stars || 0, stars); r.top = Math.max(r.top || 0, P.score);   // 'top' replaces the old, much bigger 'best' scores r.bestAcc = Math.max(r.bestAcc || 0, Math.round(acc));
    if (done) r.done = true;
    md.songs[s.id] = r; all.plays++; all.notes += P.hits; all.top = Math.max(all.top || 0, P.score);
    profile.coins += coins;
    Store.save();
    Sound.play(done ? 'win' : 'lose');
    const res = { done, stars, coins, acc, firstDone };
    setTimeout(() => { if (P && P.song === s) results(res); }, 900);
  }
  function results(r) {
    const s = P.song, list = songs(), nextIdx = P.index + 1;
    const hasNext = nextIdx < list.length && (P.play ? playStars(U.profile()) >= levelNeed(Math.floor(nextIdx / PER_LEVEL)) : r.done);
    const shownStars = Math.min(3, r.stars), crowns = Math.max(0, r.stars - 3);
    U.openModal(
      U.h('h2', { class: r.done ? 'win' : 'lose' }, P.play ? (r.stars ? t('roundsDone', r.stars) : t('songOver')) : (r.done ? t('songComplete') : t('songOver'))),
      U.h('p', { class: 'center' }, title(s)),
      U.h('div', { class: 'res-stars' }, [0, 1, 2].map(i => U.h('span', { class: i < shownStars ? 'on' : '', style: `animation-delay:${0.2 + i * 0.25}s` }, '★')), crowns ? U.h('span', { class: 'on crowns' }, '👑' + crowns) : ''),
      U.h('div', { class: 'res-grid' },
        U.h('div', {}, U.h('b', {}, P.score), U.h('small', {}, t('score'))),
        U.h('div', {}, U.h('b', {}, Math.round(r.acc) + '%'), U.h('small', {}, t('accuracy'))),
        U.h('div', {}, U.h('b', {}, P.bestCombo), U.h('small', {}, t('bestCombo'))),
        U.h('div', {}, U.h('b', {}, '+' + r.coins), U.h('small', {}, t('coinsCap')))),
      P.play ? U.h('p', { class: 'goal-line' }, t('playStarsLine')) : U.h('p', { class: 'goal-line' }, `${Math.min(P.hits, nTiles())} / ${nTiles()} ${t('notesPlayed')}`),
      U.h('div', { class: 'row-btns' },
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); stop(); openMenu(); } }, t('songs')),
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); start(P.index); } }, t('retry') + ' ↻'),
        hasNext ? U.h('button', { class: 'btn btn-gold', onclick: () => { U.closeModal(); start(nextIdx); } }, t('next') + ' ▶') : ''));
    if (P.phone) $('piano-input').blur();
  }

  // ---------- drawing ----------
  function resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * d)); canvas.height = Math.max(1, Math.round(r.height * d));
  }
  function rr(x, y, w, h, r) { cx.beginPath(); if (cx.roundRect) cx.roundRect(x, y, w, h, Math.min(r, h / 2)); else cx.rect(x, y, w, h); }
  function draw() {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) return;
    const d = W / canvas.getBoundingClientRect().width || 1;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    const hue = 212;
    // creative backdrop: shifting night-sky gradient, drifting notes, soft aurora
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#05070d'); g.addColorStop(0.6, `hsl(${hue}, 55%, ${9 + Math.min(P.lap, 4) * 2}%)`); g.addColorStop(1, `hsl(${hue}, 65%, ${17 + Math.min(P.lap, 4) * 2}%)`);
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let k = 0; k < 3; k++) {
      const ay = H * (0.18 + k * 0.17) + Math.sin(P.t * 0.4 + k) * 20 * d;
      const ag = cx.createLinearGradient(0, ay - 60 * d, 0, ay + 60 * d);
      ag.addColorStop(0, 'rgba(0,0,0,0)'); ag.addColorStop(0.5, `hsla(${hue + k * 6}, 90%, 60%, 0.07)`); ag.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = ag; cx.fillRect(0, ay - 60 * d, W, 120 * d);
    }
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    P.notes.forEach(n => {
      cx.fillStyle = `hsla(${hue}, ${n.c === 1 ? 0 : 90}%, ${75 + n.c * 8}%, ${0.12 + 0.1 * n.s})`;
      cx.font = `${Math.round((14 + n.s * 14) * d)}px serif`;
      cx.fillText(n.c === 0 ? '♪' : n.c === 1 ? '♫' : '♩', n.x * W, n.y * H);
    });
    const n = P.keys.length;
    const laneW = Math.min(W / n, (P.play ? 190 : 150) * d), x0 = (W - laneW * n) / 2;
    P.lane = { x0: x0 / d, w: laneW / d };
    const hitY = H - 26 * d;
    const base = P.play ? Math.max(H / 4.2, 88 * d)                    // Play mode: big music-tiles rows
      : Math.max(54 * d, Math.min(H * 0.17, 120 * d));                  // height of a tile of median length
    const pxPerBeat = base / Math.max(P.medGap, 0.0625);
    P.ppb = pxPerBeat / d; P.hcss = H / d; P.nextRect = null;
    for (let c = 0; c < n; c++) {
      cx.fillStyle = c % 2 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.055)';
      cx.fillRect(x0 + c * laneW, 0, laneW, H);
      if (P.pressed[c] > 0) { cx.fillStyle = `hsla(${hue}, 90%, 70%, 0.14)`; cx.fillRect(x0 + c * laneW, 0, laneW, H); P.pressed[c] -= 1 / 60; }
    }
    cx.strokeStyle = 'rgba(255,255,255,0.1)'; cx.lineWidth = 1 * d;
    for (let c = 1; c < n; c++) { cx.beginPath(); cx.moveTo(x0 + c * laneW, 0); cx.lineTo(x0 + c * laneW, H); cx.stroke(); }
    // hit line
    cx.strokeStyle = '#8fd3ff'; cx.lineWidth = 3 * d; cx.shadowColor = cx.strokeStyle; cx.shadowBlur = 14 * d;
    cx.beginPath(); cx.moveTo(x0, hitY); cx.lineTo(x0 + laneW * n, hitY); cx.stroke();
    cx.shadowBlur = 0;
    // tiles: each tile is as tall as the time until the next note, so tiles never overlap
    const font = `700 ${Math.round(Math.min(laneW, base) * 0.34)}px Fredoka, system-ui, sans-serif`;
    if (P.play) drawRows(W, H, d, x0, laneW, hitY, base);
    for (let k = P.next; !P.play && k < nTiles(); k++) {
      const yb = hitY - (tileBeat(k) - P.beat) * pxPerBeat;      // bottom of the tile
      if (yb < -10) break;
      const nextB = (P.play || k + 1 < nTiles()) ? tileBeat(k + 1) : tileBeat(k) + tileEv(k)[1];
      const h = Math.max(16 * d, Math.min(base * 2.4, (nextB - tileBeat(k)) * pxPerBeat - 4 * d));
      const c = tileCol(k), x = x0 + c * laneW + 4 * d, w = laneW - 8 * d;
      const isNext = k === P.next;
      if (isNext) P.nextRect = { x: x / d, y: (yb - h) / d, w: w / d, h: h / d };
      const lh = hue;
      if (isNext) { cx.shadowColor = `hsl(${lh}, 100%, 70%)`; cx.shadowBlur = 24 * d; }
      rr(x, yb - h, w, h, 12 * d);
      const tg = cx.createLinearGradient(0, yb - h, 0, yb);
      if (P.play) { tg.addColorStop(0, isNext ? '#4aa3ff' : '#1c2433'); tg.addColorStop(1, isNext ? '#1565c0' : '#05070d'); }
      else { tg.addColorStop(0, isNext ? '#ffffff' : '#e9eefb'); tg.addColorStop(1, isNext ? '#c9f3ff' : '#c7d0e6'); }
      cx.fillStyle = tg; cx.fill();
      cx.shadowBlur = 0;
      cx.lineWidth = 3 * d; cx.strokeStyle = isNext ? '#ffffff' : (P.play ? 'rgba(143,211,255,0.55)' : '#1e2536'); cx.stroke();
      if (tileEv(k).length > 3 && h > 26 * d) { cx.fillStyle = 'rgba(255,255,255,0.45)'; rr(x + 8 * d, yb - 12 * d, w - 16 * d, 5 * d, 3 * d); cx.fill(); }
      if (h > 22 * d) {
        cx.fillStyle = P.play ? '#ffffff' : '#1e2536'; cx.font = font;
        const label = !P.started && k === 0 ? (P.play ? t('tapStart') : P.keys[c].toUpperCase() + ' ▶') : (P.play ? '' : P.keys[c].toUpperCase());
        if (label) cx.fillText(label, x + w / 2, yb - Math.min(h, base) / 2);
      }
    }
    // hit pops & red flashes
    P.pops.forEach(p => {
      const a = p.t / 0.4, x = x0 + p.col * laneW + laneW / 2;
      if (p.plus) {
        cx.globalAlpha = a; cx.fillStyle = '#8fd3ff'; cx.font = `700 ${Math.round(26 * d)}px Fredoka, system-ui, sans-serif`;
        cx.fillText('+1', x, hitY - base * 0.6 - (1 - a) * 50 * d); cx.globalAlpha = 1;
        return;
      }
      cx.globalAlpha = a; cx.strokeStyle = p.q === 1 ? '#8fd3ff' : '#ffffff'; cx.lineWidth = 4 * d;
      cx.beginPath(); cx.arc(x, hitY - base / 2, laneW * 0.2 + (1 - a) * laneW * 0.4, 0, Math.PI * 2); cx.stroke();
      cx.globalAlpha = 1;
    });
    P.flashes.forEach(f => {
      const col = f.k != null ? tileCol(f.k) : f.col;
      cx.globalAlpha = Math.min(1, f.t / 0.2); cx.fillStyle = '#ff4d5e';
      if (P.play && f.k != null) { const fy = hitY - (rowStart(f.k) - P.row) * base, fh = rowLenK(f.k) * base - 3 * d; rr(x0 + col * laneW + 2 * d, fy - fh, laneW - 4 * d, fh, 10 * d); }
      else if (P.play) rr(x0 + col * laneW + 2 * d, f.y - base / 2, laneW - 4 * d, base - 3 * d, 10 * d);
      else rr(x0 + col * laneW + 4 * d, hitY - base, laneW - 8 * d, base - 4 * d, 12 * d);
      cx.fill();
      cx.globalAlpha = 1;
    });
    if (P.banner) {
      cx.globalAlpha = Math.min(1, P.banner.t);
      cx.fillStyle = '#8fd3ff'; cx.font = `700 ${Math.round(46 * d)}px Fredoka, system-ui, sans-serif`;
      cx.fillText(P.banner.text, W / 2, H * 0.35);
      cx.font = `600 ${Math.round(18 * d)}px Fredoka, system-ui, sans-serif`; cx.fillStyle = '#fff';
      cx.fillText(t('fasterNow'), W / 2, H * 0.35 + 40 * d);
      cx.globalAlpha = 1;
    }
    if (P.play) drawCelebration(W, H, d);
    if (!P.loaded && !P.started) {
      cx.fillStyle = 'rgba(30,37,54,0.85)'; const bw = Math.min(W - 20 * d, 300 * d);
      rr(W / 2 - bw / 2, H * 0.3, bw, 44 * d, 22 * d); cx.fill();
      cx.fillStyle = '#fff'; cx.font = `600 ${Math.round(17 * d)}px Fredoka, system-ui, sans-serif`;
      cx.fillText(t('loadingPiano'), W / 2, H * 0.3 + 22 * d);
    }
  }
  // Play mode tiles: one row each, long notes are tall hold tiles that fill up while held
  function drawRows(W, H, d, x0, laneW, hitY, T) {
    P.doneRects = [];
    const font = `700 ${Math.round(Math.min(laneW * 0.21, T * 0.3))}px Fredoka, system-ui, sans-serif`;
    if (P.celebrate) return;
    const end = P.lapStartK + nTiles();
    for (let k = Math.max(P.lapStartK, P.next - 6); k < end; k++) {
      const len = rowLenK(k), yb = hitY - (rowStart(k) - P.row) * T, h = len * T - 3 * d;
      if (yb - h > H) continue;
      if (yb < -10 * d) break;
      const c = tileCol(k), x = x0 + c * laneW + 2 * d, w = laneW - 4 * d, top = yb - h;
      const done = k < P.next, isNext = k === P.next, fill = P.fill[k] || 0;
      if (isNext) P.nextRect = { x: x / d, y: top / d, w: w / d, h: h / d };
      if (done) P.doneRects.push({ x: x / d, y: top / d, w: w / d, h: h / d });
      if (isNext) { cx.shadowColor = '#4aa3ff'; cx.shadowBlur = 24 * d; }
      rr(x, top, w, h, 10 * d);
      const tg = cx.createLinearGradient(0, top, 0, yb);
      if (done && len === 1) { tg.addColorStop(0, 'rgba(143,211,255,0.16)'); tg.addColorStop(1, 'rgba(143,211,255,0.06)'); }
      else { tg.addColorStop(0, isNext ? '#2f86e6' : '#141b28'); tg.addColorStop(1, isNext ? '#0d47a1' : '#05070d'); }
      cx.fillStyle = tg; cx.fill(); cx.shadowBlur = 0;
      cx.lineWidth = 2.5 * d; cx.strokeStyle = isNext ? '#ffffff' : 'rgba(143,211,255,0.45)'; cx.stroke();
      if (len > 1) {
        // hold tile: a guide line and a dot; the fill climbs from the bottom while held
        cx.fillStyle = 'rgba(143,211,255,0.5)'; cx.fillRect(x + w / 2 - 2 * d, top + 14 * d, 4 * d, h - 40 * d);
        if (fill > 0) {
          const fh = (h - 4 * d) * fill;
          cx.save(); rr(x + 2 * d, yb - 2 * d - fh, w - 4 * d, fh, 8 * d); cx.clip();
          const fg = cx.createLinearGradient(0, yb - fh, 0, yb);
          fg.addColorStop(0, '#ffffff'); fg.addColorStop(1, '#8fd3ff');
          cx.fillStyle = fg; cx.fillRect(x, yb - fh - 2 * d, w, fh + 2 * d); cx.restore();
        }
        cx.fillStyle = fill > 0 ? '#1565c0' : '#ffffff';
        cx.beginPath(); cx.arc(x + w / 2, yb - 22 * d, 10 * d, 0, Math.PI * 2); cx.fill();
      }
      if (isNext) {
        const label = !P.started ? t('tapStart') : len > 1 ? t('holdTile') : '';
        if (label) {
          cx.fillStyle = '#ffffff'; cx.font = font;
          cx.fillText(label, x + w / 2, len > 1 && P.started ? yb - T * 0.55 : yb - T / 2);
        }
      }
    }
    if (!P.started && P.lap > 0 && !P.over) {
      cx.fillStyle = '#ffffff'; cx.font = `700 ${Math.round(24 * d)}px Fredoka, system-ui, sans-serif`;
      cx.fillText(t('roundNext', P.lap + 1), W / 2, H * 0.22);
    }
  }
  function drawCelebration(W, H, d) {
    P.confetti.forEach(c => {
      cx.save(); cx.translate(c.x * W, c.y * H); cx.rotate(c.rot);
      cx.fillStyle = c.c; cx.fillRect(-5 * d, -3 * d, 10 * d, 6 * d); cx.restore();
    });
    if (!P.celebrate) return;
    const a = Math.min(1, P.celebrate.t / 0.4), bob = Math.sin(P.t * 14) * 6 * d;
    cx.globalAlpha = a;
    cx.fillStyle = '#ffffff'; cx.font = `${Math.round(72 * d)}px serif`;
    cx.fillText('👏', W / 2, H * 0.3 + bob);
    cx.fillStyle = '#ffffff'; cx.font = `700 ${Math.round(28 * d)}px Fredoka, system-ui, sans-serif`;
    cx.fillText(t('roundClap', P.lap), W / 2, H * 0.3 + 70 * d);
    cx.fillStyle = '#8fd3ff'; cx.font = `700 ${Math.round(36 * d)}px Fredoka, system-ui, sans-serif`;
    cx.fillText(P.lap <= 3 ? '★'.repeat(P.lap) : '👑 ' + (P.lap - 3), W / 2, H * 0.3 + 115 * d);
    cx.fillStyle = '#ffffff'; cx.font = `600 ${Math.round(20 * d)}px Fredoka, system-ui, sans-serif`;
    cx.fillText(t('fasterNow'), W / 2, H * 0.3 + 155 * d);
    cx.globalAlpha = 1;
  }
  function buildKeyRow() {
    const row = $('pp-keys'); row.innerHTML = '';
    P.keys.forEach((k, c) => row.append(U.h('div', { class: 'pp-key', 'data-c': c }, k.toUpperCase())));
  }
  function pressKeyRow(c) {
    const el = document.querySelector(`#pp-keys .pp-key[data-c="${c}"]`);
    if (el) { el.classList.remove('down'); void el.offsetWidth; el.classList.add('down'); }
  }
  function hud() {
    if (!P) return;
    $('pp-score').textContent = P.score;
    $('pp-combo').textContent = P.combo > 1 ? 'x' + P.combo : '';
    const L = lives(), lost = Math.min(L, P.misses + P.wrongs);
    $('pp-lives').textContent = P.practice ? t('practice') : '♥'.repeat(L - lost) + '♡'.repeat(lost);
    $('pp-progress').style.width = ((P.play && (P.roundPending || P.celebrate) ? 1 : (P.next % nTiles()) / nTiles()) * 100) + '%';
    $('pp-laps').textContent = P.play ? '★'.repeat(Math.min(3, P.lap)) + '☆'.repeat(Math.max(0, 3 - P.lap)) + (P.lap > 3 ? ' 👑' + (P.lap - 3) : '') : '';
    const nk = tileCol(P.next);
    document.querySelectorAll('#pp-keys .pp-key').forEach(el => el.classList.toggle('next', +el.dataset.c === nk));
  }
  function focusInput() { const i = $('piano-input'); i.value = ''; try { i.focus({ preventScroll: true }); } catch (e) { i.focus(); } }
  function pause() {
    if (!P || P.over) return;
    P.paused = true; if (P.play) release();
    U.openModal(U.h('h2', {}, t('paused')),
      U.h('div', { class: 'row-btns', style: 'justify-content:center' },
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); stop(); openMenu(); } }, t('songs')),
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); start(P.index); } }, t('restart')),
        U.h('button', { class: 'btn btn-gold', onclick: () => { U.closeModal(); P.paused = false; if (P.phone && !P.play) focusInput(); } }, t('resume') + ' ▶')));
  }

  function init(helpers) {
    U = helpers;
    canvas = $('piano-canvas'); cx = canvas.getContext('2d');
    document.addEventListener('keydown', e => {
      if (U.screen() !== 'scr-piano' || e.target === $('piano-input')) return;
      if (!$('modal').classList.contains('hidden')) return;
      if (e.key === 'Escape') { pause(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.key.length === 1 && P && !P.play) { e.preventDefault(); key(e.key); }
    });
    const inp = $('piano-input');
    inp.addEventListener('input', () => { const v = inp.value; inp.value = ''; if ($('modal').classList.contains('hidden')) for (const ch of v) key(ch); });
    $('pp-stage').addEventListener('pointerdown', e => {
      if (!P || e.target.closest('button')) return;
      if (P.play) {
        e.preventDefault();
        if (!$('modal').classList.contains('hidden') || !P.lane) return;
        const r = canvas.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top, R = P.nextRect, pad = 8;
        const inR = R => R && px >= R.x - pad && px <= R.x + R.w + pad && py >= R.y - pad && py <= R.y + R.h + pad;
        if (P.over || P.celebrate || P.roundPending) return;     // between rounds taps do nothing
        if (inR(R)) { playTap(e.pointerId); return; }
        if (!P.started) return;                                   // only the START tile starts the round
        if ((P.doneRects || []).some(inR)) return;                // tiles already played are safe to touch
        const c = Math.floor((px - P.lane.x0) / P.lane.w);
        missTap(c >= 0 && c < P.keys.length ? c : tileCol(P.next), py * (canvas.width / r.width));
        return;
      }
      if (P.phone) focusInput();
    });
    ['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, e => release(e.pointerId)));
    $('btn-pp-pause').addEventListener('click', pause);
    $('btn-pm-back').addEventListener('click', openHome);
    $('btn-ph-back').addEventListener('click', () => U.back());
    $('btn-ph-play').addEventListener('click', () => openMenu('play'));
    $('btn-ph-learn').addEventListener('click', () => openMenu('learn'));
    window.addEventListener('resize', () => { if (U.screen() === 'scr-piano') resize(); });
  }
  return { init, openHome, openMenu, stop, resize, data, songs, sheetMusic, playStars, state: () => P };
})();
