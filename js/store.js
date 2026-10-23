/* Saving profiles on this device (localStorage) + simple Web Audio sound */
'use strict';

const Store = (() => {
  const KEY = 'dkeys.v1';
  const defLang = (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  let data = { profiles: [], current: null, uiLang: defLang };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) data = Object.assign({ profiles: [], current: null, uiLang: defLang }, JSON.parse(raw));
    } catch (e) { /* storage blocked: play without saving */ }
    data.profiles.forEach(fillDefaults);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
  function fillDefaults(p) {
    p.settings = Object.assign({
      mode: 'challenge', winStyle: 'survival', device: 'auto',
      fingerGuide: true, sound: true, music: true, blood: false,
      uiLang: data.uiLang || defLang, typeLang: data.uiLang || defLang, verse: false
    }, p.settings || {});
    p.progress = p.progress || {};
    p.coins = p.coins || 0;
    p.owned = p.owned || [];
    p.history = p.history || [];
    p.certs = p.certs || {};
    // Stage 1 saves used level numbers; Stage 2 uses level ids such as "forest-3"
    if (!p.schema) {
      const old = p.progress, prog = {};
      Object.keys(old).forEach(k => {
        const id = /^\d+$/.test(k) ? STAGE1_IDS[+k] : k;
        if (id) prog[id] = Object.assign({}, old[k], { won: (old[k].stars || 0) > 0 });
      });
      for (let i = 0; i < (p.unlocked || 0) && i < STAGE1_IDS.length; i++) {
        prog[STAGE1_IDS[i]] = Object.assign({ stars: 1, bestWpm: 0, bestAcc: 0, plays: 1 }, prog[STAGE1_IDS[i]] || {}, { won: true });
      }
      p.progress = prog;
      p.mapPos = typeof p.mapPos === 'number' ? STAGE1_IDS[p.mapPos] : p.mapPos;
      p.schema = 2;
    }
    p.stats = Object.assign({ keys: 0, errors: 0, levelsPlayed: 0, levelsWon: 0, bestWpm: 0, keyErrors: {}, keyTries: {}, seconds: 0 }, p.stats || {});
    return p;
  }
  function create(name, look) {
    const p = fillDefaults({ id: 'p' + Date.now().toString(36), name, look, created: Date.now() });
    data.profiles.push(p);
    data.current = p.id;
    save();
    return p;
  }
  function remove(id) {
    data.profiles = data.profiles.filter(p => p.id !== id);
    if (data.current === id) data.current = null;
    save();
  }
  function current() { return data.profiles.find(p => p.id === data.current) || null; }
  function select(id) { data.current = id; save(); }

  return { load, save, create, remove, current, select, get profiles() { return data.profiles; },
    get uiLang() { return data.uiLang || defLang; }, set uiLang(v) { data.uiLang = v; save(); } };
})();

const Sound = (() => {
  let ac = null, musicTimer = null, musicOn = false, soundOn = true, step = 0;
  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(freq, dur, type = 'sine', vol = 0.12, when = 0) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  const fx = {
    key() { tone(660 + Math.random() * 60, 0.05, 'triangle', 0.05); },
    error() { tone(150, 0.18, 'sawtooth', 0.08); },
    hit() { tone(110, 0.3, 'square', 0.08); tone(80, 0.3, 'sine', 0.12, 0.05); },
    sprint() { tone(880, 0.08, 'triangle', 0.06); tone(1175, 0.1, 'triangle', 0.06, 0.07); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.1, i * 0.12)); },
    lose() { [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'sawtooth', 0.06, i * 0.18)); },
    star() { tone(1320, 0.15, 'sine', 0.1); },
    click() { tone(520, 0.05, 'triangle', 0.06); },
    revive() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.09, i * 0.07)); },
    whoosh() { tone(900, 0.06, 'sine', 0.04); tone(600, 0.08, 'sine', 0.04, 0.04); },
    coin() { tone(988, 0.07, 'square', 0.04); tone(1319, 0.14, 'square', 0.04, 0.07); },
    buy() { [659, 880, 1175].forEach((f, i) => tone(f, 0.12, 'triangle', 0.08, i * 0.08)); },
    cert() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.09, i * 0.14)); },
    nope() { tone(220, 0.1, 'square', 0.05); tone(196, 0.15, 'square', 0.05, 0.1); }
  };
  // a light, looping adventure tune
  const MELODY = [392, 0, 440, 494, 587, 0, 494, 440, 392, 0, 330, 392, 440, 0, 0, 0,
                  392, 0, 440, 494, 659, 0, 587, 494, 440, 0, 494, 440, 392, 0, 0, 0,
                  523, 0, 494, 440, 494, 0, 440, 392, 330, 0, 392, 440, 494, 0, 587, 0,
                  659, 0, 587, 494, 440, 0, 392, 330, 392, 0, 0, 0, 392, 0, 0, 0];
  const BASS = [196, 196, 147, 147, 165, 165, 147, 147, 131, 131, 147, 147, 165, 147, 196, 196];
  function tick() {
    const n = MELODY[step % MELODY.length];
    if (n) tone(n, 0.18, 'triangle', 0.035);
    if (step % 4 === 0) tone(BASS[(step / 4) % BASS.length], 0.35, 'sine', 0.05);
    if (step % 2 === 1) tone(3200, 0.02, 'square', 0.006);
    step++;
  }
  return {
    play(name) { if (soundOn && fx[name]) try { fx[name](); } catch (e) {} },
    setSound(v) { soundOn = v; },
    setMusic(v) {
      musicOn = v;
      if (v && !musicTimer) musicTimer = setInterval(() => { if (musicOn && ac) tick(); }, 190);
      if (!v && musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    },
    unlock() { ctx(); }
  };
})();
