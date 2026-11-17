
/* =========================================
   ZUNO ARCADE
   Enhanced Games Edition
========================================= */

(() => {
  "use strict";

  const COST = 50;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HIGH_SCORE_KEY = "zunoArcadeHighscores";

  const games = [
    { id: "snake", title: "Snake", icon: "🐍", description: "Sammle Punkte und werde immer länger.", unlock: 0 },
    { id: "reaction", title: "Reaction Rush", icon: "⚡", description: "Wie schnell kannst du reagieren?", unlock: 0 },
    { id: "memory", title: "Memory", icon: "🧠", description: "Finde alle passenden Kartenpaare.", unlock: 0 },
    { id: "runner", title: "Endless Runner", icon: "🏃", description: "Springe über Hindernisse und halte durch.", unlock: 3 },
    { id: "adventure", title: "Mini Adventure", icon: "🗺️", description: "Erkunde Level, sammle Münzen und weiche Hindernissen aus.", unlock: 5 }
  ];

  let overlay = null;
  let activeCleanup = null;

  /* =========================================
     HIGHSCORES
  ========================================= */

  function getHighscores() {
    try {
      return JSON.parse(localStorage.getItem(HIGH_SCORE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function getHighscore(id) {
    return getHighscores()[id] ?? null;
  }

  function saveHighscore(id, value, lowerIsBetter = false) {
    const scores = getHighscores();
    const previous = scores[id];

    const isNewRecord =
      previous === undefined ||
      (lowerIsBetter ? value < previous : value > previous);

    if (isNewRecord) {
      scores[id] = value;

      try {
        localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(scores));
      } catch (error) {
        console.warn("ZUNO: Highscore konnte nicht gespeichert werden.", error);
      }
    }

    return isNewRecord;
  }

  function highscoreLabel(id) {
    const score = getHighscore(id);

    if (score === null) return "Noch kein Rekord";
    if (id === "reaction") return `Bestzeit: ${score} ms`;
    if (id === "memory") return `Rekord: ${score} Züge`;

    return `Rekord: ${score} Punkte`;
  }

  /* =========================================
     STYLES
  ========================================= */

  function injectGameStyles() {
    if (document.getElementById("zunoEnhancedGameStyles")) return;

    const style = document.createElement("style");
    style.id = "zunoEnhancedGameStyles";

    style.textContent = `
      .zuno-game-overlay {
        overscroll-behavior: contain;
      }

      .zuno-game-window {
        overscroll-behavior: contain;
      }

      .zuno-game-stage {
        position: relative;
        overflow: hidden;
        overscroll-behavior: contain;
      }

      .zuno-game-stage canvas {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
        border-radius: 14px;
        touch-action: none;
      }

      /* Snake: feste Touch-Fläche */
      .zuno-snake-stage {
        touch-action: none !important;
        overscroll-behavior: none !important;
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      .zuno-snake-stage canvas {
        touch-action: none !important;
        -webkit-user-select: none;
        user-select: none;
      }

      .zuno-countdown {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        pointer-events: none;
        background: rgba(20, 18, 38, .55);
        backdrop-filter: blur(5px);
        color: white;
        font-size: clamp(4rem, 18vw, 7rem);
        font-weight: 1000;
        animation: zunoCountdownIn .45s ease both;
      }

      .zuno-countdown.go {
        color: #c9ef9a;
      }

      @keyframes zunoCountdownIn {
        0% { transform: scale(.35); opacity: 0; }
        65% { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }

      .zuno-game-stage.zuno-game-shake {
        animation: zunoGameShake .35s ease;
      }

      @keyframes zunoGameShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-7px); }
        40% { transform: translateX(7px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }

      .zuno-game-stage.zuno-game-success {
        animation: zunoGameSuccess .55s ease;
      }

      @keyframes zunoGameSuccess {
        0% { transform: scale(1); }
        45% { transform: scale(1.035); }
        100% { transform: scale(1); }
      }

      .zuno-game-message {
        font-weight: 800;
      }

      .zuno-game-record {
        color: #c9ef9a;
        font-weight: 900;
        animation: zunoRecordPop .5s ease both;
      }

      @keyframes zunoRecordPop {
        0% { transform: scale(.7); opacity: 0; }
        65% { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* MEMORY */

      .zuno-memory-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
        max-width: 340px;
        margin: 0 auto;
        perspective: 1000px;
      }

      .zuno-memory-card {
        position: relative;
        aspect-ratio: 1;
        padding: 0;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 12px;
        background: transparent;
        color: white;
        font-size: clamp(1.3rem, 6vw, 2rem);
        font-weight: 900;
        cursor: pointer;
        transform-style: preserve-3d;
        transition: transform .45s cubic-bezier(.2,.8,.2,1);
      }

      .zuno-memory-card::before,
      .zuno-memory-card::after {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .zuno-memory-card::before {
        content: "?";
        background: #39344f;
        color: white;
      }

      .zuno-memory-card::after {
        content: attr(data-symbol);
        background: #c9ef9a;
        color: #242238;
        transform: rotateY(180deg);
      }

      .zuno-memory-card.revealed {
        transform: rotateY(180deg);
      }

      .zuno-memory-card.matched {
        transform: rotateY(180deg) scale(.92);
        opacity: .82;
        animation: zunoMemoryMatch .45s ease both;
      }

      @keyframes zunoMemoryMatch {
        0% { transform: rotateY(180deg) scale(1); }
        45% { transform: rotateY(180deg) scale(1.12); }
        100% { transform: rotateY(180deg) scale(.92); }
      }

      .zuno-memory-card.matched::after {
        background: #8fcf79;
        box-shadow:
          inset 0 0 0 2px rgba(255,255,255,.3),
          0 0 18px rgba(155,225,127,.45);
      }

      .zuno-memory-card:disabled {
        cursor: default;
      }

      /* REACTION RUSH */

      .zuno-reaction-button {
        position: relative;
        width: 100%;
        min-height: 220px;
        overflow: hidden;
        border-radius: 18px;
        border: 0;
        background: #39344f;
        color: white;
        font-size: 1.5rem;
        font-weight: 900;
        cursor: pointer;
        transition: background .25s, transform .25s, box-shadow .25s;
      }

      .zuno-reaction-button.waiting {
        background: #514966;
      }

      .zuno-reaction-button.ready {
        background: #9be17f;
        color: #172313;
        transform: scale(1.025);
        box-shadow:
          0 0 0 5px rgba(155,225,127,.15),
          0 0 45px rgba(155,225,127,.7);
        animation: zunoReactionPulse .55s ease-in-out infinite alternate;
      }

      .zuno-reaction-button.too-early {
        background: #ffaaa3;
        color: #421c22;
        animation: zunoReactionWrong .35s ease;
      }

      .zuno-reaction-button.result {
        background: #c9ef9a;
        color: #172313;
        animation: zunoReactionResult .45s ease;
      }

      @keyframes zunoReactionPulse {
        from { box-shadow: 0 0 12px rgba(155,225,127,.3); }
        to { box-shadow: 0 0 45px rgba(155,225,127,.8); }
      }

      @keyframes zunoReactionWrong {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        50% { transform: translateX(8px); }
        75% { transform: translateX(-4px); }
      }

      @keyframes zunoReactionResult {
        0% { transform: scale(.92); }
        65% { transform: scale(1.06); }
        100% { transform: scale(1); }
      }

      .zuno-reaction-count {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(4rem, 18vw, 6rem);
        font-weight: 1000;
        color: white;
        background: rgba(20,18,38,.5);
        pointer-events: none;
        animation: zunoCountdownIn .4s ease both;
      }

      .zuno-reaction-count.go {
        color: #c9ef9a;
      }

      .zuno-stage-particles {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .zuno-stage-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #c9ef9a;
        animation: zunoMemoryParticle .75s ease-out forwards;
      }

      @keyframes zunoMemoryParticle {
        from {
          opacity: 1;
          transform: translate(0,0) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(var(--particle-x),var(--particle-y)) scale(.1);
        }
      }

      .zuno-game-stage button:focus-visible,
      .zuno-game-actions button:focus-visible {
        outline: 3px solid #c9ef9a;
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .zuno-countdown,
        .zuno-game-stage.zuno-game-shake,
        .zuno-game-stage.zuno-game-success,
        .zuno-reaction-button,
        .zuno-memory-card,
        .zuno-memory-card.matched,
        .zuno-stage-particle,
        .zuno-game-record {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     HELPERS
  ========================================= */

  function getStreak() {
    return window.ZUNOProgress
      ? Number(window.ZUNOProgress.streak) || 0
      : 0;
  }

  function getXP() {
    return window.ZUNOProgress
      ? Number(window.ZUNOProgress.xp) || 0
      : 0;
  }

  function isUnlocked(game) {
    return getStreak() >= game.unlock;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function animateStage(className) {
    const element = stage();
    if (!element || REDUCED_MOTION) return;

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    setTimeout(() => element.classList.remove(className), 600);
  }

  function showStageParticles(x, y, amount = 14) {
    const element = stage();
    if (!element || REDUCED_MOTION) return;

    const layer = document.createElement("div");
    layer.className = "zuno-stage-particles";
    element.appendChild(layer);

    const rect = element.getBoundingClientRect();

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");
      particle.className = "zuno-stage-particle";

      particle.style.left = `${x - rect.left}px`;
      particle.style.top = `${y - rect.top}px`;
      particle.style.setProperty("--particle-x", `${randomBetween(-65,65)}px`);
      particle.style.setProperty("--particle-y", `${randomBetween(-65,65)}px`);

      layer.appendChild(particle);
    }

    setTimeout(() => layer.remove(), 850);
  }

  function createParticles(canvas, x, y, color, amount = 10) {
    if (REDUCED_MOTION || !canvas || !canvas.isConnected) return;

    const ctx = canvas.getContext("2d");
    const particles = [];

    for (let i = 0; i < amount; i++) {
      particles.push({
        x,
        y,
        vx: randomBetween(-3, 3),
        vy: randomBetween(-3, 3),
        life: 1,
        size: randomBetween(2, 5)
      });
    }

    let frame = 0;

    function animate() {
      if (!canvas.isConnected || frame++ > 24) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= .04;

        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function updateRecordMessage(isRecord) {
    if (!isRecord) return;

    const element = document.getElementById("zunoGameMessage");
    if (!element) return;

    element.textContent += " 🏆 Neuer Rekord!";
    element.classList.add("zuno-game-record");
  }

  /* =========================================
     ARCADE ERSTELLEN
  ========================================= */

  function createArcade() {
    const arcadePage = document.getElementById("arcadePage");
    if (!arcadePage) return;

    let arcade = document.getElementById("zunoArcade");

    if (!arcade) {
      arcade = document.createElement("section");
      arcade.id = "zunoArcade";

      arcade.innerHTML = `
        <div class="zuno-arcade-heading">
          <div>
            <h1>🎮 ZUNO Arcade</h1>
            <p class="zuno-arcade-subtitle">
              Gib deine verdienten XP für Spielrunden aus.
            </p>
          </div>

          <span class="pill zuno-arcade-xp">
            ⚡ <span id="zunoArcadeXP">0</span> XP
          </span>
        </div>

        <div class="zuno-game-grid" id="zunoGameGrid"></div>
      `;

      arcadePage.appendChild(arcade);
    }

    renderGameCards();
  }

  function renderGameCards() {
    const grid = document.getElementById("zunoGameGrid");
    if (!grid) return;

    grid.innerHTML = games.map(game => {
      const unlocked = isUnlocked(game);

      return `
        <article class="zuno-game-card ${unlocked ? "" : "locked"}">
          <div class="zuno-game-icon">${game.icon}</div>
          <h3>${game.title}</h3>
          <p>${game.description}</p>
          <span class="zuno-game-lock">
            ${unlocked
              ? (game.unlock === 0
                ? "Immer verfügbar"
                : `${game.unlock}-Tage-Streak erreicht`)
              : `🔒 Ab ${game.unlock}-Tage-Streak`}
          </span>
          <p class="zuno-game-highscore">${highscoreLabel(game.id)}</p>
          ${
            unlocked
              ? `<button type="button" data-game="${game.id}">Spielen · ${COST} XP</button>`
              : `<button type="button" disabled>Noch gesperrt</button>`
          }
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-game]").forEach(button => {
      button.addEventListener("click", () => openGame(button.dataset.game));
    });

    const xp = document.getElementById("zunoArcadeXP");
    if (xp) xp.textContent = getXP();
  }

  window.updateZUNOArcade = renderGameCards;

  /* =========================================
     GAME OVERLAY
  ========================================= */

  function stopActiveGame() {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
  }

  function closeGame() {
    stopActiveGame();

    if (overlay) {
      overlay.remove();
      overlay = null;
    }

    renderGameCards();
  }

  function createOverlay(game) {
    closeGame();

    overlay = document.createElement("div");
    overlay.className = "zuno-game-overlay";

    overlay.innerHTML = `
      <div class="zuno-game-window">
        <div class="zuno-game-top">
          <h2>${game.icon} ${game.title}</h2>
          <button class="zuno-game-close" type="button" aria-label="Spiel schließen">✕</button>
        </div>

        <div class="zuno-game-stage" id="zunoGameStage">
          <div>
            <h2>Bereit?</h2>
            <p>${game.description}</p>
            <p><strong>${COST} XP</strong> pro Spielrunde</p>
            <p>${highscoreLabel(game.id)}</p>
          </div>
        </div>

        <div class="zuno-game-info" id="zunoGameInfo"></div>
        <div class="zuno-game-actions" id="zunoGameActions">
          <button type="button" id="zunoStartGame">Spiel starten · ${COST} XP</button>
        </div>
        <p class="zuno-game-message" id="zunoGameMessage"></p>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".zuno-game-close")
      .addEventListener("click", closeGame);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeGame();
    });

    bindAction("zunoStartGame", () => startGame(game.id));
  }

  function openGame(id) {
    const game = games.find(item => item.id === id);
    if (!game || !isUnlocked(game)) return;
    createOverlay(game);
  }

  function stage() {
    return document.getElementById("zunoGameStage");
  }

  function message(text) {
    const element = document.getElementById("zunoGameMessage");
    if (element) element.textContent = text;
  }

  function info(text) {
    const element = document.getElementById("zunoGameInfo");
    if (element) element.textContent = text;
  }

  function actions(html) {
    const element = document.getElementById("zunoGameActions");
    if (element) element.innerHTML = html;
  }

  function bindAction(id, callback) {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", callback);
  }

  /* =========================================
     COUNTDOWN
  ========================================= */

  function startCountdown(onFinish) {
    let count = 3;
    let stopped = false;
    let timeout = null;

    const element = document.createElement("div");
    element.className = "zuno-countdown";
    element.textContent = count;
    stage().appendChild(element);

    function next() {
      if (stopped || !element.isConnected) return;

      if (count > 1) {
        count--;
        element.textContent = count;

        element.style.animation = "none";
        void element.offsetWidth;
        element.style.animation = "";

        timeout = setTimeout(next, 1000);
      } else {
        element.textContent = "GO!";
        element.classList.add("go");

        timeout = setTimeout(() => {
          element.remove();
          if (!stopped) onFinish();
        }, 500);
      }
    }

    timeout = setTimeout(next, 1000);

    return () => {
      stopped = true;
      clearTimeout(timeout);
      element.remove();
    };
  }

  /* =========================================
     JEDE RUNDE KOSTET 50 XP
  ========================================= */

  function startGame(id) {
    const game = games.find(item => item.id === id);
    if (!game || !isUnlocked(game)) return;

    if (
      !window.ZUNOProgress ||
      typeof window.ZUNOProgress.startGame !== "function"
    ) {
      message("Das XP-System konnte nicht geladen werden.");
      return;
    }

    stopActiveGame();

    if (!window.ZUNOProgress.startGame()) {
      renderGameCards();
      return;
    }

    renderGameCards();

    if (id === "snake") startSnake();
    if (id === "reaction") startReaction();
    if (id === "memory") startMemory();
    if (id === "runner") startRunner();
    if (id === "adventure") startAdventure();
  }

  /* =========================================
     SNAKE
  ========================================= */

  function startSnake() {
    stage().classList.add("zuno-snake-stage");

    stage().innerHTML = `
      <canvas id="zunoSnakeCanvas" width="320" height="320"
        aria-label="Snake-Spiel"></canvas>
      <p class="small">Wische in die gewünschte Richtung.</p>
    `;

    actions("");

    const canvas = document.getElementById("zunoSnakeCanvas");
    const ctx = canvas.getContext("2d");

    const size = 16;
    const cells = 20;

    let snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];

    let direction = { x: 1, y: 0 };
    let nextDirection = { ...direction };
    let food = null;
    let score = 0;
    let running = false;
    let interval = null;
    let countdownCleanup = null;
    let touchStart = null;

    function randomFood() {
      const available = [];

      for (let x = 0; x < cells; x++) {
        for (let y = 0; y < cells; y++) {
          if (!snake.some(part => part.x === x && part.y === y)) {
            available.push({ x, y });
          }
        }
      }

      return available.length
        ? available[Math.floor(Math.random() * available.length)]
        : null;
    }

    food = randomFood();

    function changeDirection(x, y) {
      if (x === -direction.x && y === -direction.y) return;
      nextDirection = { x, y };
    }

    function keyHandler(event) {
      const keys = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0]
      };

      if (keys[event.key]) {
        event.preventDefault();
        changeDirection(...keys[event.key]);
      }
    }

    function touchStartHandler(event) {
      if (!running || !event.changedTouches.length) return;

      const touch = event.changedTouches[0];

      touchStart = {
        x: touch.clientX,
        y: touch.clientY
      };
    }

    function touchMoveHandler(event) {
      // Verhindert Scrollen und Verschieben beim Wischen.
      if (running) event.preventDefault();
    }

    function touchEndHandler(event) {
      if (!running || !touchStart || !event.changedTouches.length) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;

      touchStart = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Kleine und uneindeutige diagonale Wischer ignorieren.
      const MIN_SWIPE = 24;
      const AXIS_RATIO = 1.35;

      if (Math.max(absX, absY) < MIN_SWIPE) return;

      if (absX >= absY * AXIS_RATIO) {
        changeDirection(dx > 0 ? 1 : -1, 0);
      } else if (absY >= absX * AXIS_RATIO) {
        changeDirection(0, dy > 0 ? 1 : -1);
      }
    }

    window.addEventListener("keydown", keyHandler);

    canvas.addEventListener("touchstart", touchStartHandler, { passive: true });
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
    canvas.addEventListener("touchend", touchEndHandler, { passive: true });

    const preventGesture = event => event.preventDefault();

    canvas.addEventListener("gesturestart", preventGesture);
    canvas.addEventListener("gesturechange", preventGesture);
    canvas.addEventListener("gestureend", preventGesture);

    function draw() {
      ctx.fillStyle = "#242238";
      ctx.fillRect(0, 0, 320, 320);

      ctx.strokeStyle = "rgba(255,255,255,.035)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, 320);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(320, i * size);
        ctx.stroke();
      }

      if (food) {
        ctx.shadowColor = "#ff8b68";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ff8b68";
        ctx.beginPath();
        ctx.arc(
          food.x * size + size / 2,
          food.y * size + size / 2,
          6,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      snake.forEach((part, index) => {
        const inset = index === 0 ? 1 : 2;

        ctx.fillStyle = index === 0 ? "#d9ffa7" : "#8fcf79";
        ctx.shadowColor = index === 0 ? "#c9ef9a" : "transparent";
        ctx.shadowBlur = index === 0 ? 8 : 0;

        ctx.beginPath();
        ctx.roundRect(
          part.x * size + inset,
          part.y * size + inset,
          size - inset * 2,
          size - inset * 2,
          5
        );
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }

    function endGame() {
      if (!running) return;

      running = false;
      clearInterval(interval);

      const isRecord = saveHighscore("snake", score);

      animateStage("zuno-game-shake");
      message(`Game Over! Du hast ${score} Punkte erreicht.`);
      updateRecordMessage(isRecord);

      actions(`<button id="snakeAgain">Nochmal spielen · 50 XP</button>`);
      bindAction("snakeAgain", () => startGame("snake"));
    }

    function tick() {
      if (!running) return;

      direction = { ...nextDirection };

      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };

      const eating = food && head.x === food.x && head.y === food.y;

      const hitWall =
        head.x < 0 || head.y < 0 ||
        head.x >= cells || head.y >= cells;

      const bodyToCheck = eating ? snake : snake.slice(0, -1);

      const hitSnake = bodyToCheck.some(part =>
        part.x === head.x && part.y === head.y
      );

      if (hitWall || hitSnake) {
        endGame();
        return;
      }

      snake.unshift(head);

      if (eating) {
        score++;
        food = randomFood();

        info(`Punkte: ${score}`);

        createParticles(
          canvas,
          head.x * size + size / 2,
          head.y * size + size / 2,
          "#c9ef9a",
          12
        );

        if (!food) {
          running = false;
          clearInterval(interval);

          const isRecord = saveHighscore("snake", score);

          message("Perfekt! Du hast das ganze Feld gefüllt! 🏆");
          updateRecordMessage(isRecord);
          animateStage("zuno-game-success");

          actions(`<button id="snakeAgain">Nochmal spielen · 50 XP</button>`);
          bindAction("snakeAgain", () => startGame("snake"));
          return;
        }
      } else {
        snake.pop();
      }

      draw();
    }

    function begin() {
      if (!canvas.isConnected) return;

      running = true;
      interval = setInterval(tick, 125);
      draw();
    }

    info("Punkte: 0");
    draw();

    countdownCleanup = startCountdown(begin);

    activeCleanup = () => {
      running = false;
      clearInterval(interval);

      if (countdownCleanup) countdownCleanup();

      window.removeEventListener("keydown", keyHandler);

      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
      canvas.removeEventListener("touchend", touchEndHandler);

      canvas.removeEventListener("gesturestart", preventGesture);
      canvas.removeEventListener("gesturechange", preventGesture);
      canvas.removeEventListener("gestureend", preventGesture);

      stage()?.classList.remove("zuno-snake-stage");
    };
  }

  /* =========================================
     REACTION RUSH
  ========================================= */

  function startReaction() {
    stage().innerHTML = `
      <button id="reactionButton" class="zuno-reaction-button">
        Bereit?
      </button>
    `;

    actions("");
    info("Reaktionszeit: –");

    const button = document.getElementById("reactionButton");

    let finished = false;
    let ready = false;
    let startTime = 0;
    let randomTimeout = null;
    let countdownTimeout = null;
    let countdownValue = 3;

    button.classList.add("waiting");

    function showCountdown() {
      if (finished) return;

      button.textContent = "Mach dich bereit ...";

      const count = document.createElement("span");
      count.className = "zuno-reaction-count";
      count.textContent = countdownValue;
      button.appendChild(count);

      countdownTimeout = setTimeout(() => {
        if (finished) return;

        count.remove();

        if (countdownValue > 1) {
          countdownValue--;
          showCountdown();
        } else {
          button.textContent = "Warte auf GRÜN ...";

          randomTimeout = setTimeout(() => {
            if (finished) return;

            ready = true;
            startTime = performance.now();

            button.classList.remove("waiting");
            button.classList.add("ready");
            button.textContent = "JETZT KLICKEN!";
          }, 1000 + Math.random() * 3000);
        }
      }, 850);
    }

    function showAgain() {
      actions(`<button id="reactionAgain">Nochmal · 50 XP</button>`);
      bindAction("reactionAgain", () => startGame("reaction"));
    }

    button.addEventListener("click", () => {
      if (finished) return;

      if (!ready) {
        finished = true;
        clearTimeout(randomTimeout);
        clearTimeout(countdownTimeout);

        button.classList.remove("waiting");
        button.classList.add("too-early");
        button.textContent = "Zu früh!";

        animateStage("zuno-game-shake");
        message("Du musst auf das grüne Signal warten.");
        showAgain();
        return;
      }

      finished = true;

      const reaction = Math.round(performance.now() - startTime);
      const isRecord = saveHighscore("reaction", reaction, true);

      button.classList.remove("ready");
      button.classList.add("result");
      button.textContent = `${reaction} ms`;

      info(`Deine Zeit: ${reaction} ms`);

      message(
        reaction < 250
          ? "Blitzschnell! ⚡"
          : reaction < 400
            ? "Starke Reaktion!"
            : "Da geht noch was!"
      );

      updateRecordMessage(isRecord);
      animateStage("zuno-game-success");

      const rect = button.getBoundingClientRect();
      showStageParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      showAgain();
    });

    showCountdown();

    activeCleanup = () => {
      finished = true;
      clearTimeout(randomTimeout);
      clearTimeout(countdownTimeout);
    };
  }

  /* =========================================
     MEMORY
  ========================================= */

  function startMemory() {
    const symbols = [
      "🍋", "🚀", "🐸", "🎧",
      "🌙", "⚽", "🍀", "🎮"
    ];

    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5);

    let first = null;
    let locked = false;
    let matches = 0;
    let moves = 0;
    let timeout = null;

    stage().innerHTML = `
      <div class="zuno-memory-grid" id="memoryGrid"></div>
    `;

    const grid = document.getElementById("memoryGrid");

    function makeMatchParticles(button) {
      if (REDUCED_MOTION) return;

      const rect = button.getBoundingClientRect();

      showStageParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        12
      );
    }

    cards.forEach(symbol => {
      const button = document.createElement("button");

      button.className = "zuno-memory-card";
      button.textContent = "";
      button.dataset.symbol = symbol;
      button.setAttribute("aria-label", "Verdeckte Karte");

      button.addEventListener("click", () => {
        if (
          locked ||
          button.classList.contains("matched") ||
          button.classList.contains("revealed")
        ) return;

        button.classList.add("revealed");
        button.setAttribute("aria-label", symbol);

        if (!first) {
          first = button;
          return;
        }

        moves++;
        locked = true;

        const second = button;

        if (first.dataset.symbol === second.dataset.symbol) {
          first.classList.add("matched");
          second.classList.add("matched");

          first.disabled = true;
          second.disabled = true;

          makeMatchParticles(first);
          makeMatchParticles(second);

          first = null;
          locked = false;
          matches++;

          info(`${matches} / 8 Paare · ${moves} Züge`);

          if (matches === 8) {
            const isRecord = saveHighscore("memory", moves, true);

            message(`Geschafft! Du hast ${moves} Züge gebraucht.`);
            updateRecordMessage(isRecord);
            animateStage("zuno-game-success");

            actions(`<button id="memoryAgain">Nochmal · 50 XP</button>`);
            bindAction("memoryAgain", () => startGame("memory"));
          }
        } else {
          const previous = first;

          timeout = setTimeout(() => {
            previous.classList.remove("revealed");
            second.classList.remove("revealed");

            previous.setAttribute("aria-label", "Verdeckte Karte");
            second.setAttribute("aria-label", "Verdeckte Karte");

            first = null;
            locked = false;
          }, 850);
        }
      });

      grid.appendChild(button);
    });

    info("0 / 8 Paare · 0 Züge");

    activeCleanup = () => clearTimeout(timeout);
  }

  /* =========================================
     ENDLESS RUNNER
  ========================================= */

  function startRunner() {
    stage().innerHTML = `
      <canvas id="runnerCanvas" width="360" height="220"
        aria-label="Endless Runner"></canvas>
      <p class="small">Tippe oder drücke Leertaste zum Springen.</p>
    `;

    actions(`<button id="runnerJump">Springen</button>`);

    const canvas = document.getElementById("runnerCanvas");
    const ctx = canvas.getContext("2d");

    let playerY = 165;
    let velocity = 0;
    let obstacleX = 360;
    let score = 0;
    let running = true;
    let interval = null;
    let frame = 0;

    function jump() {
      if (playerY >= 164) velocity = -10;
    }

    function keyHandler(event) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
      }
    }

    window.addEventListener("keydown", keyHandler);
    canvas.addEventListener("pointerdown", jump);
    bindAction("runnerJump", jump);

    function draw() {
      ctx.fillStyle = "#242238";
      ctx.fillRect(0, 0, 360, 220);

      ctx.fillStyle = "rgba(255,255,255,.08)";

      for (let i = 0; i < 6; i++) {
        const x = ((i * 85 - frame * 1.2) % 420 + 420) % 420;
        ctx.beginPath();
        ctx.arc(x, 40 + (i % 3) * 18, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(0, 190, 360, 4);

      ctx.shadowColor = "#c9ef9a";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(42, playerY, 28, 28);
      ctx.shadowBlur = 0;

      ctx.shadowColor = "#ff8b68";
      ctx.shadowBlur = 9;
      ctx.fillStyle = "#ff8b68";
      ctx.fillRect(obstacleX, 166, 22, 24);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score: ${score}`, 12, 24);
    }

    function endGame() {
      if (!running) return;

      running = false;
      clearInterval(interval);

      const isRecord = saveHighscore("runner", score);

      animateStage("zuno-game-shake");
      message(`Game Over! Score: ${score}`);
      updateRecordMessage(isRecord);

      actions(`<button id="runnerAgain">Nochmal · 50 XP</button>`);
      bindAction("runnerAgain", () => startGame("runner"));
    }

    function tick() {
      if (!running) return;

      frame++;

      velocity += .55;
      playerY += velocity;

      if (playerY > 165) {
        playerY = 165;
        velocity = 0;
      }

      obstacleX -= 4 + Math.min(score / 15, 4);

      if (obstacleX < -25) {
        obstacleX = 360 + Math.random() * 100;
        score++;
        info(`Score: ${score}`);
      }

      const collision =
        obstacleX < 70 &&
        obstacleX > 35 &&
        playerY > 140;

      draw();

      if (collision) endGame();
    }

    info("Score: 0");
    draw();

    interval = setInterval(tick, 30);

    activeCleanup = () => {
      running = false;
      clearInterval(interval);
      window.removeEventListener("keydown", keyHandler);
      canvas.removeEventListener("pointerdown", jump);
    };
  }

  /* =========================================
     MINI ADVENTURE
  ========================================= */

  function startAdventure() {
    stage().innerHTML = `
      <canvas id="adventureCanvas" width="360" height="240"
        aria-label="Mini Adventure"></canvas>
      <p class="small">← → bewegen · ↑ springen</p>
    `;

    actions(`
      <button class="secondary" id="adventureLeft">←</button>
      <button id="adventureJump">Springen</button>
      <button class="secondary" id="adventureRight">→</button>
    `);

    const canvas = document.getElementById("adventureCanvas");
    const ctx = canvas.getContext("2d");

    const player = {
      x: 25,
      y: 170,
      vx: 0,
      vy: 0,
      width: 22,
      height: 28,
      grounded: false
    };

    const platforms = [
      { x: 0, y: 210, w: 360, h: 30 },
      { x: 95, y: 165, w: 65, h: 10 },
      { x: 205, y: 125, w: 65, h: 10 }
    ];

    const coins = [
      { x: 120, y: 140, taken: false, phase: 0 },
      { x: 230, y: 100, taken: false, phase: 1 },
      { x: 320, y: 185, taken: false, phase: 2 }
    ];

    const hazards = [
      { x: 175, y: 194, w: 20, h: 16 }
    ];

    const keys = {};

    let jumpRequested = false;
    let score = 0;
    let running = true;
    let interval = null;
    let frame = 0;

    function jump() {
      if (player.grounded) {
        player.vy = -10;
        player.grounded = false;
      }
    }

    function keyDown(event) {
      const movementKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", " "];

      if (movementKeys.includes(event.key)) event.preventDefault();

      if (
        (event.key === "ArrowUp" || event.key === "w" || event.key === " ") &&
        !keys[event.key]
      ) {
        jumpRequested = true;
      }

      keys[event.key] = true;
    }

    function keyUp(event) {
      keys[event.key] = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    bindAction("adventureLeft", () => {
      player.x = Math.max(0, player.x - 18);
    });

    bindAction("adventureRight", () => {
      player.x = Math.min(338, player.x + 18);
    });

    bindAction("adventureJump", jump);

    function draw() {
      ctx.fillStyle = "#242238";
      ctx.fillRect(0, 0, 360, 240);

      ctx.fillStyle = "rgba(255,255,255,.55)";

      for (let i = 0; i < 14; i++) {
        const x = (i * 31 + frame * .12) % 360;
        const y = (i * 17) % 100;
        ctx.fillRect(x, y, 2, 2);
      }

      platforms.forEach(platform => {
        ctx.fillStyle = "#8fcf79";
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

        ctx.fillStyle = "#c9ef9a";
        ctx.fillRect(platform.x, platform.y, platform.w, 3);
      });

      coins.forEach(coin => {
        if (coin.taken) return;

        const bob = REDUCED_MOTION
          ? 0
          : Math.sin(frame * .12 + coin.phase) * 3;

        ctx.shadowColor = "#ffcf57";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ffcf57";

        ctx.beginPath();
        ctx.arc(coin.x, coin.y + bob, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      hazards.forEach(hazard => {
        ctx.fillStyle = "#ff8b68";
        ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      });

      ctx.shadowColor = "#c9ef9a";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Münzen: ${score} / 3`, 12, 22);
    }

    function endGame(text, success = false) {
      if (!running) return;

      running = false;
      clearInterval(interval);

      const isRecord = saveHighscore("adventure", score);

      animateStage(success ? "zuno-game-success" : "zuno-game-shake");
      message(text);
      updateRecordMessage(isRecord);

      actions(`<button id="adventureAgain">Nochmal · 50 XP</button>`);
      bindAction("adventureAgain", () => startGame("adventure"));
    }

    function tick() {
      if (!running) return;

      frame++;

      const previousBottom = player.y + player.height;

      if (keys.ArrowLeft || keys.a) {
        player.vx = -3;
      } else if (keys.ArrowRight || keys.d) {
        player.vx = 3;
      } else {
        player.vx = 0;
      }

      if (jumpRequested) {
        jump();
        jumpRequested = false;
      }

      player.x += player.vx;
      player.y += player.vy;
      player.vy += .5;
      player.grounded = false;

      player.x = Math.max(0, Math.min(338, player.x));

      platforms.forEach(platform => {
        const newBottom = player.y + player.height;

        const overlaps =
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.w;

        if (
          overlaps &&
          previousBottom <= platform.y &&
          newBottom >= platform.y &&
          player.vy >= 0
        ) {
          player.y = platform.y - player.height;
          player.vy = 0;
          player.grounded = true;
        }
      });

      coins.forEach(coin => {
        if (
          !coin.taken &&
          Math.abs(player.x + 11 - coin.x) < 16 &&
          Math.abs(player.y + 14 - coin.y) < 18
        ) {
          coin.taken = true;
          score++;

          info(`Münzen: ${score} / 3`);
          createParticles(canvas, coin.x, coin.y, "#ffcf57", 12);
        }
      });

      const hitHazard = hazards.some(hazard =>
        player.x + player.width > hazard.x &&
        player.x < hazard.x + hazard.w &&
        player.y + player.height > hazard.y &&
        player.y < hazard.y + hazard.h
      );

      if (hitHazard || player.y > 260) {
        endGame(`Level beendet. Münzen: ${score} / 3`);
        return;
      }

      if (score === 3) {
        endGame("Level geschafft! Alle Münzen gesammelt! 🏆", true);
        return;
      }

      draw();
    }

    info("Münzen: 0 / 3");
    draw();

    interval = setInterval(tick, 30);

    activeCleanup = () => {
      running = false;
      clearInterval(interval);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }

  /* =========================================
     RICHTIGE ANTWORT ANIMIEREN
  ========================================= */

  window.showCorrectAnimation = function() {
    const target = document.querySelector(".word-card");
    if (!target) return;

    target.classList.remove("zuno-correct");
    void target.offsetWidth;
    target.classList.add("zuno-correct");

    setTimeout(() => target.classList.remove("zuno-correct"), 600);
  };

  /* =========================================
     INITIALISIERUNG
  ========================================= */

  function initialize() {
    injectGameStyles();
    createArcade();

    const originalUpdateDashboard = window.updateDashboard;

    if (
      typeof originalUpdateDashboard === "function" &&
      !originalUpdateDashboard._zunoWrapped
    ) {
      const wrappedUpdateDashboard = function(...args) {
        const result = originalUpdateDashboard.apply(this, args);
        renderGameCards();
        return result;
      };

      wrappedUpdateDashboard._zunoWrapped = true;
      window.updateDashboard = wrappedUpdateDashboard;
    }

    renderGameCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
