/**
 * FILE: culture-logic.js
 * AUTHOR: Garreth (C24451694)
 *
 * PURPOSE: Implements real-time progress feedback for German users on both
 * the review page (germanChecklist) and the login page (germanLoginChecklist).
 *
 * CULTURAL DIMENSION ADDRESSED:
 * Germany — High Uncertainty Avoidance + Individualist (Phase 1, Section 2.2)
 * Karl's PoV (Phase 1, Section 4): "I have zero tolerance for ambiguity.
 * I need a linear navigation path and constant, explicit reassurance through
 * system prompts. If I can't see exactly where I am in the process, I cannot
 * move forward."
 *
 * HYPOTHESIS ADDRESSED:
 * Hypothesis 1 (Phase 1, Section 5): "We believe that implementing constant
 * feedback prompts when navigating gives High UA users the clear mental map
 * they need, boosting Karl's confidence in research and engagement."
 *
 * KEY DESIGN DECISIONS:
 * - Font Awesome replaces <i> tags with inline <svg> asynchronously after load.
 *   A 300ms setTimeout on initial calls ensures FA has finished before
 *   updateItem tries to find the icon — without this, it finds no element
 *   and exits silently, so the checklist appears frozen on page load.
 * - SVG paths are swapped directly (not via FA class changes) because FA
 *   class-based re-rendering is unreliable after initial render.
 * - Both 'input' and 'change' events are listened to so the checklist
 *   responds to typing (text fields) and clicking (radio buttons).
 *   These fire after FA has already rendered so no delay is needed there.
 */


/* ===========================================
   REVIEW PAGE — Submission Progress Checklist
   Hypothesis 1: live feedback reduces ambiguity for High UA users (Karl).
   Phase 1 Section 6.3 Navigation: maps to the "Steps Left" pattern.
=========================================== */
function checkProgress() {
    const checklist = document.getElementById('germanChecklist');
    if (!checklist) return;

    const items = checklist.querySelectorAll('li');

    // 1. Overall Rating — at least one star must be selected
    const mainRating = document.querySelector('input[name="overall"]:checked');
    updateItem(items[0], !!mainRating);

    // 2. Title & Content — both fields must have some text
    const titleVal = document.getElementById('reviewTitle')?.value.trim() ?? '';
    const contentVal = document.getElementById('reviewContent')?.value.trim() ?? '';
    updateItem(items[1], titleVal.length > 0 && contentVal.length > 0);

    // 3. Category Breakdown — all three sub-ratings must be selected
    const loc   = document.querySelector('input[name="loc"]:checked');
    const clean = document.querySelector('input[name="clean"]:checked');
    const val   = document.querySelector('input[name="val"]:checked');
    updateItem(items[2], !!loc && !!clean && !!val);
}


/* ===========================================
   SHARED HELPER — updateItem
   Toggles a checklist item between complete (tick) and incomplete (hollow circle).
   Key design decision: SVG paths swapped directly because Font Awesome
   renders <i> tags as inline <svg> at runtime, making class-based icon
   switching unreliable after initial render.
=========================================== */
function updateItem(li, isDone) {
    if (!li) return;

    // Target <svg> first (FA already rendered), fall back to <i> if not
    const icon = li.querySelector('svg') || li.querySelector('i');
    if (!icon) return;

    if (isDone) {
        li.classList.remove('text-muted');
        li.classList.add('text-success', 'fw-bold');
        icon.setAttribute('data-prefix', 'fas');
        icon.setAttribute('data-icon', 'circle-check');
        // Solid filled check-circle — signals step is complete
        icon.innerHTML = '<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>';
    } else {
        li.classList.remove('text-success', 'fw-bold');
        li.classList.add('text-muted');
        icon.setAttribute('data-prefix', 'far');
        icon.setAttribute('data-icon', 'circle');
        // Hollow circle — incomplete state, awaiting user action
        icon.innerHTML = '<path fill="currentColor" d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>';
    }
}

// Listen to both typing and radio button changes — these fire after FA renders
// so no delay needed here
document.addEventListener('input',  checkProgress);
document.addEventListener('change', checkProgress);

// Delay initial call by 300ms to allow Font Awesome time to replace <i> with <svg>.
// Without this delay, updateItem finds no icon element on page load and exits
// silently, making the checklist appear frozen until the user interacts.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkProgress, 300);
    });
} else {
    setTimeout(checkProgress, 300);
}


/* ===========================================
   LOGIN PAGE — Sign-In Progress Checklist
   Same Hypothesis 1 applied to the login page.
   Karl's PoV: needs explicit reassurance at every step, not just on
   complex forms. The login checklist extends this to the entry point.
=========================================== */
function checkLoginProgress() {
    const checklist = document.getElementById('germanLoginChecklist');
    if (!checklist) return;

    const items = checklist.querySelectorAll('li');

    const email    = document.getElementById('loginEmail')?.value.trim() ?? '';
    const password = document.getElementById('loginPassword')?.value ?? '';

    // Basic format check — presence of '@' sufficient for live feedback
    const emailDone    = email.length > 0 && email.includes('@');
    // 6-character minimum matches common password length requirements
    const passwordDone = password.length >= 6;
    // Third item only ticks when both are satisfied — readiness signal
    const readyDone    = emailDone && passwordDone;

    updateItem(items[0], emailDone);
    updateItem(items[1], passwordDone);
    updateItem(items[2], readyDone);
}

// input event fires after FA has rendered so no delay needed
// Login page — attach directly to the specific inputs for reliability.
// Document-level 'input' can miss early keystrokes before FA has rendered
// the <i> to <svg>, causing updateItem to find no icon and exit silently.
function initLoginChecklist() {
    const checklist = document.getElementById('germanLoginChecklist');
    if (!checklist) return; // Not on the German login page

    const emailInput    = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (!emailInput || !passwordInput) return;

    // Attach directly to each input so we never miss an event
    emailInput.addEventListener('input', checkLoginProgress);
    passwordInput.addEventListener('input', checkLoginProgress);

    // Also run on change in case browser autofill triggers change not input
    emailInput.addEventListener('change', checkLoginProgress);
    passwordInput.addEventListener('change', checkLoginProgress);

    // Initial check after FA has had time to render <i> → <svg>
    setTimeout(checkLoginProgress, 300);
}

// Initialise once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginChecklist);
} else {
    initLoginChecklist();
}