import { api } from './api.js';

async function initPrograms() {
    try {
        // Try to load from API if possible
        const data = await api.getCourses().catch(() => null);
        renderDynamicPrograms(data ? data.results : []);

        // Always populate from KNOWLEDGE_DATA for the free hub and placeholders
        populateFromKnowledgeData();
    } catch (err) {
        console.error('Failed to load programs:', err);
        populateFromKnowledgeData();
    }
}

function renderDynamicPrograms(courses) {
    const langsSubsection = document.querySelector('.subsection-title[data-i18n="programs_subtitle_langs"]');
    if (!langsSubsection) return;

    const langGrid = langsSubsection.nextElementSibling;
    if (!langGrid) return;

    // Filter courses that are not already in the grid (to avoid duplicates)
    if (courses && courses.length > 0) {
        const dynamicContainer = document.createDocumentFragment();

        courses.forEach(course => {
            // Check if this card already exists
            if (document.querySelector(`.program-card[href*="course_id=${course.id}"]`)) return;

            const card = document.createElement('a');
            card.className = 'program-card dynamic-card';
            card.href = `detail.html?course_id=${course.id}`;
            card.innerHTML = `
                <div class="program-icon">${course.language ? course.language.flag_emoji : '🌐'}</div>
                <h3>${course.title}</h3>
                <p class="program-desc">${course.description || course.desc}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7; display: flex; gap: 1rem;">
                    <span class="kh-tag kh-tag--beginner">${course.difficulty_level || 'Beginner'}</span>
                    <span>⏱ ${course.estimated_duration || 30}m</span>
                    <span>⚡ ${course.xp_reward || 100} XP</span>
                </div>
            `;
            dynamicContainer.appendChild(card);
        });

        langGrid.insertBefore(dynamicContainer, langGrid.firstChild);
    }
}

function populateFromKnowledgeData() {
    if (typeof KNOWLEDGE_DATA === 'undefined') return;

    // Update Free Hub
    const freeHubGrid = document.querySelector('.free-hub-cta .programs-grid');
    if (freeHubGrid && KNOWLEDGE_DATA.freeCourses) {
        // Clear existing static free cards but keep the "Unlimited Knowledge Base" card if desired
        const kbCard = freeHubGrid.querySelector('.highlight-card');
        freeHubGrid.innerHTML = '';

        KNOWLEDGE_DATA.freeCourses.forEach(course => {
            const card = document.createElement('a');
            card.className = 'program-card free-badge';
            card.href = `detail.html?slug=${course.slug}`;
            card.innerHTML = `
                <div class="program-icon">${course.icon}</div>
                <h3>${course.title}</h3>
                <p class="program-desc">${course.desc}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="kh-tag kh-tag--beginner">${course.level}</span>
                    <span>⏱ ${course.duration}</span>
                    <span>📚 ${course.lessons} Lessons</span>
                </div>
                <span class="badge" style="background: var(--color-primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; position: absolute; top: 1rem; right: 1rem;">FREE</span>
            `;
            freeHubGrid.appendChild(card);
        });

        if (kbCard) {
            freeHubGrid.appendChild(kbCard);
        }
    }
}

document.addEventListener('DOMContentLoaded', initPrograms);
