# Credits

## Piano sound

**Salamander Grand Piano V3** by Alexander Holm, released under
**Creative Commons Attribution 3.0** (CC BY 3.0).
Packaged as MP3 files in the npm package
[`@audio-samples/piano-mp3-velocity10`](https://www.npmjs.com/package/@audio-samples/piano-mp3-velocity10) v1.0.5
(MIT license, © 2019 Jan Forst).

The game uses 21 of those samples (every minor third from C2 to C7, velocity layer 10), trimmed to
3 seconds with a fade-out and converted to mono 80 kbps MP3 with ffmpeg. They live in `audio/piano/`.
Notes in between are made by changing the sample's playback speed. The game only loads the samples
the chosen song needs.

## Songs (Piano Challenge)

The melody files are not written by hand. Each piece is read from a public-domain
MIDI, MusicXML or ABC source, and `tools/build_songs.py` turns it into `js/songs.js`. The source files
are kept in `music/sources/`.

- **Mutopia files**: Mutopia publishes its LilyPond sources on GitHub
  (https://github.com/MutopiaProject/MutopiaProject, commit 2144afd6f52d56c5b6995b8b589ef1268b3139f0).
  mutopiaproject.org itself was not reachable from the build machine. The `.ly` files were
  compiled to MIDI with LilyPond 2.25.12 (pip package `lilypond`), after `convert-ly` and after
  removing old header markup that the new LilyPond can't read. The music notes were not changed.
- **cellist files**: from https://github.com/cellist/Lilypond-Sheet-Music (commit
  cf9f9046601ec304ca512ed81ff6444ea93d9478). The repository's README says *"Please feel free to use
  and share the sheet music in this repo."* No separate license file was found. The compositions
  themselves are public domain (the composers died more than 250 years ago).
- **Traditional melodies**: from the ABC file `wrongnote/data/src/melodies.abc` in
  https://github.com/zuhthebeg/games. Each tune in it names its printed source, such as Wikipedia scores
  or The Session. The melodies are public-domain folk songs and hymns. No license file was found for
  that repository.

| Song | Composer | Source file in `music/sources/` | From | License of the source |
|---|---|---|---|---|
| Hot Cross Buns | Traditional | traditional-melodies.abc | zuhthebeg/games melodies.abc | melody public domain |
| Mary Had a Little Lamb | Traditional | traditional-melodies.abc | same | melody public domain |
| Twinkle Twinkle Little Star | Traditional | traditional-melodies.abc | same | melody public domain |
| Jesus Loves Me | William B. Bradbury (1862) | jesus_loves.mid (from lilypond/jesus_loves) | https://github.com/kenakofer/hymnsinger `lilypond/songs/jesus-loves-me` (4-part setting) | music public domain |
| Amazing Grace | Traditional (NEW BRITAIN) | amazing.mid | Mutopia `Anonymous/new_britain` (Mutopia-2008/02/19-1283) | Public Domain |
| Row, Row, Row Your Boat | Traditional | traditional-melodies.abc | zuhthebeg/games | melody public domain |
| London Bridge | Traditional | traditional-melodies.abc | same | melody public domain |
| Frère Jacques | Traditional | traditional-melodies.abc | same | melody public domain |
| Old MacDonald | Traditional | traditional-melodies.abc | same | melody public domain |
| Baa Baa Black Sheep | Traditional | baa-baa-black-sheep.abc | John Chambers' ABC collection, via https://github.com/syntithenai/abc2book `abcresources/jc/abc_tune_jc_201218952.abc` | melody public domain |
| This Old Man | Traditional | this-old-man.abc | https://github.com/syntithenai/abc2book `scrape/kids songs.abc` | melody public domain |
| Yankee Doodle | Traditional | traditional-melodies.abc | zuhthebeg/games | melody public domain |
| Oh! Susanna | Stephen Foster (1848) | traditional-melodies.abc | same | melody public domain |
| When the Saints Go Marching In | Traditional | traditional-melodies.abc | same | melody public domain |
| Jingle Bells (refrain) | James Lord Pierpont (1857) | traditional-melodies.abc | same | melody public domain |
| Silent Night | Franz Xaver Gruber | silent.mid | Mutopia `GruberFX/stille-nacht` (Mutopia-2005/01/21-521) | CC BY-SA 2.0 |
| Holy, Holy, Holy | John Bacchus Dykes (NICAEA) | holy.mid | Mutopia `DykesJB/nicaea` (Mutopia-2008/02/19-1284) | Public Domain |
| See the Conquering Hero Comes | Handel (Judas Maccabaeus) | conquering_hero.mid | cellist `Vl, Vlc/…/Tochter Zion` (the hymn "Tochter Zion" uses this chorus melody) | see cellist note above |
| Largo "Ombra mai fù" | Handel (Serse) | ombra.mid | cellist `Vl, Vl, Vlc, Kl/…/Ombra mai fu` | see cellist note |
| Hallelujah Chorus (melody) | Handel (Messiah) | hallelujah.mid | Mutopia `HandelGF/hallelujah` soprano part (Mutopia-2015/01/17-459) | Public Domain |
| Sheep May Safely Graze (melody) | J. S. Bach, BWV 208 | sheep.mid | Mutopia `BachJS/BWV208/Sheep` (Mutopia-2011/10/25-1794) | Public Domain |
| Sleepers, Wake! (chorale) | J. S. Bach, BWV 140/7 | bwv140.7.mxl | music21 corpus (`bach/bwv140.7.mxl`, music21 package on PyPI) | Public Domain |
| Jesu, Joy of Man's Desiring | J. S. Bach, BWV 147 | jesu_joy.mid | cellist `Ob, Eh, Vl, Vlc/…/Jesu bleibet meine Freude` | see cellist note |
| Air on the G String | J. S. Bach, BWV 1068 | air.mid | Mutopia `BachJS/BWV1068/bach_air_bmv_1068` (Mutopia-2008/10/28-1534) | Public Domain |
| Sarabande in D minor, HWV 437 | Handel | sarabande437.mid | cellist `Vl, Vlc/…/Sarabande HWV 437` | see cellist note |
| Alla Hornpipe (Water Music) | Handel, HWV 349 | alla_hornpipe.mid | cellist `Vl, Vl, Ob, Vlc/…/Alla Hornpipe` | see cellist note |
| Sonata K. 545, 2nd mvt | W. A. Mozart | k545_2.mid | Mutopia `MozartWA/KV545/K545-2` (Mutopia-2007/07/22-1007) | CC BY-SA 3.0 |
| Sonata K. 545, 1st mvt (theme) | W. A. Mozart | k545_1.mid | Mutopia `MozartWA/KV545/K545-1` (Mutopia-2013/09/01-998) | CC BY-SA 3.0 |
| Prelude in C, BWV 846 | J. S. Bach | bwv846.mid | Mutopia `BachJS/BWV846/wtk1-prelude1` (Mutopia-2011/09/12-5) | Public Domain |
| Little Prelude in C minor, BWV 999 | J. S. Bach | bwv999.mid | Mutopia `BachJS/BWV999` (Mutopia-2013/01/22-60) | Public Domain |
| Bourrée in E minor, BWV 996 | J. S. Bach | bwv996.mid | Mutopia `BachJS/BWV996/bourree` (Mutopia-2011/04/01-1743) | Public Domain |
| Badinerie, BWV 1067 | J. S. Bach | badinerie.mid | cellist `Fl, Vl, Vlc/…/Badinerie` | see cellist note |
| Arrival of the Queen of Sheba | Handel, HWV 67 | sheba.mid | cellist `Orchestra/…/Arrival of the Queen of Sheba` | see cellist note |
| The Harmonious Blacksmith | Handel, HWV 430 | blacksmith.mid | cellist `Vl, Vl, Vlc, Vlc/…/Air con Variazioni` | see cellist note |
| Sonata K. 545, 3rd mvt | W. A. Mozart | k545_3.mid | Mutopia `MozartWA/KV545/K545-3` (Mutopia-2007/08/22-1027) | CC BY-SA 3.0 |
| Invention No. 1, BWV 772 | J. S. Bach | inv1.mid | Mutopia `BachJS/BWV772` (Mutopia-2008/06/15-40) | CC BY-SA 3.0 |
| Invention No. 4, BWV 775 | J. S. Bach | inv4.mid | Mutopia `BachJS/BWV775` (Mutopia-2008/06/15-67) | Public Domain |
| Invention No. 8, BWV 779 | J. S. Bach | inv8.mid | Mutopia `BachJS/BWV779` (Mutopia-2008/06/15-61) | Public Domain |
| Invention No. 13, BWV 784 | J. S. Bach | inv13.mid | Mutopia `BachJS/BWV784` (Mutopia-2008/06/15-59) | Public Domain |
| Invention No. 14, BWV 785 | J. S. Bach | inv14.mid | Mutopia `BachJS/BWV785` (Mutopia-2008/06/15-72) | Public Domain |
| Prelude in C minor, BWV 847 | J. S. Bach | bwv847.mid | Mutopia `BachJS/BWV847/bwv847a` (Mutopia-2006/07/02-550) | Public Domain |
| Italian Concerto, BWV 971, 1st mvt | J. S. Bach | bwv971_mvt1.mid | Mutopia `BachJS/BWV971/piano` (Mutopia-2012/02/05-1826) | CC BY-SA 3.0 |
| Toccata and Fugue in D minor, BWV 565 | traditionally credited to J. S. Bach | toccata.mid | Mutopia `BachJS/BWV565/ToccataFugue` (Mutopia-2011/09/11-1780) | Public Domain |
| Passacaglia in G minor, HWV 432 | Handel | passacaglia.mid | cellist `Vl, Vl, Vlc, Vlc/…/Passacaille HWV 432` | see cellist note |
| Sonata K. 545, 1st mvt (complete) | W. A. Mozart | k545_1.mid | Mutopia `MozartWA/KV545/K545-1` | CC BY-SA 3.0 |

### What the build script changes
- **Key**: four cellist arrangements were written in other keys, so they are moved back to the
  piece's usual key. The Sarabande goes up 4 semitones to D minor, Alla Hornpipe down 3 to D major,
  See the Conquering Hero up 2 to G major, and The Harmonious Blacksmith down 1 to E major.
- **Length**: Easy songs are cut to at most 140 tiles, Medium 170, Hard 260 (Rondo 400) and Expert
  420–600. The full K. 545 1st movement is kept whole. Long rests are shortened to 2 beats.
- **Speed**: the tempo is lowered when the notes would come faster than the level allows. The
  pitches and rhythm stay the same.
- **Chords**: on Beginner to Medium, tiles follow the melody, and each tile also plays any other
  notes that start with it. Accompaniment notes that fall between melody notes are left out. Hard and
  Expert play every note.

## Verses

See `data/sources/SOURCE.md`. They are the KJV (1769) and the Reina-Valera 1909, both public domain,
from https://github.com/scrollmapper/bible_databases.

## Font

Fredoka by Milena Brandão and Hafontia, SIL Open Font License, loaded from Google Fonts.
