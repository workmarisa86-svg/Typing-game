/* D' Keys to Escaping — static game data: lessons, worlds, words, facts, keyboard */
'use strict';

// ---------- Keyboard layout & fingers ----------
// finger ids: lp lr lm li (left pinky..index), ri rm rr rp (right index..pinky), th (thumb)
const FINGER_NAMES = {
  lp: 'Left pinky', lr: 'Left ring finger', lm: 'Left middle finger', li: 'Left index finger',
  ri: 'Right index finger', rm: 'Right middle finger', rr: 'Right ring finger', rp: 'Right pinky',
  th: 'Either thumb'
};
const FINGER_COLORS = {
  lp: '#ff8a80', lr: '#ffb74d', lm: '#fff176', li: '#81c784',
  ri: '#4dd0e1', rm: '#fff176', rr: '#ffb74d', rp: '#ff8a80', th: '#cfd8dc'
};
const KEY_ROWS = [
  [['`','lp'],['1','lp'],['2','lr'],['3','lm'],['4','li'],['5','li'],['6','ri'],['7','ri'],['8','rm'],['9','rr'],['0','rp'],['-','rp'],['=','rp']],
  [['q','lp'],['w','lr'],['e','lm'],['r','li'],['t','li'],['y','ri'],['u','ri'],['i','rm'],['o','rr'],['p','rp'],['[','rp'],[']','rp']],
  [['a','lp'],['s','lr'],['d','lm'],['f','li'],['g','li'],['h','ri'],['j','ri'],['k','rm'],['l','rr'],[';','rp'],["'",'rp']],
  [['z','lp'],['x','lr'],['c','lm'],['v','li'],['b','li'],['n','ri'],['m','ri'],[',','rm'],['.','rr'],['/','rp']],
  [[' ','th']]
];
const ROW_NAMES = ['number row', 'top row', 'home row', 'bottom row', 'space bar'];
const KEY_INFO = {};
KEY_ROWS.forEach((row, r) => row.forEach(([k, f], c) => { KEY_INFO[k] = { finger: f, row: r, col: c }; }));
const HOME_KEYS = { lp: 'a', lr: 's', lm: 'd', li: 'f', ri: 'j', rm: 'k', rr: 'l', rp: ';', th: 'space' };
function keyLabel(k) { return k === ' ' ? 'space' : k.toUpperCase(); }

// ---------- Lessons (Stage 1: lowercase English letters) ----------
const LESSONS = [
  { keys: ['f', 'j'], name: 'F and J' },
  { keys: ['d', 'k'], name: 'D and K' },
  { keys: ['s', 'l'], name: 'S and L' },
  { keys: ['a', ';'], name: 'A and ;' },
  { keys: ['g', 'h'], name: 'G and H' },
  { keys: ['e', 'i'], name: 'E and I' },
  { keys: ['r', 'u'], name: 'R and U' },
  { keys: ['t', 'y'], name: 'T and Y' },
  { keys: ['w', 'o'], name: 'W and O' },
  { keys: ['q', 'p'], name: 'Q and P' },
  { keys: ['c', 'm'], name: 'C and M' },
  { keys: ['v', 'n'], name: 'V and N' },
  { keys: ['x', ','], name: 'X and comma' },
  { keys: ['z', '.'], name: 'Z and period' },
  { keys: ['b'], name: 'B' },
  { keys: [], name: 'Mixed review', review: true }
];

// stage: 0 letters, 1 combos, 2 words, 3 sentences
const STAGE_NAMES = ['Single letters', 'Letter combos', 'Real words', 'Short sentences'];

// ---------- Worlds ----------
// mix = level types cycled through the world's levels
const WORLDS = [
  { id: 'forest', name: 'Whispering Forest', lessons: [0, 1], mix: ['chase', 'chase', 'vine', 'chase'],
    chaser: 'wolf', faller: 'pinecone', theme: 'forest', blurb: 'A grey wolf is on your trail!' },
  { id: 'jungle', name: 'Coconut Jungle', lessons: [2, 3], mix: ['falling', 'vine', 'falling', 'chase'],
    chaser: 'boar', faller: 'coconut', theme: 'jungle', blurb: 'Coconuts are raining down!' },
  { id: 'savanna', name: 'Golden Savanna', lessons: [4, 5], mix: ['chase', 'chase', 'boulder', 'chase'],
    chaser: 'cheetah', faller: 'rock', theme: 'savanna', blurb: 'The fastest cat alive wants a race.' },
  { id: 'cliffs', name: 'Rumbling Cliffs', lessons: [6, 7], mix: ['boulder', 'vine', 'chase', 'boulder'],
    chaser: 'rollingrock', faller: 'rock', theme: 'cliffs', blurb: 'Hold on tight — the cliffs are crumbling.' },
  { id: 'cave', name: 'Echo Caves', lessons: [8, 9], mix: ['falling', 'falling', 'boulder', 'falling'],
    chaser: 'rollingrock', faller: 'rock', theme: 'cave', blurb: 'Rocks drop from the cave roof!' },
  { id: 'snow', name: 'Avalanche Peaks', lessons: [10, 11, 12, 13, 14], mix: ['chase', 'chase', 'falling', 'chase'],
    chaser: 'avalanche', faller: 'icicle', theme: 'snow', blurb: 'An avalanche is roaring down the mountain!' },
  { id: 'summit', name: 'Escape Summit', lessons: [15], mix: ['chase', 'falling', 'vine', 'boulder'],
    chaser: 'wolf', faller: 'rock', theme: 'summit', blurb: 'Everything you learned — all at once.' }
];

// ---------- Words & sentences (lowercase, Stage 1) ----------
const WORDS = (
  'a add ads all fall falls lad lads sad salad salads flask flasks ask asks dad dads alfalfa as ' +
  'had has hall half hash dash lash flash glad shall ' +
  'he she the see seed feed feel field fill hill hike like lake sake jake idea die did kid kids aid aide said ' +
  'side hide ride slide glide life file filled shield fish dish wish gift lift sea leaf deal heal ideal ' +
  'red rid rug run us use user sure rush rude fur fire free tree her here hear dear rear ear area are rare ' +
  'true tree trees try tray tiger tight right light sight fight eight height they the that this these those ' +
  'yes yet yard year your you young day days stay stray tiny type typed typist test text task trust trail ' +
  'we were wet west wide wild will well wall work world word words wood wool low slow show snow ' +
  'old hold told gold fold road roads road load go so to too do who how how out our for of off ' +
  'top pop pot post port quit quiet quest quick queen equal paper pupil pool keep deep step help ' +
  'cat cap cup come came camp calm cool cold clock city music magic mice cream climb ' +
  'van vast very view voice even never seven oven move mean man men moon noon nine need near ' +
  'box fox six mix next taxi wax axe fix ' +
  'zoo zip zero lazy maze size prize zone ' +
  'big bag bat bed bus but boy bear bird blue bike brave bring jump jumps escape keys key fast faster ' +
  'run runs runner river rock rocks cave caves wolf wolves cliff snow storm forest jungle sun rain ' +
  'friend family happy hope home house water little small great good game games play player ' +
  'finger fingers hand hands home row letter letters keyboard type typing speed'
).split(/\s+/).filter((w, i, a) => w && a.indexOf(w) === i);

const SENTENCES = [
  'a lad asks dad.', 'a sad lad falls.', 'dad has a salad.', 'all lads ask dad.',
  'she has a red sled.', 'he fed the seal.', 'the lake is deep.', 'she said he hid.',
  'the fire is red.', 'her deer ran far.', 'use the true rule.', 'he hurried there.',
  'they try their key.', 'the tiger is tired.', 'yesterday it rained.', 'your tray is here.',
  'we walk to the old tower.', 'the wolf is slow today.', 'a wet road goes west.',
  'pick up the quiet paper.', 'a quick pup sits on top.', 'keep the sweet pie for later.',
  'the cat came to camp.', 'my cold cream is calm.', 'climb the cliff with care.',
  'seven men move vans.', 'never leave a view unseen.', 'the moon is near noon.',
  'six foxes fix a box, then relax.', 'the wax is next to the axe.',
  'the lazy zebra zips past.', 'a prize is in the maze.',
  'a brave boy jumps the brook.', 'big blue birds fly by.',
  'the quick brown fox jumps over the lazy dog.', 'type fast and stay calm.',
  'keep your fingers on the home row.', 'look at the screen, not the keys.',
  'every key you learn helps you escape.', 'a strong runner never quits.',
  'the river is wide, so jump.', 'run to the cave, then climb.',
  'the wolf howls, but you keep typing.', 'jump over the water and run.',
  'climb the vine to the top.', 'hold the rock and type with care.'
];

// ---------- "Did you know?" typing facts ----------
const FACTS = [
  'The word TYPEWRITER can be typed using only the top row of letters on a QWERTY keyboard.',
  'PROPRIETOR, PERPETUITY and REPERTOIRE can also be typed using only the top row of letters.',
  'ALFALFA and FLASKS can be typed using only the home row keys.',
  'STEWARDESSES is one of the longest common English words you can type with only your left hand on QWERTY.',
  'LOLLIPOP can be typed using only your right hand on a QWERTY keyboard.',
  'The QWERTY layout gets its name from the first six letters of the top letter row: Q, W, E, R, T, Y.',
  'QWERTY was developed by Christopher Latham Sholes in the 1870s for his typewriter.',
  'Sholes worked on his typewriter with Carlos Glidden and Samuel Soule.',
  'The Sholes and Glidden typewriter, first sold in 1874, is known as the first commercially successful typewriter.',
  'The Sholes and Glidden typewriter could only type capital letters.',
  'The Sholes and Glidden typewriter was manufactured by E. Remington and Sons, a company also known for making guns and sewing machines.',
  'The Remington No. 2 typewriter of 1878 added a shift key so one machine could type both capital and small letters.',
  'The shift key got its name because on typewriters it physically shifted the type mechanism to print a different character.',
  'Mark Twain was an early typewriter owner and is often credited as one of the first authors to give a publisher a typed manuscript.',
  'Most keyboards have small raised bumps on the F and J keys so you can find the home row without looking.',
  'The home row on a QWERTY keyboard is A S D F G H J K L and the semicolon.',
  'In touch typing, each finger is responsible for its own group of keys.',
  'Your index fingers have the most letter keys to cover: six letters each on a QWERTY keyboard.',
  'The left index finger covers R, T, F, G, V and B in standard touch typing.',
  'The right index finger covers Y, U, H, J, N and M in standard touch typing.',
  'Your left pinky handles Q, A and Z in standard touch typing.',
  'In touch typing, your thumbs press the space bar.',
  'Touch typing means typing without looking at the keys, using muscle memory.',
  'Looking for each key one at a time is often called "hunt and peck" typing.',
  'Frank Edward McGurrin is credited with popularizing touch typing after winning a famous typing contest in Cincinnati in 1888.',
  'Typing speed is usually measured in words per minute, or WPM.',
  'For typing tests, one "word" is counted as five characters, including spaces.',
  'Net WPM subtracts mistakes from your raw typing speed, so accuracy really matters.',
  'A 2018 study by Aalto University of about 168,000 volunteers found an average typing speed of about 52 words per minute.',
  'Barbara Blackburn was listed in the Guinness Book of World Records as the fastest English-language typist, and she used a Dvorak keyboard.',
  'The Dvorak Simplified Keyboard was patented by August Dvorak and William Dealey in 1936.',
  'On the Dvorak layout, all five vowels A, O, E, U and I sit on the left side of the home row.',
  'The Colemak keyboard layout was released in 2006 by Shai Coleman.',
  'Colemak keeps common shortcuts like Z, X, C and V in the same place as QWERTY.',
  'The AZERTY keyboard layout is used in France and Belgium.',
  'The QWERTZ layout, which swaps Y and Z, is used in Germany, Austria and Switzerland.',
  'A pangram is a sentence that uses every letter of the alphabet at least once.',
  '"The quick brown fox jumps over the lazy dog" is a famous pangram used to test typewriters and keyboards.',
  'E is the most common letter in English text.',
  'On QWERTY, the very common letters E and T are on the top row, not the home row.',
  'In everyday English typing, the space bar is usually the most pressed key.',
  'The space bar is the largest key on a standard keyboard.',
  'On a QWERTY keyboard, English typing uses the left hand a little more than the right hand.',
  'A popular story says QWERTY was arranged to reduce jams of typewriter bars; historians still debate the exact reasons for the layout.',
  'The Enter key is still called Return on many keyboards, from the typewriter "carriage return".',
  'A typewriter carriage held the paper and moved left as you typed; you pushed it back to start a new line.',
  'Many typewriters rang a small bell to warn the typist that the end of the line was near.',
  'Many early typewriters had no key for the number 1; typists used a lowercase L instead.',
  'Some early typewriters also had no zero key, so typists used a capital O.',
  'On many old typewriters, you typed an exclamation mark by typing an apostrophe, pressing backspace, then typing a period.',
  'On a typewriter, the backspace key only moved the carriage back one space; it did not erase anything.',
  'The Tab key comes from the typewriter "tabulator", which helped typists line up columns in tables.',
  'Typewriters had a "shift lock" key, the ancestor of today\'s Caps Lock key.',
  'Bob Bemer, a computer scientist, is credited with creating the Escape character in 1960.',
  'Ctrl+Alt+Delete was created by IBM engineer David Bradley.',
  'Larry Tesler is credited with popularizing the idea of cut, copy and paste in computer editing.',
  'Ctrl+Z (or Command+Z on a Mac) is the common keyboard shortcut for undo.',
  'The Fn key on many laptops unlocks extra functions printed on other keys.',
  'Scroll Lock was originally meant to make the arrow keys scroll the screen instead of moving the cursor.',
  'The Insert key toggles between inserting text and typing over text in many programs.',
  'A standard full-size US keyboard has 104 keys.',
  'A "tenkeyless" keyboard is a keyboard without the number pad on the right.',
  'The 5 key on a number pad usually has a small bump, just like F and J.',
  'Phone keypads put 1, 2, 3 on the top row, but calculator keypads put 7, 8, 9 on top.',
  'On old phone keypads, the 7 key held P, Q, R and S, and the 9 key held W, X, Y and Z.',
  'T9 predictive text let old mobile phones guess words so you could press each number key just once per letter.',
  'BlackBerry phones were famous for their small physical QWERTY keyboards.',
  'Touchscreen phones kept the QWERTY layout from typewriters and computer keyboards.',
  'Swipe or gesture typing lets you type a word by sliding one finger across its letters.',
  'The Windows key was added to keyboards in the 1990s; the 1994 Microsoft Natural Keyboard was among the first to have it.',
  'The Microsoft Natural Keyboard of 1994 was a split ergonomic keyboard.',
  'Split ergonomic keyboards are designed to let your wrists stay straighter while you type.',
  'Mechanical keyboards have a separate switch under every key.',
  'Cherry MX key switches were made popular by the German company Cherry, starting in the 1980s.',
  'A typical Cherry MX mechanical switch can be pressed down about 4 millimeters.',
  'The IBM Model M keyboard from the 1980s used "buckling spring" switches that make a loud click.',
  'Many cheaper keyboards use rubber domes under a membrane instead of mechanical switches.',
  'Many laptop keyboards use scissor-shaped mechanisms under the keys to keep them thin.',
  'N-key rollover means a keyboard can register every key, even if many are pressed at the same time.',
  'Some simple keyboards can only detect a few keys pressed at once; extra presses get lost.',
  'The letters printed on keycaps are called legends.',
  'Double-shot keycaps are molded from two pieces of plastic, so their letters never rub off.',
  'The first US typewriter patent was granted to William Austin Burt in 1829 for his "Typographer".',
  'In 1714, Henry Mill received an English patent for a machine to write letters one after another, like a typewriter.',
  'The Malling-Hansen Writing Ball was a typewriter shaped like a ball with keys sticking out of it.',
  'The philosopher Friedrich Nietzsche bought a Malling-Hansen Writing Ball in 1882.',
  'Index typewriters had no keyboard; you pointed at a letter on a chart and then pressed a lever.',
  'The IBM Selectric typewriter of 1961 used a golf-ball-shaped type element instead of type bars.',
  'Selectric users could swap the "golf ball" to change fonts in seconds.',
  'IBM\'s Correcting Selectric of 1973 could lift typing mistakes off the page with special tape.',
  'Correction fluid was invented by Bette Nesmith Graham, a typist, in the 1950s.',
  'Daisy wheel typewriters printed using a spinning wheel with a letter on the end of each spoke.',
  'Typewriter ribbons were often half black and half red, so typists could switch colors.',
  'Pica typewriter type fits 10 characters per inch; elite type fits 12 characters per inch.',
  'On a typewriter with monospaced type, every letter takes up the same width, even i and m.',
  'The Courier typeface was designed by Howard Kettler for IBM typewriters in the 1950s.',
  'Chinese typewriters used a large tray holding thousands of metal characters.',
  'Teleprinters, or teletypes, were typewriter-like machines that sent typed messages over wires.',
  'The Teletype Model 33, used with early computers, could only print capital letters.',
  'Court reporters use stenotype machines, pressing several keys at once to type whole syllables or words.',
  'Skilled stenotype writers can record speech at more than 200 words per minute.',
  'Pressing several keys at the same time to make one symbol is called a chord.',
  'The Perkins Brailler typewriter has six main keys, one for each dot of a Braille cell.',
  'ASCII, a standard way for computers to store letters as numbers, was first published in 1963.',
  'UNCOPYRIGHTABLE is often cited as one of the longest English words with no repeated letters.',
  'On US keyboards, the @ sign is typed with Shift and the 2 key.',
  'Accuracy first: fixing a typing mistake usually costs more time than typing a little slower.',
  'Speed grows with practice; most touch typists get faster after they stop looking at the keys.',
  'Typing teachers recommend keeping your wrists lifted instead of resting them while you type.'
];
