/* =========================================
   ZUNO ARCADE
========================================= */

(() => {
  "use strict";

  const COST = 50;

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

    if (xp) {
      xp.textContent = getXP();
    }
  }

  function createArcade() {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return;

    if (document.getElementById("zunoArcade")) {
      renderGameCards();
      return;
    }

    const section = document.createElement("section");

    section.id = "zunoArcade";

    section.innerHTML = `
      <div class="zuno-arcade-heading">
        <div>
          <h2>🎮 ZUNO Arcade</h2>

          <p class="zuno-arcade-subtitle">
            Gib deine verdienten XP für Spielrunden aus.
          </p>
        </div>

        <span class="pill">
          ⚡ <span id="zunoArcadeXP">${getXP()}</span> XP
        </span>
      </div>

      <div class="zuno-game-grid" id="zunoGameGrid"></div>
    `;

    dashboard.appendChild(section);

    renderGameCards();
  }

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
      if (event.target === overlay) {
        closeGame();
      }
    });

    bindAction("zunoStartGame", () => {
      startGame(game.id);
    });
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

    if (element) {
      element.textContent = text;
    }
  }

  function info(text) {
    const element = document.getElementById("zunoGameInfo");

    if (element) {
      element.textContent = text;
    }
  }

  function actions(html) {
    const element = document.getElementById("zunoGameActions");

    if (element) {
      element.innerHTML = html;
    }
  }

  function bindAction(id, callback) {
    const button = document.getElementById(id);

    if (button) {
      button.addEventListener("click", callback);
    }
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

    // XP werden bei jedem neuen Start abgezogen.
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
      <canvas
        id="zunoSnakeCanvas"
        width="320"
        height="320"
        aria-label="Snake-Spiel"
      ></canvas>
    `;

    actions(`
      <button class="secondary" id="snakeUp">↑</button>
      <button class="secondary" id="snakeLeft">←</button>
      <button class="secondary" id="snakeDown">↓</button>
      <button class="secondary" id="snakeRight">→</button>
    `);

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
    let running = true;
    let interval = null;

    function randomFood() {
      const available = [];

      for (let x = 0; x < cells; x++) {
        for (let y = 0; y < cells; y++) {
          const occupied = snake.some(part =>
            part.x === x && part.y === y
          );

          if (!occupied) {
            available.push({ x, y });
          }
        }
      }

      if (available.length === 0) {
        return null;
      }

      return available[
        Math.floor(Math.random() * available.length)
      ];
    }

    function changeDirection(x, y) {
      if (
        x === -direction.x &&
        y === -direction.y
      ) {
        return;
      }

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

    window.addEventListener("keydown", keyHandler);

    bindAction("snakeUp", () => changeDirection(0, -1));
    bindAction("snakeDown", () => changeDirection(0, 1));
    bindAction("snakeLeft", () => changeDirection(-1, 0));
    bindAction("snakeRight", () => changeDirection(1, 0));

    function draw() {
      ctx.fillStyle = "#242238";
      ctx.fillRect(0, 0, 320, 320);

      if (food) {
        ctx.fillStyle = "#ff8b68";

        ctx.fillRect(
          food.x * size,
          food.y * size,
          size - 2,
          size - 2
        );
      }

      snake.forEach((part, index) => {
        ctx.fillStyle =
          index === 0 ? "#c9ef9a" : "#8fcf79";

        ctx.fillRect(
          part.x * size,
          part.y * size,
          size - 2,
          size - 2
        );
      });
    }

    function endGame() {
      if (!running) return;

      running = false;
      clearInterval(interval);

      message(`Game Over! Du hast ${score} Punkte erreicht.`);

      actions(`
        <button id="snakeAgain">
          Nochmal spielen · 50 XP
        </button>
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

      const eating =
        food &&
        head.x === food.x &&
        head.y === food.y;

      const hitWall =
        head.x < 0 ||
        head.y < 0 ||
        head.x >= cells ||
        head.y >= cells;

      // Wenn der Schwanz sich bewegt, darf das neue Kopfstück
      // auf das bisherige Schwanzfeld ziehen.
      const bodyToCheck = eating
        ? snake
        : snake.slice(0, -1);

      const hitSnake = bodyToCheck.some(part =>
        part.x === head.x &&
        part.y === head.y
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

        if (!food) {
          endGame();
          return;
        }
      } else {
        snake.pop();
      }

      draw();
    }

    info("Punkte: 0");
    draw();

    interval = setInterval(tick, 125);

    activeCleanup = () => {
      running = false;
      clearInterval(interval);
      window.removeEventListener("keydown", keyHandler);
    };
  }

  /* =========================================
     REACTION RUSH
  ========================================= */

  function startReaction() {
    stage().innerHTML = `
      <button
        id="reactionButton"
        style="
          width:100%;
          min-height:220px;
          border-radius:18px;
          border:0;
          background:#d8d4e8;
          color:#302b43;
          font-size:1.5rem;
          font-weight:900;
          cursor:pointer;
        "
      >
        Warte auf GRÜN ...
      </button>
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
      button.textContent = "JETZT KLICKEN!";
    }, 1200 + Math.random() * 2800);

    button.addEventListener("click", () => {
      if (finished) return;

      if (!ready) {
        finished = true;
        clearTimeout(timeout);

        button.textContent = "Zu früh! Versuch es nochmal.";
        button.style.background = "#ffd8d5";

        actions(`
          <button id="reactionAgain">
            Nochmal · 50 XP
          </button>
        `);

        bindAction("reactionAgain", () => {
          startGame("reaction");
        });

        return;
      }

      finished = true;

      const reaction = Math.round(
        performance.now() - startTime
      );

      button.textContent = `${reaction} ms`;
      button.style.background = "#c9ef9a";

      info(`Deine Zeit: ${reaction} ms`);

      message(
        reaction < 250
          ? "Blitzschnell! ⚡"
          : reaction < 400
            ? "Starke Reaktion!"
            : "Da geht noch was!"
      );

      actions(`
        <button id="reactionAgain">
          Nochmal · 50 XP
        </button>
      `);

      bindAction("reactionAgain", () => {
        startGame("reaction");
      });
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
      <div
        class="zuno-memory-grid"
        id="memoryGrid"
      ></div>
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
        ) {
          return;
        }

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

          first = null;
          locked = false;
          matches++;

          info(`${matches} / 8 Paare · ${moves} Züge`);

          if (matches === 8) {
            message(
              `Geschafft! Du hast ${moves} Züge gebraucht.`
            );

            actions(`
              <button id="memoryAgain">
                Nochmal · 50 XP
              </button>
            `);

            bindAction("memoryAgain", () => {
              startGame("memory");
            });
          }
        } else {
          const previous = first;

          timeout = setTimeout(() => {
            previous.textContent = "?";
            second.textContent = "?";

            previous.classList.remove("revealed");
            second.classList.remove("revealed");

            previous.setAttribute(
              "aria-label",
              "Verdeckte Karte"
            );

            second.setAttribute(
              "aria-label",
              "Verdeckte Karte"
            );

            first = null;
            locked = false;
          }, 750);
        }
      });

      grid.appendChild(button);
    });

    info("0 / 8 Paare · 0 Züge");

    activeCleanup = () => {
      clearTimeout(timeout);
    };
  }

  /* =========================================
     ENDLESS RUNNER
  ========================================= */

  function startRunner() {
    stage().innerHTML = `
      <canvas
        id="runnerCanvas"
        width="360"
        height="220"
        aria-label="Endless Runner"
      ></canvas>

      <p class="small">
        Tippe oder drücke Leertaste zum Springen.
      </p>
    `;

    actions(`
      <button id="runnerJump">Springen</button>
    `);

    const canvas = document.getElementById("runnerCanvas");
    const ctx = canvas.getContext("2d");

    let playerY = 165;
    let velocity = 0;
    let obstacleX = 360;
    let score = 0;
    let running = true;
    let interval = null;

    function jump() {
      if (playerY >= 164) {
        velocity = -10;
      }
    }

    function keyHandler(event) {
      if (
        event.code === "Space" ||
        event.code === "ArrowUp"
      ) {
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

      ctx.fillStyle = "#c9ef9a";
      ctx.fillRect(0, 190, 360, 4);

      ctx.fillStyle = "#8fcf79";
      ctx.fillRect(42, playerY, 28, 28);

      ctx.fillStyle = "#ff8b68";
      ctx.fillRect(obstacleX, 166, 22, 24);

      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score: ${score}`, 12, 24);
    }

    function endGame() {
      if (!running) return;

      running = false;
      clearInterval(interval);

      message(`Game Over! Score: ${score}`);

      actions(`
        <button id="runnerAgain">
          Nochmal · 50 XP
        </button>
      `);

      bindAction("runnerAgain", () => {
        startGame("runner");
      });
    }

    function tick() {
      if (!running) return;

      velocity += 0.55;
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

      if (collision) {
        endGame();
      }
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
      <canvas
        id="adventureCanvas"
        width="360"
        height="240"
        aria-label="Mini Adventure"
      ></canvas>

      <p class="small">
        ← → bewegen · ↑ springen
      </p>
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
      { x: 120, y: 140, taken: false },
      { x: 230, y: 100, taken: false },
      { x: 320, y: 185, taken: false }
    ];

    const hazards = [
      { x: 175, y: 194, w: 20, h: 16 }
    ];

    const keys = {};

    let jumpRequested = false;
    let score = 0;
    let running = true;
    let interval = null;

    function jump() {
      if (player.grounded) {
        player.vy = -10;
        player.grounded = false;
      }
    }

    function keyDown(event) {
      const movementKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        " "
      ];

      if (movementKeys.includes(event.key)) {
        event.preventDefault();
      }

      if (
        (event.key === "ArrowUp" ||
          event.key === "w" ||
          event.key === " ") &&
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

      ctx.fillStyle = "#8fcf79";

      platforms.forEach(platform => {
        ctx.fillRect(
          platform.x,
          platform.y,
          platform.w,
          platform.h
        );
      });

      ctx.fillStyle = "#ffcf57";

      coins.forEach(coin => {
        if (!coin.taken) {
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.fillStyle = "#ff8b68";

      hazards.forEach(hazard => {
        ctx.fillRect(
          hazard.x,
          hazard.y,
          hazard.w,
          hazard.h
        );
      });

      ctx.fillStyle = "#c9ef9a";

      ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
      );

      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Münzen: ${score} / 3`, 12, 22);
    }

    function endGame(text) {
      if (!running) return;

      running = false;
      clearInterval(interval);

      message(text);

      actions(`
        <button id="adventureAgain">
          Nochmal · 50 XP
        </button>
      `);

      bindAction("adventureAgain", () => {
        startGame("adventure");
      });
    }

    function tick() {
      if (!running) return;

      const previousBottom =
        player.y + player.height;

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

      player.vy += 0.5;
      player.grounded = false;

      player.x = Math.max(
        0,
        Math.min(338, player.x)
      );

      platforms.forEach(platform => {
        const newBottom =
          player.y + player.height;

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
        endGame("Level geschafft! Alle Münzen gesammelt! 🏆");
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
    const target =
      document.querySelector(".word-card");

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
    createArcade();

    const originalUpdateDashboard =
      window.updateDashboard;

    if (
      typeof originalUpdateDashboard === "function" &&
      !originalUpdateDashboard._zunoWrapped
    ) {
      const wrappedUpdateDashboard = function(...args) {
        const result =
          originalUpdateDashboard.apply(this, args);

        // Falls das Dashboard neu aufgebaut wurde,
        // wird die Arcade-Sektion wieder eingefügt.
        createArcade();
        renderGameCards();

        return result;
      };

      wrappedUpdateDashboard._zunoWrapped = true;

      window.updateDashboard = wrappedUpdateDashboard;
    }

    createArcade();
    renderGameCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
