// Hero illustration loop: a hand-drawn laptop draws itself and types some
// code, erases and undraws, then a Tibetan pecha draws itself and types the
// opening line of the sutras, erases, undraws, and it all cycles. Line-art is
// SVG stroke-dashoffset; the text is HTML overlaid on the drawn frame so it
// wraps and mixes fonts without SVG <tspan> gymnastics. Decorative → the whole
// thing is aria-hidden in the markup.
(function () {
  var root = document.querySelector(".hero-anim");
  if (!root) return;

  var laptop = root.querySelectorAll(".art-laptop .ln");
  var pecha = root.querySelectorAll(".art-pecha .ln");
  var scrLap = root.querySelector(".screen-laptop");
  var codeEl = scrLap.querySelector(".code");
  var scrPec = root.querySelector(".screen-pecha");
  var boEl = scrPec.querySelector(".line-bo");
  var enEl = scrPec.querySelector(".line-en");

  var CODE = "def karma(action):\n  return action\n\nmiddle_way = float('-inf') < 0 < float('inf')";
  var BO = "འདི་སྐད་བདག་གིས་ཐོས་པ་དུས་གཅིག་ན། བཅོམ་ལྡན་འདས་རྒྱལ་པོའི་ཁབ།";
  var EN = "Thus have I heard at one time, the Blessed One was in Rajagriha";

  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Prime each stroke: dash length = path length, offset it fully out of view.
  each(laptop, primePath);
  each(pecha, primePath);
  function primePath(p) {
    var len = p.getTotalLength();
    p.dataset.len = len;
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  }

  // Reduced motion: no loop. Show the laptop, drawn and typed, and stop.
  if (reduce) {
    each(laptop, function (p) { p.style.strokeDashoffset = 0; });
    codeEl.textContent = CODE;
    scrLap.classList.add("on");
    return;
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function stroke(paths, offset, dur, stagger) {
    return new Promise(function (res) {
      each(paths, function (p, i) {
        setTimeout(function () {
          p.style.transition = "stroke-dashoffset " + dur + "ms ease";
          p.style.strokeDashoffset = offset === "in" ? 0 : p.dataset.len;
        }, i * stagger);
      });
      setTimeout(res, (paths.length - 1) * stagger + dur);
    });
  }
  var draw = function (p) { return stroke(p, "in", 650, 160); };
  var undraw = function (p) { return stroke(p, "out", 480, 110); };

  function caret(el) {
    each(root.querySelectorAll(".typing"), function (x) { x.classList.remove("typing"); });
    if (el) el.classList.add("typing");
  }

  function type(el, text, speed) {
    caret(el);
    return new Promise(function (res) {
      var i = 0;
      (function step() {
        el.textContent = text.slice(0, i);
        if (i >= text.length) return res();
        i++;
        setTimeout(step, speed);
      })();
    });
  }
  function untype(el, speed) {
    caret(el);
    return new Promise(function (res) {
      var i = el.textContent.length;
      (function step() {
        el.textContent = el.textContent.slice(0, i);
        if (i <= 0) return res();
        i--;
        setTimeout(step, speed);
      })();
    });
  }

  async function cycle() {
    for (;;) {
      scrLap.classList.add("on");
      await draw(laptop);
      await sleep(150);
      await type(codeEl, CODE, 55);
      await sleep(1900);
      await untype(codeEl, 28);
      caret(null);
      scrLap.classList.remove("on");
      await undraw(laptop);
      await sleep(250);

      scrPec.classList.add("on");
      await draw(pecha);
      await sleep(150);
      await type(boEl, BO, 42);
      await sleep(450);
      await type(enEl, EN, 32);
      await sleep(2600);
      await untype(enEl, 18);
      await untype(boEl, 16);
      caret(null);
      scrPec.classList.remove("on");
      await undraw(pecha);
      await sleep(250);
    }
  }
  cycle();
})();
