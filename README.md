<br />
<div align="center">
  <img width="128" height="128" src="./src-tauri/icons/icon.png" alt="Croissant_Sama Logo">

  <h1 align="center">Croissant_Sama</h1>

  <p align="center">
    <strong>Desktop Anime Chess GUI • UCI Engine Analysis • Waifu Dialogue Commentary</strong>
    <br />
    An Anime-themed Fork of <a href="https://github.com/franciscoBSalgueiro/en-croissant">En Croissant</a>
    <br />
    Licensed under <strong>GNU General Public License v3.0 (GPL-3.0)</strong>
  </p>
</div>

<div align="center">
  <img src="./public/thumbnail.png" alt="Croissant_Sama Showcase Thumbnail" width="100%" />
</div>

<br />

**Croissant_Sama** combines the battle-tested, production-grade desktop chess toolkit of **En Croissant** with a distinctive anime visual identity, interactive waifu coach dialogue, custom piece sets, and character art galleries.

## Key Features

- **Anime Character Game Review & Dialogue:** Real-time character coach commentary on every move. Hear Queen Seraphine and your army react dynamically to blunders (`??`), mistakes (`?`), dubious moves (`?!`), good moves (`!`), and brilliant sacrifices (`!!`), complete with whispered engine best-line suggestions and PGN comment export.
- **Anime Aesthetic Themes:** Custom board color schemes including *Sakura & Ivory* and *Obsidian & Gold*.
- **12-Piece Chibi Set:** 2D character chibi icons rendered crisply via Chessground with mirrored White-and-Pink (House of Dawn) and Black-and-Gold (House of Dusk) uniforms.
- **Characters Art Gallery (Ctrl+G):** Dedicated in-app gallery showcasing high-resolution character hero art, lore archive, and side-by-side White vs. Black comparisons.
- **Full UCI Engine Management:** Powered by Stockfish 17, Maia, and external UCI engines with live multi-engine evaluation, CP/WDL graphs, and blunder detection.
- **Database & Repertoire Training:** Local SQLite database search, opening tree explorer, PGN/FEN handling, and spaced-repetition repertoire training.

## Building from Source

Croissant_Sama is built with **Tauri v2**, **Rust**, **React 19**, **TypeScript**, and **Mantine UI**.

```bash
# Clone the repository
git clone https://github.com/croissantsama/croissant-sama.git
cd croissant-sama

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev

# Build production bundle
pnpm tauri build
```

## Credits & License

- **Forked from:** [En Croissant](https://github.com/franciscoBSalgueiro/en-croissant) by Francisco Salgueiro and contributors.
- **License:** GNU General Public License v3.0 ([GPL-3.0](./LICENSE)).

