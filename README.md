# Croissant_Sama — クロワッサン様

<div align="center">
  <img width="128" height="128" src="./src-tauri/icons/icon.png" alt="Croissant_Sama Logo" />
  <h1 align="center">Croissant_Sama</h1>
  <p align="center">
    <strong>Desktop Anime Chess GUI • Stockfish 17 Engine Analysis • Waifu Dialogue Commentary • 12 Sovereigns Art Codex</strong>
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

**Croissant_Sama** combines the battle-tested, tournament-grade desktop chess toolkit of **En Croissant** with a bespoke anime visual identity, interactive waifu coach commentary, dynamic combat cut-ins, high-definition 720p motion video suites, and a full 12-piece sovereign character codex.

---

## ✨ Key Features

### 👑 12 Sovereigns of Dawn & Dusk (Full Piece Roster)
The entire chessboard has been reimagined as two opposing noble houses featuring bespoke 9:16 high-resolution splash art and custom piece icons:
- **House of Dawn (White)**:
  - **Queen**: Seraphine, Sovereign of the Rose Dawn
  - **King**: Aurelian, The Silver Sovereign
  - **Bishop**: Lady Lumina, High Shrine Priestess of the Lotus Dawn
  - **Knight**: Dame Freya, The Sunlit Valkyrie
  - **Rook**: Lady Eleanor, The Aegis Sentinel
  - **Pawn**: Dawn Squire, The Devoted Vanguard
- **House of Dusk (Black)**:
  - **Queen**: Lilith, The Abyssal Sovereign
  - **King**: Malakor, The Obsidian Sovereign
  - **Bishop**: Vespera, The Shadow Inquisitor
  - **Knight**: Morwenna, The Eclipse Duelist
  - **Rook**: Carmilla, The Dread Bastion
  - **Pawn**: Dusk Squire, The Bratty Vanguard

### 🎬 Live Motion Video Showcase (720p HD)
- Integrated high-definition 720p anime motion video loops generated for Sovereigns.
- Multi-video navigation directly inside the Character Codex with intuitive `<` and `>` arrow controls:
  - **Idle Stance**: Seductive breathing, swaying hair, dynamic posture.
  - **Combat Strike**: Action battle cut-in with glowing weapon flourishes and wind effects.
  - **Climax / Victory**: Celebratory triumphant climax pose with radiant magical aura.

### 💬 Dynamic Waifu Coach Commentary & Voice
- Real-time anime coach commentary reacting passionately to your gameplay:
  - **Brilliant Sacrifices (`!!`)**: Ecstatic praises and flushed admiration.
  - **Blunders (`??`) & Mistakes (`?`)**: Dramatic scolding, playful teasing, and desperate pleas.
  - **Dubious Moves (`?!`) & Tactical Wins**: Insightful tsundere and kuudere evaluations.
  - **Promotions & Checkmates**: Triumphant victory fanfares.
- Whispered Stockfish best-move suggestions with instant PGN commentary export.

### ♟️ Bespoke Anime Chibi Piece Set
- Custom-crafted 2D anime chibi character sprites rendered cleanly via Chessground for both Dawn (ivory/pink) and Dusk (charcoal/gold) sides.

### ⚡ Professional Chess Toolkit (En Croissant Engine)
- **UCI Engine Management**: Multi-PV evaluation powered by Stockfish 17, Maia neural networks, and custom engines.
- **Game Review & Graphs**: Full-game precision graphs, centipawn loss analysis, and blunder detection.
- **Chess.com & Lichess Sync**: One-click PGN import, tournament database exploration, and user game downloads.
- **Repertoire Trainer**: Spaced-repetition opening repertoire training with due-card notifications.

---

## 🛠️ Building & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)
- [Rust](https://rustup.rs/) (v1.80+)

### Setup
```bash
# Clone repository
git clone https://github.com/everydayrandomshit5/croissant-sama.git
cd croissant-sama

# Install frontend dependencies
pnpm install

# Run web app in development mode
pnpm start-vite

# Run desktop app via Tauri
pnpm tauri dev

# Build production bundle
pnpm tauri build
```

---

## 📜 Credits & License
- **Original Project:** Forked from [En Croissant](https://github.com/franciscoBSalgueiro/en-croissant) by Francisco Salgueiro and contributors.
- **License:** GNU General Public License v3.0 ([GPL-3.0](./LICENSE)).
