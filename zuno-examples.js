
/* =========================================
   ZUNO EXAMPLES
   English + German examples
   Version 1.0
========================================= */

(() => {
  "use strict";

  if (typeof exampleSentences === "undefined") {
    console.error(
      "ZUNO Examples: exampleSentences wurde nicht gefunden."
    );
    return;
  }

  /* =========================================
     1. ADDITIONAL ENGLISH EXAMPLES
  ========================================= */

  const extraEnglish = {
    communication: [
      "Good communication helps a team work together.",
      "Clear communication can prevent misunderstandings.",
      "Modern technology has changed the way we communicate."
    ],

    language: [
      "English is the most widely spoken language in Australia.",
      "Learning a new language takes time and practice.",
      "Body language can communicate feelings without words."
    ],

    "to speak": [
      "She speaks three languages fluently.",
      "We spoke to a local guide during our trip.",
      "He has spoken English since primary school."
    ],

    "to understand": [
      "I finally understood the instructions.",
      "It is important to understand different points of view.",
      "She understands why the decision was difficult."
    ],

    "to translate": [
      "He translated the article into German.",
      "Can you translate this sentence for me?",
      "The students translated the text together."
    ],

    translation: [
      "The translation was easy to understand.",
      "I checked the translation in a dictionary.",
      "Some expressions are difficult to translate."
    ],

    accent: [
      "Her Australian accent was easy to recognise.",
      "He speaks English with a slight German accent.",
      "The actor changed his accent for the role."
    ],

    "to pronounce": [
      "How do you pronounce this word?",
      "She pronounced every word very clearly.",
      "Some English words are difficult to pronounce."
    ],

    pronunciation: [
      "Regular practice can improve your pronunciation.",
      "The teacher corrected my pronunciation.",
      "Good pronunciation makes communication easier."
    ],

    fluent: [
      "She is fluent in English and French.",
      "He became more fluent after living abroad.",
      "You do not need to be fluent to have a conversation."
    ],

    "to improve": [
      "Her English improved during the exchange.",
      "You can improve your vocabulary by reading.",
      "He is trying to improve his pronunciation."
    ],

    "to apply (to)": [
      "The rule applies to everyone in the class.",
      "This discount applies to students.",
      "The same principle applies to other situations."
    ],

    "civil rights": [
      "The movement fought for equal civil rights.",
      "Civil rights protect people's freedoms.",
      "The class learned about the history of civil rights."
    ],

    segregation: [
      "The law helped bring an end to segregation.",
      "The museum explains the history of segregation.",
      "Segregation kept different groups apart."
    ],

    "to be in progress": [
      "The construction work is still in progress.",
      "Several projects were in progress at the same time.",
      "The investigation is currently in progress."
    ],

    "to pass (on)": [
      "She passed the message on to her classmates.",
      "My grandfather passed on many family traditions.",
      "Please pass the information on to the team."
    ],

    "to head (for/to)": [
      "We headed for the coast after breakfast.",
      "The hikers are heading towards the mountain.",
      "They headed home before it got dark."
    ],

    "to bring up": [
      "She brought up an interesting question.",
      "He did not want to bring up the problem.",
      "The teacher brought up the topic during class."
    ],

    responsibility: [
      "Everyone has a responsibility to protect nature.",
      "Taking responsibility is part of growing up.",
      "The job comes with a lot of responsibility."
    ],

    "to take responsibility": [
      "He took responsibility for his mistake.",
      "We should take responsibility for our actions.",
      "She refused to take responsibility for the damage."
    ],

    "to be responsible for": [
      "She is responsible for organising the event.",
      "Who was responsible for the decision?",
      "The students were responsible for their own work."
    ],

    "the outback": [
      "The Australian Outback covers a huge area.",
      "Many people live far away from towns in the Outback.",
      "We watched a documentary about life in the Outback."
    ],

    "Australia Day": [
      "Australia Day is celebrated on 26 January.",
      "The town organised a festival for Australia Day.",
      "We discussed the different views on Australia Day."
    ],

    mate: [
      "He called his best friend his mate.",
      "G'day, mate! How have you been?",
      "She went to the beach with her mates."
    ],

    barbecue: [
      "We had a barbecue in the garden.",
      "They invited their neighbours to a barbecue.",
      "The family prepared food for the weekend barbecue."
    ],

    "to cancel": [
      "They cancelled the match because of the rain.",
      "I had to cancel my appointment.",
      "The airline cancelled several flights."
    ],

    "to sweep": [
      "The wind swept the leaves across the road.",
      "She swept the floor after dinner.",
      "A strong current swept the boat away."
    ],

    opal: [
      "The jewellery shop displayed a beautiful opal.",
      "Australia is famous for its opals.",
      "The stone had flashes of blue and green."
    ],

    "to migrate": [
      "Some birds migrate south for the winter.",
      "Many families migrated to the city.",
      "The animals migrate when the seasons change."
    ],

    generation: [
      "Each generation experiences a different world.",
      "The tradition has been passed down for generations.",
      "Three generations of the family live nearby."
    ],

    background: [
      "She comes from a musical background.",
      "His family background influenced his childhood.",
      "The article gives some background information."
    ],

    ownership: [
      "The document proves ownership of the land.",
      "The question of land ownership is complicated.",
      "Ownership also comes with responsibility."
    ],

    "to own": [
      "They own a small house near the coast.",
      "My uncle owns a local restaurant.",
      "She has owned the bicycle for years."
    ],

    traditional: [
      "They wore traditional clothes at the festival.",
      "Traditional stories are part of the culture.",
      "The restaurant serves traditional food."
    ],

    culture: [
      "Music is an important part of Australian culture.",
      "Travelling allows us to experience another culture.",
      "The museum presents the history and culture of the region."
    ],

    custom: [
      "It is a local custom to greet visitors warmly.",
      "The tradition is an important custom in the region.",
      "We learned about an unusual wedding custom."
    ],

    belief: [
      "Everyone has the right to their own beliefs.",
      "Her belief in the project never changed.",
      "The story is based on an old belief."
    ],

    sacred: [
      "The mountain is sacred to the local community.",
      "Visitors should respect sacred places.",
      "The ceremony took place on sacred ground."
    ],

    "to belong to": [
      "This land belongs to the local community.",
      "The book belongs to my sister.",
      "These traditions belong to their cultural heritage."
    ],

    "to protect": [
      "We must protect endangered animals.",
      "The rules protect the environment.",
      "A helmet protects your head."
    ],

    history: [
      "The museum tells the history of the region.",
      "We learned about Australia's history.",
      "History helps us understand the present."
    ],

    presentation: [
      "She gave a presentation about climate change.",
      "The presentation included several useful graphs.",
      "I prepared my presentation with a classmate."
    ],

    "to present": [
      "He presented the results to the class.",
      "They will present their project tomorrow.",
      "She presented a new idea at the meeting."
    ],

    "to introduce": [
      "The teacher introduced a new topic.",
      "She introduced me to her friends.",
      "The school introduced new rules."
    ],

    "to prepare": [
      "We prepared everything before the presentation.",
      "She is preparing for her English test.",
      "They prepared food for the visitors."
    ],

    "to explain": [
      "Could you explain the question again?",
      "The teacher explained the grammar rule.",
      "He explained why the plan had failed."
    ],

    "to summarize": [
      "Can you summarize the article in three sentences?",
      "She summarized the main points.",
      "The final paragraph summarizes the discussion."
    ],

    "to make eye contact": [
      "Good speakers make eye contact with their audience.",
      "He made eye contact before answering.",
      "Try to make eye contact during your presentation."
    ],

    "to enable sb to do sth": [
      "The new app enables students to practise anywhere.",
      "The bridge enabled people to cross the river.",
      "Technology enables us to communicate over long distances."
    ],

    "to frown": [
      "She frowned when she read the message.",
      "He frowned in confusion.",
      "The child frowned at the difficult question."
    ],

    "to sink": [
      "The boat began to sink slowly.",
      "The stone sank to the bottom of the lake.",
      "The sun was sinking behind the hills."
    ],

    "to keep in mind": [
      "Keep in mind that the deadline is tomorrow.",
      "We should keep the instructions in mind.",
      "There are several things to keep in mind."
    ],

    wool: [
      "The farmer sells wool from his sheep.",
      "This jumper is made from soft wool.",
      "Wool is an important product in Australia."
    ],

    passion: [
      "She has a passion for wildlife photography.",
      "His passion for music started at a young age.",
      "They spoke about their passion for sport."
    ],

    gradual: [
      "The change was gradual rather than sudden.",
      "There has been a gradual increase in temperature.",
      "Learning a language is a gradual process."
    ],

    distant: [
      "We could see a distant mountain.",
      "The village is distant from the nearest city.",
      "A distant light appeared on the horizon."
    ],

    temperate: [
      "New Zealand has a mostly temperate climate.",
      "Many plants grow well in temperate regions.",
      "The island has a mild, temperate climate."
    ],

    predator: [
      "A shark is a predator.",
      "The documentary showed how predators hunt.",
      "Small animals often hide from predators."
    ],

    parrot: [
      "The parrot repeated the same words.",
      "A colourful parrot sat in the tree.",
      "Some parrots can imitate human speech."
    ],

    wealthy: [
      "The family became wealthy through farming.",
      "The region was once home to wealthy landowners.",
      "Not every wealthy person lives a luxurious life."
    ],

    agriculture: [
      "Agriculture is important to the country's economy.",
      "Modern agriculture uses advanced machinery.",
      "The region depends on agriculture and tourism."
    ],

    renewable: [
      "Solar energy is a renewable source of power.",
      "The country is investing in renewable energy.",
      "Wind is a renewable natural resource."
    ],

    heritage: [
      "The building is part of the country's cultural heritage.",
      "The museum protects the region's heritage.",
      "Language is an important part of cultural heritage."
    ],

    funeral: [
      "Many people attended the funeral.",
      "The family held a small funeral.",
      "They travelled home for the funeral."
    ],

    "to mourn": [
      "The family mourned their grandfather.",
      "People gathered to mourn the victims.",
      "It takes time to mourn a loss."
    ],

    "to release": [
      "The band released a new song.",
      "The organisation released its report yesterday.",
      "The zoo released the rescued animal back into the wild."
    ],

    "fairy tale": [
      "The story sounds like a fairy tale.",
      "She read a fairy tale before going to sleep.",
      "The film is based on a famous fairy tale."
    ],

    "to defend": [
      "The player defended the goal.",
      "She defended her opinion with strong arguments.",
      "The team defended its title."
    ],

    concise: [
      "The report was short and concise.",
      "Try to write a concise introduction.",
      "Her explanation was clear and concise."
    ],

    scientific: [
      "The article presents scientific evidence.",
      "They carried out a scientific experiment.",
      "The discovery was important to the scientific community."
    ],

    miracle: [
      "Finding the lost dog felt like a miracle.",
      "The doctors called the recovery a miracle.",
      "It was a miracle that everyone arrived safely."
    ],

    identical: [
      "The two pictures look almost identical.",
      "They wore identical uniforms.",
      "The results were completely identical."
    ],

    rare: [
      "It is rare to see this bird in the city.",
      "The museum has a rare collection of coins.",
      "Snow is rare in this part of the country."
    ],

    handsome: [
      "The actor was described as handsome.",
      "He wore a handsome suit to the ceremony.",
      "The dog was a handsome animal."
    ],

    tolerance: [
      "Tolerance means respecting different opinions.",
      "The lesson focused on tolerance and diversity.",
      "A tolerant society accepts different ways of life."
    ],

    prejudice: [
      "Prejudice can lead to unfair treatment.",
      "The campaign aimed to challenge prejudice.",
      "We should question our own prejudices."
    ],

    stereotype: [
      "The film challenges a common stereotype.",
      "A stereotype does not describe every person.",
      "The class discussed stereotypes in the media."
    ],

    diversity: [
      "The city is known for its cultural diversity.",
      "Diversity can make a community stronger.",
      "The school celebrates diversity."
    ],

    privacy: [
      "Everyone deserves privacy.",
      "The app allows users to protect their privacy.",
      "He did not want to discuss his private life."
    ],

    curious: [
      "The curious child asked many questions.",
      "I was curious about the unusual noise.",
      "She is curious to learn more about the culture."
    ],

    sensitive: [
      "This is a sensitive topic.",
      "He is sensitive to loud noises.",
      "The teacher handled the situation carefully because it was sensitive."
    ],

    rumour: [
      "A rumour spread around the school.",
      "The story turned out to be only a rumour.",
      "She did not believe the rumour."
    ]
  };

  /* =========================================
     2. GERMAN EXAMPLES
  ========================================= */

  const extraGerman = {
    "to speak": [
      { text: "Sie spricht drei Sprachen.", highlight: "spricht" },
      { text: "Wir sprachen mit einem Einheimischen.", highlight: "sprachen" },
      { text: "Er hat schon immer Englisch gesprochen.", highlight: "gesprochen" }
    ],

    "to understand": [
      { text: "Ich verstand die Aufgabe endlich.", highlight: "verstand" },
      { text: "Sie versteht den Text sehr gut.", highlight: "versteht" },
      { text: "Wir haben die Erklärung verstanden.", highlight: "verstanden" }
    ],

    "to translate": [
      { text: "Er übersetzte den Artikel ins Deutsche.", highlight: "übersetzte" },
      { text: "Kannst du diesen Satz übersetzen?", highlight: "übersetzen" },
      { text: "Sie hat den Text gemeinsam mit mir übersetzt.", highlight: "übersetzt" }
    ],

    "to improve": [
      { text: "Sein Englisch hat sich deutlich verbessert.", highlight: "verbessert" },
      { text: "Mit Übung kannst du dich verbessern.", highlight: "verbessern" },
      { text: "Sie verbesserte ihre Aussprache.", highlight: "verbesserte" }
    ],

    "to cancel": [
      { text: "Sie sagten das Spiel wegen des Regens ab.", highlight: "sagten ... ab" },
      { text: "Ich musste meinen Termin absagen.", highlight: "absagen" },
      { text: "Die Fluggesellschaft hat den Flug abgesagt.", highlight: "abgesagt" }
    ],

    "to protect": [
      { text: "Wir müssen die Umwelt schützen.", highlight: "schützen" },
      { text: "Der Helm schützte seinen Kopf.", highlight: "schützte" },
      { text: "Die Regeln sollen die Natur schützen.", highlight: "schützen" }
    ],

    "to prepare": [
      { text: "Wir bereiteten die Präsentation vor.", highlight: "bereiteten ... vor" },
      { text: "Sie bereitet sich auf die Prüfung vor.", highlight: "bereitet ... vor" },
      { text: "Ich habe alles vorbereitet.", highlight: "vorbereitet" }
    ],

    "to explain": [
      { text: "Der Lehrer erklärte die Aufgabe.", highlight: "erklärte" },
      { text: "Kannst du mir das erklären?", highlight: "erklären" },
      { text: "Sie hat ihre Entscheidung erklärt.", highlight: "erklärt" }
    ],

    "to defend": [
      { text: "Der Spieler verteidigte das Tor.", highlight: "verteidigte" },
      { text: "Sie verteidigt ihre Meinung.", highlight: "verteidigt" },
      { text: "Das Team hat seinen Titel verteidigt.", highlight: "verteidigt" }
    ],

    "to belong to": [
      { text: "Dieses Buch gehört meiner Schwester.", highlight: "gehört" },
      { text: "Das Land gehört der Gemeinschaft.", highlight: "gehört" },
      { text: "Die Tradition gehört zu ihrer Kultur.", highlight: "gehört" }
    ],

    "to migrate": [
      { text: "Viele Vögel wandern im Winter nach Süden.", highlight: "wandern" },
      { text: "Die Familie wanderte in eine andere Region aus.", highlight: "wanderte ... aus" },
      { text: "Einige Tiere sind weit gewandert.", highlight: "gewandert" }
    ]
  };

  /* =========================================
     3. MERGE WITH EXISTING DATABASES
  ========================================= */

  Object.assign(exampleSentences, extraEnglish);

  // Normalize existing keys because getExample() uses lowercase keys.
  Object.keys(exampleSentences).forEach(key => {
    const lower = key.toLowerCase();

    if (lower !== key) {
      if (!exampleSentences[lower]) {
        exampleSentences[lower] = exampleSentences[key];
      }

      delete exampleSentences[key];
    }
  });

  if (typeof zunoGermanExamples !== "undefined") {
    Object.assign(zunoGermanExamples, extraGerman);
  }

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
    think: ["thinks", "thought", "thinking"]
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
    let phrase = String(word).toLowerCase().trim();

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

        return new RegExp(
          tokens.join("\\s+"),
          "iu"
        );
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
     5. BETTER FALLBACK EXAMPLES
  ========================================= */

  const exampleRotations = {};

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

  function fallbackExamples(word) {
    const raw = String(word).trim();
    const key = raw.toLowerCase();

    if (key.startsWith("to be short of")) {
      return [
        "We are short of time, so we should hurry.",
        "The team was short of players yesterday.",
        "They have been short of money recently."
      ];
    }

    if (key.startsWith("to be stuck")) {
      return [
        "We were stuck in traffic for an hour.",
        "I am stuck on the last question.",
        "The hikers got stuck near the river."
      ];
    }

    if (key.startsWith("to be in progress")) {
      return [
        "The repairs are in progress.",
        "The project was still in progress yesterday.",
        "Several changes are currently in progress."
      ];
    }

    if (key.startsWith("to be responsible for")) {
      return [
        "She is responsible for organising the event.",
        "They were responsible for the final decision.",
        "Who is responsible for this project?"
      ];
    }

    if (key.startsWith("to ")) {
      const phrase = key.slice(3)
        .replace(/\s*\([^)]*\)/g, "")
        .replace(/\bsth\b/g, "something")
        .replace(/\bsb\b/g, "somebody")
        .trim();

      if (phrase.startsWith("be ")) {
        return [
          "The situation can be described in different ways.",
          "The team was in a difficult situation.",
          "The result was not what we expected."
        ];
      }

      return [
        `I want to ${phrase} before the end of the day.`,
        `We tried to ${phrase} during the project.`,
        `It is important to ${phrase} when necessary.`
      ];
    }

    if (adjectiveWords.has(key)) {
      return [
        `The explanation was ${raw}.`,
        `The result was surprisingly ${raw}.`,
        `It was a ${raw} situation.`
      ];
    }

    return [
      `The article mentions ${raw}.`,
      `We discussed ${raw} during the lesson.`,
      `The text gives an example of ${raw}.`
    ];
  }

  window.getExample = function(word) {
    const key = String(word).toLowerCase();
    const examples = exampleSentences[key] || fallbackExamples(word);

    const index = exampleRotations[key] || 0;
    exampleRotations[key] = (index + 1) % examples.length;

    return examples[index];
  };

  console.log("ZUNO Examples v1.0 loaded.");
})();
