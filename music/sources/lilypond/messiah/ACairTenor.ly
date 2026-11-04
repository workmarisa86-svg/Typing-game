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
                    { \key mi \major
\time 4/4
\tempo "Andante" \midiTempo #108
s1*84 \bar "|." } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino1" mi''4 fad'' sold''8. ( si''16 ) si''4 ~|
si''8 la''16 sold'' fad''8 mi'' red''8. ( si''16 ) si''4 ~|
si''8 la''16 sold'' fad''8. mi''16 red'' dod'' si'8 r mi'' |
fad''-\trill mi'' fad''-\trill mi'' fad''-\trill mi'' r sold'' |
la''-\trill sold'' la''-\trill sold'' la''-\trill sold'' r si'' \p |
dod''' ( si'' ) dod''' ( si'' ) dod''' ( si'' ) dod''' fad''\f |
sold''8. la''16 fad''4-\trill mi'' r8 si' \p |
dod'' ( si' ) dod'' ( si' ) dod'' si' dod'' fad' \f |
sold'8. la'16 fad'4-\trill mi' r |
R1 |
mi''4 fad'' sold''8. ( si''16 ) si''4 |
R1 |
r2 r8 si' \p mi''4 ~|
mi''8 red''16 dod'' si'8 fad'' sold''16 fad'' mi''8 r4 |
r2 r8 si' mi''4 |
r8 red'' fad''4 r8 mi'' sold''4 |
r8 fad'' la''4 r8 fad'' si''4 |
r8 si' la'4 r8 si' fad''4 |
mi'' fad'' sold''8. si''16 si''4 |
r2 r8 fad'' sold'' fad'' |
sold'' fad'' r4 r8 sold' dod''4 |
r8 dod'' red''4 r8 red'' mi''4 |
r8 dod'' fad''4 r2 |
si'4 dod'' red''8. fad''16 fad''4 |
R1 |
r8 dod'' red'' ( dod'' ) red'' ( dod'' ) red'' ( dod'' )|
red'' ( dod'' ) r4 r2 |
r4 r8 si'' dod''' ( si'' ) dod''' ( si'' )|
si''4. fad''8 sold'' ( fad'' ) sold'' ( fad'' )|
sold'' fad'' sold'' fad'' mi'' red'' mi'' red'' |
dod''4 r lad''8 ( si'' ) dod''' ( si'' )|
lad''4 r lad'8 si' dod'' si' |
lad' si' dod'' fad' red'4 r8 dod'' |
red'' ( sold'' ) fad'' lad' si'4 r8 dod' |
si4 si' ~ si'8 si' lad' mi'' |
red'' red'' red'' red'' sold'' sold'' sold'' sold'' |
sold'' sold'' sold'' sold'' fad'' fad'' fad'' fad'' |
fad'' fad'' fad'' fad'' mi'' mi'' mi'' mi'' |
mi'' mi'' mi'' mi'' mi'' mi'' mi'' mi'' |
mi''4 red'' r2 |
r8 fad' \p sold' ( fad' ) sold' ( fad' ) sold' ( fad' )|
sold'' ( fad'' ) sold'' ( fad'' ) sold'' ( fad'' ) sold'' dod'' |
red''8. mi''16 dod''4 si' r |
R1 |
mi''4 \f sold'' la'' la' |
r2 r4 r8 sold'' |
la''4 r r r8 sold'' |
la''4 r r r8 sold'' |
la''4 r r8 si' mi''4 |
r8 la' re''4 r8 si' mi''4 |
R1 |
la'4 si' dod''8. mi''16 mi''4 |
R1 |
mi''4 fad'' sold''8. si''16 si''4 |
R1 |
si'4 r mi'' r |
R1 |
dod''4 r r8 fad'' si'' red'' |
mi''4 mi' fad'' si' |
r2 r4 r8 si'\p |
dod'' ( si' ) dod'' ( si' ) dod'' si' r4 |
r2 r4 r8 mi'' |
fad'' ( mi'' ) fad'' ( mi'' ) mi''2 ~|
mi''4. mi''8 red'' fad'' la'4 |
sold' sold'2 fad'8 mi' |
fad' sold'' fad'' mi'' red'' mi'' fad'' mi'' |
red'' mi'' fad'' mi'' red'' mi'' fad'' mi'' |
red''4 mi'' r2 |
R1 |
r8 si'' \p dod''' ( si'' ) dod''' ( si'' ) dod''' ( si'' )|
dod''' ( si'' ) dod''' ( si'' ) dod''' ( si'' ) dod''' fad'' \f |
sold''8. la''16 fad''4 mi'' r |
lad'' r fad'' \fermata r |
R1*2 |
mi''4 \f fad'' sold''8. ( si''16 ) si''4 ~|
si''8 la''16 sold'' fad''8 mi'' red''8. ( si''16 ) si''4 ~|
si''8 la''16 sold'' fad''8. mi''16 red'' dod'' si'8 r mi'' |

fad''-\trill mi'' fad''-\trill mi'' fad''-\trill mi'' r sold'' |
la''-\trill sold'' la''-\trill sold'' la''-\trill sold'' r si'' \p |
dod''' ( si'' ) dod''' ( si'' ) dod''' ( si'' ) dod''' fad''\f |
sold''8. la''16 fad''4-\trill mi'' r8 si' \p |
dod'' ( si' ) dod'' ( si' ) dod''( si') dod'' fad' \f |
sold'8. la'16 fad'4-\trill mi'\fermata r | } >>
      \new Staff << 
                    { \key mi \major
\time 4/4
\tempo "Andante" \midiTempo #108
s1*84 \bar "|." } \clef "treble" { \set Staff.midiInstrument = "violin" \set Staff.instrumentName = "violino2" si'8 mi''4 red''8 mi''8. ( sold''16 ) sold''4 ~|
sold''8 si' dod'' mi'' fad'8. ( red''16 ) red''8 fad'' |
si' dod''16 si' la'8 sold' fad'4 r8 si' |
dod''-\trill si' dod''-\trill si' dod''-\trill si' r mi'' |
red'' mi'' red'' mi'' red'' mi'' r sold'' \p |
la'' ( sold'' ) la'' ( sold'' ) la'' ( sold'' ) la'' red'' \f |
mi'' mi''4 red''8 mi''4 r8 sold' \p |
la' sold' la' sold' la' sold' la' red' \f |
mi' mi'4 red'8 mi'4 r |
R1 |
si'8 mi''4 red''8 mi''8. ( sold''16 ) sold''4 |
R1 |
r2 r4 r8 si' |
fad''4. mi''16 red'' mi''8 si' r4 |
r2 r8 sold' si'4 |
r8 la' red''4 r8 si' mi''4 |
r8 dod'' fad''4 r8 red'' fad''4 |
r8 sold' mi'4 r8 fad' si'4 |
si'8 mi''4 red''8 mi''8. sold''16 sold''4 |
r2 r8 red'' mi'' red'' |
mi'' red'' r4 r8 mi' sold'4 |
r8 lad' fad'4 r8 si' sold'4 |
r8 dod'' lad'4 r2 |
si8 si'4 lad'8 si'8. red''16 red''4 |
R1 |
r8 lad' si' ( lad' ) si' ( lad' ) si' ( lad' )|
si' ( lad' ) r4 r2 |
r4 r8 red'' mi'' ( red'' ) mi'' ( red'' )|
sold'' fad'' r red'' mi'' ( red'' ) mi'' ( red'' )|
mi'' red'' mi'' red'' dod'' si' dod'' si' |
lad'4 r dod''8 ( si' ) lad' ( si' )|
dod''4 r dod'8 si lad si |
dod' si fad' fad' fad'4 r8 lad' |
fad' mi' si' dod' red' sold' fad' lad |
si mi' red' sold' fad' fad' mi' lad' |
si' si' fad' fad' sold' sold' sold' sold' |
dod'' dod'' dod'' dod'' dod'' dod'' fad' fad' |
si' si' si' si' si' si' si' si' |
dod'' si' lad' si' dod'' si' lad' si' |
dod''4 si' r2 |
r8 red' \p mi' ( red' ) mi' ( red' ) mi' ( red' )|
mi'' ( red'' ) mi'' ( red'' ) mi'' ( red'' ) mi'' lad'\f |
si' si'4 lad'8 si'4 r |
R1 |
sold'4 \f si' mi'' r |
r2 r4 r8 re'' |
mi''4 r r r8 si' |
dod''4 r r r8 si' |
dod''4 r r8 sold' si'4 |
r8 re' fad'4 r8 mi' sold'4 |
R1 |
mi'8 la'4 sold'8 la'8. dod''16 dod''4 |
R1 |
si'4 red'' mi''8. sold''16 sold''4 |
R1 |
fad'4 r si' r |
R1 |
fad'4 r r8 red'' fad'' si' |
lad'4 lad' red'' fad' |
r2 r4 r8 sold' |
la' ( sold' ) la' ( sold' ) la' sold' r4 |
r2 r4 r8 si' |
dod'' ( si' ) dod'' ( si' ) dod'' ( si' ) dod'' ( si' )|
dod'' mi'' fad'4 fad' r8 red'' |
mi'' sold'' si'4 la'4. la'8 |
la'4. la'8 la' sold' fad' sold' |
la' sold' fad' sold' la' sold' fad' sold' |
la'4 si' r2 |
R1 |
r8 sold'' la'' ( sold'' ) la'' ( sold'' ) la'' ( sold'' )|
la'' ( sold'' ) la'' ( sold'' ) la'' ( sold'' ) la'' red'' |
mi'' mi''4 red''8 mi''4 r |
mi'' r red'' \fermata r |
R1*2 |
si'8 mi''4 red''8 mi''8. ( sold''16 ) sold''4 ~|
sold''8 si' dod'' mi'' fad'8. ( red''16 ) red''8 fad'' |
si' dod''16 si' la'8 sold' fad'4 r8 si' |
dod''-\trill si' dod''-\trill si' dod''-\trill si' r mi'' |
red''( mi'') red''( mi'') red'' mi'' r sold'' \p |
la'' ( sold'' ) la'' ( sold'' ) la'' ( sold'' ) la'' red'' \f |
mi'' mi''4 red''8 mi''4 r8 sold' \p |
la'( sold') la'( sold') la'( sold') la' red' \f |
mi' mi'4 red'8 mi'4\fermata r |
 } >>
      \new Staff << 
                    { \key mi \major
\time 4/4
\tempo "Andante" \midiTempo #108
s1*84 \bar "|." } \clef "alto" { \set Staff.midiInstrument = "viola" \set Staff.instrumentName = "viola" sold'8 si' mi'' si' si'4 r8 red' |
mi' sold' la' sold' si'4 r8 red' |
mi' mi' fad' dod'' si' red' r mi' |
dod' mi' r mi' dod' mi' r si' |
la' si' la' si' la' si' r4 |
r2 r4 r8 si' \f |
si' dod'' fad' si' sold'4 r |
r2 r4 r8 si \f |
si dod' fad si sold4 r |
R1 |
sold'8 si' dod'' si' si'8. mi''16 mi''4 |
R1 |
r2 r4 r8 sold' dod'' dod' red' si' si'16 la' sold'8 r4 |
r2 r8 mi' sold'4 |
r8 fad' la'4 r8 sold' si'4 |
r8 la' dod''4 r8 si' red'4 |
r8 mi' dod'4 r8 red' red'4 |
sold'8 si' dod'' si' si'4 r |
r2 r8 si' si' si' |
si' si r4 r8 si mi'4 |
r8 fad' lad'4 r8 si' si4 |
r8 fad' dod''4 r2 |
fad'4 sold'8 fad' fad'4 r |
R1 |
r8 fad' fad' ( fad' ) fad' ( fad' fad' fad' )|
fad' fad' r4 r2 |
r r4 r8 si |
mi' red' r si' si' si' si' si' |
si' si' r si' sold' sold' sold' sold' |
dod'4 r mi'8 mi' mi' mi' |
mi'4 r mi'8 mi' mi' mi' |
mi' mi' mi' dod' si4 r8 dod' |
si4. fad'8 fad'4 r8 fad |
fad mi si4 ~ si8 si dod' dod' |
fad' fad' fad' fad' red' red' red' red' |
lad lad lad lad dod' dod' dod' dod' |
red' red' red' red' si si sold' sold' |
lad' sold' fad' sold' lad' sold' fad' sold' |
lad'4 si' r2 |
r8 si ( si si ) si si si si |
si4 r r r8 fad' |
fad' sold' dod' fad' red'4 r |
R1 |
si4 \f mi' mi' r |
r2 r4 r8 si' |
la'4 r r r8 mi' |
mi'4 r r r8 mi' |
mi'4 r r8 mi' sold'4 |
r8 fad' la'4 r8 sold' si'4 |
R1 |
mi'4 mi' mi'8. la'16 la'4 |
R1 |
sold4 si mi' r |
R1 |
si4 r sold' r |
R1 |
dod'4 r r8 si si fad' |
mi'4 dod' si' si |
r2 r4 r8 mi' |
mi' ( mi' mi' mi' ) mi'4 r |
r2 r4 r8 si |
la ( si ) la ( si ) la mi' la mi' |
dod'4. dod'8 si4 r8 fad' |
mi' si mi'4 dod' r8 dod' |
red' mi' fad' dod' fad' mi' si mi' |
fad' mi' si mi' fad' mi' si mi' |
fad'4 sold' r2 |
R1*2 |
r2 r4 r8 si' |
si' dod'' fad' si' sold'4 r |
dod'' r si'\fermata r |
R1*2 |
sold'8 si' mi'' si' si'4 r8 red' |
mi' sold' la' sold' si'4 r8 red' |
mi' mi' fad' dod'' si' red' r mi' |
dod' mi' r mi' dod' mi' r si' |
la' si' la' si' la' si' r4 |
r2 r4 r8 si' \f |
si' dod'' fad' si' sold'4 r |
r2 r4 r8 si \f |
si dod' fad si sold4\fermata r |
 } >>
    >>
    \new Staff  <<
      
      { \key mi \major
\time 4/4
\tempo "Andante" \midiTempo #108
s1*84 \bar "|." } \clef "G_8" { \set Staff.midiInstrument = "choir aahs" \set Staff.instrumentName = "tenore" R1*9 |
mi4 fad sold8. [ si16 ] si4 |
R1 |
sold4 la si8. [ mi'16 ] mi'4 ~|
mi'8 red'16 [ dod' ] si8 la sold16 [ fad ] mi8 r4 |
r2 r8 si mi'4 ~|
mi'8 [ red'16 dod' si8 ] la sold16 [\melisma fad mi8 ]~ mi16 [ sold fad sold ]|
la [ sold fad8 ]~ fad16 [ la sold la ] si [ la sold8 ]~ sold16 [ si la si ]|
dod' [ si la8 ]~ la16 [ dod' si dod' ] red' [ dod' si8 ]~ si16 [ red' dod' red' ]|
mi' [ red' dod'8 ]~ dod'16 [ mi' red' mi' ] fad' [ mi' red' dod' ] si [ fad' mi' fad' ]|
sold' [ fad' ]\melismaEnd mi'8 r4 r8 mi sold si |
mi'4.\melisma fad'16 [ mi' ] red' [ dod' ]\melismaEnd si8 r4 |
r8 fad si fad sold16 [\melisma fad mi8 ]~ mi16 [ sold lad si ]|
lad [ sold fad8 ]~ fad16 [ lad si dod' ] si [ lad sold8 ]~ sold16 [ si dod' red' ]|
dod' [ si lad8 ]~ lad16 [ dod' red' mi' ] red' [ dod' si red' ] mi' [ red' dod' mi' | fad'8 ]
\melismaEnd si r4 r8 fad si red' |
fad'4 fad8 mi' red' [ mi'16 red' dod'8 ] si |
fad2 r |
r4 r8 si dod' [ si ] dod' [ si ]|
si2 r |
r4 si8 si si4 si8 si |
si2 \melisma mi' ~|
mi'8 [ red' mi' red' ] mi'2 ~|
mi'8 [ red' mi' red' ] mi'2 ~|
mi'4\melismaEnd r8 dod' red' [ sold' fad' ] lad |
si4 r8 dod' red' [ sold' fad' ] lad |
si [ mi ] red sold fad [ si ] lad mi' |
red'2 ~ red'4. \melisma mi'16 [ red' ]|
dod'2 ~ dod'4. red'16 [ dod' ]|
si2 ~ si4. dod'16 [ si ]|
lad8 [ si dod' si ] lad [ si dod' si ]|
lad4 \melismaEnd si8 mi' red'4 dod'8 si |
si1 |
R1*2 |
si4 red' mi' mi |
R1 |
la4 si dod'8. [ mi'16 ] mi'4 ~|
mi'8 re'16 [ dod' ] si8 la sold [\melisma mi' ] mi'4 ~|
mi'8 [ fad'16 mi' ] re' [ dod' si la] sold8 [ mi' ] mi'4 ~|
mi'8 [ fad'16 mi' ] re' [ dod' si la ] sold [ fad mi8 ]~ mi16 [ sold la si ]|
la [ sold fad8 ]~ fad16 [ la si dod' ] si [ la sold8 ]~ sold16 [ si dod' re' ]|
dod' [ si la dod' ] re' [ dod' si re' ] mi'4\melismaEnd la |
R1 |
mi4 fad sold8. [ si16 ] si4 |
R1 |
si4 dod' red'8. [ fad'16 ] fad'4 ~|
fad'16 mi' [ red' dod' ] si8 la sold16 [\melisma fad mi8 ] mi'4 |
la16 [ sold fad8 ] mi'4 si16 [ la sold8 ] mi'4 ~|
mi'16 [ red' dod'8 ] fad' [ mi' ] red'8. [ dod'16 ]\melismaEnd si4 |
r8 lad lad lad si4 fad8 sold |
la4. sold8 sold4 r |
r2 r4 r8 mi' |
fad' [ mi' ] fad' [ mi' ] mi'2 |
r r4 r8 si |
dod' [ mi' ] fad4 fad r8 red' |
mi' [ sold' ] si4 la la8 la |
la4 la8 la la2 ~|
la1 ~|
la4 sold8 fad sold4 fad8 mi |
mi4 si8 sold dod'4 red'8 red' |
mi'1 ~|
mi'2 r |
r r4 r8 mi |
mi'4 lad si \fermata r |
r si dod' mi' |
sold2 ( fad4. ) mi8 |
mi2 r |
R1*8 |
 }
    >> 
    \new Staff << 
                  { \key mi \major
\time 4/4
\tempo "Andante" \midiTempo #108
s1*84 \bar "|." } \clef "bass" { \set Staff.midiInstrument = "cello" \set Staff.instrumentName = "bassi" mi8 sold la si mi4 r8 fad |
sold mi la dod' si4 r8 la |
sold mi la la, si,4 r8 sold |
la sold la sold la sold r mi |
fad mi fad mi fad mi r4 |
r2 r4 r8 si \f |
mi' la si si, mi4 r |
r2 r4 r8 si, \f |
mi la, si,4 mi, r |
R1 |
mi8 \f sold la si mi4 r |
mi \p fad sold r8 sold, |
la,4 si, mi r8 sold |
la la, si, si mi4 r8 sold |
la la, si, red mi4 r8 mi |
fad4 r8 fad sold4 r8 sold |
la4 r8 la si4 r8 si |
dod'4 r8 dod red4 r8 red |
mi sold la si mi4 r |
r8 dod' lad fad si si, r4 |
r8 si, red si, mi4 r8 mi |
fad4 r8 fad sold4 r8 sold |
lad4 r8 lad si red dod fad |
red4 mi8 fad si,4 r8 si |
lad sold lad fad si si, dod mi |
fad,2 r |
r4 r8 red mi red mi red |
mi red r4 r2 |
r4 r8 si, mi si, mi si, |
mi si, r si, dod sold, dod mi |
fad4 r fad8 sold lad sold |
fad4 r fad8 sold lad sold |
fad sold lad lad, si, mi red fad |
si, mi red fad si, mi red fad |
sold,4 fad,8 mi, red, red dod dod |
si, si, si, si, si si si si |
lad lad lad lad lad lad lad lad |
sold sold sold sold sold sold sold sold |
fad sold lad sold fad sold lad sold |
fad4 sold fad fad, |
si,1 |
r2 r4 r8 fad \f |
si mi fad fad, si,4 r |
si la sold r |
mi \f re dod r |
dod mi la r8 si, |
dod4 re mi r8 re |
dod4 re mi r8 re |
dod4 re mi r8 mi |
fad4 r8 fad sold4 r8 sold |
la4 si dod' r |
dod mi la, r |
sold, si, mi r |
sold-"Violone" si mi' r |
sold8-"Tutti" mi la fad si4 si,8 dod |
red4 r mi r |
fad r sold r |
lad r si8 si, si, si, |
dod dod dod dod red red red mi |
fad4 si, mi r |
r2 r4 r8 sold |
la sold la sold la sold la sold |
la sold la sold la sold la sold |
la4 la, si, r8 si, |
mi4 sold fad r8 dod |
fad mi red dod si, dod red dod |
si, dod red dod si, dod red dod |
si,4 mi8 la, si,2 |
mi8 fad sold mi la fad si la |
sold mi r4 r2 |
r r4 r8 si \f |
mi' la si si, dod4 r |
dod' r red \fermata r |
mi2 la, |
si,1 |
mi8 sold la si mi4 r8 fad |
sold mi la dod' si4 r8 la |
sold mi la la, si,4 r8 sold |
la sold la sold la sold r mi |
fad mi fad mi fad mi r4 |
r2 r4 r8 si \f |
mi' la si si, mi4 r |
r2 r4 r8 si, \f |
mi la, si,4 mi,\fermata r |
 } >>
  >>
  
  \midi { } }
