# D' Keys to Escaping

A touch-typing adventure for ages 15 to 50. Your own cartoon runner is in danger, and the only
way out is to type fast and accurately. Type quickly and you sprint away. Type slowly and the danger
closes in. Hit a wrong key and you trip or lose your grip.

It's plain HTML, CSS and JavaScript, with no build tools and no server. Everything is saved on the
device with `localStorage`.

![Reference art](reference/boy-running.png)

## How to play

1. Open `index.html` in a browser, or open the GitHub Pages link.
2. Click **+ New player**. Choose **Male** or **Female**, then pick a skin tone, hairstyle, clothes
   and colors. The options depend on the gender you chose.
3. Pick your settings (you can change them later with **⚙ Settings** on the map):
   - **Mode**: *Practice* has no danger. *Challenge* has the danger.
   - **Win style**: *Speed goal* means you finish with at least 90% accuracy **and** the level's
     minimum WPM. *Survival* means you reach the finish line alive.
   - **Device**: *Auto*, *Laptop* (physical keyboard) or *Phone* (touch keyboard).
   - **Finger guide**, **Sound**, **Music**, and **Blood** (off by default).
4. On the level map, tap the glowing level. Your runner walks there and the level briefing opens.
5. Type the letters shown in the tiles at the top. Each wrong key is counted, and you have to type
   the right key before you can move on.
   - **Streak**: 8 correct keys in a row makes you **SPRINT**.
   - **Chase** levels: a wolf, boar, cheetah, rolling rock or avalanche runs after you.
   - **Falling** levels: coconuts, pine cones, rocks or icicles drop on you. Each one has a ring
     with a number. Type that many correct keys before it lands to dash out of the way.
   - **Hold-on** levels: hold up a boulder or climb a vine. Your strength drains all the time and
     every correct key gives some back.
   - Streams on the path: your runner jumps over them while you keep typing.
6. Press **?** during a level to see the Key Guide card for the key you need next. Press **❚❚** or
   **Esc** to pause.
7. The results screen shows WPM, accuracy, best streak, 1 to 3 stars and the coins you earned. It
   also shows a "Did you know?" typing fact. If you fail, you still see your speed and accuracy.

### Stars
- ★: you won the level.
- ★★: 95%+ accuracy and at least the minimum WPM.
- ★★★: 98%+ accuracy and 125% of the minimum WPM. In Challenge mode you also need at least half
  your strength left.

## Lessons and worlds (Stage 1)

| World | Keys | Hazards |
|---|---|---|
| Whispering Forest | F J, D K | wolf chase, vine climb |
| Coconut Jungle | S L, A ; | falling coconuts, vine, boar chase |
| Golden Savanna | G H, E I | cheetah chase, boulder |
| Rumbling Cliffs | R U, T Y | boulder, vine, rolling-rock chase |
| Echo Caves | W O, Q P | falling rocks, boulder |
| Avalanche Peaks | C M, V N, X ,, Z ., B | avalanche chase, icicles |
| Escape Summit | mixed review | a mix of all level types |

Each lesson has 4 levels: single letters, then letter combos, then real words, then short
sentences. There are 64 levels in total, and the text is regenerated every time you play.

## Publishing on GitHub Pages

1. Push this folder to a GitHub repository. `index.html` must be at the root.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Pick **main** and **/(root)**,
   then click **Save**.
4. Wait about a minute. The game will be live at `https://<your-user>.github.io/<repo-name>/`.

There's no build step. The empty `.nojekyll` file tells Pages to serve the files as they are.

## Files

- `index.html` – all the screens
- `css/style.css` – game UI styling and the responsive layout
- `js/data.js` – lessons, worlds, word lists, sentences, 100+ typing facts and the keyboard map
- `js/store.js` – saving profiles to localStorage, plus Web Audio sound effects and music
- `js/art.js` – all canvas drawing: runners, creatures, hazards and the layered scenes
- `js/game.js` – the level list, the text generator and the in-level game engine
- `js/ui.js` – menus, profile creator, settings, level map, key guide, results and input
- `GAME_DESIGN.md` – the full design brief, including the Stage 2 plan
- `reference/` – the art-style reference images

## Choices made during Stage 1

These are decisions made to finish quickly without stopping to ask:

- **Art is drawn in code** with Canvas 2D, in the flat cartoon style of the reference images
  (dark outlines, simple shading, layered sky, mountains, hills, tree line and path). There are no
  image files to load. Knees bend with the shin going backward and elbows fold forward, so limbs
  move the right way.
- **Clothing**: male runners get a long-sleeve shirt, T-shirt, hoodie or zip jacket, with regular
  or cargo pants. Female runners get a long-sleeve blouse, loose tunic or cardigan, with a long or
  pleated long skirt over dark leggings. Male and female items are never mixed.
- **Hairstyles**: male runners get a short crop, side part, short curls or buzz cut. Female runners
  get a ponytail, long hair, a bun or a braid.
- **The bottom row is split into five lessons** (C M, V N, X comma, Z period, B), all in Avalanche
  Peaks, so each lesson still gets letters, combos, words and sentences.
- **Wrong keys never skip ahead.** You have to type the right key, and every wrong key counts
  against your accuracy. In Chase levels the danger gets closer. In Falling levels an extra object
  drops. In Hold-on levels you lose grip strength.
- **Being caught** in a chase costs 25 strength and pushes the danger back a little. You only
  lose when your strength reaches 0.
- **Minimum speed** starts at 7 WPM and rises about 1 WPM per lesson, plus up to 3 more for
  harder content in the same lesson. Mixed review asks for 18 to 24 WPM.
- **The danger matches the minimum speed.** If you type exactly at the level's minimum WPM, you
  slowly pull away. If you type slower, it catches up.
- **Practice mode** still unlocks levels and earns half the coins.
- **Phone mode** removes `;`, `,` and `.`, so you only type letters and spaces. It hides the
  on-screen keyboard and uses fewer trees and details. A hidden input opens the phone keyboard
  (tap the scene if it closes), and the layout fits the visible area above the keyboard using
  `visualViewport`. Auto mode picks Phone for touch-only devices. Tablets with a physical keyboard
  should choose **Laptop** in Settings.
- **Blood** (off by default) only adds a few small red drops when you get hit. With it off you see
  white puffs and dizzy stars instead.
- **Words were filtered to be family friendly.** Each profile also keeps per-key error counts in
  `stats.keyErrors`, ready for Stage 2's "smart practice of weak keys".
- **Fonts**: the Fredoka font loads from Google Fonts. If you're offline, a system font is used
  instead.

## Stage 2 (planned, not built)

See `GAME_DESIGN.md`. It covers capital letters and Shift, numbers and symbols, Spanish, verse
mode, a wardrobe shop, boss levels, revives, smart practice, a stats page, a parent view,
certificates and more polish.
