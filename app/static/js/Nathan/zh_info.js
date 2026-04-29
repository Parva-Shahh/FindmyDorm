/**
 * zh_info.js  —  FindMyDorm  |  Chinese Dorm Info Page
 * Author: Nathan John Paseos
 * Path: app/static/js/Nathan/zh_info.js
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SAVE / BOOKMARK TOGGLE (Chinese) ─────────────────────────
     Click once = 收藏 (save, orange fill).
     Click again = 取消收藏 (unsave, outline returns).
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
      saveBtn.setAttribute('aria-label', isSaved ? '取消收藏宿舍' : '收藏宿舍');
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
        if (!response.ok) throw new Error(`收藏请求失败：${response.status}`);

        const data = await response.json();
        applySavedState(data.saved);

        saveBtn.classList.add('just-saved');
        saveBtn.addEventListener('animationend', () => {
          saveBtn.classList.remove('just-saved');
        }, { once: true });

      } catch (err) {
        console.error('[ZH info] 收藏错误：', err);
      }
    });
  }


  /* ── 2. TIKTOK HASHTAG FILTER ─────────────────────────────────── */
  /* Tiktok filter is only applied on our chinese website to cater towards the short-form video implementations from Hypothesis 4 regarding Wei Chen */
  const tiktokFeed = document.getElementById('zhTiktokFeed');

  if (tiktokFeed) {
    const tagStyle = document.createElement('style');
    tagStyle.textContent = `.zh-tiktok-tag--active { background: var(--zh-info-primary, #ff6633) !important; color: #fff !important; border-color: var(--zh-info-primary, #ff6633) !important; }`;
    document.head.appendChild(tagStyle);

    document.querySelectorAll('.zh-tiktok-tag').forEach((chip) => {
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => {
        const tag = chip.textContent.replace(/^#/, '').trim();
        const isActive = chip.classList.contains('zh-tiktok-tag--active');
        document.querySelectorAll('.zh-tiktok-tag').forEach(c => c.classList.remove('zh-tiktok-tag--active'));
        const cards = tiktokFeed.querySelectorAll('.zh-tiktok-card');
        if (!isActive) {
          chip.classList.add('zh-tiktok-tag--active');
          cards.forEach(card => {
            const tags = (card.dataset.tags || '').toLowerCase().split(',');
            card.style.display = tags.includes(tag.toLowerCase()) ? '' : 'none';
          });
        } else {
          cards.forEach(card => { card.style.display = ''; });
        }
      });
    });
  }


  /* ── 3. VERTICAL REVIEWS — KEYBOARD SUPPORT ───────────────────── */
  const reviewsTrack = document.getElementById('zhReviewsTrack');
  if (reviewsTrack) {
    reviewsTrack.setAttribute('tabindex', '0');
    reviewsTrack.addEventListener('keydown', (e) => {
      const card = reviewsTrack.querySelector('.info-review-card--zh');
      const step = card ? card.offsetHeight + 12 : 150;
      if (e.key === 'ArrowDown') { e.preventDefault(); reviewsTrack.scrollBy({ top: step,  behavior: 'smooth' }); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); reviewsTrack.scrollBy({ top: -step, behavior: 'smooth' }); }
    });
  }


  /* ── 4. CAROUSEL KEYBOARD NAVIGATION ─────────────────────────── */
  const dormCarouselZH = document.getElementById('dormCarouselZH');
  if (dormCarouselZH) {
    const bsCarouselZH = bootstrap.Carousel.getOrCreateInstance(dormCarouselZH);
    dormCarouselZH.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  bsCarouselZH.prev();
      if (e.key === 'ArrowRight') bsCarouselZH.next();
    });
    dormCarouselZH.setAttribute('tabindex', '0');
  }

});