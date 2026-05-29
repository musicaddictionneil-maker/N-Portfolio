/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   cursor.js — Custom Cursor & Magnetic Button Logic
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── State ── */
  const cursor     = document.getElementById('cursor');
  const follower   = document.getElementById('cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let rafId = null;

  /* ── Move cursor instantly ── */
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }

  /* ── Lerp follower smoothly ── */
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }

  document.addEventListener('mousemove', onMouseMove);
  animateFollower();

  /* ── Hide on leave, show on enter ── */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });

  /* ── Hover States ── */
  const hoverTargets = 'a, button, .magnetic, .filter-btn, .bento-card, .work-card, .service-item, .soc-item, .tool-tag';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    }
  });

  /* ── Click pulse ── */
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.85)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  /* ══════════════════════════════════════
     MAGNETIC BUTTONS
  ══════════════════════════════════════ */
  function initMagnetic() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(el => {
      let bounds, rafMag;

      function getCenter() {
        bounds = el.getBoundingClientRect();
        return {
          cx: bounds.left + bounds.width  / 2,
          cy: bounds.top  + bounds.height / 2
        };
      }

      el.addEventListener('mouseenter', () => {
        bounds = el.getBoundingClientRect();
      });

      el.addEventListener('mousemove', (e) => {
        const { cx, cy } = getCenter();
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(bounds.width, bounds.height) * 0.5;
        const strength = Math.min(dist / maxDist, 1);
        const pull = 0.35;

        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 500);
      });
    });
  }

  /* ── Init once DOM is ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagnetic);
  } else {
    initMagnetic();
  }

  /* Re-init after page changes */
  window.addEventListener('neil:pageReady', initMagnetic);

})();
