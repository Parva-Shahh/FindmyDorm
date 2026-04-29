/**
 * FILE:    zh_listings.js
 * AUTHOR:  Nathaniel Christian Dedumo (C24516069)
 * PAGE:    Dormitory Listings — Chinese Locale
 *
 * LAYOUT:  Cards left / map right split layout (non-linear, high density).
 *          Orange palette (#ff6633) — vibrant, entices exploration.
 *          ZH CSS keeps the original .listings-map-wrapper visible so the
 *          map sits persistently on the right — no DOM rebuild needed.
 *
 * CULTURAL DESIGN RATIONALE:
 *   Targets Low UA + Collectivist users (Wei Chen, PoV 2):
 *
 *   Hypothesis 3 — Progressive Disclosure:
 *     Orange hover ring on cards reveals social context on interaction
 *     rather than displaying everything upfront. Controls information
 *     density in accordance with Miller's Law — reduces cognitive overload.
 *
 *   Hypothesis 4 — Social Proof / Peer Validation:
 *     Review counts are prominently displayed on each card.
 *     "查看宿舍" (View dorm) CTA replaced on cards — localised text
 *     signals cultural authenticity to Chinese users.
 *     Whole card is clickable — exploratory, low-friction interaction.
 *
 *   Map: sits persistently on the right — non-linear layout allows Wei Chen
 *     to explore geography and listings simultaneously without a fixed path.
 *
 * PRE-FILTER: Reads window._preFilter from listings.html (Flask URL params).
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── FILTER & SEARCH ENGINE ───────────────────────────────────────────────
     Same multi-criteria filter logic as EN/DE locales — consistency across
     all three locales ensures feature parity regardless of cultural layout.
     Hypothesis 2: university + distance filters work the same way for Wei Chen
     as for Karl — both need to find dorms near their specific campus. */

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
          return r === 'budget' ? price < 800 : r === 'mid' ? price >= 800 && price <= 1000 : price > 1000;
        })) &&
        (locs.length   === 0 || locs.some(function (l) { return addr.includes(l); })) &&
        (unis.length   === 0 || unis.some(function (u) { return ('uni-' + uni) === u; })) &&
        (dists.length  === 0 || dists.some(function (x) {
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
     Reads window._preFilter set by listings.html from Flask URL params.
     Allows index page university carousel and search form to pre-apply
     filters when Wei Chen navigates from the homepage. */
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
     Orange "搜索" button matches the ZH navbar and brand palette (#ff6633).
     Phase 1 Section 6.3 Colour: vibrant orange entices exploration for
     Low UA users who prefer dynamic, high-energy interfaces. */
  var sc = document.querySelector('.search-container');
  if (sc) {
    var b = document.createElement('button');
    b.className = 'zh-search-btn';
    b.textContent = '搜索'; /* "Search" in Simplified Chinese */
    b.addEventListener('click', applyFilters);
    sc.appendChild(b);
  }

  /* ── CARD INTERACTIONS ────────────────────────────────────────────────────
     ZH layout keeps the original .dorm-item cards from listings.html visible.
     This JS enhances them with:
       — Localised Chinese CTA text ("查看宿舍" = "View dorm")
       — Orange hover ring (Hypothesis 3: progressive disclosure / discovery)
       — Whole card clickable (low-friction exploration for Low UA users)
       — Map popup on hover (geographic context without leaving the list) */
  document.querySelectorAll('.dorm-item').forEach(function (item, i) {
    var card = item.querySelector('.listing-card');

    /* Replace title <h5> with a clickable <a> link — Hypothesis 3:
       exploratory click affordance without requiring user to find a button */
    var titleEl = item.querySelector('.card-content h5');
    if (titleEl) {
      var a = document.createElement('a');
      a.href = '/info';
      a.className = 'zh-card-title-link';
      a.textContent = titleEl.textContent;
      titleEl.replaceWith(a);
    }

    /* Replace "View dorm" button with localised Chinese text.
       Cultural authenticity — Chinese users respond better to native
       language CTAs than English text (Phase 1 Section 6.2). */
    var btn = item.querySelector('.btn-view-deal');
    if (btn) {
      var al = document.createElement('a');
      al.href = '/info';
      al.className = 'btn-view-deal';
      al.textContent = '查看宿舍'; /* "View dorm" in Simplified Chinese */
      btn.replaceWith(al);
    }

    /* Whole card clickable — Low UA users prefer exploratory, low-friction
       interactions rather than needing to find a specific button */
    if (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () { window.location.href = '/info'; });
    }

    /* Orange hover ring: Hypothesis 3 — progressive disclosure signal.
       Interaction reveals social context (map popup) without cluttering
       the default card view. Controls information density. */
    item.addEventListener('mouseenter', function () {
      if (card) {
        card.style.borderColor = '#ff6633'; /* ZH brand orange */
        card.style.boxShadow = '0 0 0 2px rgba(255,102,51,0.2)';
      }
      /* Map popup: geographic feedback — where is this dorm in Dublin?
         Hypothesis 1 principle applied to ZH too — all users benefit
         from knowing location before committing. */
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].openPopup();
    });
    item.addEventListener('mouseleave', function () {
      if (card) { card.style.borderColor = ''; card.style.boxShadow = ''; }
      if (window._dormMarkers && window._dormMarkers[i]) window._dormMarkers[i].closePopup();
    });
  });

  /* Invalidate map size after DOM settles — ZH keeps map in original
     .map-col so it's always visible. Double call ensures Leaflet
     recalculates tile dimensions regardless of render timing. */
  setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 300);
  setTimeout(function () { if (window._dormLeafletMap) window._dormLeafletMap.invalidateSize(); }, 800);

  /* Apply pre-filters last — after card enhancements are complete */
  applyPreFilters();
});