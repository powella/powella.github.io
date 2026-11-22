/* Drew Powell — page behaviour. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- scroll progress + sticky nav ---------- */
  var bar = document.getElementById("progressBar");
  var nav = document.getElementById("nav");

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    if (!toggle || !links) return;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = links ? Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]')) : [];

  if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { threshold: 0.01, rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- terminal typing ---------- */
  var term = document.getElementById("term");

  var script = [
    { text: "$ whoami", cls: "cmd" },
    { text: "andrew powell — chicago, il", cls: "out hl" },
    { text: "$ cat stack.txt", cls: "cmd" },
    { text: "sql · c#/.net · javascript", cls: "out" },
    { text: "ssis pipelines · sql server", cls: "out" },
    { text: "25 years, public + private", cls: "out" },
    { text: "$ open index.html", cls: "cmd" },
    { text: "hand-written, no build step ✦", cls: "out hl" }
  ];

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function renderStatic() {
    if (!term) return;
    term.textContent = "";
    script.forEach(function (line) {
      var row = document.createElement("span");
      row.className = line.cls;
      row.textContent = line.text + "\n";
      term.appendChild(row);
    });
  }

  if (term) {
    if (reduceMotion) {
      renderStatic();
    } else {
      (async function type() {
        await sleep(600);

        for (var i = 0; i < script.length; i++) {
          var line = script[i];
          var row = document.createElement("span");
          row.className = line.cls;
          term.appendChild(row);

          var caret = document.createElement("i");
          caret.className = "caret";
          term.appendChild(caret);

          var text = document.createTextNode("");
          row.textContent = "";
          row.appendChild(text);

          for (var c = 0; c < line.text.length; c++) {
            text.nodeValue += line.text.charAt(c);
            await sleep(line.cls === "cmd" ? 42 : 14);
          }

          caret.remove();
          row.textContent = line.text;
          term.appendChild(document.createTextNode("\n"));
          await sleep(line.cls === "cmd" ? 260 : 120);
        }

        var rest = document.createElement("i");
        rest.className = "caret";
        term.appendChild(rest);
        term.setAttribute("aria-label", script.map(function (l) { return l.text; }).join(". "));
      })();
    }
  }

  /* ---------- card follow glow ---------- */
  if (!reduceMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var box = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((event.clientX - box.left) / box.width) * 100 + "%");
        card.style.setProperty("--my", ((event.clientY - box.top) / box.height) * 100 + "%");
      });
    });
  }
})();
