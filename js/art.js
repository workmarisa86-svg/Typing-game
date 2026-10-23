/* All drawing: player sprites, creatures, hazards and layered scenes (Canvas 2D, flat cartoon style) */
'use strict';

const Art = (() => {
  const OUT = '#1e2536';
  const TAU = Math.PI * 2;

  // ---------- helpers ----------
  function shade(hex, amt) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const n = parseInt(c, 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const pt = (p, len, a) => [p[0] + len * Math.sin(a), p[1] + len * Math.cos(a)];
  function limb(ctx, pts, w, color, outW = 5) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = OUT; ctx.lineWidth = w + outW; ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
  }
  function fillOut(ctx, fill, lw = 3) {
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }
  function ellipse(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
  }
  function hash(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---------- character look options ----------
  const SKINS = ['#ffe0c7', '#f6c9a0', '#e8b088', '#c98f63', '#a06a45', '#6e452c'];
  const HAIR_COLORS = ['#1f1a17', '#3b2416', '#6b3f22', '#8e4a26', '#d6a756', '#8d8d8d'];
  const OUTFIT_COLORS = ['#3b7dd8', '#e8736b', '#2f9e8f', '#7b5fc9', '#e0a03a', '#4caf50', '#c0392b', '#34495e', '#8d6e63', '#ec8fb5'];
  const BOTTOM_COLORS = ['#263354', '#3a3f4b', '#5d4037', '#1f6f6a', '#6d4c41', '#7b5fc9', '#2f9e8f', '#8e3b46'];
  const SHOE_COLORS = ['#8b4a2b', '#f06292', '#37474f', '#ffffff', '#1e88e5', '#43a047'];
  const OPTIONS = {
    male: {
      hair: [['crop', 'Short crop'], ['sidepart', 'Side part'], ['curly', 'Short curls'], ['buzz', 'Buzz cut']],
      top: [['shirt', 'Long-sleeve shirt'], ['tshirt', 'T-shirt'], ['hoodie', 'Hoodie'], ['jacket', 'Zip jacket']],
      bottom: [['pants', 'Regular pants'], ['cargo', 'Cargo pants']]
    },
    female: {
      hair: [['ponytail', 'Ponytail'], ['long', 'Long hair'], ['bun', 'Bun'], ['braid', 'Braid']],
      top: [['blouse', 'Long-sleeve blouse'], ['tunic', 'Loose tunic'], ['cardigan', 'Cardigan']],
      bottom: [['skirt', 'Long skirt'], ['pleated', 'Pleated long skirt']]
    }
  };
  function defaultLook(gender) {
    return gender === 'female'
      ? { gender, skin: SKINS[1], hair: 'ponytail', hairColor: HAIR_COLORS[1], top: 'blouse', topColor: '#e8736b', bottom: 'skirt', bottomColor: '#1f6f6a', shoes: '#f06292' }
      : { gender: 'male', skin: SKINS[1], hair: 'crop', hairColor: HAIR_COLORS[1], top: 'shirt', topColor: '#3b7dd8', bottom: 'pants', bottomColor: '#263354', shoes: '#8b4a2b' };
  }

  // ---------- poses ----------
  // angles: 0 = straight down, positive = toward the front (the way the character faces).
  // knees: shin = thigh - flex (knee points forward); elbows: forearm = upper + flex (forearm folds forward).
  function runPose(p, speed) {
    const amp = 0.38 + 0.3 * Math.min(speed, 1.4);
    const legs = [0, 1].map(i => {
      const ph = p + i * Math.PI;
      return { t: amp * Math.sin(ph), f: 0.15 + (0.55 + 0.7 * speed) * Math.max(0, Math.cos(ph)) };
    });
    const arms = [0, 1].map(i => {
      const ph = p + i * Math.PI;
      return { u: -amp * 1.15 * Math.sin(ph), f: 1.35 + 0.35 * Math.sin(ph) };
    });
    return { legs, arms, lean: 0.1 + 0.1 * Math.min(speed, 1.4), drop: Math.abs(Math.cos(p)) * 3 * speed, tilt: 0 };
  }
  function idlePose(t) {
    const b = Math.sin(t * 2) * 0.03;
    return { legs: [{ t: -0.08, f: 0.05 }, { t: 0.1, f: 0.08 }], arms: [{ u: -0.12 + b, f: 0.35 }, { u: 0.12 - b, f: 0.4 }], lean: 0, drop: 0, tilt: 0 };
  }
  // fallen forward onto hands and one knee
  const FALL_POSE = { legs: [{ t: -0.35, f: 1.75 }, { t: 1.25, f: 1.5 }], arms: [{ u: 0.55, f: 0.15 }, { u: 0.75, f: 0.2 }], lean: 1.05, drop: 34, tilt: 0.25 };
  function holdPose(strain, t) {
    const sh = Math.sin(t * 40) * 0.02 * strain;
    return { legs: [{ t: -0.38, f: 0.25 + strain * 0.4 }, { t: 0.42 + strain * 0.15, f: 0.6 + strain * 0.6 }],
      arms: [{ u: Math.PI - 0.35 + sh, f: 0.55 }, { u: Math.PI - 0.25 - sh, f: 0.5 }], lean: -0.04 + sh, drop: 4 + strain * 14, tilt: -0.1 };
  }
  function hangPose(climb, t) {
    const a = Math.sin(climb) * 0.25;
    return { legs: [{ t: 0.15 + Math.sin(climb) * 0.2, f: 0.5 + Math.max(0, Math.sin(climb)) * 0.6 }, { t: 0.2 - Math.sin(climb) * 0.2, f: 0.5 + Math.max(0, -Math.sin(climb)) * 0.6 }],
      arms: [{ u: Math.PI - 0.05 + a, f: 0.25 }, { u: Math.PI + 0.12 - a, f: 0.25 }], lean: 0.05, drop: 0, tilt: -0.15 };
  }
  function cheerPose(t) {
    const w = Math.sin(t * 10) * 0.25;
    return { legs: [{ t: -0.12, f: 0.05 }, { t: 0.12, f: 0.1 }], arms: [{ u: Math.PI - 0.6 + w, f: 0.3 }, { u: Math.PI - 0.3 - w, f: 0.3 }], lean: -0.02, drop: 0, tilt: -0.1 };
  }
  function mixPose(a, b, w) {
    const m = (x, y) => lerp(x, y, w);
    return {
      legs: a.legs.map((l, i) => ({ t: m(l.t, b.legs[i].t), f: m(l.f, b.legs[i].f) })),
      arms: a.arms.map((l, i) => ({ u: m(l.u, b.arms[i].u), f: m(l.f, b.arms[i].f) })),
      lean: m(a.lean, b.lean), drop: m(a.drop, b.drop), tilt: m(a.tilt || 0, b.tilt || 0)
    };
  }

  // ---------- the player character ----------
  function drawShoe(ctx, ankle, shinAng, color) {
    ctx.save(); ctx.translate(ankle[0], ankle[1]); ctx.rotate(-shinAng);
    rrect(ctx, -6, -3, 22, 10, 5); fillOut(ctx, color, 2.5);
    ctx.fillStyle = '#f4f4f4'; ctx.fillRect(-5, 4, 20, 2.5);
    ctx.restore();
  }
  function drawHand(ctx, p, skin) { circle(ctx, p[0], p[1], 6); fillOut(ctx, skin, 2.5); }

  function drawPerson(ctx, look, pose, x, y, s, opt = {}) {
    const fem = look.gender === 'female';
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (!opt.noShadow) { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ellipse(ctx, 0, 3, 34, 6); ctx.fill(); }
    const TH = 33, SH = 33, UA = 24, FA = 22, TORSO = 46;
    const hip = [0, -72 + pose.drop];
    const lean = pose.lean;
    const shoulder = [hip[0] + TORSO * Math.sin(lean), hip[1] - TORSO * Math.cos(lean)];
    const legColor = fem ? '#2c3150' : look.bottomColor;
    const legs = pose.legs.map(l => {
      const knee = pt(hip, TH, l.t), ankle = pt(knee, SH, l.t - l.f);
      return { knee, ankle, shin: l.t - l.f };
    });
    const arms = pose.arms.map(a => {
      const sh = [shoulder[0] - 2, shoulder[1] + 4];
      const elbow = pt(sh, UA, a.u), wrist = pt(elbow, FA, a.u + a.f);
      return { sh, elbow, wrist };
    });
    const sleeve = look.topColor;
    const shortSleeve = look.top === 'tshirt';
    function drawArm(i, dark) {
      const a = arms[i];
      const col = dark ? shade(sleeve, -0.18) : sleeve;
      const skin = dark ? shade(look.skin, -0.12) : look.skin;
      if (shortSleeve) {
        limb(ctx, [a.sh, a.elbow, a.wrist], 9, skin);
        const mid = [lerp(a.sh[0], a.elbow[0], 0.55), lerp(a.sh[1], a.elbow[1], 0.55)];
        limb(ctx, [a.sh, mid], 12, col);
      } else {
        limb(ctx, [a.sh, a.elbow, a.wrist], 11, col);
        if (look.top === 'cardigan' || look.top === 'hoodie') {
          const cuff = [lerp(a.elbow[0], a.wrist[0], 0.85), lerp(a.elbow[1], a.wrist[1], 0.85)];
          limb(ctx, [cuff, a.wrist], 11, shade(col, -0.15), 0);
        }
      }
      drawHand(ctx, pt(a.wrist, 3, pose.arms[i].u + pose.arms[i].f), skin);
    }
    function drawLeg(i, dark) {
      const L = legs[i];
      const col = dark ? shade(legColor, -0.2) : legColor;
      limb(ctx, [hip, L.knee, L.ankle], 13, col);
      if (!fem && look.bottom === 'cargo') {
        const m = [lerp(hip[0], L.knee[0], 0.6), lerp(hip[1], L.knee[1], 0.6)];
        rrect(ctx, m[0] - 4, m[1] - 4, 8, 8, 2); fillOut(ctx, shade(col, -0.15), 1.5);
      }
      drawShoe(ctx, L.ankle, L.shin, dark ? shade(look.shoes, -0.15) : look.shoes);
    }

    drawArm(0, true);
    drawLeg(0, true);
    drawLeg(1, false);

    if (fem) { // long skirt over the legs
      const kx = legs.map(l => l.knee[0]);
      const hemY = hip[1] + 52;
      const left = Math.min(...kx, hip[0] - 6) - 14, right = Math.max(...kx, hip[0] + 6) + 14;
      ctx.beginPath();
      ctx.moveTo(hip[0] - 13, hip[1] - 6);
      ctx.lineTo(hip[0] + 13, hip[1] - 6);
      ctx.quadraticCurveTo(right - 2, hip[1] + 20, right, hemY);
      ctx.quadraticCurveTo((left + right) / 2, hemY + 5, left, hemY);
      ctx.quadraticCurveTo(left + 4, hip[1] + 18, hip[0] - 13, hip[1] - 6);
      ctx.closePath();
      fillOut(ctx, look.bottomColor);
      ctx.save(); ctx.clip();
      ctx.fillStyle = shade(look.bottomColor, -0.18); ctx.fillRect(left - 5, hip[1] - 10, (right - left) * 0.3, 80);
      if (look.bottom === 'pleated') {
        ctx.strokeStyle = shade(look.bottomColor, -0.3); ctx.lineWidth = 1.5;
        for (let k = 1; k < 5; k++) {
          ctx.beginPath(); ctx.moveTo(lerp(hip[0] - 10, hip[0] + 10, k / 5), hip[1]);
          ctx.lineTo(lerp(left, right, k / 5), hemY + 3); ctx.stroke();
        }
      }
      ctx.restore();
    }

    // torso
    ctx.save(); ctx.translate(hip[0], hip[1]); ctx.rotate(lean);
    const W = fem ? 25 : 30;
    const bottomExt = look.top === 'tunic' ? 16 : (fem ? 4 : 6);
    if (look.top === 'hoodie') { // hood behind the neck
      ellipse(ctx, -9, -TORSO + 2, 10, 7, -0.3); fillOut(ctx, shade(sleeve, -0.1), 2.5);
    }
    ctx.beginPath();
    if (look.top === 'tunic') {
      ctx.moveTo(-W / 2, -TORSO); ctx.lineTo(W / 2, -TORSO);
      ctx.lineTo(W / 2 + 5, bottomExt); ctx.lineTo(-W / 2 - 5, bottomExt); ctx.closePath();
    } else rrect(ctx, -W / 2, -TORSO - 2, W, TORSO + 2 + bottomExt, [11, 11, 5, 5]);
    fillOut(ctx, sleeve);
    ctx.save(); ctx.clip();
    ctx.fillStyle = shade(sleeve, -0.18); ctx.fillRect(-W / 2 - 6, -TORSO - 4, 8, TORSO + 30);
    ctx.fillStyle = shade(sleeve, 0.15); ctx.fillRect(W / 2 - 5, -TORSO + 4, 3, TORSO - 6);
    if (look.top === 'jacket') {
      ctx.strokeStyle = shade(sleeve, -0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2 - 6, -TORSO); ctx.lineTo(W / 2 - 6, bottomExt); ctx.stroke();
    }
    if (look.top === 'cardigan') {
      ctx.fillStyle = shade(sleeve, 0.45); ctx.fillRect(W / 2 - 8, -TORSO, 6, TORSO + 8);
    }
    if (look.top === 'hoodie') {
      rrect(ctx, -2, -16, W / 2 + 4, 12, 4); fillOut(ctx, shade(sleeve, -0.12), 1.5);
    }
    if (!fem) { ctx.fillStyle = shade(look.bottomColor, -0.25); ctx.fillRect(-W / 2, bottomExt - 6, W, 6); }
    ctx.restore();
    // collar
    ctx.fillStyle = shade(sleeve, -0.25);
    ctx.beginPath(); ctx.ellipse(4, -TORSO + 1, 8, 3, 0, 0, TAU); ctx.fill();
    ctx.restore();

    // neck + head
    const hc = [shoulder[0] + 4 + Math.sin(lean) * 6, shoulder[1] - 22];
    limb(ctx, [[shoulder[0] + 2, shoulder[1] + 2], [hc[0] - 1, hc[1] + 10]], 9, shade(look.skin, -0.1), 4);
    drawHead(ctx, look, hc[0], hc[1] - 2, 23, pose.tilt || 0, opt);

    drawArm(1, false);
    ctx.restore();
  }

  function drawHead(ctx, look, hx, hy, r, tilt, opt) {
    const fem = look.gender === 'female';
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt); hx = 0; hy = 0;
    const hc = look.hairColor, sway = opt.sway || 0;
    // hair behind the head
    if (fem) {
      if (look.hair === 'ponytail') {
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, -r * 0.6);
        ctx.quadraticCurveTo(-r * 2.1, -r * 0.9 + sway * 4, -r * 2.3, r * 0.25 + sway * 8);
        ctx.quadraticCurveTo(-r * 1.6, -r * 0.05, -r * 0.85, -r * 0.05);
        ctx.closePath(); fillOut(ctx, hc, 2.5);
      } else if (look.hair === 'long') {
        rrect(ctx, -r * 1.08, -r * 0.6, r * 1.25, r * 2.05, [r, r * 0.4, r * 0.5, r * 0.6]); fillOut(ctx, hc, 2.5);
      } else if (look.hair === 'bun') {
        circle(ctx, -r * 0.78, -r * 0.72, r * 0.48); fillOut(ctx, hc, 2.5);
      } else if (look.hair === 'braid') {
        for (let k = 4; k >= 0; k--) {
          ellipse(ctx, -r * 0.8 - k * 1.2 + Math.sin(sway + k) * k * 0.6, r * 0.1 + k * r * 0.33, r * 0.24, r * 0.2);
          fillOut(ctx, hc, 2);
        }
      }
    }
    // ear + head
    circle(ctx, hx, hy, r); fillOut(ctx, look.skin, 2.8);
    ctx.save(); circle(ctx, hx, hy, r); ctx.clip();
    ctx.fillStyle = shade(look.skin, -0.1); circle(ctx, hx - r * 0.9, hy + r * 0.4, r * 0.8); ctx.fill();
    ctx.restore();
    // nose bump
    ctx.beginPath(); ctx.arc(hx + r * 0.95, hy + r * 0.15, r * 0.18, -1.2, 1.4); fillOut(ctx, look.skin, 2.2);
    // front hair cap
    ctx.beginPath();
    const capR = r + (look.hair === 'buzz' ? 0.5 : 2);
    ctx.arc(hx, hy, capR, Math.PI * 0.9, Math.PI * 1.93);
    const fringeY = look.hair === 'buzz' ? -0.62 : -0.42;
    ctx.quadraticCurveTo(hx + r * 0.55, hy + r * (fringeY - 0.05), hx + r * 0.15, hy + r * (fringeY - 0.08));
    ctx.quadraticCurveTo(hx - r * 0.25, hy - r * 0.15, hx - r * 0.3, hy + r * 0.25);
    if (fem && (look.hair === 'long')) {
      ctx.lineTo(hx - r * 0.35, hy + r * 1.1); ctx.lineTo(hx - r * 1.05, hy + r * 1.2);
    } else {
      ctx.lineTo(hx - r * 0.55, hy + r * 0.62); ctx.lineTo(hx - r * 0.95, hy + r * 0.4);
    }
    ctx.closePath(); fillOut(ctx, hc, 2.5);
    if (look.hair === 'sidepart') { ellipse(ctx, hx + r * 0.35, hy - r * 0.82, r * 0.6, r * 0.28, -0.25); fillOut(ctx, hc, 2.2); }
    if (look.hair === 'curly') {
      for (let a = 0.95; a <= 1.9; a += 0.16) {
        circle(ctx, hx + Math.cos(a * Math.PI) * (r + 1), hy + Math.sin(a * Math.PI) * (r + 1), r * 0.27); fillOut(ctx, hc, 2);
      }
    }
    if (fem && look.hair === 'ponytail') { circle(ctx, -r * 0.82, -r * 0.35, 3.5); fillOut(ctx, '#e84a7a', 1.5); }
    // highlight on hair
    ctx.strokeStyle = shade(hc, 0.3); ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(hx, hy, r * 0.82, Math.PI * 1.35, Math.PI * 1.6); ctx.stroke();
    // ear
    ellipse(ctx, hx - r * 0.18, hy + r * 0.12, r * 0.22, r * 0.3); fillOut(ctx, look.skin, 2.2);
    ellipse(ctx, hx - r * 0.18, hy + r * 0.14, r * 0.09, r * 0.14); ctx.fillStyle = shade(look.skin, -0.25); ctx.fill();
    // eye
    const ex = hx + r * 0.5, ey = hy - r * 0.02;
    if (opt.dizzy) {
      ctx.strokeStyle = OUT; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(ex - 4, ey - 4); ctx.lineTo(ex + 4, ey + 4); ctx.moveTo(ex + 4, ey - 4); ctx.lineTo(ex - 4, ey + 4); ctx.stroke();
    } else {
      ellipse(ctx, ex, ey, r * 0.22, r * 0.27); fillOut(ctx, '#fff', 2);
      circle(ctx, ex + 1.6, ey + 0.5, r * 0.13); ctx.fillStyle = '#2a2118'; ctx.fill();
      circle(ctx, ex + 2.6, ey - 1.2, 1.1); ctx.fillStyle = '#fff'; ctx.fill();
    }
    if (fem) { // lashes
      ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(ex + 2, ey - r * 0.27); ctx.lineTo(ex + 5, ey - r * 0.42);
      ctx.moveTo(ex + 4.5, ey - r * 0.2); ctx.lineTo(ex + 8, ey - r * 0.3); ctx.stroke();
      circle(ctx, hx + r * 0.42, hy + r * 0.38, r * 0.16); ctx.fillStyle = 'rgba(240,120,130,0.35)'; ctx.fill();
    }
    // brow
    ctx.strokeStyle = shade(hc, -0.2); ctx.lineWidth = fem ? 2 : 3; ctx.lineCap = 'round';
    const worried = opt.mood === 'worried';
    ctx.beginPath(); ctx.moveTo(ex - 5, ey - r * 0.42 + (worried ? 2 : 0)); ctx.lineTo(ex + 5, ey - r * 0.48 - (worried ? 2 : -1)); ctx.stroke();
    // mouth
    ctx.strokeStyle = OUT; ctx.lineWidth = 2;
    if (opt.mood === 'happy') {
      ctx.beginPath(); ctx.arc(hx + r * 0.6, hy + r * 0.42, r * 0.22, 0.2, Math.PI - 0.6); ctx.stroke();
    } else if (opt.mood === 'shout') {
      ellipse(ctx, hx + r * 0.62, hy + r * 0.52, r * 0.14, r * 0.17); fillOut(ctx, '#7a2a2a', 1.8);
    } else {
      ctx.beginPath(); ctx.moveTo(hx + r * 0.45, hy + r * 0.55); ctx.lineTo(hx + r * 0.78, hy + r * 0.5); ctx.stroke();
    }
    ctx.restore();
  }

  function drawDizzyStars(ctx, x, y, t, s = 1) {
    for (let i = 0; i < 3; i++) {
      const a = t * 5 + i * TAU / 3;
      star(ctx, x + Math.cos(a) * 22 * s, y + Math.sin(a) * 7 * s, 6 * s, '#ffd54f');
    }
  }
  function star(ctx, x, y, r, col) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r, a = -Math.PI / 2 + i * Math.PI / 5;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); fillOut(ctx, col, 1.5);
  }

  // ---------- creatures & hazards ----------
  const BEASTS = {
    wolf: { body: '#7d8697', belly: '#c9ced8', dark: '#5c6475', ears: 'pointy', tail: 'bushy', legLen: 1 },
    cheetah: { body: '#e8b64c', belly: '#fbe7b5', dark: '#c48f2a', ears: 'round', tail: 'long', spots: true, legLen: 1.1 },
    boar: { body: '#7a5236', belly: '#a77b58', dark: '#5a3a24', ears: 'pointy', tail: 'short', tusks: true, legLen: 0.75 }
  };
  function drawBeast(ctx, kind, x, y, s, phase, angry = 1) {
    const B = BEASTS[kind] || BEASTS.wolf;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ellipse(ctx, 0, 3, 80, 9); ctx.fill();
    const bob = Math.sin(phase * 2) * 3;
    const by = -62 * B.legLen + bob - 6;
    const legL = 26 * B.legLen;
    function leg(ox, ph, hind, dark) {
      const col = dark ? B.dark : B.body;
      const top = [ox, by + 8];
      const a = (hind ? 0.15 : -0.05) + 0.65 * Math.sin(ph);
      const bend = hind ? -(0.5 + 0.6 * Math.max(0, Math.cos(ph))) : -(0.15 + 1.0 * Math.max(0, Math.cos(ph)));
      const k = pt(top, legL, a), f = pt(k, legL + 2, a + bend);
      limb(ctx, [top, k, f], hind ? 13 : 11, col, 5);
      ellipse(ctx, f[0] + 3, f[1], 7, 4.5); fillOut(ctx, dark ? shade(B.dark, -0.1) : B.dark, 2);
    }
    // tail
    ctx.lineCap = 'round';
    const tw = Math.sin(phase * 2) * 0.3;
    if (B.tail === 'bushy') {
      ctx.save(); ctx.translate(-58, by - 4); ctx.rotate(-0.35 + tw);
      ellipse(ctx, -30, 0, 34, 12, 0.1); fillOut(ctx, B.body);
      ellipse(ctx, -52, 2, 12, 8, 0.1); ctx.fillStyle = B.belly; ctx.fill();
      ctx.restore();
    } else if (B.tail === 'long') {
      limb(ctx, [[-58, by - 2], [-90, by - 8 + tw * 20], [-112, by - 30 + tw * 30]], 7, B.body, 4);
      circle(ctx, -112, by - 30 + tw * 30, 4); ctx.fillStyle = '#222'; ctx.fill();
    } else {
      limb(ctx, [[-56, by - 6], [-66, by - 14 + tw * 10]], 4, B.dark, 3);
    }
    leg(-38, phase + Math.PI + 0.5, true, true);
    leg(34, phase + 0.5, false, true);
    // body
    ellipse(ctx, 0, by, 64, 26, -0.04); fillOut(ctx, B.body);
    ctx.save(); ellipse(ctx, 0, by, 64, 26, -0.04); ctx.clip();
    ctx.fillStyle = B.belly; ellipse(ctx, 5, by + 22, 52, 12); ctx.fill();
    ctx.fillStyle = shade(B.body, 0.12); ellipse(ctx, 5, by - 20, 46, 8); ctx.fill();
    if (B.spots) {
      ctx.fillStyle = '#3a2a14';
      for (let i = 0; i < 16; i++) { circle(ctx, -50 + hash(i) * 100, by - 18 + hash(i + 9) * 30, 3 + hash(i + 3) * 2); ctx.fill(); }
    }
    ctx.restore();
    leg(-34, phase + Math.PI, true, false);
    leg(38, phase, false, false);
    // head
    const hx = 66, hy = by - 18 + Math.sin(phase * 2 + 1) * 2;
    if (B.ears === 'pointy') {
      ctx.beginPath(); ctx.moveTo(hx - 16, hy - 10); ctx.lineTo(hx - 12, hy - 40); ctx.lineTo(hx - 1, hy - 16); ctx.closePath(); fillOut(ctx, B.dark);
      ctx.beginPath(); ctx.moveTo(hx - 3, hy - 12); ctx.lineTo(hx + 2, hy - 38); ctx.lineTo(hx + 10, hy - 12); ctx.closePath(); fillOut(ctx, B.body);
      ctx.beginPath(); ctx.moveTo(hx + 1, hy - 15); ctx.lineTo(hx + 3, hy - 30); ctx.lineTo(hx + 7, hy - 15); ctx.closePath(); ctx.fillStyle = '#e9a3a3'; ctx.fill();
    } else {
      circle(ctx, hx - 6, hy - 22, 8); fillOut(ctx, B.body); circle(ctx, hx - 6, hy - 22, 3.5); ctx.fillStyle = '#3a2a14'; ctx.fill();
    }
    circle(ctx, hx, hy, 22); fillOut(ctx, B.body);
    // snout + jaw (open while chasing)
    const jaw = 0.25 + 0.15 * Math.sin(phase * 3);
    ctx.save(); ctx.translate(hx + 14, hy + 6); ctx.rotate(jaw);
    rrect(ctx, 0, -2, 26, 9, 5); fillOut(ctx, B.belly, 2.5);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(hx + 10, hy - 6); ctx.lineTo(hx + 40, hy + 1); ctx.lineTo(hx + 38, hy + 8); ctx.lineTo(hx + 12, hy + 10); ctx.closePath();
    fillOut(ctx, B.body, 2.5);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(hx + 18 + i * 7, hy + 8); ctx.lineTo(hx + 21 + i * 7, hy + 13); ctx.lineTo(hx + 24 + i * 7, hy + 8); ctx.fill(); }
    if (B.tusks) { ctx.beginPath(); ctx.moveTo(hx + 30, hy + 8); ctx.quadraticCurveTo(hx + 38, hy + 4, hx + 36, hy - 4); ctx.lineTo(hx + 33, hy + 6); fillOut(ctx, '#fff8e1', 1.5); }
    circle(ctx, hx + 40, hy + 1, 4.5); ctx.fillStyle = '#222'; ctx.fill();
    if (kind === 'cheetah') { ctx.strokeStyle = '#3a2a14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + 8, hy - 2); ctx.lineTo(hx + 14, hy + 12); ctx.stroke(); }
    ellipse(ctx, hx + 6, hy - 6, 6, 5); fillOut(ctx, '#ffe066', 2);
    circle(ctx, hx + 8, hy - 6, 2.4); ctx.fillStyle = '#222'; ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 3.5 * angry; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - 2, hy - 15); ctx.lineTo(hx + 13, hy - 9); ctx.stroke();
    ctx.restore();
  }

  function drawAvalanche(ctx, front, ground, H, t) {
    ctx.save();
    const grd = ctx.createLinearGradient(front - 300, 0, front, 0);
    grd.addColorStop(0, '#dfeaf3'); grd.addColorStop(1, '#ffffff');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.moveTo(-50, ground + 30); ctx.lineTo(-50, ground - H * 0.55);
    for (let i = 0; i <= 10; i++) {
      const yy = ground - H * 0.55 + i * H * 0.055;
      const xx = front - 60 + Math.sin(t * 6 + i) * 10 + Math.sin(i * 1.7) * 20 + (i / 10) * 60;
      ctx.quadraticCurveTo(xx + 30, yy - 10, xx, yy + H * 0.03);
    }
    ctx.lineTo(front + 10, ground + 30); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = '#9fb4c6'; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const r = 10 + hash(i) * 18, bx = front - 10 - hash(i + 4) * 40, by = ground - r - hash(i + 2) * H * 0.3;
      circle(ctx, bx, by + Math.sin(t * 8 + i) * 4, r);
      ctx.fillStyle = '#f7fbff'; ctx.fill(); ctx.strokeStyle = '#b8cad8'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 18; i++) { circle(ctx, front + 10 + hash(i) * 50 + ((t * 80 + i * 13) % 40), ground - hash(i + 7) * H * 0.5, 2 + hash(i) * 3); ctx.fill(); }
    ctx.restore();
  }
  function drawRock(ctx, x, y, r, rot, col = '#8a8f99') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (0.82 + hash(i + r) * 0.22); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); fillOut(ctx, col, 3);
    ctx.save(); ctx.clip(); ctx.fillStyle = shade(col, -0.2); circle(ctx, r * 0.35, r * 0.4, r * 0.85); ctx.fill(); ctx.restore();
    ctx.strokeStyle = shade(col, -0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.2); ctx.lineTo(0, r * 0.1); ctx.lineTo(r * 0.2, -r * 0.3); ctx.stroke();
    ctx.restore();
  }
  function drawFaller(ctx, kind, x, y, s, rot) {
    if (kind === 'coconut') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      circle(ctx, 0, 0, 16 * s); fillOut(ctx, '#7b4a26');
      ctx.fillStyle = '#4a2a14'; [[-5, -4], [4, -5], [0, 4]].forEach(([a, b]) => { circle(ctx, a * s, b * s, 2.5 * s); ctx.fill(); });
      ctx.restore();
    } else if (kind === 'icicle') {
      ctx.save(); ctx.translate(x, y);
      ctx.beginPath(); ctx.moveTo(-10 * s, -26 * s); ctx.lineTo(10 * s, -26 * s); ctx.lineTo(0, 22 * s); ctx.closePath(); fillOut(ctx, '#bfe6fb');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-4 * s, -22 * s, 3 * s, 20 * s);
      ctx.restore();
    } else if (kind === 'pinecone') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ellipse(ctx, 0, 0, 11 * s, 16 * s); fillOut(ctx, '#8d5a2b');
      ctx.strokeStyle = '#5a3412'; ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-10 * s, i * 6 * s); ctx.lineTo(10 * s, i * 6 * s + 3); ctx.stroke(); }
      ctx.restore();
    } else drawRock(ctx, x, y, 17 * s, rot);
  }

  // ---------- scenes ----------
  const THEMES = {
    forest: { sky: ['#5ab4ec', '#c4e8f8'], mount: '#a5bcd2', cap: '#f4f8fb', hill: '#86c95e', hill2: '#6cb84c', line: '#4f9a45', ground: '#5db446', path: '#e2bb7d', pathEdge: '#c99a5c', tree: 'pine', grass: '#4a9e3a' },
    jungle: { sky: ['#6cc6e0', '#d5f1e2'], mount: '#7fb097', cap: '#a8cdb8', hill: '#3f9a4b', hill2: '#2f8a3f', line: '#2c7a3a', ground: '#3d9440', path: '#cf9f5f', pathEdge: '#a77a40', tree: 'palm', grass: '#2f7d33' },
    savanna: { sky: ['#f5b867', '#fde7b1'], mount: '#d39b65', cap: '#e8bb8a', hill: '#d8b25a', hill2: '#c9a24b', line: '#9a8a3a', ground: '#d2ab4a', path: '#ecd09a', pathEdge: '#c9a35e', tree: 'acacia', grass: '#b08d33' },
    cliffs: { sky: ['#86c2e8', '#e2eef3'], mount: '#a2948a', cap: '#efe9e3', hill: '#b39b7d', hill2: '#9e8669', line: '#7d6a55', ground: '#a48a69', path: '#d4b892', pathEdge: '#a88b65', tree: 'rockpine', grass: '#7f8f4a' },
    cave: { sky: ['#2e2420', '#4a3a31'], mount: '#3c302a', cap: '#4f4138', hill: '#5a463a', hill2: '#4b3a30', line: '#3a2e27', ground: '#5d4838', path: '#806650', pathEdge: '#5d4838', tree: 'crystal', grass: '#4b3a30', dark: true },
    snow: { sky: ['#9fd0f0', '#eef7fc'], mount: '#c7d9e8', cap: '#ffffff', hill: '#eaf3f9', hill2: '#dbe9f2', line: '#5f8f7a', ground: '#f3f8fb', path: '#d3e3ee', pathEdge: '#b3c9d8', tree: 'snowpine', grass: '#c9dce8' },
    summit: { sky: ['#f08f6a', '#fcd9a3'], mount: '#8e6f9e', cap: '#f6e6f0', hill: '#76b25f', hill2: '#5f9e4c', line: '#3f7d4a', ground: '#5fae4c', path: '#e4bf85', pathEdge: '#c69a5d', tree: 'pine', grass: '#468f3a' }
  };

  function tree(ctx, kind, x, base, s, T) {
    ctx.save(); ctx.translate(x, base); ctx.scale(s, s);
    if (kind === 'pine' || kind === 'snowpine' || kind === 'rockpine') {
      rrect(ctx, -7, -30, 14, 32, 2); fillOut(ctx, '#7a4d2b', 3);
      const g = kind === 'snowpine' ? '#3f7d5f' : '#2f8a45';
      for (let i = 0; i < 3; i++) {
        const w = 62 - i * 14, y0 = -24 - i * 38;
        ctx.beginPath(); ctx.moveTo(-w, y0); ctx.lineTo(0, y0 - 70); ctx.lineTo(w, y0); ctx.closePath(); fillOut(ctx, g, 3);
        ctx.beginPath(); ctx.moveTo(0, y0 - 70); ctx.lineTo(w, y0); ctx.lineTo(0, y0); ctx.closePath(); ctx.fillStyle = shade(g, -0.18); ctx.fill();
        if (kind === 'snowpine') { ctx.beginPath(); ctx.moveTo(-w * 0.45, y0 - 38); ctx.lineTo(0, y0 - 70); ctx.lineTo(w * 0.45, y0 - 38); ctx.quadraticCurveTo(0, y0 - 30, -w * 0.45, y0 - 38); ctx.fillStyle = '#fff'; ctx.fill(); }
      }
    } else if (kind === 'palm') {
      ctx.lineCap = 'round';
      limb(ctx, [[0, 0], [8, -80], [20, -160]], 14, '#9b6a3c', 5);
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * 0.55;
        ctx.save(); ctx.translate(20, -160); ctx.rotate(a + Math.PI / 2);
        ellipse(ctx, 0, -38, 12, 42, 0); fillOut(ctx, i % 2 ? '#3ea24a' : '#2f8a3f', 3); ctx.restore();
      }
      circle(ctx, 14, -150, 8); fillOut(ctx, '#7b4a26', 2.5); circle(ctx, 27, -152, 8); fillOut(ctx, '#7b4a26', 2.5);
    } else if (kind === 'acacia') {
      limb(ctx, [[0, 0], [0, -70], [-30, -110]], 10, '#7a5230', 4);
      limb(ctx, [[0, -70], [32, -112]], 8, '#7a5230', 4);
      ellipse(ctx, 0, -120, 90, 22); fillOut(ctx, '#7a9a3a', 3);
      ellipse(ctx, 10, -112, 70, 10); ctx.fillStyle = '#62822c'; ctx.fill();
    } else if (kind === 'crystal') {
      const c = ['#7ee0f0', '#b48cf0', '#7ef0b0'][Math.floor(Math.abs(x) / 7) % 3];
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(i * 16 - 8, 0); ctx.lineTo(i * 16, -50 - (1 - Math.abs(i)) * 30); ctx.lineTo(i * 16 + 8, 0); ctx.closePath(); fillOut(ctx, c, 2.5);
      }
      
    }
    ctx.restore();
  }

  function drawScene(ctx, W, H, themeId, cam, t, opt = {}) {
    const T = THEMES[themeId] || THEMES.forest;
    const ground = H * 0.8;
    const simple = !!opt.simple;
    const g = ctx.createLinearGradient(0, 0, 0, ground);
    g.addColorStop(0, T.sky[0]); g.addColorStop(1, T.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (T.dark) {
      // cave ceiling with stalactites
      ctx.fillStyle = '#1d1613';
      ctx.beginPath(); ctx.moveTo(0, 0);
      const off = (cam * 0.5) % 90;
      for (let x = -off - 90; x < W + 90; x += 45) {
        const i = Math.floor((x + cam * 0.5) / 45);
        ctx.lineTo(x, H * 0.08); ctx.lineTo(x + 22, H * (0.14 + hash(i) * 0.14)); ctx.lineTo(x + 45, H * 0.08);
      }
      ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
    } else {
      // sun and clouds
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; circle(ctx, W * 0.82, H * 0.2, H * 0.11); ctx.fill();
      ctx.fillStyle = themeId === 'summit' ? '#ffe08a' : '#ffe27a'; circle(ctx, W * 0.82, H * 0.2, H * 0.07); ctx.fill();
      for (let i = 0; i < (simple ? 2 : 4); i++) {
        const cx = ((i * 380 - cam * 0.05 - t * 6) % (W + 300) + W + 300) % (W + 300) - 150, cy = H * (0.1 + hash(i) * 0.15);
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ellipse(ctx, cx, cy, 55, 20); ctx.fill(); circle(ctx, cx - 12, cy - 14, 22); ctx.fill(); circle(ctx, cx + 16, cy - 8, 18); ctx.fill();
      }
    }
    // far mountains
    const mOff = cam * 0.08, mSp = 420;
    for (let i = Math.floor(mOff / mSp) - 1; i * mSp - mOff < W + mSp; i++) {
      const x = i * mSp - mOff + hash(i) * 80, h = H * (0.32 + hash(i + 50) * 0.18);
      ctx.fillStyle = T.mount;
      ctx.beginPath(); ctx.moveTo(x - 260, ground - H * 0.15); ctx.lineTo(x, ground - H * 0.15 - h); ctx.lineTo(x + 260, ground - H * 0.15); ctx.fill();
      ctx.fillStyle = shade(T.mount, -0.07);
      ctx.beginPath(); ctx.moveTo(x, ground - H * 0.15 - h); ctx.lineTo(x + 260, ground - H * 0.15); ctx.lineTo(x + 40, ground - H * 0.15); ctx.fill();
      ctx.fillStyle = T.cap;
      ctx.beginPath(); ctx.moveTo(x - 50, ground - H * 0.15 - h * 0.8); ctx.lineTo(x, ground - H * 0.15 - h); ctx.lineTo(x + 50, ground - H * 0.15 - h * 0.8); ctx.lineTo(x + 18, ground - H * 0.15 - h * 0.74); ctx.lineTo(x - 10, ground - H * 0.15 - h * 0.82); ctx.fill();
    }
    // rolling hills
    [[0.18, T.hill, 0.24, 0.006], [0.32, T.hill2, 0.16, 0.009]].forEach(([f, col, hh, fr]) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, ground);
      for (let x = 0; x <= W + 20; x += 20) {
        const wx = x + cam * f;
        ctx.lineTo(x, ground - H * hh * (0.55 + 0.25 * Math.sin(wx * fr) + 0.2 * Math.sin(wx * fr * 2.3 + 1)));
      }
      ctx.lineTo(W, ground); ctx.closePath(); ctx.fill();
    });
    // distant tree line
    if (!simple || true) {
      const lOff = cam * 0.45, sp = simple ? 70 : 38;
      ctx.fillStyle = T.line;
      for (let i = Math.floor(lOff / sp) - 1; i * sp - lOff < W + sp; i++) {
        const x = i * sp - lOff, h = H * (0.07 + hash(i + 3) * 0.06);
        if (T.tree === 'palm') { ctx.beginPath(); ctx.arc(x, ground - H * 0.08, h * 0.6, Math.PI, 0); ctx.fill(); }
        else if (T.tree === 'acacia') { ellipse(ctx, x, ground - H * 0.09 - h * 0.4, h * 0.8, h * 0.18); if (hash(i) > 0.6) ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(x - 14, ground - H * 0.06); ctx.lineTo(x, ground - H * 0.06 - h); ctx.lineTo(x + 14, ground - H * 0.06); ctx.fill(); }
      }
    }
    // ground band
    ctx.fillStyle = T.ground; ctx.fillRect(0, ground - H * 0.08, W, H * 0.3);
    // big scenery trees (behind path)
    const tOff = cam * 0.75, tSp = simple ? 620 : 300;
    for (let i = Math.floor(tOff / tSp) - 1; i * tSp - tOff < W + tSp; i++) {
      if (hash(i + 77) < 0.25) continue;
      const x = i * tSp - tOff + hash(i) * 120;
      tree(ctx, T.tree, x, ground - H * 0.06, H / 560 * (0.75 + hash(i + 5) * 0.35), T);
    }
    // path
    ctx.fillStyle = T.pathEdge;
    ctx.beginPath(); ctx.moveTo(0, ground - H * 0.035);
    for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, ground - H * 0.035 + Math.sin((x + cam) * 0.004) * H * 0.01);
    ctx.lineTo(W, ground + H * 0.09); ctx.lineTo(0, ground + H * 0.09); ctx.closePath(); ctx.fill();
    ctx.fillStyle = T.path;
    ctx.beginPath(); ctx.moveTo(0, ground - H * 0.025);
    for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, ground - H * 0.025 + Math.sin((x + cam) * 0.004) * H * 0.01);
    ctx.lineTo(W, ground + H * 0.08); ctx.lineTo(0, ground + H * 0.08); ctx.closePath(); ctx.fill();
    // water streams to jump over
    if (opt.water) {
      opt.water.forEach(wx => {
        const x = wx - cam;
        if (x < -150 || x > W + 150) return;
        ctx.fillStyle = T.dark ? '#2f6f8f' : '#4fb3e8';
        ellipse(ctx, x + 50, ground + H * 0.03, 62, H * 0.05); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
        for (let k = 0; k < 3; k++) { const yy = ground + H * 0.015 + k * 6; ctx.beginPath(); ctx.moveTo(x + 18 + ((t * 30 + k * 17) % 40), yy); ctx.lineTo(x + 34 + ((t * 30 + k * 17) % 40), yy); ctx.stroke(); }
      });
    }
    // foreground grass
    ctx.fillStyle = T.ground; ctx.fillRect(0, ground + H * 0.08, W, H);
    if (!simple) {
      ctx.fillStyle = T.grass;
      const gOff = cam * 1.1, gs = 90;
      for (let i = Math.floor(gOff / gs) - 1; i * gs - gOff < W + gs; i++) {
        const x = i * gs - gOff + hash(i) * 40, y = ground + H * 0.13 + hash(i + 1) * H * 0.06;
        ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x - 6, y - 16); ctx.lineTo(x - 2, y); ctx.lineTo(x + 2, y - 20); ctx.lineTo(x + 6, y); ctx.lineTo(x + 10, y - 14); ctx.lineTo(x + 13, y); ctx.fill();
      }
    }
    return ground;
  }

  // vertical scene for vine climbing levels
  function drawVineScene(ctx, W, H, themeId, t, climb, opt = {}) {
    const T = THEMES[themeId] || THEMES.forest;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, T.sky[0]); g.addColorStop(1, T.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const vx = W * 0.5;
    // river at the bottom
    const ry = H * 0.86;
    ctx.fillStyle = '#3c9ad6'; ctx.fillRect(0, ry, W, H - ry);
    ctx.fillStyle = '#5cb8ec'; ctx.fillRect(0, ry, W, 6);
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) { const x = ((i * 137 + t * 90) % (W + 60)) - 30, y = ry + 12 + (i % 3) * 12; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 26, y); ctx.stroke(); }
    // cliffs on both sides
    const cliff = (x0, dir) => {
      ctx.fillStyle = T.dark ? '#4a3a31' : '#9b8467';
      ctx.beginPath(); ctx.moveTo(x0, 0);
      for (let y = 0; y <= ry; y += 30) ctx.lineTo(x0 + dir * (W * 0.16 + Math.sin(y * 0.03 + x0) * 14), y);
      ctx.lineTo(x0, ry); ctx.closePath(); fillOut(ctx, T.dark ? '#4a3a31' : '#9b8467', 3);
    };
    cliff(0, 1); cliff(W, -1);
    // top ledge (goal)
    ctx.fillStyle = T.ground; rrect(ctx, W * 0.3, H * 0.06, W * 0.4, 18, 8); fillOut(ctx, T.ground, 3);
    ctx.fillStyle = '#e74c3c'; ctx.fillRect(W * 0.62, H * 0.06 - 40, 18, 12);
    ctx.fillStyle = OUT; ctx.fillRect(W * 0.62 - 2, H * 0.06 - 42, 3, 42);
    // the vine
    const sway = Math.sin(t * 1.4) * 6;
    ctx.strokeStyle = OUT; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(vx, H * 0.06); ctx.quadraticCurveTo(vx + sway * 2, H * 0.45, vx + sway, ry - 30); ctx.stroke();
    ctx.strokeStyle = '#3f9a3a'; ctx.lineWidth = 5; ctx.stroke();
    if (!opt.simple) for (let i = 1; i < 9; i++) {
      const yy = H * 0.06 + i * (ry - H * 0.06) / 10, xx = vx + sway * (yy / H) * 1.3;
      ellipse(ctx, xx + (i % 2 ? 9 : -9), yy, 8, 4, i % 2 ? 0.5 : -0.5); fillOut(ctx, '#4fb34a', 2);
    }
    return { vx, top: H * 0.06, bottom: ry, sway };
  }

  return {
    SKINS, HAIR_COLORS, OUTFIT_COLORS, BOTTOM_COLORS, SHOE_COLORS, OPTIONS, THEMES, defaultLook,
    runPose, idlePose, FALL_POSE, holdPose, hangPose, cheerPose, mixPose,
    drawPerson, drawBeast, drawAvalanche, drawRock, drawFaller, drawDizzyStars, drawScene, drawVineScene,
    star, circle, ellipse, fillOut, shade, hash
  };
})();
