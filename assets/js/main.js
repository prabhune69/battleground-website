// BattleGround Fitness Club — site scripts

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Word-by-word reveal ----------
     Any element with class "reveal-words" has its text split into
     <span class="word"> pieces that pop in one after another.
     Tune per element with data-delay (ms before the first word)
     and data-step (ms between words).                              */
  function splitIntoWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    var delay = parseInt(el.dataset.delay, 10) || 0;
    var step = parseInt(el.dataset.step, 10) || 120;

    el.textContent = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = (delay + i * step) + 'ms';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  document.querySelectorAll('.reveal-words').forEach(function (el) {
    splitIntoWords(el);
    el.classList.add(reduceMotion ? 'no-anim' : 'is-animating');
  });

  /* ---------- Looping typewriter ----------
     Every letter is its own span, revealed one at a time so it can
     land with a blur/rise/overshoot instead of just appearing. All the
     letters exist in the DOM from the start (hidden), so the headline
     never reflows as they are revealed and hidden again.
     Timing is per element, all in ms:
       data-delay  before the first letter        data-type   per letter typed
       data-hold   on the finished text           data-erase  per letter removed
       data-pause  before retyping
     data-loop="false" types once and stops.                        */
  function typewriter(el) {
    var full = (el.dataset.text || el.textContent).trim();
    var ms = function (key, fallback) {
      var v = parseInt(el.dataset[key], 10);
      return isNaN(v) ? fallback : v;
    };
    var loop       = el.dataset.loop !== 'false';
    var startDelay = ms('delay', 450);
    var typeSpeed  = ms('type', 105);
    var eraseSpeed = ms('erase', 40);
    var holdFull   = ms('hold', 2800);
    var holdEmpty  = ms('pause', 700);

    el.textContent = '';
    el.setAttribute('aria-label', full);

    // One span per word (the last one stays accent-coloured), one per letter.
    var words = full.split(/\s+/);
    var chars = [];
    words.forEach(function (word, wi) {
      var wordEl = document.createElement('span');
      wordEl.className = 'word' + (wi === words.length - 1 ? ' accent' : '');
      word.split('').forEach(function (ch, ci) {
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        wordEl.appendChild(span);
        chars.push({ el: span, lastOfWord: ci === word.length - 1 });
      });
      el.appendChild(wordEl);
    });

    // Uneven rhythm reads as typing rather than a metronome, with a
    // longer breath after each finished word.
    function typeDelay(index) {
      var d = typeSpeed * (0.78 + Math.random() * 0.5);
      if (chars[index].lastOfWord) d += typeSpeed * 1.7;
      return d;
    }

    // Stand down while the tab is hidden or the headline is scrolled away.
    var hidden = false;
    var offscreen = false;
    document.addEventListener('visibilitychange', function () {
      hidden = document.hidden;
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        offscreen = !entries[entries.length - 1].isIntersecting;
      }, { threshold: 0 }).observe(el);
    }

    var typed = 0;
    var erasing = false;

    function tick() {
      if (hidden || offscreen) return setTimeout(tick, 500);

      if (!erasing) {
        if (typed < chars.length) {
          chars[typed].el.classList.add('in');
          typed++;
          el.classList.add('is-typing');
          setTimeout(tick, typeDelay(typed - 1));
        } else {
          el.classList.remove('is-typing');
          el.classList.add('is-full');
          if (!loop) return;
          erasing = true;
          setTimeout(tick, holdFull);
        }
      } else {
        el.classList.remove('is-full');
        if (typed > 0) {
          el.classList.add('is-erasing');
          typed--;
          chars[typed].el.classList.remove('in');
          // Hesitate on the first couple, then run the rest down fast.
          setTimeout(tick, typed > chars.length - 3 ? eraseSpeed * 3 : eraseSpeed);
        } else {
          el.classList.remove('is-erasing');
          erasing = false;
          setTimeout(tick, holdEmpty);
        }
      }
    }

    setTimeout(tick, startDelay);
  }

  document.querySelectorAll('.typewriter').forEach(function (el) {
    if (reduceMotion) return; // leave the static text in place
    typewriter(el);
  });

  /* ---------- Header goes solid once you scroll off the hero ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
