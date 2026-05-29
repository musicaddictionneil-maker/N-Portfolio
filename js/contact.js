/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   contact.js — Form Validation, Submit, Toast
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ══════════════════════════════════════
     FLOATING LABEL SUPPORT FOR SELECT
  ══════════════════════════════════════ */
  function initFloatingLabels() {
    const selects = document.querySelectorAll('.form-select');
    selects.forEach(select => {
      select.addEventListener('change', () => {
        if (select.value) {
          select.classList.add('has-value');
        } else {
          select.classList.remove('has-value');
        }
      });
    });
  }

  /* ══════════════════════════════════════
     FORM VALIDATION
  ══════════════════════════════════════ */
  function validateForm(form) {
    const inputs   = form.querySelectorAll('[required]');
    let   isValid  = true;

    inputs.forEach(input => {
      const field  = input.closest('.form-field');
      const value  = input.value.trim();

      /* Clear prev error */
      field.classList.remove('error');

      if (!value) {
        field.classList.add('error');
        isValid = false;
        shakeField(input);
        return;
      }

      /* Email validation */
      if (input.type === 'email') {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(value)) {
          field.classList.add('error');
          isValid = false;
          shakeField(input);
        }
      }
    });

    return isValid;
  }

  function shakeField(input) {
    const field = input.closest('.form-field');
    field.classList.add('shake');
    field.addEventListener('animationend', () => {
      field.classList.remove('shake');
    }, { once: true });
  }

  /* ══════════════════════════════════════
     TOAST NOTIFICATION
  ══════════════════════════════════════ */
  function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  /* ══════════════════════════════════════
     FORM SUBMIT
  ══════════════════════════════════════ */
  function initForm() {
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitTxt = submitBtn && submitBtn.querySelector('.submit-text');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm(form)) return;

      /* Sending state */
      if (submitBtn) {
        submitBtn.classList.add('sending');
        if (submitTxt) submitTxt.textContent = 'Sending';
      }

      /* Simulate network request */
      await new Promise(resolve => setTimeout(resolve, 1800));

      /* Success */
      if (submitBtn) {
        submitBtn.classList.remove('sending');
        if (submitTxt) submitTxt.textContent = 'Message Sent';
        submitBtn.style.background = 'rgba(74, 222, 128, 0.15)';
        submitBtn.style.color = '#4ade80';
        submitBtn.style.border = '1px solid rgba(74, 222, 128, 0.3)';
      }

      form.reset();

      /* Reset select */
      const selects = form.querySelectorAll('.form-select');
      selects.forEach(s => s.classList.remove('has-value'));

      showToast();

      /* Reset button after delay */
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.style.background = '';
          submitBtn.style.color      = '';
          submitBtn.style.border     = '';
          if (submitTxt) submitTxt.textContent = 'Send Message';
        }
      }, 3000);
    });
  }

  /* ══════════════════════════════════════
     ANIMATED FIELD FOCUS EFFECTS
  ══════════════════════════════════════ */
  function initFieldEffects() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const field = input.closest('.form-field');
        field.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        const field = input.closest('.form-field');
        field.classList.remove('focused');
      });
    });
  }

  /* ══════════════════════════════════════
     AMBIENT BACKGROUND MOTION
  ══════════════════════════════════════ */
  function initAmbientMotion() {
    const orbs = document.querySelectorAll('.ambient-orb');

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.015;
        const tx     = dx * factor * 60;
        const ty     = dy * factor * 60;
        orb.style.transform = `translate(${tx}px, ${ty}px)`;
        orb.style.transition = 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    initFloatingLabels();
    initForm();
    initFieldEffects();
    initAmbientMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
