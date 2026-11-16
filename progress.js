/* =========================================
   ZUNO PROGRESS SYSTEM
========================================= */

(() => {
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

    // Bereits heute eine Lesson abgeschlossen.
    if (lastDay === today) return false;

    if (lastDay === getYesterday()) {
      state.streak += 1;
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
        state.index >= state.session.length;

      const result = originalFinishSession.apply(this, args);

      if (
        completed &&
        !state._zunoStreakRecorded &&
        state.correct + state.wrong > 0
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
      const correct = !wasAnswered && answerMatches(answer, word);

      const result = originalCheckAnswer.apply(this, arguments);

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
      return state.streak;
    },

    get xp() {
      return state.xp;
    },

    get gameCost() {
      return GAME_COST;
    },

    get unlockedGames() {
      return {
        snake: true,
        reaction: true,
        memory: true,
        runner: state.streak >= 3,
        adventure: state.streak >= 5
      };
    },

    startGame() {
      if (state.xp < GAME_COST) {
        alert(
          `Du brauchst ${GAME_COST} XP für eine Spielrunde.`
        );

        return false;
      }

      // XP werden beim Start abgezogen.
      state.xp -= GAME_COST;

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

    if (!streakElement) return;

    const pill = streakElement.closest(".pill");

    if (!pill) return;

    pill.classList.remove("zuno-streak-burst");

    void pill.offsetWidth;

    pill.classList.add("zuno-streak-burst");

    setTimeout(() => {
      pill.classList.remove("zuno-streak-burst");
    }, 1100);
  };

})();
