/**
 * FILE:    en_listings.js
 * AUTHOR:  Nathaniel Christian Dedumo (C24516069)
 * PAGE:    Dormitory Listings — English Locale
 *
 * LAYOUT:  Booking.com-inspired 3-column card grid with left sidebar.
 *          Neutral blue palette (#0d6efd), familiar EN/Irish conventions.
 *          No strong cultural dimension targeting — this is the baseline
 *          "comfort zone" layout for English-speaking Irish/international users.
 *
 * CULTURAL DESIGN NOTES:
 *   - Sidebar filter panel mirrors Booking.com's familiar pattern — reduces
 *     cognitive load for EN users who already know this convention.
 *   - Map sits in a sidebar thumbnail — visible but not dominant.
 *     Hypothesis 1: hover-to-centre gives geographic feedback without
 *     overwhelming the card browsing experience.
 *   - Heart save button: low-commitment interaction — user can shortlist
 *     without pressure (supports Low UA exploratory behaviour too).
 *   - "Show prices" → "View dorm" CTA: clear next-step label (Hypothesis 1).
 *
 * PRE-FILTER: Reads window._preFilter set by listings.html from Flask URL
 *   params (?uni= ?type= ?search=) — allows index page carousel and search
 *   form to pre-apply filters when navigating to listings.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── FILTER & SEARCH ENGINE ───────────────────────────────────────────────
     Multi-criteria filter reads data-* attributes on each .dorm-item.
     Supports: property type, price range, location, university, distance,
     amenities, and free-text search.
     All filter logic runs client-side — no server round-trips needed.
     Hypothesis 2: university + distance filters give Karl precise matching
     without having to scroll through irrelevant listings. */

  var searchInput = document.getElementById('searchInput');

  function applyFilters() {
    var dorms    = document.querySelectorAll('.dorm-item');
    var query    = searchInput ? searchInput.value.toLowerCase() : '';
    var types    = getChecked(['En-Suite', 'Studio', 'Shared']);
    var prices   = getChecked(['budget', 'mid', 'premium']);
    var locs     = getChecked(['dublin 1', 'dublin 2', 'dublin 4', 'dublin 6', 'dublin 8', 'dublin 9', 'dun laoghaire']);
    var unis     = getChecked(['uni-tcd', 'uni-ucd', 'uni-tud', 'uni-dcu']);
    var dists    = getChecked(['dist-1', 'dist-2', 'dist-5']);
    var amenities= getChecked(['wifi', 'bills', 'furnished', 'parking']);
    var visible  = 0;

    dorms.forEach(function (d) {
      var name  = (d.getAttribute('data-name')      || '').toLowerCase();
      var addr  = (d.getAttribute('data-address')   || '').toLowerCase();
      var type  =  d.getAttribute('data-type')      || '';
      var price = parseInt(d.getAttribute('data-price') || '0', 10);
      var amen  = (d.getAttribute('data-amenities') || '').toLowerCase().split(',');
      var uni   = (d.getAttribute('data-university')|| '').toLowerCase();
      var dist  = parseFloat(d.getAttribute('data-distance') || '99');

      /* All active filters must pass — AND logic ensures Karl gets
         precise matches, not a broad noisy results set (Hypothesis 2) */
      var ok =
        (!query || name.includes(query) || addr.includes(query)) &&
        (types.length  === 0 || types.indexOf(type) !== -1) &&
        (prices.length === 0 || prices.some(function (r) {
          /* Price buckets: budget <€800, mid €800–€1000, premium >€1000 */
          return r === 'budget' ? price < 800 : r === 'mid' ? price >= 800 && price <= 1000 : price > 1000;
        })) &&
        (locs.length   === 0 || locs.some(function (l) { return addr.includes(l); })) &&
        /* University filter: 'uni-tcd' matches data-university="tcd" */
        (unis.length   === 0 || unis.some(function (u) { return ('uni-' + uni) === u; })) &&
        (dists.length  === 0 || dists.some(function (x) {
          /* Distance buckets in km — Hypothesis 2: Karl needs exact proximity */
          return x === 'dist-1' ? dist < 1 : x === 'dist-2' ? dist < 2 : dist < 5;
        })) &&
        (amenities.length === 0 || amenities.every(function (a) { return amen.indexOf(a) !== -1; }));

      d.style.setProperty('display', ok ? 'block' : 'none', 'important');
      if (ok) visible++;
    });

    /* Update result count display — clear feedback on how many listings match */
    var c = document.getElementById('resultCount');
    if (c) c.textContent = visible + ' properties found';
  }

  function getChecked(vals) {
    var out = [];
    document.querySelectorAll('.filter-check:checked').forEach(function (cb) {
      if (vals.indexOf(cb.value) !== -1) out.push(cb.value);
    });
    return out;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  document.querySelectorAll('.filter-check').forEach(function (cb) {
    cb.addEventListener('change', applyFilters);
  });

  /* Global reset — clears all filters and search, restores full listing */
  window.resetFilters = function () {
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-check').forEach(function (cb) { cb.checked = false; });
    applyFilters();
  };

  /* ── PRE-FILTER FROM INDEX PAGE ───────────────────────────────────────────
     Reads window._preFilter injected by listings.html from Flask URL params.
     Ticks the matching checkboxes and runs applyFilters() so the user lands
     on an already-filtered view when coming from the homepage carousel. */
  function applyPreFilters() {
    var pf = window._preFilter || {};
    if (pf.uni && pf.uni !== '') {
      /* Match 'tcd' → checkbox value 'uni-tcd' */
      var cb = document.querySelector('.filter-check[value="uni-' + pf.uni + '"]');
      if (cb) cb.checked = true;
    }
    if (pf.type && pf.type !== '') {
      var cb2 = document.querySelector('.filter-check[value="' + pf.type + '"]');
      if (cb2) cb2.checked = true;
    }
    if (pf.search && pf.search !== '') {
      var si = document.getElementById('searchInput');
      if (si) si.value = pf.search;
    }
    if (pf.uni || pf.type || pf.search) applyFilters();
  }

  /* ── LAYOUT — BOOKING.COM STYLE ───────────────────────────────────────────
     The base HTML (listings.html) is rebuilt into a Booking.com-inspired
     3-column grid with a left sidebar. EN CSS hides the original
     .listings-map-wrapper (display:none !important) and this JS
     constructs the new layout from scratch. */

  /* Yellow search button — EN brand accent, familiar Booking.com pattern */
  var sc = document.querySelector('.search-container');
  if (sc) {
    var btn = document.createElement('button');
    btn.className = 'en-search-btn';
    btn.textContent = 'Search';
    btn.addEventListener('click', applyFilters);
    sc.appendChild(btn);
  }

  /* Results bar: count + sort dropdown — clear feedback on current results
     Hypothesis 1: user always knows how many results match their criteria */
  var sw = document.querySelector('.search-bar-wrapper');
  var rb = document.createElement('div'); rb.className = 'en-results-bar';
  var oc = document.getElementById('resultCount');
  var cd = document.createElement('span'); cd.className = 'en-results-count'; cd.id = 'resultCount';
  if (oc) { cd.textContent = oc.textContent; oc.id = 'resultCount-old'; }
  var sv = document.createElement('div'); sv.className = 'en-sort-wrap';
  sv.innerHTML = '<span>Sort by:</span><select class="en-sort-select"><option>Our top picks</option><option>Price: low to high</option><option>Price: high to low</option><option>Best rating</option><option>Distance to university</option></select>';
  rb.appendChild(cd); rb.appendChild(sv);
  if (sw && sw.nextSibling) sw.parentNode.insertBefore(rb, sw.nextSibling);

  var enLayout = document.createElement('div'); enLayout.className = 'en-layout';
  var sidebar  = document.createElement('aside'); sidebar.className = 'en-sidebar';

  /* ── MAP THUMBNAIL IN SIDEBAR ─────────────────────────────────────────────
     Moves #dormMap into a small sidebar thumbnail.
     Hypothesis 1: map is always visible but not dominant — user can see
     geographic context while browsing cards. invalidateSize() forces Leaflet
     to recalculate tile dimensions after the DOM move (fixes grey map). */
  var mt = document.createElement('div'); mt.className = 'en-map-thumb';
  var dm = document.getElementById('dormMap');
  if (dm) {
    mt.appendChild(dm);
    setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 300);
    setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 800);
  }
  var mo = document.createElement('div'); mo.className = 'en-map-thumb-overlay'; mo.textContent = '📍 Show on map';
  mt.appendChild(mo); sidebar.appendChild(mt);

  /* ── SIDEBAR FILTER GROUPS ────────────────────────────────────────────────
     Collapsible filter sections mirror Booking.com's familiar sidebar.
     Labels are pulled from the hidden filter bar to respect Babel translations.
     Counts show how many listings match each option (social proof / guidance). */
  var filterGroups = [
    { title: 'Property Type', items: [
      { label: 'En-Suite', value: 'En-Suite', count: '(6)' },
      { label: 'Studio',   value: 'Studio',   count: '(5)' },
      { label: 'Shared',   value: 'Shared',   count: '(5)' }
    ]},
    { title: 'Price Range', items: [
      { label: 'Under €800',   value: 'budget',  count: '(4)' },
      { label: '€800 – €1000', value: 'mid',     count: '(9)' },
      { label: 'Over €1000',   value: 'premium', count: '(2)' }
    ]},
    { title: 'Location', items: [
      { label: 'Dublin 1',      value: 'dublin 1',      count: '(3)' },
      { label: 'Dublin 2',      value: 'dublin 2',      count: '(1)' },
      { label: 'Dublin 4',      value: 'dublin 4',      count: '(1)' },
      { label: 'Dublin 6',      value: 'dublin 6',      count: '(2)' },
      { label: 'Dublin 8',      value: 'dublin 8',      count: '(3)' },
      { label: 'Dublin 9',      value: 'dublin 9',      count: '(3)' },
      { label: 'Dun Laoghaire', value: 'dun laoghaire', count: '(1)' }
    ]},
    { title: 'University', items: [
      { label: 'Trinity College Dublin',    value: 'uni-tcd', count: '(5)' },
      { label: 'University College Dublin', value: 'uni-ucd', count: '(2)' },
      { label: 'TU Dublin',                 value: 'uni-tud', count: '(5)' },
      { label: 'Dublin City University',    value: 'uni-dcu', count: '(4)' }
    ]},
    { title: 'Distance', items: [
      { label: 'Under 1 km', value: 'dist-1', count: '(3)' },
      { label: 'Under 2 km', value: 'dist-2', count: '(7)' },
      { label: 'Under 5 km', value: 'dist-5', count: '(16)' }
    ]},
    { title: 'Amenities', items: [
      { label: 'WiFi',           value: 'wifi',      count: '' },
      { label: 'Bills Included', value: 'bills',     count: '' },
      { label: 'Furnished',      value: 'furnished', count: '' },
      { label: 'Parking',        value: 'parking',   count: '' }
    ]}
  ];

  /* Pull translated labels from the hidden Babel filter bar so sidebar
     respects the active locale (Phase 1 Section 6.2 — Flask-Babel) */
  var origDD = document.querySelectorAll('.filter-bar-wrapper .dropdown');
  origDD.forEach(function (dd, gi) {
    if (!filterGroups[gi]) return;
    var te = dd.querySelector('.filter-pill');
    if (te) filterGroups[gi].title = te.textContent.trim();
    dd.querySelectorAll('.dropdown-item').forEach(function (it, ii) {
      if (filterGroups[gi].items[ii]) {
        var tx = it.textContent.trim();
        if (tx) filterGroups[gi].items[ii].label = tx;
      }
    });
  });

  filterGroups.forEach(function (group) {
    var sec = document.createElement('div'); sec.className = 'en-filter-section';
    var hdr = document.createElement('div'); hdr.className = 'en-filter-header';
    hdr.innerHTML = group.title + ' <span class="en-chevron">▾</span>';
    /* Collapsible sections: progressive disclosure — user opens only what
       they need (Hypothesis 3 principle applied to EN layout too) */
    hdr.addEventListener('click', function () {
      var bdy = hdr.nextElementSibling;
      var col = bdy.style.display === 'none';
      bdy.style.display = col ? 'block' : 'none';
      hdr.classList.toggle('collapsed', !col);
    });
    var bdy = document.createElement('div'); bdy.className = 'en-filter-body';
    group.items.forEach(function (item) {
      var row = document.createElement('label'); row.className = 'en-filter-item';
      row.innerHTML = '<div class="en-filter-left"><input type="checkbox" class="en-filter-check filter-check" value="' + item.value + '"><span class="en-filter-label">' + item.label + '</span></div><span class="en-filter-count">' + item.count + '</span>';
      var ncb = row.querySelector('input');
      /* Sync sidebar checkboxes with hidden filter bar so both filter
         systems stay consistent (original bar is hidden by CSS) */
      var ocb = document.querySelector('.filter-bar-wrapper input[value="' + item.value + '"]');
      if (ocb) {
        ncb.addEventListener('change', function () {
          ocb.checked = ncb.checked;
          ocb.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      ncb.addEventListener('change', applyFilters);
      bdy.appendChild(row);
    });
    sec.appendChild(hdr); sec.appendChild(bdy); sidebar.appendChild(sec);
  });

  var clr = document.createElement('button'); clr.className = 'en-filter-reset'; clr.textContent = '✕ Clear all filters';
  clr.addEventListener('click', function () {
    document.querySelectorAll('.en-filter-check, .filter-check').forEach(function (cb) { cb.checked = false; });
    applyFilters();
  });
  sidebar.appendChild(clr);
  enLayout.appendChild(sidebar);

  /* ── CARD GRID ────────────────────────────────────────────────────────────
     Each original .dorm-item is read, its data extracted, and a new EN card
     is built with the Booking.com layout. The original item is hidden.
     Cards are clickable (whole card → /info), title is a link,
     and the heart button saves without navigating. */
  var enGrid = document.createElement('div'); enGrid.className = 'en-grid';
  var dormItems = document.querySelectorAll('.dorm-item');

  dormItems.forEach(function (item, i) {
    var card      = item.querySelector('.listing-card'); if (!card) return;
    var img       = card.querySelector('.card-image img');
    var badge     = card.querySelector('.badge');
    var title     = card.querySelector('.card-content h5');
    var address   = card.querySelector('.card-content .small');
    var tags      = card.querySelectorAll('.amenity-tag');
    var score     = card.querySelector('.rating-score');
    var lbl       = card.querySelector('.rating-label');
    var revs      = card.querySelector('.rating-reviews');
    var price     = card.querySelector('.price-amount');
    var per       = card.querySelector('.price-per');
    var distBadge = card.querySelector('.distance-badge');

    /* Amenity list built as <ul> with tick marks — clear, scannable data
       for EN users familiar with Booking.com-style listing cards */
    var amenHTML = Array.from(tags).map(function (t) { return '<li>' + t.textContent.trim() + '</li>'; }).join('');
    var wrapper  = document.createElement('div');
    wrapper.className  = 'en-card-wrapper dorm-item';
    wrapper.style.cursor = 'pointer';
    /* Copy data-* attributes so filter engine still works on rebuilt cards */
    Array.from(item.attributes).forEach(function (a) {
      if (a.name.startsWith('data-')) wrapper.setAttribute(a.name, a.value);
    });

    wrapper.innerHTML =
      '<div class="en-card">' +
        '<div class="en-card-img">' +
          '<span class="en-card-badge">' + (badge ? badge.textContent.trim() : '') + '</span>' +
          /* Heart button: save/shortlist without navigating — low-commitment action */
          '<button class="en-card-heart" aria-label="Save">♡</button>' +
          '<img src="' + (img ? img.src : '') + '" alt="' + (title ? title.textContent.trim() : '') + '">' +
        '</div>' +
        '<div class="en-card-body">' +
          /* Title as link — clear navigation affordance (Hypothesis 1) */
          '<a href="/info" class="en-card-title">' + (title ? title.textContent.trim() : '') + '</a>' +
          '<div class="en-card-address">📍 ' + (address ? address.textContent.replace('📍', '').trim() : '') + '</div>' +
          (distBadge ? '<div class="en-distance-badge">' + distBadge.innerHTML + '</div>' : '') +
          '<div class="en-card-rating">' +
            /* Rating score badge — social proof signal for all user types */
            '<span class="en-rating-score">' + (score ? score.textContent.trim() : '') + '</span>' +
            '<span class="en-rating-label">' + (lbl   ? lbl.textContent.trim()   : '') + '</span>' +
            /* Review count — Hypothesis 4 social validation for collectivist users */
            '<span class="en-rating-reviews"> · ' + (revs ? revs.textContent.trim() : '') + '</span>' +
          '</div>' +
          '<ul class="en-card-amenities">' + amenHTML + '</ul>' +
        '</div>' +
        '<div class="en-card-footer">' +
          '<div class="en-price-block">' +
            /* "From" pricing — explicit upfront cost, no hidden fees implied */
            '<span class="en-price-from">From</span>' +
            '<span class="en-price-amount">' + (price ? price.textContent.trim() : '') + '</span>' +
            '<span class="en-price-per">'   + (per   ? per.textContent.trim()   : '') + '</span>' +
          '</div>' +
          /* "View dorm" CTA — clear next-step label (Hypothesis 1) */
          '<a href="/info" class="en-view-btn">View dorm</a>' +
        '</div>' +
      '</div>';

    /* Heart toggle — stops click propagation so card doesn't navigate */
    var heart = wrapper.querySelector('.en-card-heart');
    heart.addEventListener('click', function (e) {
      e.stopPropagation();
      heart.classList.toggle('liked');
      heart.textContent = heart.classList.contains('liked') ? '♥' : '♡';
    });

    /* Click anywhere on card (except heart) → navigate to dorm info page */
    wrapper.addEventListener('click', function (e) {
      if (!e.target.closest('.en-card-heart')) window.location.href = '/info';
    });

    /* Hover: map centres on this dorm — Hypothesis 1 geographic feedback */
    wrapper.addEventListener('mouseenter', function () {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
      wrapper.querySelector('.en-card').style.borderColor = '#0d6efd';
    });
    wrapper.addEventListener('mouseleave', function () {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
      wrapper.querySelector('.en-card').style.borderColor = '';
    });

    enGrid.appendChild(wrapper);
    /* Hide original card — rebuilt version above takes its place */
    item.style.display = 'none';
  });

  enLayout.appendChild(enGrid);
  rb.insertAdjacentElement('afterend', enLayout);

  /* ── VISIBILITY SYNC ──────────────────────────────────────────────────────
     MutationObserver watches the original .dorm-item display style changes
     triggered by applyFilters() and mirrors them to the rebuilt EN cards.
     Also syncs the result count from the hidden original span. */
  var observer = new MutationObserver(function () {
    dormItems.forEach(function (item, i) {
      var w = enGrid.querySelectorAll('.en-card-wrapper')[i];
      if (w) w.style.setProperty('display', item.style.display === 'none' ? 'none' : 'block', 'important');
    });
    var oc2 = document.getElementById('resultCount-old');
    if (oc2) cd.textContent = oc2.textContent;
  });
  dormItems.forEach(function (item) { observer.observe(item, { attributes: true, attributeFilter: ['style'] }); });

  /* Apply pre-filters last — after layout is fully built */
  applyPreFilters();
});