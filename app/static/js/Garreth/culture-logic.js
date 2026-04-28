/**
 * FILE: culture-logic.js
 * AUTHOR: Garreth (C24451694)
 */

function checkProgress() {
    const checklist = document.getElementById('germanChecklist');
    if (!checklist) return;

    const items = checklist.querySelectorAll('li');

    // 1. Overall Rating
    const mainRating = document.querySelector('input[name="overall"]:checked');
    updateItem(items[0], !!mainRating);

    // 2. Title & Content
    const titleVal = document.getElementById('reviewTitle')?.value.trim() ?? '';
    const contentVal = document.getElementById('reviewContent')?.value.trim() ?? '';
    updateItem(items[1], titleVal.length > 0 && contentVal.length > 0);

    // 3. Category Breakdown — all three must be rated
    const loc   = document.querySelector('input[name="loc"]:checked');
    const clean = document.querySelector('input[name="clean"]:checked');
    const val   = document.querySelector('input[name="val"]:checked');
    updateItem(items[2], !!loc && !!clean && !!val);
}

function updateItem(li, isDone) {
    if (!li) return;
    // FA replaces <i> with <svg>, so target that instead
    const icon = li.querySelector('svg') || li.querySelector('i');
    if (!icon) return;

    if (isDone) {
        li.classList.remove('text-muted');
        li.classList.add('text-success', 'fw-bold');
        icon.setAttribute('data-prefix', 'fas');
        icon.setAttribute('data-icon', 'circle-check');
        // Swap the SVG path to the solid check-circle
        icon.innerHTML = '<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>';
    } else {
        li.classList.remove('text-success', 'fw-bold');
        li.classList.add('text-muted');
        icon.setAttribute('data-prefix', 'far');
        icon.setAttribute('data-icon', 'circle');
        // Restore the hollow circle path
        icon.innerHTML = '<path fill="currentColor" d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/>';
    }
}

// Covers typing in inputs/textareas and selecting radio buttons
document.addEventListener('input',  checkProgress);
document.addEventListener('change', checkProgress);

// Safe initialisation — works whether the script runs before or after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkProgress);
} else {
    checkProgress(); // DOM is already ready
}

function checkLoginProgress() {
    const checklist = document.getElementById('germanLoginChecklist');
    if (!checklist) return;

    const items = checklist.querySelectorAll('li');

    const email = document.getElementById('loginEmail')?.value.trim() ?? '';
    const password = document.getElementById('loginPassword')?.value ?? '';

    const emailDone    = email.length > 0 && email.includes('@');
    const passwordDone = password.length >= 6;
    const readyDone    = emailDone && passwordDone;

    updateItem(items[0], emailDone);
    updateItem(items[1], passwordDone);
    updateItem(items[2], readyDone);
}

document.addEventListener('input', checkLoginProgress);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkLoginProgress);
} else {
    checkLoginProgress();
}