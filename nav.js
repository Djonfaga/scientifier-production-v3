import { api } from './api.js';
import { translations } from './translations.js';

/**
 * Handle dynamic navigation based on auth state
 */
export function initNav() {
    const navList = document.querySelector('.nav-list');
    const headerContainer = document.querySelector('.header-container');

    if (!navList || !headerContainer) return;

    // Auth state check

    // Check auth state
    const isAuthenticated = !!api.token;
    const lang = localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    // Remove old auth-related items if any
    const oldAuthItems = document.querySelectorAll('.auth-nav-item');
    oldAuthItems.forEach(item => item.remove());

    if (isAuthenticated) {
        // Add Dashboard link
        const dashboardLi = document.createElement('li');
        dashboardLi.className = 'auth-nav-item';
        dashboardLi.innerHTML = `<a href="dashboard.html" data-i18n="nav_dashboard">${t.nav_dashboard}</a>`;
        navList.appendChild(dashboardLi);

        // Check for admin status to add Admin link
        api.getProfile().then(user => {
            if (user.is_staff || user.is_superuser) {
                const adminLi = document.createElement('li');
                adminLi.className = 'auth-nav-item';
                adminLi.innerHTML = `<a href="admin_panel.html" data-i18n="nav_admin" style="color: var(--color-primary); font-weight: 600;">${t.nav_admin}</a>`;
                navList.appendChild(adminLi);
            }
        }).catch(err => console.error("Nav profile fetch failed", err));

        // Add Logout button in header actions
        let headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn btn-secondary auth-nav-item';
            logoutBtn.style.padding = '0.5rem 1rem';
            logoutBtn.style.fontSize = '0.85rem';
            logoutBtn.setAttribute('data-i18n', 'nav_logout');
            logoutBtn.innerText = t.nav_logout;
            logoutBtn.onclick = () => api.logout();
            headerActions.appendChild(logoutBtn);
        }
    } else {
        // Add Login link
        const loginLi = document.createElement('li');
        loginLi.className = 'auth-nav-item';
        loginLi.innerHTML = `<a href="login.html" data-i18n="nav_login">${t.nav_login}</a>`;
        navList.appendChild(loginLi);

        // Add Sign Up button
        let headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const signupBtn = document.createElement('a');
            signupBtn.href = 'signup.html';
            signupBtn.className = 'btn btn-primary auth-nav-item';
            signupBtn.style.padding = '0.5rem 1.2rem';
            signupBtn.style.fontSize = '0.85rem';
            signupBtn.setAttribute('data-i18n', 'nav_get_started');
            signupBtn.innerText = t.nav_get_started;
            headerActions.appendChild(signupBtn);
        }
    }
}


