
/* =========================================
   ZUNO AI
   Answer Checker + Synonym Feedback
   Version 2.1
========================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "zuno_ai_pending_synonyms_v1";

  /* =========================================
     1. NORMALIZATION
  ========================================= */

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/\s*\((?:infml|informal|umgangssprachlich|d\.?\s*h\.?)\)\s*/gi, " ")
      .replace(/\bsth\b/g, "something")
      .replace(/\bsb\b/g, "somebody")
      .replace(/\betw\b/g, "etwas")
      .replace(/\bjmdm\b/g, "jemandem")
      .replace(/\bjmdn\b/g, "jemanden")
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function unique(values) {
    return [...new Set(values.map(normalize).filter(Boolean))];
  }

  /* =========================================
     2. APPROVED ENGLISH SYNONYMS
  ========================================= */

  const synonymData = {
    "to be short of sth": [
      "to lack something",
      "not have enough of something"
    ],

    "to manage (to do sth)": [
      "to succeed in doing something",
      "to be able to do something"
    ],

    "to apply (for)": [
      "to make an application",
      "to submit an application"
    ],

    "to bump into sb": [
      "to meet somebody by chance",
      "to run into somebody",
      "to meet someone unexpectedly"
    ],

    "to learn by heart": [
      "to memorize",
      "to memorise"
    ],

    "to make progress": [
      "to improve",
      "to get better"
    ],

    "to be stuck": [
      "to be unable to move",
      "to be unable to continue",
      "to be trapped"
    ],

    "to communicate": [
      "to exchange information",
      "to get a message across"
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
      "to achieve your goal"
    ],

    "to prevent": [
      "to stop something from happening",
      "to keep something from happening"
    ],

    "to assist": [
      "to help",
      "to give someone a hand"
    ],

    "to overhear": [
      "to hear something accidentally",
      "to hear without intending to"
    ],

    "to respect": [
      "to show respect for",
      "to value"
    ],

    "to distract": [
      "to take somebody's attention away",
      "to divert someone's attention"
    ],

    "to glow": [
      "to shine softly",
      "to give off light"
    ],

    "to sigh": [
      "to breathe out deeply"
    ],

    "to sting": [
      "to cause a sharp pain"
    ],

    "community": [
      "a group of people living in the same area"
    ],

    "ancestor": [
      "a person you are descended from",
      "a family member from long ago"
    ],

    "perhaps": [
      "maybe",
      "possibly"
    ],

    "i.e.": [
      "that is",
      "in other words"
    ]
  };

  /* =========================================
     3. APPROVED GERMAN TRANSLATIONS
  ========================================= */

  const translationData = {
    "opportunity": [
      "Chance",
      "Möglichkeit",
      "Gelegenheit"
    ],

    "actual": [
      "wirklich"
    ],

    "remain": [
      "verbleiben"
    ]
  };

  /* =========================================
     4. CONTROLLED VERB FORMS
  ========================================= */

  const irregularVerbs = {
    be: ["be", "am", "is", "are", "was", "were", "been", "being"],
    have: ["have", "has", "had", "having"],
    do: ["do", "does", "did", "done", "doing"],
    go: ["go", "goes", "went", "gone", "going"],
    get: ["get", "gets", "got", "gotten", "getting"],
    make: ["make", "makes", "made", "making"],
    take: ["take", "takes", "took", "taken", "taking"],
    speak: ["speak", "speaks", "spoke", "spoken", "speaking"],
    understand: ["understand", "understands", "understood", "understanding"],
    learn: ["learn", "learns", "learned", "learnt", "learning"],
    catch: ["catch", "catches", "caught", "catching"],
    bring: ["bring", "brings", "brought", "bringing"],
    think: ["think", "thinks", "thought", "thinking"],
    write: ["write", "writes", "wrote", "written", "writing"],
    read: ["read", "reads", "reading"],
    say: ["say", "says", "said", "saying"],
    run: ["run", "runs", "ran", "running"],
    meet: ["meet", "meets", "met", "meeting"],
    leave: ["leave", "leaves", "left", "leaving"],
    come: ["come", "comes", "came", "coming"],
    sink: ["sink", "sinks", "sank", "sunk", "sinking"],
    keep: ["keep", "keeps", "kept", "keeping"],
    know: ["know", "knows", "knew", "known", "knowing"],
    become: ["become", "becomes", "became", "becoming"],
    find: ["find", "finds", "found", "finding"],
    feel: ["feel", "feels", "felt", "feeling"],
    teach: ["teach", "teaches", "taught", "teaching"]
  };

  function regularVerbForms(verb) {
    const forms = [verb];

    if (verb.endsWith("y") && !/[aeiou]y$/.test(verb)) {
      forms.push(
        verb.slice(0, -1) + "ies",
        verb.slice(0, -1) + "ied",
        verb.slice(0, -1) + "ying"
      );
    } else if (verb.endsWith("e")) {
      forms.push(
        verb + "s",
        verb + "d",
        verb.slice(0, -1) + "ing"
      );
    } else {
      forms.push(
        verb + "s",
        verb + "ed",
        verb + "ing"
      );

      if (
        verb.length <= 5 &&
        !/[wxy]$/.test(verb) &&
        /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(verb)
      ) {
        const doubled = verb + verb.slice(-1);

        forms.push(
          doubled + "ed",
          doubled + "ing"
        );
      }
    }

    return forms;
  }

  function getVerbForms(verb) {
    return irregularVerbs[verb] || regularVerbForms(verb);
  }

  function getHeadwordForms(word) {
    let phrase = normalize(word);

    phrase = phrase.replace(/^to\s+/, "");

    // Convert usage notes into usable phrase parts.
    phrase = phrase.replace(/\s*\(\s*(for|to|in|from|at|on)\s*\)/g, " $1");
    phrase = phrase.replace(/\s*\(\+\s*-ing\)/g, "");

    const result = [normalize(word), phrase];

    if (!phrase) return unique(result);

    // Handle "to be ..." phrases.
    if (phrase.startsWith("be ")) {
      const remainder = phrase.slice(3);

      ["am", "is", "are", "was", "were", "been", "being"].forEach(form => {
        result.push(form + " " + remainder);
      });

      return unique(result);
    }

    const match = phrase.match(/^([a-z']+)(.*)$/);

    if (!match) return unique(result);

    const verb = match[1];
    const remainder = match[2] || "";

    getVerbForms(verb).forEach(form => {
      result.push(form + remainder);
    });

    return unique(result);
  }

  /* =========================================
     5. SYNONYM LOOKUP
  ========================================= */

  function getSynonyms(word) {
    const key = normalize(word);

    const modern = Object.entries(synonymData)
      .filter(([name]) => normalize(name) === key)
      .flatMap(([, values]) => values);

    let legacy = [];

    try {
      if (typeof zunoAnswerAlternatives !== "undefined") {
        legacy = zunoAnswerAlternatives[String(word).toLowerCase()] || [];
      }
    } catch (_) {}

    return [...new Set([...modern, ...legacy])];
  }

  function acceptedEnglishAnswers(word) {
    const values = [
      ...getHeadwordForms(word),
      ...getSynonyms(word).flatMap(getHeadwordForms)
    ];

    return new Set(unique(values));
  }

  /* =========================================
     6. ENGLISH ANSWER CHECKING
  ========================================= */

  function checkEnglishAnswer(answer, word) {
    if (!answer || !word || !word.word) return false;

    const submitted = normalize(answer);
    if (!submitted) return false;

    return acceptedEnglishAnswers(word.word).has(submitted);
  }

  /* =========================================
     7. GERMAN TRANSLATION CHECKING
  ========================================= */

  function germanVariants(value) {
    const raw = String(value ?? "").trim();
    const variants = [raw];

    // Neuseeländer/-in -> Neuseeländer / Neuseeländerin
    const genderMatch = raw.match(/^(.+?)\/-in$/i);

    if (genderMatch) {
      variants.push(
        genderMatch[1],
        genderMatch[1] + "in"
      );
    }

    return unique(variants);
  }

  function checkGermanTranslation(answer, word) {
    if (!answer || !word || !word.word) return false;

    const submitted = normalize(answer);
    if (!submitted) return false;

    const original = String(word.translation || "")
      .split(";")
      .map(item => item.trim());

    const approved =
      translationData[normalize(word.word)] || [];

    const candidates = [
      ...original,
      ...approved
    ].flatMap(germanVariants);

    return unique(candidates).includes(submitted);
  }

  /* =========================================
     8. SUGGESTION STORAGE
  ========================================= */

  function getPendingSuggestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("ZUNO suggestions:", error);
      return [];
    }
  }

  function savePendingSuggestions(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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

    const duplicate = suggestions.some(item =>
      item.wordKey === wordKey &&
      item.mode === mode &&
      normalize(item.answer) === normalize(submitted)
    );

    if (duplicate) {
      return {
        success: false,
        message: "Dieser Vorschlag wurde bereits gespeichert."
      };
    }

    suggestions.push({
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
    });

    savePendingSuggestions(suggestions);
    updateSuggestionPanel();

    return {
      success: true,
      message: "Vorschlag gespeichert!"
    };
  }

  /* =========================================
     9. EXPORT AND CLEAR
  ========================================= */

  function exportSuggestions() {
    const suggestions = getPendingSuggestions();

    if (!suggestions.length) {
      alert("Es gibt noch keine Vorschläge zum Exportieren.");
      return;
    }

    const data = {
      app: "ZUNO",
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      totalSuggestions: suggestions.length,
      suggestions
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
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

  function clearSuggestions() {
    const suggestions = getPendingSuggestions();

    if (!suggestions.length) {
      alert("Die Vorschlagsliste ist bereits leer.");
      return;
    }

    if (!confirm(
      "Möchtest du wirklich alle Vorschläge löschen? " +
      "Exportiere sie vorher, wenn du sie behalten möchtest."
    )) return;

    localStorage.removeItem(STORAGE_KEY);
    updateSuggestionPanel();

    alert("Die Vorschlagsliste wurde geleert.");
  }

  /* =========================================
     10. SUGGESTION PANEL
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
    const count = document.getElementById("zunoSuggestionCount");
    const list = document.getElementById("zunoSuggestionList");

    if (!count || !list) return;

    const suggestions = getPendingSuggestions();

    count.textContent = suggestions.length;

    if (!suggestions.length) {
      list.innerHTML =
        '<p style="color:#777;margin:0;">Noch keine Vorschläge gesammelt.</p>';
      return;
    }

    list.innerHTML = suggestions
      .slice(-8)
      .reverse()
      .map(item => `
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
            ${item.mode === "reverse"
              ? "Englisches Synonym"
              : "Deutsche Übersetzung"}
          </div>
        </div>
      `)
      .join("");

    if (suggestions.length > 8) {
      list.innerHTML += `
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
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <div style="font-size:12px;font-weight:800;color:#7d69e8;letter-spacing:.08em;">
            ZUNO AI
          </div>
          <h2 style="margin:5px 0;">🧠 Synonym-Vorschläge</h2>
          <p style="margin:0;color:#777;font-size:14px;">
            Vorschläge werden erst nach einer Prüfung übernommen.
          </p>
        </div>
        <div style="
          min-width:54px;height:54px;display:grid;place-items:center;
          border-radius:16px;background:#f0edff;color:#6552c8;
          font-size:22px;font-weight:900;
        ">
          <span id="zunoSuggestionCount">0</span>
        </div>
      </div>

      <div id="zunoSuggestionList" style="margin-top:16px;"></div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;">
        <button type="button" id="zunoExportSuggestions"
          style="border:0;border-radius:12px;padding:12px 16px;
          background:#7d69e8;color:white;font-weight:800;">
          ↓ Vorschläge exportieren
        </button>

        <button type="button" id="zunoClearSuggestions"
          style="border:1px solid #e5e2ed;border-radius:12px;
          padding:12px 16px;background:white;color:#777;font-weight:700;">
          Liste leeren
        </button>
      </div>

      <p style="margin:12px 0 0;color:#888;font-size:12px;">
        Vorschläge bleiben auf diesem Gerät gespeichert.
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
     11. CHALLENGE BUTTON
  ========================================= */

  function addChallengeButton(answer, word, mode) {
    const feedback = document.getElementById("feedbackArea");

    if (!feedback || document.getElementById("zunoChallengeButton")) {
      return;
    }

    const button = document.createElement("button");

    button.id = "zunoChallengeButton";
    button.type = "button";
    button.textContent = "🤔 Ich hatte Recht";

    button.style.cssText = `
      width:100%;
      margin-top:12px;
      padding:13px 16px;
      border:1px solid #ded8ff;
      border-radius:13px;
      background:#f5f2ff;
      color:#6552c8;
      font-weight:800;
      cursor:pointer;
    `;

    button.addEventListener("click", () => {
      const description = mode === "reverse"
        ? "als englisches Synonym"
        : "als deutsche Übersetzung";

      if (!confirm(
        `Soll "${answer}" für "${word.word}" ${description} ` +
        "zur Prüfung vorgeschlagen werden?\n\n" +
        "Der Vorschlag wird nicht automatisch akzeptiert."
      )) return;

      const result = addSuggestion(answer, word, mode);

      if (!result.success) {
        alert(result.message);
        return;
      }

      button.textContent = "✓ Vorschlag gespeichert";
      button.disabled = true;
      button.style.background = "#eaf7e8";
      button.style.color = "#397c38";

      alert("Dein Vorschlag wurde gespeichert!");
    });

    feedback.appendChild(button);
  }

  /* =========================================
     12. CONNECT ANSWER CHECKER
  ========================================= */

  const previousChecker = window.answerMatches;

  window.answerMatches = function(answer, word) {
    if (!word) return false;

    const mode =
      typeof state !== "undefined"
        ? state.currentMode
        : "";

    // English typed answers use the stricter ZUNO checker.
    if (word.language === "en" && mode === "reverse") {
      return checkEnglishAnswer(answer, word);
    }

    if (word.language === "en" && mode === "input") {
      return checkGermanTranslation(answer, word);
    }

    // Keep original behavior for multiple choice and other languages.
    if (typeof previousChecker === "function") {
      return previousChecker.apply(this, arguments);
    }

    return false;
  };

  /* =========================================
     13. CONNECT FEEDBACK
  ========================================= */

  const previousCheckAnswer = window.checkAnswer;

  if (typeof previousCheckAnswer === "function") {
    window.checkAnswer = function(answer, word) {
      const wasAnswered =
        typeof state !== "undefined" && state.answered;

      const mode = state.currentMode;
      const wrongBefore = Number(state.wrong) || 0;

      const result = previousCheckAnswer.apply(this, arguments);

      const becameWrong =
        !wasAnswered &&
        state.answered &&
        (Number(state.wrong) || 0) > wrongBefore;

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
     14. PUBLIC INTERFACE
  ========================================= */

  window.ZUNOAI = {
    version: "2.1",
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
     15. INITIALIZE
  ========================================= */

  createSuggestionPanel();

  console.log("ZUNO AI v2.1 loaded.");
})();
