# ZUNO 2.0 architecture

## Current static architecture
The project is intentionally lightweight and static. This makes it easy to preview locally and keeps it compatible with GitHub Pages.

## Core runtime structure
- `index.html`: complete app shell, UI layout, style block, and app logic.
- `IMG_2557.png` to `IMG_2562.png`: mascot assets used for states such as welcome, study, celebration, thinking, sleep, and positive feedback.
- `localStorage`: stores progression metadata like XP, streak, learned items and per-language stats.

## Why this structure is safe
- No deployment to the live `main` branch.
- No backend service dependency.
- The app can work as a local static preview or through a simple local HTTP server.
- All core logic remains contained to one document, improving reliability when preserving the original project.

## Data model
- `languageDatabases` stores general vocabulary by language and level.
- `unitVocabulary` stores unit-based phrase sets and sections.
- `exampleSentences` gives context examples for words used in exercise screens.
- `state` holds the active lesson, score, XP, and per-word learning progress.

## Progress safety design
- Existing keys are read defensively before use.
- Missing or malformed JSON is handled with a fallback value.
- Learn status is merged without overwriting prior entries.
- Completed lessons are recorded once and session counters are guarded against double-counting.

## Recommended next step
For a fuller modular version, we can move the vocabulary and logic into `data/` and `js/` files while keeping the same storage contract and UI structure.
