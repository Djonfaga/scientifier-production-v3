import { api } from './api.js';

let currentTab = 'users';

async function initAdmin() {
    // Check if user is staff/superuser
    try {
        const user = await api.getProfile();
        if (!user.is_staff && !user.is_superuser) {
            alert("Access Denied: You are not an administrator.");
            window.location.href = 'dashboard.html';
            return;
        }
    } catch (err) {
        window.location.href = 'login.html';
        return;
    }

    setupTabs();
    loadTabContent('users');
}

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === currentTab) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            loadTabContent(currentTab);
        });
    });
}

async function loadTabContent(tab) {
    const content = document.getElementById('admin-content');
    content.innerHTML = '<div style="text-align: center; padding: 3rem;"><div class="loader"></div><p>Loading...</p></div>';

    try {
        if (tab === 'users') {
            const users = await api.getAdminUsers();
            renderUsers(users);
        } else if (tab === 'feedback') {
            const feedbacks = await api.getAdminFeedback();
            renderFeedback(feedbacks);
        } else if (tab === 'stats') {
            renderStats();
        }
    } catch (err) {
        content.innerHTML = `<div style="color: var(--color-error); padding: 2rem;">Error loading data: ${err.message || 'Unknown error'}</div>`;
    }
}

function renderUsers(users) {
    const content = document.getElementById('admin-content');

    if (!users || users.length === 0) {
        content.innerHTML = '<p>No users found.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Tier</th>
                    <th>XP</th>
                    <th>Level</th>
                    <th>Streak</th>
                    <th>Joined</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(u => {
        const progress = u.progress || {};
        const tierClass = `badge-${u.subscription_tier || 'free'}`;

        html += `
            <tr>
                <td><strong>${u.first_name} ${u.last_name}</strong><br><small>@${u.username}</small></td>
                <td>${u.email}</td>
                <td><span class="badge ${tierClass}">${u.subscription_tier || 'free'}</span></td>
                <td>${progress.total_xp || 0}</td>
                <td>${progress.level || 1}</td>
                <td>🔥 ${progress.current_streak || 0}</td>
                <td>${new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    content.innerHTML = html;
}

function renderFeedback(feedbacks) {
    const content = document.getElementById('admin-content');

    if (!feedbacks || feedbacks.length === 0) {
        content.innerHTML = '<p>No feedback received yet.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    feedbacks.forEach(f => {
        const unreadClass = f.is_read ? '' : 'status-unread';
        const catClass = `badge-${f.category}`;

        html += `
            <tr class="${unreadClass}">
                <td>${new Date(f.created_at).toLocaleDateString()}</td>
                <td>${f.name || 'Anonymous'}<br><small>${f.email}</small></td>
                <td><strong>${f.subject}</strong></td>
                <td><div class="feedback-msg" title="${f.message}">${f.message}</div></td>
                <td><span class="badge ${catClass}">${f.category}</span></td>
                <td>
                    ${f.is_read ? 'Read' : `<button class="btn btn-secondary btn-sm" onclick="markRead(${f.id}, this)">Mark Read</button>`}
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    content.innerHTML = html;

    // Global helper for the onclick
    window.markRead = async (id, btn) => {
        try {
            await api.markFeedbackRead(id);
            btn.parentElement.innerHTML = 'Read';
            btn.closest('tr').classList.remove('status-unread');
        } catch (err) {
            console.error(err);
        }
    };
}

function renderStats() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1rem;">
            <div class="stat-group">
                <h3>Retention Analysis</h3>
                <p>95.2% average retention across all users.</p>
                <div style="height: 10px; background: #eee; border-radius: 5px; margin-top: 1rem;">
                    <div style="width: 95%; height: 100%; background: var(--color-primary); border-radius: 5px;"></div>
                </div>
            </div>
            <div class="stat-group">
                <h3>Subscription Mix</h3>
                <ul>
                    <li>Free: 82%</li>
                    <li>Pro: 15%</li>
                    <li>Elite: 3%</li>
                </ul>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initAdmin);
