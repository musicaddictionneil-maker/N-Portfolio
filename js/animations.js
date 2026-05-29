/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   animations.js — Scroll Reveal, Stagger, Counter Anim
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ══════════════════════════════════════
     SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════ */
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-scale, .reveal-char, .reveal-chars'
    );

    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          /* Letter-split elements */
          if (el.classList.contains('reveal-chars') && !el.dataset.split) {
            splitTextToLetters(el);
            el.dataset.split = 'true';
            /* Small delay so letters render before animating */
            requestAnimationFrame(() => {
              el.classList.add('revealed');
              animateLetters(el);
            });
          } else {
            el.classList.add('revealed');
          }

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Split text into span.char-letter wrappers ── */
  function splitTextToLetters(el) {
    /* Preserve HTML structure — only split text nodes */
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const fragment = document.createDocumentFragment();
        [...text].forEach((char, i) => {
          if (char === ' ') {
            fragment.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'char-letter';
            span.textContent = char;
            span.style.transitionDelay = (i * 0.025) + 's';
            fragment.appendChild(span);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  /* ── Stagger animate letters ── */
  function animateLetters(el) {
    const letters = el.querySelectorAll('.char-letter');
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.style.opacity   = '1';
        letter.style.transform = 'none';
      }, i * 25);
    });
  }

  /* ══════════════════════════════════════
     SKILL BAR ANIMATION
  ══════════════════════════════════════ */
  function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill[data-width]');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.dataset.width;
          fill.style.setProperty('--target-width', width + '%');
          /* Set width directly (CSS handles transition) */
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 200);
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════════
     NUMBER COUNTER ANIMATION
  ══════════════════════════════════════ */
  function initCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el        = entry.target;
          const rawText   = el.textContent.trim();
          const hasPlus   = rawText.includes('+');
          const numStr    = rawText.replace(/\D/g, '');
          const target    = parseInt(numStr, 10);

          if (isNaN(target)) return;

          animateCounter(el, 0, target, 1800, hasPlus);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
  }

  function animateCounter(el, from, to, duration, suffix) {
    const start = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = easeOutExpo(progress);
      const value    = Math.round(from + (to - from) * ease);

      el.textContent = (value < 10 ? '0' + value : value) + (suffix ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /* ══════════════════════════════════════
     MOUSE-FOLLOW AMBIENT LIGHT
  ══════════════════════════════════════ */
  function initMouseLight() {
    const light = document.createElement('div');
    light.className = 'mouse-light';
    document.body.appendChild(light);

    let lx = -300, ly = -300;
    let tx = -300, ty = -300;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function animateLight() {
      lx += (tx - lx) * 0.06;
      ly += (ty - ly) * 0.06;
      light.style.left = lx + 'px';
      light.style.top  = ly + 'px';
      requestAnimationFrame(animateLight);
    }

    animateLight();
  }

  /* ══════════════════════════════════════
     NAVBAR SCROLL BEHAVIOUR
  ══════════════════════════════════════ */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastY = 0;
    let hidden = false;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;

      if (y > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      /* Hide on scroll down, show on scroll up */
      if (y > lastY + 10 && y > 200 && !hidden) {
        nav.style.transform = 'translateY(-100%)';
        nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        hidden = true;
      } else if (y < lastY - 10 && hidden) {
        nav.style.transform = 'translateY(0)';
        hidden = false;
      }

      lastY = y;
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     LOADER COUNTER ANIMATION
  ══════════════════════════════════════ */
  function animateLoaderCounter() {
    const num     = document.getElementById('loader-num');
    const bar     = document.querySelector('.loader-bar');
    if (!num || !bar) return;

    let count  = 0;
    const dur  = 2200; // ms total loader
    const step = dur / 100;
    let loaded = 0;

    const interval = setInterval(() => {
      loaded += Math.random() * 3 + 0.5;
      loaded  = Math.min(loaded, 100);
      count   = Math.round(loaded);

      num.textContent = count;
      bar.style.width = count + '%';

      if (count >= 100) {
        clearInterval(interval);
      }
    }, step);
  }

  /* ══════════════════════════════════════
     HERO TEXT STAGGER
  ══════════════════════════════════════ */
  function triggerHeroReveal() {
    /* Add small page-load delay for cinematic feel */
    const heroEls = document.querySelectorAll('.hero .reveal-char, .hero .reveal-up, .hero .reveal-scale, .hero .reveal-fade');

    /* They're already set up to reveal via IntersectionObserver,
       but on page load the hero is in viewport — trigger manually */
    setTimeout(() => {
      heroEls.forEach(el => {
        if (!el.classList.contains('revealed')) {
          el.classList.add('revealed');
        }
      });
    }, 200);
  }

  /* ══════════════════════════════════════
     MARQUEE PAUSE ON HOVER
  ══════════════════════════════════════ */
  function initMarquee() {
    const marquee = document.querySelector('.marquee-content');
    if (!marquee) return;

    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  /* ══════════════════════════════════════
     SERVICE ITEM HOVER
  ══════════════════════════════════════ */
  function initServiceHover() {
    const items = document.querySelectorAll('.service-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        items.forEach(other => {
          if (other !== item) {
            other.style.opacity = '0.4';
          }
        });
      });
      item.addEventListener('mouseleave', () => {
        items.forEach(other => {
          other.style.opacity = '';
        });
      });
    });
  }

  /* ══════════════════════════════════════
     INITIALIZE ALL
  ══════════════════════════════════════ */
  function init() {
    initReveal();
    initSkillBars();
    initCounters();
    initMouseLight();
    initNavScroll();
    initMarquee();
    initServiceHover();
    triggerHeroReveal();

    /* Loader counter only on home page */
    if (document.getElementById('loader-num')) {
      animateLoaderCounter();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
