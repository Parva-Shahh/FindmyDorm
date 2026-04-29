/**
 * File: culture-logic.js
 * Author: Garreth (C24451694)
 *
 * Purpose: This script creates a "Live Checklist" for German users on the
 * review and login pages. It gives them instant feedback as they type.
 *
 * Cultural Logic:
 * - Germany: High UA (Uncertainty Avoidance) + Individualist (Karl persona).
 * - Karl's PoV: Karl hates being confused. He needs to see exactly where
 * he is in a process to feel comfortable moving forward.
 * * Hypothesis 1: We believe that giving constant feedback (the checklist)
 * gives High UA users a "clear mental map." This builds Karl's confidence.
 * * Design Decision: This follows the "Steps on the Left" pattern from the group
 * report (Section 6.3), which helps lower stress for users like Karl.
 */


/* --- Review Page - Progress Checklist ---
   Hypothesis 1: Live feedback makes the process clear for Karl.
   Design Decision: The checklist updates as the user works so they
   never have to guess if a section is finished. */
function checkProgress() {
    const checklist = document.getElementById('germanChecklist');
    if (!checklist) return; // If we aren't on the review page, stop here.

    const items = checklist.querySelectorAll('li');

    // 1. Check if the user clicked at least one star for the main rating.
    const mainRating = document.querySelector('input[name="overall"]:checked');
    updateItem(items[0], !!mainRating);

    // 2. Check if the user typed text into both the Title and Review boxes.
    const titleVal = document.getElementById('reviewTitle')?.value.trim() ?? '';
    const contentVal = document.getElementById('reviewContent')?.value.trim() ?? '';
    updateItem(items[1], titleVal.length > 0 && contentVal.length > 0);

    // 3. Check if all three category ratings (Location, Cleanliness, Value) are picked.
    const loc   = document.querySelector('input[name="loc"]:checked');
    const clean = document.querySelector('input[name="clean"]:checked');
    const val   = document.querySelector('input[name="val"]:checked');
    updateItem(items[2], !!loc && !!clean && !!val);
}


/* --- Shared Helper - updateItem ---
   Toggles an icon between a "Hollow Circle" (not done) and a "Solid Tick" (done).

   Design Decision: We swap the "SVG" code directly. This is more reliable
   than just changing a CSS class because custom icons can sometimes
   be slow or buggy when they update on the screen. */
function updateItem(li, isDone) {
    if (!li) return;

    // Look for the icon (either as a modern SVG or an old <i> tag).
    const icon = li.querySelector('svg') || li.querySelector('i');
    if (!icon) return;

    if (isDone) {
        // Step finished: Make it bold/green and show the solid tick icon.
        li.classList.remove('text-muted');
        li.classList.add('text-success', 'fw-bold');
        icon.setAttribute('data-prefix', 'fas');
        icon.setAttribute('data-icon', 'circle-check');
        // SVG code for a solid circle with a checkmark.
        icon.innerHTML = '<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>';
    } else {
        // Step not finished: Keep it grey/faded and show the empty circle.
        li.classList.remove('text-success', 'fw-bold');
        li.classList.add('text-muted');
        icon.setAttribute('data-prefix', 'far');
        icon.setAttribute('data-icon', 'circle');
        // SVG code for a hollow circle.
        icon.innerHTML = '<path fill="currentColor" d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>';
    }
}

// Watch for when the user types (input) or clicks a button (change).
document.addEventListener('input',  checkProgress);
document.addEventListener('change', checkProgress);

/* Design Decision: We wait 0.3 seconds (300ms) before doing the first check.
   This gives the icons enough time to load properly so the script doesn't
   miss them when the page first opens. */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkProgress, 300);
    });
} else {
    setTimeout(checkProgress, 300);
}


/* --- Log In Page - Sign In Progress Checklist ---
   Hypothesis 1: Karl needs reassurance even on simple pages like Login.
   Design Decision: We added a checklist here so Karl feels the site is
   professional and clear from the very first moment he uses it. */
function checkLoginProgress() {
    const checklist = document.getElementById('germanLoginChecklist');
    if (!checklist) return; // Not on the login page — stop here.

    const items = checklist.querySelectorAll('li');

    const email    = document.getElementById('loginEmail')?.value.trim() ?? '';
    const password = document.getElementById('loginPassword')?.value ?? '';

    // Check if email contains an "@" and password has at least 6 characters.
    const emailDone    = email.length > 0 && email.includes('@');
    const passwordDone = password.length >= 6;

    // The final "Ready to go" item only ticks when BOTH are finished.
    const readyDone    = emailDone && passwordDone;

    updateItem(items[0], emailDone);
    updateItem(items[1], passwordDone);
    updateItem(items[2], readyDone);
}

/* Design Decision: We attach the script directly to the email and password boxes.
   This ensures we track every single letter the user types immediately. */
function initLoginChecklist() {
    const checklist = document.getElementById('germanLoginChecklist');
    if (!checklist) return;

    const emailInput    = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (!emailInput || !passwordInput) return;

    emailInput.addEventListener('input',  checkLoginProgress);
    passwordInput.addEventListener('input', checkLoginProgress);

    // Also handle "Autofill" (when the browser fills the boxes for you).
    emailInput.addEventListener('change',  checkLoginProgress);
    passwordInput.addEventListener('change', checkLoginProgress);

    // Wait a moment for icons to load before doing the first check.
    setTimeout(checkLoginProgress, 300);
}

// Start the log in logic.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginChecklist);
} else {
    initLoginChecklist();
}