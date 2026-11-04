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
      \new Staff << { s1*23  }
                    
                    { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "trumpet" \set Staff.instrumentName = "tromba12" <<
  << { s4 fad''2 la''4 |
re'''4. re'''8 la''2 |
sol''4 fad'' mi''2 |
s4 mi'' mi''4. mi''8 |
re''4. re''8 re''4. mi''8 |
fad''4 fad''2 mi''4 |
fad''2 s8 fad'' fad'' fad'' |
re'' re'' s re'' mi'' mi'' s mi'' |
fad'' fad'' s fad'' sol''4 s8 sol'' |
fad'' fad'' s la'' sold'' sold'' s si'' |
la''4 mi'' s2 |
s1*7 |
s2 s8 la'' la'' la'' |
sol'' sol'' s sol'' fad'' fad'' s fad'' |
re'' re'' s sol'' mi''4 s8 la'' |
la'' sol'' s sol'' sol'' sol'' s sol'' |
fad''4 fad'' s2 |
s1*29 |
s1*2 |
s2. fad'8 fad'16 fad' |
la'8 fad' s4 re''8 la' s4 |
fad''8 re'' s fad'' la'' fad''16 fad'' re''8 sol'' |
fad''4 r8 la'' si''16 la'' sol'' fad'' mi''8 la'' |
re'' mi''16 fad'' sol''8 mi'' fad''8. mi''16 re''8 sol''16 fad'' |
mi''4 re'' ~ re''8 mi''16 fad'' sol''8 sol'' |
sol'' fad''16 mi'' fad''4 s2 |
s1 |
s2 s4 s8 la'' |
la''16 sol'' fad'' mi'' re''8 re'' mi'' mi'' s mi'' |
fad'' fad'' s fad'' sol'' sol'' s mi'' |
la'' la'' r la'' si'' si'' r la'' |
la'' mi''16 mi'' mi''8 la'' la''4 sol''8 mi'' |
fad''4 mi''8. re''16 re''4 s8 mi'' |
fad''2 la''4 la'' |
la''2 sold'' |
la''1 |
 } \\ { s4 re''2 mi''4 |
fad''4. fad''8 re''2 |
mi''4 la' la'2 |
s4 mi'' fad'4. fad'8 |
fad'4. fad'8 fad'4 fad' |
fad' fad' re' mi'' |
fad'2 s8 fad' fad' fad' |
fad' fad' s fad' la' la' s la' |
la' la' s re'' mi''4 s8 mi'' |
re'' re'' s re'' mi'' mi'' s mi'' |
mi''4 la' s2 |
s1*7 |
s2 s8 fad'' fad'' fad'' |
mi'' mi'' s mi'' re'' re'' s re'' |
re' re' s re' la'4 s8 mi'' |
re'' re'' s re'' mi'' mi'' s mi'' |
re''4 re'' s2 |
s1*29 |
s1*2 |
s2. re'8 re'16 re' |
fad'8 re' s4 la'8 fad' s4 |
re''8 la' s re'' fad'' re''16 re'' re'8 re'' |
re''4 r r r8 la' |
fad'4 r8 la' la' fad' r re' |
la'4 r8 fad' re' re' re'' re'' |
la' re' re''4 s2 |
s1 |
s2 s4 s8 la' |
re'' re'' r4 r s8 la' |
la' la' s re'' re'' mi'' s la' |
mi'' mi'' fad'' fad'' re'' re'' mi'' mi'' |
mi'' la'16 la' la'8 mi'' fad''4 re''8 mi'' |
re''4 la'8. la'16 fad'4 s8 la' |
la'2 mi''4 mi'' |
re''1 |
mi'' |
 } >>
  { r4 s2. |
s1*2 |
r4 s2. |
s1*2 |
s2 r8 s4. |
s4 r8 s4. r8 s |
s4 r8 s4. r8 s |
s4 r8 s4. r8 s |
s2 r2 |
R1*7 |
r2 r8 s4. |
s4 r8 s4. r8 s |
s4 r8 s4. r8 s |
s4 r8 s4. r8 s |
s2 r2 |
R1*29 |
r2 r4 la8 la16 la |
re'8 re' re' re' re' re' re' re' |
re' la16 la la8 la re' re'16 re' s4 |
s r4 s r4 |
s r8 s s2 |
s1*3 |
s2 r2 |
R1 |
r2 r4 r8 s |
s2. r8 s |
s4 r8 s4. r8 s |
s1*2 |
s2. r8 s |
s1*3 |
 }
>> } >>
      \new Staff << 
                    { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "timpani" \set Staff.instrumentName = "tympani" R1*7 |
re8 re r re la, la, r la, |
re re r re la,4 r8 la, |
re re r la, re re r re |
la,4 la, r2 |
R1*7 |
r2 r8 re re re |
la, la, r la, re re r re |
re re r re la,4 r8 la, |
re re r re la, la, r la, |
re4 re r2 |
R1*29 |
r2 r4 la,8 la,16 la, |
re8 re re re re re re re |
re la,16 la, la,8 la, re4 r |
re8 re r4 re8 re r4 |
re8 re r re re re16 re re8 re |
re4 r r r8 la, |
re4 r8 la, re4 r8 re |
la,4 r8 re re re re re |
re4 re r2 |
R1 |
r2 r4 r8 re |
re re r4 r r8 la, |
la, re r re re la, r la, |
la, la, re re re re r la, |
la, la,16 la, la,8 la, re4 re8 re |
la,4 la,8. la,16 re4 r8 la, |
re2 la,4 la, |
re2. re4 |
la,1 |
 } >>
      \new StaffGroup <<
        \new Staff << 
                      { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" r4 fad''2 la''4 |
re'''4. re'''8 la''2 |
sol''4 fad'' mi''2 |
r4 mi'' lad''4. lad''8 |
si''4. si''8 si''4 re''' |
dod'''4. re'''8 si''4. si''8 |
lad''2 r8 dod''' dod''' dod''' |
re''' re'''16 dod''' si'' la'' sol'' fad'' mi''8 mi''16 re'' dod'' si' la' sol' |
fad'8 fad''16 mi'' re'' dod'' si' la' sol'8 sol''16 fad'' mi'' re'' dod'' si' |
la'8 la''16 sol'' fad'' mi'' re'' dod'' si'8 si''16 la'' sold'' fad'' mi'' re'' |
dod''8 si'16 la' sold' fad' mi' re' dod'4 r |
r dod'''2 si''4 |
la''4. la''8 mi''2 |
re''4 dod'' si'2 |
r4 si'' si''4. si''8 |
la''4. la''8 la''4 dod''' |
re'''2 r4 fad'' |
fad''2 mid''4. mid''8 |
fad''2 r8 fad'' fad'' fad'' |
sol'' sol''16 fad'' mi'' re'' dod'' si' la'8 la''16 sol'' fad'' mi'' re'' dod'' |
si'8 si''16 la'' sol'' fad'' mi'' re'' dod''8 dod'''16 si'' la'' sol'' fad'' mi'' |
re''8 re'''16 dod''' si'' la'' sol'' fad'' mi''8 mi'''16 re''' dod''' si'' la'' sol'' |
fad''8 mi''16 re'' dod'' si' la' sol' fad'4 r |
R1*4 |
r4 la'8 si'16 dod'' re''8 re'' re'' re'' |
re'' re'' re'' re'' re'' dod''16 si' la'8 sol' |
fad'4 r8 la' si'16 la' sol' fad' mi'8 la' |
re' re''4 dod''8 fad' si' mi' la' |
re''4 re''8 re'' re'' mi''16 re'' dod''8 si' |
dod'' mi'' fad'' mi''16 re'' mi''8 dod''16 re'' mi''8 re''16 dod'' |
si'8 si' r4 mi'8 fad'16 sold' la' si' dod'' re'' |
mi'' la' si' dod'' re'' mi'' fad'' sold'' la''8 mi'' sold' fad'16 mi' |
la'8 sold'16 fad' mi' re' dod' si la8 la r4 |
r2 r4 r8 mi'' |
fad''16 mi'' re'' dod'' si'8 mi'' la' re''4 dod''8 |
si' si''16 la'' sold'' fad'' mi'' re'' dod''4 r |
r2 r4 la''8 si''16 dod''' |
re'''8 re''' re''' re''' re''' dod'''16 si'' la''8 sol'' |
fad''4 r r la' ~|
la'8 sol'16 fad' mi'8 re' ~ re' mi'16 re' dod'8 dod' |
re'4 r r2 |
r r4 r8 la'' |
si''16 la'' sol'' fad'' mi''8 la'' re'' re'''4 dod'''8 |
re'''16 dod''' si'' la'' sold''8 mi'' ~ mi'' re''16 dod'' re''4 ~|
re''8 dod''16 si' dod''8 re''16 dod'' si'8 la'' sold''8. sold''16 |
la'' mi'' la'' dod''' mi'' dod'' la' dod''' dod''' la'' fad'' dod''' si'' si' fad'' lad'' |
si'' fad'' re'' si'' si'' fad'' si' si'' si'' sold'' dod'' si'' la'' dod'' fad'' si'' |
sold'' dod'' sold' sold'' sold'' dod'' si' sold'' fad'' fad' la' dod'' fad''8 sol''16 la'' |
si'' sol'' si'' re''' si'' sol'' si'' re''' mi'' dod'' mi'' la'' mi'' dod'' mi'' la'' |
re'' fad'' la'' re''' dod''' mi'' la'' re''' dod''' la' dod'' mi'' la8 si16 dod' |
re'8 re' re' re' si'16 sol' si' re'' si' sol' si' re'' |
la' fad' la' re'' dod'' la' dod'' mi'' re'' la' fad' la' la' fad' re' re'' |
re'' la' fad' la' re'' la' fad' la' fad'' re'' la' re'' fad'' re'' la' la'' |
la'' fad'' re'' la'' la'' fad'' re'' re''' re''' la'' fad'' la'' si'' sol'' si'' re''' |
re''' la'' fad'' la'' re''8 la'' si''16 la'' sol'' fad'' mi''8 la'' |
re'' re'''4 dod'''8 re''' la'' si'' dod'''16 re''' |
dod'''4 re'''8 re'' ~ re'' mi''16 fad'' sol''8 sol'' ~|
sol'' fad''16 mi'' fad''8 la' si'16 la' sol' fad' mi'8 la' |
la'16 sol' fad' mi' re'8 sol'' sol''16 fad'' mi'' re'' dod''8 fad'' |
fad''16 mi'' re'' dod'' si'8 mi'' mi''16 re'' dod'' si' la'8 la' |
re'' re'' r si' mi'' mi'' r dod'' |
fad'' fad'' r re'' sol'' sol'' r mi'' |
la'' la'' r la'' si''16 la'' sol'' fad'' mi'' re'' dod'' si' |
la'8 la'' r la'' la''4 si''8 re''' |
re'''4 dod''' re''' r8 mi'' |
fad''2 la''4 la'' |
la''2 sold'' |
la''1 |
 } >>
        \new Staff << 
                      { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" r4 re''2 mi''4 |
fad''4. fad''8 re''2 |
dod''4 re'' dod''2 |
r4 dod'' dod''4. dod''8 |
re''4. re''8 re''4. mi''8 |
fad''4 fad''2 mi''4 |
fad''2 r8 lad'' lad'' lad'' |
fad'' fad''16 mi'' re'' dod'' si' re'' dod''8 dod''16 si' la' sol' fad' mi' |
re'8 re''16 dod'' si' la' sol' fad' mi'8 mi''16 re'' dod'' si' la' sol' |
fad'8 fad''16 mi'' re'' dod'' si' la' sold'8 sold''16 fad'' mi'' re'' dod'' si' |
la'8 sold'16 fad' mi' re' dod' si la4 r |
r mi''2 mi''4 |
fad''4. dod''8 la'2 |
sold'4 la' sold'2 |
r4 sold'' mid''4. mid''8 |
dod''4. dod''8 dod''4 la'' |
fad''2 r4 la' |
sold'2 sold'4. sold'8 |
la'2 r8 re'' re'' re'' |
dod'' mi''16 re'' dod'' si' la' sol' fad'8 fad''16 mi'' re'' dod'' si' la' |
sol'8 sol''16 fad'' mi'' re'' dod'' si' la'8 la''16 sol'' fad'' mi'' re'' dod'' |
si'8 si''16 la'' sol'' fad'' mi'' re'' dod''8 dod'''16 si'' la'' sol'' fad'' mi'' |
re''8 dod''16 si' la' sol' fad' mi' re'4 r |
R1*4 |
r4 la'8 si'16 dod'' re''8 re'' re'' re'' |
re'' re'' re'' re'' re'' dod''16 si' la'8 sol' |
fad'4 r r2 |
R1 |
r2 mi''4. fad''16 sold'' |
la''8 la'' la'' la'' la'' la'' la'' la'' |
la'' sold''16 fad'' mi''8 re'' dod''4 r |
r8 mi'' fad'' mi''16 re'' dod''8 si' r si' |
mi' la' r4 r r8 mi' |
fad'16 mi' re' dod' si8 mi' la la'4 sold'8 |
fad' fad' sold'8. sold'16 la'8 sold'16 fad' mi'8 mi'' |
fad''16 mi'' re'' dod'' si'8 mi'' mi''4 r |
r re''8 fad''16 sol'' la''8 la'' la'' la'' |
la'' sol''16 fad'' mi''8 re'' mi''4 la'' ~|
la''8 sol''16 fad'' mi''8 re'' mi''4 r |
r r8 la' si'16 la' sol' fad' mi'8 la' |
re' mi'16 fad' sol'8 fad'16 mi' fad'8 sol'16 la' si'8 la'16 sol' |
la'8 sol'16 fad' sol' fad' sol' mi' fad'4 r |
r2 r4 r8 mi'' |
fad''16 mi'' re'' dod'' si'4 r la'8 dod''16 re'' |
mi''8 mi'' mi'' mi'' mi'' mi'' mi''8. re''16 |
dod'' la' dod'' mi'' la'' mi'' dod'' la' fad' fad'' la'' fad'' re'' fad'' re'' dod'' |
si' re'' fad'' re'' si' re'' sold'' re'' dod'' mid'' sold'' mid'' dod'' fad'' la'' fad'' |
fad''8 fad'' mid'' mid'' fad''16 la' dod'' fad'' la''8 re'' |
re''16 si' re'' si'' sol'' re'' sol'' si'' dod'' la' dod'' mi'' dod'' la' dod'' mi'' |
la'' re'' fad'' la'' sol''8 fad'' mi''16 dod'' la' dod'' la8 si16 dod' |
re'8 re' re' re' sol'16 re' sol' si' sol' re' sol' si' |
fad' re' la' si' mi' dod' mi' la' la' fad' re' re'' re'' la' fad' fad'' |
fad'' re'' la' re'' fad'' re'' la' re'' la'' fad'' re'' fad'' la'' fad'' re'' fad'' |
fad'' re'' la' fad'' fad'' re'' la' fad'' fad'' re'' la' fad'' sol'' re'' sol'' si'' |
la'' fad'' re'' fad'' re'4 r2 |
r4 r8 mi'' fad''16 mi'' re'' dod'' si'8 mi'' |
la'16 mi'' fad'' sol'' la''8 la' la' sol' sol' si' |
la'4 r8 fad' sol'16 fad' mi' re' dod'8 dod'' |
re'' re'' r re'' dod'' dod'' r dod'' |
si' si' r dod'' la' la' r re' |
la'16 sol' fad' mi' re'8 re' sol' sol' r mi' |
la' la' r fad' si' si' r la' |
mi'' mi'' r fad'' fad'' si' si' mi'' |
mi''16 re'' dod'' si' la'8 mi'' fad''4 sol''8 mi'' |
fad''4 mi'' fad'' r8 dod'' |
la'2 mi''4 mi'' |
re''1 |
dod'' |
 } >>
        \new Staff << 
                      { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" r4 la'2 la'4 |
fad'4. fad'8 fad'2 |
sol'4 la' la'2 |
r4 la'8 mi' mi'4. mi'8 |
re'4. fad'8 fad'4 fad' |
fad' dod' re' si8 si' |
dod''2 r8 fad' fad' fad' |
fad' fad' r fad' la' la' r la' |
la' la' r re'' dod''4 r8 dod'' |
re'' re' r re' mi' mi' r mi' |
mi' mi' mi' mi' mi'4 r |
r la'2 si'4 |
dod''4. fad'8 mi'2 |
si'4 mi' mi'2 |
r4 mi' sold'4. sold'8 |
la'4. fad'8 fad'4 fad' |
re'2 r4 dod' |
dod'2 dod'4. dod'8 |
dod'2 r8 la' la' la' |
sol' sol' r dod'' re'' re' r re' |
re' re' r sol' mi'4 r8 la' |
la' sol' r sol' la' la' r la' |
la' la' la' la' la'4 r |
R1*4 |
r4 la'8 si'16 dod'' re''8 re'' re'' re'' |
re'' re'' re'' re'' re'' dod''16 si' la'8 sol' |
fad'4 r r r8 la |
si16 la sol fad mi8 la re re'4 dod'8 |
fad si sold8. sold16 la4 r |
r8 dod' re' dod'16 si dod'8 la16 si dod'8 si16 la |
mi'8 mi' r4 r8 mi' fad' mi'16 re' |
dod'8 la r la mi'16 fad' sold' la' si'8 sold' |
mi'4 r r r8 mi' |
fad'16 mi' re' dod' si8 mi' la16 si dod' re' mi'8 mi' |
la' si'16 la' sold' fad' mi' re' dod'8 re' la' la' |
la' fad' sold' sold' la'4 r |
R1 |
r2 r4 la8 si16 dod' |
re'8 re' re' re' re' dod'16 si la8 sol |
fad4 r8 fad sol4 la |
fad'8 mi'16 re' mi'8 re'16 dod' re'4 r |
R1*2 |
r4 r8 sold' la'16 sold' fad' mi' re'8 dod' |
si4 la8 la' la' sold'16 fad' mi'8 mi' |
mi'4 dod''8 dod'' la' la' fad' fad' |
re' re' re' re' sold' sold' fad' dod' |
dod' dod' dod' dod' la' fad' re' mi'16 fad' |
sol'8 sol' sol' sol' sol' sol' sol' sol' |
fad' fad' mi' re' la4 la8 si16 dod' |
re'8 re' re' re' re' re' re' re' |
re' dod'16 si la8 sol fad4 r |
la'8 re' r4 re''8 fad' r4 |
re''8 fad' r4 la'8 re'16 re' re'8 re' |
fad'4 r r r8 dod' |
re' mi'16 fad' sol'8 la'16 sol' la' sol' fad' mi' re'8 sol'16 fad' |
mi'4 r8 fad' fad' re' re' re' |
re'4 r8 re' sol' sol' la'16 sol' fad' mi' |
re'8 re' r si' la' la' r la' |
sol' sol' r sol' fad' fad' r fad' |
re' la r si si16 la sol fad mi8 dod' |
dod'16 si la sol fad8 re' re'16 dod' si la sol8 mi' |
mi'16 re' dod' si la8 fad' fad'16 mi' re' dod' si la sol fad |
mi8 la16 si dod' re' mi' dod' la'4 re'8 si' |
la'4 la' la' r8 la' |
fad'2 mi'4 la' |
si'1 |
mi' |
 } >>
      >>
    >>
    \new ChoirStaff <<
      \new Staff  <<
        
        { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vcanto" r4 re''2 la'4 |
re''4. re''8 la'2 |
dod''4 re'' dod''2 |
r4 dod'' dod''4. dod''8 |
re''4. re''8 re''4. mi''8 |
fad''4 fad''2 mi''4 |
fad''2 r8 dod'' dod'' dod'' |
re'' re'' r re'' mi'' mi'' r mi'' |
fad'' fad'' r re'' dod''4 r8 dod'' |
re'' re'' r re'' si' si' r mi'' |
dod''4 dod'' r2 |
r4 dod''2 si'4 |
la'4. la'8 mi''2 |
re''4 dod'' si'2 |
r4 si' si'4. si'8 |
la'4. la'8 la'4 dod'' |
re''2 r4 dod'' |
dod''2 dod''4. sold'8 |
la'2 r8 re'' re'' re'' |
dod'' dod'' r dod'' re'' re'' r re'' |
si' si' r mi'' dod''4 r8 dod'' |
re'' re'' r re'' la' la' r la' |
fad''4 re'' r2 |
R1*4 |
r4 la'8 si'16 dod'' re''8 re'' re'' re'' |
re'' re'' re'' re'' re'' dod''16 [ si' ] la'8 sol' |
fad'4 r8 la' si'16 [ la' ] sol' fad' mi'8 la' |
re' \melisma re''4 dod''8 fad' [ si' mi' ]\melismaEnd la' |
re''4 re''8 re'' re'' [\melisma mi''16 re'' ] dod''8 [ si' | dod'' ]\melismaEnd
mi'' fad'' mi''16 re'' mi''8 dod''16 re'' mi''8 re''16 dod'' |
si'8 si' r4 mi'8 [\melisma fad'16 sold' ] la' [ si' dod'' re'' ]|
mi'' [ la' si' dod'' ] re'' [ mi'' fad'' sold'' la''8 ]\melismaEnd mi'' r4 |
R1 |
r2 r4 r8 mi'' |
fad''16 [ mi'' ] re'' dod'' si'8 mi'' la' ( re''4 ) dod''8 |
si'4 si'8 si' dod''4 r |
r2 r4 la'8 si'16 dod'' |
re''8 re'' re'' re'' re'' dod''16 [ si' ] la'8 sol' |
fad'4 r r la' ~|
la'8 sol'16 fad' mi'8 re' re''4 r |
R1 |
r2 r4 r8 la' |
si'16 [ la' ] sol' fad' mi'8 la' re' ( re''4 ) dod''8 |
re''16 [ dod'' ] si' la' sold'8 mi'' mi'' [ \melisma re''16 dod'' ] re''4 ~|
re''8 \melismaEnd dod''16 [ si' ] dod''8 re''16 dod'' si'2 |
la'4 dod'' ~ dod'' si'8 [ lad' ]|
si'4. si'8 si'4 la'8. [ si'16 ]|
sold'2 la'4 re''8 re''16 re'' |
re''8 si' si' re'' dod'' mi'' dod'' si'16 [ la' ]|
re''8 re'' dod'' re'' dod''4 r |
R1*2 |
re''8 la' r4 re''8 la' r4 |
re''8 la' r re'' re'' re''16 re'' re''8 re'' |
re''4 r8 la' si'16 [ la' ] sol' fad' mi'8 la' |
re'\melisma re''4 dod''8 ( re'' )\melismaEnd la' si' dod''16 [ re'' ] |
dod''4 re'' re''8 [ mi''16 fad'' ] sol''8 sol'' |
sol'' [\melisma fad''16 mi'' ] fad''4 \melismaEnd r2 |
r4 r8 sol'' sol''16 [ fad'' mi'' re'' ] dod''8 fad'' |
fad''16 [ mi'' re'' dod'' ] si'8 mi'' mi''16 [ re'' dod'' si' ] la'8 la' |
re'' re'' r si' mi'' mi'' r dod'' |
fad'' fad'' r re'' sol'' sol'' r mi'' |
mi'' mi'' r re'' re'' re'' r mi'' |
mi''16 [ re'' dod'' si' ] la'8 mi'' fad''4 sol''8 mi'' |
fad''4 \melisma mi''8. [ re''16 ]\melismaEnd re''4 r8 dod'' |
re''2 mi''4 mi'' |
re''1 |
dod'' |
 }
      >> 
      \new Staff  <<
        
        { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "treble" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "valto" r4 la'2 la'4 |
fad'4. fad'8 la'2 |
sol'4 fad' mi'2 |
r4 la' lad'4. lad'8 |
si'4. fad'8 fad'4 fad' |
fad'2 si'4. si'8 |
lad'2 r8 fad' fad' fad' |
fad' fad' r fad' la' la' r la' |
la' la' r la' sol'4 r8 sol' |
fad' fad' r fad' mi' mi' r mi' |
mi'4 mi' r2 |
r4 la'2 mi'4 |
fad'4. fad'8 la'2 |
sold'4 la' sold'2 |
r4 sold' mid'4. mid'8 |
fad'4. fad'8 fad'4 la' |
fad'2 r4 la' |
sold'2 sold'4. mid'8 |
fad'2 r8 la' la' la' |
sol' sol' r sol' la' la' r la' |
sol' sol' r si' la'4 r8 la' |
la' sol' r sol' la' la' r la' |
la'4 la' r2 |
R1*8 |
r2 mi'4. fad'16 sold' |
la'8 la' la' la' la' la' la' la' |
la' sold'16 [ fad' ] mi'8 re' dod'4 r |
r8 mi' fad' mi'16 re' dod'8 si r si |
mi' la r4 r r8 mi' |
fad'16 [ mi' ] re' dod' si8 mi' la \melisma la'4 sold'8 |
fad' \melismaEnd fad' sold'8. sold'16 la'8 [ sold'16 fad' mi'8 ] la' |
la'4 sold'8 sold' la'4 r |
r re'8 fad'16 sol' la'8 la' la' la' |
la' sol'16 [ fad' ] mi'8 re' mi'4 la' ~|
la'8 sol'16 fad' mi'8 re' mi'4 r |
r r8 la' si'16 [ la' ] sol' fad' mi'8 la' |
re' [\melisma mi'16 fad' ] sol'8 [ fad'16 mi' ] fad'8 [ sol'16 la' ] si'8 [ la'16 sol' ]|
la'8 [ sol'16 fad' ] sol' [ fad' sol' mi' ] fad'4 \melismaEnd r |
r2 r4 r8 mi' |
fad'16 [ mi' ] re' dod' si8 sold' la'4. la8 |
si4 la8 la' la'4 ( sold' )|
la' la' ~ la' fad' |
fad'4. sold'8 sold'4 fad' ~|
fad' mid' fad' fad'8 sol'16 la' |
si'8 sol' sol' si' la' la' la' la' |
la' la' sol' fad' mi'4 la8 si16 dod' |
re'8 re' re' re' re' re' re' re' |
re' dod'16 [ si ] la8 sol fad4 r |
la'8 fad' r4 la'8 fad' r4 |
la'8 fad' r la' la' la'16 la' sol'8 si' |
la'4 r8 la' si'16 [ la' ] sol' fad' mi'8 la' |
re' [\melisma mi'16 fad' ] sol'8 [ la'16 sol' ] la' [ sol' fad' mi' ] re'8 [ sol'16 fad' ]|
mi'8 [ fad'16 sol' la'8 ]\melismaEnd la' la'4 sol'8 sol' |
la'4 r8 la' si'16 [ la' sol' fad' ] mi'8 la' |
la'16 [ sol' fad' mi' ] re'8 si' la' la' r la' |
sol' sol' r sol' fad' fad' r fad' |
la'16 [ sol' fad' mi' ] re'8 re' sol' sol' r mi' |
la' la' r fad' si' si' r la' |
la' la' r la' si'16 [\melisma la' sol' fad' ] mi' [ re' dod' si | la8 ]\melismaEnd
la r la' la'4 sol'8 si' |
la'2 la'4 r8 la' |
la'2 la'4 la' |
la'2 ( sold' )|
la'1 |
 }
      >> 
      \new Staff  <<
        
        { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "G_8" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vtenore" r4 fad'2 mi'4 |
re'4. re'8 re'2 |
mi'4 la dod'2 |
r4 mi' mi'4. mi'8 |
re'4. re'8 re'4 re' |
dod'2 re'4 si |
dod'2 r8 lad lad lad |
si si r si mi' mi' r mi' |
re' re' r fad' mi'4 r8 mi' |
la la r la si si r si |
dod'4 dod' r2 |
r4 mi'2 mi'4 |
dod'4. dod'8 mi'2 |
si4 mi' mi'2 |
r4 mi sold4. dod'8 |
dod'4. dod'8 dod'4 fad' |
re'2 r4 fad' |
fad'2 mid'4. dod'8 |
dod'2 r8 fad' fad' fad' |
mi' mi' r mi' re' re' r fad' |
re' re' r sol' mi'4 r8 fad' |
fad' re' r re' mi' mi' r mi' |
fad'4 fad' r2 |
la4. si16 dod' re'8 re' re' re' |
re' re' re' re' re' dod'16 [ si ] la8 sol |
fad4 r8 la si16 [ la ] sol fad mi8 la |
re ( re'4 ) dod'8 si [ la ] si8. la16 |
la4 r r2 |
R1 |
r2 r4 r8 la |
si16 [ la ] sol fad mi8 la re ( re'4 ) dod'8 |
fad [ si ] sold8. sold16 la4 r |
r8 dod' re' dod'16 si dod'8 la16 si dod'8 si16 la |
mi'8 mi' r4 r8 mi' fad' mi'16 re' |
dod'8 la r4 r8 mi' sold' fad'16 mi' |
la'8 [\melisma sold'16 fad' ] mi' [ re' dod' si la8 ]\melismaEnd la r4 |
R1 |
r2 r4 r8 mi' |
fad'16[ mi' re' dod'] si8 mi' mi'4 r |
R1 |
r2 r4 la8 si16 dod' |
re'8 re' re' re' re' dod'16 [ si ] la8 sol |
fad4 r8 fad sol4 la8 dod' |
re'4 r r2 |
R1*2 |
r2 r4 la8 dod'16 re' |
mi'8 mi' mi' mi' mi' mi' mi'8. re'16 |
dod'4 dod'8 re'16 mi' fad'8 fad' fad' fad' |
fad' fad' re' re' dod'4 dod' |
dod'2 dod'4 re'8 mi'16 fad' |
sol'8 sol' sol' sol' sol' sol' sol' sol' |
fad' fad' mi' re' la4 la8 si16 dod' |
re'8 re' re' re' re' re' re' re' |
re' dod'16 [ si ] la8 sol fad4 r |
fad'8 re' r4 fad'8 re' r4 |
fad'8 re' r fad' fad' fad'16 fad' re'8 sol' |
fad'4 r r2 |
r4 r8 mi' fad'16 [ mi' ] re' dod' si8 mi' |
la4 r8 fad' fad' [ re' ] re' re' |
re'4 r8 fad' sol'16 [ fad' mi' re' ] dod'8 dod' |
re' re' r re' dod' dod' r dod' |
si si r dod' la la r re' |
re' la r si si16 [ la sol fad ] mi8 dod' |
dod'16 [ si la sol ] fad8 re' re'16 [ dod' si la ] sol8 mi' |
mi'16 [ re' dod' si ] la8 fad' fad' si r dod' |
dod'16 [ si la si ] dod'8 mi' re'4 re'8 re' |
re'4 ( dod' ) fad' r8 mi' |
fad'2 mi'4 mi' |
fad'2 ( re' )|
mi'1 |
 }
      >> 
      \new Staff  <<
        
        { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "vbasso" r4 re'2 dod'4 |
si4. si8 fad2 |
mi4 re la2 |
r4 sol fad4. fad8 |
si4. si8 si4 si |
la2 sol4. sol8 |
fad2 r8 fad fad fad |
si si r si dod' dod' r dod' |
re' re r re mi4 r8 mi |
fad fad r fad sold sold r sold |
la4 la, r2 |
r4 la2 sold4 |
fad4. fad8 dod'2 |
si4 la mi2 |
r4 re dod4. dod8 |
fad4. fad8 fad4 fad |
si2 r4 fad |
dod'2 dod4. dod8 |
fad2 r8 re re re |
mi mi r mi fad fad r fad |
sol sol r sol la4 r8 la |
si si r si dod' dod' r dod' |
re'4 re r2 |
la4. si16 dod' re'8 re' re' re' |
re' re' re' re' re' dod'16 [ si ] la8 sol |
fad4 r8 la si16 [ la ] sol fad mi8 la |
re ( re'4 ) dod'8 si [ la ] si8. la16 |
la4 r r2 |
R1*5 |
r4 mi8 fad16 sold la8 la la la |
la la la la la sold16 [ fad ] mi8 re |
dod4 r8 mi fad16 [ mi ] re dod si,8 mi |
la, \melisma la4 sold8 ~ sold \melismaEnd fad mi8. mi16 |
re8 re mi8. mi16 fad8. [ sold16 la8 ] la |
re4 mi8 mi la,4 la8 si16 dod' |
re'8 re' re' re' re' dod'16 [ si ] la8 sol |
fad4 r8 si la la r4 |
R1 |
r2 r4 r8 la |
si16 [ la ] sol fad mi8 la re [\melisma mi16 fad ] sol8 [ fad16 mi ]|
fad8 [ sol16 la ] si [ la si dod' ] re'8 [ la ] re'4 ~|
re' dod' si \melismaEnd la |
re mi8 mi fad4. fad8 |
sold4 la8 la mi2 |
la,4 la8 si16 dod' re'8 re' re' re' |
re' re' re' re' mid4 fad |
dod2 fad4 r |
R1 |
r2 r4 la8 si16 dod' re'8 re' re' re' re' re' re' re' |
re' dod'16 [ si ] la8 sol fad4 r |
re'8 re r4 re'8 re r4 |
re'8 re r re re' re'16 re' si8 sol |
re'4 r r r8 la |
si16 [ la ] sol fad mi8 la re4 sol ~|
sol8 fad16 [ mi ] fad8 re si si si la16 [ sol ] |
re'4 r r r8 fad |
si si r mi la la r re |
sol sol r mi fad fad r fad |
fad16 [ mi re dod ] si,8 sol sol16 [ fad mi re ] dod8 la |
la16 [ sol fad mi ] re8 si si16 [ la sol fad ] mi8 dod' |
dod'16 [ si la sol ] fad8 re' re'16 [\melisma dod' si la ] sol [ fad mi re | dod8 ]\melismaEnd
dod r dod' re'4 si8 sol |
la2 re4 r8 la |
re'2 dod'4 dod' |
si1 |
la |
 }
      >> 
    >>
    \new Staff << 
                  { \key re \major
\tempo "Largo" \midiTempo #100
\time 4/4 s1*6 s2
\tempo "Andante" s2 s1*4
\tempo "Largo" s1*7 s2
\tempo "Andante" s2 s1*4 \bar "||"
\tempo "Larghetto" \midiTempo #80 s1*44 s2.
\tempo "Adagio" s4 s1*3 \bar "|."
 } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" re4 re2 dod4 |
si,4. si8 fad2 |
mi4 re la2 |
r4 sol fad4. fad8 |
si4. si8 si4 si |
la2 sol4. sol8 |
fad2 r8 fad fad fad |
si si r si dod' dod' r dod' |
re' re r re mi4 r8 mi |
fad fad r fad sold sold r sold |
la4 la, r2 |
la,4 la2 sold4 |
fad4. fad8 dod2 |
si,4 la, mi2 |
r4 re dod4. dod8 |
fad4. fad8 fad4 fad |
si2 r4 fad |
dod'2 dod4. dod8 |
fad2 r8 re re re |
mi mi r mi fad fad r fad |
sol sol r sol la4 r8 la |
si si r si dod' dod' r dod' |
re'4 re r2 |
la4.-"Tasto solo" si16 dod' re'8 re' re' re' |
re' re' re' re' re' dod'16 si la8 sol |
fad4 r8 la si16 la sol fad mi8 la |
re re'4 dod'8 si la si4 |
la \clef "treble" la'8-"Tasto solo" si'16 dod'' re''8 re'' re'' re'' |
re'' re'' re'' re'' re'' dod''16 si' la'8 sol' |
fad'4 r8 la' si'16 la' sol' fad' mi'8 \clef "bass" la |
si16 la sol fad mi8 la re re'4 dod'8 |
fad si sold8. sold16 la2 |
r8 dod' re' dod'16 si dod'8 la16 si dod'8 si16 la |
mi'4 mi8 fad16 sold la8 la la la |
la la la la la sold16 fad mi8 re |
dod4 r8 mi fad16 mi re dod si,8 mi |
la, la4 sold8 ~ sold fad mi8. mi16 |
re8 re mi8. mi16 fad8. sold16 la8 la |
re4 mi8 mi la,4 la8 si16 dod' |
re'8 re' re' re' re' dod'16 si la8 sol |
fad4 r8 si la la, la si16 dod' |
re'8 re' re' re' re' dod'16 si la8 sol |
fad4 r8 fad sol4 la8 la |
si16 la sol fad mi8 la re mi16 fad sol8 fad16 mi |
fad8 sol16 la si la si dod' re'8 la re'4 ~|
re' dod' si la |
re mi8 mi fad4. fad8 |
sold4 la8 la mi4 mi, |
la, la8 si16 dod' re'8 re' re' re' |
re' re' re' re' mid4 fad |
dod2 fad4 \clef "treble" re'8 mi'16 fad' |
sol'8 sol' sol' sol' sol' sol' sol' sol' |
sol' fad' mi' re' la4 \clef "bass" la8-"Tasto solo" si16 dod' |
re'8 re' re' re' re' re' re' re' |
re' dod'16 si la8 sol fad4 r |
re'8 re r4 re'8 re r4 |
re'8 re r re re' re'16 re' si8 sol |
re'4 \clef "treble" r8 la' si'16 la' sol' fad' mi'8 \clef "bass" la |
si16 la sol fad mi8 la re4 sol ~|
sol8 fad16 mi fad8 re si si si la16 sol |
re'4. \clef "treble" << { la'8 si'16 la' sol' fad' mi'8 }
                        \\ { fad' sol'16 fad' mi' re' dod'8 } >> \clef "bass" fad |
si si r mi la la r re |
sol sol r mi fad fad r fad |
fad16 mi re dod si,8 sol sol16 fad mi re dod8 la |
la16 sol fad mi re8 si si16 la sol fad mi8 dod' |
dod'16 si la sol fad8 re' re'16 dod' si la sol fad mi re |
dod4 r8 dod' re'4 si8 sol |
la4 la, re r8 la |
re'2 dod'4 dod' |
si1 |
la |
 }
                   >>
  >>
  
  \midi { } }
