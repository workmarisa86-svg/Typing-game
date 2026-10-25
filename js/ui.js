/* Screens, menus, map, shop, stats, parent view, certificates, key guide and input wiring */
'use strict';

const APP_VERSION = '3.2.0';

const UI = (() => {
  const $ = id => document.getElementById(id);
  let profile = null;
  let currentScreen = 'scr-start';
  let keyEls = {};
  let lastFact = -1;
  const isTouchDevice = () => window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const lang = () => profile ? profile.settings.uiLang : Store.uiLang;
  const typeLang = () => profile ? profile.settings.typeLang : 'en';

  // ---------- helpers ----------
  function show(id) {
    const prev = document.querySelector('.screen.active');
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    if (prev && prev.id !== id) { const n = $(id); n.classList.remove('enter'); void n.offsetWidth; n.classList.add('enter'); }
    currentScreen = id;
    if (id !== 'scr-game') Game.stop();
    if (id !== 'scr-piano' && typeof Piano !== 'undefined') Piano.stop();
    if (id === 'scr-start') startBg();
    document.documentElement.lang = lang();
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
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    kids.flat().forEach(c => { if (c == null || c === '') return; el.append(c instanceof Node ? c : document.createTextNode(c)); });
    return el;
  }
  function openModal(...content) {
    const box = $('modal-box'); box.innerHTML = '';
    box.className = 'modal-box panel';
    content.flat().forEach(c => { if (c) box.append(c); });
    $('modal').classList.remove('hidden');
    box.scrollTop = 0;
    return box;
  }
  function closeModal() { $('modal').classList.add('hidden'); }
  function toast(msg, ms = 1800) {
    const el = $('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), ms);
  }
  function totalStars(p) { return Object.values(p.progress).reduce((a, r) => a + (r.stars || 0), 0); }
  function wonCount(p) { return Object.values(p.progress).filter(r => r.won).length; }
  function applyAudio() {
    const vol = profile && profile.settings.volume != null ? profile.settings.volume / 100 : 0.8;
    Sound.setSound(profile ? profile.settings.sound : true);
    Sound.setMusic(profile ? profile.settings.music : false);
    Sound.setVolume(vol);
    if (typeof PianoAudio !== 'undefined') PianoAudio.setVolume(vol);
  }
  function applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', t(el.dataset.i18nTitle)); });
    document.documentElement.lang = lang();
    $('c-name').placeholder = t('namePh');
    $('lang-en').classList.toggle('on', Store.uiLang === 'en');
    $('lang-es').classList.toggle('on', Store.uiLang === 'es');
  }
  function drawAvatar(canvas, look, pose) {
    const c = canvas.getContext('2d');
    const w = canvas.width, hh = canvas.height;
    c.clearRect(0, 0, w, hh);
    const s = hh / 230;
    Art.drawPerson(c, look, pose || Art.idlePose(0), w / 2 - 6 * s, hh - 8 * s, s, { mood: 'happy' });
  }
  function headshot(canvas, look) {
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    const s = canvas.width / 70;
    Art.drawPerson(c, look, Art.idlePose(0), canvas.width / 2 - 10 * s, canvas.height + 105 * s, s, { mood: 'happy', noShadow: true });
  }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleDateString(lang() === 'es' ? 'es' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return ''; }
  }

  // ---------- levels for the current profile ----------
  const levelCache = {};
  function levels(p = profile) {
    const key = p.settings.typeLang + (isPhoneFor(p) ? 'P' : 'L');
    return levelCache[key] || (levelCache[key] = buildLevels({ typeLang: p.settings.typeLang, phone: isPhoneFor(p) }));
  }
  function isPhoneFor(p) { const d = p.settings.device; return d === 'phone' || (d === 'auto' && isTouchDevice()); }
  const rec = (p, id) => p.progress[id];
  const won = (p, l) => !!(l && rec(p, l.id) && rec(p, l.id).won);
  function unlocked(p, list, i) { return i === 0 || won(p, list[i - 1]) || won(p, list[i]); }
  function frontier(p, list) { for (let i = 0; i < list.length; i++) if (!won(p, list[i])) return i; return list.length - 1; }

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
      if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
      const sc = cv.height / 500, W = cv.width / sc, tt = (now - t0) / 1000;
      c.setTransform(sc, 0, 0, sc, 0, 0);
      const g = Art.drawScene(c, W, 500, 'forest', tt * 160, tt, { simple: W < 700 });
      Art.drawBeast(c, 'wolf', W * 0.2 + Math.sin(tt * 0.7) * 20, g + 4, 0.8, tt * 9);
      Art.drawPerson(c, boy, Art.runPose(tt * 9, 1), W * 0.55, g, 0.85, { mood: 'shout' });
      Art.drawPerson(c, girl, Art.runPose(tt * 9 + 1.3, 1), W * 0.7, g, 0.85, { mood: 'shout', sway: Math.sin(tt * 9) });
      bgRaf = requestAnimationFrame(loop);
    };
    bgRaf = requestAnimationFrame(loop);
  }
  function renderStart() {
    profile = null;
    applyStatic();
    const list = $('profile-list'); list.innerHTML = '';
    if (!Store.profiles.length) list.append(h('p', { class: 'empty-note' }, t('noPlayers')));
    Store.profiles.forEach(p => {
      const cv = h('canvas', { width: 108, height: 108 });
      const card = h('div', { class: 'profile-card', role: 'button', tabindex: '0' },
        cv,
        h('div', { class: 'pc-info' }, h('b', {}, p.name), h('small', {}, `${t('levelsDone')}: ${wonCount(p)} · ★ ${totalStars(p)} · ${p.coins} ${t('coins')}`)),
        h('button', { class: 'pc-del', title: t('deletePlayer'), 'aria-label': t('deletePlayer') + ' ' + p.name, onclick: e => { e.stopPropagation(); confirmDelete(p); } }, '✕'));
      card.addEventListener('click', () => choose(p));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') choose(p); });
      list.append(card);
      headshot(cv, p.look);
    });
    $('btn-parent').classList.toggle('hidden', Store.profiles.length === 0);
    $('version').textContent = 'v' + APP_VERSION;
  }
  function confirmDelete(p) {
    openModal(h('h2', {}, t('deleteQ', p.name)),
      h('p', { class: 'center' }, t('deleteWarn')),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: closeModal }, t('keep')),
        h('button', { class: 'btn btn-danger', onclick: () => { Store.remove(p.id); closeModal(); renderStart(); } }, t('delete'))));
  }
  function choose(p) {
    Sound.unlock(); Sound.play('click');
    Store.select(p.id); profile = p; applyAudio(); applyStatic();
    openSettings(true);
  }

  // ---------- settings ----------
  function openSettings(thenMap) {
    const st = profile.settings;
    const seg = (key, opts, after) => {
      const wrap = h('div', { class: 'seg wrap' });
      opts.forEach(([val, label]) => {
        const b = h('button', { class: st[key] === val ? 'on' : '' }, label);
        b.addEventListener('click', () => {
          st[key] = val; Store.save(); applyAudio(); Sound.play('click');
          wrap.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
          if (after) after();
        });
        wrap.append(b);
      });
      return wrap;
    };
    const onOff = key => seg(key, [[true, t('on')], [false, t('off')]]);
    const row = (label, note, ctrl) => h('div', { class: 'set-row' }, h('div', { class: 'sr-label' }, label, note ? h('small', {}, note) : ''), ctrl);
    const devNote = h('small', {});
    const updateDeviceNote = () => { devNote.textContent = t('rightNow') + ': ' + (isPhone() ? t('phoneTouch') : t('laptopKeys')); };
    updateDeviceNote();
    openModal(
      h('h2', {}, t('settingsOf', profile.name)),
      row(t('menuLang'), t('menuLangNote'), seg('uiLang', [['en', 'English'], ['es', 'Español']], () => { Store.uiLang = st.uiLang; applyStatic(); openSettings(thenMap); })),
      row(t('typeLangL'), t('typeLangNote'), seg('typeLang', [['en', 'English'], ['es', 'Español']])),
      row(t('verseMode'), t('verseNote'), onOff('verse')),
      row(t('mode'), t('modeNote'), seg('mode', [['practice', t('practice')], ['challenge', t('challenge')]])),
      row(t('winStyle'), t('winStyleNote'), seg('winStyle', [['speed', t('speedGoal')], ['survival', t('survival')]])),
      h('div', { class: 'set-row' }, h('div', { class: 'sr-label' }, t('device'), h('small', {}, t('deviceNote')), devNote),
        seg('device', [['auto', t('auto')], ['laptop', t('laptop')], ['phone', t('phone')]], updateDeviceNote)),
      row(t('fingerGuide'), t('fingerGuideNote'), onOff('fingerGuide')),
      row(t('volume'), t('volumeNote'), (() => {
        const v = st.volume == null ? 80 : st.volume;
        const out = h('span', { class: 'vol-val' }, v + '%');
        const inp = h('input', { type: 'range', min: '0', max: '100', step: '5', value: String(v), class: 'vol', 'aria-label': t('volume') });
        inp.addEventListener('input', () => { st.volume = +inp.value; out.textContent = inp.value + '%'; applyAudio(); });
        inp.addEventListener('change', () => { Store.save(); Sound.play('click'); PianoAudio.play(72, 0.5, 0.8); });
        return h('div', { class: 'vol-wrap' }, inp, out);
      })()),
      row(t('sound'), '', onOff('sound')),
      row(t('music'), '', onOff('music')),
      row(t('blood'), t('bloodNote'), onOff('blood')),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); editLook(); } }, t('editLook')),
        h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); if (thenMap || currentScreen === 'scr-hub') openHub(); else if (currentScreen === 'scr-map') openMap(); } }, thenMap ? t('play') + ' ▶' : t('done'))));
  }

  // ---------- profile creator ----------
  let draft = null, editing = null, previewRaf = 0;
  function newProfile() { editing = null; draft = Art.defaultLook('male'); draft.gender = null; $('c-name').value = ''; renderCreate(); show('scr-create'); previewLoop(); }
  function editLook() { editing = profile; draft = Object.assign({}, profile.look); $('c-name').value = profile.name; renderCreate(); show('scr-create'); previewLoop(); }
  function freeColors(p) { return Art.OUTFIT_COLORS.concat(p ? EXTRA_COLORS.filter(c => p.owned.includes('color:' + c)) : []); }
  function renderCreate() {
    applyStatic();
    const g = $('c-gender'); g.innerHTML = '';
    [['male', '♂ ' + t('male')], ['female', '♀ ' + t('female')]].forEach(([v, label]) => {
      g.append(h('button', { class: draft.gender === v ? 'on' : '', onclick: () => {
        if (draft.gender !== v) { const keep = { skin: draft.skin, hairColor: draft.hairColor }; draft = Object.assign(Art.defaultLook(v), keep); }
        Sound.play('click'); renderCreate();
      } }, label));
    });
    $('c-rest').classList.toggle('hidden', !draft.gender);
    $('c-save').disabled = !draft.gender;
    if (!draft.gender) return;
    const O = Art.OPTIONS[draft.gender];
    const owned = editing ? editing.owned : [];
    const extra = kind => SHOP[draft.gender][kind].filter(it => owned.includes(kind + ':' + it.id)).map(it => [it.id, it[lang()]]);
    const segOpts = (id, key, opts) => {
      const el = $(id); el.innerHTML = '';
      opts.forEach(([v, label]) => el.append(h('button', { class: draft[key] === v ? 'on' : '', onclick: () => { draft[key] = v; renderCreate(); } }, label)));
    };
    const sw = (id, key, colors) => {
      const el = $(id); el.innerHTML = '';
      colors.forEach(c => el.append(h('button', { class: 'swatch' + (draft[key] === c ? ' on' : ''), style: 'background:' + c, 'aria-label': key + ' ' + c, onclick: () => { draft[key] = c; renderCreate(); } })));
    };
    const lbl = arr => arr.map(([v, en]) => [v, t('opt_' + v) !== 'opt_' + v ? t('opt_' + v) : en]);
    sw('c-skin', 'skin', Art.SKINS);
    segOpts('c-hair', 'hair', lbl(O.hair));
    sw('c-haircolor', 'hairColor', Art.HAIR_COLORS);
    segOpts('c-top', 'top', lbl(O.top).concat(extra('top')));
    sw('c-topcolor', 'topColor', freeColors(editing));
    $('c-bottom-label').textContent = draft.gender === 'female' ? t('skirt') : t('pants');
    segOpts('c-bottom', 'bottom', lbl(O.bottom).concat(extra('bottom')));
    sw('c-bottomcolor', 'bottomColor', Art.BOTTOM_COLORS.concat(editing ? EXTRA_COLORS.filter(c => owned.includes('color:' + c)) : []));
    sw('c-shoes', 'shoes', Art.SHOE_COLORS);
  }
  function previewLoop() {
    cancelAnimationFrame(previewRaf);
    const cv = $('create-canvas'), c = cv.getContext('2d');
    const t0 = performance.now();
    const loop = now => {
      if (currentScreen !== 'scr-create') return;
      const tt = (now - t0) / 1000;
      c.clearRect(0, 0, cv.width, cv.height);
      c.fillStyle = '#7cc35a'; c.fillRect(0, 300, cv.width, 60);
      c.fillStyle = '#e2bb7d'; c.fillRect(0, 312, cv.width, 30);
      if (draft.gender) {
        const running = Math.floor(tt / 3) % 2 === 1;
        const pose = running ? Art.runPose(tt * 8, 0.9) : Art.idlePose(tt);
        Art.drawPerson(c, draft, pose, 150, 326, 1.45, { mood: running ? 'shout' : 'happy', sway: Math.sin(tt * 8) });
      } else {
        c.fillStyle = '#1e2536'; c.font = '600 22px Fredoka, sans-serif'; c.textAlign = 'center';
        c.fillText(t('chooseGender1'), 150, 150); c.fillText(t('chooseGender2'), 150, 180);
      }
      previewRaf = requestAnimationFrame(loop);
    };
    previewRaf = requestAnimationFrame(loop);
  }
  function saveCreate() {
    if (!draft.gender) return;
    const name = $('c-name').value.trim() || (draft.gender === 'female' ? t('defaultGirl') : t('defaultBoy'));
    if (editing) {
      // keep shop items that still match the chosen gender
      const look = Object.assign({}, draft);
      if (editing.look.gender !== look.gender) { delete look.hat; delete look.acc; }
      else { look.hat = editing.look.hat; look.acc = editing.look.acc; look.hatColor = editing.look.hatColor; }
      editing.look = look; editing.name = name; Store.save(); profile = editing; openHub(); return;
    }
    profile = Store.create(name, Object.assign({}, draft));
    profile.settings.uiLang = Store.uiLang; profile.settings.typeLang = Store.uiLang;
    Store.save();
    applyAudio();
    show('scr-start'); renderStart(); profile = Store.current();
    openSettings(true);
  }

  // ---------- hub: Escape Master or Piano Xpert ----------
  let hubRaf = 0;
  function openHub() {
    if (!profile) { show('scr-start'); renderStart(); return; }
    show('scr-hub'); applyStatic();
    $('hub-name').textContent = profile.name;
    $('hub-coins').textContent = profile.coins;
    headshot($('hub-avatar'), profile.look);
    cancelAnimationFrame(hubRaf);
    const cv = $('hub-escape-art'), c = cv.getContext('2d'), t0 = performance.now();
    const loop = now => {
      if (currentScreen !== 'scr-hub') return;
      const tt = (now - t0) / 1000, sc = cv.height / 500, W = cv.width / sc;
      c.setTransform(sc, 0, 0, sc, 0, 0);
      const g = Art.drawScene(c, W, 500, 'forest', tt * 140, tt, { simple: true });
      Art.drawBeast(c, 'wolf', W * 0.22, g + 4, 0.9, tt * 9);
      Art.drawPerson(c, profile.look, Art.runPose(tt * 9, 1), W * 0.68, g, 1, { mood: 'shout', sway: Math.sin(tt * 9) });
      hubRaf = requestAnimationFrame(loop);
    };
    hubRaf = requestAnimationFrame(loop);
  }

  // ---------- map ----------
  const ROW_H = 120, BAND_PAD = 160;
  let mapLayout = [], spriteRaf = 0, mapList = [];
  function openMap() {
    if (!profile) { show('scr-start'); renderStart(); return; }
    show('scr-map');
    applyStatic();
    $('map-name').textContent = profile.name;
    $('map-mode').textContent = (profile.settings.mode === 'practice' ? t('practice') : t('challenge')) + ' · ' + (profile.settings.winStyle === 'speed' ? t('speedGoal') : t('survival')) + (profile.settings.verse ? ' · ' + t('verseShort') : '');
    $('map-coins').textContent = profile.coins;
    mapList = levels();
    $('map-stars').textContent = totalStars(profile) + ' / ' + mapList.length * 3;
    headshot($('map-avatar'), profile.look);
    renderMap();
  }
  function renderMap() {
    const inner = $('map-inner'); inner.innerHTML = '';
    const L = mapList, ln = lang();
    mapLayout = [];
    let y = 0;
    const bands = [];
    WORLDS.forEach((w, wi) => {
      const lv = L.filter(l => l.world === wi);
      if (!lv.length) return;
      const top = y;
      y += BAND_PAD;
      lv.forEach(l => {
        const idx = L.indexOf(l);
        mapLayout[idx] = { x: l.boss ? 50 : 50 + Math.sin(idx * 0.95) * 28, y: y + (l.boss ? 20 : 0) };
        y += ROW_H + (l.boss ? 40 : 0);
      });
      y += 10;
      bands.push({ w, top, height: y - top });
    });
    inner.style.height = y + 40 + 'px';
    bands.forEach(({ w, top, height }) => {
      const T = Art.THEMES[w.theme];
      const cert = profile.certs[w.id];
      const band = h('div', { class: 'world-band', style: `top:${top}px;height:${height}px;background:linear-gradient(${T.sky[0]}, ${T.hill} 45%, ${T.ground});` },
        h('div', { class: 'wb-title' }, worldName(w, ln), cert ? h('button', { class: 'cert-chip', onclick: () => showCertificate(w.id) }, '🏅') : '',
          h('small', {}, worldBlurb(w, ln))));
      inner.append(band);
    });
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
    const front = frontier(profile, L);
    L.forEach((l, i) => {
      const p = mapLayout[i];
      const r = rec(profile, l.id);
      const locked = !unlocked(profile, L, i);
      const cls = 'node' + (l.boss ? ' boss' : '') + (locked ? ' locked' : '') + (r && r.won ? ' done' : '') + (i === front && !locked ? ' current' : '') + (l.id === profile.justUnlocked ? ' unlocking' : '');
      const n = h('button', { class: cls, style: `left:${p.x}%;top:${p.y}px`, 'aria-label': `${t('level')} ${i + 1}: ${levelTitle(l, ln)}${locked ? ' (' + t('locked') + ')' : ''}` },
        locked ? '🔒' : (l.boss ? '👑' : String(i + 1)),
        h('span', { class: 'ntype' }, l.boss ? t('boss') : t(TYPE_INFO[l.type].name)),
        r && r.stars ? h('span', { class: 'nstars' }, '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars)) : '');
      if (!locked) n.addEventListener('click', () => walkTo(i, () => levelIntro(i)));
      else n.addEventListener('click', () => { Sound.play('nope'); toast(t('lockedHint')); });
      inner.append(n);
    });
    const sp = h('canvas', { id: 'map-sprite', width: 180, height: 220 });
    inner.append(sp);
    let from = L.findIndex(l => l.id === profile.mapPos);
    if (from < 0 || !unlocked(profile, L, from)) from = front;
    profile.mapIdx = from;
    placeSprite(from, null);
    const scroller = $('map-scroll');
    requestAnimationFrame(() => {
      scroller.scrollTop = Math.max(0, mapLayout[from].y - scroller.clientHeight / 2);
      if (profile.justUnlocked) { const ti = L.findIndex(l => l.id === profile.justUnlocked); if (ti > from) setTimeout(() => walkTo(ti), 350); }
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
    const start = profile.mapIdx != null ? profile.mapIdx : target;
    const finishWalk = () => { profile.mapIdx = target; profile.mapPos = mapList[target].id; Store.save(); placeSprite(target); if (done) done(); };
    if (start === target) { finishWalk(); return; }
    const dir = target > start ? 1 : -1;
    const steps = Math.abs(target - start);
    const dur = Math.min(2400, 600 * steps);
    const t0 = performance.now();
    const scroller = $('map-scroll');
    const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const loop = now => {
      if (currentScreen !== 'scr-map') return;
      const k = Math.min(1, (now - t0) / dur);
      const f = ease(k) * steps, seg = Math.min(steps - 1, Math.floor(f)), u = f - seg;
      const a = mapLayout[start + seg * dir], b = mapLayout[start + (seg + 1) * dir];
      const p = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
      placeSprite(p, Art.runPose(now / 60, 0.7));
      scroller.scrollTop += ((p.y - scroller.clientHeight / 2) - scroller.scrollTop) * 0.12;
      if (k < 1) spriteRaf = requestAnimationFrame(loop);
      else finishWalk();
    };
    spriteRaf = requestAnimationFrame(loop);
  }

  function keyChips(keys) {
    return h('div', { class: 'intro-keys' }, keys.map(k => {
      const plan = charPlan(k);
      const f = plan && KEY_INFO[plan.base] ? KEY_INFO[plan.base].finger : 'th';
      return h('div', { class: 'kcap', style: 'background:' + FINGER_COLORS[f] }, keyLabel(k));
    }));
  }
  function levelIntro(i) {
    const l = mapList[i], w = WORLDS[l.world], ln = lang();
    const st = profile.settings;
    const r = rec(profile, l.id);
    const keys = l.fresh;
    const goal = st.winStyle === 'speed' ? t('goalSpeed', l.minWpm) : t('goalSurvive');
    const verseHere = st.verse && (l.stage === 3 || l.boss);
    const extra = [];
    if (l.setup) extra.push(intlSetupBox());
    if (LESSONS[l.lesson].caps && !LESSONS[l.lesson].review && !l.boss) extra.push(h('p', { class: 'tipbox' }, t('capsTip')));
    if (LESSONS[l.lesson].spanish && !l.setup && !l.boss) extra.push(h('p', { class: 'tipbox' }, isPhone() ? t('spanishPhoneTip') : t('spanishTip')));
    if (LESSONS[l.lesson].symbols && st.typeLang === 'es' && !l.boss) extra.push(h('p', { class: 'tipbox' }, t('deadKeyTip')));
    openModal(
      h('h2', { class: l.boss ? 'boss-title' : '' }, l.boss ? '👑 ' + t('bossLevel') : `${t('level')} ${i + 1}`),
      h('p', { class: 'center' }, h('b', {}, worldName(w, ln)), ' — ', levelTitle(l, ln)),
      keys.length ? keyChips(keys) : '',
      keys.length && !isPhone() ? h('p', { class: 'center small' }, keys.map(k => `${keyLabel(k)}: ${howTo(k, true)}`).join(' · ')) : '',
      h('div', { class: 'intro-meta' },
        h('span', { class: 'chip' }, l.boss ? t('boss') : t(TYPE_INFO[l.type].name)),
        h('span', { class: 'chip' }, t('minSpeed', l.minWpm)),
        h('span', { class: 'chip' }, st.mode === 'practice' ? t('practice') : t('challenge')),
        verseHere ? h('span', { class: 'chip' }, '📖 ' + t('verseShort')) : '',
        r ? h('span', { class: 'chip' }, t('best') + ': ' + Math.round(r.bestWpm || 0) + ' ' + t('wpm')) : ''),
      extra,
      h('p', { class: 'center' }, l.boss ? t('bossTip') : (st.mode === 'practice' ? t('practiceTip') : t(TYPE_INFO[l.type].tip))),
      h('p', { class: 'center' }, h('b', {}, goal)),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: closeModal }, t('back')),
        h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); startLevel(i); } }, t('start') + ' ▶')));
  }
  function intlSetupBox() {
    return h('div', { class: 'tipbox' },
      h('b', {}, t('intlTitle')),
      h('ol', {}, [1, 2, 3, 4, 5].map(n => h('li', {}, t('intlStep' + n)))),
      h('p', {}, t('intlUse')),
      h('p', { class: 'small' }, t('intlPhone')));
  }

  // ---------- in-level ----------
  let levelIdx = 0, curLevel = null, shiftL = false, shiftR = false, deadPending = false;
  async function startLevel(i, levelObj) {
    curLevel = levelObj || mapList[i];
    levelIdx = levelObj ? -1 : i;
    const l = curLevel;
    const phone = isPhone();
    document.body.classList.toggle('phone', phone);
    show('scr-game');
    $('kbd-area').classList.toggle('hidden', !profile.settings.fingerGuide || phone);
    $('level-tag').textContent = l.smart ? t('smartPractice') : `${t('level')} ${i + 1} · ${worldName(WORLDS[l.world], lang())} · ${levelTitle(l, lang())}`;
    $('verse-ref').textContent = '';
    if (phone) focusInput();
    if (profile.settings.verse && (l.stage === 3 || l.boss)) {
      $('textline').textContent = t('loadingVerses');
      try { await Verses.load(typeLang()); } catch (e) { toast(t('versesFailed')); }
      if (currentScreen !== 'scr-game' || curLevel !== l) return;
    }
    const gen = TextGen.make(l, typeLang(), phone, profile.settings.verse);
    $('verse-ref').textContent = gen.ref ? '📖 ' + gen.ref : '';
    requestAnimationFrame(() => {
      Game.resize();
      Game.start(l, profile, gen, {
        onChange: renderHud, onEnd: showResults,
        canRevive: () => profile.settings.mode === 'challenge' && profile.coins >= REVIVE_COST,
        onRevive: askRevive,
        onShiftHint: side => toast(t(side === 'ShiftL' ? 'useLeftShift' : 'useRightShift'))
      });
    });
  }
  function askRevive() {
    Sound.play('nope');
    openModal(h('h2', { class: 'lose' }, t('outOfStrength')),
      h('p', { class: 'center' }, t('reviveQ', REVIVE_COST)),
      h('p', { class: 'center small' }, t('youHave', profile.coins)),
      h('div', { class: 'row-btns', style: 'justify-content:center' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); Game.giveUp(); } }, t('noThanks')),
        h('button', { class: 'btn btn-gold', onclick: () => {
          profile.coins -= REVIVE_COST; Store.save(); closeModal(); Game.revive();
          if (document.body.classList.contains('phone')) focusInput();
        } }, '💖 ' + t('revive', REVIVE_COST))));
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
    const small = document.body.classList.contains('phone') || window.innerWidth < 640;
    const before = small ? 1 : 2, after = small ? 4 : 6;
    const tiles = $('tiles'); tiles.innerHTML = '';
    for (let k = S.pos - before; k <= S.pos + after; k++) {
      const ch = S.text[k];
      let cls = 'tile';
      if (ch === undefined) { tiles.append(h('div', { class: 'tile', style: 'visibility:hidden' }, '')); continue; }
      if (k < S.pos) cls += S.auto.has(k) ? ' auto' : ' done'; else if (k === S.pos) cls += ' cur';
      if (ch === ' ') cls += ' space';
      tiles.append(h('div', { class: cls }, ch === ' ' ? '␣' : ch));
    }
    // text line (window around the cursor for long texts)
    const tl = $('textline');
    tl.innerHTML = '';
    const from = Math.max(0, S.pos - 60), to = Math.min(S.text.length, S.pos + 90);
    if (from > 0) tl.append('… ');
    let doneStr = '';
    for (let k = from; k < S.pos; k++) doneStr += S.text[k];
    tl.append(h('span', { class: 'done' }, doneStr));
    if (S.pos < S.text.length) tl.append(h('span', { class: 'cur' }, S.text[S.pos] === ' ' ? ' ' : S.text[S.pos]));
    tl.append(h('span', {}, S.text.slice(S.pos + 1, to)));
    if (to < S.text.length) tl.append(' …');
    // streak
    const sk = $('streak');
    sk.classList.toggle('show', S.streak >= 3);
    const was = sk.dataset.sprint === '1', now = S.streak >= 8;
    sk.textContent = t('streak') + ' x' + S.streak + (now ? ' · ' + t('sprint') : '');
    sk.dataset.sprint = now ? '1' : '0';
    if (now && !was) { sk.classList.remove('sprint'); void sk.offsetWidth; sk.classList.add('sprint'); }
    highlightKey(S.text[S.pos]);
    $('tap-hint').classList.toggle('show', document.activeElement !== $('hidden-input') && !S.over);
  }
  function flashError() {
    const cur = document.querySelector('#tiles .tile.cur');
    if (cur) { cur.classList.remove('err'); void cur.offsetWidth; cur.classList.add('err'); }
    const st = $('stage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
  }

  // ---------- keyboard + hands ----------
  function buildKeyboard(container, mini) {
    container.innerHTML = '';
    const map = {};
    KEY_ROWS.forEach((row, ri) => {
      const r = h('div', { class: 'krow' });
      if (ri === 4) r.classList.add('space-row');
      row.forEach(([k, f]) => {
        const special = k.length > 1;
        const cls = 'key' + (k === ' ' ? ' space' : '') + (special ? ' special k-' + k : '') + (k === 'f' || k === 'j' ? ' bump' : '');
        const el = h('div', { class: cls, style: 'background:' + FINGER_COLORS[f] },
          SHIFTED_LABEL[k] && !mini ? h('span', { class: 'shifted' }, SHIFTED_LABEL[k]) : '',
          h('span', { class: 'base' }, k === ' ' ? (mini ? '' : 'space') : (special ? (mini ? '' : SPECIAL_LABELS[k]) : (/[a-z]/.test(k) ? k.toUpperCase() : k))));
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
        el.append(h('div', { class: 'finger', 'data-f': f, style: `left:${left}px;height:${hgt}px;${isThumb ? 'bottom:22px;transform:rotate(' + (side === 'l' ? 40 : -40) + 'deg)' : ''}` }));
      });
      el.append(h('div', { class: 'palm' }));
    });
  }
  // the physical keys (and fingers) needed for the next character
  function keysFor(ch, dead) {
    const plan = charPlan(ch);
    if (!plan) return [];
    if (plan.pre && !dead) return [plan.pre.base].concat(plan.pre.shift ? [plan.pre.shift] : []);
    const ks = [plan.base];
    if (plan.shift) ks.push(plan.shift);
    if (plan.altgr) ks.push('AltGr');
    return ks;
  }
  function highlightKey(ch) {
    Object.values(keyEls).forEach(el => el.classList.remove('next'));
    document.querySelectorAll('.hand .finger').forEach(f => { f.classList.remove('hl'); f.style.background = ''; });
    if (ch == null) return;
    keysFor(ch, deadPending).forEach(k => {
      if (keyEls[k]) keyEls[k].classList.add('next');
      const info = KEY_INFO[k];
      if (!info) return;
      const f = info.finger;
      let els;
      if (f === 'th') els = k === 'AltGr' ? document.querySelectorAll('#hand-r .finger[data-f="th"]') : document.querySelectorAll('.hand .finger[data-f="th"]');
      else els = document.querySelectorAll(`#hand-${f[0] === 'l' ? 'l' : 'r'} .finger[data-f="${f}"]`);
      els.forEach(x => { x.classList.add('hl'); x.style.background = FINGER_COLORS[f]; });
    });
  }

  // ---------- key guide ----------
  const GUIDE_GROUPS = [
    ['guideLetters', 'asdfghjkl;qwertyuiopzxcvbnm,. '.split('')],
    ['guideCaps', ['A', 'J', 'ShiftL', 'ShiftR']],
    ['guideNumbers', '1234567890'.split('')],
    ['guideSymbols', "!@#$%^&*()-_=+[]{}\\|;:'\",.<>/?`~".split('').filter((c, i, a) => a.indexOf(c) === i && !/[;,.]/.test(c) || c === ':')],
    ['guideSpanish', ['ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü', '¿', '¡']]
  ];
  const FINGER_ES = { lp: 'Meñique izquierdo', lr: 'Anular izquierdo', lm: 'Medio izquierdo', li: 'Índice izquierdo',
    ri: 'Índice derecho', rm: 'Medio derecho', rr: 'Anular derecho', rp: 'Meñique derecho', th: 'Cualquier pulgar' };
  const fingerName = f => lang() === 'es' ? FINGER_ES[f] : FINGER_NAMES[f];
  function howTo(k, short) {
    const plan = charPlan(k);
    if (k === 'ShiftL' || k === 'ShiftR') return t(k === 'ShiftL' ? 'shiftLTip' : 'shiftRTip');
    if (!plan) return '';
    const f = KEY_INFO[plan.base].finger;
    const shiftTxt = s => t(s === 'ShiftL' ? 'withLeftShift' : 'withRightShift');
    if (plan.altgr) return t('altgrHow', keyLabel(plan.base));
    if (plan.pre) {
      const preKey = plan.pre.shift ? `${shiftTxt(plan.pre.shift)} + ${keyLabel(plan.pre.base)}` : keyLabel(plan.pre.base);
      return t('deadHow', preKey, (plan.shift ? shiftTxt(plan.shift) + ' + ' : '') + keyLabel(plan.base));
    }
    if (plan.shift) return short ? `${fingerName(f)} + ${shiftTxt(plan.shift)}` : t('shiftHow', shiftTxt(plan.shift), fingerName(f).toLowerCase(), keyLabel(plan.base));
    return fingerName(f);
  }
  function keyTip(k) {
    if (k === ' ') return t('spaceTip');
    if (k === 'ShiftL' || k === 'ShiftR') return howTo(k);
    const plan = charPlan(k);
    if (plan.pre || plan.altgr || plan.shift) return howTo(k) + (plan.pre ? ' ' + t('intlNeeded') : '');
    const info = KEY_INFO[k], f = info.finger;
    const home = HOME_KEYS[f];
    const fn = fingerName(f).toLowerCase();
    if (info.row === 2 && home === k) return t('homeKeyTip', keyLabel(k), fn) + (k === 'f' || k === 'j' ? ' ' + t('bumpTip') : '');
    if (info.row === 2) return t('slideTip', fn, keyLabel(home), keyLabel(k));
    return t(info.row < 2 ? 'reachUpTip' : 'reachDownTip', keyLabel(home), fn);
  }
  const ROW_ES = ['fila de números', 'fila superior', 'fila central', 'fila inferior', 'barra espaciadora'];
  function keyCard(k) {
    const special = k === 'ShiftL' || k === 'ShiftR';
    const plan = special ? { base: k } : charPlan(k);
    const info = KEY_INFO[plan.base], f = info.finger;
    const mk = h('div', { class: 'mini-kbd' });
    const m = buildKeyboard(mk, true);
    (special ? [k] : keysFor(k, false).concat(plan.pre ? keysFor(k, true) : [])).forEach(x => { if (m[x]) m[x].classList.add('next'); });
    const rowName = (lang() === 'es' ? ROW_ES : ROW_NAMES)[info.row];
    return h('div', { class: 'kcard', id: 'kcard-' + [...k].map(c => c.charCodeAt(0)).join('-') },
      h('div', { class: 'kcard-head' },
        h('div', { class: 'kcap', style: 'background:' + FINGER_COLORS[f] + (k.length > 1 || k === ' ' ? ';font-size:0.9rem' : '') }, keyLabel(k)),
        h('div', {}, h('b', {}, special ? fingerName(f) : (plan.pre || plan.altgr ? t('twoSteps') : fingerName(f))), h('small', {}, rowName[0].toUpperCase() + rowName.slice(1)))),
      mk,
      h('p', {}, keyTip(k)));
  }
  let guideBack = 'scr-start';
  function openGuide() {
    guideBack = currentScreen === 'scr-guide' ? guideBack : currentScreen;
    show('scr-guide'); applyStatic();
    const legend = $('guide-legend'); legend.innerHTML = '';
    ['lp', 'lr', 'lm', 'li', 'ri', 'th'].forEach(f => legend.append(h('span', { style: 'background:' + FINGER_COLORS[f] }, t('legend_' + f))));
    const cards = $('guide-cards'); cards.innerHTML = '';
    GUIDE_GROUPS.forEach(([title, keys]) => {
      cards.append(h('h3', { class: 'guide-group' }, t(title)));
      if (title === 'guideSpanish') cards.append(h('div', { class: 'kcard wide' }, intlSetupBox()));
      if (title === 'guideNumbers' || title === 'guideSymbols') cards.append(h('p', { class: 'guide-note' }, t('laptopOnlyNote')));
      keys.forEach(k => cards.append(keyCard(k)));
    });
  }
  function helpForCurrentKey() {
    const S = Game.state(); if (!S) return;
    Game.pause(true);
    const k = S.text[S.pos] || 'f';
    openModal(h('h2', {}, t('keyHelp')), keyCard(k),
      h('div', { class: 'row-btns' }, h('button', { class: 'btn btn-gold', onclick: resume }, t('backToEscape') + ' ▶')));
  }
  function resume() {
    closeModal(); Game.pause(false);
    if (document.body.classList.contains('phone')) focusInput();
  }
  function pauseMenu() {
    const S = Game.state(); if (!S || S.over || S.asking) return;
    Game.pause(true);
    openModal(h('h2', {}, t('paused')),
      h('div', { class: 'row-btns', style: 'justify-content:center' },
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); openMap(); } }, t('quitToMap')),
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); startLevel(levelIdx, levelIdx < 0 ? curLevel : null); } }, t('restart')),
        h('button', { class: 'btn btn-gold', onclick: resume }, t('resume') + ' ▶')));
  }

  // ---------- results ----------
  function nextFact() {
    const list = lang() === 'es' ? FACTS_ES : FACTS;
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (i === lastFact && list.length > 1);
    lastFact = i;
    return list[i];
  }
  function showResults(r) {
    const l = curLevel, st = profile.settings;
    const s = profile.stats;
    s.keys += r.correct + r.errors; s.errors += r.errors; s.levelsPlayed++; if (r.win) s.levelsWon++;
    s.bestWpm = Math.max(s.bestWpm, r.wpm);
    for (const [k, n] of Object.entries(r.keyErrors)) s.keyErrors[k] = (s.keyErrors[k] || 0) + n;
    for (const [k, n] of Object.entries(r.keyTries)) s.keyTries[k] = (s.keyTries[k] || 0) + n;
    profile.history.push({ t: Date.now(), wpm: Math.round(r.wpm * 10) / 10, acc: Math.round(r.acc * 10) / 10, id: l.id, win: r.win });
    if (profile.history.length > 300) profile.history.splice(0, profile.history.length - 300);
    profile.coins += r.coins;
    let unlockedNew = null, newCert = null;
    if (!l.smart) {
      const rc = profile.progress[l.id] || { stars: 0, bestWpm: 0, bestAcc: 0, plays: 0, won: false };
      const wasWon = rc.won;
      rc.plays++;
      rc.bestWpm = Math.max(rc.bestWpm, r.wpm); rc.bestAcc = Math.max(rc.bestAcc, r.acc);
      rc.stars = Math.max(rc.stars, r.stars);
      if (r.win) rc.won = true;
      profile.progress[l.id] = rc;
      if (r.win && !wasWon && levelIdx >= 0 && levelIdx < mapList.length - 1) { unlockedNew = mapList[levelIdx + 1]; profile.justUnlocked = unlockedNew.id; }
      if (l.boss && r.win && !profile.certs[WORLDS[l.world].id]) {
        newCert = profile.certs[WORLDS[l.world].id] = { wpm: Math.round(r.wpm), acc: Math.round(r.acc), date: Date.now(), name: profile.name };
      }
      profile.mapPos = l.id;
    }
    Store.save();

    const title = r.win ? (r.reachedEnd ? t('escaped') : t('wellDone')) : (r.died ? (l.type === 'vine' ? t('lostGrip') : l.type === 'boulder' ? t('tooHeavy') : t('caught')) : t('notFast'));
    const okW = r.wpm >= l.minWpm, okA = r.acc >= 90;
    const goal = st.winStyle === 'speed'
      ? h('p', { class: 'goal-line' }, t('goal') + ': ', h('span', { class: okA ? 'ok' : 'no' }, t('acc90') + ' ' + (okA ? '✔' : '✘')), ' ' + t('and') + ' ', h('span', { class: okW ? 'ok' : 'no' }, l.minWpm + ' ' + t('wpm') + ' ' + (okW ? '✔' : '✘')))
      : h('p', { class: 'goal-line' }, t('goalSurvive') + ' ', h('span', { class: r.reachedEnd ? 'ok' : 'no' }, r.reachedEnd ? '✔' : '✘'));
    const stars = h('div', { class: 'res-stars' }, [0, 1, 2].map(i => h('span', { class: i < r.stars ? 'on' : '', style: `animation-delay:${0.2 + i * 0.25}s` }, '★')));
    const hasNext = levelIdx >= 0 && levelIdx < mapList.length - 1 && unlocked(profile, mapList, levelIdx + 1);
    const resultsModal = () => {
      setTimeout(() => { for (let i = 0; i < r.stars; i++) setTimeout(() => Sound.play('star'), i * 250); if (r.coins) setTimeout(() => Sound.play('coin'), 900); }, 200);
      openModal(
        h('h2', { class: r.win ? 'win' : 'lose' }, title),
        l.smart ? '' : stars,
        h('div', { class: 'res-grid' },
          h('div', {}, h('b', {}, Math.round(r.wpm)), h('small', {}, t('wpmSpeed'))),
          h('div', {}, h('b', {}, Math.round(r.acc) + '%'), h('small', {}, t('accuracy'))),
          h('div', {}, h('b', {}, r.bestStreak), h('small', {}, t('bestStreak'))),
          h('div', {}, h('b', {}, '+' + r.coins), h('small', {}, t('coinsCap')))),
        l.smart ? '' : goal,
        r.ref ? h('p', { class: 'goal-line' }, '📖 ' + r.ref) : '',
        r.revived ? h('p', { class: 'goal-line' }, '💖 ' + t('usedRevive')) : '',
        unlockedNew ? h('p', { class: 'goal-line' }, h('span', { class: 'ok' }, '🔓 ' + t('unlockedLevel', mapList.indexOf(unlockedNew) + 1))) : '',
        h('div', { class: 'fact' }, h('b', {}, t('didYouKnow') + ' '), nextFact()),
        h('div', { class: 'row-btns' },
          h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); openMap(); } }, t('map')),
          h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); l.smart ? smartPractice() : startLevel(levelIdx); } }, t('retry') + ' ↻'),
          hasNext ? h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); profile.mapPos = mapList[levelIdx + 1].id; startLevel(levelIdx + 1); } }, t('next') + ' ▶') : ''));
    };
    if (document.body.classList.contains('phone')) $('hidden-input').blur();
    if (newCert) showCertificate(WORLDS[l.world].id, resultsModal);
    else resultsModal();
  }

  // ---------- certificates ----------
  function certNode(worldId) {
    const c = profile.certs[worldId], w = WORLDS.find(x => x.id === worldId);
    return h('div', { class: 'certificate' },
      h('div', { class: 'cert-inner' },
        h('div', { class: 'cert-top' }, "D' Keys to Escaping"),
        h('h3', {}, t('certTitle')),
        h('p', { class: 'cert-small' }, t('certPresented')),
        h('div', { class: 'cert-name' }, c.name || profile.name),
        h('p', { class: 'cert-small' }, t('certFor')),
        h('div', { class: 'cert-world' }, worldName(w, lang())),
        h('div', { class: 'cert-stats' },
          h('div', {}, h('b', {}, c.wpm), h('small', {}, t('wpmSpeed'))),
          h('div', {}, h('b', {}, c.acc + '%'), h('small', {}, t('accuracy')))),
        h('div', { class: 'cert-foot' }, h('span', {}, fmtDate(c.date)), h('span', { class: 'cert-seal' }, '🏅'))));
  }
  function showCertificate(worldId, after) {
    Sound.play('cert');
    const box = openModal(
      h('h2', { class: 'win' }, '🏅 ' + t('certReady')),
      certNode(worldId),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn btn-ghost', onclick: () => printCertificate(worldId) }, '🖨 ' + t('print')),
        h('button', { class: 'btn btn-gold', onclick: () => { closeModal(); if (after) after(); } }, after ? t('continue') + ' ▶' : t('done'))));
    box.classList.add('wide');
  }
  function printCertificate(worldId) {
    const area = $('print-area'); area.innerHTML = '';
    area.append(certNode(worldId));
    setTimeout(() => window.print(), 50);
  }

  // ---------- smart practice ----------
  function weakKeys(p) {
    const s = p.stats, out = [];
    Object.keys(s.keyErrors).forEach(k => {
      if (k === ' ') return;
      const e = s.keyErrors[k], n = Math.max(e, s.keyTries[k] || 0);
      if (e < 2) return;
      out.push({ k, e, n, rate: e / n });
    });
    out.sort((a, b) => (b.rate * Math.log(1 + b.e)) - (a.rate * Math.log(1 + a.e)));
    return out;
  }
  function smartPractice() {
    const list = mapList.length ? mapList : levels();
    const f = list[frontier(profile, list)];
    const learned = new Set(f.learned);
    const weak = weakKeys(profile).filter(w => learned.has(w.k) && (!isPhone() || PHONE_OK(w.k))).slice(0, 6).map(w => w.k);
    if (!weak.length) { toast(t('noWeakKeys'), 2600); return; }
    const level = { id: 'smart', smart: true, keys: weak, world: f.world, lesson: f.lesson, stage: 1, type: 'chase',
      minWpm: Math.max(8, Math.round(f.minWpm * 0.8)), fresh: weak, learned: f.learned, boss: false };
    toast(t('practicing') + ': ' + weak.map(keyLabel).join(' '), 2200);
    startLevel(-1, level);
  }

  // ---------- wardrobe shop ----------
  let shopTab = 'top', shopRaf = 0;
  function openShop() {
    show('scr-shop'); applyStatic();
    renderShop();
    cancelAnimationFrame(shopRaf);
    const cv = $('shop-canvas'), c = cv.getContext('2d'), t0 = performance.now();
    const loop = now => {
      if (currentScreen !== 'scr-shop') return;
      const tt = (now - t0) / 1000;
      c.clearRect(0, 0, cv.width, cv.height);
      c.fillStyle = '#7cc35a'; c.fillRect(0, 300, cv.width, 60);
      c.fillStyle = '#e2bb7d'; c.fillRect(0, 312, cv.width, 30);
      const running = Math.floor(tt / 3) % 2 === 1;
      Art.drawPerson(c, profile.look, running ? Art.runPose(tt * 8, 0.9) : Art.idlePose(tt), 150, 326, 1.45, { mood: 'happy', sway: Math.sin(tt * 8) });
      shopRaf = requestAnimationFrame(loop);
    };
    shopRaf = requestAnimationFrame(loop);
  }
  function renderShop() {
    $('shop-coins').textContent = profile.coins;
    const tabs = $('shop-tabs'); tabs.innerHTML = '';
    [['top', 'tabTops'], ['bottom', 'tabBottoms'], ['hat', 'tabHats'], ['acc', 'tabAcc'], ['colors', 'tabColors']].forEach(([id, key]) =>
      tabs.append(h('button', { class: shopTab === id ? 'on' : '', onclick: () => { shopTab = id; renderShop(); } }, t(key))));
    const grid = $('shop-items'); grid.innerHTML = '';
    const g = profile.look.gender, ln = lang(), wins = wonCount(profile);
    const card = (name, sub, state, onclick, swatch) => h('button', { class: 'shop-item ' + state, onclick },
      swatch ? h('span', { class: 'shop-sw', style: 'background:' + swatch }) : '', h('b', {}, name), h('small', {}, sub));
    if (shopTab === 'top' || shopTab === 'bottom') {
      const base = Art.OPTIONS[g][shopTab].map(([id, en]) => ({ id, name: t('opt_' + id) !== 'opt_' + id ? t('opt_' + id) : en, price: 0 }));
      const extra = SHOP[g][shopTab].map(it => ({ id: it.id, name: it[ln], price: it.price }));
      base.concat(extra).forEach(it => {
        const owned = !it.price || profile.owned.includes(shopTab + ':' + it.id);
        const worn = profile.look[shopTab] === it.id;
        grid.append(card(it.name, worn ? t('wearing') : owned ? t('owned') : '🪙 ' + it.price, worn ? 'worn' : owned ? 'owned' : 'buy', () => {
          if (!owned) { if (!buy(shopTab + ':' + it.id, it.price)) return; }
          profile.look[shopTab] = it.id; Store.save(); Sound.play('click'); renderShop();
        }));
      });
    } else if (shopTab === 'hat' || shopTab === 'acc') {
      grid.append(card(t('none'), profile.look[shopTab] ? '' : t('wearing'), profile.look[shopTab] ? 'owned' : 'worn', () => { delete profile.look[shopTab]; Store.save(); renderShop(); }));
      SHOP[g][shopTab].forEach(it => {
        const open = wins >= it.unlock, worn = profile.look[shopTab] === it.id;
        grid.append(card(it[ln], worn ? t('wearing') : open ? t('unlocked') : '🔒 ' + t('winLevels', it.unlock), worn ? 'worn' : open ? 'owned' : 'locked', () => {
          if (!open) { Sound.play('nope'); toast(t('winLevelsToUnlock', it.unlock, wins)); return; }
          profile.look[shopTab] = it.id; Store.save(); Sound.play('click'); renderShop();
        }));
      });
    } else {
      const targets = [['topColor', 'colTop'], ['bottomColor', 'colBottom'], ['shoes', 'colShoes'], ['hatColor', 'colHat']];
      targets.forEach(([key, label]) => {
        grid.append(h('h3', { class: 'shop-sub' }, t(label)));
        const row = h('div', { class: 'swatches' });
        const base = key === 'bottomColor' ? Art.BOTTOM_COLORS : key === 'shoes' ? Art.SHOE_COLORS : Art.OUTFIT_COLORS;
        base.concat(EXTRA_COLORS).forEach(c => {
          const paid = EXTRA_COLORS.includes(c) && !base.includes(c);
          const owned = !paid || profile.owned.includes('color:' + c);
          row.append(h('button', { class: 'swatch' + (profile.look[key] === c ? ' on' : '') + (owned ? '' : ' paid'), style: 'background:' + c,
            title: owned ? '' : '🪙 ' + COLOR_PRICE, 'aria-label': (owned ? '' : COLOR_PRICE + ' coins ') + c,
            onclick: () => { if (!owned && !buy('color:' + c, COLOR_PRICE)) return; profile.look[key] = c; Store.save(); Sound.play('click'); renderShop(); } }));
        });
        grid.append(row);
      });
      grid.append(h('p', { class: 'small' }, t('colorNote', COLOR_PRICE)));
    }
  }
  function buy(id, price) {
    if (profile.coins < price) { Sound.play('nope'); toast(t('needCoins', price - profile.coins)); return false; }
    profile.coins -= price; profile.owned.push(id); Store.save(); Sound.play('buy'); toast(t('bought'));
    return true;
  }

  // ---------- stats ----------
  function lineChart(points, key, label, unit, color, maxY) {
    const W = 320, H = 150, pl = 34, pr = 10, pt = 14, pb = 24;
    const svgNS = 'http://www.w3.org/2000/svg';
    const wrap = h('div', { class: 'chart' }, h('div', { class: 'chart-title' }, label));
    if (points.length < 2) { wrap.append(h('p', { class: 'small' }, t('needMorePlays'))); return wrap; }
    const ys = points.map(p => p[key]);
    const top = maxY || Math.max(10, Math.ceil(Math.max(...ys) / 10) * 10);
    const X = i => pl + (W - pl - pr) * (i / (points.length - 1)), Y = v => pt + (H - pt - pb) * (1 - v / top);
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'chart-svg'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
    const el = (tag, attrs, txt) => { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; svg.append(e); return e; };
    [0, 0.5, 1].forEach(f => {
      const v = Math.round(top * f);
      el('line', { x1: pl, x2: W - pr, y1: Y(v), y2: Y(v), class: 'grid' });
      el('text', { x: pl - 6, y: Y(v) + 4, class: 'axis', 'text-anchor': 'end' }, v);
    });
    el('text', { x: pl, y: H - 6, class: 'axis' }, t('older'));
    el('text', { x: W - pr, y: H - 6, class: 'axis', 'text-anchor': 'end' }, t('latest'));
    el('path', { d: points.map((p, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(p[key])).join(' '), class: 'line', stroke: color });
    const tip = h('div', { class: 'chart-tip' });
    points.forEach((p, i) => {
      const c = el('circle', { cx: X(i), cy: Y(p[key]), r: 4, class: 'dot', fill: color });
      const hit = el('circle', { cx: X(i), cy: Y(p[key]), r: 12, class: 'hit' });
      const showTip = () => { tip.textContent = `${fmtDate(p.t)} · ${Math.round(p[key])}${unit}`; tip.style.left = (X(i) / W * 100) + '%'; tip.style.top = (Y(p[key]) / H * 100) + '%'; tip.classList.add('show'); c.setAttribute('r', 6); };
      const hide = () => { tip.classList.remove('show'); c.setAttribute('r', 4); };
      hit.addEventListener('pointerenter', showTip); hit.addEventListener('pointerleave', hide);
      hit.addEventListener('click', showTip);
    });
    const last = points[points.length - 1];
    el('text', { x: X(points.length - 1) - 4, y: Y(last[key]) - 10, class: 'last-label', 'text-anchor': 'end' }, Math.round(last[key]) + unit);
    const box = h('div', { class: 'chart-box' }); box.append(svg, tip);
    wrap.append(box);
    return wrap;
  }
  function profileSummary(p) {
    const list = levels(p);
    const hist = p.history.slice(-20);
    const avgAcc = hist.length ? hist.reduce((a, x) => a + x.acc, 0) / hist.length : 0;
    const avgWpm = hist.length ? hist.reduce((a, x) => a + x.wpm, 0) / hist.length : 0;
    const last = p.history.length ? p.history[p.history.length - 1].t : 0;
    const pd = Piano.data(p), nSongs = (window.PIANO_SONGS || []).length;
    const piano = `▶ ${Object.values(pd.play.songs).filter(r => r.done).length} · ⌨ ${Object.values(pd.learn.songs).filter(r => r.done).length} / ${nSongs}`;
    return { piano, plays: hist.length, done: list.filter(l => won(p, l)).length, total: list.length, stars: totalStars(p), best: Math.round(p.stats.bestWpm || 0),
      avgAcc: Math.round(avgAcc), avgWpm: Math.round(avgWpm), keys: p.stats.keys, last, weak: weakKeys(p).slice(0, 5).map(w => w.k),
      certs: Object.keys(p.certs).length, worlds: WORLDS.filter(w => list.some(l => l.world === WORLDS.indexOf(w))).length };
  }
  function openStats() {
    show('scr-stats'); applyStatic();
    const p = profile, sm = profileSummary(p);
    const body = $('stats-body'); body.innerHTML = '';
    const tile = (v, label) => h('div', { class: 'stat-tile' }, h('b', {}, v), h('small', {}, label));
    body.append(h('div', { class: 'stat-tiles' },
      tile(sm.best, t('bestSpeed')), tile(sm.plays ? sm.avgAcc + '%' : '—', t('recentAcc')), tile(sm.done + ' / ' + sm.total, t('levelsCompleted')),
      tile('★ ' + sm.stars, t('starsCap')), tile(sm.keys, t('keysTyped')), tile(sm.certs, t('certificates')),
      tile('🎹 ' + sm.piano, t('pianoSongs'))));
    const hist = p.history.slice(-30);
    body.append(h('div', { class: 'charts' },
      lineChart(hist, 'acc', t('accOverTime'), '%', '#8bdc6a', 100),
      lineChart(hist, 'wpm', t('wpmOverTime'), ' ' + t('wpm'), '#4dd0e1')));
    const weak = weakKeys(p).slice(0, 10);
    const missed = h('div', { class: 'panel missed' }, h('h3', {}, t('mostMissed')));
    if (!weak.length) missed.append(h('p', { class: 'small' }, t('noWeakYet')));
    weak.forEach(w => missed.append(h('div', { class: 'miss-row' },
      h('span', { class: 'kcap tiny', style: 'background:' + FINGER_COLORS[(KEY_INFO[(charPlan(w.k) || { base: 'f' }).base] || { finger: 'th' }).finger] }, keyLabel(w.k)),
      h('div', { class: 'miss-bar' }, h('div', { style: `width:${Math.round(w.rate * 100)}%` })),
      h('small', {}, t('missedOf', w.e, w.n)))));
    missed.append(h('button', { class: 'btn btn-gold', onclick: smartPractice }, '🎯 ' + t('smartPractice')));
    body.append(missed);
    const certs = h('div', { class: 'panel' }, h('h3', {}, '🏅 ' + t('certificates')));
    const ids = Object.keys(p.certs);
    if (!ids.length) certs.append(h('p', { class: 'small' }, t('noCerts')));
    ids.forEach(id => { const w = WORLDS.find(x => x.id === id); if (w) certs.append(h('button', { class: 'btn btn-small cert-btn', onclick: () => showCertificate(id) }, worldName(w, lang()))); });
    body.append(certs);
    // table view of recent plays (accessible alternative to the charts)
    const tbl = h('table', { class: 'data-table' }, h('caption', {}, t('recentPlays')),
      h('tr', {}, h('th', {}, t('date')), h('th', {}, t('wpm')), h('th', {}, t('accuracy')), h('th', {}, t('result'))),
      p.history.slice(-10).reverse().map(x => h('tr', {}, h('td', {}, fmtDate(x.t)), h('td', {}, Math.round(x.wpm)), h('td', {}, Math.round(x.acc) + '%'), h('td', {}, x.win ? '✔' : '✘'))));
    body.append(h('div', { class: 'panel table-wrap' }, tbl));
  }

  // ---------- parent view ----------
  function openParent() {
    show('scr-parent'); applyStatic();
    const body = $('parent-body'); body.innerHTML = '';
    const ps = Store.profiles;
    if (!ps.length) { body.append(h('p', {}, t('noPlayers'))); return; }
    const sums = ps.map(profileSummary);
    const rows = [
      ['levelsCompleted', s => `${s.done} / ${s.total}`],
      ['starsCap', s => '★ ' + s.stars],
      ['bestSpeed', s => s.best + ' ' + t('wpm')],
      ['avgSpeed', s => s.plays ? s.avgWpm + ' ' + t('wpm') : '—'],
      ['recentAcc', s => s.plays ? s.avgAcc + '%' : '—'],
      ['keysTyped', s => s.keys],
      ['mostMissed', s => s.weak.length ? s.weak.map(keyLabel).join(' ') : '—'],
      ['certificates', s => s.certs],
      ['pianoSongs', s => '🎹 ' + s.piano],
      ['lastPlayed', s => s.last ? fmtDate(s.last) : '—']
    ];
    const tbl = h('table', { class: 'parent-table' },
      h('tr', {}, h('th', {}, ''), ps.map(p => { const cv = h('canvas', { width: 80, height: 80 }); headshot(cv, p.look); return h('th', {}, cv, h('div', {}, p.name)); })),
      h('tr', {}, h('th', {}, t('settingsShort')), ps.map(p => h('td', { class: 'small' }, `${p.settings.mode === 'practice' ? t('practice') : t('challenge')} · ${p.settings.typeLang.toUpperCase()}${p.settings.verse ? ' · 📖' : ''}`))),
      rows.map(([k, f]) => h('tr', {}, h('th', {}, t(k)), sums.map(s => h('td', {}, f(s))))),
      h('tr', {}, h('th', {}, t('coinsCap')), ps.map(p => h('td', {}, '🪙 ' + p.coins))));
    body.append(h('div', { class: 'table-wrap' }, tbl));
  }

  // ---------- input ----------
  function onKeyDown(e) {
    if (e.code === 'ShiftLeft') shiftL = true;
    if (e.code === 'ShiftRight') shiftR = true;
    if (currentScreen !== 'scr-game') return;
    if (!$('modal').classList.contains('hidden')) {
      if (e.key === 'Escape') { const S = Game.state(); if (S && S.paused && !S.asking) resume(); }
      return;
    }
    if (e.target === $('hidden-input')) return; // handled by the input event
    if (e.key === 'Escape') { pauseMenu(); return; }
    if (e.key === 'Dead') { deadPending = true; const S = Game.state(); if (S) highlightKey(S.text[S.pos]); return; }
    if (e.metaKey || (e.ctrlKey && !e.altKey)) return;
    if (e.key.length === 1 || /^\p{L}$/u.test(e.key)) {
      e.preventDefault();
      deadPending = false;
      if (e.getModifierState && e.getModifierState('CapsLock') && /\p{L}/u.test(e.key)) { toast(t('capsLockOn')); return; }
      Game.key(e.key, { shiftL, shiftR });
    }
  }
  function onKeyUp(e) {
    if (e.code === 'ShiftLeft') shiftL = false;
    if (e.code === 'ShiftRight') shiftR = false;
  }
  let composing = false;
  function onHiddenInput(e) {
    if (composing || e.isComposing) return;
    const inp = e.target;
    const v = inp.value;
    inp.value = '';
    if (!$('modal').classList.contains('hidden')) return;
    for (const ch of v) Game.key(ch, null);
  }

  function fitViewport() {
    const vv = window.visualViewport;
    const hgt = vv ? vv.height : window.innerHeight;
    document.documentElement.style.setProperty('--app-h', hgt + 'px');
    window.scrollTo(0, 0);
    if (currentScreen === 'scr-game') Game.resize();
    if (currentScreen === 'scr-piano') Piano.resize();
  }

  // ---------- installable app ----------
  let installEvt = null;
  function setupInstall() {
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('btn-install').classList.remove('hidden'); });
    window.addEventListener('appinstalled', () => { $('btn-install').classList.add('hidden'); toast(t('installed')); });
    $('btn-install').addEventListener('click', async () => {
      if (!installEvt) return;
      installEvt.prompt();
      try { await installEvt.userChoice; } catch (e) {}
      installEvt = null; $('btn-install').classList.add('hidden');
    });
    // the service worker only controls this game's own folder (scope "./")
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
    }
  }

  function init() {
    Store.load();
    Game.init($('scene'));
    keyEls = buildKeyboard($('kbd'), false);
    buildHands();
    profile = null;
    $('btn-new').addEventListener('click', () => { Sound.unlock(); newProfile(); });
    $('btn-guide-start').addEventListener('click', () => openGuide());
    $('btn-parent').addEventListener('click', () => openParent());
    $('lang-en').addEventListener('click', () => { Store.uiLang = 'en'; renderStart(); });
    $('lang-es').addEventListener('click', () => { Store.uiLang = 'es'; renderStart(); });
    $('c-cancel').addEventListener('click', () => { if (editing) openMap(); else { show('scr-start'); renderStart(); } });
    $('c-save').addEventListener('click', saveCreate);
    $('btn-map-guide').addEventListener('click', () => openGuide());
    $('btn-map-settings').addEventListener('click', () => openSettings(false));
    $('btn-map-switch').addEventListener('click', () => { show('scr-start'); renderStart(); });
    $('btn-map-shop').addEventListener('click', openShop);
    $('btn-map-stats').addEventListener('click', openStats);
    $('btn-map-smart').addEventListener('click', smartPractice);
    $('btn-map-hub').addEventListener('click', openHub);
    $('btn-hub-back').addEventListener('click', () => { show('scr-start'); renderStart(); });
    $('btn-hub-settings').addEventListener('click', () => openSettings(false));
    $('btn-hub-escape').addEventListener('click', () => { Sound.play('click'); openMap(); });
    $('btn-hub-piano').addEventListener('click', () => { Sound.play('click'); Piano.openHome(); });
    Piano.init({ h, openModal, closeModal, toast, show, applyStatic, isPhone, lang: () => lang(), profile: () => profile,
      screen: () => currentScreen, back: openHub });
    document.querySelectorAll('.btn-back-map').forEach(b => b.addEventListener('click', () => openMap()));
    $('btn-parent-back').addEventListener('click', () => { if (profile) openMap(); else { show('scr-start'); renderStart(); } });
    $('btn-guide-back').addEventListener('click', () => { if (guideBack === 'scr-map' && profile) openMap(); else { show('scr-start'); renderStart(); } });
    $('btn-help').addEventListener('click', helpForCurrentKey);
    $('btn-pause').addEventListener('click', pauseMenu);
    $('stage').addEventListener('pointerdown', e => { if (isPhone() && !e.target.closest('button')) focusInput(); });
    const inp = $('hidden-input');
    inp.addEventListener('input', onHiddenInput);
    inp.addEventListener('compositionstart', () => { composing = true; });
    inp.addEventListener('compositionend', e => { composing = false; onHiddenInput({ target: inp }); });
    inp.addEventListener('focus', () => $('tap-hint').classList.remove('show'));
    inp.addEventListener('blur', () => { const S = Game.state(); if (S && !S.over && currentScreen === 'scr-game') $('tap-hint').classList.add('show'); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', () => { shiftL = shiftR = false; });
    $('modal').addEventListener('click', e => { if (e.target === $('modal') && currentScreen !== 'scr-game') closeModal(); });
    window.addEventListener('resize', fitViewport);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fitViewport);
    setupInstall();
    fitViewport();
    renderStart();
    show('scr-start');
  }

  return { init, isPhone, flashError, show, get lang() { return lang(); } };
})();

window.addEventListener('DOMContentLoaded', UI.init);
