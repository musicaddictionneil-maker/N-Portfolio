/* ═══════════════════════════════════════════════════════
   NEIL — CINEMATIC PORTFOLIO
   portfolio.js — Filter, Modal, Grid Interactions
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ══════════════════════════════════════
     FILTER SYSTEM
  ══════════════════════════════════════ */
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.bento-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        /* Update active button */
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach((card, i) => {
          const category = card.dataset.filter;
          const matches  = filter === 'all' || category === filter;

          if (matches) {
            card.classList.remove('filter-hidden');
            card.style.transitionDelay = (i % 3 * 0.06) + 's';
          } else {
            card.classList.add('filter-hidden');
            card.style.transitionDelay = '0s';
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════
     PROJECT MODAL
  ══════════════════════════════════════ */
  function initModal() {
    const modal       = document.getElementById('projectModal');
    const overlay     = document.getElementById('modalOverlay');
    const closeBtn    = document.getElementById('modalClose');
    const cards       = document.querySelectorAll('.bento-card');

    const modalImg    = document.getElementById('modalImg');
    const modalTitle  = document.getElementById('modalTitle');
    const modalCat    = document.getElementById('modalCat');
    const modalDesc   = document.getElementById('modalDesc');
    const modalYear   = document.getElementById('modalYear');
    const modalCatD   = document.getElementById('modalCatDetail');
    const modalClient = document.getElementById('modalClient');
    

    if (!modal || !cards.length) return;

    /* ── Open Modal ── */
    function openModal(card) {
      const modalBtn = document.querySelector(".modal-cta");

if (card.dataset.video) {

    modalBtn.href = card.dataset.video;

    modalBtn.style.display = "flex";

} else {

    modalBtn.style.display = "none";

}
      const data = {
        title  : card.dataset.title  || '',
        cat    : card.dataset.cat    || '',
        desc   : card.dataset.desc   || '',
        year   : card.dataset.year   || '',
        client : card.dataset.client || '',
        img    : card.dataset.img    || ''
      };

      /* Populate */
      if (modalImg)    { modalImg.src = data.img; modalImg.alt = data.title; }
      if (modalTitle)  modalTitle.textContent = data.title;
      if (modalCat)    modalCat.textContent   = data.cat;
      if (modalDesc)   modalDesc.textContent  = data.desc;
      if (modalYear)   modalYear.textContent  = data.year;
      if (modalCatD)   modalCatD.textContent  = data.cat;
      if (modalClient) modalClient.textContent = data.client;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      /* Trap focus */
      closeBtn && closeBtn.focus();
    }

    /* ── Close Modal ── */
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* ── Card click ── */
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('filter-hidden')) {
          openModal(card);
        }
      });
    });

    /* ── Close triggers ── */
    closeBtn  && closeBtn.addEventListener('click', closeModal);
    overlay   && overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ══════════════════════════════════════
     BENTO CARD MOUSE-FOLLOW LIGHTING
  ══════════════════════════════════════ */
  function initCardLight() {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;

        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');

        card.style.background = `
          radial-gradient(
            circle at ${x}% ${y}%,
            rgba(255,255,255,0.04) 0%,
            var(--gray-900) 50%
          )
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    initFilters();
    initModal();
    initCardLight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
