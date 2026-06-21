/* ============================================================================
   Father's Day puzzle — app logic
   You normally never need to edit this file. Edit config.js instead.
   ============================================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "fathersday_progress_v1";
  var ROWS = (CONFIG && CONFIG.revealRows) || 4;
  var COLS = (CONFIG && CONFIG.revealCols) || 5;
  var TILE_COUNT = ROWS * COLS;

  // ---- progress persistence (degrades gracefully if storage is blocked) ----
  function loadSolved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var obj = JSON.parse(raw);
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }
  function saveSolved(solved) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(solved));
    } catch (e) {
      /* ignore — progress just won't persist */
    }
  }
  var solved = loadSolved();

  // ---- deterministic scatter so each puzzle always reveals the same tiles ----
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function scatteredOrder(n, seed) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    var rnd = mulberry32(seed);
    for (var j = arr.length - 1; j > 0; j--) {
      var k = Math.floor(rnd() * (j + 1));
      var tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
    }
    return arr;
  }
  var TILE_ORDER = scatteredOrder(TILE_COUNT, 1337);

  function tilesForProblem(index, total) {
    var start = Math.floor((index * TILE_COUNT) / total);
    var end = Math.floor(((index + 1) * TILE_COUNT) / total);
    return TILE_ORDER.slice(start, end);
  }

  // ---- answer checking --------------------------------------------------
  function norm(s) {
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/,/g, "")
      .replace(/\.+$/, "");
  }
  function partIsCorrect(part, raw) {
    var v = norm(raw);
    if (v === "") return false;
    if (part.answers && part.answers.length) {
      for (var i = 0; i < part.answers.length; i++) {
        if (norm(part.answers[i]) === v) return true;
      }
    }
    if (typeof part.numericValue === "number") {
      var m = v.match(/-?\d+(\.\d+)?/);
      if (m) {
        var num = parseFloat(m[0]);
        var tol = typeof part.tolerance === "number" ? part.tolerance : 0;
        if (Math.abs(num - part.numericValue) <= tol) return true;
      }
    }
    return false;
  }

  // ---- DOM refs ---------------------------------------------------------
  var cardsEl = document.getElementById("cards");
  var tilesEl = document.getElementById("tiles");
  var imgEl = document.getElementById("secretImg");
  var revealEl = document.getElementById("reveal");
  var finishEl = document.getElementById("finishBanner");
  var progressFill = document.getElementById("progressFill");
  var progressText = document.getElementById("progressText");
  var backdrop = document.getElementById("modalBackdrop");
  var modalBody = document.getElementById("modalBody");
  var modalClose = document.getElementById("modalClose");
  var confettiLayer = document.getElementById("confetti");
  var titleEl = document.getElementById("title");

  // ---- title / image setup ---------------------------------------------
  if (CONFIG.recipient) {
    titleEl.textContent = "Happy Father's Day, " + CONFIG.recipient + "!";
  }
  imgEl.src = CONFIG.secretImage || "secret.png";
  imgEl.addEventListener("error", function () {
    revealEl.classList.add("img-missing");
  });

  // ---- build tiles ------------------------------------------------------
  tilesEl.style.gridTemplateColumns = "repeat(" + COLS + ", 1fr)";
  tilesEl.style.gridTemplateRows = "repeat(" + ROWS + ", 1fr)";
  var tileEls = [];
  for (var t = 0; t < TILE_COUNT; t++) {
    var tile = document.createElement("div");
    tile.className = "tile";
    var hue = Math.floor((t * 360) / TILE_COUNT);
    tile.style.background = "hsl(" + hue + ", 70%, 62%)";
    tile.textContent = "?";
    tilesEl.appendChild(tile);
    tileEls.push(tile);
  }

  function revealTiles(indices, animate) {
    indices.forEach(function (idx) {
      var el = tileEls[idx];
      if (!el) return;
      if (!animate) el.style.transition = "none";
      el.classList.add("gone");
      if (!animate) {
        // force reflow then restore transitions for later reveals
        void el.offsetWidth;
        el.style.transition = "";
      }
    });
  }

  // ---- progress + finish ------------------------------------------------
  function solvedCount() {
    return PROBLEMS.filter(function (p) { return solved[p.id]; }).length;
  }
  function updateProgress() {
    var n = solvedCount();
    var total = PROBLEMS.length;
    progressFill.style.width = (total ? (n / total) * 100 : 0) + "%";
    progressText.textContent = n + " of " + total + " solved";
    if (n === total && total > 0) {
      finishEl.textContent = CONFIG.finishedMessage || "All done!";
      finishEl.classList.add("show");
    } else {
      finishEl.classList.remove("show");
    }
  }

  // ---- cards ------------------------------------------------------------
  function buildCards() {
    cardsEl.innerHTML = "";
    PROBLEMS.forEach(function (p, i) {
      var card = document.createElement("button");
      card.className = "card" + (solved[p.id] ? " solved" : "");
      card.type = "button";
      card.setAttribute("data-id", p.id);

      var emoji = document.createElement("span");
      emoji.className = "emoji";
      emoji.textContent = p.emoji || "❓";

      var text = document.createElement("span");
      text.className = "card-text";
      var title = document.createElement("span");
      title.className = "card-title";
      title.textContent = (i + 1) + ". " + p.title;
      var hint = document.createElement("span");
      hint.className = "card-hint";
      hint.textContent = solved[p.id] ? "Solved — piece revealed!" : "Tap to solve →";
      text.appendChild(title);
      text.appendChild(document.createElement("br"));
      text.appendChild(hint);

      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = solved[p.id] ? "✓ Done" : "Puzzle " + (i + 1);

      card.appendChild(emoji);
      card.appendChild(text);
      card.appendChild(badge);
      card.addEventListener("click", function () { openModal(p, i); });
      cardsEl.appendChild(card);
    });
  }

  function refreshCard(id) {
    var card = cardsEl.querySelector('[data-id="' + id + '"]');
    if (!card) return;
    card.classList.add("solved");
    var hint = card.querySelector(".card-hint");
    var badge = card.querySelector(".badge");
    if (hint) hint.textContent = "Solved — piece revealed!";
    if (badge) badge.textContent = "✓ Done";
  }

  // ---- modal ------------------------------------------------------------
  var activeProblem = null;

  function openModal(problem, index) {
    activeProblem = problem;
    modalBody.innerHTML = "";

    var emoji = document.createElement("div");
    emoji.className = "m-emoji";
    emoji.textContent = problem.emoji || "❓";

    var h2 = document.createElement("h2");
    h2.id = "modalTitle";
    h2.textContent = (index + 1) + ". " + problem.title;

    var q = document.createElement("div");
    q.className = "m-question";
    q.textContent = problem.question;

    modalBody.appendChild(emoji);
    modalBody.appendChild(h2);
    modalBody.appendChild(q);

    if (solved[problem.id]) {
      var note = document.createElement("div");
      note.className = "solved-note";
      note.textContent = "You already solved this one!";
      modalBody.appendChild(note);
      showModal();
      return;
    }

    var inputs = [];
    problem.parts.forEach(function (part, pi) {
      var wrap = document.createElement("div");
      wrap.className = "part";

      var label = document.createElement("label");
      var inputId = "ans_" + problem.id + "_" + pi;
      label.setAttribute("for", inputId);
      label.textContent = part.prompt || "Your answer";

      var input = document.createElement("input");
      input.type = "text";
      input.id = inputId;
      input.autocomplete = "off";
      input.placeholder = part.placeholder || "type the answer…";

      var msg = document.createElement("div");
      msg.className = "part-msg";

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); doCheck(); }
      });

      wrap.appendChild(label);
      wrap.appendChild(input);
      wrap.appendChild(msg);
      modalBody.appendChild(wrap);
      inputs.push({ part: part, input: input, msg: msg, wrap: wrap });
    });

    var btn = document.createElement("button");
    btn.className = "check-btn";
    btn.type = "button";
    btn.textContent = "Check my answer";
    btn.addEventListener("click", doCheck);
    modalBody.appendChild(btn);

    function doCheck() {
      var allCorrect = true;
      inputs.forEach(function (item) {
        var raw = item.input.value;
        var ok = partIsCorrect(item.part, raw);
        item.wrap.classList.remove("correct", "wrong");
        item.msg.classList.remove("ok", "bad");
        if (ok) {
          item.wrap.classList.add("correct");
          item.msg.classList.add("ok");
          item.msg.textContent = "Correct! ✓";
        } else {
          allCorrect = false;
          item.wrap.classList.add("wrong");
          item.msg.classList.add("bad");
          if (norm(raw) === "") {
            item.msg.textContent = "Please type an answer here.";
          } else {
            item.msg.textContent = "“" + raw + "” isn’t right yet — try again!";
          }
        }
      });
      if (allCorrect) markSolved(problem, index, btn);
    }

    showModal();
    setTimeout(function () { if (inputs[0]) inputs[0].input.focus(); }, 60);
  }

  function markSolved(problem, index, btn) {
    if (solved[problem.id]) return;
    solved[problem.id] = true;
    saveSolved(solved);

    revealTiles(tilesForProblem(index, PROBLEMS.length), true);
    refreshCard(problem.id);
    updateProgress();
    burstConfetti(18);

    if (btn) { btn.disabled = true; btn.textContent = "Solved!"; }
    var done = document.createElement("div");
    done.className = "solved-note";
    done.textContent = "Nice! A piece of the picture is revealed.";
    modalBody.appendChild(done);

    if (solvedCount() === PROBLEMS.length) {
      setTimeout(function () { burstConfetti(60); }, 350);
    }
  }

  function showModal() {
    backdrop.hidden = false;
    document.addEventListener("keydown", onEsc);
  }
  function closeModal() {
    backdrop.hidden = true;
    activeProblem = null;
    document.removeEventListener("keydown", onEsc);
  }
  function onEsc(e) { if (e.key === "Escape") closeModal(); }

  modalClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });

  // ---- confetti ---------------------------------------------------------
  var CONFETTI = ["🌈", "⭐", "❤️", "☀️", "🎈", "✨"];
  function burstConfetti(count) {
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.className = "confetti-piece";
      span.textContent = CONFETTI[Math.floor(Math.random() * CONFETTI.length)];
      span.style.left = Math.random() * 100 + "vw";
      span.style.animationDuration = (2.5 + Math.random() * 2) + "s";
      span.style.animationDelay = Math.random() * 0.4 + "s";
      span.style.fontSize = 20 + Math.random() * 22 + "px";
      confettiLayer.appendChild(span);
      (function (node) {
        setTimeout(function () { node.remove(); }, 5200);
      })(span);
    }
  }

  // ---- reset ------------------------------------------------------------
  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Start over and hide the picture again?")) return;
    solved = {};
    saveSolved(solved);
    tileEls.forEach(function (el) { el.classList.remove("gone"); });
    buildCards();
    updateProgress();
  });

  // ---- initial render ---------------------------------------------------
  buildCards();
  updateProgress();
  // reveal pieces already solved (no animation on load)
  PROBLEMS.forEach(function (p, i) {
    if (solved[p.id]) revealTiles(tilesForProblem(i, PROBLEMS.length), false);
  });
})();
