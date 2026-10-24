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
  return { ctx, setVolume, preload, play, chord, wrong, sampleFor };
})();

// ---------- the mode ----------
const Piano = (() => {
  const $ = id => document.getElementById(id);
  const DIFFS = ['beginner', 'easy', 'medium', 'hard', 'expert'];
  const KEYS = { beginner: ['f', 'j'], easy: ['d', 'f', 'j', 'k'], medium: ['s', 'd', 'f', 'j', 'k', 'l'],
    hard: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], expert: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'] };
  const PHONE_KEYS = ['d', 'f', 'j', 'k'];
  let U = null;            // helpers from UI
  let P = null;            // the running song state
  let raf = 0, canvas, cx;

  function songs() { return window.PIANO_SONGS || []; }
  function data(profile) {
    profile.piano = profile.piano || { songs: {}, plays: 0, notes: 0, best: 0 };
    return profile.piano;
  }
  function unlockedIdx(profile) {
    const d = data(profile), list = songs();
    let i = 0;
    while (i < list.length - 1 && d.songs[list[i].id] && d.songs[list[i].id].done) i++;
    return i;
  }
  function isOpen(profile, i) {
    const d = data(profile).songs, list = songs();
    return i === 0 || !!(d[list[i - 1].id] && d[list[i - 1].id].done) || !!(d[list[i].id] && d[list[i].id].done);
  }
  function keysFor(diff, phone) {
    const k = KEYS[diff];
    return phone && k.length > 4 ? PHONE_KEYS : k;
  }
  const diffName = d => t('pd_' + d);
  // 'keys' = play with letter keys, 'tap' = tap the falling tiles with fingers or the mouse
  function inputMode() {
    const p = U.profile(); if (!p) return 'keys';
    const d = data(p);
    return d.input || (U.isPhone() ? 'tap' : 'keys');
  }
  const tapMode = () => inputMode() === 'tap';

  // ---------- song selection ----------
  function openMenu() {
    const profile = U.profile();
    if (!profile) return;
    U.show('scr-piano-menu'); U.applyStatic();
    const list = songs(), d = data(profile), unl = unlockedIdx(profile);
    $('pm-coins').textContent = profile.coins;
    const body = $('pm-body'); body.innerHTML = '';
    const phone = U.isPhone();
    body.append(U.h('p', { class: 'pm-intro' }, tapMode() ? t('pianoIntroTap') : t('pianoIntro')));
    const modes = U.h('div', { class: 'seg pm-mode' });
    [['keys', '⌨ ' + t('pianoKeys')], ['tap', '👆 ' + t('pianoTap')]].forEach(([v, label]) => {
      modes.append(U.h('button', { class: inputMode() === v ? 'on' : '', onclick: () => { data(profile).input = v; Store.save(); Sound.play('click'); openMenu(); } }, label));
    });
    body.append(U.h('div', { class: 'pm-modes' }, U.h('b', {}, t('pianoPlayWith')), modes));
    DIFFS.forEach(diff => {
      const group = list.map((s, i) => ({ s, i })).filter(x => x.s.diff === diff);
      if (!group.length) return;
      const keys = keysFor(diff, phone || tapMode());
      body.append(U.h('div', { class: 'pm-head' },
        U.h('h3', {}, diffName(diff)),
        U.h('div', { class: 'pm-keys' }, keys.map(k => U.h('span', { class: 'pm-key' }, k.toUpperCase())))));
      const grid = U.h('div', { class: 'pm-grid' });
      group.forEach(({ s, i }) => {
        const r = d.songs[s.id] || {};
        const locked = !isOpen(profile, i);
        const card = U.h('button', { class: 'pm-song' + (locked ? ' locked' : '') + (r.done ? ' done' : '') + (i === unl ? ' next' : '') },
          U.h('b', {}, (locked ? '🔒 ' : '') + (U.lang() === 'es' ? s.titleEs : s.title)),
          U.h('small', {}, s.composer),
          U.h('span', { class: 'pm-stars' }, '★'.repeat(r.stars || 0) + '☆'.repeat(3 - (r.stars || 0))),
          r.best ? U.h('small', { class: 'pm-best' }, t('bestScore') + ': ' + r.best) : '');
        card.addEventListener('click', () => {
          if (locked) { Sound.play('nope'); U.toast(t('pianoLocked')); return; }
          songIntro(i);
        });
        grid.append(card);
      });
      body.append(grid);
    });
    const next = body.querySelector('.pm-song.next');
    if (next) requestAnimationFrame(() => next.scrollIntoView({ block: 'center' }));
  }
  function songIntro(i) {
    const s = songs()[i], profile = U.profile();
    const keys = keysFor(s.diff, U.isPhone() || tapMode());
    const practice = profile.settings.mode === 'practice';
    const sheetBox = U.h('div', { class: 'sheet-box hidden' });
    const sheetBtn = U.h('button', { class: 'btn btn-ghost sheet-btn', onclick: () => {
      if (!sheetBox.firstChild) sheetBox.append(sheetMusic(s));
      sheetBox.classList.toggle('hidden');
      sheetBtn.textContent = '🎼 ' + (sheetBox.classList.contains('hidden') ? t('showSheet') : t('hideSheet'));
    } }, '🎼 ' + t('showSheet'));
    const box = U.openModal(
      U.h('h2', {}, '🎹 ' + (U.lang() === 'es' ? s.titleEs : s.title)),
      U.h('p', { class: 'center' }, s.composer + ' · ' + diffName(s.diff)),
      tapMode() ? U.h('p', { class: 'center' }, '👆 ' + t('pianoTapHow', keys.length)) : U.h('div', { class: 'intro-keys' }, keys.map(k => U.h('div', { class: 'kcap', style: 'background:#fff' }, k.toUpperCase()))),
      U.h('p', { class: 'center small' }, t('pianoHow')),
      U.h('p', { class: 'center' }, U.h('b', {}, practice ? t('pianoPracticeRule') : t('pianoChallengeRule'))),
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
    const phone = U.isPhone();
    const tap = tapMode();
    const keys = keysFor(s.diff, phone || tap);
    const gaps = [];
    for (let k = 1; k < s.ev.length; k++) { const g = s.ev[k][0] - s.ev[k - 1][0]; if (g > 0) gaps.push(g); }
    gaps.sort((a, b) => a - b);
    const medGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 1;
    P = {
      song: s, index: i, keys, cols: assignColumns(s.ev, keys.length),
      practice: profile.settings.mode === 'practice', phone,
      beat: -2, next: 0, hits: 0, misses: 0, wrongs: 0, combo: 0, bestCombo: 0, score: 0,
      started: false, over: false, paused: false, flashes: [], pops: [], pressed: {},
      medGap, t: 0, loaded: false, perfect: 0, tap
    };
    document.getElementById('scr-piano').classList.toggle('tap', tap);
    document.body.classList.toggle('phone', phone);
    U.show('scr-piano'); U.applyStatic();
    $('pp-title').textContent = (U.lang() === 'es' ? s.titleEs : s.title);
    $('pp-composer').textContent = s.composer;
    buildKeyRow();
    PianoAudio.setVolume((profile.settings.volume == null ? 80 : profile.settings.volume) / 100);
    const pitches = new Set();
    s.ev.forEach(e => e.slice(2).forEach(p => pitches.add(p)));
    $('pp-loading').classList.remove('hidden');
    PianoAudio.preload(pitches).then(() => { if (P && P.song === s) { P.loaded = true; $('pp-loading').classList.add('hidden'); } });
    if (phone && !tap) focusInput();
    resize();
    cancelAnimationFrame(raf);
    let last = performance.now();
    const loop = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (P && !P.paused) update(dt);
      if (P) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    hud();
  }
  function stop() { cancelAnimationFrame(raf); P = null; }
  function speedMul() {
    const prog = P.next / P.song.ev.length;
    return P.practice ? 0.85 + 0.2 * prog : 1 + 0.3 * prog;   // speed slowly rises during a song
  }
  const secPerBeat = () => 60 / (P.song.bpm * speedMul());

  function update(dt) {
    P.t += dt;
    if (!P.started || P.over) return;
    const ev = P.song.ev;
    const nextBeat = P.next < ev.length ? ev[P.next][0] : Infinity;
    let adv = dt / secPerBeat();
    if (P.practice && P.beat + adv > nextBeat) adv = Math.max(0, nextBeat - P.beat); // wait for the right key
    P.beat += adv;
    // a tile that slides past the line is a miss (challenge)
    if (!P.practice && P.next < ev.length && (P.beat - nextBeat) * secPerBeat() > 0.32) {
      miss(P.next, true);
      P.next++;
      if (P.next >= ev.length) finish(true);
    }
    P.flashes = P.flashes.filter(f => (f.t -= dt) > 0);
    P.pops = P.pops.filter(f => (f.t -= dt) > 0);
  }
  function miss(idx, passed) {
    P.misses += passed ? 1 : 0;
    P.combo = 0;
    PianoAudio.wrong();
    P.flashes.push({ col: idx != null ? P.cols[idx] : null, t: 0.35, red: true });
    hud();
    if (!P.practice && P.misses + P.wrongs >= 3) finish(false);
  }
  function key(ch, tapCol) {
    if (!P || P.over || P.paused) return;
    ch = (ch || '').toLowerCase();
    const col = tapCol != null ? tapCol : P.keys.indexOf(ch);
    if (col < 0 && !/^[a-z;]$/.test(ch)) return;
    PianoAudio.ctx();
    if (!P.started) {
      // the first correct key starts the music on the first tile (it never costs a life)
      if (col !== P.cols[0]) return;
      P.started = true; P.beat = P.song.ev[0][0];
    }
    if (col >= 0) { P.pressed[col] = 0.15; pressKeyRow(col); }
    const ev = P.song.ev, i = P.next;
    if (i >= ev.length) return;
    const e = ev[i];
    const early = (e[0] - P.beat) * secPerBeat();
    if (col === P.cols[i] && early >= 1.4) return;   // right key, just a little early: no penalty
    if (col === P.cols[i]) {
      // correct key: play the next note or chord of the piece
      PianoAudio.chord(e.slice(2), e[1] * secPerBeat());
      const err = Math.abs(early);
      const q = err < 0.09 ? 1 : err < 0.2 ? 0.8 : 0.6;
      if (q === 1) P.perfect++;
      P.hits++; P.combo++; P.bestCombo = Math.max(P.bestCombo, P.combo);
      P.score += Math.round(100 * q * (1 + Math.min(P.combo, 100) / 50));
      P.pops.push({ col, t: 0.4, q });
      if (early > 0) P.beat = e[0];  // early hits pull the song forward
      P.next++;
      hud();
      if (P.next >= ev.length) finish(true);
    } else {
      // wrong key: red flash and a wrong note
      P.wrongs++;
      P.combo = 0;
      PianoAudio.wrong();
      P.flashes.push({ col: col >= 0 ? col : P.cols[i], t: 0.35, red: true });
      hud();
      if (!P.practice && P.misses + P.wrongs >= 3) finish(false);
    }
  }
  function accuracy() { const n = P.hits + P.misses + P.wrongs; return n ? P.hits / n * 100 : 100; }
  function finish(done) {
    if (P.over) return;
    P.over = true;
    const profile = U.profile(), d = data(profile), s = P.song;
    const acc = accuracy();
    let stars = 0;
    if (done) { stars = 1; if (acc >= 90) stars = 2; if (acc >= 97 && P.misses === 0) stars = 3; }
    let coins = done ? stars * 15 + Math.floor(P.hits / 10) : Math.floor(P.hits / 20);
    if (P.practice) coins = Math.floor(coins / 2);
    const r = d.songs[s.id] || { stars: 0, best: 0, bestAcc: 0, plays: 0, done: false };
    const firstDone = done && !r.done;
    r.plays++; r.stars = Math.max(r.stars, stars); r.best = Math.max(r.best, P.score); r.bestAcc = Math.max(r.bestAcc, Math.round(acc));
    if (done) r.done = true;
    d.songs[s.id] = r; d.plays++; d.notes += P.hits; d.best = Math.max(d.best, P.score);
    profile.coins += coins;
    Store.save();
    Sound.play(done ? 'win' : 'lose');
    const res = { done, stars, coins, acc, firstDone };
    setTimeout(() => { if (P && P.song === s) results(res); }, 900);
  }
  function results(r) {
    const s = P.song, list = songs();
    const nextIdx = P.index + 1;
    const hasNext = r.done && nextIdx < list.length;
    U.openModal(
      U.h('h2', { class: r.done ? 'win' : 'lose' }, r.done ? t('songComplete') : t('songOver')),
      U.h('div', { class: 'res-stars' }, [0, 1, 2].map(i => U.h('span', { class: i < r.stars ? 'on' : '', style: `animation-delay:${0.2 + i * 0.25}s` }, '★'))),
      U.h('div', { class: 'res-grid' },
        U.h('div', {}, U.h('b', {}, P.score), U.h('small', {}, t('score'))),
        U.h('div', {}, U.h('b', {}, Math.round(r.acc) + '%'), U.h('small', {}, t('accuracy'))),
        U.h('div', {}, U.h('b', {}, P.bestCombo), U.h('small', {}, t('bestCombo'))),
        U.h('div', {}, U.h('b', {}, '+' + r.coins), U.h('small', {}, t('coinsCap')))),
      U.h('p', { class: 'goal-line' }, `${P.hits} / ${s.ev.length} ${t('notesPlayed')}`),
      r.firstDone && hasNext ? U.h('p', { class: 'goal-line' }, U.h('span', { class: 'ok' }, '🔓 ' + t('songUnlocked', U.lang() === 'es' ? list[nextIdx].titleEs : list[nextIdx].title))) : '',
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
  function rr(x, y, w, h, r) { cx.beginPath(); if (cx.roundRect) cx.roundRect(x, y, w, h, r); else cx.rect(x, y, w, h); }
  function draw() {
    const W = canvas.width, H = canvas.height;
    if (!W || !H) return;
    const d = W / canvas.getBoundingClientRect().width || 1;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0d1226'); g.addColorStop(1, '#1b2340');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    const n = P.keys.length;
    const laneW = Math.min(W / n, (P.tap ? 190 : 150) * d), x0 = (W - laneW * n) / 2;
    P.lane = { x0: x0 / d, w: laneW / d };
    const hitY = H - 34 * d;
    const tileH = Math.max(46 * d, Math.min(H * 0.16, 110 * d));
    const pxPerBeat = Math.max(tileH * 1.25 / Math.max(P.medGap, 0.0625), H * 0.12);
    // lanes
    for (let c = 0; c < n; c++) {
      cx.fillStyle = c % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.045)';
      cx.fillRect(x0 + c * laneW, 0, laneW, H);
      if (P.pressed[c] > 0) { cx.fillStyle = 'rgba(120,200,255,0.12)'; cx.fillRect(x0 + c * laneW, 0, laneW, H); P.pressed[c] -= 1 / 60; }
    }
    cx.strokeStyle = 'rgba(255,255,255,0.08)'; cx.lineWidth = 1 * d;
    for (let c = 1; c < n; c++) { cx.beginPath(); cx.moveTo(x0 + c * laneW, 0); cx.lineTo(x0 + c * laneW, H); cx.stroke(); }
    // hit line
    cx.fillStyle = 'rgba(255,213,79,0.18)'; cx.fillRect(x0, hitY - tileH, laneW * n, tileH);
    cx.strokeStyle = '#ffd54f'; cx.lineWidth = 3 * d; cx.shadowColor = '#ffd54f'; cx.shadowBlur = 12 * d;
    cx.beginPath(); cx.moveTo(x0, hitY); cx.lineTo(x0 + laneW * n, hitY); cx.stroke();
    cx.shadowBlur = 0;
    // tiles
    const ev = P.song.ev;
    const font = `700 ${Math.round(Math.min(laneW, tileH) * 0.36)}px Fredoka, system-ui, sans-serif`;
    for (let i = Math.max(0, P.next - 3); i < ev.length; i++) {
      const y = hitY - (ev[i][0] - P.beat) * pxPerBeat;
      if (y < -10) break;
      if (y - tileH > H) continue;
      const c = P.cols[i], x = x0 + c * laneW + 4 * d, w = laneW - 8 * d;
      const done = i < P.next;
      if (done) continue;
      const isNext = i === P.next;
      if (isNext) { cx.shadowColor = '#7fe3ff'; cx.shadowBlur = 22 * d; }
      rr(x, y - tileH, w, tileH - 4 * d, 12 * d);
      const tg = cx.createLinearGradient(0, y - tileH, 0, y);
      tg.addColorStop(0, isNext ? '#ffffff' : '#e9eefb'); tg.addColorStop(1, isNext ? '#c9f3ff' : '#c7d0e6');
      cx.fillStyle = tg; cx.fill();
      cx.shadowBlur = 0;
      cx.lineWidth = 3 * d; cx.strokeStyle = isNext ? '#29b6f6' : '#1e2536'; cx.stroke();
      if (ev[i].length > 3) { cx.fillStyle = 'rgba(41,182,246,0.35)'; rr(x + 6 * d, y - 14 * d, w - 12 * d, 6 * d, 3 * d); cx.fill(); }
      cx.fillStyle = '#1e2536'; cx.font = font; cx.textAlign = 'center'; cx.textBaseline = 'middle';
      cx.fillText(P.tap ? '♪' : P.keys[c].toUpperCase(), x + w / 2, y - tileH / 2 - 2 * d);
    }
    // hit pops & red flashes
    P.pops.forEach(p => {
      const a = p.t / 0.4, x = x0 + p.col * laneW + laneW / 2;
      cx.globalAlpha = a; cx.fillStyle = p.q === 1 ? '#7fe3ff' : '#b2ff9e';
      cx.beginPath(); cx.arc(x, hitY - tileH / 2, laneW * 0.25 + (1 - a) * laneW * 0.35, 0, Math.PI * 2); cx.fill();
      cx.globalAlpha = 1;
    });
    P.flashes.forEach(f => {
      if (f.col == null) return;
      cx.globalAlpha = Math.min(1, f.t / 0.2); cx.fillStyle = '#ff5252';
      rr(x0 + f.col * laneW + 4 * d, hitY - tileH, laneW - 8 * d, tileH - 4 * d, 12 * d); cx.fill();
      cx.globalAlpha = 1;
    });
    if (!P.started) {
      cx.fillStyle = 'rgba(30,37,54,0.85)'; const bw = Math.min(W - 20 * d, 420 * d);
      rr(W / 2 - bw / 2, H * 0.36, bw, 54 * d, 27 * d); cx.fill();
      cx.fillStyle = '#fff'; cx.font = `600 ${Math.round(19 * d)}px Fredoka, system-ui, sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
      cx.fillText(P.loaded ? (P.tap ? t('pianoTapToStart') : t('pianoPressToStart', P.keys[P.cols[0]].toUpperCase())) : t('loadingPiano'), W / 2, H * 0.36 + 27 * d);
    }
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
    $('pp-combo').textContent = P.combo > 1 ? t('combo') + ' x' + P.combo : '';
    const lives = P.practice ? '' : '♥'.repeat(Math.max(0, 3 - P.misses - P.wrongs)) + '♡'.repeat(Math.min(3, P.misses + P.wrongs));
    $('pp-lives').textContent = P.practice ? t('practice') : lives;
    $('pp-progress').style.width = (P.next / P.song.ev.length * 100) + '%';
    const nk = P.next < P.song.ev.length ? P.cols[P.next] : -1;
    document.querySelectorAll('#pp-keys .pp-key').forEach(el => el.classList.toggle('next', +el.dataset.c === nk));
  }
  function focusInput() { const i = $('piano-input'); i.value = ''; try { i.focus({ preventScroll: true }); } catch (e) { i.focus(); } }
  function pause() {
    if (!P || P.over) return;
    P.paused = true;
    U.openModal(U.h('h2', {}, t('paused')),
      U.h('div', { class: 'row-btns', style: 'justify-content:center' },
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); stop(); openMenu(); } }, t('songs')),
        U.h('button', { class: 'btn btn-ghost', onclick: () => { U.closeModal(); start(P.index); } }, t('restart')),
        U.h('button', { class: 'btn btn-gold', onclick: () => { U.closeModal(); P.paused = false; if (P.phone && !P.tap) focusInput(); } }, t('resume') + ' ▶')));
  }

  function init(helpers) {
    U = helpers;
    canvas = $('piano-canvas'); cx = canvas.getContext('2d');
    document.addEventListener('keydown', e => {
      if (U.screen() !== 'scr-piano' || e.target === $('piano-input')) return;
      if (!$('modal').classList.contains('hidden')) return;
      if (e.key === 'Escape') { pause(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.key.length === 1) { e.preventDefault(); key(e.key); }
    });
    const inp = $('piano-input');
    inp.addEventListener('input', () => { const v = inp.value; inp.value = ''; if ($('modal').classList.contains('hidden')) for (const ch of v) key(ch); });
    $('pp-stage').addEventListener('pointerdown', e => {
      if (!P || e.target.closest('button')) return;
      if (P.tap) {
        e.preventDefault();
        if (!$('modal').classList.contains('hidden') || !P.lane) return;
        const r = canvas.getBoundingClientRect();
        const c = Math.floor((e.clientX - r.left - P.lane.x0) / P.lane.w);
        if (c >= 0 && c < P.keys.length) key('', c);
        return;
      }
      if (P.phone) focusInput();
    });
    $('btn-pp-pause').addEventListener('click', pause);
    $('btn-pm-back').addEventListener('click', () => U.back());
    window.addEventListener('resize', () => { if (U.screen() === 'scr-piano') resize(); });
  }
  return { init, openMenu, stop, resize, data, unlockedIdx, songs, sheetMusic, state: () => P };
})();
