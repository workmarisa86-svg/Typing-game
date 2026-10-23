# Verse sources (public domain)

Both files are copied unchanged from the scrollmapper `bible_databases` project
(https://github.com/scrollmapper/bible_databases, commit e1b254cef86d0e65b1a5d1a94b8b112d0f296a2c,
`formats/csv/`), which converts CrossWire SWORD modules:

| File | Original file | Text |
|---|---|---|
| `KJV.csv` | `formats/csv/KJV.csv` | King James Version (1769) — public domain |
| `SpaRV1909.csv` | `formats/csv/SpaRV.csv` | La Santa Biblia Reina-Valera (1909) — public domain |

The game never uses verses typed by hand. `tools/build_verses.py` reads these two files and
writes `data/verses-en.js` and `data/verses-es.js`, copying each verse's text byte-for-byte.
It only *selects* verses (by book and length, and skips verses with characters a US keyboard
can't type such as Hebrew letters, em-dashes or bracketed words). It never edits a verse.

Note: in this CrossWire KJV module, the small-capitals "LORD" is written as "Lord".
