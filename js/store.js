/* Saving profiles on this device (localStorage) + simple Web Audio sound */
'use strict';

const Store = (() => {
  const KEY = 'dkeys.v1';
  let data = { profiles: [], current: null };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) data = Object.assign({ profiles: [], current: null }, JSON.parse(raw));
    } catch (e) { /* storage blocked: play without saving */ }
    data.profiles.forEach(fillDefaults);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }
  function fillDefaults(p) {
    p.settings = Object.assign({
      mode: 'challenge', winStyle: 'survival', device: 'auto',
      fingerGuide: true, sound: true, music: true, blood: false
    }, p.settings || {});
    p.progress = p.progress || {};
    p.unlocked = p.unlocked || 0;
    p.coins = p.coins || 0;
    p.stats = Object.assign({ keys: 0, errors: 0, levelsPlayed: 0, levelsWon: 0, bestWpm: 0, keyErrors: {} }, p.stats || {});
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

  return { load, save, create, remove, current, select, get profiles() { return data.profiles; } };
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
    click() { tone(520, 0.05, 'triangle', 0.06); }
  };
  // a light, looping adventure tune
  const MELODY = [392, 0, 440, 494, 587, 0, 494, 440, 392, 0, 330, 392, 440, 0, 0, 0,
                  392, 0, 440, 494, 659, 0, 587, 494, 440, 0, 494, 440, 392, 0, 0, 0];
  const BASS = [196, 196, 147, 147, 165, 165, 147, 147];
  function tick() {
    const n = MELODY[step % MELODY.length];
    if (n) tone(n, 0.18, 'triangle', 0.035);
    if (step % 4 === 0) tone(BASS[(step / 4) % BASS.length], 0.35, 'sine', 0.05);
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
