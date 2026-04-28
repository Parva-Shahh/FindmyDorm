/**
 * FILE: de_listings.js
 * AUTHOR: Nate
 * German locale — Trivago-inspired layout
 * Restructures the base listings.html into:
 *   - Full-width search bar with attached button
 *   - Full-width map banner below search
 *   - Results bar with sort dropdown
 *   - Left Amazon-style filter sidebar
 *   - Horizontal listing cards spanning full width
 */

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {

        /* ── 1. Add search button ─────────────────────────────── */
        var searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            var searchBtn = document.createElement('button');
            searchBtn.className = 'de-search-btn';
            searchBtn.textContent = 'Suchen';
            searchContainer.appendChild(searchBtn);
        }

        /* ── 2. Move map to full-width banner below search ─────── */
        var searchWrapper = document.querySelector('.search-bar-wrapper');
        var mapBanner     = document.createElement('div');
        mapBanner.className = 'de-map-banner';

        var dormMap = document.getElementById('dormMap');
        if (dormMap) {
            mapBanner.appendChild(dormMap);
            if (searchWrapper && searchWrapper.nextSibling) {
                searchWrapper.parentNode.insertBefore(mapBanner, searchWrapper.nextSibling);
            }
            setTimeout(function () {
                if (window._dormLeafletMap) {
                    window._dormLeafletMap.invalidateSize();
                }
            }, 150);
        }

        /* ── 3. Results bar ───────────────────────────────────── */
        var resultsBar = document.createElement('div');
        resultsBar.className = 'de-results-bar';

        var origCount    = document.getElementById('resultCount');
        var countDisplay = document.createElement('span');
        countDisplay.className = 'de-results-count';
        countDisplay.id = 'resultCount';
        if (origCount) {
            countDisplay.textContent = origCount.textContent;
            origCount.id = 'resultCount-orig';
        }

        var sortWrap = document.createElement('div');
        sortWrap.innerHTML =
            '<span style="font-size:0.82rem;color:#6c757d;">Sortieren nach:</span>' +
            '<select class="de-sort-select">' +
                '<option>Empfohlen</option>' +
                '<option>Preis: niedrig bis hoch</option>' +
                '<option>Preis: hoch bis niedrig</option>' +
                '<option>Bewertung</option>' +
            '</select>';

        resultsBar.appendChild(countDisplay);
        resultsBar.appendChild(sortWrap);
        mapBanner.insertAdjacentElement('afterend', resultsBar);

        /* ── 4. Main layout wrapper ───────────────────────────── */
        var deLayout = document.createElement('div');
        deLayout.className = 'de-layout';

        /* ── 5. Sidebar — built from existing filter dropdowns ── */
        var sidebar = document.createElement('aside');
        sidebar.className = 'de-sidebar';

        var resetBtn = document.createElement('button');
        resetBtn.className = 'de-filter-reset';
        resetBtn.textContent = '✕ Filter zurücksetzen';
        resetBtn.addEventListener('click', function () {
            document.querySelectorAll('.de-filter-check').forEach(function (cb) {
                cb.checked = false;
            });
            if (window.resetFilters) window.resetFilters();
        });
        sidebar.appendChild(resetBtn);

        // Pull each dropdown from the hidden filter bar
        var origDropdowns = document.querySelectorAll('.filter-bar-wrapper .dropdown');
        origDropdowns.forEach(function (dropdown) {
            var titleEl = dropdown.querySelector('.filter-pill');
            var items   = dropdown.querySelectorAll('.dropdown-item');
            if (!titleEl || !items.length) return;

            var section = document.createElement('div');
            section.className = 'de-filter-section';

            var header = document.createElement('div');
            header.className = 'de-filter-header';
            header.innerHTML = titleEl.textContent.trim() + ' <span class="de-chevron">&#9662;</span>';
            header.addEventListener('click', function () {
                var body        = header.nextElementSibling;
                var isCollapsed = body.style.display === 'none';
                body.style.display = isCollapsed ? 'block' : 'none';
                header.classList.toggle('collapsed', !isCollapsed);
            });

            var body = document.createElement('div');
            body.className = 'de-filter-body';

            items.forEach(function (item) {
                var origCb   = item.querySelector('input[type="checkbox"]');
                var labelTxt = item.textContent.trim();
                if (!origCb) return;

                var row = document.createElement('label');
                row.className = 'de-filter-item';
                row.innerHTML =
                    '<div class="de-filter-left">' +
                        '<input type="checkbox" class="de-filter-check filter-check" value="' + origCb.value + '">' +
                        '<span class="de-filter-label">' + labelTxt + '</span>' +
                    '</div>';

                // Keep original checkbox in sync for filter.js
                var newCb = row.querySelector('input');
                newCb.addEventListener('change', function () {
                    origCb.checked = newCb.checked;
                    origCb.dispatchEvent(new Event('change', { bubbles: true }));
                });

                body.appendChild(row);
            });

            section.appendChild(header);
            section.appendChild(body);
            sidebar.appendChild(section);
        });

        deLayout.appendChild(sidebar);

        /* ── 6. Horizontal listings column ───────────────────── */
        var deListings = document.createElement('div');
        deListings.className = 'de-listings';
        deListings.id = 'listing-grid';

        var dormItems = document.querySelectorAll('.dorm-item');

        dormItems.forEach(function (item, i) {
            var card    = item.querySelector('.listing-card');
            if (!card) return;

            var img     = card.querySelector('.card-image img');
            var badge   = card.querySelector('.badge');
            var title   = card.querySelector('.card-content h5');
            var address = card.querySelector('.card-content .small');
            var tags    = card.querySelectorAll('.amenity-tag');
            var score   = card.querySelector('.rating-score');
            var label   = card.querySelector('.rating-label');
            var reviews = card.querySelector('.rating-reviews');
            var price   = card.querySelector('.price-amount');
            var per     = card.querySelector('.price-per');

            var tagHTML = Array.from(tags).map(function (t) {
                return '<span class="de-hcard-tag">' + t.textContent.trim() + '</span>';
            }).join('');

            var wrapper = document.createElement('div');
            wrapper.className = 'de-hcard-wrapper dorm-item';

            // Copy data attributes for filter.js
            Array.from(item.attributes).forEach(function (attr) {
                if (attr.name.startsWith('data-')) {
                    wrapper.setAttribute(attr.name, attr.value);
                }
            });

            wrapper.innerHTML =
                '<div class="de-hcard">' +
                    '<div class="de-hcard-img">' +
                        '<span class="de-badge">' + (badge ? badge.textContent.trim() : '') + '</span>' +
                        '<img src="' + (img ? img.src : '') + '" alt="' + (title ? title.textContent.trim() : '') + '">' +
                    '</div>' +
                    '<div class="de-hcard-body">' +
                        '<div class="de-hcard-title">' + (title ? title.textContent.trim() : '') + '</div>' +
                        '<div class="de-hcard-address">&#128205; ' + (address ? address.textContent.replace('📍', '').trim() : '') + '</div>' +
                        '<div class="de-hcard-tags">' + tagHTML + '</div>' +
                        '<div class="de-hcard-rating">' +
                            '<span class="de-rating-score">' + (score ? score.textContent.trim() : '') + '</span>' +
                            '<span class="de-rating-label">' + (label ? label.textContent.trim() : '') + '</span>' +
                            '<span class="de-rating-reviews">' + (reviews ? reviews.textContent.trim() : '') + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="de-hcard-aside">' +
                        '<div>' +
                            '<span class="de-price-from">Ab</span>' +
                            '<span class="de-price-amount">' + (price ? price.textContent.trim() : '') + '</span>' +
                            '<span class="de-price-per">' + (per ? per.textContent.trim() : '') + '</span>' +
                            '<span class="de-deal-badge">&#10003; Bestes Angebot</span>' +
                        '</div>' +
                        '<button class="de-view-btn">Angebot ansehen &#8594;</button>' +
                    '</div>' +
                '</div>';

            // Hover → map popup + border highlight
            wrapper.addEventListener('mouseenter', function () {
                if (window._dormMarkers && window._dormMarkers[i]) {
                    window._dormMarkers[i].openPopup();
                }
                var hcard = wrapper.querySelector('.de-hcard');
                if (hcard) hcard.style.borderColor = '#212529';
            });
            wrapper.addEventListener('mouseleave', function () {
                if (window._dormMarkers && window._dormMarkers[i]) {
                    window._dormMarkers[i].closePopup();
                }
                var hcard = wrapper.querySelector('.de-hcard');
                if (hcard) hcard.style.borderColor = '';
            });

            deListings.appendChild(wrapper);

            // Hide original card (filter.js still targets it)
            item.style.display = 'none';
        });

        deLayout.appendChild(deListings);

        // Insert layout after results bar
        resultsBar.insertAdjacentElement('afterend', deLayout);

        /* ── 7. Sync filter.js visibility to DE cards ─────────── */
        var observer = new MutationObserver(function () {
            dormItems.forEach(function (item, i) {
                var wrapper = deListings.querySelectorAll('.de-hcard-wrapper')[i];
                if (wrapper) {
                    wrapper.style.setProperty(
                        'display',
                        item.style.display === 'none' ? 'none' : 'block',
                        'important'
                    );
                }
            });
            // Sync count display
            var origCountEl = document.getElementById('resultCount-orig');
            if (origCountEl) countDisplay.textContent = origCountEl.textContent;
        });

        dormItems.forEach(function (item) {
            observer.observe(item, { attributes: true, attributeFilter: ['style'] });
        });
    }

}());