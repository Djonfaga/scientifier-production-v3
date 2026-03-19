import { api } from './api.js';

async function initDashboard() {
    try {
        // Redirect to login if not authenticated
        if (!api.token) {
            window.location.href = 'login.html';
            return;
        }

        const profile = await api.getProfile();
        updateUI(profile);
    } catch (err) {
        console.error('Failed to load dashboard:', err);
        // If 401, redirect to login
        if (err.status === 401) {
            window.location.href = 'login.html';
        }
    }
}

function updateUI(user) {
    const progress = user.progress || {};

    // Welcome message
    const welcomeTitle = document.querySelector('.dashboard-header h1');
    if (welcomeTitle) {
        const lang = localStorage.getItem('language') || 'en';
        // Check if translations is available (might need to import or access global)
        const welcomeBase = (typeof translations !== 'undefined' && translations[lang] && translations[lang]['dash_welcome']) 
            ? translations[lang]['dash_welcome'] 
            : 'Welcome back';
        welcomeTitle.innerText = `${welcomeBase}, ${user.first_name || user.username || 'Learner'}! 👋`;
    }

    // XP and Level
    const levelNumber = document.querySelector('.level-number');
    const levelLabel = document.querySelector('.level-label');
    if (levelNumber) levelNumber.innerText = `Level ${progress.level || 1}`;
    if (levelLabel) levelLabel.innerText = `${progress.total_xp || 0} XP`;

    // Streaks
    const streakStat = document.querySelector('.stat-card:nth-child(1) h3');
    if (streakStat) streakStat.innerText = `${progress.current_streak || 0} Day Streak`;

    // Completed Lessons
    const lessonsStat = document.querySelector('.stat-card:nth-child(2) h3');
    if (lessonsStat) lessonsStat.innerText = `${progress.total_lessons_completed || 0} Lessons`;

    // Learning Time
    const timeStat = document.querySelector('.stat-card:nth-child(3) h3');
    if (timeStat) {
        const totalMinutes = Math.round(progress.total_time_minutes || 0);
        timeStat.innerText = totalMinutes >= 60
            ? `${(totalMinutes / 60).toFixed(1)} Hours`
            : `${totalMinutes} Minutes`;
    }

    // Retention Rate
    const retentionTitle = document.querySelector('.stat-card:nth-child(4) h3');
    if (retentionTitle) retentionTitle.innerText = `${progress.retention_rate || 0}%`;

    // Achievements
    const achievementsList = document.querySelector('.achievements-list');
    if (achievementsList && user.achievements) {
        if (user.achievements.length === 0) {
            achievementsList.innerHTML = '<p style="font-size: 0.85rem; color: var(--color-text-muted);">No achievements yet. Start learning!</p>';
        } else {
            achievementsList.innerHTML = user.achievements.map(ach => `
                <div class="achievement-item">
                    <span class="achievement-icon">${ach.icon || '🏆'}</span>
                    <div><strong>${ach.name}</strong><p>Unlocked ${new Date(ach.date_unlocked).toLocaleDateString()}</p></div>
                </div>
            `).join('');
        }
    }
}

// Feedback form handler
const feedbackForm = document.getElementById('dashboard-feedback-form');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = feedbackForm.querySelector('button');
        const cat = document.getElementById('feedback-cat').value;
        const msg = document.getElementById('feedback-msg').value;

        if (!msg.trim()) return;

        btn.disabled = true;
        btn.innerText = 'Sending...';

        try {
            await api.sendFeedback({
                subject: `Dashboard Feedback [${cat}]`,
                message: msg,
                category: cat
            });
            feedbackForm.innerHTML = '<p style="color: var(--color-primary); font-weight: 600; text-align: center; padding: 1rem;">Message sent to administrators! 🚀</p>';
        } catch (err) {
            console.error(err);
            btn.disabled = false;
            btn.innerText = 'Error. Try again';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    // Re-run translations to pick up any dynamic content or late-rendered labels
    if (typeof window.updateLanguage === 'function') {
        window.updateLanguage(localStorage.getItem('language') || 'en');
    }
});
