/**
 * FILE: zh_listings.js
 * AUTHOR: Nate
 * Chinese locale — Booking.com style, cards left / map right
 * Includes filtering and search logic (no separate filter.js needed)
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════════════════════
     FILTER & SEARCH LOGIC
  ══════════════════════════════════════════════════════════ */

  var searchInput = document.getElementById('searchInput');

  function applyFilters() {
    var dorms           = document.querySelectorAll('.dorm-item');
    var query           = searchInput ? searchInput.value.toLowerCase() : '';
    var activeTypes     = getChecked(['Apartment', 'Studio', 'Room']);
    var activePrices    = getChecked(['budget', 'mid', 'premium']);
    var activeLocations = getChecked(['dublin 1', 'dublin 2', 'dublin 6', 'dun laoghaire']);
    var activeAmenities = getChecked(['wifi', 'bills', 'furnished', 'parking']);

    var visibleCount = 0;

    dorms.forEach(function (dorm) {
      var name      = (dorm.getAttribute('data-name')      || '').toLowerCase();
      var address   = (dorm.getAttribute('data-address')   || '').toLowerCase();
      var type      = (dorm.getAttribute('data-type')      || '');
      var price     = parseInt(dorm.getAttribute('data-price') || '0', 10);
      var amenities = (dorm.getAttribute('data-amenities') || '').toLowerCase().split(',');

      var matchesSearch    = !query || name.includes(query) || address.includes(query);
      var matchesType      = activeTypes.length === 0 || activeTypes.includes(type);
      var matchesPrice     = activePrices.length === 0 || activePrices.some(function (r) {
        if (r === 'budget')  return price < 800;
        if (r === 'mid')     return price >= 800 && price <= 1000;
        if (r === 'premium') return price > 1000;
        return true;
      });
      var matchesLocation  = activeLocations.length === 0 || activeLocations.some(function (l) { return address.includes(l); });
      var matchesAmenities = activeAmenities.length === 0 || activeAmenities.every(function (a) { return amenities.includes(a); });

      var visible = matchesSearch && matchesType && matchesPrice && matchesLocation && matchesAmenities;
      dorm.style.setProperty('display', visible ? 'block' : 'none', 'important');
      if (visible) visibleCount++;
    });

    var countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = visibleCount + ' properties found';
  }

  function getChecked(knownValues) {
    var checked = [];
    document.querySelectorAll('.filter-check:checked').forEach(function (cb) {
      if (knownValues.includes(cb.value)) checked.push(cb.value);
    });
    return checked;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  document.querySelectorAll('.filter-check').forEach(function (cb) {
    cb.addEventListener('change', applyFilters);
  });

  window.resetFilters = function () {
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-check').forEach(function (cb) { cb.checked = false; });
    applyFilters();
  };

  /* ══════════════════════════════════════════════════════════
     LAYOUT — search button + hover highlights
  ══════════════════════════════════════════════════════════ */

  /* ── 1. Search button ───────────────────────────────────── */
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const btn = document.createElement('button');
    btn.className = 'zh-search-btn';
    btn.textContent = '搜索';
    btn.addEventListener('click', applyFilters);
    searchContainer.appendChild(btn);
  }

  /* ── 2. Card hover — orange ring + map popup ────────────── */
  document.querySelectorAll('.dorm-item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      const card = item.querySelector('.listing-card');
      if (card) {
        card.style.borderColor = '#ff6633';
        card.style.boxShadow   = '0 0 0 2px rgba(255,102,51,0.2)';
      }
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
    });
    item.addEventListener('mouseleave', () => {
      const card = item.querySelector('.listing-card');
      if (card) {
        card.style.borderColor = '';
        card.style.boxShadow   = '';
      }
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
    });
  });

  /* ── 3. Invalidate map size ─────────────────────────────── */
  setTimeout(() => {
    if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize();
  }, 200);

});