\version "2.24.0"
\language "italiano"
midiTempo = #(define-music-function (t) (number?) #{ \tempo 4 = $t #})
alternatives = #(define-music-function (a b) (ly:music? ly:music?) #{ $a $b #})
fineMark = {}
dacapoMark = {}
allowPageTurn = {}
\score {
  \new StaffGroup <<
    \new StaffGroup <<
      \new Staff << 
                    { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" r4 dod'' la' |
mi''4. re''8 dod''4 |
fad'' fad'' sold'' |
la''2 mi''4 |
re''4. fad''8 mi'' re'' |
dod''4. mi''8 re'' dod'' |
si'4 mi''2 ~|
mi''4 re''2 ~|
re''4. mi''8 dod''4 ~|
dod''8 si' si'4. la'8 |
la'2 r4 |
R2.*2 |
r4 mi'' la'' |
sold''4. fad''8 mi''4 |
re''' re''' si'' |
dod'''2 r4 |
R2.*15 |
r4 si'' sold'' |
fad''4. fad''8 si''4 |
la'' la'' la'' |
sold''4. mi''8 fad''4 |
sold'' fad''2 |
sold''4. si''8 la'' sold'' |
fad''4. la''8 sold'' fad'' |
mi''4 la''2 ~|
la''4. si''8 sold''4 ~ |
sold''8 fad'' fad''2 |
mi'' r4 |
R2.*2 |
r4 si' mi'' dod'' r2 |
R2.*2 |
r4 la'' re''' |
dod'''8 si'' la''4 r |
R2. |
r4 la'' re''' |
dod'''8 si'' la''4 re''' |
dod'''8 si'' la''4 dod''' |
re'''4. dod'''8 re''' mi''' |
dod''' mi'' la' si' dod'' re'' |
mi''2 mi''4 |
mi''2. |
mi'' |
mi''2 mi''4 |
fad''2 fad''4 |
mi''2 r4 |
R2.*5 |
r4 red'' sold'' |
fad''8 mi'' red''4 sold'' |
fad''8 mi'' red''4 si'' |
si''2 lad''4 |
si'' red'' si' |
fad''4. mi''8 red''4 |
sold'' sold'' lad'' |
si'' fad'' si'' |
lad''4. sold''8 fad''4 |
si'' mi'' fad'' |
red'' fad'' si'' |
lad''8 sold'' fad''4 si'' |
dod'''8 si'' lad''4 si'' |
dod'''8 si'' lad''4 si'' |
dod''' fad'' fad'' |
fad''2. |
fad''2 fad''4 |
fad''2 mi''4 |
red''4. dod''8 si'4 |
R2.*5 |
r4 si' si' |
si'2. ~|
si' ~|
si'4 si'' si'' |
si''2. ~|
si''2 si''4 ~|
si'' la''2 ~|
la'' sold''4 |
fad'' fad''4. fad''8 |
sold''4 mi'' la'' |
sold''8 fad'' mi''4 r |
r mi' dod' |
si r2 |
r4 mi'' mi'' |
mi'' dod'' la' |
mi''4. re''8 dod''4 |
fad'' fad'' sold'' |
la''2. |
r2 mi''4 |
re''4. fad''8 mi'' re'' |
dod''4. mi''8 re'' dod'' |
si'4 si' r |
R2.*3 |
r4 mi'' la'' |
sold''8 fad'' mi''4 r |
r2 la''4 |
sold''8 fad'' mi''4 la'' |
sold''8 fad'' mi''4 si'' |
la''2. |
sold''4 mi'' mi'' |
mi''2. |
mi''2 mi''4 |
mi''4. re''8 dod''4 |
re'' si'4. la'8 |
la'4 la'' la'' |
la''2. ~|
la'' ~|
la'' ~|
la'' |
la''4 mi'' r |
r2 mi''4 |
fad''2. ~|
fad''2 fad''4 |
mi''2. |
 } >>
      \new Staff << 
                    { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" r4 mi' dod'' |
si' sold' dod'' |
la' re'' si' |
mi'' dod''2 ~|
dod''4 si'2 ~|
si'4 la' la' |
sold'4. si'8 la' sold' |
fad'4. la'8 sold' fad' |
mi'4 sold' la' |
la'2 sold'4 |
la'2 r4 |
R2.*2 |
r4 la' dod'' |
si'4. si'8 la''4 |
la'' la'' mi'' |
mi''2 r4 |
R2.*15 |
r4 si' mi'' |
red''4. red''8 mi''4 |
mi'' mi'' fad'' |
si'4. dod''8 red''4 |
mi''2 red''4 |
mi'' si' mi'' ~|
mi'' red''2 |
dod''4. mi''8 red'' dod'' |
si'4 red'' mi'' |
mi''2 red''4 |
mi''2 r4 |
R2.*2 |
r4 mi' sold' |
mi' r2 |
R2.*2 |
r4 re'' fad'' |
mi''8 re'' dod''4 r |
R2. |
r4 dod'' fad'' |
mi''8 re'' dod''4 fad'' |
mi''8 re'' dod''4 la'' |
la'' sold''2 |
la''4 dod''8 si' la' si' |
sold' mi' fad' sold' la' si' |
sold'4 sold'' dod''' |
si''8 la'' sold''4 dod''' |
si''8 la'' sold''4 dod''' |
re'''2 re'''4 |
dod'''2 r4 |
R2.*5 |
r4 si' mi'' |
red''8 dod'' si'4 mi'' |
red''8 dod'' si'4 red'' |
mi''2. |
red''4 si' fad' |
red''4. dod''8 si'4 |
si' si' mi'' |
red'' si' red'' |
dod''4. dod''8 red''4 |
mi'' si' dod'' |
fad' si' red'' |
dod''8 si' lad'4 fad'' |
fad''4. mi''8 red''4 |
fad''4. mi''8 red''4 |
fad'' fad'' fad'' |
fad''2. |
fad''2 fad''4 |
fad''2 mi''4 |
red'' si' fad' |
mi'4. sold'8 fad' mi' |
red' dod' si4 r |
R2. |
r4 si mi' red'8 dod' si4 red' |
mi' fad'4. fad'8 |
si4 si r |
r si' si' |
si'2 la'4 |
sold'2 sold'4 |
fad'2 r4 |
r mi'' fad'' |
si'2 mi''4 ~|
mi''8 fad'' red''4. red''8 |
mi''4 mi' dod' |
si si' mi'' |
dod''8 si' la'4 r |
r2 sold'4 |
la' si'4. si'8 |
la'4 dod'' la' |
mi''4. re''8 dod''4 |
fad'' fad'' sold'' |
la'' mi' la' |
sold'4. fad'8 mi'4 |
la' la' mi' |
mi'2 la'4 |
sold'4. si'8 la' sold' |
fad'4. la'8 sold' fad' |
mi'4 mi' la' |
sold' sold' r |
R2. |
r4 si' mi'' |
dod''8 si' la'4 dod'' |
si'8 la' sold'4 dod'' |
si'8 la' sold'4 mi'' |
dod''2. |
si'4 mi'' mi'' |
mi'' sold' dod'' |
si' sold' si' |
dod''4. si'8 la'4 |
la' sold'4. la'8 |
la'4 la'' la'' |
la'' dod'' fad'' |
mi'' dod'' fad'' |
mi''8 re'' dod''4 fad'' |
mi'' dod'' fad'' |
mi''8 re'' dod''4 r |
r2 dod''4 |
re''2. ~|
re''2 re''4 |
dod''2. |
 } >>
      \new Staff << 
                    { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" r4 la' mi' |
mi'2 mi'4 |
re'' re' mi' |
mi' la'2 |
la'4 mi'2 |
mi' mi'4 |
mi'2 mi'4 |
dod' re'2 |
si'4 si fad' |
fad' si mi' |
dod'2 r4 |
R2.*2 |
r4 dod' mi' |
mi'4. mi'8 la'4 |
la' la' si' |
la'2 r4 |
R2.*15 |
r4 mi' si' |
si'4. si'8 si'4 |
dod'' dod'' si' |
si'4. si'8 la'4 |
si' si'2 |
si' si'4 |
si'4. dod''8 si' la' |
sold'4 fad' fad' |
fad' fad' mi' |
dod'' fad' si' |
sold'2 r4 |
R2.*2 |
r4 si si |
la' r2 |
R2.*2 |
r4 la' la' |
la' mi' r |
R2. |
r4 la' la' |
la'2 la4 |
la'2 la'4 |
fad' re'2 |
mi'2. |
r8 sold' la' si' dod'' re'' |
si'4 si' la' |
si' si' la' |
si' si' la' |
la'2 la'4 |
la'2 r4 |
R2.*5 |
r4 fad' mi' |
fad'2 si4 |
fad'2 fad'4 |
mi'2 mi'4 |
fad'2. |
r4 si' fad' |
sold' fad' mi' |
fad' fad' fad' |
fad'4. fad'8 si'4 |
si' sold' fad' |
si' r2 |
r4 dod'' red'' |
fad'2 fad'4 |
fad'2 fad'4 |
fad' lad' fad' |
r red' si |
fad'4. mi'8 red'4 |
sold' sold' lad' |
si'2 red'4 |
dod' sold lad |
si si mi' |
red'8 dod' si4 r |
R2. |
r2 si4 |
si la4. la8 |
sold4 sold mi |
si4. la8 sold4 |
dod' red'4. red'8 |
mi'2 mi'4 |
red'4. fad'8 mi' red' |
dod'4. mi'8 red' dod' |
si4 si' si' |
dod'' si' si' |
si' r2 |
r4 si' sold' |
mi' mi' la' |
sold'8 fad' mi'4 mi' |
mi'8 re' re'4. re'8 |
dod'4 mi' la' |
R2.*2 |
r4 la dod' |
si4. si8 dod'4 |
re' re' si |
dod'2 r4 |
R2.*2 |
r2 mi'4 |
re'4. fad'8 mi' re' |
dod'4. mi'8 re' dod' |
si4 sold sold |
mi'8 re' dod'4 dod' |
mi' si mi' |
mi' si si |
mi'2. |
mi'2 r4 |
r si' la' |
mi' si mi' |
la'2 mi'4 |
fad' si mi' |
dod'2 r4 |
r mi' re' |
mi' mi' re' |
mi' mi' re' |
mi' mi' re' |
mi' la' r |
r2 la'4 |
la'2. ~|
la'2 la'4 |
la'2. |
 } >>
    >>
    \new ChoirStaff <<
      \new Staff  <<
        { s2.*13 s4 s2^"c. Oboe I & II unis." }
        
        { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vcanto" R2.*13 |
r4 mi'' dod'' |
si'4. si'8 mi''4 |
re'' re'' mi'' |
dod''2 r4 |
R2.*2 |
r2 si'4 |
la'4. dod''8 [ si' la' ]|
sold'4.\melisma si'8 [ la' sold' ]|
fad'4\melismaEnd fad' r |
R2. |
r4 sold' mi' |
si'4. la'8 sold'4 |
dod'' dod'' red'' |
mi''2. |
R2.*2 |
r2 si'4 |
la'4. dod''8 [ si' la' ]|
sold'4 si' mi'' |
red''4. red''8 mi''4 |
dod'' dod'' si' |
si'4. dod''8 red''4 |
mi'' mi'' ( red'' )|
mi''2. |
R2.*14 |
r4 la' re'' |
dod''8 ([ si' ] la'4 ) re'' |
dod''8 [ si' ] la'4 dod'' |
re''2. |
dod'' |
mi''2 mi''4 |
mi''2. |
mi''2 mi''4 |
mi''2 mi''4 |
fad''2 fad''4 |
mi''2 r4 |
R2.*5 |
r4 si' mi'' |
red''8 [( dod'' ] si'4 ) mi'' |
red''8 [ dod'' ] si'4 red'' |
mi''2. |
red'' |
R2.*2 |
r4 fad' si' |
lad'4. sold'8 fad'4 |
si' mi'' dod'' |
red''2 r4 |
r dod'' red'' |
dod''8 ([ si' ] lad'4 ) si' |
dod''8 [ si' ] lad'4 si' |
dod'' dod'' fad'' |
fad''2. |
fad''2 fad''4 |
fad''2 mi''4 |
red''4. dod''8 si'4 |
R2.*5 |
r4 si' si' |
si'2. |
si'2 si'4 |
si'2 la'4 |
sold'2 sold'4 |
fad'2 r4 |
r mi'' ( fad'' )|
si'2 \melisma mi''4 ~|
mi''8 [ fad'' ] red''4.\melismaEnd red''8 |
mi''2 r4 |
R2.*3 |
r4 mi'' mi'' |
mi'' dod'' la' |
mi''4. re''8 dod''4 |
fad''4 fad'' sold'' |
la''2. |
r2 mi''4 |
re''4. fad''8[ mi'' re''] |
dod''4.\melisma mi''8[ re'' dod''] |
si'4\melismaEnd si' r |
R2.*4 |
r4 si' mi'' |
dod''8 ([ si' ] la'4 ) dod'' |
si'8 [ la' ] sold'4 dod'' |
si'8 [ la' ] sold'4 mi'' |
dod''2. |
si'4 mi'' mi'' |
mi''2. |
mi''2 mi''4 |
mi''4. ( re''8 dod''4 )|
re'' si'4. la'8 |
la'4 la' la' |
la'2. |
la' |
la' |
la' ~|
la'2 r4 |
r2 dod''4 |
re''2. ~|
re''2 re''4 |
dod''2. |
 }
      >> 
      \new Staff  <<
        
        { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "valto" R2.*10 |
r4 dod'^"Tutti" la |
mi'4. re'8 dod'4 |
fad' fad' sold' |
la'2. |
r2 la'4 |
la' la' mi' |
mi'2 r4 |
R2.*7 |
r2 mi'4 |
red'4. fad'8 [ mi' red' ]|
dod'4 la'2 |
sold'4. si'8 [ la' sold' ]|
fad'4\melisma si'2 ~|
si'4 la'2 ~|
la'4 sold'2 ~|
sold'4 fad'2\melismaEnd |
si4 si si |
si'4. si'8 si'4 |
la' la' la' |
sold'4. mi'8 fad'4 |
sold' fad'2 |
sold'2. |
R2.*4 |
r4 mi' la' |
sold'8 ([ fad' ] mi'4 ) la' |
sold'8 [ fad' ] mi'4 la' |
sold'8 [ fad' ] mi'4 r |
R2.*6 |
r4 dod' fad' |
mi'8 ([ re' ] dod'4 ) fad' |
mi'8 [ re' ] dod'4 la' |
la' ( sold'2 )|
la'2. |
R2. |
r4 sold' la' |
mi'2 mi'4 |
si' si' la' |
la'2. |
la'4 mi' la' |
sold'8 [( fad' ] mi'4 ) r |
r fad' si' |
la'8 ([ sold' ] fad'4) fad' |
sold' sold' lad' |
si'2 fad'4 |
r red' sold' |
fad'8 ([ mi' ] red'4) sold' |
fad'8 [ mi' ] red'4 si' |
si'2 ( lad'4 )|
si'2. |
R2.*2 |
r4 fad' fad' |
fad'4. fad'8 si4 |
mi' mi' fad' |
fad' fad' si' |
lad'8 ([ sold' ] fad'4) fad' |
fad'2. |
fad'2 fad'4 |
fad' fad' r |
r red' si |
fad'4. mi'8 red'4 |
sold' sold' lad' |
si'2 fad'4 |
mi'4. sold'8 [ fad' mi' ]|
red' [ dod' ] si4 r |
R2. |
r4 si mi' |
red'8 ([ dod' ] si4 ) red' |
mi' fad'4. fad'8 |
si4 si r |
R2. |
r4 si' si' |
si'2. |
si'2 si'4 |
si'\melisma la'2~ |
la' sold'4\melismaEnd |
fad' fad'4. fad'8 |
sold'4 mi' la' |
sold'8 ([ fad' ] mi'4 ) r |
R2. |
r2 sold'4 |
la' si'4. si'8 |
mi'4 mi' r |
R2.*2 |
r4 mi' la' |
sold'4. fad'8 mi'4 |
la' la' mi' |
mi'2 la'4 |
sold'4. si'8 [ la' sold' ]|
fad'4. \melisma la'8 [ sold' fad' ]|
mi'4 \melismaEnd mi' la' |
sold' sold' r |
r mi' la' |
sold'8([ fad' ] mi'4) r |
r2 la'4 |
sold'8 [ fad' ] mi'4 la' |
sold'8 [ fad' ] mi'4 si' |
la'2. |
sold' |
r4 sold' la' |
mi' si mi' |
la'2. |
la'4 sold'4. la'8 |
la'4 la' la' |
la'2. |
la' |
la' |
la' ~|
la'2 r4 |
r2 la'4 |
la'2. ~|
la'2 la'4 |
la'2. |
 }
      >> 
      \new Staff  <<
        
        { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "G_8" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vtenore" R2.*13 |
r4 mi' mi' |
sold4. sold8 la4 |
la la si |
dod'2 mi'4^"Tutti" |
re'4. fad'8 [ mi' re' ]|
dod'4. \melisma mi'8 [ re' dod' ]|
si4 \melismaEnd si r |
R2. |
r4 sold mi |
la4. sold8 fad4 |
dod' dod' red' |
mi'2. |
R2.*2 |
r2 mi'4 |
red'4. fad'8 [ mi' red' ]|
dod'4. \melisma mi'8 [ red' dod' ]|
si4 \melismaEnd si r |
R2. |
r4 mi' sold' |
fad'4. fad'8 mi'4 |
mi' mi' fad' |
mi'4. si8 la4 |
si si2 |
si2. |
R2.*8 |
r4 la re' |
dod'8 ([ si ] la4) re' |
dod'8 [ si ] la4 re' |
dod'8 [ si ] la4 r |
la2. |
la |
la |
la2 la4 |
la2 la4 |
fad' re'2 |
mi'2. |
R2. |
r4 si dod' |
si8 ([ la ] sold4 ) dod' |
si8 [ la ] sold4 dod' |
re'2. |
dod'2 r4 |
r si mi' |
red'8 ([ dod' ] si4 ) si |
dod' dod' red' |
mi'2. |
red'2 si4 |
si2. |
si2 si4 |
si2 fad'4 |
mi'2 mi'4 |
fad'2. |
R2.*2 |
r4 si red' |
dod'4. dod'8 red'4 |
mi' si dod' |
si si red' |
dod'8 ([ si ] lad4 ) si |
dod' dod' red' |
dod' dod' red' |
dod' lad r |
R2.*5 |
r4 si mi' |
red'8 ([ dod' ] si4 ) r |
R2. |
r2 si4 |
si la4. la8 |
sold4 sold mi |
si4. la8 sold4 |
dod' red'4. red'8 |
mi'2 mi'4 |
red'4. fad'8 [ mi' red' ]|
dod'4. \melisma mi'8 [ red' dod' ]|
si2. |
dod'4 si2 \melismaEnd |
si4 r2 |
r4 si mi' |
dod'8  ([ si ] la4 ) r |
r2 mi'4 |
mi'8 [ re' ] re'4. re'8 |
dod'4 dod' r |
R2.*2 |
r4 la dod' |
si4. si8 dod'4 |
re' re' si |
dod'2 r4 |
R2.*2 |
r2 mi'4 |
re'4. fad'8 [ mi' re' ]|
dod'4. \melisma mi'8 [ re' dod' ]\melismaEnd |
si4 sold sold |
mi'8 [( re' ] dod'4) dod' |
mi' si mi' |
mi' si si |
mi'2. |
mi' |
r4 si dod' |
si sold si |
dod'4. ( re'8 mi'4 )|
fad'4 si mi' |
dod'2 r4 |
r dod' fad' |
mi' dod' fad' |
mi'8 ([ re' ] dod'4) fad' |
mi' dod' fad' |
mi'8 [ re' ] dod'4 r |
r2 mi'4 |
fad'2. ~|
fad'2 fad'4 |
mi'2. |
 }
      >> 
      \new Staff  <<
        
        { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vbasso" R2.*13 |
r4 dod la, |
mi4. re8 dod4 |
fad fad sold |
la2 r4 |
R2. |
r2 la4 |
sold4. si8 [ la sold ]|
fad4. \melisma la8 [ sold fad ] |
mi4 \melismaEnd mi r |
r2 si4 |
la4. dod'8 [ si la ]|
sold4 mi r |
R2.*7 |
r4 sold mi |
si4. la8 sold4 |
dod' dod' red' |
mi'4. sold8 fad4 |
mi si2 |
mi2. |
R2.*12 |
la2. |
la |
la |
la2 la4 |
la2 la4 |
si2 si4 |
la2. |
R2. |
r4 mi la |
sold8 ([ fad ] mi4 ) la |
sold8 [ fad ] mi4 la |
re'2. |
la2 r4 |
R2.*4 |
si2 si4 |
si2. |
si2 si4 |
si2 si4 |
dod'2 dod'4 |
si2. |
R2.*2 |
r4 red si, |
fad4. mi8 red4 |
sold sold lad |
si2 r4 |
r fad si |
lad8 ([ sold ] fad4 ) si |
lad8 [ sold ] fad4 si |
lad fad r |
R2.*6 |
r4 si, mi |
red8 ([ dod ] si,4 ) r |
r2 si,4 |
dod red4. red8 |
mi4 mi r |
R2.*2 |
r4 sold mi |
si,4. la,8 sold,4 |
dod dod red |
mi4. fad8 sold4 |
la si ( si, )|
mi2 r4 |
R2. |
r4 mi la |
sold8 ([ fad ] mi4 ) mi |
fad sold4. sold8 |
la4 la r |
R2.*2 |
r4 dod la, |
mi4. re8 dod4 |
fad fad sold |
la2 r4 |
r2 mi4 |
re4. fad8 [ mi re ]|
dod4. \melisma mi8 [ re dod ]|
si,4 \melismaEnd si, mi |
la2. |
mi4 mi mi |
mi2. |
mi2 mi4 |
mi2 sold4 |
la2 la4 |
mi2. |
r4 mi la |
sold mi sold |
la2. |
re4 mi4. mi8 |
la,2 r4 |
r la re' |
dod' la re' |
dod'8 ([ si ] la4 ) re' |
dod' la re' |
dod'8 [ si ] la4 r |
r2 la4 |
re'2. ~|
re'2 re4 |
la2. |
 }
      >> 
    >>
    \new Staff << 
                  { \key la \major
\time 3/4
\tempo "Allegro" \midiTempo #144
s2.*134 s2 \tempo "Adagio" \midiTempo #80 s4 s2.*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" la,2 la4 |
sold mi la |
re' si mi' |
dod' la dod' |
fad sold mi |
la la, dod |
mi2 dod'4 |
la fad si |
sold mi fad |
re mi mi, |
la,2 r4 |
r dod la, |
re si, mi |
la, dod-"Tutti" la, |
mi4. re8 dod4 |
fad fad sold |
la la, dod |
fad fad, sold, |
la, dod la, |
mi sold mi |
fad red2 |
mi mi4 |
red si, mi |
la, fad, si, |
mi mi, dod |
red si, mi |
la, fad, si, |
mi, mi sold |
si2 sold4 |
mi fad mi |
red mi si, |
dod red2 |
mi4 sold mi |
si4. la8 sold4 |
dod' dod red |
mi4. sold,8 fad,4 |
mi, si,2 |
mi,4 mi sold |
si si, si |
dod' fad mi |
red si, dod |
la, si,2 |
mi4 dod la, |
mi dod la, |
mi dod' la |
mi' sold mi |
la2 sold4 |
la fad re |
la fad re |
la fad re |
la2. |
la |
la |
la2 la4 |
la2 la4 |
si2 si4 |
la2. |
R2. |
r4 mi la |
sold8 fad mi4 la |
sold8 fad mi4 la |
re8 dod re mi fad sold |
la4 dod la, |
mi sold mi |
si la sold |
fad la si |
mi red dod |
si,2 si,4 |
si2. |
si2 si4 |
si2 si4 |
dod'2 dod'4 |
si2. |
r4 si red' |
mi' red' dod' |
si red si, |
fad4. mi8 red4 |
sold sold lad |
si red si, |
fad fad si, |
fad2 si4 |
lad8 sold fad4 si |
lad fad r |
\clef "alto" r red' si |
fad'4. mi'8 red'4 |
sold' sold' lad' |
si' si << { fad' | mi'4. sold'8 fad' mi' | red'4 }
          \\ { red' | dod' sold lad | si } >>
\clef "bass" sold mi |
si si, mi |
red si, sold |
si2 si,4 |
dod red4. red8 |
mi4 sold mi |
si4. la8 sold4 |
dod' red'4. red'8 |
mi'4 sold, mi, |
si,4. la,8 sold,4 |
dod dod red |
mi4. fad8 sold4 |
la si si, |
mi dod la, |
mi sold mi |
la dod la, |
mi2 mi4 |
fad sold2 |
la4 la, \clef "treble" la' |
mi''4. re''8 dod''4 |
fad'' fad'' sold'' |
la'' \clef "bass" dod la, |
mi4. re8 dod4 |
fad fad sold |
la2 la,4 |
mi mi, mi |
re4. fad8 mi re |
dod4. mi8 re dod |
si,4 si, mi |
la2 la,4 |
mi mi mi |
mi2. |
mi2 mi4 |
mi2 sold4 |
la2 la,4 |
mi2 r4 |
r mi la |
sold mi sold |
la2. |
re4 mi mi, |
la,2 r4 |
r la re' |
dod' la re' |
dod'8 si la4 re' |
dod' la re' |
dod'8 si la4 r |
r2 la4 |
re2. ~|
re2 re4 |
la,2. |

 }
                   >>
  >>
  
  \midi { } }
