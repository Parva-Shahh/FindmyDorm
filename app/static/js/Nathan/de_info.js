/**
 * de_info.js  —  FindMyDorm  |  German Dorm Info Page
 * Author: Nathan John Paseos
 * Path: app/static/js/Nathan/de_info.js
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SAVE / BOOKMARK TOGGLE (German) ──────────────────────────
     Click once = save (dark fill). Click again = unsave (outline).
     Colour is driven by CSS .is-saved class on .info-save-btn--de.
  ──────────────────────────────────────────────────────────────── */
  const saveBtn = document.getElementById('saveBtn');

  if (saveBtn) {
    const icon = saveBtn.querySelector('.info-save-btn__icon');

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
      saveBtn.setAttribute('aria-label', isSaved ? 'Unterkunft entfernen' : 'Unterkunft speichern');
    }

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
        if (!response.ok) throw new Error(`Speichern fehlgeschlagen: ${response.status}`);

        const data = await response.json();
        applySavedState(data.saved);

        saveBtn.classList.add('just-saved');
        saveBtn.addEventListener('animationend', () => {
          saveBtn.classList.remove('just-saved');
        }, { once: true });

      } catch (err) {
        console.error('[DE info] Speicher-Fehler:', err);
      }
    });
  }


  /* ── 2. REVIEWS HORIZONTAL CAROUSEL (German) ─────────────────── */
  const reviewsTrackDE = document.getElementById('reviewsTrackDE');
  const reviewsPrevDE  = document.getElementById('reviewsPrevDE');
  const reviewsNextDE  = document.getElementById('reviewsNextDE');

  if (reviewsTrackDE && reviewsPrevDE && reviewsNextDE) {
    function getScrollStepDE() {
      const card = reviewsTrackDE.querySelector('.info-review-card--de');
      if (!card) return 300;
      return card.offsetWidth + parseFloat(getComputedStyle(reviewsTrackDE).gap || '20');
    }
    reviewsPrevDE.addEventListener('click', () => {
      reviewsTrackDE.scrollBy({ left: -getScrollStepDE(), behavior: 'smooth' });
    });
    reviewsNextDE.addEventListener('click', () => {
      reviewsTrackDE.scrollBy({ left: getScrollStepDE(), behavior: 'smooth' });
    });
    function updateArrowsDE() {
      reviewsPrevDE.style.opacity = reviewsTrackDE.scrollLeft <= 4 ? '0.35' : '1';
      reviewsNextDE.style.opacity =
        reviewsTrackDE.scrollLeft + reviewsTrackDE.clientWidth >= reviewsTrackDE.scrollWidth - 4
          ? '0.35' : '1';
    }
    reviewsTrackDE.addEventListener('scroll', updateArrowsDE, { passive: true });
    updateArrowsDE();
  }


  /* ── 3. CAROUSEL KEYBOARD NAVIGATION ─────────────────────────── */
  const dormCarouselDE = document.getElementById('dormCarouselDE');
  if (dormCarouselDE) {
    const bsCarouselDE = bootstrap.Carousel.getOrCreateInstance(dormCarouselDE);
    dormCarouselDE.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  bsCarouselDE.prev();
      if (e.key === 'ArrowRight') bsCarouselDE.next();
    });
    dormCarouselDE.setAttribute('tabindex', '0');
  }

});