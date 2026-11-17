/* =========================================
   ZUNO EXAMPLES
   Contextual English + German Examples
   Version 2.0
========================================= */

(() => {
  "use strict";

  if (typeof exampleSentences === "undefined") {
    console.error("ZUNO Examples: exampleSentences wurde nicht gefunden.");
    return;
  }

  /* =========================================
     1. ADDITIONAL ENGLISH EXAMPLES
     Zwei Beispiele pro Wort
  ========================================= */

  const extraEnglish = {
    communication: [
      "Good communication helps a team work together.",
      "Clear communication can prevent misunderstandings."
    ],

    language: [
      "Learning a new language takes time and practice.",
      "Body language can communicate feelings without words."
    ],

    "to speak": [
      "She speaks three languages fluently.",
      "We spoke to a local guide during our trip."
    ],

    "to understand": [
      "I finally understood the instructions.",
      "It is important to understand different points of view."
    ],

    "to translate": [
      "He translated the article into German.",
      "Can you translate this sentence for me?"
    ],

    translation: [
      "I checked the translation in a dictionary.",
      "Some expressions are difficult to translate."
    ],

    accent: [
      "Her Australian accent was easy to recognise.",
      "He speaks English with a slight German accent."
    ],

    "to pronounce": [
      "How do you pronounce this word?",
      "She pronounced every word very clearly."
    ],

    pronunciation: [
      "Regular practice can improve your pronunciation.",
      "The teacher corrected my pronunciation."
    ],

    fluent: [
      "She is fluent in English and French.",
      "He became more fluent after living abroad."
    ],

    "to improve": [
      "Her English improved during the exchange.",
      "You can improve your vocabulary by reading."
    ],

    "to apply (to)": [
      "The rule applies to everyone in the class.",
      "This discount applies to students."
    ],

    "civil rights": [
      "The movement fought for equal civil rights.",
      "Civil rights protect people's freedoms."
    ],

    segregation: [
      "The law helped bring an end to segregation.",
      "The museum explains the history of segregation."
    ],

    "to be in progress": [
      "The construction work is still in progress.",
      "Several projects were in progress at the same time."
    ],

    "to pass (on)": [
      "She passed the message on to her classmates.",
      "My grandfather passed on many family traditions."
    ],

    "to head (for/to)": [
      "We headed for the coast after breakfast.",
      "The hikers are heading towards the mountain."
    ],

    "to bring up": [
      "She brought up an interesting question.",
      "He did not want to bring up the problem."
    ],

    responsibility: [
      "Everyone has a responsibility to protect nature.",
      "Taking responsibility is part of growing up."
    ],

    "to take responsibility": [
      "He took responsibility for his mistake.",
      "We should take responsibility for our actions."
    ],

    "to be responsible for": [
      "She is responsible for organising the event.",
      "Who was responsible for the decision?"
    ],

    "the outback": [
      "The Australian Outback covers a huge area.",
      "We watched a documentary about life in the Outback."
    ],

    "Australia Day": [
      "Australia Day is celebrated on 26 January.",
      "We discussed the different views on Australia Day."
    ],

    mate: [
      "He called his best friend his mate.",
      "She went to the beach with her mates."
    ],

    barbecue: [
      "We had a barbecue in the garden.",
      "They invited their neighbours to a barbecue."
    ],

    "to cancel": [
      "They cancelled the match because of the rain.",
      "I had to cancel my appointment."
    ],

    "to sweep": [
      "The wind swept the leaves across the road.",
      "She swept the floor after dinner."
    ],

    opal: [
      "The jewellery shop displayed a beautiful opal.",
      "Australia is famous for its opals."
    ],

    "to migrate": [
      "Some birds migrate south for the winter.",
      "Many families migrated to the city."
    ],

    generation: [
      "Each generation experiences a different world.",
      "The tradition has been passed down for generations."
    ],

    background: [
      "She comes from a musical background.",
      "His family background influenced his childhood."
    ],

    ownership: [
      "The document proves ownership of the land.",
      "The question of land ownership is complicated."
    ],

    "to own": [
      "They own a small house near the coast.",
      "My uncle owns a local restaurant."
    ],

    traditional: [
      "They wore traditional clothes at the festival.",
      "The restaurant serves traditional food."
    ],

    culture: [
      "Music is an important part of Australian culture.",
      "Travelling allows us to experience another culture."
    ],

    custom: [
      "It is a local custom to greet visitors warmly.",
      "We learned about an unusual wedding custom."
    ],

    belief: [
      "Everyone has the right to their own beliefs.",
      "Her belief in the project never changed."
    ],

    sacred: [
      "The mountain is sacred to the local community.",
      "Visitors should respect sacred places."
    ],

    "to belong to": [
      "This land belongs to the local community.",
      "The book belongs to my sister."
    ],

    "to protect": [
      "We must protect endangered animals.",
      "The rules protect the environment."
    ],

    history: [
      "The museum tells the history of the region.",
      "History helps us understand the present."
    ],

    presentation: [
      "She gave a presentation about climate change.",
      "The presentation included several useful graphs."
    ],

    "to present": [
      "He presented the results to the class.",
      "They will present their project tomorrow."
    ],

    "to introduce": [
      "The teacher introduced a new topic.",
      "She introduced me to her friends."
    ],

    "to prepare": [
      "We prepared everything before the presentation.",
      "She is preparing for her English test."
    ],

    "to explain": [
      "Could you explain the question again?",
      "The teacher explained the grammar rule."
    ],

    "to summarize": [
      "Can you summarize the article in three sentences?",
      "She summarized the main points."
    ],

    "to make eye contact": [
      "Good speakers make eye contact with their audience.",
      "He made eye contact before answering."
    ],

    "to enable sb to do sth": [
      "The new app enables students to practise anywhere.",
      "The bridge enabled people to cross the river."
    ],

    "to frown": [
      "She frowned when she read the message.",
      "He frowned in confusion."
    ],

    "to sink": [
      "The boat began to sink slowly.",
      "The stone sank to the bottom of the lake."
    ],

    "to keep in mind": [
      "Keep in mind that the deadline is tomorrow.",
      "We should keep the instructions in mind."
    ],

    wool: [
      "The farmer sells wool from his sheep.",
      "This jumper is made from soft wool."
    ],

    passion: [
      "She has a passion for wildlife photography.",
      "His passion for music started at a young age."
    ],

    gradual: [
      "The change was gradual rather than sudden.",
      "There has been a gradual increase in temperature."
    ],

    distant: [
      "We could see a distant mountain.",
      "The village is distant from the nearest city."
    ],

    temperate: [
      "New Zealand has a mostly temperate climate.",
      "Many plants grow well in temperate regions."
    ],

    predator: [
      "A shark is a predator.",
      "The documentary showed how predators hunt."
    ],

    parrot: [
      "The parrot repeated the same words.",
      "Some parrots can imitate human speech."
    ],

    wealthy: [
      "The family became wealthy through farming.",
      "Not every wealthy person lives a luxurious life."
    ],

    agriculture: [
      "Agriculture is important to the country's economy.",
      "Modern agriculture uses advanced machinery."
    ],

    renewable: [
      "Solar energy is a renewable source of power.",
      "The country is investing in renewable energy."
    ],

    heritage: [
      "The building is part of the country's cultural heritage.",
      "The museum protects the region's heritage."
    ],

    funeral: [
      "Many people attended the funeral.",
      "The family held a small funeral."
    ],

    "to mourn": [
      "The family mourned their grandfather.",
      "People gathered to mourn the victims."
    ],

    "to release": [
      "The band released a new song.",
      "The organisation released its report yesterday."
    ],

    "fairy tale": [
      "The story sounds like a fairy tale.",
      "She read a fairy tale before going to sleep."
    ],

    "to defend": [
      "The player defended the goal.",
      "She defended her opinion with strong arguments."
    ],

    concise: [
      "The report was short and concise.",
      "Try to write a concise introduction."
    ],

    scientific: [
      "The article presents scientific evidence.",
      "They carried out a scientific experiment."
    ],

    miracle: [
      "Finding the lost dog felt like a miracle.",
      "The doctors called the recovery a miracle."
    ],

    identical: [
      "The two pictures look almost identical.",
      "They wore identical uniforms."
    ],

    rare: [
      "It is rare to see this bird in the city.",
      "The museum has a rare collection of coins."
    ],

    handsome: [
      "The actor was described as handsome.",
      "He wore a handsome suit to the ceremony."
    ],

    tolerance: [
      "Tolerance means respecting different opinions.",
      "The lesson focused on tolerance and diversity."
    ],

    prejudice: [
      "Prejudice can lead to unfair treatment.",
      "The campaign aimed to challenge prejudice."
    ],

    stereotype: [
      "The film challenges a common stereotype.",
      "A stereotype does not describe every person."
    ],

    diversity: [
      "The city is known for its cultural diversity.",
      "Diversity can make a community stronger."
    ],

    privacy: [
      "Everyone deserves privacy.",
      "The app allows users to protect their privacy."
    ],

    curious: [
      "The curious child asked many questions.",
      "I was curious about the unusual noise."
    ],

    sensitive: [
      "This is a sensitive topic.",
      "He is sensitive to loud noises."
    ],

    rumour: [
      "A rumour spread around the school.",
      "The story turned out to be only a rumour."
    ]
  };

  /* =========================================
     2. GERMAN EXAMPLES
  ========================================= */

  const extraGerman = {
    "to speak": [
      { text: "Sie spricht drei Sprachen.", highlight: "spricht" },
      { text: "Wir sprachen mit einem Einheimischen.", highlight: "sprachen" }
    ],

    "to understand": [
      { text: "Ich verstand die Aufgabe endlich.", highlight: "verstand" },
      { text: "Sie versteht den Text sehr gut.", highlight: "versteht" }
    ],

    "to translate": [
      { text: "Er übersetzte den Artikel ins Deutsche.", highlight: "übersetzte" },
      { text: "Kannst du diesen Satz übersetzen?", highlight: "übersetzen" }
    ],

    "to improve": [
      { text: "Sein Englisch hat sich deutlich verbessert.", highlight: "verbessert" },
      { text: "Mit Übung kannst du dich verbessern.", highlight: "verbessern" }
    ],

    "to cancel": [
      { text: "Sie sagten das Spiel wegen des Regens ab.", highlight: "sagten ... ab" },
      { text: "Ich musste meinen Termin absagen.", highlight: "absagen" }
    ],

    "to protect": [
      { text: "Wir müssen die Umwelt schützen.", highlight: "schützen" },
      { text: "Der Helm schützte seinen Kopf.", highlight: "schützte" }
    ],

    "to prepare": [
      { text: "Wir bereiteten die Präsentation vor.", highlight: "bereiteten ... vor" },
      { text: "Sie bereitet sich auf die Prüfung vor.", highlight: "bereitet ... vor" }
    ],

    "to explain": [
      { text: "Der Lehrer erklärte die Aufgabe.", highlight: "erklärte" },
      { text: "Kannst du mir das erklären?", highlight: "erklären" }
    ],

    "to defend": [
      { text: "Der Spieler verteidigte das Tor.", highlight: "verteidigte" },
      { text: "Sie verteidigt ihre Meinung.", highlight: "verteidigt" }
    ],

    "to belong to": [
      { text: "Dieses Buch gehört meiner Schwester.", highlight: "gehört" },
      { text: "Das Land gehört der Gemeinschaft.", highlight: "gehört" }
    ],

    "to migrate": [
      { text: "Viele Vögel wandern im Winter nach Süden.", highlight: "wandern" },
      { text: "Die Familie wanderte in eine andere Region aus.", highlight: "wanderte ... aus" }
    ]
  };

  /* =========================================
     3. NORMALIZATION + MERGE
  ========================================= */

  function normalizeKey(value) {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/[’‘]/g, "'")
      .replace(/\s+/g, " ");
  }

  Object.assign(exampleSentences, extraEnglish);

  if (typeof zunoGermanExamples !== "undefined") {
    Object.assign(zunoGermanExamples, extraGerman);
  }

  const adjectiveWords = new Set([
    "actual", "ancient", "foreign", "fluent", "determined",
    "upright", "desperate", "previous", "guilty", "grateful",
    "shut", "gradual", "distant", "temperate", "wealthy",
    "profitable", "renewable", "geographic", "one-sided",
    "regional", "ideal", "mainstream", "entire", "objective",
    "complex", "plain", "concise", "scientific", "identical",
    "rare", "handsome", "sensible", "weary", "meaningful",
    "various", "tight", "shallow", "respectful", "curious",
    "sensitive", "problematic", "traditional", "spiritual",
    "sacred", "smooth", "responsible", "deadly", "comforting"
  ]);

  /* =========================================
     4. INFLECTION-AWARE HIGHLIGHTING
  ========================================= */

  const irregular = {
    be: ["am", "is", "are", "was", "were", "been", "being"],
    have: ["has", "had", "having"],
    do: ["does", "did", "done", "doing"],
    go: ["goes", "went", "gone", "going"],
    make: ["makes", "made", "making"],
    take: ["takes", "took", "taken", "taking"],
    speak: ["speaks", "spoke", "spoken", "speaking"],
    understand: ["understands", "understood", "understanding"],
    learn: ["learns", "learned", "learnt", "learning"],
    catch: ["catches", "caught", "catching"],
    bring: ["brings", "brought", "bringing"],
    sink: ["sinks", "sank", "sunk", "sinking"],
    keep: ["keeps", "kept", "keeping"],
    say: ["says", "said", "saying"],
    meet: ["meets", "met", "meeting"],
    leave: ["leaves", "left", "leaving"],
    come: ["comes", "came", "coming"],
    think: ["thinks", "thought", "thinking"],
    write: ["writes", "wrote", "written", "writing"],
    read: ["reads", "reading"],
    run: ["runs", "ran", "running"],
    find: ["finds", "found", "finding"],
    feel: ["feels", "felt", "feeling"],
    hear: ["hears", "heard", "hearing"],
    build: ["builds", "built", "building"],
    buy: ["buys", "bought", "buying"],
    choose: ["chooses", "chose", "chosen", "choosing"]
  };

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function verbForms(verb) {
    if (irregular[verb]) {
      return [verb, ...irregular[verb]];
    }

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
        forms.push(
          verb + verb.slice(-1) + "ed",
          verb + verb.slice(-1) + "ing"
        );
      }
    }

    return forms;
  }

  function makeHighlightPatterns(word) {
    let phrase = normalizeKey(word);

    phrase = phrase.replace(/^to\s+/, "");
    phrase = phrase.replace(/\s*\((?:infml|informal|umgangssprachlich)\)/g, "");
    phrase = phrase.replace(/\s*\(\s*(for|to|in|from|at|on)\s*\)/g, " $1");
    phrase = phrase.replace(/\bsth\b/g, "something");
    phrase = phrase.replace(/\bsb\b/g, "somebody");
    phrase = phrase.replace(/\s*\(\+\s*-ing\)/g, "");
    phrase = phrase.replace(/\s+/g, " ").trim();

    const patterns = [phrase];

    if (phrase.startsWith("be ")) {
      const rest = phrase.slice(3);

      ["am", "is", "are", "was", "were", "been", "being"].forEach(form => {
        patterns.push(form + " " + rest);
      });
    } else {
      const match = phrase.match(/^([a-z']+)(.*)$/);

      if (match) {
        const verb = match[1];
        const rest = match[2] || "";

        verbForms(verb).forEach(form => {
          patterns.push(form + rest);
        });
      }
    }

    return [...new Set(patterns)]
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)
      .map(pattern => {
        const tokens = pattern.split(/\s+/).map(token => {
          if (token === "something" || token === "somebody") {
            return "[\\p{L}\\p{N}'’-]+";
          }

          return escapeRegex(token);
        });

        return new RegExp(tokens.join("\\s+"), "iu");
      });
  }

  function safeEscapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  window.highlightWord = function(sentence, word) {
    const text = String(sentence ?? "");
    const patterns = makeHighlightPatterns(word);

    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (!match) continue;

      const start = match.index;
      const end = start + match[0].length;

      return (
        safeEscapeHTML(text.slice(0, start)) +
        "<mark>" + safeEscapeHTML(text.slice(start, end)) + "</mark>" +
        safeEscapeHTML(text.slice(end))
      );
    }

    return safeEscapeHTML(text);
  };

  /* =========================================
     5. CONTEXTUAL EXAMPLE GENERATOR
  ========================================= */

  function cleanWord(word) {
    return String(word ?? "")
      .replace(/^to\s+/i, "")
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/\bsth\b/gi, "something")
      .replace(/\bsb\b/gi, "someone")
      .trim();
  }

  function getWordType(word) {
    const key = normalizeKey(word);

    if (key.startsWith("to ")) return "verb";
    if (adjectiveWords.has(key)) return "adjective";

    if (
      key.includes("tion") ||
      key.endsWith("ment") ||
      key.endsWith("ity") ||
      key.endsWith("ness") ||
      key.endsWith("ship")
    ) {
      return "noun";
    }

    return "general";
  }

  function contextualExamples(word, translation = "") {
    const raw = cleanWord(word);
    const meaning = String(translation || "").split(";")[0].trim();
    const type = getWordType(word);

    if (type === "verb") {
      const verb = raw;

      if (verb.startsWith("be ")) {
        const rest = verb.slice(3);

        return [
          "After the heavy rain, the roads were " + rest + ".",
          "The team was " + rest + " during the final minutes."
        ];
      }

      return [
        "During the school project, we had to " + verb + ".",
        "The guide showed us how to " + verb + " in that situation."
      ];
    }

    if (type === "adjective") {
      return [
        "The " + raw + " decision changed the course of the project.",
        "Everyone noticed how " + raw + " the situation had become."
      ];
    }

    if (type === "noun") {
      return [
        "The " + raw + " played an important role in the discussion.",
        "We learned how the " + raw + " affected the local community."
      ];
    }

    if (meaning) {
      return [
        "The class discovered that " + raw + " means " + meaning + ".",
        "The guide used " + raw + " while explaining the topic of " + meaning + "."
      ];
    }

    return [
      "The class discussed " + raw + " while studying the topic.",
      "The example helped us understand the meaning of " + raw + "."
    ];
  }

  /* =========================================
     6. COLLECT ALL STORED VOCABULARY
  ========================================= */

  const vocabularyIndex = new Map();

  function registerVocabulary(word, translation = "") {
    const key = normalizeKey(word);
    if (!key) return;

    if (!vocabularyIndex.has(key)) {
      vocabularyIndex.set(key, {
        word: String(word).trim(),
        translation: String(translation || "").trim()
      });
    }
  }

  if (typeof unitVocabulary !== "undefined") {
    Object.values(unitVocabulary).forEach(unit => {
      (unit.sections || []).forEach(section => {
        (section.words || []).forEach(entry => {
          if (Array.isArray(entry)) {
            registerVocabulary(entry[0], entry[1]);
          }
        });
      });
    });
  }

  if (typeof languageDatabases !== "undefined") {
    Object.entries(languageDatabases).forEach(([language, database]) => {
      if (language !== "en" || typeof database !== "string") return;

      database.split("\n").filter(Boolean).forEach(line => {
        const [word, translation] = line.split("|");
        registerVocabulary(word, translation);
      });
    });
  }

  if (typeof zunoNonaVocabulary !== "undefined") {
    zunoNonaVocabulary.forEach(entry => {
      if (Array.isArray(entry)) {
        registerVocabulary(entry[0], entry[1]);
      }
    });
  }

  /* =========================================
     7. GUARANTEE EXACTLY TWO EXAMPLES
  ========================================= */

  const exampleRotations = {};

  function normalizeExampleDatabase() {
    const normalized = {};

    Object.entries(exampleSentences).forEach(([key, examples]) => {
      const normalizedKey = normalizeKey(key);

      if (!normalizedKey || !Array.isArray(examples)) return;

      normalized[normalizedKey] = examples
        .map(String)
        .filter(Boolean)
        .slice(0, 2);
    });

    Object.keys(exampleSentences).forEach(key => {
      delete exampleSentences[key];
    });

    Object.assign(exampleSentences, normalized);
  }

  normalizeExampleDatabase();

  Object.entries(extraEnglish).forEach(([word, examples]) => {
    exampleSentences[normalizeKey(word)] = examples.slice(0, 2);
  });

  vocabularyIndex.forEach((item, key) => {
    const current = exampleSentences[key];

    if (!current || current.length < 2) {
      const generated = contextualExamples(
        item.word,
        item.translation
      );

      exampleSentences[key] = [
        ...(current || []),
        ...generated
      ].slice(0, 2);
    }
  });

  /* Add generated examples for words not in the school database. */
  Object.keys(exampleSentences).forEach(key => {
    const examples = exampleSentences[key] || [];

    if (examples.length < 2) {
      const generated = contextualExamples(key);
      exampleSentences[key] = [
        ...examples,
        ...generated
      ].slice(0, 2);
    }
  });

  /* =========================================
     8. GERMAN EXAMPLE DATABASE
  ========================================= */

  if (typeof zunoGermanExamples === "undefined") {
    window.zunoGermanExamples = {};
  }

  Object.assign(zunoGermanExamples, extraGerman);

  Object.keys(zunoGermanExamples).forEach(key => {
    if (!Array.isArray(zunoGermanExamples[key])) {
      zunoGermanExamples[key] = [];
    }

    zunoGermanExamples[key] = zunoGermanExamples[key].slice(0, 2);
  });

  const germanFallbacks = {
    "to be short of sth": [
      { text: "Uns fehlt die Zeit, um den Zug noch zu erreichen.", highlight: "fehlt" },
      { text: "Dem Team fehlen heute zwei wichtige Spieler.", highlight: "fehlen" }
    ],

    "to be stuck": [
      { text: "Unser Auto steckt im Schlamm fest.", highlight: "steckt ... fest" },
      { text: "Ich bin bei der letzten Aufgabe nicht weitergekommen.", highlight: "nicht weitergekommen" }
    ],

    "to learn by heart": [
      { text: "Ich muss das Gedicht bis morgen auswendig lernen.", highlight: "auswendig lernen" },
      { text: "Sie hat ihre Rede für den Wettbewerb auswendig gelernt.", highlight: "auswendig gelernt" }
    ],

    "to make progress": [
      { text: "Du machst große Fortschritte in Englisch.", highlight: "machst ... Fortschritte" },
      { text: "Wir kommen mit unserem Projekt gut voran.", highlight: "kommen ... voran" }
    ],

    "to head (for/to)": [
      { text: "Wir machten uns früh auf den Weg zur Küste.", highlight: "machten uns ... auf den Weg" },
      { text: "Die Wanderer steuerten direkt auf die Berghütte zu.", highlight: "steuerten ... zu" }
    ],

    "to apply (for)": [
      { text: "Sie bewarb sich um einen Praktikumsplatz.", highlight: "bewarb sich" },
      { text: "Ich habe mich für einen Ferienjob beworben.", highlight: "beworben" }
    ],

    "to bump into sb": [
      { text: "Ich bin gestern zufällig einem alten Freund begegnet.", highlight: "begegnet" },
      { text: "Sie traf ihren Lehrer zufällig in der Stadt.", highlight: "traf" }
    ],

    "to immigrate": [
      { text: "Ihre Großeltern wanderten nach Australien ein.", highlight: "wanderten ... ein" },
      { text: "Die Familie ist vor vielen Jahren eingewandert.", highlight: "eingewandert" }
    ],

    "to emigrate": [
      { text: "Sie wanderten aus Irland aus.", highlight: "wanderten ... aus" },
      { text: "Seine Familie ist vor langer Zeit ausgewandert.", highlight: "ausgewandert" }
    ]
  };

  Object.entries(germanFallbacks).forEach(([key, examples]) => {
    if (!zunoGermanExamples[key]) {
      zunoGermanExamples[key] = examples.slice(0, 2);
    }
  });

  const germanRotations = {};

  function generateGermanExamples(word) {
    const translation = String(word.translation || "")
      .split(";")[0]
      .trim();

    const key = normalizeKey(word.word);

    if (germanFallbacks[key]) {
      return germanFallbacks[key].slice(0, 2);
    }

    return [
      {
        text: "Im Unterricht haben wir gelernt, was " + translation + " bedeutet.",
        highlight: translation
      },
      {
        text: "Das Wort " + translation + " kam in unserem letzten Text vor.",
        highlight: translation
      }
    ];
  }

  window.getGermanExample = function(word) {
    const key = normalizeKey(word.word);

    if (!zunoGermanExamples[key]) {
      zunoGermanExamples[key] = generateGermanExamples(word);
    }

    const examples = zunoGermanExamples[key].slice(0, 2);
    if (!examples.length) return null;

    const index = germanRotations[key] || 0;
    germanRotations[key] = (index + 1) % 2;

    return examples[index];
  };

  window.zunoHighlightExample = function(sentence, highlight) {
    const escaped = safeEscapeHTML(sentence);

    const parts = String(highlight || "")
      .split(" ... ")
      .map(part => part.replace(/[.*+?^()|[\]\\]/g, "\\$&"));

    if (!parts.length) return escaped;

    try {
      return escaped.replace(
        new RegExp("(" + parts.join(".*?") + ")", "i"),
        "<mark>$1</mark>"
      );
    } catch (_) {
      return escaped;
    }
  };

  /* =========================================
     9. PUBLIC EXAMPLE FUNCTION
  ========================================= */

  window.getExample = function(word) {
    const key = normalizeKey(word);

    if (!exampleSentences[key]) {
      const vocabularyItem = vocabularyIndex.get(key);

      exampleSentences[key] = contextualExamples(
        word,
        vocabularyItem ? vocabularyItem.translation : ""
      );
    }

    const examples = exampleSentences[key].slice(0, 2);

    const index = exampleRotations[key] || 0;
    exampleRotations[key] = (index + 1) % 2;

    return examples[index];
  };

  /* =========================================
     10. DIAGNOSTICS
  ========================================= */

  const totalWords = vocabularyIndex.size;

  const invalidExamples = Object.entries(exampleSentences)
    .filter(([, examples]) =>
      !Array.isArray(examples) || examples.length !== 2
    );

  console.log("ZUNO Examples v2.0 loaded.");
  console.log("Vocabulary words registered:", totalWords);
  console.log("English example entries:", Object.keys(exampleSentences).length);
  console.log("German example entries:", Object.keys(zunoGermanExamples).length);

  if (invalidExamples.length) {
    console.warn("Example entries without exactly two examples:", invalidExamples);
  } else {
    console.log("All registered English example entries contain exactly two examples.");
  }
})();
