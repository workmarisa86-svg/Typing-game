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
                  { \key mi \minor
\midiTempo #120 \time 4/4 \tempo "Grave"
s1*11 \alternatives s1 s1 \bar "||"
\midiTempo #180 \tempo "Allegro moderato"
s1*85 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" mi'4. do''8 si'4. la'8 |
red''4. dod''16 si' sol''4. sol''8 |
sol''4. fad''8 fad''4. mi''8 |
red''4. fad''8 sol''4. si''8 |
mi''4. la'8 sol'4. fad'8 |
fad'4. la'8 re''4. re''8 |
re''4. mi''8 do''4. si'8 |
si'2 ~ si'8. si'16 si'8. si'16 |
mi''4. mi''8 fad''4. mi''16 fad'' |
sol''4. sol'8 fad'4 si' |
mi''4. si'8 la'4. si'8 |
si'2 ~ si'8. si16 dod'8. red'16 |
si'1 |
r4 si'' sol'' fad''8 mi'' |
fad''4 si' fad'' sold''-\trill |
la'' mi'' la''2 ~|
la''8 si'' sol'' la'' fad'' si'' la'' si'' |
sol''4 mi'' si''2 ~|
si''4 la''8 sol'' la''4 sol''8 fad'' |
sol''2 ~ sol''8 fad'' sol'' mi'' |
fad''4 si''2 lad''4 |
si''8 si' dod'' red'' mi'' mi' mi''4 ~|
mi'' re''8 do'' re''4 do''8 si' |
do''4. si'8 la' sol' fad' mi' |
red''4 mi''2 red''4 |
mi'' si' r2 |
R1 |
r2 r8 sol' la' si' |
do'' re'' si' do'' la' re'' do'' re'' |
si'4 sol' r2 |
R1 |
r4 re''' si'' la''8 sol'' |
la''4 re'' r2 |
r4 mi'' do'' si'8 la' |
si'4 mi' r2 |
r4 fad'' re'' dod''8 si' |
dod''4 fad' dod'' red'' |
mi'' si' mi''2 ~|
mi''8 fad'' re'' mi'' dod'' fad'' mi'' fad'' |
red'' sol'' fad'' sol'' red'' sol'' fad'' sol'' |
mi'' la'' sol'' la'' mi'' la'' sol'' la'' |
fad'' si'' la'' si'' fad'' si'' la'' si'' |
sol'' do''' si'' do''' sol'' do''' si'' do''' |
la'' re''' do''' re''' la'' re''' do''' re''' |
si''4 do'''8 si'' la'' sol'' fad'' mi'' |
re''4 mi''8 re'' do'' si' la' sol' |
fad'2 la' |
r4 re'' si' la'8 sol' |
la'4 re' r2 |
r4 re''' si'' la''8 sol'' |
la''4 re'' sol''2 ~|
sol''4 fa''8 mi'' fa''4 mi''8 re'' |
mi''4. re''8 mi'' fad'' sol'' la'' |
fad''4 sol''2 fad''4 |
sol''2 r8 do'' re'' mi'' |
fa'' sol'' mi'' fa'' re'' sol'' fa'' sol'' |
mi'' mi' fad' sold' la'2 ~|
la' sold' |
la'8 mi'' fad'' sold'' la''2 ~|
la'' sold'' |
la''8 mi'' re'' mi'' do'' mi'' re'' mi'' |
la' re'' do'' re'' fad' re'' do'' re'' |
si' re'' do'' re'' si' re'' do'' re'' |
sol' do'' si' do'' sol' do'' si' do'' |
la' do'' si' do'' la' do'' si' do'' |
fad' si' la' si' red' si' la' si' |
sol' si' la' si' mi' mi'' re'' mi'' |
dod'' fad'' mi'' fad'' dod'' fad'' mi'' fad'' |
red'' si' dod'' red'' mi'' fad'' sol'' la'' |
si''4 fad'' red'' dod''8 si' |
sol''2 mi'' ~|
mi''4 mi'' red'' dod''8 si' |
sol''4 sol' mi'2 ~|
mi'4 red' si'2 |
r4 fad'' red'' dod''8 si' |
sol''4 sol' sol''2 ~|
sol''4 fad''8 mi'' la''2 ~|
la''4 sol''8 fad'' si''2 |
r4 si'' sol'' fad''8 mi'' |
do'''4 do'' do'''2 ~|
do'''4 si''2 la''4 |
si'' fad'' sol'' mi'' ~|
mi''2 red'' |
mi''4 si' do''2 ~|
do'' si' ~|
si'8 do'' si' do'' la' fad'' mi'' fad'' |
red''4 si'' sol'' fad''8 mi'' |
fad''4 si' fad'' sold'' |
la'' mi'' la''2 ~|
la''8 si'' sol'' la'' fad'' si'' la'' si'' |
mi''2 ~ mi''8 mi'' re'' mi'' |
do'' mi'' re'' mi'' sold' mi'' re'' mi'' |
la' mi'' re'' mi'' si' mi'' re'' mi'' |
do'' re'' do'' si' la' sol' fad' mi' |
red''2 r4 si' |
mi''4. re''16 do'' si'4 la' |
sol'4. la'8 fad'4. mi'8 |
mi'1  } >>
    \new Staff << 
                  { \key mi \minor
\midiTempo #120 \time 4/4 \tempo "Grave"
s1*11 \alternatives s1 s1 \bar "||"
\midiTempo #180 \tempo "Allegro moderato"
s1*85 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" si4. la'8 sol'4. fad'8 |
fad'4. mi'8 si'4. si'8 |
dod''4. dod''8 dod''4. lad'8 |
fad'4. red'8 si4. re'8 |
mi'2 mi'4 dod' |
la4. fad'8 fad'4. fad'8 |
si'4. si'8 la'4 la' |
la'8. la'16 sol'8. fad'16 sol'4 fad' |
mi' do'' do''4. si'16 la' |
si'4. si8 si4. fad'8 |
sol'4. sol'8 mi'4. red'8 |
red'2 r |
red'1 |
R1*4 |
r4 mi'' re'' dod''8 si' |
dod''4 fad' dod'' red'' |
mi'' si' mi''2 ~|
mi''8 fad'' re'' mi'' dod'' fad'' mi'' fad'' |
red''4 fad' si' la'8 sol' |
la'4 fad'2 mi'4 |
mi' sold' la'8 si' do''4 |
si'4. do''8 la'4 fad' |
si' sol' ~ sol'8 mi' fad' sol' |
la' si' sol' la' fad' si' la' si' |
sol'4 mi'8 fad' sol'2 ~|
sol' fad' |
sol'4 re'' sol''2 ~|
sol'' fad'' |
sol'' sol' |
fad' re'' ~|
re''4 do'' mi' la' |
r2 mi'' |
dod'4 re' r2 |
r4 fad' fad' fad' |
si'4. la'8 sol' fad' mi' re' |
dod'4 si'2 lad'4 |
si' red'' r8 red'' red'' red'' |
mi''4 mi' r8 mi'' re'' mi'' |
la'4 fad' r8 fad'' mi'' fad'' |
sol''4 mi'' r8 mi'' re'' mi'' |
la' fad'' mi'' fad'' la' fad'' mi'' fad'' |
re''4 mi''8 re'' do'' si' la' do'' |
re'4 sol' la'2 |
r4 la' fad' mi'8 re' |
si'4 si r sol' |
fad' la'' fad'' mi''8 re'' |
si''4 si' r sol' |
fad'2 re''4 do''8 si' |
do''4 la' do'' sol' |
sol' sol' ~ sol'8 la' si' do'' |
la'4 re'' do'' la' |
re'8 sol' la' si' do''2 ~|
do'' si' |
do''4 r r8 la' si' do'' |
re'' mi'' do'' re'' si' mi'' re'' mi'' |
do''4. si'8 la' mi'' re'' do'' |
si'2. si'4 |
mi'' la' mi' la' |
la' la' la la' |
sol' re' re' fad' |
sol'2 do' |
r4 la' la' fad' |
si2 fad' |
mi'4 red' mi' si' |
mi' la' dod'' fad' |
fad'8 red' mi' fad' sol' la' si' do'' |
si'4 red'' si' fad' |
r si'' sol'' fad''8 mi'' |
fad''4 si' r2 |
r4 si' sol' fad'8 mi' |
fad'2 mi' |
la'2. la'4 |
sol' red' si' la'8 sol' |
mi''2. mi'4 |
fad'2. mi'8 re' |
sol'2 si'4 mi'' ~|
mi'' do'' la' mi'' |
fad''2 mi'' |
red'' si'8 sol' la' si' |
do''4 si' la' fad' |
si'8 sol' fad' sol' mi' la' sol' la' |
fad' la' sol' la' re' sol' fad' sol' |
mi'2 ~ mi'8 la' sol' la' |
si'2 r |
r4 si' si' si' |
mi''4. re''8 do'' si' la' sol' |
fad'4 mi''2 red''4 |
mi''8 la' sold' la' si'4 si' |
mi'8 do'' si' do'' re'4 sold' |
la'8 do'' si' do'' mi'4 si' |
mi' mi' la' do'' |
fad'2 r4 red' |
si'2 mi'4 mi' |
mi'2 red' |
mi'1 |
 } >>
    \new Staff << 
                  { \key mi \minor
\midiTempo #120 \time 4/4 \tempo "Grave"
s1*11 \alternatives s1 s1 \bar "||"
\midiTempo #180 \tempo "Allegro moderato"
s1*85 \bar "|."
 } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" sol4. la8 si4. si8 |
si4. si'8 si'4. sol'8 |
mi'4. fad'8 fad'4. dod''8 |
si'4. si'8 re'4. sol'8 |
sol'2 la4 mi' |
re'2 re'4. re'8 |
mi'2 mi'4 fad' |
fad'8. fad'16 mi'8. red'16 mi'4 si |
sol' la' la do' |
mi'4. mi'8 fad'4. si8 |
si4 la8 sol la4. fad'8 |
fad'2 r |
fad'1 |
R1*8 |
r4 si' si si' |
la' si' la' mi' |
mi'4. re'8 do' si la4 |
fad' mi' fad'4. si8 |
sol4 mi mi'2 ~|
mi' red' |
mi'4 sol'8 fad' sol'2 ~|
sol' fad' |
sol'4 si'8 la' si' si do' re' |
mi' fad' re' mi' do'4 la' |
re' si' re'' sol' |
re''2 la'4 sol'8 fad' |
mi'2 la |
r si' |
lad'4 si' r2 |
r4 mi' dod' si8 lad |
si4 si'2 mi'4 |
fad' fad'2 fad'4 |
fad' si r8 si' si' si' |
mi'2 r8 dod'' si' dod'' |
fad'4 si r8 red' dod' red' |
si4 mi' r sol' |
re'' la' re'' re' |
sol'2 mi'4 fad' |
sol' sol' do' mi' |
la2 re' |
r4 sol' re' re' |
re' fad' la' sol'8 fad' |
sol'2 re' |
r4 la' sol' re' |
do' re' do' re' |
do' si do'2 |
re'4 re' la' re'' |
re'' re' sol' do'' |
la' sol' sol' sol' |
do' si mi' mi' |
re' mi' mi' mi' |
la' mi' mi' la' |
si' mi' re' si' |
la' mi' la' mi' |
fad' re' re' re' |
re' sol' sol' re' |
si mi' mi'2 |
r4 re' re' fad' |
fad'2. red'4 |
si fad' si mi' |
mi' fad' fad' lad' |
fad' si si mi' |
fad' si' fad' red' |
si'2 si |
si' fad'4 red' |
si2 si ~|
si4 si si la8 sol |
fad2 si |
mi'4 red' mi'2 ~|
mi'4 sol' la'2 ~|
la'4 la' si'2 ~|
si'4 sol' mi' sol' |
la' mi' mi' la' |
la' si' do'' mi' |
fad'2 mi' |
fad'4 sol' la' si' |
si mi' ~ mi'8 do' si do' |
la4 re' ~ re'8 si la si |
sol4 sol' la'4. la'8 |
fad'2 r |
r4 sol' fad' mi' |
mi' la' mi' fad' |
si si fad' fad' |
la' mi' mi' mi' |
la'2 re' |
mi' mi' |
la'4 la' mi' mi' |
si'2 r4 fad' |
mi'2 mi'4 do' si2. la4 |
sol1 |
 } >>
    \new Staff << { \key mi \minor
\midiTempo #120 \time 4/4 \tempo "Grave"
s1*11 \alternatives s1 s1 \bar "||"
\midiTempo #180 \tempo "Allegro moderato"
s1*85 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" mi2 r |
si,4. sol8 fad4. mi8 |
lad4. lad8 lad4. fad8 |
si4. si,8 si,4. sol,8 |
do2 dod4 la, |
re2 si,4. si8 |
sold2 la4 fad |
red4. si,8 mi4 re |
do la, la4. sol16 fad |
mi4. mi8 re4. re8 |
do4. do8 do4. si,8 |
si,4. la8 sol4 fad |
si,1 |
R1*8 |
r4 si sol fad8 mi |
fad4 si, fad sold |
la mi la2 ~|
la8 si sol la fad si la si |
sol4 mi mi'2 ~|
mi' red' |
mi' r |
R1 |
r2 r8 sol la si |
do' re' si do' la re' do' re' |
si4 sol r2 |
r4 sol fad mi8 re |
mi4 la, r2 |
r4 la sol fad8 mi |
fad4 si, r2 |
r4 si la sol8 fad |
sol4. fad8 mi re dod si, |
lad,4 si, fad fad, |
si, si2 si,4 |
do2 dod |
re red |
mi r4 mi |
fad2 r4 fad |
sol2 la |
si4 do'8 si la sol fad mi |
re1 ~|
re ~|
re ~|
re ~|
re4 re' si la8 sol |
la4 re la si |
do' sol do'2 ~|
do'8 re' si do' la re' do' re' |
si4 sol mi re8 do |
re4 sol, r2 |
r4 mi do si,8 la, |
si,4 mi, r2 |
r4 mi' do' si8 la |
re' mi' do' re' si mi' re' mi' |
do'4 do la, do |
fad, fad re fad |
sol sol, sol fad |
mi2 mi, |
fad, fad |
red si, |
mi4 fad sol sold |
la2 lad |
si4 la sol fad8 mi |
red4 si, si2 |
si,1 ~|
si, ~|
si, ~|
si,4 si sol fad8 mi |
fad4 si, si2 ~|
si4 si sol fad8 mi |
do'2. si8 la |
re'2. do'8 si |
mi'2 r |
r4 mi' do' si8 la |
re'2 do' |
si r8 mi fad sol |
la si sol la fad si la si |
sol4 mi la2 |
re4 fad sol sol, |
do2 do' |
si r |
r4 mi' re' do'8 si |
do'4. si8 la sol fad mi |
red4 mi si si, |
do mi sold,2 |
la, si, |
do sold, |
la, do |
si, r4 la, |
sol,2. la,4 |
si,1 |
mi, |
 }
                  
                  { s1*13  }
                   >>
  >>
  
  \midi { } }
