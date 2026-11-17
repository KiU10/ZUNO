/* =========================================
   ZUNO AI
   Answer Checker + Shared Synonym Feedback
   Version 3.0
========================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "zuno_ai_pending_synonyms_v1";

  const SUPABASE_URL = "https://nmowzwrxcbvvzodmxlao.supabase.co";
  const SUPABASE_KEY = "sb_publishable_tMDQZ8FJgjtCbTHMxBvGEw_3Cuwymj-";
  const SUPABASE_TABLE = "synonym_suggestions";

  const approvedSynonyms = new Map();
  const approvedTranslations = new Map();

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
      "not have enough of something",
      "to have too little of something"
    ],

    "to manage (to do sth)": [
      "to succeed in doing something",
      "to be able to do something",
      "to find a way to do something"
    ],

    "to apply (for)": [
      "to make an application",
      "to submit an application",
      "to ask for"
    ],

    "to bump into sb": [
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
      "to share information"
    ],

    "to immigrate": [
      "to move to another country",
      "to come to live in a country",
      "to settle in another country"
    ],

    "to emigrate": [
      "to leave your own country to live elsewhere",
      "to move away from your country",
      "to leave one's homeland"
    ],

    "to succeed (in)": [
      "to be successful",
      "to achieve your goal",
      "to manage"
    ],

    "to prevent": [
      "to stop something from happening",
      "to keep something from happening",
      "to avoid"
    ],

    "to assist": [
      "to help",
      "to give someone a hand",
      "to support"
    ],

    "to overhear": [
      "to hear something accidentally",
      "to hear without intending to",
      "to accidentally hear"
    ],

    "to respect": [
      "to show respect for",
      "to value",
      "to treat someone with respect"
    ],

    "to distract": [
      "to take somebody's attention away",
      "to divert someone's attention",
      "to disturb"
    ],

    "to glow": [
      "to shine softly",
      "to give off light",
      "to shine"
    ],

    "to sigh": [
      "to breathe out deeply",
      "to let out a deep breath"
    ],

    "to sting": [
      "to cause a sharp pain",
      "to hurt with a sharp pain"
    ],

    "community": [
      "a group of people living in the same area",
      "people in a particular area"
    ],

    "ancestor": [
      "a person you are descended from",
      "a family member from long ago",
      "a forefather",
      "a foremother"
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
     3. GERMAN TRANSLATION ALTERNATIVES
  ========================================= */

  const translationData = {
    opportunity: [
      "Chance",
      "Möglichkeit",
      "Gelegenheit"
    ],

    actual: [
      "wirklich",
      "tatsächlich",
      "eigentlich"
    ],

    remain: [
      "verbleiben",
      "übrig bleiben",
      "bleiben"
    ],

    achieve: [
      "erreichen",
      "erzielen",
      "schaffen"
    ],

    "to settle": [
      "sich niederlassen",
      "sich ansiedeln"
    ],

    "to overhear": [
      "mithören",
      "zufällig hören",
      "mitbekommen"
    ],

    "to immigrate": [
      "einwandern"
    ],

    "to emigrate": [
      "auswandern"
    ],

    "to communicate": [
      "kommunizieren",
      "sich verständigen"
    ],

    "to prevent": [
      "verhindern",
      "vermeiden"
    ],

    "to assist": [
      "helfen",
      "unterstützen"
    ],

    "to respect": [
      "respektieren",
      "achten"
    ],

    "to distract": [
      "ablenken",
      "stören"
    ],

    "to glow": [
      "leuchten",
      "glühen"
    ],

    "to sigh": [
      "seufzen"
    ],

    "to sting": [
      "stechen"
    ],

    "to succeed (in)": [
      "es schaffen",
      "erfolgreich sein",
      "gelingen"
    ],

    "to manage (to do sth)": [
      "es schaffen",
      "bewältigen"
    ],

    "to bump into sb": [
      "zufällig treffen",
      "begegnen"
    ],

    "to apply (for)": [
      "sich bewerben",
      "beantragen"
    ],

    "to make progress": [
      "Fortschritte machen",
      "vorankommen"
    ],

    "to be short of sth": [
      "nicht genug haben",
      "fehlen"
    ],

    "to be stuck": [
      "feststecken",
      "festsitzen",
      "nicht weiterkommen"
    ],

    "to learn by heart": [
      "auswendig lernen"
    ],

    "to head (for/to)": [
      "sich auf den Weg machen",
      "steuern auf"
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
    teach: ["teach", "teaches", "taught", "teaching"],
    shine: ["shine", "shines", "shone", "shining"],
    bring: ["bring", "brings", "brought", "bringing"],
    buy: ["buy", "buys", "bought", "buying"],
    think: ["think", "thinks", "thought", "thinking"],
    fight: ["fight", "fights", "fought", "fighting"],
    stand: ["stand", "stands", "stood", "standing"],
    sit: ["sit", "sits", "sat", "sitting"],
    hold: ["hold", "holds", "held", "holding"],
    tell: ["tell", "tells", "told", "telling"],
    win: ["win", "wins", "won", "winning"],
    lose: ["lose", "loses", "lost", "losing"],
    send: ["send", "sends", "sent", "sending"],
    build: ["build", "builds", "built", "building"],
    break: ["break", "breaks", "broke", "broken", "breaking"],
    choose: ["choose", "chooses", "chose", "chosen", "choosing"],
    drive: ["drive", "drives", "drove", "driven", "driving"],
    eat: ["eat", "eats", "ate", "eaten", "eating"],
    fall: ["fall", "falls", "fell", "fallen", "falling"],
    fly: ["fly", "flies", "flew", "flown", "flying"],
    grow: ["grow", "grows", "grew", "grown", "growing"],
    hear: ["hear", "hears", "heard", "hearing"],
    hide: ["hide", "hides", "hid", "hidden", "hiding"],
    hold: ["hold", "holds", "held", "holding"],
    pay: ["pay", "pays", "paid", "paying"],
    sell: ["sell", "sells", "sold", "selling"],
    swim: ["swim", "swims", "swam", "swum", "swimming"],
    wear: ["wear", "wears", "wore", "worn", "wearing"]
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
        forms.push(doubled + "ed", doubled + "ing");
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
    phrase = phrase.replace(/\s*\(\s*(for|to|in|from|at|on)\s*\)/g, " $1");
    phrase = phrase.replace(/\s*\(\+\s*-ing\)/g, "");

    const result = [normalize(word), phrase];

    if (!phrase) return unique(result);

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
     5. SUPABASE
  ========================================= */

  function supabaseHeaders(extra = {}) {
    return {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      ...extra
    };
  }

  async function uploadSuggestion(suggestion) {
    const payload = {
      word: suggestion.word,
      translation: suggestion.translation,
      answer: suggestion.answer,
      language: suggestion.language,
      mode: suggestion.mode,
      word_key: suggestion.wordKey,
      unit_key: suggestion.unitKey,
      word_id: suggestion.wordId,
      created_at: suggestion.createdAt,
      status: "pending"
    };

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/" + SUPABASE_TABLE,
      {
        method: "POST",
        headers: supabaseHeaders({
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        }),
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return true;
  }

  async function fetchApprovedSuggestions() {
    const url = new URL(
      SUPABASE_URL + "/rest/v1/" + SUPABASE_TABLE
    );

    url.searchParams.set("select", "word,answer,language,mode,status");
    url.searchParams.set("status", "eq.approved");
    url.searchParams.set("limit", "1000");

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: supabaseHeaders()
      });

      if (!response.ok) throw new Error(await response.text());

      const rows = await response.json();

      approvedSynonyms.clear();
      approvedTranslations.clear();

      rows.forEach(item => {
        if (!item.word || !item.answer) return;

        const key = normalize(item.word);
        const answer = String(item.answer).trim();

        const target = item.mode === "reverse"
          ? approvedSynonyms
          : item.mode === "input"
            ? approvedTranslations
            : null;

        if (!target) return;

        if (!target.has(key)) target.set(key, []);
        target.get(key).push(answer);
      });

      updateSuggestionPanel();

      console.log("ZUNO AI: Approved suggestions loaded:", rows.length);
      return rows.length;

    } catch (error) {
      console.warn("ZUNO AI: Shared suggestions unavailable:", error);
      return 0;
    }
  }

  /* =========================================
     6. SYNONYM LOOKUP
  ========================================= */

  function getSynonyms(word) {
    const key = normalize(word);

    const modern = Object.entries(synonymData)
      .filter(([name]) => normalize(name) === key)
      .flatMap(([, values]) => values);

    const shared = approvedSynonyms.get(key) || [];

    let legacy = [];

    try {
      if (typeof zunoAnswerAlternatives !== "undefined") {
        const legacyMap = zunoAnswerAlternatives || {};

        const matchingKey = Object.keys(legacyMap).find(
          name => normalize(name) === key
        );

        if (matchingKey) legacy = legacyMap[matchingKey];
      }
    } catch (_) {}

    return [...new Set([...modern, ...shared, ...legacy])];
  }

  function acceptedEnglishAnswers(word) {
    const values = [
      ...getHeadwordForms(word),
      ...getSynonyms(word).flatMap(getHeadwordForms)
    ];

    return new Set(unique(values));
  }

  /* =========================================
     7. ENGLISH ANSWER CHECKING
  ========================================= */

  function checkEnglishAnswer(answer, word) {
    if (!answer || !word || !word.word) return false;

    const submitted = normalize(answer);
    if (!submitted) return false;

    return acceptedEnglishAnswers(word.word).has(submitted);
  }

  /* =========================================
     8. GERMAN TRANSLATION CHECKING
  ========================================= */

  function germanVariants(value) {
    const raw = String(value ?? "").trim();
    const variants = [raw];

    const genderMatch = raw.match(/^(.+?)\/-in$/i);

    if (genderMatch) {
      variants.push(
        genderMatch[1],
        genderMatch[1] + "in"
      );
    }

    return unique(variants);
  }

  function getTranslationAlternatives(word) {
    const key = normalize(word.word);

    const modernKey = Object.keys(translationData).find(
      name => normalize(name) === key
    );

    const modern = modernKey ? translationData[modernKey] : [];

    const shared = approvedTranslations.get(key) || [];

    return [...modern, ...shared];
  }

  function checkGermanTranslation(answer, word) {
    if (!answer || !word || !word.word) return false;

    const submitted = normalize(answer);
    if (!submitted) return false;

    const original = String(word.translation || "")
      .split(";")
      .map(item => item.trim());

    const candidates = [
      ...original,
      ...getTranslationAlternatives(word)
    ].flatMap(germanVariants);

    return unique(candidates).includes(submitted);
  }

  /* =========================================
     9. LOCAL SUGGESTION STORAGE
  ========================================= */

  function getPendingSuggestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("ZUNO AI suggestions:", error);
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

  async function addSuggestion(answer, word, mode) {
    const submitted = String(answer ?? "").trim();

    if (!submitted || !word || !word.word) {
      return {
        success: false,
        uploaded: false,
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
        uploaded: false,
        message: "Dieser Vorschlag wurde bereits auf diesem Gerät gespeichert."
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
      unitKey: word.unitKey == null ? null : String(word.unitKey),
      wordId: word.id == null ? null : String(word.id),
      createdAt: new Date().toISOString(),
      status: "pending",
      uploaded: false
    };

    suggestions.push(suggestion);
    savePendingSuggestions(suggestions);
    updateSuggestionPanel();

    try {
      await uploadSuggestion(suggestion);

      suggestion.uploaded = true;
      savePendingSuggestions(suggestions);
      updateSuggestionPanel();

      return {
        success: true,
        uploaded: true,
        message: "Vorschlag gespeichert und an ZUNO gesendet!"
      };

    } catch (error) {
      console.error("ZUNO AI upload:", error);

      return {
        success: true,
        uploaded: false,
        message:
          "Lokal gespeichert, aber der Upload ist fehlgeschlagen. " +
          "Der Vorschlag bleibt auf diesem Gerät erhalten."
      };
    }
  }

  /* =========================================
     10. EXPORT AND CLEAR
  ========================================= */

  function exportSuggestions() {
    const suggestions = getPendingSuggestions();

    if (!suggestions.length) {
      alert("Es gibt noch keine Vorschläge zum Exportieren.");
      return;
    }

    const data = {
      app: "ZUNO",
      exportVersion: 3,
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
      "Möchtest du wirklich alle lokalen Vorschläge löschen? " +
      "Exportiere sie vorher, wenn du sie behalten möchtest."
    )) return;

    localStorage.removeItem(STORAGE_KEY);
    updateSuggestionPanel();

    alert("Die lokalen Vorschläge wurden geleert.");
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
    const count = document.getElementById("zunoSuggestionCount");
    const list = document.getElementById("zunoSuggestionList");
    const syncStatus = document.getElementById("zunoSyncStatus");

    if (!count || !list) return;

    const suggestions = getPendingSuggestions();

    count.textContent = suggestions.length;

    if (syncStatus) {
      const uploaded = suggestions.filter(item => item.uploaded).length;
      const notUploaded = suggestions.length - uploaded;

      syncStatus.textContent = suggestions.length
        ? uploaded + " online · " + notUploaded + " nur lokal"
        : "Noch keine lokalen Vorschläge";
    }

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
            · ${item.uploaded ? "☁️ Online eingereicht" : "📱 Nur lokal"}
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
    const container = document.getElementById("zunoAIAdminPanel");

    if (!container) return;

    if (document.getElementById("zunoSuggestionPanel")) {
      updateSuggestionPanel();
      return;
    }

    const panel = document.createElement("section");

    panel.id = "zunoSuggestionPanel";
    panel.style.cssText = `
      padding:16px 0 0;
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
          <div style="
            font-size:12px;
            font-weight:800;
            color:#7d69e8;
            letter-spacing:.08em;
          ">ZUNO AI</div>

          <h3 style="margin:5px 0;">Synonym-Vorschläge</h3>

          <p style="margin:0;color:#777;font-size:14px;">
            Neue Antworten werden gesammelt und müssen geprüft werden.
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

      <p id="zunoSyncStatus" style="
        margin:12px 0 0;
        color:#777;
        font-size:12px;
      ">Synchronisierung wird vorbereitet ...</p>

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
          "
        >↓ Vorschläge exportieren</button>

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
          "
        >Liste leeren</button>
      </div>

      <p style="margin:12px 0 0;color:#888;font-size:12px;">
        Online eingereichte Vorschläge werden in Supabase gesammelt.
        Freigegebene Vorschläge können allen Nutzern zur Verfügung stehen.
      </p>
    `;

    container.appendChild(panel);

    document
      .getElementById("zunoExportSuggestions")
      .addEventListener("click", exportSuggestions);

    document
      .getElementById("zunoClearSuggestions")
      .addEventListener("click", clearSuggestions);

    updateSuggestionPanel();
  }

  /* =========================================
     12. CHALLENGE BUTTON
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

    button.addEventListener("click", async () => {
      const description = mode === "reverse"
        ? "als englisches Synonym"
        : "als deutsche Übersetzung";

      if (!confirm(
        'Soll "' + answer + '" für "' + word.word + '" ' +
        description + " zur Prüfung vorgeschlagen werden?\n\n" +
        "Der Vorschlag wird nicht automatisch akzeptiert."
      )) return;

      button.disabled = true;
      button.textContent = "⏳ Wird gespeichert ...";

      const result = await addSuggestion(answer, word, mode);

      if (!result.success) {
        button.disabled = false;
        button.textContent = "🤔 Ich hatte Recht";
        alert(result.message);
        return;
      }

      button.textContent = result.uploaded
        ? "✓ An ZUNO gesendet"
        : "✓ Lokal gespeichert";

      button.style.background = result.uploaded ? "#eaf7e8" : "#fff4df";
      button.style.color = result.uploaded ? "#397c38" : "#94651c";

      alert(result.message);
    });

    feedback.appendChild(button);
  }

  /* =========================================
     13. CONNECT ANSWER CHECKER
  ========================================= */

  const previousChecker = window.answerMatches;

  window.answerMatches = function(answer, word) {
    if (!word) return false;

    const mode =
      typeof state !== "undefined"
        ? state.currentMode
        : "";

    if (word.language === "en" && mode === "reverse") {
      return checkEnglishAnswer(answer, word);
    }

    if (word.language === "en" && mode === "input") {
      return checkGermanTranslation(answer, word);
    }

    if (typeof previousChecker === "function") {
      return previousChecker.apply(this, arguments);
    }

    return false;
  };

  /* =========================================
     14. CONNECT FEEDBACK
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
     15. PUBLIC INTERFACE
  ========================================= */

  window.ZUNOAI = {
    version: "3.0",
    normalize,
    checkEnglishAnswer,
    checkGermanTranslation,
    getSynonyms,
    getPendingSuggestions,
    addSuggestion,
    exportSuggestions,
    clearSuggestions,
    updateSuggestionPanel,
    fetchApprovedSuggestions,
    acceptedEnglishAnswers,
    getTranslationAlternatives
  };

  /* =========================================
     16. INITIALIZE
  ========================================= */

  createSuggestionPanel();
  fetchApprovedSuggestions();

  console.log("ZUNO AI v3.0 loaded.");
})();
