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
      \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "trumpet" \set Staff.instrumentName = "tromba12" <<
  << { s1*30 |
fad''4 s8 sol'' la''4 la'' |
la'' s2 fad''4 |
re'' s2 la''4 ~|
la'' sol''2 fad''4 |
mi''2 re''4 s |
s1*2 |
mi''4 s8 mi'' la''4 sold'' |
la'' s2. |
s1 |
s2. la''4 |
si'' mi'' mi'' s |
s1*2 |
la''4 mi'' fad'' s |
s1*29 |
re''4. mi''8 fad'' sol'' la'' mi'' |
fad''2 mi''4 la'' |
sol''2 fad'' |
mi''4 mi'' la' la'' |
sol'' fad''8 sol'' la''4. sol''8 |
fad''4 la'' ~ la''8 sol'' fad'' mi'' |
re''4 la'' ~ la''8 sol'' fad'' mi'' |
re''4 mi''8 fad'' sol''4 la'' |
si''4. la''8 sol'' fad'' mi'' re'' |
mi''2 mi'' |
s1 |
re''2 fad''4. re''8 |
mi''1 |
re''\breve*1/2 |
 } \\ { s1*30 |
re''4 s8 mi'' fad''4 mi'' |
fad'' s2 fad'4 |
fad' s2 la'4 |
fad' re' la' la'' |
sol''2 fad''4 s |
s1*2 |
la'4 s8 la' mi''4 mi'' |
mi'' s2. |
s1 |
s2. mi''4 |
re''4. re'8 la'4 s |
s1*2 |
mi''4 la' re' s |
s1*29 |
fad'4 re' la' r8 la' |
la'4 re' la' la' |
mi''2 re'' |
la'4 la' fad' fad'' |
mi'' re'' mi''2 |
re''4 r la'2 ~|
la'8 la' fad' fad' re'4 la' |
re'4. re'8 re''4 re'' |
re'' mi'' mi'' r8 la' |
la'2 la' |
s1 |
la'2 re''4 re'8 fad' |
la'2. la'4 |
fad'\breve*1/2 |
 } >>
  { R1*30 |
s4 r8 s s2 |
s4 r r s |
s r r s |
s1 |
s2. r4 |
R1*2 |
s4 r8 s s2 |
s4 r4 r2 |
R1 |
r2 r4 s4 |
s2. r4 |
R1*2 |
s2. r4 |
R1*29 |
s1*10 |
R1 |
s1*3 |
 }
>> } >>
      \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "timpani" \set Staff.instrumentName = "tympani" R1*30 |
re4 r8 la, re4 la, |
re r r la, |
re r r la, |
re4. re8 la,4 re |
re la, re r |
R1*2 |
la,4 r8 la, la,4 re |
la, r r2 |
R1 |
r2 r4 la, |
re4. re8 la,4 r |
R1*2 |
la,4 la, re r |
R1*29 |
re4 r8 re la,4 r8 la, |
re4 re la, r |
la, r la, r |
la, r la, r |
la, re la,4. la,8 |
re4 r re r |
re r re r |
re4. re8 re4 re |
re4. re8 re4 re |
la,2 la, |
R1 |
re2 re |
la,1 |
re\breve*1/2 |
 } >>
      \new StaffGroup <<
        \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" R1*20 |
re''4. mi''8 fad'' sol'' la'' mi'' |
fad'' re'' si''2 la''4 |
re'' sol''2 fad''4 |
si''4. dod'''16 si'' dod'''8 la'' re''' fad'' |
sol'' mi'' la'' sol'' fad'' re'' fad'' sold'' |
la'' mi'' la''2 sold''4 |
la'' r8 la'' sold''4 dod''' |
r8 dod''' si'' la'' sold'' si'' mi''4 r8 la'' re'''2 dod'''4 |
si''2 la'' |
re'''4 r8 dod''' re'''4 la'' ~|
la''8 fad'' re'''4 dod''' fad'' |
r mi'' la' la'' |
re'' sol''2 fad''4 |
mi''2 la'4 r8 fad'' |
sol'' mi'' la'' sol'' fad'' re'' la''4 ~|
la'' sold'' la''8 dod''' re''' si'' |
dod'''4 r8 si'' la''4 sold'' |
la'' r r sold'' |
fad'' si'' r mi'' ~|
mi'' re''2 dod''4 |
si'2 la'4. si'8 |
dod'' re'' mi''4 ~ mi''8 re''16 dod'' si'8 dod'' |
re'' mi'' fad''4 ~ fad''8 mi''16 re'' dod''8 re'' |
mi''4 la' re''4. mi''8 |
fad'' sol'' la''4 ~ la''8 sol''16 fad'' mi''8 fad'' |
sol'' la'' si''4 ~ si''8 la''16 sol'' fad''8 sol'' |
la'' si''16 dod''' re'''8 dod''' si'' la'' sol'' fad'' |
mi''4 r r2 |
R1 |
re''4. mi''8 fad'' sol'' la'' mi'' |
fad''4 r r2 |
r r4 fad'' |
si' mi''2 re''4 ~|
re'' dod'' si'2 |
la' r |
R1 |
r2 fad''4. sold''8 |
lad'' si'' dod'''2 si''4 ~|
si'' la'' sold''2 |
fad''4. mi''8 red'' dod'' si'4 ~|
si'8 la' sold' fad' mi' re' dod' si |
la4 r re''4. dod''8 |
si'4 mi'' ~ mi''8 re'' dod'' si' |
la' si'16 dod'' re''4 ~ re''8 do'' si' la' |
sol' la'16 si' do''2 do''4 ~|
do'' si' la'2 |
sol'4. la'8 si' dod'' re''4 ~|
re''8 dod''16 si' la'8 si' dod'' re'' mi''4 ~|
mi''8 re''16 dod'' si'8 dod'' re'' mi'' fad'' sol'' |
la''4 mi'' re''2 |
dod''4 mi'' ~ mi''8 re'' dod''4 |
fad''4. mi''8 re'' dod'' si' dod''16 re'' |
mi''4. re''8 dod'' si' la' si'16 dod'' |
re''4. mi''8 fad'' sol'' la'' mi'' |
fad''2 mi''4 r |
R1 |
r4 mi'' la' re''' |
dod''' re'''2 dod'''4 |
re''' la'' ~ la''8 sol'' fad'' mi'' |
re''4. mi''8 fad'' sol'' la''4 |
sol''4. la''8 si'' dod''' re''' la'' |
si'' la'' sol'' fad'' mi'' re''' dod''' si'' |
dod'''2 dod''' |
R1 |
re'''2 re''' |
re''' dod''' |
re'''\breve*1/2 |
 } >>
        \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" R1*25 |
la'4. si'8 dod'' re'' mi'' si' |
dod'' la' fad''2 mi''4 |
la' re''2 dod''4 |
fad''4. sold''16 fad'' sold''8 mi'' la''4 ~|
la''8 re'' sol''4 ~ sol''8 sol'' fad'' mi'' |
fad''4 r8 sol'' la''4 dod'' |
re'' fad'' mi'' la' |
fad' si' dod' dod'' ~|
dod'' si' la''2 |
sol'' fad''4 r |
r2 r4 r8 dod'' |
re'' si' mi'' re'' dod'' la' fad'' sold'' |
la''4 r8 sold'' la'' fad'' mi'' re'' |
dod''4 la' sold' dod'' |
r fad' mi' sold' |
la'4. la'8 mi''4. mi''8 |
re''2 dod''4 r |
mi'4. fad'8 sol' la' si'4 ~|
si'8 la'16 sol' fad'8 sol' la'2 ~|
la'4. sol'8 fad'4 r |
la'4. si'8 dod'' re'' mi''4 ~|
mi''8 re''16 dod'' si'8 dod'' re''4. re''8 |
dod'' re''16 mi'' fad''8 mi'' re''4 mi''8 re'' |
dod''4 la''2 sol''4 ~|
sol'' fad'' mi''2 |
la'4 re' ~ re'8 mi' fad' sol' |
la' fad' si'2 la'4 |
re' sol'2 fad'4 |
sold'4. fad'16 mi' la'4. sold'16 fad' |
mi'2 r4 mi'' ~|
mi''8 re'' dod'' si' la'4 r |
fad''4. mi''8 re'' dod'' si' fad'' ~|
fad''4 mi'' fad'' dod'' ~|
dod''8 si' lad' sold' fad'4. fad''8 |
mid''4 fad''2 mid''4 |
fad'' r r2 |
mi'4. re'8 dod' si la4 |
la'4. sol'8 fad'4 si' ~|
si'8 la' sol' fad' mi' fad'16 sol' la'4 ~|
la'8 sol' fad' mi' re'4 re'' |
mi''4. fad''16 sol'' la''4. sol''8 |
fad''4 sol''2 fad''4 |
sol'' r re'4. mi'8 |
fad' sol' la'4 ~ la'8 sol'16 fad' mi'8 fad' |
sol' la' si'2 la'4 ~|
la' la''2 sold''4 |
la'' r r la' ~ |
la'8 sol' fad'4 si'4. la'8 |
sol' fad' mi' fad'16 sol' la'4. sol'8 |
fad'4 sol' la'2 ~|
la'2. mi''4 ~|
mi''8 re'' dod'' si' la'4 re'' ~|
re'' dod'' fad''2 |
mi''4 fad'' mi''2 |
fad'' la'' ~|
la''8 sol'' fad'' mi'' re''4 re'' |
re'' mi''8 fad'' sol''4 la''8 re'' |
re''4 si''8 la'' sol'' fad'' mi'' re'' |
mi''2 mi'' |
R1 |
la''2 fad'' |
mi''1 |
fad''\breve*1/2 |
 } >>
        \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" R1*30 |
la'4 r8 sol' fad'4 mi' |
re'8 la' fad' re' la'4 dod' |
re'8 dod' si4 mi' fad' |
fad'8 mi' re'4 mi' fad' |
si' la' re'' r |
R1*2 |
mi'4. re'8 dod' si' si' si' |
mi' dod' dod'2 dod''4 ~|
dod'' si'8 la' sold'4. dod'8 |
dod'4 re' si' la' |
fad' mi' mi' la ~|
la8 si dod' re' mi'4. re'16 dod' |
si8 dod' re' mi' fad'4. mi'16 re' |
dod'8 re' mi'4 r re' ~|
re'8 mi' fad' sol' la'4. sol'16 fad' |
mi'8 fad' sol' la' si'4. si'8 |
la' sol' fad' sol'16 la' si'4. si'8 |
dod''4. re''16 dod'' si'2 |
dod''4 re''2 dod''4 |
re'' fad' r2 |
re4. mi8 fad sol la fad |
si4. dod'16 si dod'8 la re'4 ~|
re' dod'2 si4 ~|
si la2 sold4 |
la4. si8 dod' re' mi'4 ~|
mi' re'8 dod' si dod' re' dod' |
si4 si'2 lad'4 ~|
lad' fad'2 si'8 fad' |
sold'4 r dod'4. si8 |
lad sold fad4 r2 |
mi'4. re'8 dod' si la4 |
r re' ~ re'8 dod' si4 |
mi'4. re'8 dod' si la si16 dod' |
re'4. do'8 si4 si |
mi'4. re'8 do' si la4 ~|
la si8 do' re'2 |
re'4 sol ~ sol8 la si dod' |
re'4 ~ re'8 dod'16 si la8 si dod' re' |
mi'4 ~ mi'8 re'16 dod' si4 fad' |
mi'2 r |
mi'4. re'8 dod'4 fad' ~|
fad'8 mi' re' dod' si4 mi' ~|
mi'8 re' dod' si la si16 dod' re'4 |
re'2. dod'4 |
re'2 dod'4 la' |
sol'2 fad' |
mi' re' |
la'4 la' la'2 |
la'4 r fad' r |
re' la' ~ la'8 sol' fad' mi' |
re'4 sol' re' re' |
sol' re' si' mi' |
la'2 la' |
R1 |
la'2 la' |
la'1 |
la'\breve*1/2 |
 } >>
      >>
    >>
    \new ChoirStaff <<
      \new Staff  <<
        { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vcanto" R1*15 |
la'4.\melisma si'8 dod''[ re'' mi'' si' | dod'' ]\melismaEnd
la' fad''2 \melisma mi''4 |
la' re''2\melismaEnd dod''4 |
fad''2 \melisma mi'' |
re'' \melismaEnd dod'' |
R1*10 |
re''4. \melisma dod''8 re''4 \melismaEnd la' |
re''8 la' re''4\melisma dod''\melismaEnd fad'' |
r mi'' \melisma la' la'' |
re'' sol''2 fad''4 |
mi''2 \melismaEnd re'' |
R1*2 |
mi''4. \melisma re''8 dod''4 si' \melismaEnd |
la' r r sold' \melisma |
fad' \melismaEnd si' r mi'' ~\melisma |
mi'' re''2 dod''4 \melismaEnd |
si'2 la'4. \melisma si'8 |
dod'' [ re'' ] mi''4 ~ mi''8 [ re''16 dod'' ] si'8 [ dod'' ]|
re'' [ mi'' ] fad''4 ~ fad''8 [ mi''16 re'' ] dod''8 [ re'' ]|
mi''4\melismaEnd la' re'4. \melisma mi'8 |
fad' [ sol' ] la'4 ~ la'8 [ sol'16 fad' ] mi'8 [ fad' ]|
sol' [ la' ] si'4 ~ si'8 [ la'16 sol' ] fad'8 [ sol' ]|
la' [ si'16 dod'' ] re''8 [ dod'' ] si' [ dod''16 re'' ] mi''8 [ re'' ]|
dod'' [ si' ]\melismaEnd la'4 r2 |
R1 |
re''4. \melisma mi''8 fad'' [ sol'' la'' mi'' ]|
fad''4 \melismaEnd fad' r2 |
r r4 fad'' \melisma |
si' mi''2 re''4 ~|
re'' \melismaEnd dod'' si'2 |
la' r |
R1 |
r2 fad'4. \melisma sold'8 |
lad' [ si' ] dod''2 si'4 ~|
si' la' sold'2 \melismaEnd |
fad' r |
R1 |
r2 re''4.\melisma dod''8 |
si'4 mi'' ~ mi''8 [ re'' dod'' si' ]|
la' [ si'16 dod'' ] re''4 ~ re''8 [ do'' si' la' ]|
sol' [ la'16 si' ] do''2 \melismaEnd do''4 |
do'' ( si' ) la'2 |
sol'4. \melisma la'8 si' [ dod'' ] re''4 ~|
re''8 [ dod''16 si' ] la'8 [ si' ] dod'' [ re'' ] mi''4 ~|
mi''8 [ re''16 dod'' ] si'8 [ dod'' ] re'' [ mi'' fad'' sol'' ]|
la''4 \melismaEnd mi'' re''2 |
dod''4 mi'' ~\melisma mi''8 [ re'' ] dod''4 |
fad''4. mi''8 re'' [ dod'' ] si' [ dod''16 re'' ]|
mi''4. re''8 dod'' [ si' ] la' [ si'16 dod'' ]|
re''4. mi''8 fad'' sol'' la'' mi'' |
fad''2 \melismaEnd mi''4 r |
R1 |
r4 mi'' \melisma la' re'' |
dod'' re''2 dod''4 \melismaEnd |
re'' la'' ~\melisma la''8 [ sol'' fad'' mi'' ]|
re''4 re'8 [ mi' ] fad' [ sol' ]\melismaEnd la'4 |
sol'4. \melisma la'8 si' [ dod'' re'' la' ]|
si'4 sol'' ~ sol''8 [ fad'' mi'' re'' ]|
dod''2\melismaEnd dod'' |
R1 |
re''2 re'' |
re'' ( dod'' )|
re''\breve*1/2 |
 }
      >> 
      \new Staff  <<
        { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "valto" R1*10 |
re'4. \melisma mi'8 fad' [ sol' la' mi' | fad' ]\melismaEnd
re' si'2 \melisma la'4 |
re' sol'2 fad'4 |
si4. \melismaEnd si8 dod' [\melisma la ] la'4 |
sol'2 \melismaEnd fad'4 fad'8 [\melisma mi' ]|
re' [ mi' fad' sol' ] mi' [ re' dod' re' ]|
mi'4 \melismaEnd dod' r2 |
r4 fad'\melisma mi'\melismaEnd la' |
r la' \melisma si' \melismaEnd la' |
la' ( sold' ) la'2 |
R1*10 |
la'4. \melisma sol'8 la'4 \melismaEnd mi' |
la'8 fad' si'4 \melisma mi' la' ~|
la' sol'8 [ fad' ] mi'4 la' ~|
la' sol' la'2 |
si'4 la' \melismaEnd la'2 |
R1*2 |
la'4. \melisma sold'8 la'4 sold'8 [ fad' ]\melismaEnd |
mi'4 r r2 |
r4 fad' \melisma mi' sold' |
la'4. sold'16[ fad'] mi'4. \melismaEnd mi'8 |
fad'4 \melisma mi' \melismaEnd mi' r |
mi'4. \melisma fad'8 sol' [ la' ] si'4 ~|
si'8 [ la'16 sol' ] fad'8 [ sol' ] la'2 ~|
la'4. sol'8 \melismaEnd fad'4 r |
la4. \melisma si8 dod' [ re' ] mi'4 ~|
mi'8 [ re'16 dod' ] si8 [ dod' ] re'4. re'8 |
dod' [ re'16 mi' ] fad'8 [ mi' ] re' [ mi'16 fad' ] sol'8 [ fad' ]|
mi'4 la'2 sol'4 ~|
sol' fad' mi'2 \melismaEnd |
la4 re' ~\melisma re'8 [ mi' fad' sol' | la' ]\melismaEnd
fad' si'2 \melisma la'4 |
re' sol'2 fad'4 |
sold'4. fad'16 [ mi' ] la'4. sold'16 [ fad' ]|
mi'4 \melismaEnd mi' r mi' ~\melisma |
mi'8[ re' dod' si ]\melismaEnd la4 r |
fad'4. \melisma mi'8 re' [ dod' ]\melismaEnd si4 |
si'2. lad'4 |
dod'2 \melisma fad' |
mid'4 fad'2 mid'4 \melismaEnd |
fad'2 r |
R1 |
la'4. \melisma sol'8 fad'4 si' ~|
si'8 [ la' sol' fad' ] mi' [ fad'16 sol' ] la'4 ~|
la'8 [ sol' fad' mi' ] re'4 \melismaEnd re' |
mi'4. \melisma fad'16 [ sol' ] la'4. sol'8 |
fad'4 \melismaEnd sol' sol' \melisma fad' \melismaEnd |
sol' r re'4. \melisma mi'8 |
fad' [ sol' ] la'4 ~ la'8 [ sol'16 fad' ] mi'8 [ fad' ]|
sol' [ la' ] si'2 la'4 ~|
la' \melismaEnd la' la' ( sold' )|
la' r r la' ~\melisma |
la'8 [ sol' ] fad'4 si'4. la'8 |
sol' [ fad' ] mi' [ fad'16 sol' ] la'4. sol'8 |
fad'4 \melismaEnd sol' la'2 ~|
la' la' |
sol' \melisma fad' \melismaEnd |
mi' r4 la' \melisma |
sol' fad'8 [ sol' ] la'2 \melismaEnd |
la' la' ~\melisma |
la'8 [ sol' fad' mi' ] re'4 \melismaEnd re' |
r sol'2 la'4 |
sol' \melisma si'2 \melismaEnd si'4 |
la'2 la' |
R1 |
la'2 la' |
la'1 |
la'\breve*1/2 |
 }
      >> 
      \new Staff  <<
        { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "G_8" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vtenore" R1*5 |
la4. \melisma si8 dod' [ re' mi' si | dod' ]\melismaEnd
la fad'2 \melisma mi'4 |
la re'2 dod'4 |
fad4. fad8 sold [ mi ] la4 ~|
la8 [ sold la si ] dod' [ re' mi' sol ]|
fad [ si la sol ] re'4 \melismaEnd dod' |
re' re r2 |
r4 si\melisma la\melismaEnd re' |
r2 r4 re' ~\melisma |
re' dod'\melismaEnd re'2 |
R1 |
r4 la\melisma sold\melismaEnd dod' |
R1 |
r4 fad' \melisma sold' \melismaEnd mi' |
fad' \melisma mi'8 [ re' ] \melismaEnd mi'2 |
R1*10 |
fad'4. \melisma mi'8 re'4 \melismaEnd dod' |
re' fad' r dod' \melisma |
fad si dod'4. dod'8 |
re'2 mi'4 fad' |
sol'2 \melismaEnd fad' |
R1*2 |
dod'4. \melisma re'8 mi'4. re'8 |
mi' \melismaEnd dod' la4\melisma sold dod' ~|
dod' si8 [ la ] sold [ fad ]\melismaEnd mi4 |
r la \melisma si \melismaEnd dod' |
re'2 dod'4 la ~\melisma |
la8 [ si dod' re' ] mi'4. re'16 [ dod' ]|
si8 [ dod' re' mi' ] fad'4. mi'16 [ re' ]|
dod'8 [ re' ]\melismaEnd mi'4 r re ~\melisma |
re8 [ mi fad sol ] la4. sol16 [ fad ]|
mi8 [ fad sol la ] si4. si8 |
la [ sol ] fad [ sol16 la ] si4. \melismaEnd si8 |
dod'4. \melisma re'16 [ dod' ] si2 |
dod'4 re'2 dod'4 |
re' \melismaEnd la r2 |
re4. \melisma mi8 fad [ sol la fad ]|
si4. dod'16 [ si ] dod'8 [ la ] re'4 ~|
re' dod'2 si4 ~|
si la2 \melismaEnd sold4 |
la4. \melisma si8 dod' [ re' ] mi'4 ~|
mi' re'8 [ dod' ] si4 fad' ~|
fad' mi' \melismaEnd fad' dod' ~\melisma |
dod'8 [ si lad sold ] fad2 \melismaEnd |
dod'4 r r2 |
fad'4. \melisma mi'8 red' [ dod' ] si4 |
mi'4. re'8 dod' [ si ]\melismaEnd la4 |
r re' ~\melisma re'8 [ dod' ] si4 |
mi'4. re'8 dod' [ si ] la [ si16 dod' ]|
re'4. do'8 si4 \melismaEnd si |
mi'4. \melisma re'8 do' [ si ] la4 ~|
la si8 [ do' ] \melismaEnd re'4 r |
r sol ~\melisma sol8 [ la si dod' ]|
re'4. dod'16 [ si ] la8 [ si dod' re' ]|
mi'4. re'16 [ dod' ] si4 fad' \melismaEnd |
mi'2 r |
mi'4. \melisma re'8 dod'4 fad' ~|
fad'8 [ mi' re' dod' ] si4 mi' ~|
mi'8 [ re' dod' si ] la [ si16 dod' ] \melismaEnd re'4 |
re'2. dod'4 |
re'2 dod'4 mi' ~\melisma |
mi'8 [ re' dod' si ] la4 re' ~|
re' dod' fad'2 |
mi'4 re' mi'2 \melismaEnd |
fad' r |
r4 la' ~ la'8 [ sol' ] fad' [ mi' ]|
re'2. re'4 |
re' \melisma mi'2 \melismaEnd mi'4 |
mi'2 mi' |
R1 |
re'2 fad' |
mi'1 |
fad'\breve*1/2 |

 }
      >> 
      \new Staff  <<
        { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vbasso" re4. \melisma mi8 fad [ sol la mi | fad ]\melismaEnd
re si2 \melisma la4 |
re sol2 fad4 |
si4. \melismaEnd si8 dod' [\melisma la ] re'4 ~|
re' dod' re' fad8[ mi ]|
re [ mi fad sold ] la4 \melismaEnd la, |
r la\melisma sold dod' |
r fad mi la |
r re2 \melismaEnd dod4 |
si,2 la,4 r |
R1 |
r4 re \melisma dod \melismaEnd fad |
R1 |
r4 sol2 fad4 |
mi2 re4 re8 [\melisma mi ]|
fad4 \melismaEnd re la la, |
R1*2 |
r4 re'2 dod'4 |
si2 la |
R1*10 |
re4. \melisma mi8 fad [ sol la mi | fad ]\melismaEnd
re si2 \melisma la4 |
re sol2 fad4 |
si4. \melismaEnd si8 dod' [\melisma la ] re'4 ~|
re' dod' \melismaEnd re'2 |
R1*2 |
la,4. \melisma si,8 dod [ re mi si, | dod ]\melismaEnd
la, fad2 \melisma mi4 |
la, re2 dod4 |
fad4. \melismaEnd fad8 sold [\melisma mi ] la4 ~|
la sold \melismaEnd la r |
r mi ~\melisma mi8 [ fad sol la ]|
si4. la16 [ sol ] fad8 [ sol ] la4 ~|
la8 [ si ] dod'4 \melismaEnd re' r |
r la, ~\melisma la,8 [ si, dod re ]|
mi4. re16 [ dod ] si,8 [ dod re mi ]|
fad [ mi ] re [ mi16 fad ] sol8 [ fad ] mi [ fad16 sol ]|
la8 [ sol fad mi ] re4 mi |
la,8 [ la si la ] sol [ mi la sol ]|
fad [ mi ]\melismaEnd re4 r2 |
R1*2 |
r4 dod'\melisma fad si |
sold \melismaEnd la mi4. \melisma re8 |
dod [ si, ]\melismaEnd la,4 la4. \melisma sol8 |
fad4 lad si4. la8 |
sol2 \melismaEnd fad4 r |
fad4. \melisma mi8 re2 \melismaEnd |
dod4 r dod'4. \melisma si8 |
lad [ sold ] fad4 si4. la8 |
sold [ fad ] mi4 la4. sol8 |
fad [ mi ]\melismaEnd re4 r2 |
r la4. \melisma sol8 |
fad4 si ~ si8 [ la sol fad ]|
mi4 la ~ la8 [ sol fad mi ]\melismaEnd |
re4 r re'4. do'8 |
si [ la ] sol4 r re ~\melisma |
re8 [ mi fad sol ] la4. sol16 [ fad ]|
mi8 [ fad sol la ] si [ dod' ] re'4 ~|
re' \melismaEnd dod' si2 |
la4 r la4. \melisma sol8 |
fad4 si ~ si8 [ la sol fad ]|
mi [ fad16 sol ] la4 ~ la8 [ sol fad mi ]|
re [ dod ] si,4 \melismaEnd la,2 |
re8 [\melisma mi fad sol ] la2 ~|
la1 ~|
la ~|
la4 re la2\melismaEnd |
re re' ~|
re' do' |
si2. fad4 |
sol2. sol4 |
sol2 sol |
R1 |
fad2 re |
la1 |
re\breve*1/2 |
 }
      >> 
    >>
    \new Staff << { \key re \major
\tempo "Allegro moderato" \midiTempo #120
\time 4/4 s1*85
\tempo "Adagio" \midiTempo #80
s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" re4.-"Tasto solo" mi8 fad sol la mi |
fad re si2 la4 |
re sol2 fad4 |
si4. si8 dod' la re'4 ~|
re' dod' re' fad8 mi |
%{%}<< { la4. si8 dod' re' mi' si | dod'[ la] }
\\ { re mi fad sold la4 la, | r } >> la, sold, dod |
%{%}<<
{ la re'2 dod'4 |
  fad4. fad8 sold mi la4 ~|
  la8 sold la si dod' re' mi' sol |
  re'4. mi'8 \clef "treble" fad' sol' la' mi' |
  fad'4 }
\\ { r fad mi la |
     r re2 dod4 |
     si,2 la,4 r |
     fad8 si la sol re'4 dod' |
     re' } >> \clef "bass" re dod fad |
%{%}<< { \clef "treble" re' sol'2 fad'4 | }
\\ { r si la re' |} >>
\clef "bass" sol sol2 fad4 |
mi2 re4. mi8 |
fad4 re la la, |
\clef "treble" << dod'' \\ mi' >> \clef "bass" la sold dod' |
\clef "treble" << { la'4 re''2 dod''4 } \\ { r fad' mi' la' } >>|
fad' \clef "bass" re2 dod4 |
si,2 la, |
\clef "treble" re''4. mi''8 fad'' sol'' la'' mi'' |
fad'' re'' si''2 la''4 |
re'' sol''2 fad''4 |
si''4. dod'''16 si'' dod'''8 la'' re''' fad'' |
sol'' mi'' la'' sol'' fad'' re'' fad'' sold'' |
%{%}<<
{ la'' mi'' la''2 sold''4 |
  la'' r8 la'' sold''4 dod''' |
  r8 dod''' si'' la'' sold'' si'' mi''4 |
  r8 la'' re'''2 dod'''4 |
  si''2 la'' | }
\\ { la'4. si'8 dod'' re'' mi'' si' |
     dod'' la' fad''2 mi''4 |
     la' re''2 dod''4 |
     fad''4. sold''16 fad'' sold''8 mi'' la''4 ~|
     la''8 re'' sol''4 ~ sol''8 sol'' fad'' mi'' |} >>
\clef "bass" re4. mi8 fad sol la mi |
fad re si2 la4 |
re sol2 fad4 |
si4. si8 dod' la re'4 ~|
re' dod' re'4. \clef "treble" fad''8 |
%{%}<<
{ sol'' mi'' la'' sol'' fad'' re'' la''4 ~|
  la'' sold'' la''8 dod''' re''' si'' }
\\ { r2 r4 r8 dod'' |
     re'' si' mi'' re'' dod'' la' fad'' sold'' } >>|
\clef "bass" la,4. si,8 dod re mi si, |
dod la, re2 dod4 |
la, re2 dod4 |
fad4. fad8 sold mi la4 ~|
la sold la la ~|
la8 si mi4 ~ mi8 fad sol la |
si4. la16 sol fad8 sol la4 ~|
la8 si dod'4 re' re ~|
re8 mi la,4 ~ la,8 si, dod re |
mi4. re16 dod si,8 dod re mi |
fad mi re mi16 fad sol8 fad mi fad16 sol |
la8 sol fad mi re4 mi |
la,8 la si la sol mi la sol |
fad mi re4 \clef "treble" re'8 mi' fad' sol' |
\clef "bass" re4. mi8 fad sol la fad |
si4. dod'16 si dod'8 la re'4 ~|
re' dod' fad si |
sold la mi4. re8 |
dod si, la,4 la4. sol8 |
fad4 lad si4. la8 |
sol2 fad |
fad4. mi8 re2 |
dod4 si, dod2 |
fad,4 fad si4. la8 |
sold fad mi4 la4. sol8 |
fad mi re4 re'8 dod' si4 |
mi'4. re'8 la4. sol8 |
fad4 si ~ si8 la sol fad |
mi4 la ~ la8 sol fad mi |
re2 re'4. do'8 |
si la sol2 re4 ~|
re8 mi fad sol la4. sol16 fad |
mi8 fad sol la si dod' re'4 ~|
re' dod' si2 |
la la4. sol8 |
fad4 si ~ si8 la sol fad |
mi fad16 sol la4 ~ la8 sol fad mi |
re dod si,4 la,2 |
re8 mi fad sol la2 ~|
la1 ~|
la ~|
la4 re la2 |
re1 ~|
re2 do |
si,4 si2 fad4 |
sol1 |
sol |
R1 |
fad2 re |
la la, |
<re, re>\breve*1/2 |
 }
                   >>
  >>
  
  \midi { } }
