/* =========================================
   ZUNO PROGRESS SYSTEM
========================================= */

(() => {
  "use strict";

  const GAME_COST = 50;
  const LAST_LESSON_KEY = "zuno_last_lesson_day";

  function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function updateStreak() {
    const today = getToday();
    const lastDay = localStorage.getItem(LAST_LESSON_KEY);

    if (lastDay === today) {
      return false;
    }

    const currentStreak = Number(state.streak) || 0;

    if (lastDay === getYesterday()) {
      state.streak = currentStreak + 1;
    } else {
      state.streak = 1;
    }

    localStorage.setItem(LAST_LESSON_KEY, today);

    saveState();
    updateDashboard();

    if (window.showStreakAnimation) {
      window.showStreakAnimation();
    }

    return true;
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
      const completed =
        Array.isArray(state.session) &&
        state.index >= state.session.length;

      const result = originalFinishSession.apply(this, args);

      const attempts =
        (Number(state.correct) || 0) +
        (Number(state.wrong) || 0);

      if (
        completed &&
        !state._zunoStreakRecorded &&
        attempts > 0
      ) {
        state._zunoStreakRecorded = true;
        updateStreak();
      }

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

      return result;
    };
  }

  /* =========================================
     XP UND SPIELKOSTEN
  ========================================= */

  window.ZUNOProgress = {
    get streak() {
      return Number(state.streak) || 0;
    },

    get xp() {
      return Number(state.xp) || 0;
    },

    get gameCost() {
      return GAME_COST;
    },

    get unlockedGames() {
      const streak = Number(state.streak) || 0;

      return {
        snake: true,
        reaction: true,
        memory: true,
        runner: streak >= 3,
        adventure: streak >= 5
      };
    },

    startGame() {
      const currentXP = Number(state.xp) || 0;

      if (currentXP < GAME_COST) {
        alert(
          `Du brauchst ${GAME_COST} XP für eine Spielrunde.`
        );

        return false;
      }

      // XP werden ausschließlich beim Start einer Runde abgezogen.
      state.xp = currentXP - GAME_COST;

      saveState();
      updateDashboard();

      return true;
    }
  };

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

    // Fallback, falls die App keinen headerStreak besitzt.
    const burst = document.createElement("div");

    burst.className = "zuno-streak-toast";
    burst.textContent = `🔥 ${state.streak}-Tage-Streak!`;

    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 1600);
  };

})();
