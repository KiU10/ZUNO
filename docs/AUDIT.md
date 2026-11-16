# ZUNO 2.0 audit and implementation notes

## Overview
ZUNO is a static vocabulary-learning app originally built as a single-page site with German UI, vocabulary data, unit-based learning, progress persistence in `localStorage`, and six mascot assets. The project was preserved on the `ZUNO2` branch as a safe development branch without touching `main`.

## Architecture preserved
- Static HTML/CSS/JS app.
- No backend required.
- Data is stored in the app itself and in `localStorage` for progress.
- Core flows: dashboard → settings → exercise → result → stats.
- Vocabulary is split into general language databases and Unit-based vocabulary.

## Learning features preserved
- General exercises by language and level.
- Unit-based lessons.
- Translation, reverse translation and multiple-choice practice.
- Example sentences and audio playback.
- Progress tracking and cumulative XP.
- Saved learning history and per-language statistics.

## Data and assets protected
- Original English and French vocabulary entries remain intact.
- Unit words are kept, including all station data.
- Mascot assets from the existing project remain in use: IMG_2557.png through IMG_2562.png.
- The original localStorage keys are retained so existing user progress remains accessible.

## Known issues addressed in ZUNO 2.0
- Reverse-mode wording no longer leaks the English answer in a German task.
- Multiple-choice distractors are built from thematic vocabulary rather than unrelated items.
- Correct answers auto-advance after the feedback delay.
- Incorrect answers remain manually advanceable.
- Answer normalization handles common short forms and abbreviations more consistently.
- Speech language selection is made explicit for reverse and direct mode.
- Session counting is guarded to avoid double-counting a finished lesson.
- Unit 1, Station 2 was checked and the erroneous Chinese entry was removed from the project data path in the development work.

## Planned improvements for further iteration
- Split the app into dedicated files (`css/`, `js/`, `data/`) when the project grows.
- Add more automated tests for answer normalization and reverse-mode logic.
- Expand the example sentence library and review spacing for difficult phrases.
- Continue tuning the spaced-repetition algorithm to blend old and new words cleanly.
