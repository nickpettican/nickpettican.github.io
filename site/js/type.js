// Terminal-style typewriter for the masthead: types one name, holds,
// deletes it, types the other, loops. No dependency (this is what
// typed.js does; it's not worth 15KB). The link's aria-label carries the
// stable name, so this animation stays aria-hidden.
(function () {
  var el = document.querySelector(".mast-name .typed");
  if (!el) return;

  // Reduced motion: leave the static first name, no typing, no blink.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var words = ["NICOLAS_PETTICAN", "TENPA_BHIKSHU"];
  var typeSpeed = 85, deleteSpeed = 40, holdFull = 10000, holdEmpty = 550;

  // Start holding the full first word (already in the HTML), then delete it.
  var wordIndex = 0, charIndex = words[0].length, deleting = true;

  function tick() {
    var word = words[wordIndex];
    if (deleting) {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, holdEmpty);
      } else {
        setTimeout(tick, deleteSpeed);
      }
    } else {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex >= word.length) {
        deleting = true;
        setTimeout(tick, holdFull);
      } else {
        setTimeout(tick, typeSpeed);
      }
    }
  }

  setTimeout(tick, holdFull);
})();
