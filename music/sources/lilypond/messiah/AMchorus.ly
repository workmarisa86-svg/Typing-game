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
                    { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "treble" { s1-"c. Oboe I." } { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" re'''4 sol''8 sol'' do''' do''' do''' do''' |
do''' si'' r4 r8 mi'' la'' fad'' |
re'' re'' sol'' fad'' mi''16 re'' mi'' fad'' mi'' sol'' fad'' sol'' |
la'' sol'' la'' si'' la'' si'' sol'' la'' fad'' mi'' fad'' sol'' fad'' la'' sol'' la'' |
si'' la'' si'' do''' si'' do''' la'' si'' sol''8 mi''4 la''8 |
fad'' re'' sol''4 ~ sol''8 la'' fad''8. sol''16 |
sol''4 r r2 |
r8 re'' \p sol'' re'' si'4 r |
r8 mi'' sol'' mi'' la''4 r |
r8 fad' la' fad' si'4 r |
r8 sol' si' sol' do''4 r |
r8 re'' fad'' re'' r sol' sol''4 |
r8 mi'' la''4 r8 re'' sol''4 |
R1 |
r4 sol' r do'' |
r la' r re'' |
r si' r mi'' |
r la' r la'' |
r8 sol'' sol'' sol'' r la' re''4 |
R1 |
r4 si' r mi'' |
r dod'' r fad'' |
r re'' r sol'' |
r mi'' r re'' |
re'' r mi'' r |
mi'' r r2 |
R1*5 |
r2 r16 dod'' \f re'' mi'' fad'' mi'' fad'' sol'' |
la'' sol'' la'' sol'' fad'' sol'' fad'' sol'' la'' sol'' la'' sol'' fad'' sol'' fad'' sol'' |
la'' sol'' la'' sol'' fad'' sol'' fad'' sol'' la'' sol'' la'' sol'' fad'' sol'' fad'' sol'' |
la'' sol'' la'' sol'' fad'' sol'' fad'' sol'' la'' sol'' la'' sol'' fad'' la'' sol'' la'' |
si'' la'' si'' dod''' si'' dod''' si'' dod''' re'''8 la'' re'''4 ~|
re''' dod''' re''' r |
r2 r8 re''\p sol''4 |
r8 mi'' la'' re'' re''4 sol'' |
r mi'' r la'' |
la' r r2 |
R1*6 |\allowPageTurn
r2 r16 re'' \f mi'' fad'' sol'' la'' si'' do''' |
re''' do''' re''' do''' si'' do''' si'' do''' re''' do''' re''' do''' si'' do''' si'' do''' |
re''' do''' re''' do''' si'' do''' si'' do''' re''' do''' re''' do''' si'' do''' si'' do''' |
re''' do''' re''' do''' si'' do''' si'' do''' re''' do''' re''' do''' si'' do''' si'' do''' |
re''' do''' re''' do''' si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' sol'' |
do''' si'' la'' si'' do''' si'' do''' re''' si''4 r |
R1 |
r2 r8 re'' \p mi'' sol'' |
la'' sol'' la'' si'' do''' do'' sol''4 |
r8 do'' do'' si' r sol' do''4 |
r la'' r fa'' |
r re'' r mi'' |
r mi'' r8 re'' do''8. si'16 |
la'8 re' re''4 r2 |
R1*5 |
r2 r16 mi'' fa'' sol'' la'' sol'' la'' fa'' |
sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' |
sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' |
sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' sol'' fa'' sol'' fa'' mi'' fa'' mi'' fa'' |
sol'' fad'' sol'' la'' sol''8 do''' ~ do'''16 si'' do''' la'' si'' la'' si'' do''' |
la''4. la''8 si''16 re'' mi'' fad'' sol'' si' do'' re'' |
mi'' re'' do'' re'' mi'' re'' mi'' fad'' sol''8 sol' re'' re'' |
do''' do''' do''' do''' si''16 la'' si'' do''' si'' do''' la'' si'' |
sol'' fad'' sol'' la'' sol'' si'' la'' si'' do''' si'' do''' re''' do''' re''' si'' do''' |
la'' sol'' la'' si'' la'' do''' si'' do''' re''' do''' re''' mi''' re''' mi''' do''' re''' |
si'' la'' si'' do''' si'' do''' la'' si'' do''' si'' do''' re''' do''' re''' si'' do''' |
la''8 re'' r4 r sol''8 fa'' |
mi''16 fa'' re'' mi'' do'' re'' si' do'' la'8 re' sol'8. si'16 |
la'8. do''16 si'8. re''16 do''8. mi''16 la'8. do''16 |
si'8. re''16 do''8. mi''16 re''2 ~|
re''4 do'''8. la''16 si''8. sol''16 do'''8. la''16 |
re'''8. re'''16 do'''8. si''16 la'' re'' mi'' fad'' sol'' la'' si'' do''' |
la'' re'' mi'' fad'' sol'' la'' si'' do''' la'' re'' mi'' fad'' sol'' la'' si'' do''' |
re''' do''' re''' do''' si'' do''' si'' do''' re''' do''' re''' do''' si'' do''' si'' do''' |
re''' do''' re''' do''' si'' do''' si'' do''' re''' do''' re''' do''' si'' do''' si'' do''' |
re''' do''' re''' do''' si'' la'' si'' la'' sol'' fad'' sol'' fad'' mi'' re'' mi'' re'' |
do'' si' do'' si' la' sol' la' sol' fad' la'' sol'' fad'' sol''8 mi'' |
fad''4. fad''8 sol'' re'' sol'' fad'' |
mi'' re'' do''4 ~ do''8 si'4 la'8 |
la'4. la'8 si'16 re' mi' fad' sol' la' si' do'' |
re''4. sol'8 do'' do'' do'' do'' |
do'' si' sol''4 ~ sol''8 fad''16 mi'' fad'' sol'' mi'' fad'' |
sol''8 re'' sol'' fad'' mi''16 re'' mi'' fad'' mi'' sol'' fad'' sol'' |
la'' sol'' la'' si'' la'' si'' sol'' la'' fad'' mi'' fad'' sol'' fad'' la'' sol'' la'' |
si'' la'' si'' do''' si'' do''' la'' si'' sol'' fad'' sol'' la'' sol'' la'' fad'' sol'' |
mi'' fad'' re'' mi'' do'' re'' si' do'' la'8 re' re''4 ~|
re''8 sol' do''4 ~ do''8 re'' si' la' |
la'4. sol'8 sol'2 |
 } >>
      \new Staff << 
                    { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "treble" { s1-"c. Oboe II." } { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" si'4 r r2 |
re''4 sol'8 sol' do'' do'' do'' do'' |
si'16 la' si' do'' si' do'' la' si' sol' fad' sol' la' sol' si' la' si' |
do'' si' do'' re'' do'' re'' si' do'' la' sol' la' si' la' do'' si' do'' |
re'' do'' re'' mi'' re'' mi'' do'' re'' si'8 sol' do''4 ~|
do''8 re'' si' la' si'4 la'8. sol'16 |
sol'4 r r2 |
r8 si' \p re'' si' re'4 r |
r8 do'' mi'' do'' do'4 r |
r8 re' fad' re' re''4 r |
r8 mi' sol' mi' mi''4 r |
r8 la' re'' la' r re' re''4 |
r8 do'' do''4 r8 si' si'4 |
R1 |
r4 mi' r la' |
r fad' r si' |
r sol' r do'' |
r fad' r re'' |
r8 re'' dod'' dod'' r re'' fad''4 |
R1 |
r4 re' r sol' |
r mi' r la' |
r fad' r si' |
r dod'' r la' |
si' r si' r |
dod'' r r2 |
R1*5 |
r2 r16 la' si' dod'' re'' dod'' re'' mi'' |
fad'' mi'' fad'' mi'' re'' mi'' re'' mi'' fad'' mi'' fad'' mi'' re'' mi'' re'' mi'' |
fad'' mi'' fad'' mi'' re'' mi'' re'' mi'' fad'' mi'' fad'' mi'' re'' mi'' re'' mi'' |
fad'' mi'' fad'' mi'' re'' mi'' re'' mi'' fad'' mi'' fad'' mi'' re'' fad'' mi'' fad'' |
sol'' fad'' sol'' la'' sol'' la'' sol'' la'' fad'' mi'' fad'' sol'' fad'' sol'' fad'' sol'' |
mi''4 mi'' fad'' r |
r2 r8 la' \p re''4 |
r8 do'' do'' la' si'4 si' |
r sol' r do'' |
fad' r r2 |
R1*6 |
r2 r16 fad'' sol'' la'' sol'' fad'' sol'' la'' |
si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' la'' sol'' la'' sol'' la'' |
si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' la'' sol'' la'' sol'' la'' |
si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' la'' sol'' la'' sol'' la'' |
si'' la'' si'' la'' sol'' fad'' sol'' fad'' mi'' fad'' mi'' fad'' sol'' fad'' sol'' re'' |
mi'' re'' do'' re'' mi'' re'' mi'' fad'' sol''4 r |
R1 |
r2 r8 si' \p do'' mi'' |
do'' si' do'' re'' sol' sol' mi''4 |
r8 re' re' re' r mi' sol'4 |
r fa' r la' |
r si' r si' |
r do'' r8 si' la'16 si' la' sol' |
fad'8 fad' sol'4 r2 |
R1*5 |
r2 r16 do'' re'' mi'' fa'' mi'' fa'' re'' |
mi'' re'' mi'' re'' do'' re'' do'' re'' mi'' re'' mi'' re'' do'' re'' do'' re'' |
mi'' re'' mi'' re'' do'' re'' do'' re'' mi'' re'' mi'' re'' do'' re'' do'' re'' |
mi'' re'' mi'' re'' do'' re'' do'' re'' mi'' re'' mi'' re'' do'' re'' do'' re'' |
mi'' re'' mi'' fad'' mi'' fad'' sol'' mi'' fad'' sol'' la'' fad'' re''8 sol'' |
sol''4 fad'' sol''8 re'' si' si' |
sol'4 r re''' sol''8 sol'' |
sol'' sol'' fad'' fad'' sol''16 fad'' sol'' la'' sol'' la'' fad'' sol'' |
mi'' re'' mi'' fad'' mi'' sol'' fad'' sol'' la'' sol'' la'' si'' la'' si'' sol'' la'' |
fad'' mi'' fad'' sol'' fad'' la'' sol'' la'' si'' la'' si'' do''' si'' do''' la'' si'' |
sol'' fad'' sol'' la'' sol'' la'' fad'' sol'' mi'' re'' mi'' fad'' mi'' fad'' sol'' la'' |
fad''8 fad'' r4 r re''8 si' |
sol' si' la'16 si' sol' la' fad'8 fad' r4 |
r re''8. fad''16 mi''8. sol''16 fad''8. la''16 |
sol''8. si''16 la''8. sol''16 fad''8. mi''16 re''4 |
r la''8. fad''16 re''8. sol'16 fad''8. la'16 |
sol''8. si''16 la''8. sol''16 fad'' fad'' sol'' la'' re'' fad'' sol'' la'' |
fad'' fad'' sol'' la'' re'' fad'' sol'' la'' fad'' fad'' sol'' la'' sol'' fad'' sol'' la'' |
si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' la'' sol'' la'' sol'' la'' |
si'' la'' si'' la'' sol'' la'' sol'' la'' si'' la'' si'' la'' sol'' la'' sol'' la'' |
si'' la'' si'' la'' sol'' fad'' sol'' fad'' si'' la'' si'' la'' sol'' fad'' sol'' fad'' |
mi'' re'' mi'' re'' do'' si' do'' si' la' do'' si' la' si'8 do'' |
la'4. la'8 si' si' re'' si' |
sol' sol' fad' sol' la' sol'4 sol'8 |
fad'4. fad'8 sol'8. re'16 mi' fad' sol' la' |
si'4 sol'' ~ sol''8 sol' fad'4 |
re''' r8 sol'' do''' do''' do''' do''' |
do''' si'' r4 r mi''8 re'' |
do''16 si' do'' re'' do'' re'' si' do'' la' sol' la' si' la' do'' si' do'' |
re'' do'' re'' mi'' re'' mi'' do'' re'' si' la' si' do'' si' do'' la' si' |
do'' re'' si' do'' la' si' sol' la' fad'4 r8 re' |
sol'4. mi'8 fad'4 sol' ~|
sol' fad' sol'2 |
 } >>
      \new Staff << 
                    { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" sol'4 re'8 re' mi' mi' re' fad' |
sol'4 re'8 re' mi' la' re' la' |
sol' sol' re' re' do''4 r |
mi' r fad' r |
fad' r sol' la' |
la'8 si' sol' mi' re'4. do''8 |
si'4 r r2 |
r8 sol' \p si' sol' sol4 r |
r8 sol' do'' do' mi'4 r |
r8 la re' la' fad'4 r |
r8 si mi' si' sol'4 r |
r8 re' la' fad' r si si'4 |
r8 mi' re'4 r8 re' re'4 |
R1 |
r4 do' r mi' |
r re' r fad' |
r mi' r sol' |
r re' r la' |
r8 si mi' mi' r fad' la'4 |
R1 |
r4 sol r si |
r la r dod' |
r si r re' |
r la' r fad' |
sol' r sol' r |
la' r r2 |
R1*6 |
re''8. la'16 la'4 r2 |
re''8. la'16 la'4 r2 |
r8 la' la' la' re''4 r8 re'' |
re' re' re' sol' la' la' r la' |
si'4 la' la' r |
r2 r8 fad' \p si'4 |
r8 la' re' fad' sol'4 re' |
r do' r mi' |
re' r r2 |
R1*7 |
sol'8. re'16 re'4 r2 |
sol'8. re'16 re'4 r2 |
r8 sol' sol' sol' re''4 r8 re' |
sol' sol' re' re' do'' do'' r sol' |
sol' sol' sol' fad' re''4 r |
R1 |
r2 r8 sol'\p sol' do'' |
la'4 fa'8 fa' sol' sol' do''4 |
r8 fa' sol sol r do' mi'4 |
r do'' r re' |
r sol' r sol' |
r la' r8 mi' mi' mi' |
fad' fad' re'4 r2 |
R1*6 |
do''8. sol'16 sol'4 r2 |
do''8. sol'16 sol'4 r2 |
r8 do'' sol' sol' do''4 r8 sol' |
do'' do'' do'' mi' la'4 sol'8 re' |
re''4. re''8 re' sol' re' sol' |
sol'16 fad' mi' fad' sol' fad' sol' la' re'4 si'8 si' |
mi' la' la' re' re'4 re'8 re' |
mi'4 do''8 do'' la' mi' mi' mi' |
re''4 re''8 re'' re'4 fad'8 fad' |
sol'4 r8 sol' la'4. re''8 |
re'' la' r4 r sol'8 re' |
mi' sol' mi' mi' la re' r4 |
R1 |
r2 r4 fad'8. la'16 |
sol'8. si'16 la'8. do''16 si'8. re'16 do'8. mi'16 |
re'8. re'16 mi'8. mi'16 fad'8 re' re'' re'' |
re''4 re'8 re'' re'' la' r4 |
sol'8. re'16 re'4 r2 |
sol'8. re'16 re'4 r2 |
r8 re' re' re' re''4 r8 sol' |
sol' sol' mi' mi' fad' re' r sol' |
re'4. re'8 re' re' si' re' |
mi' sol' do' mi' re' re'4 mi'8 |
re'4. re'8 re'2 |
sol'4. re'8 mi' la la' la' |
sol'4 re'8 si' la' la' la' la' |
sol'4 re''8 si' sol'16 fad' sol' la' sol'8 sol' |
mi'4 r8 mi' fad'4 re'' |
r8 fad' si' fad' sol'4 r8 mi' |
mi'4 r8 mi' fad'4 r8 fad' |
mi'4. do'8 la re' re' mi' |
la4 re' si2 |
 } >>
    >>
    \new ChoirStaff <<
      \new Staff  <<
        { s1*6 s1^"Tutti c. Oboe I & II unis." }
        
        { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vcanto" R1*6 |
re''4 sol'8 sol' do'' do'' do'' do'' |
do'' [ si' ] r4 r sol'8 fad' |
mi'4 r r8 mi' la' sol' |
fad' fad' r4 r si'8 la' |
sol'4 r r8 sol' do'' si' |
la' la' r4 r2 |
r re''4 sol'8 sol' do'' do'' do'' do'' si'16 [\melisma la' si' do'' ] si' [ do'' la' si' ]|
sol' [ fad' sol' la' ] sol' [ si' la' si' ] do'' [ si' do'' re'' ] do'' [ re'' si' do'' ]|
la' [ sol' la' si' ] la' [ do'' si' do'' ] re'' [ do'' re'' mi'' ] re'' [ mi'' do'' re'' ]|
si' [ la' si' do'' ] si' [ re'' do'' re'' ] mi'' [ re'' mi'' fad'' ] mi'' [ fad'' sol'' la'' ]|
fad''4 \melismaEnd r r2 |
R1*9 |
r4 la'8. dod''16 si'8. re''16 dod''8. mi''16 |
re''8. fad''16 mi''8. sol''16 fad''8 [\melisma mi''16 re'' ] dod''8 [ si' ]|
la'1 \melismaEnd |
la'8. re''16 dod''8. mi''16 re''8. fad''16 mi''8. re''16 |
dod''4 re''8 re'' dod'' dod'' r4 |
re''8. la'16 la'4 r2 |
re''8. la'16 la'4 r2 |
r8 la' la' la' re''4 r8 re'' |
re'' re'' sol'' sol'' fad'' fad'' r re'' |
re''4 dod'' re'' r |
R1*3 |
r4 re''8 si' sol' mi'' do'' la' |
fad'4 r r2 |
R1*4 |
r4 la'8 re'' si'4 r |
r re''8 sol'' fad'' re'' r4 |
re''8. do''16 si'4 r2 |
re''8. do''16 si'4 r2 |
r8 re'' re'' re'' sol''4 r8 re'' |
re'' re'' sol'' sol'' mi'' mi'' r sol'' |
do''4. do''8 si'4 r |
r2 re''4 sol'8 sol' |
do'' do'' do'' do'' do'' [ si' ] r4 |
R1*3 |
r2 r4 si'8 si' |
do''4 r r8 re'' do''8. si'16 |
la'8 la' r4 r2 |
R1 |
r4 sol'8. si'16 la'8. do''16 si'8. re''16 |
do''8. mi''16 re''8. fa''16 mi'' [ re'' do''8 mi'' ] fad'' |
sol''4 sol' r2 |
r r4 re''8 sol'' |
mi''4 sol''8 re'' mi'' do'' r4 |
do''8. sol'16 sol'4 r2 |
do''8. sol'16 sol'4 r2 |
r8 sol' sol' sol' do''4 r8 do'' |
do'' do'' do'' do'' do''4 si' |
la'4. la'8 si'4 r |
r2 re''4 sol'8 sol' |
do'' do'' do'' do'' si'16 [\melisma la' si' do'' ] si' [ do'' la' si' ]|
sol' [ fad' sol' la' ] sol' [ si' la' si' ] do'' [ si' do'' re'' ] do'' [ re'' si' do'' ]|
la' [ sol' la' si' ] la' [ do'' si' do'' ] re'' [ do'' re'' mi'' ] re'' [ mi'' do'' re'' ]|
si' [ la' si' do'' ] si' [ do'' la' si' ] do'' [ si' do'' re'' ] do'' [ re'' si' do'' ]|
la'4 \melismaEnd re''8 do'' si'4 r |
r8 re'' do'' si' la' la' sol'8. si'16 |
la'8. do''16 si'8. re''16 do''8. mi''16 la'8. do''16 |
si'8. re''16 do''8. mi''16 re''2 |
re''4 do''8. la'16 si'8. sol'16 do''8. la'16 |
re''8. re''16 do''8. si'16 la'8 la' re'' re'' |
re''4 re''8 re'' re'' re'' r4 |
re''8. do''16 si'4 r2 |
re''8. do''16 si'4 r2 |
r8 re'' re'' re'' sol''4 r8 sol'' |
mi'' re'' do'' si' la' la' r do'' |
la'4. la'8 si'4 r8 si' |
mi'' re'' do'' do'' do'' si'4 la'8 |
la'4. la'8 sol'2 |
R1*8 |
 }
      >> 
      \new Staff  <<
        
        { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "valto" R1*17 |
r2 la'4 re'8 re' |
sol' sol' sol' sol' sol' [ fad' ] r4 |
r2 r4 re'8 dod' |
si4 r r8 si mi' re' |
dod' dod' r4 r fad'8 mi' |
re'4 r r8 re' sol' fad' |
mi' mi' r4 r la'8 fad' |
re'4 r r8 si' sol' mi' |
dod' dod' r4 r2 |
R1*3 |
r4 dod'8. mi'16 re'8. fad'16 mi'8. sol'16 |
fad'8. la'16 sol'8. mi'16 la'8. fad'16 si'8. sol'16 |
mi'4 la'8 la' la' la' r4 |
la'8. sol'16 fad'4 r2 |
la'8. sol'16 fad'4 r2 |
r8 fad' fad' fad' la'4 r8 la' |
si' si' si' si' la' la' r la' |
si'4 la' la' re'8 re' |
sol' sol' sol' sol' sol' [ fad' ] r4 |
r2 r4 sol'8 fad' |
mi'4 r r8 mi' la' sol' |
fad' fad' r4 r2 |
R1 |
r4 re'8. fad'16 mi'8. sol'16 fad'8. la'16 |
sol'8. si'16 la'8. do''16 si'8 [\melisma la'16 sol' ] fad'8 [ mi' ]|
re'1 ~|
re'2 ~ re'8 [ mi'16 re' ] do'8 [ si ] |
la4 \melismaEnd la r re'8 sol' |
fad'4 sol'8 si' la' la' r4 |
si'8. la'16 sol'4 r2 |
si'8. la'16 sol'4 r2 |
r8 sol' sol' sol' sol'4 r8 sol' |
sol' sol' si' si' sol' sol' r sol' |
sol'4. fad'8 sol'4 r |
R1*2 |
r2 sol'4 do'8 do' |
fa' fa' fa' fa' mi'16 [\melisma re' mi' fa' ] mi' [ fa' re' mi' ]|
do' [ si do' re' ] do' [ mi' re' mi' ] fa' [ mi' fa' sol' ] fa' [ sol' mi' fa' ]|
re' [ do' re' mi' ] re' [ fa' mi' fa' ] sol' [ fa' sol' la' ] sol' [ la' fa' sol' ]|
mi' [ re' mi' fad'! ] mi' [ sol' fad' sol' ] la' [ sol' la' si' ] la' [ si' la' sol' ]|
fad'4 \melismaEnd r r2 |
R1*3 |
r4 si8. re'16 do'8. mi'16 re'8. fa'16 |
mi'8. sol'16 fa'8. mi'16 re'8 re' sol' sol' |
sol'4 sol'8 sol' sol' sol' r4 |
sol'8. fa'16 mi'4 r2 |
sol'8. fa'16 mi'4 r2 |
r8 mi' mi' mi' sol'4 r8 sol' |
sol' sol' sol' sol' fad'4 re'8 [ sol' ]|
sol'4 fad' sol' r |
r2 sol'4 sol'8 sol' |
sol' sol' fad' fad' sol'16 [\melisma fad' sol' la' ] sol' [ la' fad' sol' ]|
mi' [ re' mi' fad' ] mi' [ sol' fad' sol' ] la' [ sol' la' si' ] la' [ si' sol' la' ]|
fad' [ mi' fad' sol' ] fad' [ la' sol' la' ] si' [ la' si' do'' ] si' [ do'' la' si' ]|
sol' [ fad' sol' la' ] sol' [ la' fad' sol' ] mi' [ re' mi' fad' ] mi' [ fad' sol' la' ]|
fad'4\melismaEnd la'8 la' sol'4 r |
r8 si' la' sol' fad' fad' r4 |
r re'8. fad'16 mi'8. sol'16 fad'8. la'16 |
sol'8. si'16 la'8. sol'16 fad'8. [ mi'16 ] re'4 |
r fad'8. fad'16 re'8. sol'16 fad'8. la'16 |
sol'8. sol'16 la'8. sol'16 fad'8 fad' sol' si' |
la'4 sol'8 si' la' la' r4 |
si'8. la'16 sol'4 r2 |
si'8. la'16 sol'4 r2 |
r8 sol' sol' sol' sol'4 r8 sol' |
sol' si' la' sol' fad' fad' r sol' |
fad'4. fad'8 sol'4 r8 sol' |
sol' sol' fad' sol' la' sol'4 sol'8 |
fad'4. re'8 re'2 |
R1*8 |

 }
      >> 
      \new Staff  <<
        
        { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "G_8" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vtenore" R1*11 |
r2 re'4 sol8 sol |
do' do' do' do' do' [ si ] r4 |
r2 r4 sol8 fad |
mi4 r r8 mi la sol |
fad fad r4 r si8 la |
sol4 r r8 sol do' si |
la la r4 r2 |
R1*7 |
r4 la8. dod'16 si8. re'16 dod'8. mi'16 |
re'8. fad'16 mi'8. sol'16 fad'8 [\melisma mi'16 re' ] dod'8 [ si ]|
la1 \melismaEnd |
la2 r |
R1 |
r2 r4 mi'8. sol'16 |
la4 re'8 fad' mi' mi' r4 |
fad'8. mi'16 re'4 r2 |
fad'8. mi'16 re'4 r2 |
r8 re' re' re' fad'4 r8 fad' |
sol' sol' re' re' fad' fad' r fad' |
mi'4 mi' fad' r |
r2 re'4 sol8 sol |
do' do' do' do' si16 [\melisma la si do' ] si [ do' la si ]|
sol [ fad sol la ] sol [ si la si ] do' [ si do' re' ] do' [ re' si do' ]|
la4 \melismaEnd r r2 |
R1*5 |
r4 fad'8 fad' sol'4 r |
r re'8 re' fad' fad' r4 |
sol'8. re'16 re'4 r2 |
sol'8. re'16 re'4 r2 |
r8 si si si re'4 r8 si |
si si re' re' mi' mi' r re' |
mi'4. do'8 re'4 sol8 sol |
do' do' do' do' do' [ si ] r4 |
R1*4 |
r2 r4 mi'8 re' |
do'4 r r8 si do' do' |
re' re' sol8. si16 la8. do'16 si8. re'16 |
do'8. mi'16 re'8. fa'16 mi' [ re' do'8 mi' ] fad' |
sol'4 sol r2 |
R1*2 |
r2 r4 re'8 re' |
mi'4 do'8 si do' do' r4 |
mi'8. re'16 do'4 r2 |
mi'8. re'16 do'4 r2 |
r8 do' do' do' mi'4 r8 mi' |
mi' mi' mi' mi' la4 si8 [ do' ]|
re'4. re'8 re'4 r |
r2 re'4 re'8 re' |
mi' mi' re' re' re'4 re'8 re' |
mi'4 r r8 mi' mi' mi' |
fad' fad' r4 r fad'8 fad' |
sol'4 r8 mi' do'4. re'8 |
re' re' re' fad' re'4 r |
r8 mi' mi' mi' la la r4 |
R1 |
r2 r4 fad8. la16 |
sol8. si16 la8. do'16 si8. re'16 do'8. mi'16 |
re'8. si16 mi'8. mi'16 fad'8 re' re' sol' |
fad'4 re'8 sol' fad' fad' r4 |
sol'8. re'16 re'4 r2 |
sol'8. re'16 re'4 r2 |
r8 si si si re'4 r8 re' |
mi' mi' mi' mi' la la r mi' |
la4. re'8 re'4 r8 re' |
mi' si do' mi' re' re'4 mi'8 |
re'4. do'8 si2 |
R1*8 |
 }
      >> 
      \new Staff  <<
        
        { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "bass" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vbasso" R1*18 |
r2 la4 re8 re |
sol sol sol sol fad16 [\melisma mi fad sol ] fad [ sol mi fad ]|
re [ dod re mi ] re [ fad mi fad ] sol [ fad sol la ] sol [ la fad sol ]|
mi [ re mi fad ] mi [ sol fad sol ] la [ sol la si ] la [ si sol la ]|
fad [ mi fad sol ] fad [ la sol la ] si [ la si dod' ] si [ dod' re' mi' ] |
dod'4 \melismaEnd mi'8 dod' la4 r |
r8 re' si sol mi mi r4 |
R1*4 |
r4 la,8. dod16 si,8. re16 dod8. mi16 |
re8. fad16 mi8. sol16 fad8. la16 sol8. si16 |
la4 fad8 re la la, r4 |
re'8. re16 re4 r2 |
re'8. re16 re4 r2 |
r8 re re re re'4 r8 re' |
si si sol sol re' re' r fad |
sol4 la re r |
R1*4 |
r4 si8 sol mi do' la fad |
re re r4 r2 |
R1 |
r4 re8. fad16 mi8. sol16 fad8. la16 |
sol8. si16 la8. do'16 si8 [\melisma do'16 si ] la8 [ sol ]|
fad4 \melismaEnd re r si8 sol |
re'4 si8 sol re' re r4 |
sol8. sol16 sol4 r2 |
sol8. sol16 sol4 r2 |
r8 sol sol sol si4 r8 sol |
sol sol sol sol do' do' r si |
la4. la8 sol4 r |
R1 |
r2 sol4 do8 do |
fa fa fa fa fa [ mi ] r4 |
r2 r4 do'8 si |
la4 r r8 la re' do' |
si si r4 r2 |
R1*5 |
r4 sol8. si16 la8. do'16 si8. re'16 |
do'8. mi16 la8. do'16 si8 sol si si |
do'4 mi8 sol do' do r4 |
do'8. do16 do4 r2 |
do'8. do16 do4 r2 |
r8 do do do do'4 r8 do' |
do' do' do' do' re4 sol |
re4. re8 sol4 sol8 sol |
do' do' do' do' do' [ si ] si si |
la la re re sol4 sol8 sol |
do'4 r r8 la la la |
re' re' r4 r si8 re |
mi4 r8 mi la4. sol8 |
re' re' fad re sol4 r |
r8 do do do re re r4 |
R1 |
r2 r4 re8. fad16 |
mi8. sol16 fad8. la16 sol8. si16 la8. do'16 |
si8. sol16 do'8. la16 re'8 re si sol |
re'4 si8 sol re' re r4 |
sol8. sol16 sol4 r2 |
sol8. sol16 sol4 r2 |
r8 sol sol sol si4 r8 si, |
do do do do re re r do |
re4. re8 sol4 r8 sol |
do' si la sol fad sol4 do8 |
re4. re8 sol,2 |
R1*8 |
 }
      >> 
    >>
    \new Staff << 
                  { \key sol \major
\time 4/4
\tempo "Andante allegro" \midiTempo #96
s1*99 \bar "|." } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" sol8 la si si, la, sol fad re |
sol la si si, la, sol fad re |
sol sol, si, sol, do4 r |
la, r re r |
si, r mi do8 la, |
re si, mi do re do re re, |
sol la \p si si, la, sol fad re |
sol4 r r8 sol si sol |
do'4 r r8 la, do la, |
re4 r r8 si, re si, |
mi4 r r8 mi la sol |
fad re re' do' si4 si,8 mi |
la, sol fad re sol sol, si, sol, |
la, sol fad re sol4 sol,8 si, |
do4 r la, r |
re r si, r |
mi r do r |
re r8 mi fad mi fad si |
mi4 r8 mi re4 fad,8 si, |
mi, re dod la, re4 r |
sol, r mi, r |
la, r fad, r |
si, r sol, r |
la,8 mi la sol fad mi fad re |
sol si, re si, sol, sol mi sol |
la4 fad sol mi |
fad dod re mi |
fad8 re la4 ~ la sol |
fad dod re mi |
dod la,8. dod16 si,8. re16 dod8. mi16 |
re8. fad16 mi8. sol16 fad8. la16 sol8. si16 |
la4 fad8 re la la, r4 |
re'8. re16 re4 r2 |
re'8. re16 re4 r2 |
r8 re re re re'4 r8 re' |
si si sol sol re' re r fad |
sol4 la re r8 fad \p |
mi re' dod' la re4 si,8 sol, |
la, sol fad re sol4 sol, |
do r la, r |
re si, mi8 do la, do |
re4 sol, do4. la,8 |
si, sol, re2 do4 |
si, fad sol8 sol, la,4 |
si,8 sol, re2 do4 |
si, fad, sol, do |
re re, sol, si8 sol |
re'4 si8 sol re' re r4 |
sol8. sol,16 sol,4 r2 |
sol8. sol,16 sol,4 r2 |
r8 sol sol sol si4 r8 sol |
sol sol sol sol do' do r si |
la4. la8 sol4 si,8 \p mi |
la, sol fad re sol la si si, |
la, sol fad re sol4 do8 do |
fa fa fa fa fa mi mi mi |
re4 r8 sol do4 r |
fa r re r |
sol r mi r |
la r la, r8 do |
re4 si, fad, sol, |
mi si, do la, |
sol, sol fa re |
mi si, do la, |
si, sol, la, si, |
do fa sol si |
do'8 do mi sol do' do r4 |
do'8. do16 do4 r2 |
do'8. do16 do4 r2 |
r8 do do do do'4 r8 do' |
do' do' do' do' re4 sol, |
re4. re8 sol,4 sol8 sol |
do' do' do' do' do' si si si |
la la re re sol4 sol8 sol |
do'4 r r8 la la la |
re' re r4 r si8 re mi4 r8 mi la4. sol8 |
re' re fad re sol sol, si, sol, |
do do do do re re si, sol, |
fad re sol4 do re |
sol, do re re8. fad16 |
mi8. sol16 fad8. la16 sol8. si16 la8. do'16 |
si8. sol16 do'8. la16 re'8 re si, sol, |
re re' si sol re' re r4 |
sol8. sol,16 sol,4 r2 |
sol8. sol,16 sol,4 r2 |
r8 sol sol sol si4 r8 si, |
do do do do re re r do |
re4. re8 sol4 r8 sol |
do' si la sol fad sol4 do8 |
re4 re, sol,2 |
sol8 la si si, la, la re' re |
sol sol, si, mi la, la re' re |
sol sol, si, sol, do si, do mi |
la, la si do' re'4 re |
r8 si do' re' mi'4 mi8 sol |
la si do' do re do re si, |
mi re mi la, re4 sol8 do re4 re, sol,2 |
 }
                   >>
  >>
  
  \midi { } }
