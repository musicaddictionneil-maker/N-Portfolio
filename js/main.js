/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   main.js — Core Init, Loader, Page Transitions, Nav
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ══════════════════════════════════════
     LOADER SYSTEM
  ══════════════════════════════════════ */
  const loader    = document.getElementById('loader');
  const isHome    = document.body.classList.contains('page-home');
  const LOAD_DUR  = isHome ? 2400 : 900;

  function hideLoader() {
    if (!loader) return;

    loader.classList.add('exit');

    setTimeout(() => {
      loader.style.pointerEvents = 'none';
      loader.style.visibility    = 'hidden';

      /* Trigger hero animations */
      document.body.classList.add('loaded');
      window.dispatchEvent(new CustomEvent('neil:loaded'));
    }, 900);
  }

  function initLoader() {
    if (!loader) return;

    /* Prevent scroll during load */
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.style.overflow = '';
        hideLoader();
      }, LOAD_DUR);
    });

    /* Fallback if window.load is slow */
    setTimeout(() => {
      document.body.style.overflow = '';
      hideLoader();
    }, LOAD_DUR + 1000);
  }

  /* ══════════════════════════════════════
     PAGE TRANSITIONS
  ══════════════════════════════════════ */
  function initPageTransitions() {
    const pt = document.getElementById('pageTransition');
    if (!pt) return;

    /* Animate out on page load */
    pt.classList.add('exit');
    setTimeout(() => pt.classList.remove('exit'), 700);

    /* Intercept internal navigation */
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');

      /* Skip: external, anchor, mailto, tel */
      if (
        !href ||
        href.startsWith('#')     ||
        href.startsWith('http')  ||
        href.startsWith('mailto')||
        href.startsWith('tel')   ||
        link.target === '_blank'
      ) return;

      e.preventDefault();

      /* Transition out */
      pt.classList.add('enter');

      setTimeout(() => {
        window.location.href = href;
      }, 550);
    });
  }

  /* ══════════════════════════════════════
     MOBILE NAV TOGGLE
  ══════════════════════════════════════ */
  function initMobileNav() {
    const toggle    = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══════════════════════════════════════
     HERO SECTION SCROLL PARALLAX
  ══════════════════════════════════════ */
  function initHeroParallax() {
    const hero      = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSub   = document.querySelector('.hero-sub');

    if (!hero) return;

    function onScroll() {
      const y        = window.scrollY;
      const heroH    = hero.offsetHeight;
      const progress = Math.min(y / heroH, 1);

      if (heroTitle) {
        heroTitle.style.transform = `translateY(${progress * 60}px)`;
        heroTitle.style.opacity   = (1 - progress * 1.5).toString();
      }
      if (heroSub) {
        heroSub.style.transform = `translateY(${progress * 40}px)`;
        heroSub.style.opacity   = (1 - progress * 2).toString();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ══════════════════════════════════════
     WORK CARD HOVER STAGGER
  ══════════════════════════════════════ */
  function initWorkCardEffects() {
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        workCards.forEach(other => {
          if (other !== card) {
            other.style.opacity   = '0.5';
            other.style.transform = 'scale(0.98)';
            other.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        workCards.forEach(other => {
          other.style.opacity   = '';
          other.style.transform = '';
          other.style.transition = '';
        });
      });
    });
  }

  /* ══════════════════════════════════════
     AMBIENT ORBS — MOUSE FOLLOW
  ══════════════════════════════════════ */
  function initAmbientFollow() {
    const orbs = document.querySelectorAll('.ambient-orb');
    if (!orbs.length) return;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.012;
        orb.style.transform = `translate(${dx * factor * 80}px, ${dy * factor * 80}px)`;
        orb.style.transition = 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ══════════════════════════════════════
     CURSOR TRAIL (subtle)
  ══════════════════════════════════════ */
  function initCursorTrail() {
    let lastTrail = 0;
    const THROTTLE = 60; // ms between trail dots

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrail < THROTTLE) return;
      lastTrail = now;

      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top  = e.clientY + 'px';
      document.body.appendChild(trail);

      setTimeout(() => trail.remove(), 600);
    });
  }

  /* ══════════════════════════════════════
     SECTION ENTRANCE via scroll velocity
  ══════════════════════════════════════ */
  function initSectionEntrance() {
    /* Add perspective to sections for depth effects */
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.transformStyle = 'preserve-3d';
    });
  }

  /* ══════════════════════════════════════
     FOOTER PARALLAX TEXT
  ══════════════════════════════════════ */
  function initFooterParallax() {
    const bgText = document.querySelector('.cta-bg-text');
    if (!bgText) return;

    window.addEventListener('scroll', () => {
      const rect = bgText.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      bgText.style.transform = `translateX(-50%) translateY(${(progress - 0.5) * -40}px)`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     GLOBAL KEYBOARD SHORTCUTS
  ══════════════════════════════════════ */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      /* [G] — Go to portfolio */
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey &&
          e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        window.location.href = 'portfolio.html';
      }
    });
  }

  /* ══════════════════════════════════════
     PRELOAD NEXT PAGE IMAGES
  ══════════════════════════════════════ */
  function prefetchLinks() {
    const links = document.querySelectorAll('.nav-link, .footer-nav a');
    const seen  = new Set();

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || seen.has(href)) return;
      seen.add(href);

      const prefetch = document.createElement('link');
      prefetch.rel   = 'prefetch';
      prefetch.href  = href;
      document.head.appendChild(prefetch);
    });
  }

  /* ══════════════════════════════════════
     MAIN INIT
  ══════════════════════════════════════ */
  function init() {
    initLoader();
    initPageTransitions();
    initMobileNav();
    initAmbientFollow();
    initCursorTrail();
    initFooterParallax();
    initKeyboardShortcuts();
    prefetchLinks();

    /* Page-specific */
    if (document.body.classList.contains('page-home')) {
      initHeroParallax();
      initWorkCardEffects();
    }

    initSectionEntrance();

    /* Dispatch ready event */
    window.dispatchEvent(new CustomEvent('neil:pageReady'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ══════════════════════════════════════
     ERROR BOUNDARY
  ══════════════════════════════════════ */
  window.addEventListener('error', (e) => {
    console.warn('[Neil Portfolio] JS error caught:', e.message);
  });

})();
