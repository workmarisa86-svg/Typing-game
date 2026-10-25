# D' Keys to Escaping — Game Design

This file holds the original project briefs so future sessions follow the same plan.
**Stage 1, Stage 2 and the Piano Challenge mode are built.** Their briefs are copied in full below.

---

## Original brief (verbatim)

PROJECT: "D' Keys to Escaping" — a typing game that teaches touch typing in a fun, challenging way. Players ages 15 to 50. Built with plain HTML, CSS, and JavaScript (no build tools, no frameworks) so it runs directly in the browser and on GitHub Pages. Save everything on the device with localStorage (no accounts, no server).

STEP 1 — Write a file called GAME_DESIGN.md containing this entire prompt plus the Stage 2 list at the bottom, so future sessions follow the same plan. Then build Stage 1.

### CORE IDEA
The player's own cartoon character (sprite) is in danger and can only escape by typing quickly and accurately. Typing fast = the character runs faster, has more strength, and pulls away from the danger. Typing slowly = the danger closes in. Wrong key = the character trips or loses grip, loses strength, and more danger falls or gets closer. Inspired by the "save the king" levels of Royal Match, but with typing.

### ART STYLE
Look at the images in the reference/ folder and match that style: polished flat cartoon, dark outlines, simple shading, soft shadows, layered backgrounds (sky, mountains, hills, tree line, path), game-style UI panels. Characters must look clearly male or clearly female. Arms and legs must bend in physically correct directions. Animate running, tripping, and getting back up. Cartoon, family friendly.

### MODEST CLOTHING RULE
All clothing is modest: nothing tight, no cleavage, regular pants, long skirts, basic game clothes. No mixing male and female items.

### PLAYER PROFILES
- Multiple profiles on the same device, each with its own sprite, settings, progress, coins, and stats.
- When creating a profile: choose male or female first, then skin tone, outfit colors, clothes, and a classic hairstyle (not too modern, not too fancy). Options shown depend on the gender chosen.

### SETTINGS (shown when a profile is chosen, editable later)
- Mode: Practice (no danger) or Challenge
- Win style: "Speed goal" (must reach 90% accuracy AND the level's minimum speed) or "Survival" (must reach the finish line alive). If the player dies, show their accuracy and speed anyway.
- Device mode: Laptop/keyboard or Phone/touch (auto-detect, allow manual switch; tablets with a physical keyboard use Laptop mode)
- Finger guide on/off, sound on/off, music on/off
- Blood on/off (default OFF)

### LESSON ORDER (Stage 1 = English letters only)
F and J → D and K → S and L → A and ; → G and H → E and I → R and U → T and Y → W and O → Q and P → bottom row (C and M, V and N, X and comma, Z and period, B) → mixed review.
Content grows with the player: single letters → letter combos → real words → short sentences.

### WORLDS AND LEVEL MAP
- A level map the sprite walks along; locked levels light up as they unlock.
- Each world teaches a group of keys and has its own hazard. Mix three level types:
  - Chase: an animal or danger runs after you (forest wolf, savanna cheetah, snow avalanche)
  - Falling: things drop on you (jungle coconuts, cave rocks)
  - Hold-on: holding up a boulder or hanging from a vine while strength drains
- Movement inspired by Banana Kong: running, jumping over water, climbing trees, going into caves — all controlled by typing, not dodging.
- Health/strength bar that runs out. Streak boost: a run of correct keys makes the sprite sprint. Wrong key: trip for a second or lose grip strength.
- Earn coins and 1 to 3 stars per level.

### KEYBOARD AND KEY GUIDE (Laptop mode)
- On-screen US keyboard that highlights the next key and colors each key by the finger that should press it, with a highlighted hand.
- A Key Guide section: one card per key showing where it is and which finger presses it. Also a "?" button during levels that opens the guide for the current key.

### PHONE MODE
- Letters and space only, no numbers or symbols.
- Use a hidden input so the phone's keyboard opens; the game must fit in the space above the keyboard.
- Simpler scenes (fewer trees and details), same levels and challenge.

### TYPING FACTS
Show a "Did you know?" typing fact between levels. Include at least 100 accurate facts about typing, keyboards, and typewriters only (for example: "TYPEWRITER can be typed using only the top row of letters"). Facts must be true.

### ALSO IN STAGE 1
- Start screen with the game title, profile select, and settings
- Results screen after each level: speed (WPM), accuracy, stars, coins earned
- Works well on laptop, tablet, and phone
- README explaining how to play and how to publish on GitHub Pages
Commit everything to the main branch when done.

---

## STAGE 2 — built (original list from the Stage 1 brief)

- Capital letters and Shift
- Numbers and symbols worlds (laptop only)
- Spanish lessons and worlds
- Verse mode
- Wardrobe shop with unlockable hats and accessories
- Boss levels
- One revive per level for coins
- Smart practice of weak keys
- Stats page
- Parent view
- World certificates
- Extra polish

## Stage 2 brief (verbatim)

Read GAME_DESIGN.md first and keep everything from Stage 1 working. Now build Stage 2 of "D' Keys to Escaping":

1. CAPITALS AND SHIFT: a world teaching capital letters with the correct Shift hand.

2. NUMBERS AND SYMBOLS (Laptop mode only, never on phones): later, harder worlds for the number row and these symbols: @ ! # $ % ^ & * ( ) : ; ' " ? / > . < , and the rest of the US keyboard. Add each to the Key Guide.

3. SPANISH: each profile can choose English or Spanish for the menus and, separately, English or Spanish for the typing practice.
   - The keyboards are US layout on Windows. Start the Spanish world with a lesson on adding the "United States-International" keyboard in Windows settings, then teach: ~ then n = ñ, ' then a vowel = á é í ó ú, and how to type ü ¿ ¡. Add these to the Key Guide.
   - Spanish words and sentences use ñ and accents correctly.
   - Typing facts are shown in the profile's language.

4. VERSE MODE: an optional mode where the sentence and paragraph levels use Bible verses — King James Version (KJV) for English and Reina-Valera 1909 for Spanish. Both are public domain. Load verse text from a reliable public-domain source file and include it in the repo; do NOT type verses from memory. Every verse must be word-for-word exact, with its reference shown.

5. WARDROBE SHOP: spend coins on clothes and colors. Hats and accessories unlock by reaching higher levels. Modest clothing rule and male/female separation still apply.

6. BOSS LEVELS: a longer, harder chase at the end of each world using every key learned so far.

7. ONE REVIVE per level: spend coins to get back up once when health runs out.

8. SMART PRACTICE: track the keys each player misses most and offer a practice round built from them.

9. STATS PAGE per profile: best speed, accuracy over time, most-missed keys, levels completed.

10. PARENT VIEW: one screen showing every profile's progress and stats side by side.

11. WORLD CERTIFICATES: when a world is finished, show a printable certificate with the player's name, world, speed, and accuracy.

12. POLISH: smoother animations, sound effects, background music (on/off in settings), and test everything on laptop and phone screen sizes.

13. INSTALLABLE APP: make D' Keys to Escaping installable on laptop, tablet, and phone, so the browser shows an Install button.
   - Add a web app manifest with the name "D' Keys to Escaping", a short name "D' Keys", app icons in the game's flat cartoon style (192px and 512px), and a theme color.
   - Add a service worker so the game works offline after the first visit.
   - VERY IMPORTANT — my other games are hosted on the same GitHub Pages site (workmarisa86-svg.github.io/Chess-project/, /Negotiation_Xpert/, /Mighty-Men-o-War-/). An earlier service worker took over another game's address, so:
     - The manifest "scope" and "start_url" must be ONLY this repository's folder (for example /typing-game/), never the site root "/".
     - Register the service worker with a relative path and scope limited to this folder only.
     - Use cache names that start with "dkeys-" and only ever delete caches that start with "dkeys-", so it can never touch another game's cache.
     - Add a version number so updates show up after a refresh.

Update the README and commit everything to the main branch when done.

## Feedback after Stage 2 (built)

- Chases: the runner stays in place but runs faster, and the background rolls by faster as you type faster. The chaser gains steadily and speeds up about 30% by the finish line. Mistakes let it catch up more.
- Hold-on levels: instead of holding a boulder (which looked unrealistic), the runner holds up the roof of a house or hut whose posts have broken. If you let go, the roof falls (cartoon collapse with a dust cloud and dizzy stars, family friendly). This replaces every boulder level in all worlds.

## Piano Challenge brief (verbatim)

NEW MODE: PIANO CHALLENGE
Inspired by the phone game Piano Tiles, but played with the keyboard. Add it as its own button on the main menu.

HOW IT PLAYS
- The player picks a piano piece. Tiles fall down in columns. Each column belongs to one letter key, and each tile shows its letter.
- Pressing the correct key when a tile reaches the hit line plays the next note(s) of the piece, so the music plays perfectly as long as the player keeps hitting the right keys. If the player stops, the music pauses.
- Wrong key or a missed tile: the tile flashes red with a short wrong-note sound.
  - Challenge mode: 3 misses ends the song; show results.
  - Practice mode (from the profile's settings): no game over, the tile waits until the correct key is pressed.
- Speed slowly increases during a song, like Piano Tiles.
- Chords: when the piece has several notes at once, one key press plays the whole chord.
- Score, combo counter, accuracy, and 1 to 3 stars per song. Earn coins that work in the wardrobe shop. Stats are saved per profile.

KEYS AND DIFFICULTY (this mode also trains typing)
- Beginner: 2 columns, F and J
- Easy: 4 columns, D F J K
- Medium: 6 columns, S D F J K L
- Hard and Expert: 8 columns, A S D F J K L ;
- Phone mode: up to 4 columns, letters only, typed with the phone keyboard; the play area must fit above the keyboard.
- The tile pattern must follow the melody's shape: higher notes go to columns further right, lower notes further left.

SONGS (unlock in order; finishing a song unlocks the next)
Use ONLY these pieces. All are public domain. Do not add any other songs or composers.

Beginner (traditional songs and hymns):
Hot Cross Buns; Mary Had a Little Lamb; Twinkle Twinkle Little Star; Jesus Loves Me (William Bradbury); Amazing Grace; Row, Row, Row Your Boat; London Bridge; Frère Jacques; Old MacDonald; Baa Baa Black Sheep; This Old Man; Yankee Doodle; Oh! Susanna; When the Saints Go Marching In; Jingle Bells; Silent Night; Holy, Holy, Holy

Easy:
See the Conquering Hero Comes (Handel); Largo "Ombra mai fù" (Handel); Hallelujah Chorus melody (Handel); Sheep May Safely Graze melody (Bach); Sleepers, Wake! chorale melody (Bach)

Medium:
Jesu, Joy of Man's Desiring (Bach); Air on the G String (Bach); Sarabande in D minor HWV 437 (Handel); Alla Hornpipe from Water Music (Handel); Mozart Piano Sonata in C major K. 545, 2nd movement (Andante); Mozart K. 545, 1st movement, opening theme only

Hard:
Prelude in C Major BWV 846 (Bach); Little Prelude in C minor BWV 999 (Bach); Bourrée in E minor BWV 996 (Bach); Badinerie BWV 1067 (Bach); Arrival of the Queen of Sheba (Handel); The Harmonious Blacksmith (Handel); Mozart K. 545, 3rd movement (Rondo)

Expert:
Inventions No. 1, 4, 8, 13, and 14 (Bach); Prelude in C minor BWV 847 from the Well-Tempered Clavier (Bach); Italian Concerto BWV 971, 1st movement (Bach); Toccata and Fugue in D minor BWV 565 (traditionally credited to Bach); Passacaglia in G minor HWV 432 (Handel); Mozart K. 545, 1st movement, full version with all the scales

Mozart rule: the ONLY Mozart piece is the Piano Sonata in C major, K. 545 (the one whose 1st movement starts C-E-G-B-C-D-C). Do not include any other Mozart work.
Each song shows its title, composer, and difficulty. Easier versions may be simplified, but must still sound like the real piece.

ACCURATE NOTES — VERY IMPORTANT
- Do NOT write melodies from memory. Get the notes from public-domain MIDI or MusicXML files, such as the Mutopia Project (mutopiaproject.org), convert them to a simple song format in the repo, and note each file's source and license in a CREDITS file.
- If a needed file can't be downloaded, write that song's notes very carefully, test that it sounds correct, and mark it in the README as "needs checking."

REAL PIANO SOUND
- Use a real recorded piano sound, not beeps. Use a free-license piano sample set (for example the Salamander Grand Piano samples) played with the Web Audio API or Tone.js, and credit it in CREDITS.
- Load only the notes needed, keep the download small, and make the sounds available offline through the existing "dkeys-" service worker cache.
- Volume control in settings.

SCREEN DESIGN
- Same polished flat cartoon style as the rest of the game, but on a clean piano theme: dark background, white and glowing tiles, a keyboard row at the bottom showing which letter is each column.
- Song selection screen grouped by difficulty with locked and unlocked songs, stars earned, and best score.
- Works in English and Spanish menus, and on laptop, tablet, and phone.

Update the README, bump the service worker version so players get the update, and commit everything to the main branch when done.

## Piano Challenge feedback (built in v3.1.0)

- Show the sheet music as an option below the song choice (the song's own notes on a treble and bass staff).
- Add more classical pieces by Handel and Bach (sources and licenses in CREDITS.md).
- Add a tap mode: tiles fall and you tap them with your fingers (or the mouse), no keyboard letters.
- Bug: pressing the first key to start a piece started it but took away a life. Fixed.

## Menu and Piano Xpert feedback (built in v3.2.0)

- After choosing a player (gender, look, clothes), the main menu offers two games: Escape Master (the typing adventure) and Piano Xpert. A back arrow switches between them.
- Piano Xpert offers Play mode (tap the tiles) and Learn mode (type the letter keys). Progress is separate per mode.
- Play mode is like Music Tiles 2:
  - songs are listed top to bottom in levels of three, unlocked with stars
  - the first tile waits at the bottom and starts the music
  - tiles fall at a steady speed, and tapping fast never speeds them up
  - a song repeats 15% faster each time it is completed and ends after one mistake
  - regular tiles are all one big size; long notes are hold tiles that fill up and give extra points
  - two tiles in a row never share a lane
  - each completed round gets a clapping break (applause and confetti), then the next round waits for START
  - the background is our own creative design (not copied)
- Tiles never overlap. Background music pauses while a piece plays. The composer appears under the title in the song list, not while playing. The song lists are more colorful.
- All 15 Bach two-part Inventions are included (same public-domain source rules).

## Ideas for a future Stage 3 (not requested yet)

- More Spanish-only worlds and Spanish verse paragraphs for every world
- A per-key heat map on the stats page
- Optional parent PIN for the parent view
