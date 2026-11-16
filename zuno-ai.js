/* =========================================
   ZUNO AI
   English Answer Checker
   Version 1.0
========================================= */

(() => {
  "use strict";

  /* =========================================
     1. TEXT NORMALIZATION
  ========================================= */

  function normalize(text) {
    return String(text ?? "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* =========================================
     2. ENGLISH SYNONYM DATABASE
  ========================================= */

  const synonymData = {
    "to be short of sth": [
      "to be short of something",
      "to lack something",
      "not have enough of something",
      "to not have enough"
    ],

    "to manage (to do sth)": [
      "to manage to do something",
      "to succeed in doing something",
      "to be able to do something"
    ],

    "to apply (for)": [
      "to make an application",
      "to submit an application",
      "to ask for"
    ],

    "to bump into sb": [
      "to bump into somebody",
      "to meet somebody by chance",
      "to run into somebody",
      "to meet someone unexpectedly"
    ],

    "to learn by heart": [
      "to memorize",
      "to memorise",
      "to learn something from memory"
    ],

    "to make progress": [
      "to improve",
      "to get better",
      "to develop"
    ],

    "to be stuck": [
      "to be unable to move",
      "to be unable to continue",
      "to be trapped"
    ],

    "to communicate": [
      "to exchange information",
      "to get a message across",
      "to talk to each other"
    ],

    "to immigrate": [
      "to move to another country",
      "to come to live in a country"
    ],

    "to emigrate": [
      "to leave your own country to live elsewhere",
      "to move away from your country"
    ],

    "to succeed (in)": [
      "to be successful",
      "to manage",
      "to achieve your goal"
    ],

    "to prevent": [
      "to stop something from happening",
      "to keep something from happening",
      "to avoid"
    ],

    "to assist": [
      "to help",
      "help",
      "to give someone a hand"
    ],

    "to overhear": [
      "to hear something accidentally",
      "to hear without intending to",
      "to accidentally hear"
    ],

    "to respect": [
      "to show respect for",
      "to value",
      "to treat someone properly"
    ],

    "to distract": [
      "to take somebody's attention away",
      "to take someone's attention away",
      "to disturb"
    ],

    "to glow": [
      "to shine softly",
      "to give off light",
      "to shine"
    ]
  };

  // Normalize database keys once.
  const synonymDatabase = new Map(
    Object.entries(synonymData).map(([word, alternatives]) => [
      normalize(word),
      alternatives
    ])
  );

  /* =========================================
     3. EDIT DISTANCE
  ========================================= */

  function editDistance(a, b) {
    const row = Array.from(
      { length: b.length + 1 },
      (_, index) => index
    );

    for (let i = 1; i <= a.length; i++) {
      let previous = row[0];
      row[0] = i;

      for (let j = 1; j <= b.length; j++) {
        const oldValue = row[j];

        row[j] = Math.min(
          row[j] + 1,
          row[j - 1] + 1,
          previous + (a[i - 1] === b[j - 1] ? 0 : 1)
        );

        previous = oldValue;
      }
    }

    return row[b.length];
  }

  function isTypoClose(submitted, expected) {
    if (!submitted || !expected) return false;
    if (submitted === expected) return true;

    // Avoid overly generous matching for short words.
    if (submitted.length < 5 || expected.length < 5) {
      return false;
    }

    const longest = Math.max(
      submitted.length,
      expected.length
    );

    const allowedDistance = longest >= 10 ? 2 : 1;

    return editDistance(submitted, expected) <= allowedDistance;
  }

  /* =========================================
     4. GET ACCEPTED SYNONYMS
  ========================================= */

  function getSynonyms(word) {
    const key = normalize(word);

    const newSynonyms =
      synonymDatabase.get(key) || [];

    // Keep the alternatives from the previous ZUNO patch.
    const oldSynonyms =
      typeof zunoAnswerAlternatives !== "undefined"
        ? zunoAnswerAlternatives[String(word).toLowerCase()] || []
        : [];

    return [...new Set([
      ...newSynonyms,
      ...oldSynonyms
    ])];
  }

  /* =========================================
     5. ENGLISH ANSWER CHECKER
  ========================================= */

  function checkEnglishAnswer(answer, word) {
    if (!answer || !word || !word.word) {
      return false;
    }

    const submitted = normalize(answer);

    if (!submitted) return false;

    const expected = normalize(word.word);

    // Check the original vocabulary word.
    if (isTypoClose(submitted, expected)) {
      return true;
    }

    // Check accepted synonyms.
    const acceptedSynonyms = getSynonyms(word.word);

    return acceptedSynonyms.some(synonym =>
      isTypoClose(submitted, normalize(synonym))
    );
  }

  /* =========================================
     6. CONNECT TO ZUNO
  ========================================= */

  const previousChecker = window.answerMatches;

  window.answerMatches = function(answer, word) {
    if (!word) return false;

    // Keep the existing checker for other languages,
    // multiple choice and normal translation questions.
    if (
      typeof state === "undefined" ||
      state.currentMode !== "reverse" ||
      word.language !== "en"
    ) {
      return typeof previousChecker === "function"
        ? previousChecker(answer, word)
        : false;
    }

    // First preserve all existing ZUNO rules.
    if (
      typeof previousChecker === "function" &&
      previousChecker(answer, word)
    ) {
      return true;
    }

    // Then use the new English synonym checker.
    return checkEnglishAnswer(answer, word);
  };

  /* =========================================
     7. PUBLIC INTERFACE
  ========================================= */

  window.ZUNOAI = {
    version: "1.0",
    normalize,
    checkEnglishAnswer,
    getSynonyms
  };

  console.log("ZUNO AI English Checker v1.0 loaded.");

})();
