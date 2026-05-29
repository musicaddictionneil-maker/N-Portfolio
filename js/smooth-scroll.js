/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   smooth-scroll.js — Inertia Scrolling & Parallax
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── Lenis-inspired smooth scroll ── */
  class SmoothScroll {
    constructor(options = {}) {
      this.ease      = options.ease      || 0.085;
      this.current   = 0;
      this.target    = 0;
      this.limit     = 0;
      this.rafId     = null;
      this.ticking   = false;
      this.callbacks = [];

      this.init();
    }

    init() {
      /* Set html to fixed so we scroll the body manually */
      document.documentElement.style.scrollBehavior = 'auto';

      /* Capture wheel */
      window.addEventListener('wheel', (e) => {
        this.target = Math.max(0, Math.min(this.limit, this.target + e.deltaY));
        e.preventDefault();
      }, { passive: false });

      /* Touch */
      let touchY = 0;
      window.addEventListener('touchstart', (e) => {
        touchY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        const delta = touchY - e.touches[0].clientY;
        touchY = e.touches[0].clientY;
        this.target = Math.max(0, Math.min(this.limit, this.target + delta));
      }, { passive: true });

      /* Resize */
      window.addEventListener('resize', () => this.resize());
      this.resize();
      this.run();
    }

    resize() {
      this.limit = document.body.scrollHeight - window.innerHeight;
    }

    lerp(a, b, t) {
      return a + (b - a) * t;
    }

    run() {
      this.rafId = requestAnimationFrame(() => this.run());

      this.current = this.lerp(this.current, this.target, this.ease);

      /* Stop when close enough */
      if (Math.abs(this.current - this.target) < 0.01) {
        this.current = this.target;
      }

      /* Apply scroll via window.scrollTo for IntersectionObserver compat */
      window.scrollTo(0, this.current);

      /* Notify listeners */
      this.callbacks.forEach(cb => cb(this.current));
    }

    on(cb) {
      this.callbacks.push(cb);
    }

    scrollTo(y, instant = false) {
      this.target  = Math.max(0, Math.min(this.limit, y));
      if (instant) this.current = this.target;
    }

    destroy() {
      cancelAnimationFrame(this.rafId);
    }
  }

  /* ── Only init on non-touch desktop ── */
  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

  let scroll = null;

  function initScroll() {
    if (!isTouchDevice()) {
      try {
        scroll = new SmoothScroll({ ease: 0.08 });
        window._neilScroll = scroll;
      } catch(e) {
        console.warn('Smooth scroll init failed:', e);
      }
    }
  }

  /* ── Parallax on scroll ── */
  function initParallax() {
    const parallaxEls = document.querySelectorAll('.parallax-img');
    if (!parallaxEls.length) return;

    function updateParallax(scrollY) {
      parallaxEls.forEach(el => {
        const section = el.closest('section') || el.parentElement;
        const rect    = section.getBoundingClientRect();
        const vh      = window.innerHeight;

        if (rect.bottom < 0 || rect.top > vh) return;

        const progress = (rect.top - vh) / (rect.height + vh); // -1 to 1
        const offset   = progress * 60; // px movement
        el.style.transform = `translateY(${offset}px) scale(1.08)`;
      });
    }

    /* Hook into smooth scroll or native */
    if (scroll) {
      scroll.on(updateParallax);
    } else {
      window.addEventListener('scroll', () => {
        updateParallax(window.scrollY);
      }, { passive: true });
    }

    updateParallax(window.scrollY);
  }

  /* ── Mouse-follow parallax on hero ── */
  function initMouseParallax() {
    const heroFrame = document.querySelector('.hero-frame');
    if (!heroFrame) return;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      heroFrame.style.transform = `
        perspective(1000px)
        rotateY(${dx * 4}deg)
        rotateX(${-dy * 4}deg)
        translateZ(10px)
      `;
    });

    document.addEventListener('mouseleave', () => {
      heroFrame.style.transform = '';
      heroFrame.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { heroFrame.style.transition = ''; }, 800);
    });
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScroll();
      initParallax();
      initMouseParallax();
    });
  } else {
    initScroll();
    initParallax();
    initMouseParallax();
  }

})();
