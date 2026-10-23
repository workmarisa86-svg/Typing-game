\version "2.25.12"
\language "english"
global = { \key ef \major \time 2/4 \tempo 4 = 60 }
soprano = { \global 
  bf'8 g'8 g'8 f'8 | g'8 bf'8 bf'4 | c''8 c''8 ef''8 c''8 | c''8 bf'8 bf'4 | 
  bf'8 g'8 g'8 f'8 | g'8 bf'8 bf'4 | c''8 c''8 bf'8 ef'8 | g'8 f'8 ef'4  
  bf'4 g'8 bf'8 | c''8 ef''4. | bf'4 g'8 ef'8 | g'8 f'4. | 
  bf'4 g'8 bf'8 | c''8 ef''4 c''8 | bf'8 ef'8 g'8. f'16 | ef'2
 }
alto = { \global 
  g'8 ef'8 ef'8 d'8 | ef'8 g'8 g'4 | af'8 af'8 c''8 af'8 | af'8 g'8 g'4 | 
  g'8 ef'8 ef'8 d'8 | ef'8 g'8 g'4 | af'8 af'8 g'8 ef'8 | ef'8 d'8 ef'4  
  g'4 ef'8 g'8 | af'8 c''4. | g'4 g'8 ef'8 | ef'8 d'4. | 
  g'4 ef'8 g'8 | af'8 c''4 af'8 | g'8 ef'8 ef'8. d'16 | ef'2 }
tenor = { \global 
  bf8 bf8 bf8 bf8 | bf8 bf8 bf4 | af8 af8 af8 af8 | af8 bf8 bf4 | 
  bf8 bf8 bf8 bf8 | bf8 bf8 bf4 | af8 af8 bf8 g8 | bf8 af8 g4  
  bf4 bf8 ef'8 | ef'8 ef'4. | ef'4 g8 ef8 | bf8 bf4. | 
  bf4 bf8 ef'8 | ef'8 ef'4 ef'8 | ef'8 g8 bf8. af16 | g2 }
bass = { \global 
  ef8 ef8 ef8 bf,8 | ef8 ef8 ef4 | af,8 af,8 af,8 c8 | ef8 ef8 ef4 | 
  ef8 ef8 ef8 bf,8 | ef8 ef8 ef4 | af,8 c8 ef8 ef8 | bf,8 bf,8 ef4  
  ef4 ef8 ef8 | af,8 af,4. | ef4 g8 ef8 | bf,8 bf,4. | 
  ef4 ef8 ef8 | af,8 af,4 af,8 | ef8 ef8 bf,8. bf,16 | ef2 }
\score { << \new Staff << \new Voice = "s" { \voiceOne \soprano } \new Voice { \voiceTwo \alto } >> \new Staff << \clef bass \new Voice { \voiceOne \tenor } \new Voice { \voiceTwo \bass } >> >> \midi { } }
