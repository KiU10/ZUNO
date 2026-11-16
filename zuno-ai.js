
/* =========================================
   ZUNO AI
   English Answer Checker + Synonym Feedback
   Version 2.0
========================================= */

(() => {
  "use strict";

  /* =========================================
     1. SETTINGS
  ========================================= */

  const STORAGE_KEY = "zuno_ai_pending_synonyms_v1";

  /* =========================================
     2. TEXT NORMALIZATION
  ========================================= */

  function normalize(text) {
    return String(text ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/&/g, " and ")
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* =========================================
     3. ENGLISH SYNONYM DATABASE
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

  /*
    Diese Datenbank enthält geprüfte alternative
    deutsche Übersetzungen.

    Neue Einträge werden erst nach unserer Prüfung
    hier ergänzt.
  */

  const translationData = {
    "opportunity": [
      "Chance",
      "Möglichkeit",
      "Gelegenheit"
    ]
  };

  const synonymDatabase = new Map(
    Object.entries(synonymData).map(([word, alternatives]) => [
      normalize(word),
      alternatives
    ])
  );

  /* =========================================
     4. EDIT DISTANCE
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
     5. SYNONYM LOOKUP
  ========================================= */

  function getSynonyms(word) {
    const key = normalize(word);

    const newSynonyms =
      synonymDatabase.get(key) || [];

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
     6. ENGLISH ANSWER CHECKER
  ========================================= */

  function checkEnglishAnswer(answer, word) {
    if (!answer || !word || !word.word) {
      return false;
    }

    const submitted = normalize(answer);

    if (!submitted) return false;

    const expected = normalize(word.word);

    if (isTypoClose(submitted, expected)) {
      return true;
    }

    const acceptedSynonyms = getSynonyms(word.word);

    return acceptedSynonyms.some(synonym =>
      isTypoClose(submitted, normalize(synonym))
    );
  }

  /* =========================================
     7. GERMAN TRANSLATION CHECKER
  ========================================= */

  function checkGermanTranslation(answer, word) {
    if (!answer || !word || !word.word) {
      return false;
    }

    const submitted = normalize(answer);

    if (!submitted) return false;

    const originalTranslations = String(
      word.translation || ""
    )
      .split(";")
      .map(item => item.trim());

    const approvedTranslations =
      translationData[normalize(word.word)] || [];

    const allTranslations = [
      ...originalTranslations,
      ...approvedTranslations
    ];

    return allTranslations.some(translation =>
      isTypoClose(submitted, normalize(translation))
    );
  }

  /* =========================================
     8. PENDING SUGGESTIONS
  ========================================= */

  function getPendingSuggestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not read ZUNO suggestions:", error);
      return [];
    }
  }

  function savePendingSuggestions(suggestions) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(suggestions)
    );
  }

  function createWordKey(word) {
    return [
      normalize(word.word),
      normalize(word.translation),
      word.language || "unknown",
      word.unitKey || "",
      word.id || ""
    ].join("|");
  }

  function addSuggestion(answer, word, mode) {
    const submitted = String(answer ?? "").trim();

    if (!submitted || !word || !word.word) {
      return {
        success: false,
        message: "Der Vorschlag konnte nicht gespeichert werden."
      };
    }

    const suggestions = getPendingSuggestions();

    const wordKey = createWordKey(word);
    const normalizedAnswer = normalize(submitted);

    const alreadyExists = suggestions.some(item =>
      item.wordKey === wordKey &&
      item.mode === mode &&
      normalize(item.answer) === normalizedAnswer
    );

    if (alreadyExists) {
      return {
        success: false,
        message: "Dieser Vorschlag wurde bereits gespeichert."
      };
    }

    const suggestion = {
      id: "zuno-" + Date.now() + "-" +
        Math.random().toString(36).slice(2, 8),

      word: String(word.word),
      translation: String(word.translation || ""),
      answer: submitted,

      language: word.language || "en",
      mode,

      wordKey,

      unitKey: word.unitKey || null,
      wordId: word.id || null,

      createdAt: new Date().toISOString(),

      status: "pending"
    };

    suggestions.push(suggestion);
    savePendingSuggestions(suggestions);
    updateSuggestionPanel();

    return {
      success: true,
      message: "Vorschlag gespeichert!"
    };
  }

  /* =========================================
     9. EXPORT SUGGESTIONS
  ========================================= */

  function exportSuggestions() {
    const suggestions = getPendingSuggestions();

    if (!suggestions.length) {
      alert("Es gibt noch keine Vorschläge zum Exportieren.");
      return;
    }

    const exportData = {
      app: "ZUNO",
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      totalSuggestions: suggestions.length,
      instructions: "Please review every suggestion. Approve correct translations and synonyms. Reject incorrect suggestions.",
      suggestions
    };

    const json = JSON.stringify(exportData, null, 2);

    const blob = new Blob(
      [json],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "zuno-synonym-proposals.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /* =========================================
     10. CLEAR REVIEWED SUGGESTIONS
  ========================================= */

  function clearSuggestions() {
    const suggestions = getPendingSuggestions();

    if (!suggestions.length) {
      alert("Die Vorschlagsliste ist bereits leer.");
      return;
    }

    const confirmed = window.confirm(
      "Möchtest du wirklich alle gespeicherten Vorschläge löschen? " +
      "Stelle sicher, dass du sie vorher exportiert und geprüft hast."
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);

    updateSuggestionPanel();

    alert("Die Vorschlagsliste wurde geleert.");
  }

  /* =========================================
     11. SUGGESTION PANEL
  ========================================= */

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function updateSuggestionPanel() {
    const countElement =
      document.getElementById("zunoSuggestionCount");

    const listElement =
      document.getElementById("zunoSuggestionList");

    if (!countElement || !listElement) return;

    const suggestions = getPendingSuggestions();

    countElement.textContent = suggestions.length;

    if (!suggestions.length) {
      listElement.innerHTML =
        '<p style="color:#777;margin:0;">Noch keine Vorschläge gesammelt.</p>';
      return;
    }

    listElement.innerHTML = suggestions
      .slice(-8)
      .reverse()
      .map(item => {
        const modeLabel =
          item.mode === "reverse"
            ? "Englisches Synonym"
            : "Deutsche Übersetzung";

        return `
          <div style="
            padding:10px 12px;
            margin-top:8px;
            background:#f5f3ff;
            border-radius:12px;
            border:1px solid #e8e3ff;
          ">
            <strong>${escapeHTML(item.word)}</strong>
            <span style="color:#777;"> → </span>
            <strong>${escapeHTML(item.answer)}</strong>
            <div style="font-size:12px;color:#777;margin-top:4px;">
              ${escapeHTML(modeLabel)}
            </div>
          </div>
        `;
      })
      .join("");

    if (suggestions.length > 8) {
      listElement.innerHTML += `
        <p style="font-size:12px;color:#777;margin-top:10px;">
          Und ${suggestions.length - 8} weitere Vorschläge ...
        </p>
      `;
    }
  }

  function createSuggestionPanel() {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    if (document.getElementById("zunoSuggestionPanel")) {
      updateSuggestionPanel();
      return;
    }

    const panel = document.createElement("section");

    panel.id = "zunoSuggestionPanel";

    panel.style.cssText = `
      margin-top:24px;
      padding:20px;
      background:white;
      border:1px solid #e9e6f4;
      border-radius:20px;
      box-shadow:0 6px 20px rgba(30,25,60,.04);
    `;

    panel.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
      ">
        <div>
          <div style="font-size:12px;font-weight:800;color:#7d69e8;letter-spacing:.08em;">
            ZUNO AI
          </div>
          <h2 style="margin:5px 0;">🧠 Synonym-Vorschläge</h2>
          <p style="margin:0;color:#777;font-size:14px;line-height:1.5;">
            Deine Vorschläge werden gesammelt und erst nach einer Prüfung übernommen.
          </p>
        </div>

        <div style="
          min-width:54px;
          height:54px;
          display:grid;
          place-items:center;
          border-radius:16px;
          background:#f0edff;
          color:#6552c8;
          font-size:22px;
          font-weight:900;
        ">
          <span id="zunoSuggestionCount">0</span>
        </div>
      </div>

      <div id="zunoSuggestionList" style="margin-top:16px;"></div>

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:18px;
      ">
        <button
          type="button"
          id="zunoExportSuggestions"
          style="
            border:0;
            border-radius:12px;
            padding:12px 16px;
            background:#7d69e8;
            color:white;
            font-weight:800;
            cursor:pointer;
          "
        >
          ↓ Vorschläge exportieren
        </button>

        <button
          type="button"
          id="zunoClearSuggestions"
          style="
            border:1px solid #e5e2ed;
            border-radius:12px;
            padding:12px 16px;
            background:white;
            color:#777;
            font-weight:700;
            cursor:pointer;
          "
        >
          Liste leeren
        </button>
      </div>

      <p style="
        margin:12px 0 0;
        color:#888;
        font-size:12px;
        line-height:1.5;
      ">
        Vorschläge bleiben auf diesem Gerät gespeichert.
        Sie gelten noch nicht als richtige Antworten.
      </p>
    `;

    dashboard.appendChild(panel);

    document
      .getElementById("zunoExportSuggestions")
      .addEventListener("click", exportSuggestions);

    document
      .getElementById("zunoClearSuggestions")
      .addEventListener("click", clearSuggestions);

    updateSuggestionPanel();
  }

  /* =========================================
     12. "I WAS RIGHT" BUTTON
  ========================================= */

  function addChallengeButton(answer, word, mode) {
    const feedback = document.getElementById("feedbackArea");

    if (!feedback) return;

    if (document.getElementById("zunoChallengeButton")) {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.style.cssText = `
      margin-top:12px;
      text-align:center;
    `;

    const button = document.createElement("button");

    button.id = "zunoChallengeButton";
    button.type = "button";
    button.textContent = "🤔 Ich hatte Recht";

    button.style.cssText = `
      width:100%;
      padding:13px 16px;
      border:1px solid #ded8ff;
      border-radius:13px;
      background:#f5f2ff;
      color:#6552c8;
      font-weight:800;
      cursor:pointer;
    `;

    button.addEventListener("click", () => {
      const modeDescription =
        mode === "reverse"
          ? "als englisches Synonym"
          : "als deutsche Übersetzung";

      const confirmed = window.confirm(
        `Soll "${answer}" für "${word.word}" ${modeDescription} ` +
        "zur Prüfung vorgeschlagen werden?\n\n" +
        "Der Vorschlag wird NICHT automatisch als richtig akzeptiert."
      );

      if (!confirmed) return;

      const result = addSuggestion(answer, word, mode);

      if (result.success) {
        button.textContent = "✓ Vorschlag gespeichert";
        button.disabled = true;

        button.style.background = "#eaf7e8";
        button.style.color = "#397c38";
        button.style.borderColor = "#c8e6c4";

        alert(
          "Dein Vorschlag wurde gespeichert!\n\n" +
          "Er wird erst nach einer Prüfung übernommen."
        );
      } else {
        alert(result.message);
      }
    });

    wrapper.appendChild(button);
    feedback.appendChild(wrapper);
  }

  /* =========================================
     13. CONNECT TO ZUNO ANSWER CHECKER
  ========================================= */

  const previousChecker = window.answerMatches;

  window.answerMatches = function(answer, word) {
    if (!word) return false;

    // Keep all original rules first.
    if (
      typeof previousChecker === "function" &&
      previousChecker(answer, word)
    ) {
      return true;
    }

    if (
      typeof state === "undefined" ||
      word.language !== "en"
    ) {
      return false;
    }

    // English synonym checking.
    if (state.currentMode === "reverse") {
      return checkEnglishAnswer(answer, word);
    }

    // Alternative German translations.
    if (state.currentMode === "input") {
      return checkGermanTranslation(answer, word);
    }

    return false;
  };

  /* =========================================
     14. CONNECT TO ANSWER FEEDBACK
  ========================================= */

  const previousCheckAnswer = window.checkAnswer;

  if (typeof previousCheckAnswer === "function") {
    window.checkAnswer = function(answer, word) {
      const wasAlreadyAnswered =
        typeof state !== "undefined" && state.answered;

      const mode = state.currentMode;
      const wrongBefore = Number(state.wrong) || 0;

      const result = previousCheckAnswer.apply(this, arguments);

      const becameWrong =
        !wasAlreadyAnswered &&
        state.answered &&
        (Number(state.wrong) || 0) > wrongBefore;

      // Only collect typed English vocabulary answers.
      if (
        becameWrong &&
        word &&
        word.language === "en" &&
        (mode === "input" || mode === "reverse") &&
        String(answer ?? "").trim()
      ) {
        addChallengeButton(answer, word, mode);
      }

      return result;
    };
  }

  /* =========================================
     15. PUBLIC INTERFACE
  ========================================= */

  window.ZUNOAI = {
    version: "2.0",

    normalize,
    checkEnglishAnswer,
    checkGermanTranslation,
    getSynonyms,

    getPendingSuggestions,
    addSuggestion,
    exportSuggestions,
    clearSuggestions,

    updateSuggestionPanel
  };

  /* =========================================
     16. INITIALIZE
  ========================================= */

  createSuggestionPanel();

  console.log(
    "ZUNO AI v2.0 loaded. Synonym feedback system ready."
  );

})();
