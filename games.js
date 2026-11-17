/* =========================================
   ZUNO ARCADE
   Enhanced Games Edition
========================================= */

(() => {
  "use strict";

  const COST = 50;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const games = [
    {
      id: "snake",
      title: "Snake",
      icon: "🐍",
      description: "Sammle Punkte und werde immer länger.",
      unlock: 0
    },
    {
      id: "reaction",
      title: "Reaction Rush",
      icon: "⚡",
      description: "Wie schnell kannst du reagieren?",
      unlock: 0
    },
    {
      id: "memory",
      title: "Memory",
      icon: "🧠",
      description: "Finde alle passenden Kartenpaare.",
      unlock: 0
    },
    {
      id: "runner",
      title: "Endless Runner",
      icon: "🏃",
      description: "Springe über Hindernisse und halte durch.",
      unlock: 3
    },
    {
      id: "adventure",
      title: "Mini Adventure",
      icon: "🗺️",
      description: "Erkunde Level, sammle Münzen und weiche Hindernissen aus.",
      unlock: 5
    }
  ];

  let overlay = null;
  let activeCleanup = null;

  /* =========================================
     STYLES
  ========================================= */

  function injectGameStyles() {
    if (document.getElementById("zunoEnhancedGameStyles")) return;

    const style = document.createElement("style");
    style.id = "zunoEnhancedGameStyles";

    style.textContent = `
      .zuno-game-stage {
        position: relative;
        overflow: hidden;
      }

      .zuno-game-stage canvas {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
        border-radius: 14px;
        touch-action: none;
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

      .zuno-memory-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 9px;
        max-width: 340px;
        margin: 0 auto;
        perspective: 800px;
      }

      .zuno-memory-card {
        aspect-ratio: 1;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 12px;
        background: #39344f;
        color: white;
        font-size: clamp(1.3rem, 6vw, 2rem);
        font-weight: 900;
        cursor: pointer;
        transition: transform .25s ease, background .25s ease;
        transform-style: preserve-3d;
      }

      .zuno-memory-card.revealed {
        background: #c9ef9a;
        color: #242238;
        transform: rotateY(180deg);
      }

      .zuno-memory-card.matched {
        background: #8fcf79;
        color: #172313;
        transform: scale(.94);
        opacity: .8;
      }

      .zuno-memory-card:disabled {
        cursor: default;
      }

      .zuno-reaction-ready {
        animation: zunoReactionPulse .65s ease-in-out infinite alternate;
      }

      @keyframes zunoReactionPulse {
        from { box-shadow: 0 0 0 rgba(155,225,127,0); }
        to { box-shadow: 0 0 35px rgba(155,225,127,.65); }
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
        .zuno-reaction-ready {
          animation: none !important;
        }

        .zuno-memory-card {
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

    setTimeout(() => {
      element.classList.remove(className);
    }, 600);
  }

  function createParticles(canvas, x, y, color, amount = 10) {
    if (REDUCED_MOTION) return;

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

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= .04;

        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
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

          ${
            unlocked
              ? `
                <span class="zuno-game-lock">
                  ${game.unlock === 0
                    ? "Immer verfügbar"
                    : `${game.unlock}-Tage-Streak erreicht`}
                </span>

                <button type="button" data-game="${game.id}">
                  Spielen · ${COST} XP
                </button>
              `
              : `
                <span class="zuno-game-lock">
                  🔒 Ab ${game.unlock}-Tage-Streak
                </span>

                <button type="button" disabled>
                  Noch gesperrt
                </button>
              `
          }
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-game]").forEach(button => {
      button.addEventListener("click", () => {
        openGame(button.dataset.game);
      });
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

          <button
            class="zuno-game-close"
            type="button"
            aria-label="Spiel schließen"
          >
            ✕
          </button>
        </div>

        <div class="zuno-game-stage" id="zunoGameStage">
          <div>
            <h2>Bereit?</h2>
            <p>${game.description}</p>
            <p><strong>${COST} XP</strong> pro Spielrunde</p>
          </div>
        </div>

        <div class="zuno-game-info" id="zunoGameInfo"></div>

        <div class="zuno-game-actions" id="zunoGameActions">
          <button type="button" id="zunoStartGame">
            Spiel starten · ${COST} XP
          </button>
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
    stage().innerHTML = `
      <canvas id="zunoSnakeCanvas" width="320" height="320"
        aria-label="Snake-Spiel"></canvas>
      <p class="small">Wische in die gewünschte Richtung.</p>
    `;

    // Keine Pfeilbuttons mehr. Desktop nutzt die Tastatur,
    // Touchgeräte nutzen Wischgesten.
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
    let food = randomFood();

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

      if (!available.length) return null;

      return available[Math.floor(Math.random() * available.length)];
    }

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

    function touchEndHandler(event) {
      if (!running || !touchStart || !event.changedTouches.length) return;

      const touch = event.changedTouches[0];

      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;

      touchStart = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 1 : -1, 0);
      } else {
        changeDirection(0, dy > 0 ? 1 : -1);
      }
    }

    window.addEventListener("keydown", keyHandler);

    canvas.addEventListener("touchstart", touchStartHandler, {
      passive: true
    });

    canvas.addEventListener("touchend", touchEndHandler, {
      passive: true
    });

    canvas.addEventListener("contextmenu", event => {
      event.preventDefault();
    });

    function draw() {
      ctx.fillStyle = "#242238";
      ctx.fillRect(0, 0, 320, 320);

      // Grid
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

      animateStage("zuno-game-shake");

      message(`Game Over! Du hast ${score} Punkte erreicht.`);

      actions(`
        <button id="snakeAgain">Nochmal spielen · 50 XP</button>
      `);

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

          message("Perfekt! Du hast das ganze Feld gefüllt! 🏆");
          animateStage("zuno-game-success");

          actions(`
            <button id="snakeAgain">Nochmal spielen · 50 XP</button>
          `);

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
      canvas.removeEventListener("touchend", touchEndHandler);
    };
  }

  /* =========================================
     REACTION RUSH
  ========================================= */

  function startReaction() {
    stage().innerHTML = `
      <button id="reactionButton" style="
        width:100%;
        min-height:220px;
        border-radius:18px;
        border:0;
        background:#d8d4e8;
        color:#302b43;
        font-size:1.5rem;
        font-weight:900;
        cursor:pointer;
        transition:background .2s, transform .2s;
      ">Warte auf GRÜN ...</button>
    `;

    actions("");
    info("Reaktionszeit: –");

    const button = document.getElementById("reactionButton");

    let finished = false;
    let ready = false;
    let timeout = null;
    let startTime = 0;

    timeout = setTimeout(() => {
      if (finished) return;

      ready = true;
      startTime = performance.now();

      button.style.background = "#9be17f";
      button.style.transform = "scale(1.025)";
      button.classList.add("zuno-reaction-ready");
      button.textContent = "JETZT KLICKEN!";
    }, 1200 + Math.random() * 2800);

    button.addEventListener("click", () => {
      if (finished) return;

      if (!ready) {
        finished = true;
        clearTimeout(timeout);

        button.textContent = "Zu früh! Versuch es nochmal.";
        button.style.background = "#ffd8d5";
        button.style.transform = "scale(.98)";

        animateStage("zuno-game-shake");

        actions(`
          <button id="reactionAgain">Nochmal · 50 XP</button>
        `);

        bindAction("reactionAgain", () => startGame("reaction"));
        return;
      }

      finished = true;

      const reaction = Math.round(performance.now() - startTime);

      button.classList.remove("zuno-reaction-ready");
      button.textContent = `${reaction} ms`;
      button.style.background = "#c9ef9a";
      button.style.transform = "scale(1.04)";

      info(`Deine Zeit: ${reaction} ms`);

      message(
        reaction < 250
          ? "Blitzschnell! ⚡"
          : reaction < 400
            ? "Starke Reaktion!"
            : "Da geht noch was!"
      );

      animateStage("zuno-game-success");

      actions(`
        <button id="reactionAgain">Nochmal · 50 XP</button>
      `);

      bindAction("reactionAgain", () => startGame("reaction"));
    });

    activeCleanup = () => {
      finished = true;
      clearTimeout(timeout);
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

    cards.forEach(symbol => {
      const button = document.createElement("button");

      button.className = "zuno-memory-card";
      button.textContent = "?";
      button.dataset.symbol = symbol;
      button.setAttribute("aria-label", "Verdeckte Karte");

      button.addEventListener("click", () => {
        if (
          locked ||
          button.classList.contains("matched") ||
          button.classList.contains("revealed")
        ) return;

        button.textContent = symbol;
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

          first.classList.remove("revealed");
          second.classList.remove("revealed");

          first.disabled = true;
          second.disabled = true;

          createParticles(
            canvasForMemory(),
            second.offsetLeft + second.offsetWidth / 2,
            second.offsetTop + second.offsetHeight / 2,
            "#c9ef9a",
            8
          );

          first = null;
          locked = false;
          matches++;

          info(`${matches} / 8 Paare · ${moves} Züge`);

          if (matches === 8) {
            message(`Geschafft! Du hast ${moves} Züge gebraucht.`);
            animateStage("zuno-game-success");

            actions(`
              <button id="memoryAgain">Nochmal · 50 XP</button>
            `);

            bindAction("memoryAgain", () => startGame("memory"));
          }
        } else {
          const previous = first;

          timeout = setTimeout(() => {
            previous.textContent = "?";
            second.textContent = "?";

            previous.classList.remove("revealed");
            second.classList.remove("revealed");

            previous.setAttribute("aria-label", "Verdeckte Karte");
            second.setAttribute("aria-label", "Verdeckte Karte");

            first = null;
            locked = false;
          }, 750);
        }
      });

      grid.appendChild(button);
    });

    function canvasForMemory() {
      // Ein unsichtbares Canvas für die Partikel-Effekte.
      let canvas = document.getElementById("zunoMemoryParticles");

      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "zunoMemoryParticles";
        canvas.width = 1;
        canvas.height = 1;
      }

      return canvas;
    }

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

      // Hintergrundbewegung
      ctx.fillStyle = "rgba(255,255,255,.08)";

      for (let i = 0; i < 6; i++) {
        const x = ((i * 85 - frame * 1.2) % 420 + 420) % 420;

        ctx.beginPath();
        ctx.arc(x, 40 + (i % 3) * 18, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(0, 190, 360, 4);

      // Spieler
      ctx.shadowColor = "#c9ef9a";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(42, playerY, 28, 28);
      ctx.shadowBlur = 0;

      // Hindernis
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

      animateStage("zuno-game-shake");

      message(`Game Over! Score: ${score}`);

      actions(`
        <button id="runnerAgain">Nochmal · 50 XP</button>
      `);

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

      // Kleine Sterne
      ctx.fillStyle = "rgba(255,255,255,.55)";

      for (let i = 0; i < 14; i++) {
        const x = (i * 31 + frame * .12) % 360;
        const y = (i * 17) % 100;

        ctx.fillRect(x, y, 2, 2);
      }

      // Plattformen
      platforms.forEach(platform => {
        ctx.fillStyle = "#8fcf79";
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

        ctx.fillStyle = "#c9ef9a";
        ctx.fillRect(platform.x, platform.y, platform.w, 3);
      });

      // Münzen
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

      // Hindernisse
      hazards.forEach(hazard => {
        ctx.fillStyle = "#ff8b68";
        ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      });

      // Spieler
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

      animateStage(
        success ? "zuno-game-success" : "zuno-game-shake"
      );

      message(text);

      actions(`
        <button id="adventureAgain">Nochmal · 50 XP</button>
      `);

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

          createParticles(
            canvas,
            coin.x,
            coin.y,
            "#ffcf57",
            12
          );
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

    setTimeout(() => {
      target.classList.remove("zuno-correct");
    }, 600);
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
