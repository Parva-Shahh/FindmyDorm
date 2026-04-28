/**
 * FILE: en_listings.js
 * AUTHOR: Nate
 * English locale — Booking.com style layout
 * Rebuilds the base listings.html into:
 *   - Yellow search button
 *   - Results bar with sort
 *   - Left sidebar: map thumbnail + collapsible filters
 *   - 3-column card grid with heart + amenity bullets
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
            searchBtn.className = 'en-search-btn';
            searchBtn.textContent = 'Search';
            searchContainer.appendChild(searchBtn);
        }

        /* ── 2. Results bar ───────────────────────────────────── */
        var searchWrapper = document.querySelector('.search-bar-wrapper');
        var resultsBar    = document.createElement('div');
        resultsBar.className = 'en-results-bar';

        // Clone result count — keep original hidden for filter.js to update
        var origCount   = document.getElementById('resultCount');
        var countDisplay = document.createElement('span');
        countDisplay.className = 'en-results-count';
        countDisplay.id = 'resultCount';
        if (origCount) {
            countDisplay.textContent = origCount.textContent;
            origCount.id = 'resultCount-orig';
        }

        var sortWrap = document.createElement('div');
        sortWrap.className = 'en-sort-wrap';
        sortWrap.innerHTML =
            '<span>Sort by:</span>' +
            '<select class="en-sort-select">' +
                '<option>Our top picks</option>' +
                '<option>Price: low to high</option>' +
                '<option>Price: high to low</option>' +
                '<option>Best rating</option>' +
            '</select>';

        resultsBar.appendChild(countDisplay);
        resultsBar.appendChild(sortWrap);

        if (searchWrapper && searchWrapper.nextSibling) {
            searchWrapper.parentNode.insertBefore(resultsBar, searchWrapper.nextSibling);
        }

        /* ── 3. Main layout wrapper ───────────────────────────── */
        var enLayout = document.createElement('div');
        enLayout.className = 'en-layout';

        /* ── 4. Sidebar ───────────────────────────────────────── */
        var sidebar = document.createElement('aside');
        sidebar.className = 'en-sidebar';

        // Map thumbnail — move #dormMap into it
        var mapThumb = document.createElement('div');
        mapThumb.className = 'en-map-thumb';
        var dormMap = document.getElementById('dormMap');
        if (dormMap) {
            mapThumb.appendChild(dormMap);
            setTimeout(function () {
                if (window._dormLeafletMap) {
                    window._dormLeafletMap.invalidateSize();
                }
            }, 150);
        }
        var mapOverlay = document.createElement('div');
        mapOverlay.className = 'en-map-thumb-overlay';
        mapOverlay.textContent = '📍 Show on map';
        mapThumb.appendChild(mapOverlay);
        sidebar.appendChild(mapThumb);

        // Filter sections — read translated labels from existing hidden dropdowns
        var filterGroups = [
            {
                title: 'Property Type',
                items: [
                    { label: 'Apartment', value: 'Apartment', count: '(1)' },
                    { label: 'Studio',    value: 'Studio',    count: '(2)' },
                    { label: 'Room',      value: 'Room',      count: '(1)' }
                ]
            },
            {
                title: 'Price Range',
                items: [
                    { label: 'Under €800',   value: 'budget',  count: '(1)' },
                    { label: '€800 – €1000', value: 'mid',     count: '(2)' },
                    { label: 'Over €1000',   value: 'premium', count: '(1)' }
                ]
            },
            {
                title: 'Location',
                items: [
                    { label: 'Dublin 1',      value: 'dublin 1',      count: '(1)' },
                    { label: 'Dublin 2',      value: 'dublin 2',      count: '(1)' },
                    { label: 'Dublin 6',      value: 'dublin 6',      count: '(1)' },
                    { label: 'Dun Laoghaire', value: 'dun laoghaire', count: '(1)' }
                ]
            },
            {
                title: 'Amenities',
                items: [
                    { label: 'WiFi',           value: 'wifi',      count: '' },
                    { label: 'Bills Included', value: 'bills',     count: '' },
                    { label: 'Furnished',      value: 'furnished', count: '' },
                    { label: 'Parking',        value: 'parking',   count: '' }
                ]
            }
        ];

        // Try to pull translated labels from the hidden filter bar dropdowns
        var origDropdowns = document.querySelectorAll('.filter-bar-wrapper .dropdown');
        origDropdowns.forEach(function (dd, gi) {
            if (!filterGroups[gi]) return;
            var origItems = dd.querySelectorAll('.dropdown-item');
            origItems.forEach(function (item, ii) {
                if (filterGroups[gi].items[ii]) {
                    var cb = item.querySelector('input');
                    var text = item.textContent.trim();
                    if (text) filterGroups[gi].items[ii].label = text;
                }
            });
            var titleEl = dd.querySelector('.filter-pill');
            if (titleEl) filterGroups[gi].title = titleEl.textContent.trim();
        });

        filterGroups.forEach(function (group) {
            var section = document.createElement('div');
            section.className = 'en-filter-section';

            var header = document.createElement('div');
            header.className = 'en-filter-header';
            header.innerHTML = group.title + ' <span class="en-chevron">▾</span>';
            header.addEventListener('click', function () {
                var body       = header.nextElementSibling;
                var isCollapsed = body.style.display === 'none';
                body.style.display = isCollapsed ? 'block' : 'none';
                header.classList.toggle('collapsed', !isCollapsed);
            });

            var body = document.createElement('div');
            body.className = 'en-filter-body';

            group.items.forEach(function (item) {
                var row = document.createElement('label');
                row.className = 'en-filter-item';
                row.innerHTML =
                    '<div class="en-filter-left">' +
                        '<input type="checkbox" class="en-filter-check filter-check" value="' + item.value + '">' +
                        '<span class="en-filter-label">' + item.label + '</span>' +
                    '</div>' +
                    '<span class="en-filter-count">' + item.count + '</span>';

                // Sync with original hidden checkbox so filter.js still works
                var newCb  = row.querySelector('input');
                var origCb = document.querySelector('.filter-bar-wrapper input[value="' + item.value + '"]');
                if (origCb) {
                    newCb.addEventListener('change', function () {
                        origCb.checked = newCb.checked;
                        origCb.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                }
                body.appendChild(row);
            });

            section.appendChild(header);
            section.appendChild(body);
            sidebar.appendChild(section);
        });

        // Clear filters button
        var clearBtn = document.createElement('button');
        clearBtn.className = 'en-filter-reset';
        clearBtn.textContent = '✕ Clear all filters';
        clearBtn.addEventListener('click', function () {
            document.querySelectorAll('.en-filter-check').forEach(function (cb) {
                cb.checked = false;
            });
            if (window.resetFilters) window.resetFilters();
        });
        sidebar.appendChild(clearBtn);

        enLayout.appendChild(sidebar);

        /* ── 5. 3-column card grid ────────────────────────────── */
        var enGrid = document.createElement('div');
        enGrid.className = 'en-grid';

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

            var amenityHTML = Array.from(tags).map(function (t) {
                return '<li>' + t.textContent.trim() + '</li>';
            }).join('');

            var wrapper = document.createElement('div');
            wrapper.className = 'en-card-wrapper dorm-item';

            // Copy data attributes for filter.js
            Array.from(item.attributes).forEach(function (attr) {
                if (attr.name.startsWith('data-')) {
                    wrapper.setAttribute(attr.name, attr.value);
                }
            });

            wrapper.innerHTML =
                '<div class="en-card">' +
                    '<div class="en-card-img">' +
                        '<span class="en-card-badge">' + (badge ? badge.textContent.trim() : '') + '</span>' +
                        '<button class="en-card-heart" aria-label="Save">&#9825;</button>' +
                        '<img src="' + (img ? img.src : '') + '" alt="' + (title ? title.textContent.trim() : '') + '">' +
                    '</div>' +
                    '<div class="en-card-body">' +
                        '<span class="en-card-title">' + (title ? title.textContent.trim() : '') + '</span>' +
                        '<div class="en-card-address">📍 ' + (address ? address.textContent.replace('📍', '').trim() : '') + '</div>' +
                        '<div class="en-card-rating">' +
                            '<span class="en-rating-score">' + (score ? score.textContent.trim() : '') + '</span>' +
                            '<span class="en-rating-label">' + (label ? label.textContent.trim() : '') + '</span>' +
                            '<span class="en-rating-reviews"> &middot; ' + (reviews ? reviews.textContent.trim() : '') + '</span>' +
                        '</div>' +
                        '<ul class="en-card-amenities">' + amenityHTML + '</ul>' +
                    '</div>' +
                    '<div class="en-card-footer">' +
                        '<div class="en-price-block">' +
                            '<span class="en-price-from">From</span>' +
                            '<span class="en-price-amount">' + (price ? price.textContent.trim() : '') + '</span>' +
                            '<span class="en-price-per">' + (per ? per.textContent.trim() : '') + '</span>' +
                        '</div>' +
                        '<button class="en-view-btn">Show prices</button>' +
                    '</div>' +
                '</div>';

            // Heart toggle
            var heart = wrapper.querySelector('.en-card-heart');
            heart.addEventListener('click', function (e) {
                e.stopPropagation();
                heart.classList.toggle('liked');
                heart.innerHTML = heart.classList.contains('liked') ? '&#9829;' : '&#9825;';
            });

            // Hover → map popup
            wrapper.addEventListener('mouseenter', function () {
                if (window._dormMarkers && window._dormMarkers[i]) {
                    window._dormMarkers[i].openPopup();
                }
                var enCard = wrapper.querySelector('.en-card');
                if (enCard) enCard.style.borderColor = '#0d6efd';
            });
            wrapper.addEventListener('mouseleave', function () {
                if (window._dormMarkers && window._dormMarkers[i]) {
                    window._dormMarkers[i].closePopup();
                }
                var enCard = wrapper.querySelector('.en-card');
                if (enCard) enCard.style.borderColor = '';
            });

            enGrid.appendChild(wrapper);

            // Hide original card
            item.style.display = 'none';
        });

        enLayout.appendChild(enGrid);

        // Insert layout after results bar
        resultsBar.insertAdjacentElement('afterend', enLayout);

        /* ── 6. Sync filter.js visibility to EN cards ─────────── */
        var observer = new MutationObserver(function () {
            dormItems.forEach(function (item, i) {
                var wrapper = enGrid.querySelectorAll('.en-card-wrapper')[i];
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