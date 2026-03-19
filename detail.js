import { api } from './api.js';
import { translations } from './translations.js';

async function initCourseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course_id');
    const slugId = urlParams.get('id');
    const courseSlug = urlParams.get('course');
    const slug = urlParams.get('slug');

    // Prioritize KNOWLEDGE_DATA for the Free Hub courses (best possible materials)
    if (slug && typeof KNOWLEDGE_DATA !== 'undefined' && KNOWLEDGE_DATA.freeCourses) {
        const course = KNOWLEDGE_DATA.freeCourses.find(c => c.slug === slug);
        if (course) {
            const lessons = KNOWLEDGE_DATA.lessonsData ? KNOWLEDGE_DATA.lessonsData[slug] : null;
            renderEnhancedCourseContent(course, lessons);
            return;
        }
    }

    // Prioritize dynamic backend courses
    if (courseId) {
        try {
            const course = await api.getCourseDetail(courseId);
            renderCourseContent(course);
            return; // Successfully rendered dynamic course
        } catch (err) {
            console.error('Failed to load dynamic course:', err);
        }
    }

    // Fallback to static "Programs" or "Free Hub" content handled by script.js
    if (slugId && window.loadProgramDetails) {
        window.loadProgramDetails(slugId);
    } else if (courseSlug && window.renderCourseDetail) {
        window.renderCourseDetail(courseSlug);
    }
}

function renderEnhancedCourseContent(course, lessons) {
    const lang = localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    const shell = document.getElementById('course-detail-shell');
    const regular = document.getElementById('regular-detail');

    if (!shell || !regular) return;

    regular.style.display = 'none';
    shell.style.display = 'block';

    shell.innerHTML = `
    <section class="cd-hero" style="padding: 100px 0 40px; background: var(--color-surface);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="programs.html" class="btn btn-secondary" style="margin-bottom: 2rem;">${t.back_to_programs || '← Back to Programs'}</a>
            <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:4rem; line-height:1;">${course.icon || '🌐'}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        <span class="kh-tag kh-tag--beginner">${course.level}</span>
                        <span class="kh-tag kh-tag--free">FREE</span>
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${course.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${course.desc}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${course.lessons} ${t.modules_count || 'Modules'}</span>
                <span>⏱ ${course.duration}</span>
                <span>👤 ${course.instructor}</span>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0; background: var(--color-surface-elevated);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                <div>
                    <h2 style="font-size:1.5rem; margin-bottom:1.5rem;">Learning Objectives</h2>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem;">
                        ${course.learningObjectives.map(obj => `
                            <li style="display: flex; gap: 0.75rem; align-items: flex-start;">
                                <span style="color: var(--color-primary);">✓</span>
                                <span style="opacity: 0.9;">${obj}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <h2 style="font-size:1.5rem; margin-bottom:1.5rem;">Prerequisites</h2>
                    <p style="opacity: 0.8; line-height: 1.6;">${course.prerequisites}</p>
                </div>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <h2 style="font-size:1.8rem; margin-bottom:2rem;">${t.curriculum || 'Curriculum'}</h2>
            <div class="lessons-container" style="display: flex; flex-direction: column; gap: 1rem;">
                ${lessons ? lessons.map(lesson => `
                    <div class="about-card" style="padding: 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start;">
                        <div style="background: var(--color-primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                            ${lesson.num}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                                <h3 style="margin: 0; font-size: 1.2rem;">${lesson.title}</h3>
                                <span style="font-size: 0.85rem; opacity: 0.6;">⏱ ${lesson.duration}</span>
                            </div>
                            <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 1rem;">${lesson.overview}</p>
                            
                            <details style="margin-bottom: 1rem;">
                                <summary style="cursor: pointer; font-size: 0.9rem; color: var(--color-primary); font-weight: 600;">View Lesson Details</summary>
                                <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-left: 2px solid var(--color-primary); margin-top: 0.5rem; font-size: 0.9rem;">
                                    <h4 style="margin-bottom: 0.5rem;">Key Points:</h4>
                                    <ul style="padding-left: 1.2rem; margin-bottom: 1rem; opacity: 0.8;">
                                        ${lesson.key_points.map(pt => `<li>${pt}</li>`).join('')}
                                    </ul>
                                    <h4 style="margin-bottom: 0.5rem;">Vocabulary:</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                                        ${lesson.vocabulary.map(v => `<span class="kh-tag" style="background: rgba(255,255,255,0.05);">${v}</span>`).join('')}
                                    </div>
                                    <h4 style="margin-bottom: 0.5rem;">Practice:</h4>
                                    <ul style="padding-left: 1.2rem; opacity: 0.8;">
                                        ${lesson.practice.map(p => `<li>${p}</li>`).join('')}
                                    </ul>
                                </div>
                            </details>

                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <button class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">${t.start_module || 'Start Lesson'}</button>
                            </div>
                        </div>
                    </div>
                `).join('') : `<p>Curriculum details coming soon.</p>`}
            </div>
        </div>
    </section>
    `;
}

function renderCourseContent(course) {
    const lang = localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    const shell = document.getElementById('course-detail-shell');
    const regular = document.getElementById('regular-detail');

    if (!shell || !regular) return;

    regular.style.display = 'none';
    shell.style.display = 'block';

    shell.innerHTML = `
    <section class="cd-hero" style="padding: 100px 0 40px; background: var(--color-surface);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="programs.html" class="btn btn-secondary" style="margin-bottom: 2rem;">${t.back_to_programs}</a>
            <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:4rem; line-height:1;">${course.language.flag_emoji || '🌐'}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        <span class="kh-tag kh-tag--beginner">${course.difficulty_level}</span>
                        <span class="kh-tag kh-tag--free">${course.is_premium ? 'PREMIUM' : 'FREE'}</span>
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${course.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${course.description}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${course.content_items ? course.content_items.length : 0} ${t.modules_count}</span>
                <span>⏱ ${course.estimated_duration} ${t.mins_count}</span>
                <span>⚡ ${course.xp_reward} XP</span>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <h2 style="font-size:1.8rem; margin-bottom:2rem;">${t.curriculum}</h2>
            <div class="lessons-container" style="display: flex; flex-direction: column; gap: 1rem;">
                ${course.content_items && course.content_items.length > 0 ? course.content_items.map(item => `
                    <div class="about-card" style="padding: 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start;">
                        <div style="background: var(--color-primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                            ${item.order_index}
                        </div>
                        <div style="flex: 1;">
                            <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.2rem;">${item.question_text}</h3>
                            <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 1rem;">${item.explanation_text}</p>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <span class="kh-tag" style="background: rgba(255,255,255,0.05);">${item.content_type.toUpperCase()}</span>
                                <button class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">${t.start_module}</button>
                            </div>
                        </div>
                    </div>
                `).join('') : `<p>${t.no_modules}</p>`}
            </div>
        </div>
    </section>
    `;
}

// Expose to window for global access (e.g. from script.js language update)
window.renderCourseDetail = renderCourseDetail;
window.renderEnhancedCourseContent = renderEnhancedCourseContent;

document.addEventListener('DOMContentLoaded', initCourseDetail);
