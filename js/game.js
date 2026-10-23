/* Level list, lesson text generator and the in-level game engine */
'use strict';

// ---------- level list ----------
const LEVELS = (() => {
  const list = [];
  WORLDS.forEach((w, wi) => {
    let n = 0;
    w.lessons.forEach(li => {
      const L = LESSONS[li];
      const stages = L.review ? [1, 2, 3, 3] : [0, 1, 2, 3];
      stages.forEach((stage, si) => {
        const type = w.mix[n % w.mix.length];
        const base = 7 + li * 1.0;
        const minWpm = Math.round(L.review ? 18 + si * 2 : base + stage);
        list.push({ index: list.length, world: wi, lesson: li, stage, type, minWpm,
          title: (L.review ? 'Review' : L.name) + ' · ' + STAGE_NAMES[stage] });
        n++;
      });
    });
  });
  return list;
})();

const TYPE_INFO = {
  chase: { name: 'Chase', tip: 'Something is running after you. Type fast to pull away!' },
  falling: { name: 'Falling', tip: 'Things are dropping! Type the keys shown in the ring before they land.' },
  boulder: { name: 'Hold-on', tip: 'Hold the boulder up! Each correct key gives you strength.' },
  vine: { name: 'Hold-on', tip: 'Climb the vine! Type to climb; your grip slowly weakens.' }
};

// ---------- text generator ----------
const TextGen = (() => {
  const PUNCT = /[;,.]/;
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  function learned(li, phone) {
    const set = new Set();
    for (let i = 0; i <= li && i < LESSONS.length; i++) LESSONS[i].keys.forEach(k => set.add(k));
    if (LESSONS[li] && LESSONS[li].review) 'abcdefghijklmnopqrstuvwxyz;,.'.split('').forEach(k => set.add(k));
    if (phone) [';', ',', '.'].forEach(k => set.delete(k));
    return set;
  }
  function fits(str, set) { for (const ch of str) if (ch !== ' ' && !set.has(ch)) return false; return true; }
  function groups(pool, minL, maxL, target) {
    const out = [];
    let len = 0;
    while (len < target) {
      const n = minL + rnd(maxL - minL + 1);
      let g = '';
      for (let i = 0; i < n; i++) g += pick(pool);
      out.push(g); len += g.length + 1;
    }
    return out.join(' ');
  }
  function make(level, phone) {
    const L = LESSONS[level.lesson];
    const set = learned(level.lesson, phone);
    const letters = [...set].filter(k => !PUNCT.test(k));
    let fresh = L.keys.filter(k => set.has(k));
    if (L.review || !fresh.length) fresh = letters.slice();
    const freshLetters = fresh.filter(k => !PUNCT.test(k));
    const freshPunct = fresh.filter(k => PUNCT.test(k));
    let text = '';
    if (level.stage === 0) {
      const pool = freshLetters.length >= 2 ? freshLetters : freshLetters.concat(letters.slice(0, 4));
      text = groups(pool.length ? pool : letters, 1, 3, 34);
      if (freshPunct.length) text = text.split(' ').map((g, i) => i % 2 ? g + freshPunct[0] : g).join(' ');
    } else if (level.stage === 1) {
      const pool = [];
      freshLetters.forEach(k => { for (let i = 0; i < 4; i++) pool.push(k); });
      letters.forEach(k => pool.push(k));
      text = groups(pool, 2, 4, 42);
      if (freshPunct.length) text = text.split(' ').map((g, i) => i % 3 === 2 ? g + freshPunct[0] : g).join(' ');
    } else {
      let words = WORDS.filter(w => fits(w, set));
      const withFresh = words.filter(w => freshLetters.some(k => w.includes(k)));
      if (withFresh.length >= 4) words = withFresh.concat(withFresh, words);
      if (words.length < 4) {
        const pool = letters.concat(freshLetters, freshLetters);
        words = groups(pool, 3, 5, 200).split(' ');
      }
      if (level.stage === 2) {
        const out = [];
        while (out.join(' ').length < 44) {
          let w = pick(words);
          if (out.length && w === out[out.length - 1]) continue;
          if (freshPunct.length && out.length % 2 === 1) w += freshPunct[0];
          out.push(w);
        }
        text = out.join(' ');
      } else {
        const strip = s => phone ? s.replace(/[;,.]/g, '') : s;
        let sents = SENTENCES.map(strip).filter(s => fits(s, set));
        const fresher = sents.filter(s => fresh.some(k => s.includes(k)));
        if (fresher.length >= 2) sents = fresher;
        const out = [];
        if (sents.length >= 2) {
          const used = new Set();
          while (out.join(' ').length < 50 && used.size < sents.length) {
            const s = pick(sents);
            if (used.has(s)) continue;
            used.add(s); out.push(s);
          }
        } else {
          for (let k = 0; k < 2; k++) {
            const ws = [];
            for (let i = 0; i < 4 + rnd(2); i++) ws.push(pick(withFresh.length >= 4 ? withFresh : words));
            let s = ws.join(' ');
            if (set.has(',')) s = ws.slice(0, 2).join(' ') + ', ' + ws.slice(2).join(' ');
            if (set.has('.')) s += '.';
            else if (set.has(';') && k === 0) s += ';';
            out.push(s);
          }
        }
        text = out.join(' ');
      }
    }
    return text.replace(/\s+/g, ' ').trim();
  }
  return { make, learned };
})();

// ---------- the in-level engine ----------
const Game = (() => {
  let S = null, raf = 0, canvas, ctx, dpr = 1;
  const DANGER_RATE = 9;   // gap units the chaser gains per second
  const DRAIN = 7;         // strength lost per second while holding on

  function init(cv) { canvas = cv; ctx = cv.getContext('2d'); }

  function start(level, profile, hooks) {
    const st = profile.settings;
    const phone = UI.isPhone();
    const world = WORLDS[level.world];
    const text = TextGen.make(level, phone);
    S = {
      level, world, profile, hooks, phone, text,
      practice: st.mode === 'practice', winStyle: st.winStyle, blood: st.blood,
      pos: 0, correct: 0, errors: 0, startT: 0, endT: 0, streak: 0, bestStreak: 0,
      strength: 100, gap: 55, cam: 0, speed: 0, ema: 0, phase: 0, t: 0,
      anim: 'ready', animT: 0, hitT: -9, tripT: -9, dashT: -9,
      targetCps: level.minWpm * 5 / 60, objs: [], parts: [], lastSpawn: 0,
      water: [], climb: 0, climbShown: 0, over: false, paused: false, lastKeyT: 0,
      keyErrors: {}
    };
    if (S.level.type === 'chase' || S.level.type === 'falling') for (let i = 1; i < 30; i++) S.water.push(i * 1100 + Art.hash(i) * 300);
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
    if (S.strength <= 0) finish(false);
  }

  function key(ch) {
    if (!S || S.over || S.paused) return;
    const want = S.text[S.pos];
    if (!S.startT) { S.startT = performance.now(); S.anim = 'run'; }
    if (ch === want) {
      S.pos++; S.correct++; S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak);
      S.ema += 1;
      S.lastKeyT = S.t;
      if (S.streak === 8) Sound.play('sprint'); else Sound.play('key');
      const boost = sprinting() ? 1.35 : 1;
      if (!S.practice) {
        const type = S.level.type;
        if (type === 'chase') S.gap = Math.min(100, S.gap + DANGER_RATE / S.targetCps * 1.08 * boost);
        if (type === 'boulder' || type === 'vine') S.strength = Math.min(100, S.strength + DRAIN / S.targetCps * 1.1 * boost);
        else S.strength = Math.min(100, S.strength + 0.35);
        if (type === 'falling') S.objs.forEach(o => { if (!o.dodged && !o.landed) { o.got++; if (o.got >= o.need) { o.dodged = true; o.wx = S.cam + playerScreen().x + o.off; S.dashT = S.t; } } });
      }
      if (S.pos >= S.text.length) finish(true);
    } else {
      S.errors++; S.streak = 0;
      S.keyErrors[want] = (S.keyErrors[want] || 0) + 1;
      Sound.play('error');
      const type = S.level.type;
      if (type === 'chase' || type === 'falling') S.tripT = S.t;
      else S.slipT = S.t;
      if (!S.practice) {
        if (type === 'chase') { S.gap -= 8; hurt(4); }
        else if (type === 'falling') { spawn(1.5); hurt(4); }
        else hurt(8);
      }
      UI.flashError();
    }
    S.hooks.onChange(S);
  }

  function spawn(dur) {
    const fall = dur || Math.max(1.6, 2.6 - S.level.lesson * 0.04);
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
    let coins = win ? stars * 10 + Math.floor(S.correct / 8) : Math.floor(S.correct / 15);
    if (S.practice) coins = Math.floor(coins / 2);
    S.result = { win, reachedEnd, died: !reachedEnd, wpm: w, acc, stars, coins, bestStreak: S.bestStreak, correct: S.correct, errors: S.errors, keyErrors: S.keyErrors };
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
    let target = S.anim === 'ready' ? 0 : 50 + Math.min(cps, 8) * 45;
    if (sprinting()) target *= 1.3;
    if (S.anim === 'win') target = 420;
    if (S.anim === 'lose') target = 0;
    if (S.t - S.tripT < 0.7) target *= 0.25;
    if (type === 'boulder' || type === 'vine') target = 0;
    S.speed += (target - S.speed) * Math.min(1, dt * 4);
    S.cam += S.speed * dt;
    S.phase += dt * (4 + S.speed / 32);
    if (type === 'vine') S.climb += dt * (2 + cps * 2.5);
    S.climbShown += (S.pos / S.text.length - S.climbShown) * Math.min(1, dt * 5);

    if (S.startT && !S.over && !S.practice) {
      if (type === 'chase') {
        S.gap -= DANGER_RATE * dt;
        if (S.gap <= 0) { hurt(25, 'big'); S.gap = 38; }
      } else if (type === 'boulder' || type === 'vine') {
        S.strength -= DRAIN * dt;
        if (S.strength <= 0) { S.strength = 0; finish(false); }
      } else if (type === 'falling') {
        const every = Math.max(2.0, 3.4 - S.level.lesson * 0.06);
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
    if (S && S.level.type === 'boulder') x = VW * 0.5;
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
    const sp = Math.min(1.4, S.speed / 260 + 0.35);
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
      const gx = P.x - 95 * s - Math.max(0, S.gap) * VW * 0.0035 - (S.anim === 'win' ? S.animT * 200 : 0);
      if (world.chaser === 'avalanche') Art.drawAvalanche(ctx, gx + 40, ground + 5, VH, S.t);
      else if (world.chaser === 'rollingrock') {
        Art.drawRock(ctx, gx - 10, ground - 70 * s + 2, 70 * s, S.cam / 70);
      } else Art.drawBeast(ctx, world.chaser, gx - 60 * s, ground + 4, s * 0.95, S.anim === 'win' ? S.t * 3 : S.phase * 0.9 + 1, 1);
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

    // the player
    Art.drawPerson(ctx, look, pose, P.x, P.y + jumpY, s, { mood, dizzy: dizzy && hitAgo < 1, sway: Math.sin(S.phase), noShadow: inJump });
    if (inJump) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; Art.ellipse(ctx, P.x, P.y + 3, 30 * s, 5 * s); ctx.fill(); }
    if (dizzy && (hitAgo < 1 || S.anim === 'lose')) Art.drawDizzyStars(ctx, P.x + 20 * s, P.y - 150 * s + (S.anim === 'lose' ? 40 * s : 0), S.t, s);

    if (type === 'boulder') {
      const strain = Math.max(0, 1 - S.strength / 100);
      let by = P.y - (196 - strain * 14) * s, bx = P.x + 4 * s;
      if (S.anim === 'win') { bx += S.animT * 400; by -= Math.sin(Math.min(1, S.animT) * Math.PI) * 120; }
      if (S.anim === 'lose') { bx += 70 * s; by = Math.min(P.y - 50 * s, by + S.animT * 900); }
      Art.drawRock(ctx, bx, by, 52 * s, Math.sin(S.t * 30) * 0.02 * strain + (S.anim === 'win' ? S.animT * 6 : 0));
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
    if (S.anim === 'ready') banner('Type the first key to start!');
    if (S.practice && S.anim === 'ready') banner('Practice mode — no danger', 40);
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
    if (S.anim === 'ready') banner('Type the first key to start climbing!');
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
    ctx.font = 'bold 22px system-ui, sans-serif'; ctx.textAlign = 'center';
    const w = ctx.measureText(txt).width + 40, x = VW / 2, y = VH * 0.42 + dy;
    ctx.fillStyle = 'rgba(30,37,54,0.82)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - 24, w, 38, 19) : ctx.rect(x - w / 2, y - 24, w, 38); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x, y + 2);
  }

  return { init, start, stop, key, pause, state, resize, wpm, accuracy, sprinting };
})();
