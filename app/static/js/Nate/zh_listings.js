/**
 * FILE: zh_listings.js
 * AUTHOR: Nate
 * Chinese locale — Booking.com style, cards left / map right
 * CSS handles the full layout — this script adds the search
 * button and card hover highlights only. No DOM restructure needed.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Add search button ─────────────────────────────── */
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const btn = document.createElement('button');
    btn.className = 'zh-search-btn';
    btn.textContent = '搜索';
    searchContainer.appendChild(btn);
  }

  /* ── 2. Card hover — orange ring + map popup ──────────── */
  const dormItems = document.querySelectorAll('.dorm-item');
  dormItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      const card = item.querySelector('.listing-card');
      if (card) {
        card.style.borderColor = '#ff6633';
        card.style.boxShadow   = '0 0 0 2px rgba(255,102,51,0.2)';
      }
      if (window._dormMarkers && window._dormMarkers[i]) {
        window._dormMarkers[i].openPopup();
      }
    });

    item.addEventListener('mouseleave', () => {
      const card = item.querySelector('.listing-card');
      if (card) {
        card.style.borderColor = '';
        card.style.boxShadow   = '';
      }
      if (window._dormMarkers && window._dormMarkers[i]) {
        window._dormMarkers[i].closePopup();
      }
    });
  });

  /* ── 3. Invalidate map size after layout settles ──────── */
  setTimeout(() => {
    if (window._dormLeafletMap) {
      window._dormLeafletMap.invalidateSize();
    }
  }, 200);

});