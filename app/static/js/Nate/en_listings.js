/**
 * FILE: en_listings.js
 * AUTHOR: Nate
 * English locale — Booking.com style layout
 * Includes filtering (with university + distance), search,
 * map centering on hover, and layout rebuild.
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
    var activeUnis      = getChecked(['uni-tcd', 'uni-ucd', 'uni-tud', 'uni-dcu']);
    var activeDists     = getChecked(['dist-1', 'dist-2', 'dist-5']);
    var activeAmenities = getChecked(['wifi', 'bills', 'furnished', 'parking']);

    var visibleCount = 0;

    dorms.forEach(function (dorm) {
      var name      = (dorm.getAttribute('data-name')       || '').toLowerCase();
      var address   = (dorm.getAttribute('data-address')    || '').toLowerCase();
      var type      = (dorm.getAttribute('data-type')       || '');
      var price     = parseInt(dorm.getAttribute('data-price') || '0', 10);
      var amenities = (dorm.getAttribute('data-amenities')  || '').toLowerCase().split(',');
      var uni       = (dorm.getAttribute('data-university') || '').toLowerCase();
      var dist      = parseFloat(dorm.getAttribute('data-distance') || '99');

      var matchesSearch    = !query || name.includes(query) || address.includes(query);
      var matchesType      = activeTypes.length === 0 || activeTypes.includes(type);
      var matchesPrice     = activePrices.length === 0 || activePrices.some(function (r) {
        if (r === 'budget')  return price < 800;
        if (r === 'mid')     return price >= 800 && price <= 1000;
        if (r === 'premium') return price > 1000;
        return true;
      });
      var matchesLocation  = activeLocations.length === 0 ||
        activeLocations.some(function (l) { return address.includes(l); });
      var matchesUni       = activeUnis.length === 0 ||
        activeUnis.some(function (u) { return ('uni-' + uni) === u; });
      var matchesDist      = activeDists.length === 0 ||
        activeDists.some(function (d) {
          if (d === 'dist-1') return dist < 1;
          if (d === 'dist-2') return dist < 2;
          if (d === 'dist-5') return dist < 5;
          return true;
        });
      var matchesAmenities = activeAmenities.length === 0 ||
        activeAmenities.every(function (a) { return amenities.includes(a); });

      var visible = matchesSearch && matchesType && matchesPrice &&
                    matchesLocation && matchesUni && matchesDist && matchesAmenities;

      dorm.style.setProperty('display', visible ? 'block' : 'none', 'important');
      if (visible) visibleCount++;
    });

    var countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = visibleCount + ' properties found';
  }

  function getChecked(knownValues) {
    var checked = [];
    document.querySelectorAll('.filter-check:checked').forEach(function (cb) {
      if (knownValues.indexOf(cb.value) !== -1) checked.push(cb.value);
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
     LAYOUT — Booking.com style
  ══════════════════════════════════════════════════════════ */

  /* ── 1. Search button ───────────────────────────────────── */
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const btn = document.createElement('button');
    btn.className = 'en-search-btn';
    btn.textContent = 'Search';
    btn.addEventListener('click', applyFilters);
    searchContainer.appendChild(btn);
  }

  /* ── 2. Results bar ─────────────────────────────────────── */
  const searchWrapper = document.querySelector('.search-bar-wrapper');
  const resultsBar = document.createElement('div');
  resultsBar.className = 'en-results-bar';

  const origCount = document.getElementById('resultCount');
  const countDisplay = document.createElement('span');
  countDisplay.className = 'en-results-count';
  countDisplay.id = 'resultCount';
  if (origCount) {
    countDisplay.textContent = origCount.textContent;
    origCount.id = 'resultCount-old';
  }

  const sortWrap = document.createElement('div');
  sortWrap.className = 'en-sort-wrap';
  sortWrap.innerHTML = `
    <span>Sort by:</span>
    <select class="en-sort-select">
      <option>Our top picks</option>
      <option>Price: low to high</option>
      <option>Price: high to low</option>
      <option>Best rating</option>
      <option>Distance to university</option>
    </select>`;

  resultsBar.appendChild(countDisplay);
  resultsBar.appendChild(sortWrap);
  if (searchWrapper && searchWrapper.nextSibling) {
    searchWrapper.parentNode.insertBefore(resultsBar, searchWrapper.nextSibling);
  }

  /* ── 3. Main layout ─────────────────────────────────────── */
  const enLayout = document.createElement('div');
  enLayout.className = 'en-layout';

  /* ── 4. Sidebar ─────────────────────────────────────────── */
  const sidebar = document.createElement('aside');
  sidebar.className = 'en-sidebar';

  // Map thumbnail
  const mapThumb = document.createElement('div');
  mapThumb.className = 'en-map-thumb';
  const dormMap = document.getElementById('dormMap');
  if (dormMap) {
    mapThumb.appendChild(dormMap);
    setTimeout(() => { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 150);
  }
  const mapOverlay = document.createElement('div');
  mapOverlay.className = 'en-map-thumb-overlay';
  mapOverlay.textContent = '📍 Show on map';
  mapThumb.appendChild(mapOverlay);
  sidebar.appendChild(mapThumb);

  // Filter groups — pull translated labels from hidden filter bar
  const filterGroups = [
    { title: 'Property Type', items: [
        { label: 'Apartment', value: 'Apartment', count: '(1)' },
        { label: 'Studio',    value: 'Studio',    count: '(2)' },
        { label: 'Room',      value: 'Room',      count: '(1)' }
    ]},
    { title: 'Price Range', items: [
        { label: 'Under €800',   value: 'budget',  count: '(1)' },
        { label: '€800 – €1000', value: 'mid',     count: '(2)' },
        { label: 'Over €1000',   value: 'premium', count: '(1)' }
    ]},
    { title: 'Location', items: [
        { label: 'Dublin 1',      value: 'dublin 1',      count: '(1)' },
        { label: 'Dublin 2',      value: 'dublin 2',      count: '(1)' },
        { label: 'Dublin 6',      value: 'dublin 6',      count: '(1)' },
        { label: 'Dun Laoghaire', value: 'dun laoghaire', count: '(1)' }
    ]},
    { title: 'University', items: [
        { label: 'Trinity College Dublin',    value: 'uni-tcd', count: '(2)' },
        { label: 'University College Dublin', value: 'uni-ucd', count: '(1)' },
        { label: 'TU Dublin',                 value: 'uni-tud', count: '(1)' },
        { label: 'Dublin City University',    value: 'uni-dcu', count: '(0)' }
    ]},
    { title: 'Distance', items: [
        { label: 'Under 1 km', value: 'dist-1', count: '(1)' },
        { label: 'Under 2 km', value: 'dist-2', count: '(2)' },
        { label: 'Under 5 km', value: 'dist-5', count: '(4)' }
    ]},
    { title: 'Amenities', items: [
        { label: 'WiFi',           value: 'wifi',      count: '' },
        { label: 'Bills Included', value: 'bills',     count: '' },
        { label: 'Furnished',      value: 'furnished', count: '' },
        { label: 'Parking',        value: 'parking',   count: '' }
    ]}
  ];

  // Pull translated labels from hidden filter bar dropdowns
  const origDropdowns = document.querySelectorAll('.filter-bar-wrapper .dropdown');
  origDropdowns.forEach((dd, gi) => {
    if (!filterGroups[gi]) return;
    const titleEl = dd.querySelector('.filter-pill');
    if (titleEl) filterGroups[gi].title = titleEl.textContent.trim();
    dd.querySelectorAll('.dropdown-item').forEach((item, ii) => {
      if (filterGroups[gi].items[ii]) {
        const text = item.textContent.trim();
        if (text) filterGroups[gi].items[ii].label = text;
      }
    });
  });

  filterGroups.forEach(group => {
    const section = document.createElement('div');
    section.className = 'en-filter-section';

    const header = document.createElement('div');
    header.className = 'en-filter-header';
    header.innerHTML = `${group.title} <span class="en-chevron">▾</span>`;
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isCollapsed = body.style.display === 'none';
      body.style.display = isCollapsed ? 'block' : 'none';
      header.classList.toggle('collapsed', !isCollapsed);
    });

    const body = document.createElement('div');
    body.className = 'en-filter-body';

    group.items.forEach(item => {
      const row = document.createElement('label');
      row.className = 'en-filter-item';
      row.innerHTML = `
        <div class="en-filter-left">
          <input type="checkbox" class="en-filter-check filter-check" value="${item.value}">
          <span class="en-filter-label">${item.label}</span>
        </div>
        <span class="en-filter-count">${item.count}</span>`;

      const newCb = row.querySelector('input');
      const origCb = document.querySelector(`.filter-bar-wrapper input[value="${item.value}"]`);
      if (origCb) {
        newCb.addEventListener('change', () => {
          origCb.checked = newCb.checked;
          origCb.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      newCb.addEventListener('change', applyFilters);
      body.appendChild(row);
    });

    section.appendChild(header);
    section.appendChild(body);
    sidebar.appendChild(section);
  });

  const clearBtn = document.createElement('button');
  clearBtn.className = 'en-filter-reset';
  clearBtn.textContent = '✕ Clear all filters';
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.en-filter-check, .filter-check').forEach(cb => cb.checked = false);
    applyFilters();
  });
  sidebar.appendChild(clearBtn);
  enLayout.appendChild(sidebar);

  /* ── 5. Card grid ───────────────────────────────────────── */
  const enGrid = document.createElement('div');
  enGrid.className = 'en-grid';

  const dormItems = document.querySelectorAll('.dorm-item');
  dormItems.forEach((item, i) => {
    const card    = item.querySelector('.listing-card');
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
    const distBadge = card.querySelector('.distance-badge');

    const amenitiesHTML = Array.from(tags).map(t => `<li>${t.textContent.trim()}</li>`).join('');

    const wrapper = document.createElement('div');
    wrapper.className = 'en-card-wrapper dorm-item';
    Array.from(item.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) wrapper.setAttribute(attr.name, attr.value);
    });

    wrapper.innerHTML = `
      <div class="en-card">
        <div class="en-card-img">
          <span class="en-card-badge">${badge ? badge.textContent.trim() : ''}</span>
          <button class="en-card-heart" aria-label="Save">♡</button>
          <img src="${img ? img.src : ''}" alt="${title ? title.textContent.trim() : ''}">
        </div>
        <div class="en-card-body">
          <span class="en-card-title">${title ? title.textContent.trim() : ''}</span>
          <div class="en-card-address">📍 ${address ? address.textContent.replace('📍','').trim() : ''}</div>
          ${distBadge ? `<div class="en-distance-badge">${distBadge.innerHTML}</div>` : ''}
          <div class="en-card-rating">
            <span class="en-rating-score">${score ? score.textContent.trim() : ''}</span>
            <span class="en-rating-label">${label ? label.textContent.trim() : ''}</span>
            <span class="en-rating-reviews"> · ${reviews ? reviews.textContent.trim() : ''}</span>
          </div>
          <ul class="en-card-amenities">${amenitiesHTML}</ul>
        </div>
        <div class="en-card-footer">
          <div class="en-price-block">
            <span class="en-price-from">From</span>
            <span class="en-price-amount">${price ? price.textContent.trim() : ''}</span>
            <span class="en-price-per">${per ? per.textContent.trim() : ''}</span>
          </div>
          <button class="en-view-btn">Show prices</button>
        </div>
      </div>`;

    const heart = wrapper.querySelector('.en-card-heart');
    heart.addEventListener('click', e => {
      e.stopPropagation();
      heart.classList.toggle('liked');
      heart.textContent = heart.classList.contains('liked') ? '♥' : '♡';
    });

    wrapper.addEventListener('mouseenter', () => {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
      wrapper.querySelector('.en-card').style.borderColor = '#0d6efd';
    });
    wrapper.addEventListener('mouseleave', () => {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
      wrapper.querySelector('.en-card').style.borderColor = '';
    });

    enGrid.appendChild(wrapper);
    item.style.display = 'none';
  });

  enLayout.appendChild(enGrid);
  resultsBar.insertAdjacentElement('afterend', enLayout);

  /* ── 6. Sync filter visibility to EN cards ──────────────── */
  const observer = new MutationObserver(() => {
    dormItems.forEach((item, i) => {
      const wrapper = enGrid.querySelectorAll('.en-card-wrapper')[i];
      if (wrapper) {
        wrapper.style.setProperty(
          'display',
          item.style.display === 'none' ? 'none' : 'block',
          'important'
        );
      }
    });
    const oldCount = document.getElementById('resultCount-old');
    if (oldCount) countDisplay.textContent = oldCount.textContent;
  });

  dormItems.forEach(item => {
    observer.observe(item, { attributes: true, attributeFilter: ['style'] });
  });

});