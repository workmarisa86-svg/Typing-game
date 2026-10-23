/* Level lists, lesson text generator (English / Spanish / verses) and the in-level game engine */
'use strict';

const isLetterChar = ch => /\p{L}/u.test(ch);
const PHONE_OK = ch => ch === ' ' || isLetterChar(ch);
const WORLD_BASE_WPM = { castle: 17, plaza: 14, volcano: 13, storm: 11 };

// ---------- level list (depends on typing language and device) ----------
function buildLevels(opts = {}) {
  const lang = opts.typeLang || 'en', phone = !!opts.phone;
  const list = [];
  const learned = new Set();
  WORLDS.forEach((w, wi) => {
    if (w.spanishOnly && lang !== 'es') return;
    if (w.laptopOnly && phone) return;
    let n = 0, lastMin = 10;
    const worldStart = list.length;
    w.lessons.forEach((li, lo) => {
      const L = LESSONS[li];
      L.keys.concat(L.extra || []).forEach(k => learned.add(k));
      if (L.review && li < 16) 'abcdefghijklmnopqrstuvwxyz;,.'.split('').forEach(k => learned.add(k));
      const stages = L.setup ? [0] : L.review ? [1, 2, 3, 3] : [0, 1, 2, 3];
      const fresh = (L.review ? [] : L.keys).filter(k => !phone || PHONE_OK(k));
      stages.forEach((stage, si) => {
        const type = L.setup ? 'chase' : w.mix[n % w.mix.length];
        let minWpm;
        if (li < 16) minWpm = Math.round(L.review ? 18 + si * 2 : 7 + li + stage);
        else minWpm = Math.round(WORLD_BASE_WPM[w.id] + lo + stage * 0.7 - (L.setup ? 4 : 0));
        lastMin = minWpm;
        list.push({ id: w.id + '-' + n, world: wi, lesson: li, stage, type, minWpm, fresh,
          learned: [...learned], setup: !!L.setup, boss: false });
        n++;
      });
    });
    list.push({ id: w.id + '-boss', world: wi, lesson: w.lessons[w.lessons.length - 1], stage: 3, type: 'chase',
      minWpm: lastMin + 1, fresh: [], learned: [...learned], boss: true,
      worldKeys: list.slice(worldStart).reduce((a, l) => a.concat(l.fresh), []) });
  });
  return list;
}
// The 64 Stage 1 levels in their original order (to move old saves to level ids)
const STAGE1_IDS = buildLevels({ typeLang: 'en', phone: false }).filter(l => !l.boss && l.world < 7).map(l => l.id);

function levelTitle(l, lang) {
  if (l.smart) return t('smartPractice');
  if (l.boss) return t('boss');
  const L = LESSONS[l.lesson];
  const name = lang === 'es' ? (L.nameEs || L.name) : L.name;
  if (l.setup) return name;
  return name + ' · ' + (lang === 'es' ? STAGE_NAMES_ES : STAGE_NAMES)[l.stage];
}
function worldName(w, lang) { return lang === 'es' && WORLD_TEXT_ES[w.id] ? WORLD_TEXT_ES[w.id][0] : w.name; }
function worldBlurb(w, lang) { return lang === 'es' && WORLD_TEXT_ES[w.id] ? WORLD_TEXT_ES[w.id][1] : w.blurb; }

const TYPE_INFO = {
  chase: { name: 'typeChase', tip: 'tipChase' },
  falling: { name: 'typeFalling', tip: 'tipFalling' },
  boulder: { name: 'typeHold', tip: 'tipBoulder' },
  vine: { name: 'typeHold', tip: 'tipVine' }
};

// ---------- verses (loaded on demand from data/verses-xx.js) ----------
const Verses = (() => {
  const loading = {};
  function data(lang) { return lang === 'es' ? window.VERSES_ES : window.VERSES_EN; }
  function load(lang) {
    if (data(lang)) return Promise.resolve(data(lang));
    if (!loading[lang]) {
      loading[lang] = new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'data/verses-' + (lang === 'es' ? 'es' : 'en') + '.js';
        s.onload = () => res(data(lang));
        s.onerror = () => { loading[lang] = null; rej(new Error('verses')); };
        document.head.append(s);
      });
    }
    return loading[lang];
  }
  function ratio(text, allowed) {
    let n = 0, ok = 0;
    for (const ch of text) { if (ch === ' ') continue; n++; if (allowed.has(ch)) ok++; }
    return n ? ok / n : 0;
  }
  // pick a verse (or a run of consecutive verses for bosses) that the player can mostly type
  function pick(lang, allowed, long) {
    const D = data(lang);
    if (!D) return null;
    const v = D.v;
    let best = [];
    for (let k = 0; k < 500; k++) {
      const i = Math.floor(Math.random() * v.length);
      let parts = [v[i]], len = v[i][3].length;
      if (long) {
        for (let j = i + 1; j < v.length && len < 170; j++) {
          const p = v[j], q = parts[parts.length - 1];
          if (p[0] !== q[0] || p[1] !== q[1] || p[2] !== q[2] + 1) break;
          parts.push(p); len += p[3].length + 1;
        }
        if (len < 120 || len > 340) continue;
      } else if (len < 40 || len > 150) continue;
      const text = parts.map(p => p[3]).join(' ');
      best.push({ r: ratio(text, allowed), text, parts });
    }
    if (!best.length) return null;
    best.sort((a, b) => b.r - a.r);
    const top = best.slice(0, 8), c = top[Math.floor(Math.random() * top.length)];
    const p0 = c.parts[0], pN = c.parts[c.parts.length - 1];
    const ref = `${D.books[p0[0]]} ${p0[1]}:${p0[2]}${c.parts.length > 1 ? '–' + pN[2] : ''} (${D.version})`;
    return { text: c.text, ref, ratio: c.r };
  }
  return { load, pick };
})();

// ---------- text generator ----------
const TextGen = (() => {
  const PUNCT = /[;,.]/;
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const upFirst = s => s.replace(/^([¿¡"']*)(\p{L})/u, (m, a, b) => a + b.toUpperCase());
  function fits(str, set) { for (const ch of str) if (ch !== ' ' && !set.has(ch)) return false; return true; }
  function groups(pool, minL, maxL, target) {
    const out = []; let len = 0;
    while (len < target) {
      const n = minL + rnd(maxL - minL + 1);
      let g = '';
      for (let i = 0; i < n; i++) g += pick(pool);
      out.push(g); len += g.length + 1;
    }
    return out.join(' ');
  }
  function fill(tpl, digits) {
    const d = () => pick(digits);
    const nz = digits.filter(x => x !== '0');
    const n = () => (nz.length ? pick(nz) : d()) + d() + (Math.random() < 0.5 ? d() : '');
    return tpl.replace(/\{n\}/g, n).replace(/\{d\}/g, d).replace(/\{y\}/g, () => (nz.length ? pick(nz) : '1') + d() + d() + d());
  }
  // returns { text, ref?, autoOk? } — autoOk are characters the game types for the player
  function make(level, lang, phone, verse) {
    const set = new Set(level.learned.filter(k => !phone || PHONE_OK(k)));
    const L = LESSONS[level.lesson];
    const caps = [...set].some(k => /[A-Z]/.test(k));
    const words = lang === 'es' ? WORDS_ES : WORDS;
    const sents = lang === 'es' ? SENTENCES_ES : SENTENCES;
    const lowers = [...set].filter(k => /[a-z]/.test(k));
    const letters = [...set].filter(k => isLetterChar(k) && k === k.toLowerCase());
    const fresh = level.boss ? [] : level.fresh;
    const freshLetters = fresh.filter(k => isLetterChar(k));
    const freshOther = fresh.filter(k => !isLetterChar(k));
    const target = level.boss ? 170 : 0;

    // verse mode: sentence levels and bosses use exact Bible verses
    if (verse && (level.stage === 3 || level.boss) && lowers.length >= 12 && !L.numbers && !L.symbols) {
      const v = Verses.pick(lang, set, level.boss);
      if (v) return { text: v.text, ref: v.ref };
    }
    if (level.smart) return smart(level, set, words, phone);
    if (level.setup) return { text: 'ñ ñ ña ñe ñi ño ñu año niño señor mañana' };

    // number & symbol bosses: a long mix of everything learned so far
    if ((L.numbers || L.symbols) && level.boss) {
      const digits = [...set].filter(k => /[0-9]/.test(k));
      const snips = [];
      [...set].forEach(k => (SYMBOL_SNIPS[lang][k] || []).forEach(x => { if (fits(x, set)) snips.push(x); }));
      const ss = sents.map(s => caps ? upFirst(s) : s).filter(s => fits(s, set));
      const out = [];
      while (out.join(' ').length < 170) {
        const r = Math.random();
        if (r < 0.35) out.push(upFirst(fill(pick(NUMBER_TEMPLATES[lang]), digits)));
        else if (r < 0.65 && snips.length) out.push(pick(snips));
        else if (ss.length) out.push(pick(ss));
      }
      return { text: out.join(' ') };
    }
    // numbers world
    if (L.numbers && !level.boss) {
      const digits = [...set].filter(k => /[0-9]/.test(k));
      const fd = fresh.length ? fresh : digits;
      if (level.stage === 0) return { text: groups(fd, 1, 3, 34) };
      if (level.stage === 1) return { text: groups(fd.concat(digits), 2, 4, 40) };
      if (level.stage === 2) {
        const ws = words.filter(w => fits(w, set));
        const out = [];
        while (out.join(' ').length < 44) out.push(Math.random() < 0.5 ? fill('{n}', digits) : pick(ws));
        return { text: out.join(' ') };
      }
      const out = [];
      while (out.join(' ').length < 55) out.push(fill(pick(NUMBER_TEMPLATES[lang]), digits));
      return { text: caps ? out.map(upFirst).join(' ') : out.join(' '), autoOk: '' };
    }
    // symbols world
    if (L.symbols && !level.boss) {
      const syms = [...set].filter(k => !isLetterChar(k) && k !== ' ' && !/[0-9]/.test(k));
      const fs = fresh.length ? fresh : syms;
      if (level.stage === 0) return { text: groups(fs, 1, 2, 30) };
      if (level.stage === 1) {
        const out = [];
        while (out.join(' ').length < 40) out.push(Math.random() < 0.5 ? pick(fs) + pick(letters) + pick(letters) : pick(letters) + pick(letters) + pick(fs));
        return { text: out.join(' ') };
      }
      const snips = [];
      (level.stage === 2 ? fs : syms).forEach(k => (SYMBOL_SNIPS[lang][k] || []).forEach(x => { if (fits(x, set)) snips.push(x); }));
      const ws = words.filter(w => fits(w, set));
      const out = [];
      while (out.join(' ').length < (level.stage === 2 ? 44 : 60)) out.push(snips.length && (level.stage === 2 || Math.random() < 0.6) ? pick(snips) : pick(ws));
      return { text: out.join(' ') };
    }
    // Spanish letters lesson ¿ ¡ : the closing ? and ! are typed for you until the symbols world
    const autoOk = new Set();
    if (lang === 'es' && (set.has('¿') || set.has('¡'))) { if (!set.has('?')) autoOk.add('?'); if (!set.has('!')) autoOk.add('!'); }
    const okSet = new Set([...set, ...autoOk]);

    // capitals lessons, stage 0 and 1
    if (L.caps && !L.review && level.stage <= 1 && !level.boss) {
      if (level.stage === 0) {
        const out = []; let len = 0;
        while (len < 34) { const g = Math.random() < 0.5 ? pick(fresh) : pick(fresh) + pick(lowers); out.push(g); len += g.length + 1; }
        return { text: out.join(' ') };
      }
      const out = []; let len = 0;
      while (len < 42) { let g = pick(fresh); for (let i = 0; i < 1 + rnd(3); i++) g += pick(lowers); out.push(g); len += g.length + 1; }
      return { text: out.join(' ') };
    }

    let text = '';
    if (level.stage === 0 && !level.boss) {
      if (L.spanish) {
        const vow = 'aeiou'.split('').filter(v => set.has(v));
        const out = []; let len = 0;
        while (len < 34) {
          const k = pick(freshLetters.length ? freshLetters : letters);
          const g = Math.random() < 0.4 ? k : (/[áéíóú]/i.test(k) ? pick(lowers) + k : k + pick(vow));
          out.push(g); len += g.length + 1;
        }
        text = out.join(' ');
      } else {
        const pool = freshLetters.length >= 2 ? freshLetters : freshLetters.concat(letters.slice(0, 4));
        text = groups(pool.length ? pool : letters, 1, 3, 34);
        if (freshOther.length) text = text.split(' ').map((g, i) => i % 2 ? g + freshOther[0] : g).join(' ');
      }
    } else if (level.stage === 1 && !level.boss) {
      const pool = [];
      freshLetters.forEach(k => { for (let i = 0; i < 4; i++) pool.push(k); });
      letters.filter(k => /[a-z]/.test(k)).forEach(k => pool.push(k));
      text = groups(pool, 2, 4, 42);
      if (freshOther.length) text = text.split(' ').map((g, i) => i % 3 === 2 ? g + freshOther[0] : g).join(' ');
    } else {
      let ws = words.filter(w => fits(w, set));
      const withFresh = ws.filter(w => freshLetters.some(k => w.includes(k.toLowerCase())));
      if (withFresh.length >= 4) ws = withFresh.concat(withFresh, ws);
      if (ws.length < 4) ws = groups(letters.concat(freshLetters, freshLetters), 3, 5, 200).split(' ');
      if (L.caps && level.stage === 2) {
        const names = NAMES[lang].filter(n => fits(n, set) && (!fresh.length || fresh.some(k => n.includes(k))));
        const out = [];
        while (out.join(' ').length < 44) out.push(names.length && Math.random() < 0.55 ? pick(names) : upFirst(pick(ws)));
        return { text: out.join(' ') };
      }
      if (level.stage === 2 && !level.boss) {
        const out = [];
        while (out.join(' ').length < 44) {
          let w = pick(ws);
          if (out.length && w === out[out.length - 1]) continue;
          if (freshOther.length && out.length % 2 === 1) w += freshOther[0];
          out.push(w);
        }
        text = out.join(' ');
      } else {
        let ss = sents.map(s => phone ? s.replace(/[^\p{L} ]/gu, '').trim() : s).map(s => caps ? upFirst(s) : s).filter(s => fits(s, okSet));
        const fresher = ss.filter(s => fresh.some(k => s.includes(k)));
        if (fresher.length >= 2) ss = fresher;
        const out = [];
        const goal = level.boss ? target : 50;
        if (ss.length >= 2) {
          const used = new Set();
          while (out.join(' ').length < goal && used.size < ss.length) {
            const s = pick(ss);
            if (used.has(s)) continue;
            used.add(s); out.push(s);
          }
        }
        while (out.join(' ').length < goal * 0.8) {
          const w = [];
          for (let i = 0; i < 4 + rnd(2); i++) w.push(pick(withFresh.length >= 4 ? withFresh : ws));
          let s = w.join(' ');
          if (set.has(',')) s = w.slice(0, 2).join(' ') + ', ' + w.slice(2).join(' ');
          if (set.has('.')) s += '.'; else if (set.has(';') && out.length === 0) s += ';';
          out.push(caps ? upFirst(s) : s);
        }
        text = out.join(' ');
      }
    }
    return { text: text.replace(/\s+/g, ' ').trim(), autoOk: [...autoOk].join('') };
  }
  // smart practice: the player's most-missed keys
  function smart(level, set, words, phone) {
    const weak = level.keys.filter(k => set.has(k));
    const lowWeak = weak.map(k => k.toLowerCase());
    const ws = words.filter(w => fits(w, set) && lowWeak.some(k => w.includes(k)));
    const out = [];
    while (out.join(' ').length < 70) {
      if (ws.length && Math.random() < 0.6) out.push(pick(ws));
      else { let g = ''; for (let i = 0; i < 2 + rnd(2); i++) g += pick(weak); out.push(g); }
    }
    return { text: out.join(' ') };
  }
  return { make };
})();

// ---------- the in-level engine ----------
const Game = (() => {
  let S = null, raf = 0, canvas, ctx, dpr = 1;
  const DANGER_RATE = 9;   // gap units the chaser gains per second
  const DRAIN = 7;         // strength lost per second while holding on

  function init(cv) { canvas = cv; ctx = cv.getContext('2d'); }

  // gen = { text, ref, autoOk } from TextGen
  function start(level, profile, gen, hooks) {
    const st = profile.settings;
    const phone = UI.isPhone();
    const world = WORLDS[level.world];
    const allowed = new Set(level.learned.filter(k => !phone || PHONE_OK(k)));
    allowed.add(' ');
    S = {
      level, world, profile, hooks, phone, text: gen.text, ref: gen.ref || '', allowed,
      practice: st.mode === 'practice', winStyle: st.winStyle, blood: st.blood, boss: !!level.boss,
      pos: 0, correct: 0, errors: 0, startT: 0, endT: 0, streak: 0, bestStreak: 0,
      strength: 100, gap: level.boss ? 62 : 55, cam: 0, speed: 0, ema: 0, phase: 0, t: 0,
      anim: 'ready', animT: 0, hitT: -9, tripT: -9, dashT: -9, slipT: -9, reviveT: -9,
      targetCps: level.minWpm * 5 / 60, objs: [], parts: [], lastSpawn: 0,
      water: [], climb: 0, climbShown: 0, over: false, paused: false, revived: false,
      keyErrors: {}, keyTries: {}, auto: new Set(), dead: null
    };
    if (S.level.type === 'chase' || S.level.type === 'falling') for (let i = 1; i < 40; i++) S.water.push(i * 1100 + Art.hash(i) * 300);
    autoAdvance();
    resize();
    cancelAnimationFrame(raf);
    let last = performance.now();
    const loop = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (S && !S.paused) update(dt);
      if (S) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    hooks.onChange(S);
  }
  function stop() { cancelAnimationFrame(raf); S = null; }
  function pause(v) { if (S) S.paused = v; }
  function state() { return S; }
  function resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  }
  // characters the player hasn't learned yet (or can't type on a phone) are typed automatically
  function autoAdvance() {
    while (S.pos < S.text.length && !S.allowed.has(S.text[S.pos])) { S.auto.add(S.pos); S.pos++; }
  }

  function elapsed() { return S.startT ? ((S.endT || performance.now()) - S.startT) / 1000 : 0; }
  function wpm() { const t = elapsed(); return t > 0.5 ? (S.correct / 5) / (t / 60) : 0; }
  function accuracy() { const n = S.correct + S.errors; return n ? S.correct / n * 100 : 100; }
  function sprinting() { return S.streak >= 8; }

  function addParts(x, y, n, color, spread = 1) {
    for (let i = 0; i < n; i++) S.parts.push({ x, y, vx: (Math.random() - 0.5) * 220 * spread, vy: -Math.random() * 220 * spread, life: 0.6 + Math.random() * 0.4, color, r: 3 + Math.random() * 4 });
  }

  function hurt(amount, kind) {
    if (S.practice || S.over) return;
    S.strength = Math.max(0, S.strength - amount);
    if (kind === 'big') { S.hitT = S.t; Sound.play('hit'); }
    const p = playerScreen();
    if (kind === 'big') {
      if (S.blood) addParts(p.x, p.y - 70, 10, '#c62828', 0.8);
      addParts(p.x, p.y - 80, 8, '#ffffff', 0.9);
    }
    if (S.strength <= 0) outOfStrength();
  }
  // one revive per level, paid with coins (the UI asks)
  function outOfStrength() {
    if (S.over || S.asking) return;
    if (!S.revived && S.hooks.canRevive && S.hooks.canRevive()) {
      S.asking = true; S.paused = true;
      S.hooks.onRevive();
    } else finish(false);
  }
  function revive() {
    if (!S) return;
    S.asking = false; S.revived = true; S.paused = false;
    S.strength = 70; S.gap = Math.max(S.gap, 55); S.reviveT = S.t; S.hitT = -9;
    S.objs.forEach(o => { o.dodged = true; o.wx = S.cam + playerScreen().x + 140; });
    addParts(playerScreen().x, playerScreen().y - 80, 16, '#ffd54f', 1.2);
    Sound.play('revive');
    S.hooks.onChange(S);
  }
  function giveUp() { if (!S) return; S.asking = false; S.paused = false; finish(false); }

  // info = { shiftL, shiftR } when known (laptop keyboards)
  function key(ch, info) {
    if (!S || S.over || S.paused) return;
    const want = S.text[S.pos];
    if (!S.startT) { S.startT = performance.now(); S.anim = 'run'; }
    S.keyTries[want] = (S.keyTries[want] || 0) + 1;
    let ok = ch === want;
    // capitals and shifted symbols: use the Shift key on the other hand
    if (ok && info && !S.phone) {
      const plan = charPlan(want);
      if (plan && plan.shift) {
        const wrongHeld = plan.shift === 'ShiftL' ? (info.shiftR && !info.shiftL) : (info.shiftL && !info.shiftR);
        if (wrongHeld) { ok = false; S.hooks.onShiftHint && S.hooks.onShiftHint(plan.shift); }
      }
    }
    if (ok) {
      S.pos++; S.correct++; S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak);
      S.ema += 1;
      if (S.streak === 8) Sound.play('sprint'); else Sound.play('key');
      const boost = sprinting() ? 1.35 : 1;
      if (!S.practice) {
        const type = S.level.type;
        if (type === 'chase') S.gap = Math.min(100, S.gap + rate() / (S.targetCps * (1 + 0.3 * S.pos / S.text.length)) * 1.04 * boost);
        if (type === 'boulder' || type === 'vine') S.strength = Math.min(100, S.strength + DRAIN / S.targetCps * 1.1 * boost);
        else S.strength = Math.min(100, S.strength + 0.35);
        if (type === 'falling') S.objs.forEach(o => { if (!o.dodged && !o.landed) { o.got++; if (o.got >= o.need) { o.dodged = true; o.wx = S.cam + playerScreen().x + o.off; S.dashT = S.t; Sound.play('whoosh'); } } });
      }
      autoAdvance();
      if (S.pos >= S.text.length) finish(true);
    } else {
      S.errors++; S.streak = 0;
      S.keyErrors[want] = (S.keyErrors[want] || 0) + 1;
      Sound.play('error');
      const type = S.level.type;
      if (type === 'chase' || type === 'falling') S.tripT = S.t;
      else S.slipT = S.t;
      if (!S.practice) {
        if (type === 'chase') { S.gap -= 13; S.lungeT = S.t; hurt(4); }
        else if (type === 'falling') { spawn(1.5); hurt(4); }
        else hurt(8);
      }
      UI.flashError();
    }
    S.hooks.onChange(S);
  }
  function rate() {
    const ramp = 1 + 0.3 * (S.pos / S.text.length);   // the chaser keeps speeding up
    return (S.boss ? DANGER_RATE * 1.2 : DANGER_RATE) * ramp;
  }

  function spawn(dur) {
    const fall = dur || Math.max(1.6, 2.6 - Math.min(15, S.level.lesson) * 0.04);
    const need = Math.max(2, Math.round(S.targetCps * fall * 0.7));
    S.objs.push({ t: 0, dur: fall, need, got: 0, off: 10 + Math.random() * 30, dodged: false, landed: false, rot: Math.random() * 6, wx: 0, bounce: 0, kind: S.world.faller });
  }

  function finish(reachedEnd) {
    if (S.over) return;
    S.over = true; S.endT = performance.now();
    if (!S.startT) S.startT = S.endT;
    const w = wpm(), acc = accuracy();
    let win = reachedEnd;
    if (S.winStyle === 'speed') win = reachedEnd && acc >= 90 && w >= S.level.minWpm;
    let stars = 0;
    if (win) {
      stars = 1;
      if (acc >= 95 && w >= S.level.minWpm) stars = 2;
      if (acc >= 98 && w >= S.level.minWpm * 1.25 && (S.practice || S.strength >= 50)) stars = 3;
    }
    let coins = win ? stars * 10 + Math.floor(S.correct / 8) + (S.boss ? 40 : 0) : Math.floor(S.correct / 15);
    if (S.practice || S.level.smart) coins = Math.floor(coins / 2);
    S.result = { win, reachedEnd, died: !reachedEnd, wpm: w, acc, stars, coins, bestStreak: S.bestStreak, correct: S.correct,
      errors: S.errors, keyErrors: S.keyErrors, keyTries: S.keyTries, ref: S.ref, revived: S.revived };
    S.anim = reachedEnd ? 'win' : 'lose'; S.animT = 0;
    Sound.play(win ? 'win' : 'lose');
    const res = S.result, hooks = S.hooks;
    setTimeout(() => { if (S && S.result === res) hooks.onEnd(res); }, 1900);
  }

  // ---------- update ----------
  function update(dt) {
    S.t += dt; S.animT += dt;
    S.ema *= Math.pow(0.35, dt); // decaying keys-per-second estimate
    const cps = S.ema * 1.05; // keys per second (steady state of the decay above)
    const type = S.level.type;
    const running = S.anim === 'run' || S.anim === 'ready' || S.anim === 'win';
    let target = S.anim === 'ready' ? 0 : 35 + Math.min(cps, 10) * 70;
    if (sprinting()) target *= 1.3;
    if (S.anim === 'win') target = 420;
    if (S.anim === 'lose') target = 0;
    if (S.t - S.tripT < 0.7) target *= 0.25;
    if (type === 'boulder' || type === 'vine') target = 0;
    S.speed += (target - S.speed) * Math.min(1, dt * 4);
    S.cam += S.speed * dt;
    S.phase += dt * (3 + S.speed / 26);
    S.beastPhase = (S.beastPhase || 0) + dt * (9 + rate() * 0.6);
    if (type === 'vine') S.climb += dt * (2 + cps * 2.5);
    S.climbShown += (S.pos / S.text.length - S.climbShown) * Math.min(1, dt * 5);
    S.shownGap = S.shownGap == null ? S.gap : S.shownGap + (S.gap - S.shownGap) * Math.min(1, dt * 6);

    if (S.startT && !S.over && !S.practice) {
      if (type === 'chase') {
        S.gap -= rate() * dt;
        if (S.gap <= 0) { S.gap = 38; hurt(25, 'big'); }
      } else if (type === 'boulder' || type === 'vine') {
        S.strength -= DRAIN * dt;
        if (S.strength <= 0) { S.strength = 0; outOfStrength(); }
      } else if (type === 'falling') {
        const every = Math.max(2.0, 3.4 - Math.min(15, S.level.lesson) * 0.06);
        if (S.t - S.lastSpawn > every || (!S.objs.some(o => !o.landed) && S.t - S.lastSpawn > 1)) { spawn(); S.lastSpawn = S.t; }
      }
      if (S.t - (S.lastHook || 0) > 0.2) { S.lastHook = S.t; S.hooks.onChange(S); }
    }
    // falling objects
    S.objs.forEach(o => {
      if (o.landed) { o.bounce += dt; return; }
      o.t += dt; o.rot += dt * 4;
      if (o.t >= o.dur) {
        o.landed = true;
        if (!o.dodged) { o.hit = true; hurt(20, 'big'); }
        else Sound.play('key');
      }
    });
    S.objs = S.objs.filter(o => !o.landed || o.bounce < 1.2);
    S.parts.forEach(p => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 600 * dt; });
    S.parts = S.parts.filter(p => p.life > 0);
    if (running && S.speed > 60 && Math.random() < dt * 10) {
      const p = playerScreen();
      S.parts.push({ x: p.x - 14, y: p.y - 4, vx: -60 - Math.random() * 40, vy: -20 - Math.random() * 30, life: 0.5, color: 'dust', r: 3 + Math.random() * 3 });
    }
  }

  // ---------- draw ----------
  let VW = 1000, VH = 500;
  function playerScreen() {
    const sm = VW < 700;
    let x = VW * (sm ? 0.6 : 0.58);
    if (S && S.level.type === 'boulder') x = VW * 0.5 + (S.anim === 'win' ? Math.min(1, S.animT) * 150 : 0);
    if (S && S.t - S.dashT < 0.35) x += Math.sin((S.t - S.dashT) / 0.35 * Math.PI) * 30;
    if (S && S.anim === 'win' && S.level.type !== 'vine') x += S.animT * S.animT * 160;
    return { x, y: VH * 0.8 + VH * 0.005 };
  }

  function draw() {
    const cw = canvas.width, ch = canvas.height;
    if (!cw || !ch) return;
    // logical height of 500 units so art keeps its proportions on any screen
    const scale = ch / 500;
    VH = 500; VW = cw / scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const type = S.level.type, world = S.world, look = S.profile.look;
    const simple = S.phone;
    const s = Math.min(1.05, Math.max(0.75, VW / 1100 + 0.3));
    const hitAgo = S.t - S.hitT, tripAgo = S.t - S.tripT;
    const dizzy = hitAgo < 1.0 || (S.anim === 'lose' && type !== 'vine');
    const mood = S.anim === 'win' ? 'happy' : (dizzy ? 'worried' : (sprinting() ? 'shout' : (S.strength < 40 || (type === 'chase' && S.gap < 25) ? 'worried' : 'none')));

    if (type === 'vine') { drawVine(look, s, mood, dizzy); drawParts(); return; }

    const ground = Art.drawScene(ctx, VW, VH, world.theme, S.cam, S.t, { simple, water: S.water });
    const P = playerScreen();
    // jump over streams (position based, like Banana Kong)
    let jumpY = 0, inJump = false;
    const px = S.cam + P.x;
    S.water.forEach(wx => {
      const a = (px - (wx - 40)) / 180;
      if (a > 0 && a < 1) { jumpY = -Math.sin(a * Math.PI) * 62; inJump = true; }
    });

    // pose
    let pose;
    const sp = Math.min(1.6, S.speed / 320 + 0.3);
    if (type === 'boulder') {
      const strain = S.over && !S.result.reachedEnd ? 1 : Math.max(0, 1 - S.strength / 100);
      pose = S.anim === 'win' ? Art.cheerPose(S.t) : Art.holdPose(strain, S.t);
      if (S.anim === 'lose') pose = Art.mixPose(Art.holdPose(1, S.t), Art.FALL_POSE, Math.min(1, S.animT * 2));
      if (S.t - (S.slipT || -9) < 0.4) pose = Art.mixPose(pose, Art.holdPose(1, S.t * 3), 0.6);
    } else if (S.anim === 'ready') pose = Art.idlePose(S.t);
    else if (S.anim === 'lose') pose = Art.mixPose(Art.runPose(S.phase, sp), Art.FALL_POSE, Math.min(1, S.animT * 3));
    else {
      pose = Art.runPose(S.phase, sp);
      if (inJump) pose = Art.mixPose(pose, { legs: [{ t: -0.6, f: 1.2 }, { t: 0.9, f: 1.4 }], arms: [{ u: 2.2, f: 0.4 }, { u: -0.6, f: 1.0 }], lean: 0.2, drop: 0, tilt: 0 }, 0.75);
      const tripDur = 0.9, trip = tripAgo < tripDur ? tripAgo / tripDur : 1, ht = hitAgo < 1 ? hitAgo : 1;
      const w = Math.max(trip < 1 ? Math.sin(trip * Math.PI) : 0, ht < 1 ? Math.sin(ht * Math.PI) : 0);
      if (w > 0) pose = Art.mixPose(pose, Art.FALL_POSE, Math.min(1, w * 1.3));
    }

    // danger behind (chase)
    if (type === 'chase' && !S.practice) {
      const bs = S.boss ? 1.35 : 1;
      const gx = P.x - 95 * s * bs - Math.max(0, S.shownGap) * VW * 0.0035 - (S.anim === 'win' ? S.animT * 200 : 0);
      if (world.chaser === 'avalanche' || world.chaser === 'lava') Art.drawAvalanche(ctx, gx + 40, ground + 5, VH * (S.boss ? 1.25 : 1), S.t, world.chaser === 'lava');
      else if (world.chaser === 'rollingrock') {
        Art.drawRock(ctx, gx - 10, ground - 70 * s * bs + 2, 70 * s * bs, S.cam / 70);
      } else {
        const lunge = S.t - (S.lungeT || -9) < 0.4 ? Math.sin((S.t - S.lungeT) / 0.4 * Math.PI) * 25 : 0;
        Art.drawBeast(ctx, world.chaser, gx - 60 * s * bs + lunge, ground + 4, s * 0.95 * bs, S.anim === 'win' ? S.t * 3 : S.beastPhase, 1);
      }
    }

    // speed lines when sprinting
    if (sprinting() && S.anim === 'run') {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      [[-80, -110, 60], [-100, -85, 70], [-75, -60, 55]].forEach(([dx, dy, l], i) => {
        const j = (S.t * 300 + i * 30) % 30;
        ctx.beginPath(); ctx.moveTo(P.x + dx * s - j, P.y + dy * s + jumpY); ctx.lineTo(P.x + (dx - l) * s - j, P.y + dy * s + jumpY); ctx.stroke();
      });
    }
    drawParts();

    if (type === 'boulder' && S.anim !== 'lose') Art.drawRoof(ctx, world.theme, roofX(P), P.y, roofY(P, s), s, { won: S.anim === 'win', winT: S.animT });
    // the player
    Art.drawPerson(ctx, look, pose, P.x, P.y + jumpY, s, { mood, dizzy: dizzy && hitAgo < 1, sway: Math.sin(S.phase), noShadow: inJump });
    if (inJump) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; Art.ellipse(ctx, P.x, P.y + 3, 30 * s, 5 * s); ctx.fill(); }
    if (dizzy && (hitAgo < 1 || S.anim === 'lose')) Art.drawDizzyStars(ctx, P.x + 20 * s, P.y - 150 * s + (S.anim === 'lose' ? 40 * s : 0), S.t, s);

    if (type === 'boulder') {
      // the runner holds up a roof whose posts have broken
      const strain = Math.max(0, 1 - S.strength / 100);
      let beamY = roofY(P, s);
      if (S.anim === 'lose') { beamY = Math.min(P.y - 18 * s, beamY + S.animT * S.animT * 1400); Art.drawRoof(ctx, world.theme, roofX(P), P.y, beamY, s, { lost: true }); }
      if (S.anim === 'lose' && S.animT > 0.2) {
        ctx.fillStyle = 'rgba(235,228,214,0.9)';
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = (40 + S.animT * 90) * s; Art.circle(ctx, P.x + Math.cos(a) * r * 1.4, P.y - 30 * s + Math.sin(a) * r * 0.35, (22 + (i % 3) * 8) * s * Math.max(0, 1.2 - S.animT * 0.4)); ctx.fill(); }
      }
    }

    // falling objects
    S.objs.forEach(o => {
      const tx = o.dodged ? o.wx - S.cam : P.x + o.off * s;
      const k = Math.min(1, o.t / o.dur);
      if (!o.landed) {
        // shadow + ring showing how many keys you still need
        ctx.fillStyle = 'rgba(0,0,0,' + (0.1 + k * 0.2) + ')';
        Art.ellipse(ctx, tx, ground + 2, 14 + k * 22, 4 + k * 4); ctx.fill();
        const y = -40 + k * k * (ground - 20 + 40);
        Art.drawFaller(ctx, o.kind, tx, y, s * 1.2, o.rot);
        if (!o.dodged) {
          ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(30,37,54,0.55)';
          ctx.beginPath(); ctx.arc(tx, y, 30 * s, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = '#ffd54f';
          ctx.beginPath(); ctx.arc(tx, y, 30 * s, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (o.got / o.need)); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 15px system-ui, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(String(o.need - o.got), tx, y - 36 * s);
        }
      } else {
        const bx = tx - (o.hit ? 30 : 0) - o.bounce * 120, by = ground - 14 - Math.abs(Math.sin(o.bounce * 6)) * 30 * (1.2 - o.bounce);
        ctx.globalAlpha = Math.max(0, 1 - o.bounce / 1.2);
        Art.drawFaller(ctx, o.kind, bx, by, s * 1.2, o.rot - o.bounce * 6);
        ctx.globalAlpha = 1;
      }
    });

    // finish flag when close to the end
    const left = S.text.length - S.pos;
    if (left < 8 && type !== 'boulder') {
      const fx = P.x + 60 + left * 30;
      ctx.fillStyle = '#1e2536'; ctx.fillRect(fx, ground - 110, 4, 112);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(fx + 4, ground - 110, 40, 26);
      ctx.fillStyle = '#1e2536';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) ctx.fillRect(fx + 4 + i * 10, ground - 110 + j * 13, 10, 13);
    }
    if (S.t - S.reviveT < 1.2) { ctx.strokeStyle = 'rgba(255,213,79,' + (1 - (S.t - S.reviveT) / 1.2) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(P.x, P.y - 80 * s, 40 + (S.t - S.reviveT) * 120, 0, Math.PI * 2); ctx.stroke(); }
    if (S.anim === 'ready') banner(S.boss ? t('bossBanner') : t('typeFirst'));
    if (S.practice && S.anim === 'ready') banner(t('practiceBanner'), 40);
  }

  // roof position for hold-on levels (stays put when the runner walks out after winning)
  function roofX(P) { return VW * 0.5; }
  function roofY(P, s) {
    const strain = Math.max(0, 1 - S.strength / 100);
    return P.y - (157 - strain * 14) * s + Math.sin(S.t * 30) * strain * 1.5;
  }
  function drawVine(look, s, mood, dizzy) {
    const v = Art.drawVineScene(ctx, VW, VH, S.world.theme, S.t, S.climbShown, { simple: S.phone });
    let y = v.bottom - 60 - S.climbShown * (v.bottom - v.top - 120);
    let pose = Art.hangPose(S.climb, S.t);
    if (S.anim === 'win') { y = v.top + 2; pose = Art.cheerPose(S.t); }
    if (S.anim === 'lose') { y += S.animT * S.animT * 900; pose = Art.mixPose(pose, Art.FALL_POSE, 0.6); }
    if (S.t - (S.slipT || -9) < 0.35) y += 10;
    const sc = s * 0.9;
    // hands meet the vine above the head
    Art.drawPerson(ctx, look, pose, v.vx + v.sway * 0.8 - 6 * sc, S.anim === 'win' ? y : y + 150 * sc, sc, { mood, dizzy: false, noShadow: true, sway: Math.sin(S.t * 3) });
    if (S.anim === 'lose' && y > v.bottom - 40) {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 6; i++) { Art.circle(ctx, v.vx - 40 + i * 16, v.bottom - 6 - Math.abs(Math.sin(S.t * 8 + i)) * 26, 7); ctx.fill(); }
    }
    if (S.anim === 'ready') banner(t('typeFirstClimb'));
  }

  function drawParts() {
    S.parts.forEach(p => {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
      ctx.fillStyle = p.color === 'dust' ? 'rgba(235,215,180,0.9)' : p.color;
      Art.circle(ctx, p.x, p.y, p.r); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function banner(txt, dy = 0) {
    ctx.font = '600 22px Fredoka, system-ui, sans-serif'; ctx.textAlign = 'center';
    const w = ctx.measureText(txt).width + 40, x = VW / 2, y = VH * 0.42 + dy;
    ctx.fillStyle = 'rgba(30,37,54,0.82)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - 24, w, 38, 19) : ctx.rect(x - w / 2, y - 24, w, 38); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x, y + 2);
  }

  return { init, start, stop, key, pause, state, resize, wpm, accuracy, sprinting, revive, giveUp };
})();
