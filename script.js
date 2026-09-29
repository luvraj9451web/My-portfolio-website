/* =========================================================
   Aarav Mehta — portfolio behaviour
   1. Helpers          5. Skill meters
   2. Mobile nav       6. Project filter
   3. Sticky header    7. Contact form validation
      + scrollspy      8. Misc (year, back to top)
   4. Scroll reveals
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Helpers ---------- */
  function throttle(fn, wait) {
    var last = 0, timer;
    return function () {
      var now = Date.now(), args = arguments, self = this;
      if (now - last >= wait) { last = now; fn.apply(self, args); }
      else {
        clearTimeout(timer);
        timer = setTimeout(function () { last = Date.now(); fn.apply(self, args); }, wait - (now - last));
      }
    };
  }

  /* ---------- 2. Mobile navigation ---------- */
  var nav      = $('#primaryNav');
  var toggle   = $('#navToggle');
  var scrim    = $('#navScrim');
  var navLinks = $$('.nav-link');

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    $('.sr-only', toggle).textContent = 'Close menu';
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    $('.sr-only', toggle).textContent = 'Open menu';
    scrim.hidden = true;
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });

  scrim.addEventListener('click', closeNav);

  navLinks.concat($$('.nav-cta')).forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // Reset inline state if the viewport grows past the mobile breakpoint
  window.addEventListener('resize', throttle(function () {
    if (window.innerWidth > 820) closeNav();
  }, 200));

  /* Smooth scroll with a header offset (also covers browsers without
     CSS scroll-behavior support). */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var head = $('#siteHead').offsetHeight;
      var top  = target.getBoundingClientRect().top + window.pageYOffset - head - 8;

      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 3. Sticky header, progress bar, scrollspy ---------- */
  var head     = $('#siteHead');
  var progress = $('#progressBar');
  var toTop    = $('#toTop');
  var sections = $$('section[data-nav]');

  function onScroll() {
    var y = window.pageYOffset;

    head.classList.toggle('is-stuck', y > 20);
    toTop.classList.toggle('is-shown', y > 600);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    // active nav link
    var current = sections[0].id;
    sections.forEach(function (sec) {
      if (y >= sec.offsetTop - head.offsetHeight - 120) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', throttle(onScroll, 80), { passive: true });
  onScroll();

  /* ---------- 4. Scroll reveals ---------- */
  var revealTargets = $$(
    '.band-title, .band-note, .about-portrait, .about-copy, .facts, ' +
    '.skill-group, .chips, .filters, .card, .cv-head, .timeline, ' +
    '.certs, .contact-list, .socials, .form, .btn-block'
  );

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('shown');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Skill meters ---------- */
  var meters = $$('.meter');

  function fillMeter(meter) {
    var level = parseInt(meter.getAttribute('data-level'), 10) || 0;
    var bar   = $('.meter-track i', meter);
    if (bar) bar.style.width = level + '%';
  }

  if ('IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fillMeter(entry.target);
        mo.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    meters.forEach(function (m) { mo.observe(m); });
  } else {
    meters.forEach(fillMeter);
  }

  /* ---------- 6. Project filter ---------- */
  var filters = $$('.filter');
  var cards   = $$('#workGrid .card');
  var empty   = $('#workEmpty');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');

      filters.forEach(function (b) { b.classList.toggle('is-on', b === btn); });

      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        var show = want === 'all' || tags.indexOf(want) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible++;
          if (!reduceMotion) {
            card.style.animation = 'none';
            void card.offsetWidth;          // force reflow so it replays
            card.style.animation = 'fadeUp .45s var(--ease) both';
          }
        }
      });

      empty.hidden = visible !== 0;
    });
  });

  /* ---------- 7. Contact form validation ---------- */
  var form   = $('#contactForm');
  var status = $('#formStatus');
  var count  = $('#charCount');
  var msg    = $('#message');

  var EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  var rules = {
    name: function (v) {
      if (!v) return 'Enter your name so I know who I\'m replying to.';
      if (v.length < 2) return 'That looks too short — use at least 2 characters.';
      if (!/^[a-z .'-]+$/i.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Enter an email address so I can reply.';
      if (!EMAIL.test(v)) return 'That email is missing something — check for an @ and a domain.';
      return '';
    },
    subject: function (v) {
      if (!v) return 'Add a subject line.';
      if (v.length < 4) return 'Give the subject a few more characters.';
      return '';
    },
    message: function (v) {
      if (!v) return 'Write a message before sending.';
      if (v.length < 15) return 'Add a little more detail — at least 15 characters.';
      if (v.length > 600) return 'That\'s over 600 characters. Trim it down a bit.';
      return '';
    }
  };

  function validateField(input) {
    var name  = input.id;
    var field = input.closest('.field');
    var err   = $('#err-' + name);
    var text  = rules[name](input.value.trim());

    field.classList.toggle('is-bad', !!text);
    field.classList.toggle('is-good', !text && input.value.trim() !== '');
    err.textContent = text;
    input.setAttribute('aria-invalid', text ? 'true' : 'false');

    return !text;
  }

  var inputs = $$('#contactForm input, #contactForm textarea');

  inputs.forEach(function (input) {
    // validate when the user leaves a field
    input.addEventListener('blur', function () { validateField(input); });
    // then keep it live once it has been marked bad
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('is-bad')) validateField(input);
    });
  });

  msg.addEventListener('input', function () {
    count.textContent = msg.value.length;
    count.style.color = msg.value.length > 600 ? 'var(--rose)' : '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var ok = true;
    var firstBad = null;

    inputs.forEach(function (input) {
      if (!validateField(input) && !firstBad) firstBad = input;
      if (!validateField(input)) ok = false;
    });

    if (!ok) {
      status.textContent = 'Some fields need fixing before this can send.';
      status.style.color = 'var(--rose)';
      status.classList.add('is-shown');
      if (firstBad) firstBad.focus();
      return;
    }

    // Front-end only: swap this block for a fetch() to your backend,
    // Formspree, Netlify Forms or EmailJS endpoint.
    var btn = $('#submitBtn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Send message';

      status.style.color = 'var(--mint)';
      status.textContent = 'Thanks — your message is on its way. I usually reply within a day.';
      status.classList.add('is-shown');

      form.reset();
      count.textContent = '0';
      $$('.field').forEach(function (f) { f.classList.remove('is-good', 'is-bad'); });

      setTimeout(function () { status.classList.remove('is-shown'); }, 6000);
    }, 900);
  });

  /* ---------- 8. Misc ---------- */
  $('#year').textContent = new Date().getFullYear();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // Pointer-tracked light in the hero (pointer devices only)
  var hero  = $('#home');
  var light = $('#heroLight');

  if (light && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      light.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      light.style.setProperty('--my', (e.clientY - r.top) + 'px');
      light.style.opacity = '1';
    });
    hero.addEventListener('pointerleave', function () { light.style.opacity = '.45'; });
  }
})();
