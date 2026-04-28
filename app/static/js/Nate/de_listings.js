/**
 * FILE: de_listings.js
 * AUTHOR: Nate
 * German locale — Trivago-inspired layout
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
     LAYOUT — Trivago style
  ══════════════════════════════════════════════════════════ */

  /* ── 1. Search button ───────────────────────────────────── */
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const btn = document.createElement('button');
    btn.className = 'de-search-btn';
    btn.textContent = 'Suchen';
    btn.addEventListener('click', applyFilters);
    searchContainer.appendChild(btn);
  }

  /* ── 2. Map banner ──────────────────────────────────────── */
  const searchWrapper = document.querySelector('.search-bar-wrapper');
  const mapBanner = document.createElement('div');
  mapBanner.className = 'de-map-banner';

  const dormMap = document.getElementById('dormMap');
  if (dormMap) {
    mapBanner.appendChild(dormMap);
    if (searchWrapper && searchWrapper.nextSibling) {
      searchWrapper.parentNode.insertBefore(mapBanner, searchWrapper.nextSibling);
    }
    setTimeout(() => { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 100);
  }

  /* ── 3. Results bar ─────────────────────────────────────── */
  const resultsBar = document.createElement('div');
  resultsBar.className = 'de-results-bar';

  const resultCount = document.getElementById('resultCount');
  const countClone = resultCount ? resultCount.cloneNode(true) : document.createElement('span');
  countClone.id = 'resultCount';
  if (resultCount) resultCount.id = 'resultCount-old';
  countClone.className = 'de-results-count';

  const sortWrap = document.createElement('div');
  sortWrap.innerHTML = `
    <span style="font-size:0.82rem;color:#6c757d;">Sortieren nach:</span>
    <select class="de-sort-select">
      <option>Empfohlen</option>
      <option>Preis: niedrig bis hoch</option>
      <option>Preis: hoch bis niedrig</option>
      <option>Bewertung</option>
    </select>`;

  resultsBar.appendChild(countClone);
  resultsBar.appendChild(sortWrap);
  mapBanner.insertAdjacentElement('afterend', resultsBar);

  /* ── 4. Main layout ─────────────────────────────────────── */
  const deLayout = document.createElement('div');
  deLayout.className = 'de-layout';

  /* ── 5. Sidebar ─────────────────────────────────────────── */
  const sidebar = document.createElement('aside');
  sidebar.className = 'de-sidebar';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'de-filter-reset';
  resetBtn.textContent = '✕ Filter zurücksetzen';
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.de-filter-check, .filter-check').forEach(cb => cb.checked = false);
    applyFilters();
  });
  sidebar.appendChild(resetBtn);

  const dropdowns = document.querySelectorAll('.filter-bar-wrapper .dropdown');
  dropdowns.forEach(dropdown => {
    const titleEl = dropdown.querySelector('.filter-pill');
    const items   = dropdown.querySelectorAll('.dropdown-item');
    if (!titleEl || !items.length) return;

    const section = document.createElement('div');
    section.className = 'de-filter-section';

    const header = document.createElement('div');
    header.className = 'de-filter-header';
    header.innerHTML = `${titleEl.textContent.trim()} <span class="de-chevron">▾</span>`;
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const collapsed = body.style.display === 'none';
      body.style.display = collapsed ? 'block' : 'none';
      header.classList.toggle('collapsed', !collapsed);
    });

    const body = document.createElement('div');
    body.className = 'de-filter-body';

    items.forEach(item => {
      const checkbox  = item.querySelector('input[type="checkbox"]');
      const labelText = item.textContent.trim();
      if (!checkbox) return;

      const row = document.createElement('label');
      row.className = 'de-filter-item';
      row.innerHTML = `
        <div class="de-filter-left">
          <input type="checkbox" class="de-filter-check filter-check" value="${checkbox.value}">
          <span class="de-filter-label">${labelText}</span>
        </div>`;

      const newCb = row.querySelector('input');
      newCb.addEventListener('change', () => {
        checkbox.checked = newCb.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        applyFilters();
      });
      body.appendChild(row);
    });

    section.appendChild(header);
    section.appendChild(body);
    sidebar.appendChild(section);
  });

  deLayout.appendChild(sidebar);

  /* ── 6. Horizontal cards ────────────────────────────────── */
  const deListings = document.createElement('div');
  deListings.className = 'de-listings';

  const dormItems = document.querySelectorAll('.dorm-item');
  dormItems.forEach((item, i) => {
    const card = item.querySelector('.listing-card');
    if (!card) return;

    const img     = card.querySelector('.card-image img');
    const badge   = card.querySelector('.badge');
    const title   = card.querySelector('.card-content h5');
    const address = card.querySelector('.card-content .small');
    const tags    = card.querySelectorAll('.amenity-tag');
    const score   = card.querySelector('.rating-score');
    const label   = card.querySelector('.rating-label');
    const reviews = card.querySelector('.rating-reviews');
    const price   = card.querySelector('.price-amount');
    const per     = card.querySelector('.price-per');

    const tagHTML = Array.from(tags).map(t => `<span class="de-hcard-tag">${t.textContent.trim()}</span>`).join('');

    const wrapper = document.createElement('div');
    wrapper.className = 'de-hcard-wrapper dorm-item';
    Array.from(item.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) wrapper.setAttribute(attr.name, attr.value);
    });

    wrapper.innerHTML = `
      <div class="de-hcard">
        <div class="de-hcard-img">
          <span class="de-badge">${badge ? badge.textContent.trim() : ''}</span>
          <img src="${img ? img.src : ''}" alt="${title ? title.textContent.trim() : ''}">
        </div>
        <div class="de-hcard-body">
          <div>
            <div class="de-hcard-title">${title ? title.textContent.trim() : ''}</div>
            <div class="de-hcard-address">📍 ${address ? address.textContent.replace('📍','').trim() : ''}</div>
            <div class="de-hcard-tags">${tagHTML}</div>
          </div>
          <div class="de-hcard-rating">
            <span class="de-rating-score">${score ? score.textContent.trim() : ''}</span>
            <span class="de-rating-label">${label ? label.textContent.trim() : ''}</span>
            <span class="de-rating-reviews">${reviews ? reviews.textContent.trim() : ''}</span>
          </div>
        </div>
        <div class="de-hcard-aside">
          <div>
            <span class="de-price-from">Ab</span>
            <span class="de-price-amount">${price ? price.textContent.trim() : ''}</span>
            <span class="de-price-per">${per ? per.textContent.trim() : ''}</span>
            <span class="de-deal-badge">✓ Bestes Angebot</span>
          </div>
          <button class="de-view-btn">Angebot ansehen →</button>
        </div>
      </div>`;

    wrapper.addEventListener('mouseenter', () => {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
      wrapper.querySelector('.de-hcard').style.borderColor = '#212529';
    });
    wrapper.addEventListener('mouseleave', () => {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
      wrapper.querySelector('.de-hcard').style.borderColor = '';
    });

    deListings.appendChild(wrapper);
    item.style.display = 'none';
  });

  deLayout.appendChild(deListings);
  resultsBar.insertAdjacentElement('afterend', deLayout);

  /* ── 7. Sync filter visibility to DE cards ──────────────── */
  const observer = new MutationObserver(() => {
    dormItems.forEach((item, i) => {
      const wrapper = deListings.querySelectorAll('.de-hcard-wrapper')[i];
      if (wrapper) {
        wrapper.style.setProperty(
          'display',
          item.style.display === 'none' ? 'none' : 'block',
          'important'
        );
      }
    });
    const oldCount = document.getElementById('resultCount-old');
    if (oldCount) countClone.textContent = oldCount.textContent;
  });

  dormItems.forEach(item => {
    observer.observe(item, { attributes: true, attributeFilter: ['style'] });
  });

});