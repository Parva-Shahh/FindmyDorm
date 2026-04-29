/**
 * FILE:    de_listings.js
 * AUTHOR:  Nathaniel Christian Dedumo (C24380561)
 * PAGE:    Dormitory Listings — German Locale
 *
 * LAYOUT:  Trivago-inspired horizontal card list with full-width map banner
 *          and Amazon-style collapsible sidebar filter panel.
 *          Dark charcoal palette (#212529), structured, authoritative.
 *
 * CULTURAL DESIGN RATIONALE:
 *   Targets High UA + Individualist users (Karl, PoV 1):
 *
 *   Hypothesis 1 — Clear Mental Map / Immediate Feedback:
 *     Full-width map banner placed directly below search — Karl sees
 *     ALL dorm locations immediately before browsing any cards.
 *     Map centres on individual dorm on hover — visceral geographic
 *     confirmation before committing. "Entfernung zur Universität"
 *     (distance) shown on every card eliminates ambiguity.
 *     Results count always visible — Karl always knows where he stands.
 *
 *   Hypothesis 2 — Explicit Technical Specifications:
 *     Each card shows the full spec table from listings.html:
 *     room size (m²), distance to university (km), contract length
 *     (weeks), bills included/not. Objective data for Individualist
 *     users who prioritise personal needs over social context.
 *
 *   Verified Badge Colour Deviation:
 *     Green (#198754) used for "Bestes Angebot" deal badge rather than
 *     the Phase 1 blue/grey guideline — provides distinct visceral trust
 *     signalling required for High UA financial security decisions.
 *
 *   Layout deviation from group guidelines:
 *     Horizontal card layout (not vertical grid) — mirrors Trivago.ie
 *     which was the primary reference site for the German user analysis.
 *     Linear top-to-bottom flow suits High UA users who follow a
 *     predictable, step-by-step mental model.
 *
 * PRE-FILTER: Reads window._preFilter from listings.html (Flask URL params).
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── FILTER & SEARCH ENGINE ───────────────────────────────────────────────
     Full multi-criteria filter engine — same logic as EN/ZH for consistency.
     Karl (High UA) will use all available filters to narrow results precisely
     before committing — Hypothesis 2: explicit data-driven decision making. */

  var searchInput = document.getElementById('searchInput');

  function applyFilters() {
    var dorms = document.querySelectorAll('.dorm-item');
    var query = searchInput ? searchInput.value.toLowerCase() : '';
    var types = getChecked(['En-Suite', 'Studio', 'Shared']);
    var prices = getChecked(['budget', 'mid', 'premium']);
    var locs = getChecked(['dublin 1', 'dublin 2', 'dublin 4', 'dublin 6', 'dublin 8', 'dublin 9', 'dun laoghaire']);
    var unis = getChecked(['uni-tcd', 'uni-ucd', 'uni-tud', 'uni-dcu']);
    var dists = getChecked(['dist-1', 'dist-2', 'dist-5']);
    var amens = getChecked(['wifi', 'bills', 'furnished', 'parking']);
    var visible = 0;

    dorms.forEach(function (d) {
      var name  = (d.getAttribute('data-name')       || '').toLowerCase();
      var addr  = (d.getAttribute('data-address')    || '').toLowerCase();
      var type  =  d.getAttribute('data-type')       || '';
      var price = parseInt(d.getAttribute('data-price') || '0', 10);
      var amen  = (d.getAttribute('data-amenities')  || '').toLowerCase().split(',');
      var uni   = (d.getAttribute('data-university') || '').toLowerCase();
      var dist  = parseFloat(d.getAttribute('data-distance') || '99');

      var ok = (!query || name.includes(query) || addr.includes(query)) &&
        (types.length  === 0 || types.indexOf(type) !== -1) &&
        (prices.length === 0 || prices.some(function (r) {
          /* Price buckets: Hypothesis 2 — Karl needs precise price ranges */
          return r === 'budget' ? price < 800 : r === 'mid' ? price >= 800 && price <= 1000 : price > 1000;
        })) &&
        (locs.length   === 0 || locs.some(function (l) { return addr.includes(l); })) &&
        (unis.length   === 0 || unis.some(function (u) { return ('uni-' + uni) === u; })) &&
        (dists.length  === 0 || dists.some(function (x) {
          /* Distance in km — Hypothesis 2: Karl needs exact proximity data */
          return x === 'dist-1' ? dist < 1 : x === 'dist-2' ? dist < 2 : dist < 5;
        })) &&
        (amens.length  === 0 || amens.every(function (a) { return amen.indexOf(a) !== -1; }));

      d.style.setProperty('display', ok ? 'block' : 'none', 'important');
      if (ok) visible++;
    });

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

  window.resetFilters = function () {
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-check').forEach(function (cb) { cb.checked = false; });
    applyFilters();
  };

  /* ── PRE-FILTER FROM INDEX PAGE ───────────────────────────────────────────
     Reads window._preFilter from listings.html (Flask URL params).
     When Karl clicks a university on the index carousel, he lands on
     listings with that university pre-filtered — no extra steps needed.
     Reduces transactional friction for High UA users (Hypothesis 1). */
  function applyPreFilters() {
    var pf = window._preFilter || {};
    if (pf.uni && pf.uni !== '') {
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

  /* ── SEARCH BUTTON ────────────────────────────────────────────────────────
     "Suchen" (Search in German) — charcoal/accent styling matches DE navbar.
     Explicit labelled button — Hypothesis 1: no ambiguity about what action
     the button performs. German users prefer clear, labelled controls. */
  var sc = document.querySelector('.search-container');
  if (sc) {
    var btn = document.createElement('button');
    btn.className = 'de-search-btn';
    btn.textContent = 'Suchen'; /* "Search" in German */
    btn.addEventListener('click', applyFilters);
    sc.appendChild(btn);
  }

  /* ── FULL-WIDTH MAP BANNER ────────────────────────────────────────────────
     Moves #dormMap into a full-width banner directly below the search bar.
     Hypothesis 1: Karl sees ALL dorm locations on the map BEFORE browsing
     any individual card. This gives him the complete geographic mental map
     upfront — eliminates location ambiguity immediately.
     invalidateSize() called at 300ms and 800ms to fix grey map issue
     (Leaflet calculates tile dimensions after DOM move). */
  var sw = document.querySelector('.search-bar-wrapper');
  var mb = document.createElement('div'); mb.className = 'de-map-banner';
  var dm = document.getElementById('dormMap');
  if (dm) {
    mb.appendChild(dm);
    if (sw && sw.nextSibling) sw.parentNode.insertBefore(mb, sw.nextSibling);
    setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 300);
    setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 800);
  }

  /* ── RESULTS BAR ─────────────────────────────────────────────────────────
     Persistent result count + sort dropdown.
     Hypothesis 1: Karl always knows how many listings match his criteria.
     "Sortieren nach: Entfernung zur Universität" — distance sort directly
     addresses Karl's primary filter criterion (Hypothesis 2). */
  var rb = document.createElement('div'); rb.className = 'de-results-bar';
  var rc = document.getElementById('resultCount');
  var cc = rc ? rc.cloneNode(true) : document.createElement('span');
  cc.id = 'resultCount'; if (rc) rc.id = 'resultCount-old'; cc.className = 'de-results-count';
  var sv = document.createElement('div');
  sv.innerHTML = '<span style="font-size:0.82rem;color:#6c757d;">Sortieren nach:</span>' +
    '<select class="de-sort-select">' +
    '<option>Empfohlen</option>' +
    '<option>Preis: niedrig bis hoch</option>' +
    '<option>Preis: hoch bis niedrig</option>' +
    '<option>Bewertung</option>' +
    /* Distance to university sort — Hypothesis 2: Karl's primary criterion */
    '<option>Entfernung zur Universität</option>' +
    '</select>';
  rb.appendChild(cc); rb.appendChild(sv);
  mb.insertAdjacentElement('afterend', rb);

  /* ── MAIN LAYOUT ─────────────────────────────────────────────────────────
     Two-column layout: Amazon-style sidebar (filters) + horizontal card list.
     Linear top-to-bottom flow — Hypothesis 1: predictable structure gives
     Karl the clear mental model he needs to navigate without anxiety. */
  var deLayout = document.createElement('div'); deLayout.className = 'de-layout';

  /* ── AMAZON-STYLE SIDEBAR ─────────────────────────────────────────────────
     Built from the existing hidden filter bar dropdowns.
     Collapsible sections with labelled checkboxes — explicit, structured.
     Hypothesis 1: filter categories are clearly labelled and grouped,
     reducing ambiguity about what each filter does. */
  var sidebar = document.createElement('aside'); sidebar.className = 'de-sidebar';
  var rst = document.createElement('button'); rst.className = 'de-filter-reset';
  rst.textContent = '✕ Filter zurücksetzen'; /* "Reset filters" in German */
  rst.addEventListener('click', function () {
    document.querySelectorAll('.de-filter-check, .filter-check').forEach(function (cb) { cb.checked = false; });
    applyFilters();
  });
  sidebar.appendChild(rst);

  /* Build sidebar sections from existing Babel-translated filter dropdowns.
     This preserves translations without duplicating strings. */
  document.querySelectorAll('.filter-bar-wrapper .dropdown').forEach(function (dd) {
    var te = dd.querySelector('.filter-pill');
    var items = dd.querySelectorAll('.dropdown-item');
    if (!te || !items.length) return;

    var sec = document.createElement('div'); sec.className = 'de-filter-section';
    var hdr = document.createElement('div'); hdr.className = 'de-filter-header';
    hdr.innerHTML = te.textContent.trim() + ' <span class="de-chevron">▾</span>';
    /* Collapsible headers — user opens only relevant filter groups.
       Reduces visual noise for High UA users who prefer structured clarity. */
    hdr.addEventListener('click', function () {
      var bdy = hdr.nextElementSibling;
      var col = bdy.style.display === 'none';
      bdy.style.display = col ? 'block' : 'none';
      hdr.classList.toggle('collapsed', !col);
    });

    var bdy = document.createElement('div'); bdy.className = 'de-filter-body';
    items.forEach(function (it) {
      var cb = it.querySelector('input[type="checkbox"]'); if (!cb) return;
      var row = document.createElement('label'); row.className = 'de-filter-item';
      row.innerHTML = '<div class="de-filter-left"><input type="checkbox" class="de-filter-check filter-check" value="' + cb.value + '"><span class="de-filter-label">' + it.textContent.trim() + '</span></div>';
      var ncb = row.querySelector('input');
      /* Sync new sidebar checkbox with original hidden checkbox and trigger filter */
      ncb.addEventListener('change', function () {
        cb.checked = ncb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        applyFilters();
      });
      bdy.appendChild(row);
    });
    sec.appendChild(hdr); sec.appendChild(bdy); sidebar.appendChild(sec);
  });
  deLayout.appendChild(sidebar);

  /* ── HORIZONTAL CARD LIST ─────────────────────────────────────────────────
     Each .dorm-item is rebuilt as a horizontal card (image | body | aside).
     Mirrors Trivago's layout — the reference site for German user analysis.
     Hypothesis 2: body contains the full spec table from listings.html;
     aside contains explicit pricing and the "Unterkunft ansehen" CTA.
     Linear, top-to-bottom list flow — Hypothesis 1: predictable ordering. */
  var deListings = document.createElement('div'); deListings.className = 'de-listings';
  var dormItems = document.querySelectorAll('.dorm-item');

  dormItems.forEach(function (item, i) {
    var card = item.querySelector('.listing-card'); if (!card) return;
    var img     = card.querySelector('.card-image img');
    var badge   = card.querySelector('.badge');
    var title   = card.querySelector('.card-content h5');
    var address = card.querySelector('.card-content .small');
    var score   = card.querySelector('.rating-score');
    var lbl     = card.querySelector('.rating-label');
    var revs    = card.querySelector('.rating-reviews');
    var price   = card.querySelector('.price-amount');
    var per     = card.querySelector('.price-per');

    /* Extract spec table from listings.html DE block.
       Hypothesis 2: room size, distance, contract, bills displayed explicitly. */
    var specs = card.querySelector('.de-card-specs');
    var specsHTML = specs ? specs.outerHTML.replace('de-card-specs', 'de-specs') : '';

    var dist = item.getAttribute('data-distance') || '';

    /* Amenity tags translated to German for cultural authenticity */
    var amenStr = item.getAttribute('data-amenities') || '';
    var tagHTML = amenStr.split(',').filter(Boolean).map(function (a) {
      var l = { wifi: 'WiFi', bills: 'Nebenkosten inkl.', furnished: 'Möbliert', parking: 'Parkplatz' };
      return '<span class="de-hcard-tag">' + (l[a.trim()] || a) + '</span>';
    }).join('');

    var wrapper = document.createElement('div');
    wrapper.className = 'de-hcard-wrapper dorm-item';
    wrapper.style.cursor = 'pointer';
    /* Copy data-* attributes so filter engine works on rebuilt cards */
    Array.from(item.attributes).forEach(function (a) {
      if (a.name.startsWith('data-')) wrapper.setAttribute(a.name, a.value);
    });

    wrapper.innerHTML =
      '<div class="de-hcard">' +
        '<div class="de-hcard-img">' +
          '<span class="de-badge">' + (badge ? badge.textContent.trim() : '') + '</span>' +
          /* Image: DE-locale photography (structured exterior shots) injected
             by listings.html Jinja2 block — individualist "Direct Object" imagery */
          '<img src="' + (img ? img.src : '') + '" alt="' + (title ? title.textContent.trim() : '') + '">' +
        '</div>' +
        '<div class="de-hcard-body">' +
          '<div>' +
            /* Title as link — clear navigation affordance (Hypothesis 1) */
            '<a href="/info" class="de-hcard-title">' + (title ? title.textContent.trim() : '') + '</a>' +
            '<div class="de-hcard-address">📍 ' + (address ? address.textContent.replace('📍', '').trim() : '') + '</div>' +
            /* Distance to university — Hypothesis 2: Karl's primary data point */
            (dist ? '<div class="de-hcard-dist"><i class="fa fa-walking"></i> ' + dist + ' km zur Universität</div>' : '') +
            '<div class="de-hcard-tags">' + tagHTML + '</div>' +
            /* Spec table: Hypothesis 2 — full explicit data for Individualist Karl */
            specsHTML +
          '</div>' +
          '<div class="de-hcard-rating">' +
            '<span class="de-rating-score">' + (score ? score.textContent.trim() : '') + '</span>' +
            '<span class="de-rating-label">' + (lbl ? lbl.textContent.trim() : '') + '</span>' +
            '<span class="de-rating-reviews">' + (revs ? revs.textContent.trim() : '') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="de-hcard-aside">' +
          '<div>' +
            /* Explicit "Ab" (From) pricing — no hidden costs implied.
               Hypothesis 1: transparent pricing reduces transactional anxiety. */
            '<span class="de-price-from">Ab</span>' +
            '<span class="de-price-amount">' + (price ? price.textContent.trim() : '') + '</span>' +
            '<span class="de-price-per">' + (per ? per.textContent.trim() : '') + '</span>' +
            /* Green verified badge — Deviation: green (#198754) used instead of
               Phase 1 blue/grey for visceral trust signalling (High UA Hypothesis 1).
               Green = "Bestes Angebot" (Best Deal) confirms quality. */
            '<span class="de-deal-badge">✓ Bestes Angebot</span>' +
          '</div>' +
          /* "Unterkunft ansehen →" — clear, directional CTA in German.
             Arrow → indicates forward progress — Hypothesis 1 linear navigation. */
          '<a href="/info" class="de-view-btn">Unterkunft ansehen →</a>' +
        '</div>' +
      '</div>';

    /* Click whole card → navigate to dorm info page */
    wrapper.addEventListener('click', function () { window.location.href = '/info'; });

    /* Hover: map centres on this dorm — Hypothesis 1 geographic feedback.
       Karl can verify exact location before clicking through. */
    wrapper.addEventListener('mouseenter', function () {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
      wrapper.querySelector('.de-hcard').style.borderColor = '#212529'; /* DE charcoal */
    });
    wrapper.addEventListener('mouseleave', function () {
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
      wrapper.querySelector('.de-hcard').style.borderColor = '';
    });

    deListings.appendChild(wrapper);
    /* Hide original card — rebuilt version above takes its place */
    item.style.display = 'none';
  });

  deLayout.appendChild(deListings);
  rb.insertAdjacentElement('afterend', deLayout);

  /* ── VISIBILITY SYNC ──────────────────────────────────────────────────────
     MutationObserver mirrors filter visibility changes from original
     .dorm-items to rebuilt DE horizontal cards, and syncs result count. */
  var observer = new MutationObserver(function () {
    dormItems.forEach(function (item, i) {
      var w = deListings.querySelectorAll('.de-hcard-wrapper')[i];
      if (w) w.style.setProperty('display', item.style.display === 'none' ? 'none' : 'block', 'important');
    });
    var oc2 = document.getElementById('resultCount-old');
    if (oc2) cc.textContent = oc2.textContent;
  });
  dormItems.forEach(function (item) { observer.observe(item, { attributes: true, attributeFilter: ['style'] }); });

  /* Apply pre-filters last — after full layout is built */
  applyPreFilters();
});