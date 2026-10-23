/* Screens, menus, map, keyboard guide and input wiring */
'use strict';

const UI = (() => {
  const $ = id => document.getElementById(id);
  let profile = null;
  let currentScreen = 'scr-start';
  let keyEls = {};
  let lastFact = -1;
  const isTouchDevice = () => window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // ---------- helpers ----------
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    currentScreen = id;
    if (id !== 'scr-game') Game.stop();
    if (id === 'scr-start') startBg();
  }
  function isPhone() {
    const d = profile ? profile.settings.device : 'auto';
    if (d === 'phone') return true;
    if (d === 'laptop') return false;
    return isTouchDevice();
  }
  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    kids.flat().forEach(c => el.append(c instanceof Node ? c : document.createTextNode(c)));
    return el;
  }
  function openModal(...content) {
    const box = $('modal-box'); box.innerHTML = '';
    content.flat().forEach(c => box.append(c));
    $('modal').classList.remove('hidden');
    box.scrollTop = 0;
  }
  function closeModal() { $('modal').classList.add('hidden'); }
  function totalStars(p) { return Object.values(p.progress).reduce((a, r) => a + (r.stars || 0), 0); }
  function applyAudio() {
    Sound.setSound(profile ? profile.settings.sound : true);
    Sound.setMusic(profile ? profile.settings.music : false);
  }
  function drawAvatar(canvas, look, pose) {
    const c = canvas.getContext('2d');
    const w = canvas.width, hh = canvas.height;
    c.clearRect(0, 0, w, hh);
    const s = hh / 200;
    Art.drawPerson(c, look, pose || Art.idlePose(0), w / 2 - 6 * s, hh - 8 * s, s, { mood: 'happy' });
  }
  function headshot(canvas, look) {
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    const s = canvas.width / 70;
    Art.drawPerson(c, look, Art.idlePose(0), canvas.width / 2 - 10 * s, canvas.height + 105 * s, s, { mood: 'happy', noShadow: true });
  }

  // ---------- start screen ----------
  let bgRaf = 0;
  function startBg() {
    const cv = $('start-bg'), c = cv.getContext('2d');
    cancelAnimationFrame(bgRaf);
    const t0 = performance.now();
    const boy = Art.defaultLook('male'), girl = Art.defaultLook('female');
    const loop = now => {
      if (currentScreen !== 'scr-start') return;
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(r.width * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
      const sc = cv.height / 500, W = cv.width / sc, t = (now - t0) / 1000;
      c.setTransform(sc, 0, 0, sc, 0, 0);
      const g = Art.drawScene(c, W, 500, 'forest', t * 160, t, { simple: W < 700 });
      Art.drawBeast(c, 'wolf', W * 0.2 + Math.sin(t * 0.7) * 20, g + 4, 0.8, t * 9);
      Art.drawPerson(c, boy, Art.runPose(t * 9, 1), W * 0.55, g, 0.85, { mood: 'shout' });
      Art.drawPerson(c, girl, Art.runPose(t * 9 + 1.3, 1), W * 0.7, g, 0.85, { mood: 'shout', sway: Math.sin(t * 9) });
      bgRaf = requestAnimationFrame(loop);
    };
    bgRaf = requestAnimationFrame(loop);
  }
  function renderStart() {
    const list = $('profile-list'); list.innerHTML = '';
    if (!Store.profiles.length) list.append(h('p', { class: 'empty-note' }, 'No players yet. Create your runner to begin!'));
    Store.profiles.forEach(p => {
      const cv = h('canvas', { width: 108, height: 108 });
      const card = h('div', { class: 'profile-card', role: 'button', tabindex: '0' },
        cv,
        h('div', { class: 'pc-info' }, h('b', {}, p.name), h('small', {}, `Level ${Math.min(p.unlocked + 1, LEVELS.length)} · ★ ${totalStars(p)} · ${p.coins} coins`)),
        h('button', { class: 'pc-del', title: 'Delete player', 'aria-label': 'Delete ' + p.name, onclick: e => { e.stopPropagation(); confirmDelete(p); } }, '✕'));
      card.addEventListener('click', () => choose(p));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') choose(p); });
      list.append(card);
      headshot(cv, p.look);
    });
  }
  function confirmDelete(p) {
    openModal(h('h2', {}, 'Delete ' + p.name + '?'),
      h('p', { class: 'center' }, 'All of this player\'s progress, coins and stats will be removed from this device.'),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: closeModal }, 'Keep'),
        h('button', { class: 'btn btn-danger', onclick: () => { Store.remove(p.id); closeModal(); renderStart(); } }, 'Delete')));
  }
  function choose(p) {
    Sound.unlock(); Sound.play('click');
    Store.select(p.id); profile = p; applyAudio();
    openSettings(true);
  }

  // ---------- settings ----------
  function openSettings(thenMap) {
    const st = profile.settings;
    const seg = (key, opts) => {
      const wrap = h('div', { class: 'seg wrap' });
      opts.forEach(([val, label]) => {
        const b = h('button', { class: st[key] === val ? 'on' : '' }, label);
        b.addEventListener('click', () => {
          st[key] = val; Store.save(); applyAudio(); Sound.play('click');
          wrap.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
          if (key === 'device') updateDeviceNote();
        });
        wrap.append(b);
      });
      return wrap;
    };
    const onOff = key => seg(key, [[true, 'On'], [false, 'Off']]);
    const row = (label, note, ctrl) => h('div', { class: 'set-row' }, h('div', { class: 'sr-label' }, label, note ? h('small', {}, note) : ''), ctrl);
    const devNote = h('small', {});
    function updateDeviceNote() { devNote.textContent = 'Right now: ' + (isPhone() ? 'Phone / touch' : 'Laptop / keyboard'); }
    updateDeviceNote();
    openModal(
      h('h2', {}, profile.name + '\'s settings'),
      row('Mode', 'Practice has no danger. Challenge brings the danger!', seg('mode', [['practice', 'Practice'], ['challenge', 'Challenge']])),
      row('Win style', 'Speed goal: 90% accuracy + the level\'s minimum speed. Survival: reach the finish alive.', seg('winStyle', [['speed', 'Speed goal'], ['survival', 'Survival']])),
      h('div', { class: 'set-row' }, h('div', { class: 'sr-label' }, 'Device', h('small', {}, 'Tablets with a physical keyboard: choose Laptop.'), devNote),
        seg('device', [['auto', 'Auto'], ['laptop', 'Laptop'], ['phone', 'Phone']])),
      row('Finger guide', 'On-screen keyboard and hands', onOff('fingerGuide')),
      row('Sound', '', onOff('sound')),
      row('Music', '', onOff('music')),
      row('Blood', 'Small red drops when hit. Off shows white puffs.', onOff('blood')),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); editLook(); } }, 'Edit look'),
        h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); if (thenMap || currentScreen === 'scr-map') openMap(); } }, thenMap ? 'Play ▶' : 'Done')));
  }

  // ---------- profile creator ----------
  let draft = null, editing = null, previewRaf = 0;
  function newProfile() { editing = null; draft = Art.defaultLook('male'); draft.gender = null; $('c-name').value = ''; renderCreate(); show('scr-create'); previewLoop(); }
  function editLook() { editing = profile; draft = Object.assign({}, profile.look); $('c-name').value = profile.name; renderCreate(); show('scr-create'); previewLoop(); }
  function renderCreate() {
    const g = $('c-gender'); g.innerHTML = '';
    [['male', '♂ Male'], ['female', '♀ Female']].forEach(([v, label]) => {
      g.append(h('button', { class: draft.gender === v ? 'on' : '', onclick: () => {
        if (draft.gender !== v) { const keep = { skin: draft.skin, hairColor: draft.hairColor }; draft = Object.assign(Art.defaultLook(v), keep); }
        Sound.play('click'); renderCreate();
      } }, label));
    });
    $('c-rest').classList.toggle('hidden', !draft.gender);
    $('c-save').disabled = !draft.gender;
    if (!draft.gender) return;
    const O = Art.OPTIONS[draft.gender];
    const segOpts = (id, key, opts) => {
      const el = $(id); el.innerHTML = '';
      opts.forEach(([v, label]) => el.append(h('button', { class: draft[key] === v ? 'on' : '', onclick: () => { draft[key] = v; renderCreate(); } }, label)));
    };
    const sw = (id, key, colors) => {
      const el = $(id); el.innerHTML = '';
      colors.forEach(c => el.append(h('button', { class: 'swatch' + (draft[key] === c ? ' on' : ''), style: 'background:' + c, 'aria-label': key + ' ' + c, onclick: () => { draft[key] = c; renderCreate(); } })));
    };
    sw('c-skin', 'skin', Art.SKINS);
    segOpts('c-hair', 'hair', O.hair);
    sw('c-haircolor', 'hairColor', Art.HAIR_COLORS);
    segOpts('c-top', 'top', O.top);
    sw('c-topcolor', 'topColor', Art.OUTFIT_COLORS);
    $('c-bottom-label').textContent = draft.gender === 'female' ? 'Skirt' : 'Pants';
    segOpts('c-bottom', 'bottom', O.bottom);
    sw('c-bottomcolor', 'bottomColor', Art.BOTTOM_COLORS);
    sw('c-shoes', 'shoes', Art.SHOE_COLORS);
  }
  function previewLoop() {
    cancelAnimationFrame(previewRaf);
    const cv = $('create-canvas'), c = cv.getContext('2d');
    const t0 = performance.now();
    const loop = now => {
      if (currentScreen !== 'scr-create') return;
      const t = (now - t0) / 1000;
      c.clearRect(0, 0, cv.width, cv.height);
      c.fillStyle = '#7cc35a'; c.fillRect(0, 300, cv.width, 60);
      c.fillStyle = '#e2bb7d'; c.fillRect(0, 312, cv.width, 30);
      if (draft.gender) {
        const running = Math.floor(t / 3) % 2 === 1;
        const pose = running ? Art.runPose(t * 8, 0.9) : Art.idlePose(t);
        Art.drawPerson(c, draft, pose, 150, 326, 1.45, { mood: running ? 'shout' : 'happy', sway: Math.sin(t * 8) });
      } else {
        c.fillStyle = '#1e2536'; c.font = 'bold 22px Fredoka, sans-serif'; c.textAlign = 'center';
        c.fillText('Choose Male or Female', 150, 150); c.fillText('to start', 150, 180);
      }
      previewRaf = requestAnimationFrame(loop);
    };
    previewRaf = requestAnimationFrame(loop);
  }
  function saveCreate() {
    if (!draft.gender) return;
    const name = $('c-name').value.trim() || (draft.gender === 'female' ? 'Runner Girl' : 'Runner Boy');
    if (editing) { editing.look = Object.assign({}, draft); editing.name = name; Store.save(); profile = editing; openMap(); return; }
    profile = Store.create(name, Object.assign({}, draft));
    applyAudio();
    openSettings(true);
    show('scr-start'); renderStart();
  }

  // ---------- map ----------
  const ROW_H = 120, BAND_PAD = 160;
  let mapLayout = [], spriteRaf = 0;
  function openMap() {
    if (!profile) { show('scr-start'); return; }
    show('scr-map');
    $('map-name').textContent = profile.name;
    $('map-mode').textContent = (profile.settings.mode === 'practice' ? 'Practice' : 'Challenge') + ' · ' + (profile.settings.winStyle === 'speed' ? 'Speed goal' : 'Survival');
    $('map-coins').textContent = profile.coins;
    $('map-stars').textContent = totalStars(profile) + ' / ' + LEVELS.length * 3;
    headshot($('map-avatar'), profile.look);
    renderMap();
  }
  function renderMap() {
    const inner = $('map-inner'); inner.innerHTML = '';
    mapLayout = [];
    let y = 0;
    const bands = [];
    WORLDS.forEach((w, wi) => {
      const lv = LEVELS.filter(l => l.world === wi);
      const top = y;
      y += BAND_PAD;
      lv.forEach((l, k) => {
        const x = 50 + Math.sin((l.index) * 0.95) * 28;
        mapLayout[l.index] = { x, y };
        y += ROW_H;
      });
      y += 10;
      bands.push({ w, top, height: y - top });
    });
    inner.style.height = y + 40 + 'px';
    bands.forEach(({ w, top, height }) => {
      const T = Art.THEMES[w.theme];
      const band = h('div', { class: 'world-band', style: `top:${top}px;height:${height}px;background:linear-gradient(${T.sky[0]}, ${T.hill} 45%, ${T.ground});` },
        h('div', { class: 'wb-title' }, w.name, h('small', {}, w.blurb + ' Keys: ' + w.lessons.map(li => LESSONS[li].name).join(', '))));
      inner.append(band);
    });
    // dotted path
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'map-svg');
    svg.setAttribute('viewBox', `0 0 100 ${y + 40}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    const mk = (d, stroke, w, dash) => {
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke);
      p.setAttribute('stroke-width', w); p.setAttribute('vector-effect', 'non-scaling-stroke');
      p.setAttribute('stroke-linecap', 'round');
      if (dash) p.setAttribute('stroke-dasharray', dash);
      svg.append(p);
    };
    let d = '';
    mapLayout.forEach((p, i) => { d += (i ? ' L' : 'M') + p.x + ' ' + p.y; });
    mk(d, '#c99a5c', 26); mk(d, '#ecd09a', 18); mk(d, '#fff', 4, '2 14');
    inner.append(svg);
    LEVELS.forEach(l => {
      const p = mapLayout[l.index];
      const rec = profile.progress[l.index];
      const locked = l.index > profile.unlocked;
      const cls = 'node' + (locked ? ' locked' : '') + (rec && rec.stars ? ' done' : '') + (l.index === profile.unlocked ? ' current' : '') + (l.index === profile.justUnlocked ? ' unlocking' : '');
      const n = h('button', { class: cls, style: `left:${p.x}%;top:${p.y}px`, 'aria-label': `Level ${l.index + 1}: ${l.title}${locked ? ' (locked)' : ''}` },
        locked ? '🔒' : String(l.index + 1),
        h('span', { class: 'ntype' }, TYPE_INFO[l.type].name),
        rec && rec.stars ? h('span', { class: 'nstars' }, '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : '');
      if (!locked) n.addEventListener('click', () => walkTo(l.index, () => levelIntro(l.index)));
      inner.append(n);
    });
    const sp = h('canvas', { id: 'map-sprite', width: 180, height: 220 });
    inner.append(sp);
    const from = profile.mapPos != null ? Math.min(profile.mapPos, profile.unlocked) : profile.unlocked;
    placeSprite(from, null);
    const scroller = $('map-scroll');
    requestAnimationFrame(() => {
      scroller.scrollTop = Math.max(0, mapLayout[from].y - scroller.clientHeight / 2);
      if (from !== profile.unlocked) setTimeout(() => walkTo(profile.unlocked), 350);
      profile.justUnlocked = null;
    });
  }
  function placeSprite(i, pose) {
    const sp = $('map-sprite'); if (!sp) return;
    const p = typeof i === 'number' ? mapLayout[i] : i;
    sp.style.left = p.x + '%'; sp.style.top = p.y + 'px';
    drawAvatar(sp, profile.look, pose);
  }
  function walkTo(target, done) {
    cancelAnimationFrame(spriteRaf);
    const start = profile.mapPos != null ? profile.mapPos : profile.unlocked;
    if (start === target) { placeSprite(target); profile.mapPos = target; Store.save(); if (done) done(); return; }
    const dir = target > start ? 1 : -1;
    const steps = Math.abs(target - start);
    const dur = Math.min(2600, 650 * steps);
    const t0 = performance.now();
    const scroller = $('map-scroll');
    const loop = now => {
      if (currentScreen !== 'scr-map') return;
      const k = Math.min(1, (now - t0) / dur);
      const f = k * steps, seg = Math.min(steps - 1, Math.floor(f)), u = f - seg;
      const a = mapLayout[start + seg * dir], b = mapLayout[start + (seg + 1) * dir];
      const p = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
      placeSprite(p, Art.runPose(now / 60, 0.7));
      scroller.scrollTop += ((p.y - scroller.clientHeight / 2) - scroller.scrollTop) * 0.1;
      if (k < 1) spriteRaf = requestAnimationFrame(loop);
      else { profile.mapPos = target; Store.save(); placeSprite(target); if (done) done(); }
    };
    spriteRaf = requestAnimationFrame(loop);
  }

  function levelIntro(i) {
    const l = LEVELS[i], w = WORLDS[l.world], L = LESSONS[l.lesson];
    const phone = isPhone();
    const keys = (L.review ? [] : L.keys).filter(k => !(phone && /[;,.]/.test(k)));
    const st = profile.settings;
    const rec = profile.progress[i];
    const goal = st.winStyle === 'speed' ? `Goal: 90% accuracy and ${l.minWpm} WPM` : 'Goal: reach the finish line alive';
    openModal(
      h('h2', {}, `Level ${i + 1}`),
      h('p', { class: 'center' }, h('b', {}, w.name), ' — ', l.title),
      keys.length ? h('div', { class: 'intro-keys' }, keys.map(k => {
        const f = KEY_INFO[k].finger;
        return h('div', { class: 'kcap', style: 'background:' + FINGER_COLORS[f] }, keyLabel(k));
      })) : '',
      keys.length ? h('p', { class: 'center' }, keys.map(k => `${keyLabel(k)}: ${FINGER_NAMES[KEY_INFO[k].finger]}`).join(' · ')) : '',
      h('div', { class: 'intro-meta' },
        h('span', { class: 'chip' }, TYPE_INFO[l.type].name),
        h('span', { class: 'chip' }, 'Min speed ' + l.minWpm + ' WPM'),
        h('span', { class: 'chip' }, st.mode === 'practice' ? 'Practice' : 'Challenge'),
        rec ? h('span', { class: 'chip' }, 'Best: ' + Math.round(rec.bestWpm || 0) + ' WPM') : ''),
      h('p', { class: 'center' }, st.mode === 'practice' ? 'Practice mode: no danger, just type!' : TYPE_INFO[l.type].tip),
      h('p', { class: 'center' }, h('b', {}, goal)),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: closeModal }, 'Back'),
        h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); startLevel(i); } }, 'Start ▶')));
  }

  // ---------- in-level ----------
  let levelIdx = 0;
  function startLevel(i) {
    levelIdx = i;
    const phone = isPhone();
    document.body.classList.toggle('phone', phone);
    show('scr-game');
    $('kbd-area').classList.toggle('hidden', !profile.settings.fingerGuide || phone);
    const l = LEVELS[i];
    $('level-tag').textContent = `Level ${i + 1} · ${WORLDS[l.world].name} · ${l.title}`;
    if (phone) focusInput();
    requestAnimationFrame(() => {
      Game.resize();
      Game.start(l, profile, { onChange: renderHud, onEnd: showResults });
    });
  }
  function focusInput() {
    const inp = $('hidden-input');
    inp.value = '';
    try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
  }
  function renderHud(S) {
    const sf = $('hud-strength');
    sf.style.width = Math.max(0, S.strength) + '%';
    sf.classList.toggle('low', S.strength < 35);
    $('hud-coins').textContent = profile.coins;
    const prog = S.pos / S.text.length;
    $('esc-me').style.left = (6 + prog * 88) + '%';
    const red = $('esc-danger');
    if (S.level.type === 'chase' && !S.practice) {
      red.style.display = '';
      red.style.left = Math.max(2, 6 + prog * 88 - 4 - Math.max(0, S.gap) * 0.3) + '%';
    } else red.style.display = 'none';
    // tiles
    const phone = document.body.classList.contains('phone') || window.innerWidth < 640;
    const before = phone ? 1 : 2, after = phone ? 4 : 6;
    const tiles = $('tiles'); tiles.innerHTML = '';
    for (let k = S.pos - before; k <= S.pos + after; k++) {
      const ch = S.text[k];
      let cls = 'tile';
      if (ch === undefined) { tiles.append(h('div', { class: 'tile', style: 'visibility:hidden' }, '')); continue; }
      if (k < S.pos) cls += ' done'; else if (k === S.pos) cls += ' cur';
      if (ch === ' ') cls += ' space';
      tiles.append(h('div', { class: cls }, ch === ' ' ? '␣' : ch));
    }
    // text line
    const tl = $('textline');
    tl.innerHTML = '';
    tl.append(h('span', { class: 'done' }, S.text.slice(0, S.pos)));
    if (S.pos < S.text.length) tl.append(h('span', { class: 'cur' }, S.text[S.pos] === ' ' ? ' ' : S.text[S.pos]));
    tl.append(h('span', {}, S.text.slice(S.pos + 1)));
    // streak
    const sk = $('streak');
    sk.classList.toggle('show', S.streak >= 3);
    const was = sk.dataset.sprint === '1', now = S.streak >= 8;
    sk.textContent = 'STREAK x' + S.streak + (now ? ' · SPRINT!' : '');
    sk.dataset.sprint = now ? '1' : '0';
    if (now && !was) { sk.classList.remove('sprint'); void sk.offsetWidth; sk.classList.add('sprint'); }
    // keyboard
    highlightKey(S.text[S.pos]);
    $('tap-hint').classList.toggle('show', document.activeElement !== $('hidden-input') && !S.over);
  }
  function flashError() {
    const cur = document.querySelector('#tiles .tile.cur');
    if (cur) { cur.classList.remove('err'); void cur.offsetWidth; cur.classList.add('err'); }
  }

  // ---------- keyboard + hands ----------
  function buildKeyboard(container, mini) {
    container.innerHTML = '';
    const map = {};
    const rows = mini ? KEY_ROWS.slice(1) : KEY_ROWS;
    rows.forEach((row, ri) => {
      const r = h('div', { class: 'krow', style: mini ? '' : `padding-left:${[0, 22, 34, 56, 0][ri + (mini ? 1 : 0)]}px` });
      if (mini) r.style.paddingLeft = [0, 5, 9, 14, 0][ri + 1] + 'px';
      row.forEach(([k, f]) => {
        const el = h('div', { class: 'key' + (k === ' ' ? ' space' : '') + (k === 'f' || k === 'j' ? ' bump' : ''), style: 'background:' + FINGER_COLORS[f] }, k === ' ' ? (mini ? '' : 'space') : k.toUpperCase());
        map[k] = el; r.append(el);
      });
      container.append(r);
    });
    return map;
  }
  function buildHands() {
    const fingers = {
      l: [['lp', 6, 46], ['lr', 28, 62], ['lm', 50, 70], ['li', 72, 62], ['th', 96, 34]],
      r: [['th', 2, 34], ['ri', 28, 62], ['rm', 50, 70], ['rr', 72, 62], ['rp', 94, 46]]
    };
    ['l', 'r'].forEach(side => {
      const el = $('hand-' + side); el.innerHTML = '';
      fingers[side].forEach(([f, left, hgt]) => {
        const isThumb = f === 'th';
        const fe = h('div', { class: 'finger', 'data-f': f, style: `left:${left}px;height:${hgt}px;color:${FINGER_COLORS[f]};${isThumb ? 'bottom:22px;transform:rotate(' + (side === 'l' ? 40 : -40) + 'deg)' : ''}` });
        el.append(fe);
      });
      el.append(h('div', { class: 'palm' }));
      el.querySelectorAll('.finger').forEach(fe => fe.style.background = '');
    });
  }
  function highlightKey(k) {
    Object.values(keyEls).forEach(el => el.classList.remove('next'));
    document.querySelectorAll('.hand .finger').forEach(f => f.classList.remove('hl'));
    if (k == null) return;
    if (keyEls[k]) keyEls[k].classList.add('next');
    const f = KEY_INFO[k] && KEY_INFO[k].finger;
    if (!f) return;
    if (f === 'th') document.querySelectorAll('.hand .finger[data-f="th"]').forEach(x => x.classList.add('hl'));
    else {
      const side = f[0] === 'l' ? 'l' : 'r';
      const el = document.querySelector(`#hand-${side} .finger[data-f="${f}"]`);
      if (el) el.classList.add('hl');
    }
    // color the finger tip by its key color
    document.querySelectorAll('.hand .finger.hl').forEach(x => { x.style.background = FINGER_COLORS[f]; });
    document.querySelectorAll('.hand .finger:not(.hl)').forEach(x => { x.style.background = ''; });
  }

  // ---------- key guide ----------
  const GUIDE_KEYS = 'asdfghjkl;qwertyuiopzxcvbnm,. '.split('');
  function keyTip(k) {
    const info = KEY_INFO[k], f = info.finger;
    if (k === ' ') return 'Tap the space bar with either thumb while your fingers stay on the home row.';
    const home = HOME_KEYS[f];
    if (info.row === 2 && home === k) return `${keyLabel(k)} is a home key: your ${FINGER_NAMES[f].toLowerCase()} rests here.` + (k === 'f' || k === 'j' ? ' Feel for its bump!' : '');
    if (info.row === 2) return `Slide your ${FINGER_NAMES[f].toLowerCase()} sideways from ${keyLabel(home)} to ${keyLabel(k)}, then back home.`;
    const dir = info.row < 2 ? 'up' : 'down';
    return `Reach ${dir} from ${keyLabel(home)} with your ${FINGER_NAMES[f].toLowerCase()}, then return to ${keyLabel(home)}.`;
  }
  function keyCard(k) {
    const info = KEY_INFO[k], f = info.finger;
    const mk = h('div', { class: 'mini-kbd' });
    const m = buildKeyboard(mk, true);
    if (m[k]) m[k].classList.add('next');
    return h('div', { class: 'kcard', id: 'kcard-' + (k === ' ' ? 'space' : k.charCodeAt(0)) },
      h('div', { class: 'kcard-head' },
        h('div', { class: 'kcap', style: 'background:' + FINGER_COLORS[f] + (k === ' ' ? ';font-size:1rem' : '') }, keyLabel(k)),
        h('div', {}, h('b', {}, FINGER_NAMES[f]), h('small', {}, (k === ' ' ? 'Bottom of the keyboard' : ROW_NAMES[info.row][0].toUpperCase() + ROW_NAMES[info.row].slice(1))))),
      mk,
      h('p', {}, keyTip(k)));
  }
  let guideBack = 'scr-start';
  function openGuide(focusKey) {
    guideBack = currentScreen === 'scr-guide' ? guideBack : currentScreen;
    show('scr-guide');
    const legend = $('guide-legend'); legend.innerHTML = '';
    ['lp', 'lr', 'lm', 'li', 'ri', 'th'].forEach(f => legend.append(h('span', { style: 'background:' + FINGER_COLORS[f] },
      { lp: 'Pinkies', lr: 'Ring fingers', lm: 'Middle fingers', li: 'Left index', ri: 'Right index', th: 'Thumbs' }[f])));
    const cards = $('guide-cards'); cards.innerHTML = '';
    GUIDE_KEYS.forEach(k => cards.append(keyCard(k)));
  }
  function helpForCurrentKey() {
    const S = Game.state(); if (!S) return;
    Game.pause(true);
    const k = S.text[S.pos] || 'f';
    openModal(h('h2', {}, 'Key help'), keyCard(k),
      h('div', { class: 'row-btns' }, h('button', { class: 'btn btn-gold', onclick: resume }, 'Back to the escape ▶')));
  }
  function resume() {
    closeModal(); Game.pause(false);
    if (document.body.classList.contains('phone')) focusInput();
  }
  function pauseMenu() {
    const S = Game.state(); if (!S || S.over) return;
    Game.pause(true);
    openModal(h('h2', {}, 'Paused'),
      h('div', { class: 'row-btns', style: 'justify-content:center' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); openMap(); } }, 'Quit to map'),
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); startLevel(levelIdx); } }, 'Restart'),
        h('button', { class: 'btn btn-gold', onclick: resume }, 'Resume ▶')));
  }

  // ---------- results ----------
  function nextFact() {
    let i;
    do { i = Math.floor(Math.random() * FACTS.length); } while (i === lastFact && FACTS.length > 1);
    lastFact = i;
    return FACTS[i];
  }
  function showResults(r) {
    const l = LEVELS[levelIdx], st = profile.settings;
    // save progress + stats
    const rec = profile.progress[levelIdx] || { stars: 0, bestWpm: 0, bestAcc: 0, plays: 0 };
    rec.plays++;
    rec.bestWpm = Math.max(rec.bestWpm, r.wpm); rec.bestAcc = Math.max(rec.bestAcc, r.acc);
    rec.stars = Math.max(rec.stars, r.stars);
    profile.progress[levelIdx] = rec;
    profile.coins += r.coins;
    const s = profile.stats;
    s.keys += r.correct + r.errors; s.errors += r.errors; s.levelsPlayed++; if (r.win) s.levelsWon++;
    s.bestWpm = Math.max(s.bestWpm, r.wpm);
    for (const [k, n] of Object.entries(r.keyErrors)) s.keyErrors[k] = (s.keyErrors[k] || 0) + n;
    let unlockedNew = false;
    if (r.win && levelIdx === profile.unlocked && profile.unlocked < LEVELS.length - 1) {
      profile.unlocked++; unlockedNew = true; profile.justUnlocked = profile.unlocked;
    }
    profile.mapPos = levelIdx;
    Store.save();

    const title = r.win ? (r.reachedEnd ? 'You escaped!' : 'Well done!') : (r.died ? (l.type === 'vine' ? 'You lost your grip!' : l.type === 'boulder' ? 'The boulder was too heavy!' : 'You got caught!') : 'Not fast enough yet!');
    const okW = r.wpm >= l.minWpm, okA = r.acc >= 90;
    const goal = st.winStyle === 'speed'
      ? h('p', { class: 'goal-line' }, 'Goal: ', h('span', { class: okA ? 'ok' : 'no' }, '90% accuracy ' + (okA ? '✔' : '✘')), ' and ', h('span', { class: okW ? 'ok' : 'no' }, l.minWpm + ' WPM ' + (okW ? '✔' : '✘')))
      : h('p', { class: 'goal-line' }, 'Goal: reach the finish alive ', h('span', { class: r.reachedEnd ? 'ok' : 'no' }, r.reachedEnd ? '✔' : '✘'));
    const stars = h('div', { class: 'res-stars' }, [0, 1, 2].map(i => h('span', { class: i < r.stars ? 'on' : '', style: `animation-delay:${0.2 + i * 0.25}s` }, '★')));
    setTimeout(() => { for (let i = 0; i < r.stars; i++) setTimeout(() => Sound.play('star'), i * 250); }, 200);
    const hasNext = levelIdx < LEVELS.length - 1 && levelIdx + 1 <= profile.unlocked;
    openModal(
      h('h2', { class: r.win ? 'win' : 'lose' }, title),
      stars,
      h('div', { class: 'res-grid' },
        h('div', {}, h('b', {}, Math.round(r.wpm)), h('small', {}, 'WPM speed')),
        h('div', {}, h('b', {}, Math.round(r.acc) + '%'), h('small', {}, 'Accuracy')),
        h('div', {}, h('b', {}, r.bestStreak), h('small', {}, 'Best streak')),
        h('div', {}, h('b', {}, '+' + r.coins), h('small', {}, 'Coins'))),
      goal,
      unlockedNew ? h('p', { class: 'goal-line' }, h('span', { class: 'ok' }, '🔓 Level ' + (profile.unlocked + 1) + ' unlocked!')) : '',
      h('div', { class: 'fact' }, h('b', {}, 'Did you know? '), nextFact()),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); openMap(); } }, 'Map'),
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); startLevel(levelIdx); } }, 'Retry ↻'),
        hasNext ? h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); profile.mapPos = levelIdx + 1; startLevel(levelIdx + 1); } }, 'Next ▶') : ''));
    if (document.body.classList.contains('phone')) $('hidden-input').blur();
  }

  // ---------- input ----------
  function onKeyDown(e) {
    if (currentScreen !== 'scr-game') return;
    if (!$('modal').classList.contains('hidden')) {
      if (e.key === 'Escape') { const S = Game.state(); if (S && S.paused) resume(); }
      return;
    }
    if (e.target === $('hidden-input')) return; // handled by the input event
    if (e.key === 'Escape') { pauseMenu(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1) {
      e.preventDefault();
      Game.key(e.key.toLowerCase());
    }
  }
  function onHiddenInput(e) {
    const inp = e.target;
    const v = inp.value;
    inp.value = '';
    if (!$('modal').classList.contains('hidden')) return;
    for (const ch of v) Game.key(ch.toLowerCase());
  }

  function fitViewport() {
    const vv = window.visualViewport;
    const hgt = vv ? vv.height : window.innerHeight;
    document.documentElement.style.setProperty('--app-h', hgt + 'px');
    window.scrollTo(0, 0);
    if (currentScreen === 'scr-game') Game.resize();
  }

  function init() {
    Store.load();
    Game.init($('scene'));
    keyEls = buildKeyboard($('kbd'), false);
    buildHands();
    profile = Store.current();
    $('btn-new').addEventListener('click', () => { Sound.unlock(); newProfile(); });
    $('btn-guide-start').addEventListener('click', () => openGuide());
    $('c-cancel').addEventListener('click', () => { if (editing) openMap(); else { show('scr-start'); renderStart(); } });
    $('c-save').addEventListener('click', saveCreate);
    $('btn-map-guide').addEventListener('click', () => openGuide());
    $('btn-map-settings').addEventListener('click', () => openSettings(false));
    $('btn-map-switch').addEventListener('click', () => { show('scr-start'); renderStart(); });
    $('btn-guide-back').addEventListener('click', () => { if (guideBack === 'scr-map' && profile) openMap(); else { show('scr-start'); renderStart(); } });
    $('btn-help').addEventListener('click', helpForCurrentKey);
    $('btn-pause').addEventListener('click', pauseMenu);
    $('stage').addEventListener('pointerdown', e => { if (isPhone() && !e.target.closest('button')) focusInput(); });
    const inp = $('hidden-input');
    inp.addEventListener('input', onHiddenInput);
    inp.addEventListener('focus', () => $('tap-hint').classList.remove('show'));
    inp.addEventListener('blur', () => { const S = Game.state(); if (S && !S.over && currentScreen === 'scr-game') $('tap-hint').classList.add('show'); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    document.addEventListener('keydown', onKeyDown);
    $('modal').addEventListener('click', e => { if (e.target === $('modal') && currentScreen !== 'scr-game') closeModal(); });
    window.addEventListener('resize', fitViewport);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fitViewport);
    fitViewport();
    renderStart();
    show('scr-start');
  }

  return { init, isPhone, flashError, show };
})();

window.addEventListener('DOMContentLoaded', UI.init);
