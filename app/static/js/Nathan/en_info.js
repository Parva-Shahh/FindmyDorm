/**
 * en_info.js  —  FindMyDorm  |  English Dorm Info Page
 * Author: Nathan John Paseos
 * Path: app/static/js/Nathan/en_info.js
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SAVE / BOOKMARK TOGGLE ─────────────────────────────────
     - First click: bookmarks (fa-regular → fa-solid, adds .is-saved)
     - Second click: unbookmarks (fa-solid → fa-regular, removes .is-saved)
     - State is tracked via data-saved attribute and the /save route
       which uses Flask session to persist across page loads.
  ──────────────────────────────────────────────────────────────── */
  const saveBtn = document.getElementById('saveBtn');

  if (saveBtn) {
    const icon = saveBtn.querySelector('.info-save-btn__icon');

    // Initialise visual state from server-rendered data-saved attribute
    function applySavedState(isSaved) {
      saveBtn.classList.toggle('is-saved', isSaved);
      if (icon) {
        if (isSaved) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid', 'info-save-btn__icon--saved');
        } else {
          icon.classList.remove('fa-solid', 'info-save-btn__icon--saved');
          icon.classList.add('fa-regular');
        }
      }
      saveBtn.dataset.saved = isSaved ? 'true' : 'false';
      saveBtn.setAttribute('aria-label', isSaved ? 'Unsave dorm' : 'Save dorm');
    }

    // Set initial state from server-rendered attribute
    applySavedState(saveBtn.dataset.saved === 'true');

    saveBtn.addEventListener('click', async () => {
      const dormId = saveBtn.dataset.dormId;
      if (!dormId) return;

      try {
        const response = await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dorm_id: dormId }),
        });

        if (response.status === 401) { window.location.href = '/login'; return; }
        if (!response.ok) throw new Error(`Save failed: ${response.status}`);

        const data = await response.json();
        applySavedState(data.saved);

        // Pulse animation
        saveBtn.classList.add('just-saved');
        saveBtn.addEventListener('animationend', () => {
          saveBtn.classList.remove('just-saved');
        }, { once: true });

      } catch (err) {
        console.error('[EN info] Save error:', err);
      }
    });
  }


  /* ── 2. REVIEWS HORIZONTAL CAROUSEL ─────────────────────────── */
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsPrev  = document.getElementById('reviewsPrev');
  const reviewsNext  = document.getElementById('reviewsNext');

  if (reviewsTrack && reviewsPrev && reviewsNext) {
    function getScrollStep() {
      const card = reviewsTrack.querySelector('.info-review-card');
      if (!card) return 300;
      return card.offsetWidth + parseFloat(getComputedStyle(reviewsTrack).gap || '20');
    }
    reviewsPrev.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
    reviewsNext.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
    function updateArrows() {
      reviewsPrev.style.opacity = reviewsTrack.scrollLeft <= 4 ? '0.35' : '1';
      reviewsNext.style.opacity =
        reviewsTrack.scrollLeft + reviewsTrack.clientWidth >= reviewsTrack.scrollWidth - 4
          ? '0.35' : '1';
    }
    reviewsTrack.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  }


  /* ── 3. CAROUSEL KEYBOARD NAVIGATION ─────────────────────────── */
  const dormCarousel = document.getElementById('dormCarousel');
  if (dormCarousel) {
    const bsCarousel = bootstrap.Carousel.getOrCreateInstance(dormCarousel);
    dormCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  bsCarousel.prev();
      if (e.key === 'ArrowRight') bsCarousel.next();
    });
    dormCarousel.setAttribute('tabindex', '0');
  }

});