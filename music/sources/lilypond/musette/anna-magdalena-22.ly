\header {
  enteredby = 	"Allen Garvin"
  maintainer = 	"Allen Garvin"
  maintainerEmail = "AGarvin@tribalddb.com"
  copyright = 	"Public Domain"
  filename = 	"anna-magdalena-22.ly"
  title = 	"Musette"
  opus = 	"BWV Anh. 126"
  composer =	"Johann Sebastian Bach (1685-1750)"
  style =	"Baroque"
  source =	"Bach-Gesellschaft"

  mutopiainstrument = "Harpsichord, Piano, Clavichord"
  mutopiatitle =      "Musette"
  mutopiacomposer =   "BachJS"
  mutopiaopus =       "BWV Anh. 126"

 footer = "Mutopia-2013/01/06-79"

}

\version "2.25.12"

voiceone =  \relative c'' {
  \clef "treble"
  \key d \major
  \time 2/4

  \repeat "volta" 2 {
    a'4  g16[ fis e d] |
    a'4  g16[ fis e d] |
     fis,16[ g a8]  g[ fis] |
     e[ a fis d] |
    a''4  g16[ fis e d] |
    a'4  g16[ fis e d] |
     fis,16[ g a8]  g[ fis] |
     e[ a] d,4\fermata |
  }
  \repeat "volta" 2 {
     cis'16[ d e8]  cis16[ d e8] |
     a[ e] e4 |
     a8[ e]  a[ e] | \break
     d16[ cis b a]  b8[ e,] |
     e'[ dis e, d'] ~ |
     d[ cis a' gis] |
     e[ dis e, d'] ~ |
     d[ cis a' gis] | \break
     e16[ dis cis dis]  e[ dis cis dis] |
     e8[ gis, a d!] |
     cis16[ d e8]  a,[ d,] |
     cis16[ d e8] a,4 |
  }
}

voicetwo =  \relative c, {
  \clef "bass"
  \time 2/4
  \key d \major

  \repeat "volta" 2 {
     d8[ d']  d,[ d']
     d,[ d']  d,[ d'] |
     fis16[ g a8]  g[ fis] |
     e[ a fis d] |
     d,[ d']  d,[ d'] |
     d,[ d']  d,[ d'] |
     fis16[ g a8]  g[ fis] |
     e[ a] d,4\fermata |
  }
  \repeat "volta" 2 {
     a8[ a']  a,[ a'] |
     a,[ a']  a,[ a'] |
     a,[ a']  a,[ a'] |
     a,[ a']  e,[ e'] |
     e,[ e']  e,[ e'] |
     e,[ e']  e,[ e'] |
     e,[ e']  e,[ e'] |
     e,[ e']  e,[ e'] |
     e,[ e']  e,[ e'] |
     e,[ d']  cis[ d] |
    e4  a,8[ d] |
     cis16[ d e8] a,4 |
  }
}
  
\score {
   \context GrandStaff << 
    \context Staff = "one" <<
      \voiceone
    >>
    \context Staff = "two" <<
      \voicetwo
    >>
  >>

  \layout{}
  
  \midi {
    \tempo 4 = 120
    }


}
