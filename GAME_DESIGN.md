# D' Keys to Escaping — Game Design

This file holds the original project brief so future sessions follow the same plan.
Stage 1 is built. Stage 2 is listed at the bottom and is **not built yet**.

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

## STAGE 2 (do NOT build yet)

- Capital letters and Shift
- Numbers and symbols worlds (laptop only)
- Spanish lessons and worlds
- Verse mode
- Wardrobe shop with unlockable hats and accessories
- Boss levels
- One revive per level for coins
- Smart practice of weak keys (per-key error counts are already saved in each profile's `stats.keyErrors`)
- Stats page
- Parent view
- World certificates
- Extra polish
