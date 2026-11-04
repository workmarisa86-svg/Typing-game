\version "2.24.0"
\language "italiano"
midiTempo = #(define-music-function (t) (number?) #{ \tempo 4 = $t #})
alternatives = #(define-music-function (a b) (ly:music? ly:music?) #{ $a $b #})
fineMark = {}
dacapoMark = {}
allowPageTurn = {}
\score {
  \new StaffGroup <<
    \new Staff <<
      
      { \key do \major
\time 12/8
\tempo "Larghetto, e mezzo piano" \midiTempo #108
s1.*10 s2. s4 \fineMark s8 s4. s1.*10 \bar "|."
\dacapoMark } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" do''4( re''8 ) mi''4 ( fa''8 ) sol''4. la'' |
sol''8. fa''16 mi''8 fa''4.-\trill mi''-\trill fa''16 ( sol'' la''4 )|
sol''8.-\trill fa''16 mi''8 fa''4.-\trill mi'' ~ mi''4 re''8 |
mi''8. fa''16 sol''8 fa''8. sol''16 mi''8 re''4. sol''4 re''8 |
mi''4-\trill re''8 mi''8. re''16 do''8 re''4. mi''16 ( fa'' sol''4 )|
mi'' re''32 ( mi'' fa''16 ) mi''4.-\trill re''4 sol'8 sol''4. ~|
sol'' fa'' fa''8.-\trill mi''16 re''8 mi''4 do''8 |
re''4 do''8 re''4 mi''8 fa''4 do''8 fa''4. ~|
fa'' mi''8. re''16 mi''8 re''4 sol'8 sol''4. ~|
sol''8. fa''16 mi''8 fa''8.-\trill mi''16 re''8 do''4. fa''16 ( sol'' la''4 )|
sol''8.-\trill fa''16 mi''8 mi''4 ( re''8 ) do''2.\fermata |
sol'4 la'8 si'4 do''8 re''4. mi'' |
fa''8. sol''16 fa''8 mi''8. re''16 mi''8 re''4. mi'' |
fa''8. sol''16 fa''8 mi''8. re''16 mi''8 re''4. re'' ~|
re''8. mi''16 re''8 re''4 re''8 sold''4. si'' |
re''8. mi''16 re''8 do''4 si'8 do''4. do'' ~|
do''8. re''16 do''8 do''4 do''8 fad''4. la'' |
do''8. re''16 do''8 si'4 la'8 si'4. mi'' |
re''8. do''16 si'8 do''8. si'16 la'8 si'4. mi'' |
re''8. do''16 si'8 do''8. si'16 la'8 sol''8. fad''16 mi''8 re''4 do''8 |
si'4. la' sol'2. |
 } >>
    \new Staff <<
      
      { \key do \major
\time 12/8
\tempo "Larghetto, e mezzo piano" \midiTempo #108
s1.*10 s2. s4 \fineMark s8 s4. s1.*10 \bar "|."
\dacapoMark } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" do''4. ~ do''4 re''8 mi''4. fa'' |
mi''8. re''16 do''8 re''4.-\trill do''-\trill re''16 ( mi'' fa''4 )|
mi''8.-\trill re''16 do''8 re''4.-\trill do'' ~ do''4 si'8 |
do''8. re''16 mi''8 re''8. mi''16 do''8 si'4 ( la'8 ) si'8. la'16 si'8 |
do''4 -\trill si'8 do''8. si'16 la'8 si'4 la'8 sol'4. |
do''4 si'32 ( do'' re''16 ) do''4. -\trill si' r4 sol'8 |
la'4 -\trill sol'8 la'4 si'8 do''4 sol'8 do''4. ~|
do'' sib' ~ sib'4 la'8 re''4. ~|
re'' do'' ~ do''4 si'8 mi''4. ~|
mi''8. re''16 do''8 re''8. ~ do''16 si'8 do''4. re''16 ( mi'' fa''4 )|
mi''8. ~ re''16 do''8 do''4 si'8 do''2. \fermata |
sol'4. ~ sol'4 la'8 si'4. do'' |
re''8. mi''16 re''8 do''8. si'16 do''8 si'4. do'' |
re''8. mi''16 re''8 do''8. si'16 do''8 si'4. si' ~|
si'8. do''16 si'8 si'4 si'8 re''2. |
sold'4 si'8 la'4 sold'8 la'4. la' ~|
la'8. si'16 la'8 la'4 la'8 do''4. do'' |
fad'4 la'8 sol'4 fad'8 sol'4. do'' |
si'8. la'16 sol'8 la'8. sol'16 fad'8 sol'4. do'' |
si'8. la'16 sol'8 la'8. sol'16 fad'8 si'4 do''8 si'4 la'8 |
sol'4. fad' sol' si' |
 } >>
    \new Staff << 
      
      { \key do \major
\time 12/8
\tempo "Larghetto, e mezzo piano" \midiTempo #108
s1.*10 s2. s4 \fineMark s8 s4. s1.*10 \bar "|."
\dacapoMark } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" do1. ~|
do ~|
do2. ~ do4. ~ do4 sol8 |
do2. sol, ~|
sol,1. ~|
sol,2. ~ sol,4. r4 mi8 |
fa4. re do r4 la8 |
sib4. sol fa r4 re8 |
mi4 re8 mi4 fa8 sol2. |
sol, do ~|
do4 fa8 sol4 sol,8 do4 \fermata re8 mi4 fad8 |
sol1. ~|
sol ~|
sol |
fa2. mi ~|
mi la4 sol8 fad4 mi8 |
re1. ~|
re2. sol ~|
sol1. ~|
sol2. sol,4 la,8 si,4 do8 |
re4. re, sol4 fa8 mi4 re8 |
 } >>
  >>
  
  \midi { } }
