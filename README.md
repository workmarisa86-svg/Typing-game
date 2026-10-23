# D' Keys to Escaping

A touch-typing adventure for ages 15 to 50. Your own cartoon runner is in danger, and the only
way out is to type fast and accurately. Type quickly and you sprint away. Type slowly and the danger
closes in. Hit a wrong key and you trip or lose your grip.

It's plain HTML, CSS and JavaScript, with no build tools and no server. Everything is saved on the
device with `localStorage`. You can install it as an app, and it works offline after the first visit.

![Reference art](reference/boy-running.png)

## How to play

1. Open the game's GitHub Pages link, or open `index.html` directly. Offline mode and installing
   need the web link, not a local file.
2. Pick **EN** or **ES** at the top right, then click **+ New player**. Choose **Male** or
   **Female**, then pick a skin tone, hairstyle, clothes and colors.
3. Pick your settings (you can change them later with **⚙** on the map):
   - **Menu language** and **Typing language**: English or Spanish, chosen separately.
   - **Verse mode**: sentence and boss levels use exact Bible verses. English uses the KJV and
     Spanish uses the Reina-Valera 1909.
   - **Mode**: *Practice* has no danger. *Challenge* has the danger.
   - **Win style**: *Speed goal* means you finish with at least 90% accuracy **and** the level's
     minimum WPM. *Survival* means you reach the finish line alive.
   - **Device**: *Auto*, *Laptop* or *Phone*. **Finger guide**, **Sound**, **Music**, and
     **Blood** (off by default).
4. On the level map, tap the glowing level. Your runner walks there and the briefing opens.
5. Type the characters in the tiles at the top. A wrong key counts as a mistake, and you have to
   type the right key before you can move on.
   - **Streak**: 8 correct keys in a row makes you **SPRINT**.
   - **Chase**: a wolf, boar, cheetah, bear, bull, panther, rolling rock, lava or avalanche runs
     after you.
   - **Falling**: things drop on you. Each one has a ring with a number. Type that many correct
     keys before it lands.
   - **Hold-on**: hold up a boulder or climb a vine. Your strength keeps draining and every
     correct key gives some back.
   - **👑 Boss**: the last level of every world is a longer, harder chase that uses every key you
     have learned so far.
   - **💖 Revive**: once per level in Challenge mode, if your strength runs out you can pay 30
     coins to get back up.
6. Press **?** during a level to see the Key Guide card for the next key. Press **❚❚** or **Esc**
   to pause.
7. The results screen shows WPM, accuracy, best streak, stars and coins, plus a "Did you know?"
   fact in your menu language. When you beat a world's boss you get a **printable certificate**.

### Stars
- ★: you won the level.
- ★★: 95%+ accuracy and at least the minimum WPM.
- ★★★: 98%+ accuracy and 125% of the minimum WPM. In Challenge mode you also need at least half
  your strength left.

## Worlds

| World | Keys | Hazards | Who sees it |
|---|---|---|---|
| Whispering Forest | F J, D K | wolf chase, vine climb | everyone |
| Coconut Jungle | S L, A ; | falling coconuts, vine, boar chase | everyone |
| Golden Savanna | G H, E I | cheetah chase, boulder | everyone |
| Rumbling Cliffs | R U, T Y | boulder, vine, rolling-rock chase | everyone |
| Echo Caves | W O, Q P | falling rocks, boulder | everyone |
| Avalanche Peaks | C M, V N, X ,, Z ., B | avalanche chase, icicles | everyone |
| Escape Summit | mixed review | every level type | everyone |
| Capital Castle | capitals with the correct Shift hand | bear chase, falling rocks, boulder | everyone |
| Sunny Plaza | US-International setup, ñ, á é í ó ú, ü ¿ ¡ | bull chase, falling oranges, vine | Spanish typing language only |
| Number Volcano | 1–5, 6–0, review | lava chase, lava rocks | Laptop mode only |
| Symbol Storm | every symbol on a US keyboard | panther chase, hail | Laptop mode only |

Each lesson goes from single letters to letter combos, real words, then short sentences. Each
world ends with a boss. The text is regenerated every time you play.

## Other screens

- **👕 Shop** (wardrobe): spend coins on new tops, pants or skirts, and extra colors. Hats and
  accessories unlock as you win levels. Every item is modest, and male and female items are
  separate lists.
- **📊 Stats**: best speed, recent accuracy, levels completed, accuracy and speed over time
  (charts plus a table), most-missed keys, and your certificates.
- **🎯 Smart practice**: a round built from the keys you miss most often.
- **👪 Parent view** (start screen): every player's progress side by side.
- **⌨ Key Guide**: a card for every key, covering letters, capitals and Shift, numbers, all
  symbols, and the Spanish letters with the US-International keyboard steps.

## Spanish on a US keyboard (Windows)

The Sunny Plaza world starts with a lesson on adding the **United States-International**
keyboard: Settings → Time & language → Language & region → *your language* → Language options →
Add a keyboard → United States-International. Press Windows + Space to switch keyboards. Then:

- `~` then `n` = **ñ**
- `'` then a vowel = **á é í ó ú**
- `"` then `u` = **ü**
- Right Alt + `/` = **¿**
- Right Alt + `1` = **¡**

On phones, press and hold a letter to pick ñ or an accented letter.

## Install as an app

On Chrome or Edge (laptop, Android or tablet), click the **⬇ Install app** button on the start
screen or the install icon in the address bar. On iPhone or iPad, use Share → **Add to Home
Screen**. After the first visit the game works offline.

### Safety for other games on the same GitHub Pages site
- `manifest.webmanifest` uses `"start_url": "./"` and `"scope": "./"`. Both are relative, so they
  point to this repository's folder (for example `/Typing-game/`) and never to the site root.
- The service worker is registered as `./sw.js` with `{ scope: './' }`, and it ignores every
  request outside its own folder (apart from the Google Fonts the game uses).
- Every cache it creates starts with `dkeys-`. On update it only deletes caches that start with
  `dkeys-`.
- `sw.js` has a `VERSION`, and the version is also shown on the start screen. **When you change
  the game, bump `VERSION` in `sw.js`** (and `APP_VERSION` in `js/ui.js`). The worker fetches
  from the network first and uses the cache when offline, so a normal refresh shows the update.

## Publishing on GitHub Pages

1. Push this folder to a GitHub repository. `index.html` must be at the root.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Pick **main** and **/(root)**,
   then click **Save**.
4. Wait about a minute. The game will be live at `https://<your-user>.github.io/<repo-name>/`.

There's no build step. The empty `.nojekyll` file tells Pages to serve the files as they are.

## Verse sources

The verses are never typed by hand. `data/sources/` holds the original public-domain files from the
[scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) project, which
is built from CrossWire modules:

- `KJV.csv`: King James Version (1769)
- `SpaRV1909.csv`: Reina-Valera (1909), listed there as "SpaRV"

`tools/build_verses.py` copies verses byte-for-byte into `data/verses-en.js` (7,630 verses) and
`data/verses-es.js` (7,938 verses). It only *chooses* verses: it uses Psalms, Proverbs,
Ecclesiastes, Isaiah, Matthew, John, Romans, 1 Corinthians, Galatians, Ephesians, Philippians,
Colossians, James and 1 John, keeps verses 25–230 characters long, and skips chapter-opening
verses and any verse with characters a keyboard can't type. A check confirmed every generated verse
matches its source text exactly. See `data/sources/SOURCE.md`. To rebuild, run
`python3 tools/build_verses.py`.

## Files

- `index.html`: all the screens
- `css/style.css`: game UI styling, the responsive layout and the print layout for certificates
- `js/i18n.js`: menu text in English and Spanish
- `js/data.js`: Stage 1 lessons, worlds, English words and sentences, facts, and the keyboard map
  (including Shift, AltGr and dead keys)
- `js/data2.js`: Stage 2 lessons and worlds, Spanish words and sentences, number and symbol
  practice, shop items, and Spanish facts
- `js/store.js`: profiles in localStorage (moves Stage 1 saves to the new format), plus sound
  effects and music
- `js/art.js`: all canvas drawing: runners, clothes, hats, accessories, creatures, hazards and
  scenes
- `js/game.js`: level lists, the text and verse generator, and the game engine (bosses, revive,
  Shift checks)
- `js/ui.js`: menus, map, shop, stats, parent view, certificates, key guide, input and install
- `manifest.webmanifest`, `sw.js`, `icons/`: the installable, offline app
- `data/`: verse files and their public-domain sources
- `tools/build_verses.py`: builds the verse files
- `GAME_DESIGN.md`: the Stage 1 and Stage 2 briefs

## Choices made during Stage 1

- **Art is drawn in code** with Canvas 2D in the style of the reference images. Knees and elbows
  bend the right way.
- **Clothing**: male runners get shirts, T-shirts, hoodies or jackets with pants. Female runners
  get blouses, tunics or cardigans with long skirts over dark leggings. Male and female items are
  never mixed.
- **The bottom row is split into five lessons**: C M, V N, X comma, Z period, and B.
- **Wrong keys never skip ahead.** In Chase levels a mistake lets the danger get closer. In
  Falling levels an extra object drops. In Hold-on levels you lose grip strength.
- **Being caught** costs 25 strength. You only lose when your strength reaches 0.
- **Minimum speed** starts at 7 WPM and rises about 1 WPM per lesson. The danger moves at that
  speed.
- **Practice mode** still unlocks levels and earns half the coins.
- **Phone mode** uses letters and space only, hides the on-screen keyboard, and shows simpler
  scenes. A hidden input opens the phone keyboard.

## Choices made during Stage 2

- **Level ids**: progress is saved by level id (such as `forest-3`) instead of by number. Stage 1
  saves move over automatically and nothing is lost.
- **Unlocking**: a level unlocks when the level before it is won. The world list depends on the
  typing language (Sunny Plaza is Spanish-only) and the device (numbers and symbols are
  laptop-only), so switching either one never locks levels you already won.
- **Shift hand**: in Laptop mode the game reads which Shift key is held. Using the Shift on the
  same hand as the letter counts as a mistake, and a hint says which Shift to use. If Caps Lock is
  on, the key is ignored and a reminder is shown, so it doesn't count as a mistake.
- **Characters you haven't learned are typed for you.** When a verse or sentence has a character
  you haven't learned yet (or can't type on a phone, like digits or ¿), the game fills it in and
  shows it in grey italics. This keeps verses word-for-word exact while you only type keys you
  know. The closing `?` and `!` in the Spanish ¿¡ lessons are also typed for you until Symbol
  Storm.
- **Verse mode** replaces the "short sentences" levels and bosses once you know 12 or more
  letters. Bosses use 2 or 3 consecutive verses, and the reference is shown under the text and on
  the results screen. Number and symbol worlds keep their own practice text so you still type
  digits and symbols.
- **Verse spelling**: in the CrossWire KJV the small-capitals "LORD" is written as "Lord". The
  Reina-Valera 1909 keeps its original spellings (*fué*, *á*). Both are exactly as in the source.
- **Dead keys**: in Laptop mode the game waits after a US-International dead key and highlights
  the second key. It accepts the combined character (á, ñ, …) that the keyboard sends.
- **Boss levels** need 120–340 characters (about 170 when not using verses), the danger is 20%
  faster, they pay 40 bonus coins, and winning one for the first time gives the world certificate.
- **Revive** costs 30 coins and is only offered in Challenge mode. You get 70 strength back and the
  danger is pushed back.
- **Shop prices**: tops 100–220 coins, pants or skirts 80–120, extra colors 40 each. Colors you
  buy work for every part of the outfit. Hats and accessories unlock after you win 3, 5, 8, 12, 15,
  20, 25, 30 or 40 levels. Female hats include a headscarf. Every item is modest, and male and
  female item lists are separate.
- **Smart practice** ranks keys by how often you miss them (at least 2 misses) and builds a chase
  round from the top six keys you have already learned. It pays half coins and doesn't change
  level progress.
- **Stats** has one chart for accuracy and one for WPM, each with its own scale, plus a table of
  your last 10 plays.
- **Parent view** has no PIN. It only reads data stored on this device.
- **Spanish facts** are translations of the same facts, plus four facts about typing Spanish
  letters.
- **Polish**: screens fade in, the map walk eases in and out, the screen shakes a little on a
  mistake, the escape bar moves smoothly, and there are new sounds for revive, coins, buying,
  dodging and certificates. The music loop is longer and has a light hi-hat.
- **Testing**: everything was tested with automated play in headless Chromium at 1280×800,
  1100×700 and phone sizes (390 px wide). This covered Stage 1 levels, capitals, Spanish accents
  and dead-key highlights, numbers, symbols, bosses, verse mode in both languages, revive, the
  shop, stats, parent view, certificate printing, moving an old Stage 1 save, the service worker
  scope and caches, and reloading offline. It has not been tested on a real phone, tablet or
  Windows keyboard yet.
