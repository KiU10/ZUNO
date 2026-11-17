/* =========================================
   ZUNO PROGRESS SYSTEM
========================================= */

(() => {
  "use strict";

  const GAME_COST = 50;
  const LAST_LESSON_KEY = "zuno_last_lesson_day";
  const STREAK_PASS_RATE = 0.70;

  function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getToday() {
    return getLocalDateKey();
  }

  function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return getLocalDateKey(date);
  }

  function getXP() {
    return Number(state.xp) || 0;
  }

  function getStreak() {
    return Number(state.streak) || 0;
  }

  function updateXPDisplay() {
    if (typeof state === "undefined") return;

    const xp = getXP();
    const streak = getStreak();

    const balance = document.getElementById("zunoXPBalance");
    const arcadeXP = document.getElementById("zunoArcadeXP");
    const streakDisplay = document.getElementById("zunoXPStreak");

    if (balance) balance.textContent = xp;
    if (arcadeXP) arcadeXP.textContent = xp;
    if (streakDisplay) streakDisplay.textContent = streak;
  }

  function persistProgress() {
    if (typeof saveState === "function") {
      saveState();
    }

    if (typeof updateDashboard === "function") {
      updateDashboard();
    }

    updateXPDisplay();

    if (window.updateZUNOArcade) {
      window.updateZUNOArcade();
    }
  }

  /* =========================================
     STREAK-LOGIK
  ========================================= */

  function updateStreak() {
    const today = getToday();
    const lastDay = localStorage.getItem(LAST_LESSON_KEY);

    if (lastDay === today) return false;

    const currentStreak = getStreak();

    if (lastDay === getYesterday()) {
      state.streak = currentStreak + 1;
    } else {
      state.streak = 1;
    }

    localStorage.setItem(LAST_LESSON_KEY, today);

    persistProgress();

    if (window.showStreakAnimation) {
      window.showStreakAnimation();
    }

    return true;
  }

  function isCompletedLesson() {
    return (
      Array.isArray(state.session) &&
      state.session.length > 0 &&
      state.answered === true &&
      state.index === state.session.length - 1
    );
  }

  function hasPassedLesson() {
    const correct = Number(state.correct) || 0;
    const wrong = Number(state.wrong) || 0;
    const attempts = correct + wrong;

    return attempts > 0 && correct / attempts >= STREAK_PASS_RATE;
  }

  /* =========================================
     XP-SEITE UND NAVIGATION
  ========================================= */

  window.showXPPage = function() {
    updateXPDisplay();

    if (typeof showOnly === "function") {
      showOnly("xpPage");
    }
  };

  window.showArcadePage = function() {
    updateXPDisplay();

    if (typeof showOnly === "function") {
      showOnly("arcadePage");
    }

    if (window.updateZUNOArcade) {
      window.updateZUNOArcade();
    }
  };

  /* =========================================
     XP-ANZEIGE BEI DASHBOARD-UPDATES
  ========================================= */

  const originalUpdateDashboard = window.updateDashboard;

  if (typeof originalUpdateDashboard === "function") {
    window.updateDashboard = function(...args) {
      const result = originalUpdateDashboard.apply(this, args);

      updateXPDisplay();

      const xpButton = document.querySelector(".zuno-xp-trigger");

      if (xpButton) {
        xpButton.classList.remove("zuno-xp-pop");
        void xpButton.offsetWidth;
        xpButton.classList.add("zuno-xp-pop");
      }

      return result;
    };
  }

  /* =========================================
     LESSON-START ERKENNEN
  ========================================= */

  const originalStartSession = window.startSession;

  if (typeof originalStartSession === "function") {
    window.startSession = function(...args) {
      state._zunoStreakRecorded = false;
      return originalStartSession.apply(this, args);
    };
  }

  /* =========================================
     STREAK NACH ABGESCHLOSSENER LESSON
  ========================================= */

  const originalFinishSession = window.finishSession;

  if (typeof originalFinishSession === "function") {
    window.finishSession = function(...args) {
      const completed = isCompletedLesson();
      const passed = completed && hasPassedLesson();

      if (completed && !state._zunoStreakRecorded) {
        state._zunoStreakRecorded = true;

        if (passed) {
          updateStreak();
        }
      }

      const result = originalFinishSession.apply(this, args);

      updateXPDisplay();

      return result;
    };
  }

  /* =========================================
     RICHTIGE ANTWORT ANIMIEREN
  ========================================= */

  const originalCheckAnswer = window.checkAnswer;

  if (typeof originalCheckAnswer === "function") {
    window.checkAnswer = function(answer, word) {
      const wasAnswered = state.answered;

      const correct =
        !wasAnswered &&
        typeof answerMatches === "function" &&
        answerMatches(answer, word);

      const result =
        originalCheckAnswer.apply(this, arguments);

      if (correct && state.answered) {
        if (window.showCorrectAnimation) {
          window.showCorrectAnimation();
        }
      }

      updateXPDisplay();

      return result;
    };
  }

  /* =========================================
     XP UND SPIELKOSTEN
  ========================================= */

  window.ZUNOProgress = {
    get streak() {
      return getStreak();
    },

    get xp() {
      return getXP();
    },

    get gameCost() {
      return GAME_COST;
    },

    get streakPassRate() {
      return STREAK_PASS_RATE;
    },

    get unlockedGames() {
      const streak = getStreak();

      return {
        snake: true,
        reaction: true,
        memory: true,
        runner: streak >= 3,
        adventure: streak >= 5
      };
    },

    startGame() {
      const currentXP = getXP();

      if (currentXP < GAME_COST) {
        alert(`Du brauchst ${GAME_COST} XP für eine Spielrunde.`);
        return false;
      }

      state.xp = currentXP - GAME_COST;

      persistProgress();

      return true;
    }
  };

  /* =========================================
     LOKALE TESTTOOLS
     Nur sichtbar mit ?zunoTestTools=1
     NICHT als sichere Admin-Funktion gedacht.
  ========================================= */

  function createLocalTestTools() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("zunoTestTools") !== "1") return;
    if (document.getElementById("zunoLocalTestTools")) return;

    const panel = document.createElement("div");
    panel.id = "zunoLocalTestTools";

    panel.style.cssText = [
      "position:fixed",
      "right:12px",
      "bottom:12px",
      "z-index:99999",
      "display:flex",
      "flex-direction:column",
      "gap:7px",
      "padding:12px",
      "border:1px solid #777",
      "border-radius:12px",
      "background:#171717",
      "color:white",
      "font:12px sans-serif",
      "box-shadow:0 5px 24px #0008"
    ].join(";");

    const heading = document.createElement("strong");
    heading.textContent = "ZUNO LOCAL TEST TOOLS";
    panel.appendChild(heading);

    const note = document.createElement("span");
    note.textContent = "Nur lokaler Test in diesem Browser";
    panel.appendChild(note);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "+1 Streak";
    addButton.style.cssText = "padding:8px;border:0;border-radius:7px;cursor:pointer";

    addButton.addEventListener("click", () => {
      state.streak = getStreak() + 1;
      persistProgress();

      if (window.showStreakAnimation) {
        window.showStreakAnimation();
      }
    });

    panel.appendChild(addButton);

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "Streak zurücksetzen";
    resetButton.style.cssText = "padding:8px;border:0;border-radius:7px;cursor:pointer";

    resetButton.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Deinen lokalen Streak wirklich auf 0 zurücksetzen?"
      );

      if (!confirmed) return;

      state.streak = 0;
      localStorage.removeItem(LAST_LESSON_KEY);
      persistProgress();
    });

    panel.appendChild(resetButton);
    document.body.appendChild(panel);
  }

  /* =========================================
     STREAK-ANIMATION
  ========================================= */

  window.showStreakAnimation = function() {
    const streakElement =
      document.getElementById("headerStreak");

    const pill = streakElement
      ? streakElement.closest(".pill")
      : null;

    if (pill) {
      pill.classList.remove("zuno-streak-burst");
      void pill.offsetWidth;
      pill.classList.add("zuno-streak-burst");

      setTimeout(() => {
        pill.classList.remove("zuno-streak-burst");
      }, 1100);

      return;
    }

    const burst = document.createElement("div");

    burst.className = "zuno-streak-toast";
    burst.textContent = `🔥 ${getStreak()}-Tage-Streak!`;

    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 1600);
  };

  updateXPDisplay();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createLocalTestTools, {
      once: true
    });
  } else {
    createLocalTestTools();
  }
})();
