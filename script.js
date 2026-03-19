import { api } from './api.js';
import { initNav } from './nav.js';
import './voice-client.js';

let mobileMenuToggle, mainNav, menuOverlay;

function toggleMobileMenu(show) {
    if (!mobileMenuToggle || !mainNav || !menuOverlay) return;
    if (show) {
        mobileMenuToggle.classList.add('active');
        mainNav.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

import { translations } from './translations.js';
window.translations = translations;
/* --- 2. Language Switching Logic --- */
const langSelect = document.getElementById('language-select');

window.updateLanguage = function(lang) {
    // Update Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // RTL Support for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.lang = lang;
    }

    // Re-render Knowledge Hub if on that page
    if (typeof renderKnowledgeHub === 'function' && document.getElementById('notebooks-grid')) {
        renderKnowledgeHub();
    }

    // Re-render Course/Program Detail if on that page
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const courseSlug = urlParams.get('course') || id || urlParams.get('course_id') || urlParams.get('slug');

    if (courseSlug) {
        // Check if it's a static program
        const isStaticProgram = id && programIds.includes(id);
        
        if (isStaticProgram && typeof window.loadProgramDetails === 'function') {
            window.loadProgramDetails(id);
        } else if (typeof window.renderCourseDetail === 'function') {
            window.renderCourseDetail(courseSlug);
        }
    }
}

if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('language', selectedLang);
        updateLanguage(selectedLang);
    });
}

/* --- 3. Light/Dark Mode Logic --- */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }

    // Update switch icon rotation if it exists
    if (themeToggle) {
        const icon = themeToggle.querySelector('svg');
        if (icon) icon.style.transform = theme === 'light' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Check localStorage preference or system preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = body.classList.contains('light-mode');
        const nextTheme = isCurrentlyLight ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });
}

/* --- Program Details Logic --- */
window.programIds = [
    'english', 'french', 'spanish', 'turkish', 'arabic',
    'prompt_engineering', 'mcp_automations', 'ai_optimization',
    'sports', 'chess', 'typing',
    'free_neuro', 'free_ai', 'free_speed_reading', 'free_memory_hacking'
];

const programIds = window.programIds; // Local alias

// Expose handlers used by detail.js or chatbot page.
window.loadProgramDetails = function (id) {
    const lang = localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    const regularDetail = document.getElementById('regular-detail');
    const courseShell = document.getElementById('course-detail-shell');

    if (regularDetail) regularDetail.style.display = 'block';
    if (courseShell) courseShell.style.display = 'none';

    if (programIds.includes(id)) {
        const titleKey = `prog_detail_${id}_title`;
        const contentKey = `prog_detail_${id}_content`;

        if (t[titleKey]) {
            document.getElementById('detail-title').innerText = t[titleKey];
            document.getElementById('detail-content').innerHTML = t[contentKey];
        } else {
            const en = translations['en'];
            document.getElementById('detail-title').innerText = en[titleKey] || "Program Not Found";
            document.getElementById('detail-content').innerHTML = en[contentKey] || "";
        }

        // Re-inject buttons for the new content
        if (typeof injectSectionButtons === 'function') injectSectionButtons();
    } else {
        console.error("Content not found for id:", id);
        if (document.getElementById('detail-title')) {
            document.getElementById('detail-title').innerText = "Program Not Found";
        }
    }
};

window.renderCourseDetail = function (slugOrId) {
    if (typeof KNOWLEDGE_DATA === 'undefined') return;

    let slug = slugOrId;
    if (!slug) {
        const urlParams = new URLSearchParams(window.location.search);
        slug = urlParams.get('course') || urlParams.get('id');
        const courseId = urlParams.get('course_id');

        // If we have a courseId but no slug, we might need to find the slug from KNOWLEDGE_DATA
        // or handle backend fetching (though script.js usually handles static data)
        if (courseId && !slug) {
            const course = KNOWLEDGE_DATA.freeCourses.find(c => c.id == courseId || c.course_id == courseId);
            if (course) slug = course.slug;
        }
    }

    if (!slug) return;

    const course = KNOWLEDGE_DATA.freeCourses.find(c => c.slug === slug);
    if (!course) {
        if (document.getElementById('detail-title')) {
            document.getElementById('detail-title').innerText = "Course Not Found";
        }
        return;
    }

    // Map data properties correctly
    course.full_lessons = KNOWLEDGE_DATA.lessonsData[slug] || [];
    course.learning_objectives = course.learningObjectives || [];

    const lang = localStorage.getItem('language') || 'en';
    const t = translations[lang] || translations['en'];

    const regularDetail = document.getElementById('regular-detail');
    const courseShell = document.getElementById('course-detail-shell');
    if (regularDetail) regularDetail.style.display = 'none';
    if (courseShell) courseShell.style.display = 'block';

    let html = `
    <section class="cd-hero">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="knowledge.html" style="color: var(--color-primary); text-decoration:none; font-size:0.9rem; display:inline-flex; align-items:center; gap:6px; margin-bottom:1.5rem; opacity:0.8;">
                ${t.back_to_kh}
            </a>
            <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:3.5rem; line-height:1;">${course.icon}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        ${course.tags.map(tag => `<span class="kh-tag kh-tag--${tag.toLowerCase()}">${tag}</span>`).join('')}
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${course.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${course.desc}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${course.lessons} ${t.lessons_count}</span>
                <span>⏱ ${course.duration}</span>
                <span>👤 ${course.instructor}</span>
            </div>
        </div>
    </section>

    <section style="padding:2rem 0 4rem;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem; display:grid; grid-template-columns: 1fr 340px; gap:2.5rem; align-items:start;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h2 style="font-size:1.6rem; font-weight:700; margin:0;">${t.course_lessons}</h2>
                    <div class="focus-toggle" id="focus-toggle-btn">
                        <span style="font-size:1.2rem;">👁️</span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--color-primary);">${t.focus_mode}</span>
                    </div>
                </div>

                <div class="lessons-container">
                    ${course.full_lessons ? course.full_lessons.map(lesson => `
                        <div class="cd-lesson">
                            <button class="cd-lesson-header" style="width:100%; background:none; border:none; color:inherit; padding:1.2rem 1.5rem; cursor:pointer; display:flex; align-items:center; gap:1rem; text-align:left;">
                                <span style="background: var(--color-primary); color:#fff; font-weight:800; min-width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:0.95rem;">${lesson.num}</span>
                                <div style="flex:1;">
                                    <div style="font-weight:600; font-size:1.05rem;">${lesson.title}</div>
                                    <div style="font-size:0.8rem; opacity:0.5; margin-top:2px;">⏱ ${lesson.duration}</div>
                                </div>
                                <svg class="cd-chevron" style="width:20px; height:20px; opacity:0.4; transition:transform 0.3s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            <div class="cd-lesson-body" style="display:none;">
                                <div style="background:rgba(16,185,129,0.06); border-left:3px solid var(--color-primary); padding:1rem 1.2rem; border-radius:0 12px 12px 0; margin-bottom:1.5rem;">
                                    <p style="margin:0; font-size:0.95rem; line-height:1.6; opacity:0.85;">${lesson.overview}</p>
                                </div>
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#60a5fa; margin-bottom:0.7rem;">${t.key_points}</h4>
                                    <ul style="margin:0; padding:0; list-style:none;">
                                        ${lesson.key_points.map(p => `<li style="padding:0.4rem 0 0.4rem 1.5rem; position:relative; font-size:0.9rem; line-height:1.5; opacity:0.85;"><span style="position:absolute; left:0; color:var(--color-primary);">✓</span>${p}</li>`).join('')}
                                    </ul>
                                </div>
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#fbbf24; margin-bottom:0.7rem;">${t.vocabulary}</h4>
                                    <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                                        ${lesson.vocabulary.map(v => `<span style="background:rgba(251,191,36,0.1); color:#fbbf24; padding:4px 10px; border-radius:8px; font-size:0.8rem; font-weight:500;">${v}</span>`).join('')}
                                    </div>
                                </div>
                                ${lesson.grammar_focus ? `
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#c084fc; margin-bottom:0.7rem;">${t.grammar_focus}</h4>
                                    <p style="margin:0; font-size:0.9rem; line-height:1.6; opacity:0.85; background:rgba(168,85,247,0.06); padding:0.8rem 1rem; border-radius:10px;">${lesson.grammar_focus}</p>
                                </div>` : ''}
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#f472b6; margin-bottom:0.7rem;">${t.practice_exercises}</h4>
                                    <ol style="margin:0; padding-left:1.3rem;">
                                        ${lesson.practice.map(ex => `<li style="padding:0.3rem 0; font-size:0.9rem; line-height:1.5; opacity:0.85;">${ex}</li>`).join('')}
                                    </ol>
                                </div>
                                <div style="background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.15); padding:1rem 1.2rem; border-radius:12px;">
                                    <div style="font-weight:600; font-size:0.85rem; color:#fbbf24; margin-bottom:0.3rem;">${t.cultural_tip}</div>
                                    <p style="margin:0; font-size:0.88rem; line-height:1.6; opacity:0.8;">${lesson.cultural_tip}</p>
                                </div>
                            </div>
                        </div>
                    `).join('') : `<p>${t.coming_soon}</p>`}
                </div>

                <div style="margin-top: 3rem; text-align: center; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button id="start-nsdr-btn" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <span>🧘‍♀️</span> ${t.btn_nsdr}
                    </button>
                </div>
            </div>

            <aside>
                <div style="background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem; margin-bottom:1.5rem;">
                    <div style="font-weight:700; font-size:1.1rem; margin-bottom:1rem;">${t.course_progress}</div>
                    <div style="background:rgba(255,255,255,0.06); border-radius:10px; height:10px; overflow:hidden; margin-bottom:0.5rem;">
                        <div style="background:var(--color-primary); height:100%; width:0%;"></div>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem;">
                    <div style="font-weight:700; font-size:1.1rem; margin-bottom:1rem;">${t.learning_objectives}</div>
                    <ul style="margin:0; padding:0; list-style:none;">
                        ${course.learning_objectives.map(obj => `<li style="padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:0.85rem; opacity:0.8;">✓ ${obj}</li>`).join('')}
                    </ul>
                </div>
            </aside>
        </div>
    </section>
    `;

    if (courseShell) courseShell.innerHTML = html;
    
    // Auto-inject buttons for newly rendered content
    if (typeof window.injectSectionButtons === 'function') {
        window.injectSectionButtons();
    }

    // Add interactions
    courseShell.querySelectorAll('.cd-lesson-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const lesson = btn.closest('.cd-lesson');
            const body = lesson.querySelector('.cd-lesson-body');
            const isOpen = lesson.classList.contains('open');

            if (isOpen) {
                body.style.display = 'none';
                lesson.classList.remove('open');
            } else {
                body.style.display = 'block';
                lesson.classList.add('open');
            }
        });
    });

    const ftBtn = document.getElementById('focus-toggle-btn');
    if (ftBtn) {
        ftBtn.addEventListener('click', () => {
            document.body.classList.toggle('focus-active');
            const isActive = document.body.classList.contains('focus-active');
            ftBtn.style.background = isActive ? 'var(--color-primary)' : 'rgba(16,185,129,0.1)';
            ftBtn.querySelector('span:last-child').style.color = isActive ? '#fff' : 'var(--color-primary)';
        });
    }

    const nsdrBtn = document.getElementById('start-nsdr-btn');
    if (nsdrBtn) {
        nsdrBtn.addEventListener('click', startNSDR);
    }
};

window.renderKnowledgeHub = function () {
    if (typeof KNOWLEDGE_DATA === 'undefined') return;

    const notebooksGrid = document.getElementById('notebooks-grid');
    if (notebooksGrid) {
        notebooksGrid.innerHTML = KNOWLEDGE_DATA.notebooks.map(nb => `
            <div class="kh-notebook-card kh-notebook--${nb.color}">
                <div class="kh-notebook-glow"></div>
                <div class="kh-notebook-icon">${nb.icon}</div>
                <h3>${nb.title}</h3>
                <p>${nb.desc}</p>
                <div class="kh-notebook-badges">
                    <span class="kh-badge kh-badge--${nb.color}">${nb.sources} Sources</span>
                    <span class="kh-badge kh-badge--${nb.color}">${nb.badge_label}</span>
                </div>
                <div class="kh-notebook-actions">
                    <a href="${nb.link}" target="_blank" class="btn btn-primary">Open Notebook →</a>
                    <button class="btn btn-secondary kh-ask-ai-btn" data-notebook="${nb.id}">Ask AI</button>
                </div>
            </div>
        `).join('');

        // Action Buttons for Notebooks
        notebooksGrid.querySelectorAll('.kh-ask-ai-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nbId = btn.dataset.notebook;
                const askInput = document.getElementById('kh-ask-input');
                if (askInput) {
                    askInput.focus();
                    askInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    askInput.placeholder = `Ask about ${nbId}...`;
                }
            });
        });
    }

    const coursesGrid = document.getElementById('courses-grid');
    if (coursesGrid) {
        coursesGrid.innerHTML = KNOWLEDGE_DATA.freeCourses.map(course => `
            <div class="kh-course-card" data-tags="${course.tags.join(',')},${course.category}">
                <div class="kh-course-icon">${course.icon}</div>
                <div class="kh-course-tags">
                    ${course.tags.map(t => `<span class="kh-tag kh-tag--${t.toLowerCase()}">${t}</span>`).join('')}
                </div>
                <h3>${course.title}</h3>
                <p>${course.desc}</p>
                <div class="kh-course-meta">
                    <span>📖 ${course.lessons} lessons</span>
                    <span>⏱ ${course.duration}</span>
                </div>
                <a href="detail.html?course=${course.slug}" class="btn btn-primary">Start Free ✦</a>
            </div>
            `).join('');
    }

    const miniGrid = document.getElementById('mini-lessons-grid');
    if (miniGrid) {
        miniGrid.innerHTML = KNOWLEDGE_DATA.miniLessons.map(mini => `
            <div class="kh-mini-card">
                <div class="kh-mini-icon">${mini.icon}</div>
                <div class="kh-mini-info">
                    <h4>${mini.title}</h4>
                    <div class="kh-mini-meta">
                        <span class="kh-mini-type">${mini.type}</span>
                        <span class="kh-mini-duration">${mini.duration}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-primary">▶</button>
            </div >
            `).join('');
    }

    // Filter Logic
    document.querySelectorAll('.kh-filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.kh-filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter.toLowerCase();
            document.querySelectorAll('.kh-course-card').forEach(card => {
                const tags = card.dataset.tags.toLowerCase();
                if (filter === 'all' || tags.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
};

function startNSDR() {
    const overlay = document.getElementById('nsdr-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    let sec = 1200;
    const timer = document.getElementById('nsdr-timer');
    const interval = setInterval(() => {
        if (overlay.style.display === 'none') { clearInterval(interval); return; }
        sec--;
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        if (timer) timer.innerText = `${m}:${s} `;
        if (sec <= 0) clearInterval(interval);
    }, 1000);

    const exitBtn = document.getElementById('exit-nsdr');
    if (exitBtn) exitBtn.onclick = () => overlay.style.display = 'none';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isLight = !isLight;
        if (isLight) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
        // Rotate icon
        const icon = themeToggle.querySelector('svg');
        icon.style.transform = isLight ? 'rotate(180deg)' : 'rotate(0deg)';
    });
}


/* --- 4. Animations & Visuals (Restored) --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .program-card, .section-title, .hero-content').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    el.style.transitionDelay = `${index * 0.05} s`;
    observer.observe(el);
});

const style = document.createElement('style');
style.innerHTML = `
            .visible { opacity: 1!important; transform: translateY(0)!important; }
        `;
document.head.appendChild(style);

/* --- Animated Stat Counters --- */
function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = (isFloat ? current : current.toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(sv => {
                const text = sv.textContent.trim();
                const match = text.match(/^([\d,]+\.?\d*)\s*(.*)$/);
                if (match) {
                    const num = parseFloat(match[1].replace(/,/g, ''));
                    const suffix = match[2] || '';
                    sv.textContent = '0' + suffix;
                    animateCounter(sv, num, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* --- Header Scroll Effect --- */
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = 'var(--spacing-sm) 0';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });
}

/* --- Back to Top Button --- */
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = `< svg width = "20" height = "20" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" stroke - width="2.5" stroke - linecap="round" stroke - linejoin="round" > <path d="M18 15l-6-6-6 6" /></svg > `;
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, { passive: true });

const canvas = document.getElementById('neural-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
            // Adapting color for light mode support would require dynamic check, keeping generic gold/green for now
            this.color = Math.random() > 0.5 ? 'rgba(16, 185, 129, ' : 'rgba(251, 191, 36, ';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.update();
            p.draw();
            for (let j = i; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - (distance / connectionDistance);
                    // Check theme for line color
                    if (document.body.classList.contains('light-mode')) {
                        ctx.strokeStyle = 'rgba(16, 185, 129, ' + (opacity * 0.4) + ')';
                    } else {
                        ctx.strokeStyle = 'rgba(16, 185, 129, ' + (opacity * 0.2) + ')';
                    }
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
}
/* --- 5. Contact Form Logic (EmailJS) --- */
// Initialize EmailJS
(function () {
    emailjs.init("YavoYlqtomBUxbpMr");
})();

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        const serviceID = 'scientiservice';
        const templateID = 'contact_form'; // Make sure to create a template with this ID in your EmailJS dashboard

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = 'var(--color-primary)';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, (err) => {
                btn.innerText = 'Error!';
                btn.style.backgroundColor = 'red'; // Simple error indication
                console.log('FAILED...', err);
                alert("Failed to send message. Please check the console or try again later. (Did you update the API keys?)");
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                }, 3000);
            });
    });
}

/* --- 6. Chatbot Logic --- */
const chatHistory = [];
let recognition = null;
let isListening = false;
let isLiveMode = false;
let currentUtterance = null;


function getChatElements() {
    return {
        input: document.getElementById('chat-input'),
        messages: document.getElementById('chat-messages')
    };
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const { input, messages } = getChatElements();
    if (!input || !messages) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;

    chatHistory.push({ role: 'user', content: text });

    showTyping();

    try {
        const data = await api.chat(chatHistory);

        removeTyping();

        const reply = data.reply;

        chatHistory.push({ role: 'assistant', content: reply });
        addMessage(reply, 'bot');

    } catch (err) {
        removeTyping();
        addMessage('Sorry, something went wrong. Please try again.', 'bot');
    } finally {
        input.disabled = false;
        input.focus();
    }
}


function sendSuggestion(text) {
    const { input } = getChatElements();
    if (input) {
        input.value = text;
        sendMessage();
    }
}

function parseMarkdown(text) {
    if (!text) return "";

    // Convert basic markdown
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*)$/gm, '<li>$1</li>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');

    // Final safety: strip remaining asterisks if instruction was ignored
    html = html.replace(/\*\*/g, '').replace(/\[(.*?)\]/g, '$1');

    return html;
}

function addMessage(text, sender) {
    const { messages } = getChatElements();
    if (!messages) return;

    const div = document.createElement('div');
    div.className = `message ${sender} `;
    // Use innerHTML with parsed, sanitized text
    let contentHtml = parseMarkdown(text);

    div.innerHTML = contentHtml;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

/* --- Voice & Live Mode Logic --- */

function initVoiceFeatures() {
    try {
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) {
            micBtn.style.display = 'none';
        }

        // Live Mode Listeners
        const liveBtn = document.getElementById('live-mode-toggle');
        if (liveBtn) {
            liveBtn.onclick = toggleLiveMode;
        }

        const stopLiveBtn = document.getElementById('stop-live-btn');
        if (stopLiveBtn) {
            stopLiveBtn.onclick = () => toggleLiveMode(false);
        }
    } catch (e) {
        console.error("Error in initVoiceFeatures:", e);
    }
}

function toggleDictation() {
    if (isListening) {
        recognition?.stop();
        setIsListening(false);
    } else {
        try {
            const currentLang = document.getElementById('language-select')?.value || 'en';
            const langMap = {
                'en': 'en-US',
                'fr': 'fr-FR',
                'tr': 'tr-TR',
                'ar': 'ar-SA',
                'es': 'es-ES'
            };
            recognition.lang = langMap[currentLang] || 'en-US';
            recognition?.start();
            setIsListening(true);
        } catch (e) {
            console.error("Mic start failed:", e);
        }
    }
}

function setIsListening(val) {
    isListening = val;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
        micBtn.classList.toggle('active', isListening);
    }

    // Update live overlay status if active
    const statusText = document.getElementById('live-status-text');
    if (statusText && isLiveMode) {
        statusText.textContent = isListening ? "Listening..." : "Scienti is Thinking...";
    }
}

function speakText(text) {
    console.info('Browser speech synthesis is disabled. Use Gemini Live mode for voice conversation.');
}

function toggleLiveMode(forceVal) {
    const newVal = typeof forceVal === 'boolean' ? forceVal : !isLiveMode;
    isLiveMode = newVal;

    const overlay = document.getElementById('live-overlay');
    const toggleBtn = document.getElementById('live-mode-toggle');

    if (isLiveMode) {
        overlay.style.display = 'flex';
        toggleBtn.classList.add('active');
        localStorage.setItem('voice_enabled', 'true');

        // Start conversation via Google GenAI Live Client
        if (window.startLiveSession) {
            window.startLiveSession();
        } else {
            console.error("Voice Client not loaded");
            alert("Voice features are initializing. Please try again in a moment.");
            toggleLiveMode(false);
        }

    } else {
        overlay.style.display = 'none';
        toggleBtn.classList.remove('active');

        // Stop session
        if (window.stopLiveSession) {
            window.stopLiveSession();
        }

        // Stop legacy recognition
        if (recognition) recognition.stop();
        setIsListening(false);
    }
}


function showTyping() {
    const { messages } = getChatElements();
    if (!messages) return;

    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing-indicator';
    div.innerHTML = `
            < div class="typing-dot" ></div >
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

/* --- Floating Scienti --- */

function ensureFloatingScientiMarkup() {
    if (document.getElementById('scienti-fab') || !document.body) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="scienti-fab" aria-label="Open Scienti quick chat" role="button" tabindex="0">
            <div class="scienti-circles">
                <div class="scienti-circle-outer"></div>
                <div class="scienti-circle-inner"></div>
                <div class="scienti-live-dot"></div>
            </div>
            <div class="scienti-fab-label">Ask Scienti</div>
        </div>

        <div id="scienti-quick-window" class="scienti-window" aria-hidden="true">
            <div class="scienti-window-header" id="scienti-window-drag-handle">
                <div class="scienti-window-title">
                    <span>🧠</span>
                    <span>Scienti Agent</span>
                    <span class="live-badge">Live</span>
                </div>
                <div class="scienti-window-controls">
                    <button class="window-control-btn close" id="close-scienti-window" aria-label="Close Scienti">×</button>
                </div>
            </div>
            <div class="scienti-window-body" id="scienti-chat-body">
                <div class="chat-msg assistant">Hello! I am Scienti. How can I help you optimize your learning today?</div>
            </div>
            <div class="scienti-window-footer">
                <div class="chat-input-wrapper">
                    <button class="live-mode-btn" id="quick-live-mode-toggle" title="Toggle Live Voice Mode">
                        <span class="live-icon">📡</span>
                        <span class="live-text">Live</span>
                    </button>
                    <input type="text" id="scienti-quick-input" placeholder="Ask Scienti...">
                    <button class="chat-send-btn" id="send-scienti-btn" aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
                <div class="live-overlay" id="quick-live-overlay" style="display: none;">
                    <div class="live-content">
                        <div class="live-orb"></div>
                        <div class="live-status">
                            <h3 id="quick-live-status-text">Listening...</h3>
                            <p id="quick-live-sub-status">Scienti Live is active</p>
                        </div>
                        <div class="visualizer">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                        <button class="btn btn-secondary btn-sm" id="quick-stop-live-btn">Exit Live Mode</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.append(...wrapper.children);
}

function initFloatingScienti() {
    ensureFloatingScientiMarkup();

    const scientiFab = document.getElementById('scienti-fab');
    const scientiWindow = document.getElementById('scienti-quick-window');
    const closeScientiBtn = document.getElementById('close-scienti-window');
    const sendScientiBtn = document.getElementById('send-scienti-btn');
    const scientiInput = document.getElementById('scienti-quick-input');
    const scientiBody = document.getElementById('scienti-chat-body');
    const dragHandle = document.getElementById('scienti-window-drag-handle');
    const quickLiveModeToggle = document.getElementById('quick-live-mode-toggle');
    const quickLiveOverlay = document.getElementById('quick-live-overlay');
    const quickStopLiveBtn = document.getElementById('quick-stop-live-btn');

    if (!scientiFab || !scientiWindow || !sendScientiBtn || !scientiInput || !scientiBody) return;
    if (scientiFab.dataset.initialized === 'true') return;
    scientiFab.dataset.initialized = 'true';

    function injectSectionButtons() {
        // Expanded selectors to cover ALL subsections, blog titles, card headers, etc.
        const selectors = [
            '.section-title',
            '.hero-title',
            '.subsection-title',
            '.article-title',
            '.kh-notebook-card h3',
            '.kh-mini-card h4',
            '.about-card h3',
            '.program-card h3',
            '.pricing-card h3',
            '.pricing-header h3',
            '.faq-item h4',
            '#detail-title',
            '.cd-lesson-header div div'
        ];
        
        const titles = document.querySelectorAll(selectors.join(', '));
        titles.forEach(title => {
            // Safety: Skip if button already exists or it's inside the chat window etc.
            if (title.querySelector('.section-chat-btn') || title.closest('.scienti-window')) return;

            const btn = document.createElement('button');
            btn.className = 'scienti-chat-trigger section-chat-btn';
            btn.innerHTML = '<span>🧠</span> Ask Scienti';
            btn.title = 'Ask Scienti about this section';

            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                // Get clean text for context
                const contextText = title.innerText.replace('Ask Scienti', '').trim();
                openScientiWindow(`I'm looking at "${contextText}". Can you explain how this helps my learning or give me more details about it?`);
            });

            title.appendChild(btn);
        });
    }

    // Set up MutationObserver to handle dynamic content (e.g. blog posts, knowledge hub)
    const observer = new MutationObserver((mutations) => {
        let shouldInject = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) shouldInject = true;
        });
        if (shouldInject) injectSectionButtons();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function formatQuickMessage(text) {
        if (!text) return '';
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    function openScientiWindow(initialMsg = null) {
        scientiWindow.style.display = 'flex';
        scientiWindow.classList.add('active');
        scientiWindow.setAttribute('aria-hidden', 'false');

        if (initialMsg) {
            addFloatingMessage(initialMsg, 'user');
            fetchScientiResponse(initialMsg);
        }

        scientiInput.focus();
    }

    function closeWindow() {
        scientiWindow.style.display = 'none';
        scientiWindow.classList.remove('active');
        scientiWindow.setAttribute('aria-hidden', 'true');
        if (quickLiveOverlay) quickLiveOverlay.style.display = 'none';
        if (quickLiveModeToggle) quickLiveModeToggle.classList.remove('active');
        if (window.stopLiveSession) {
            window.stopLiveSession();
        }
    }

    function addFloatingMessage(text, role) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;

        if (role === 'assistant') {
            msg.innerHTML = formatQuickMessage(text);
        } else {
            msg.innerText = text;
        }

        scientiBody.appendChild(msg);
        scientiBody.scrollTop = scientiBody.scrollHeight;
    }

    function showFloatingTyping() {
        const typingMsg = document.createElement('div');
        typingMsg.className = 'chat-msg assistant typing';
        typingMsg.id = 'scienti-quick-typing';
        typingMsg.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        scientiBody.appendChild(typingMsg);
        scientiBody.scrollTop = scientiBody.scrollHeight;
    }

    function removeFloatingTyping() {
        const indicator = document.getElementById('scienti-quick-typing');
        if (indicator) indicator.remove();
    }

    async function fetchScientiResponse(text) {
        showFloatingTyping();
        try {
            // Updated payload to follow standard format and include context
            const payload = {
                messages: [{ role: 'user', content: text }],
                context: window.location.pathname,
                quick_chat: true
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            removeFloatingTyping();

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                addFloatingMessage(data.reply || data.error || "I'm having trouble processing that right now. Please try again.", 'assistant');
                return;
            }

            if (data.reply) {
                addFloatingMessage(data.reply, 'assistant');
            } else if (data.choices && data.choices[0]?.message?.content) {
                addFloatingMessage(data.choices[0].message.content, 'assistant');
            } else {
                addFloatingMessage("I'm having trouble processing that right now. Please try again.", 'assistant');
            }
        } catch (error) {
            removeFloatingTyping();
            console.error("Scienti Neural Error:", error);
            addFloatingMessage('Neural connection lost. Please try again in a moment.', 'assistant');
        }
    }

    if (sendScientiBtn && scientiInput) {
        const handleSend = () => {
            const text = scientiInput.value.trim();
            if (text) {
                addFloatingMessage(text, 'user');
                scientiInput.value = '';
                fetchScientiResponse(text);
            }
        };

        sendScientiBtn.addEventListener('click', handleSend);
        scientiInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') handleSend();
        });
    }

    if (dragHandle && scientiWindow) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(event) {
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;
            if (event.target === dragHandle || dragHandle.contains(event.target)) {
                isDragging = true;
            }
        }

        function drag(event) {
            if (isDragging) {
                event.preventDefault();
                currentX = event.clientX - initialX;
                currentY = event.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                scientiWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    if (scientiFab) {
        let isDraggingFab = false;
        let hasDraggedFab = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        scientiFab.addEventListener('mousedown', dragStartFab);
        document.addEventListener('mousemove', dragFab);
        document.addEventListener('mouseup', dragEndFab);

        function dragStartFab(event) {
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;
            if (event.target === scientiFab || scientiFab.contains(event.target)) {
                isDraggingFab = true;
                hasDraggedFab = false;
            }
        }

        function dragFab(event) {
            if (isDraggingFab) {
                event.preventDefault();
                hasDraggedFab = true;
                currentX = event.clientX - initialX;
                currentY = event.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                scientiFab.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEndFab() {
            if (!hasDraggedFab && isDraggingFab) {
                if (scientiWindow.classList.contains('active')) {
                    closeWindow();
                } else {
                    openScientiWindow();
                }
            }
            isDraggingFab = false;
        }
    }

    closeScientiBtn?.addEventListener('click', closeWindow);

    if (!window.startLiveSession || !window.stopLiveSession) {
        quickLiveModeToggle.style.display = 'none';
    } else {
        quickLiveModeToggle.addEventListener('click', () => {
            quickLiveOverlay.style.display = 'flex';
            quickLiveModeToggle.classList.add('active');
            window.startLiveSession();
        });

        quickStopLiveBtn?.addEventListener('click', () => {
            quickLiveOverlay.style.display = 'none';
            quickLiveModeToggle.classList.remove('active');
            window.stopLiveSession();
        });
    }

    injectSectionButtons();
}

// Expose handlers used by inline HTML attributes on chatbot page.
// script.js is loaded as a module, so functions are not global unless attached.
window.handleChatInput = handleChatInput;
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
window.speakText = speakText;

// Initialize Language and Theme on Page Load
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Scientifier: DOMContentLoaded fired");

        // 0. Initialize Navigation and Menu
        initNav();
        mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        mainNav = document.getElementById('main-nav');
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);

        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = mainNav.classList.contains('active');
                toggleMobileMenu(!isActive);
            });

            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    toggleMobileMenu(false);
                });
            });

            menuOverlay.addEventListener('click', () => {
                toggleMobileMenu(false);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                    toggleMobileMenu(false);
                }
            });
        }

        // Safe LocalStorage Helper
        const safeGetItem = (key) => {
            try { return localStorage.getItem(key); }
            catch (e) { console.warn("LocalStorage access denied:", e); return null; }
        };

        const savedLang = localStorage.getItem('language') || 'en';
    
    // Resilience: ensure the selector reflects reality even if DOM is still shifting
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = savedLang;
        // If the value didn't take (e.g. mobile version of select), try finding the option
        if (!languageSelect.value && languageSelect.options.length > 0) {
            for (let i = 0; i < languageSelect.options.length; i++) {
                if (languageSelect.options[i].value === savedLang) {
                    languageSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
        if (typeof updateLanguage === 'function') {
            updateLanguage(savedLang);
        } else {
            console.error("updateLanguage function missing!");
        }

        if (typeof initVoiceFeatures === 'function') {
            initVoiceFeatures();
        } else {
            console.error("initVoiceFeatures function missing!");
        }

        initFloatingScienti();

        // Re-apply theme state (handles edge cases where script loaded after body)
        const currentSavedTheme = safeGetItem('theme') || 'dark';
        if (typeof applyTheme === 'function') {
            applyTheme(currentSavedTheme);
        }

        // Newsletter form handler
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = newsletterForm.querySelector('button');
                const input = newsletterForm.querySelector('input');
                const email = input.value;

                btn.innerHTML = '<span class="btn-spinner"></span>';
                btn.disabled = true;

                try {
                    await api.subscribeNewsletter(email);
                    btn.innerHTML = '&#10003; Subscribed!';
                    btn.classList.add('success');
                    input.value = '';
                } catch (err) {
                    btn.innerHTML = 'Error';
                    console.error("Newsletter error", err);
                } finally {
                    setTimeout(() => {
                        btn.innerHTML = 'Subscribe';
                        btn.classList.remove('success');
                        btn.disabled = false;
                    }, 3000);
                }
            });
        }

        if (typeof renderKnowledgeHub === 'function' && document.getElementById('notebooks-grid')) {
            renderKnowledgeHub();
        }

        // Contact form handler
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = contactForm.querySelector('button');
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                btn.innerHTML = '<span class="btn-spinner"></span>';
                btn.disabled = true;

                try {
                    await api.sendFeedback({
                        name,
                        email,
                        message,
                        subject: `Contact Form: ${name}`,
                        category: 'other'
                    });
                    contactForm.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                            <h3 style="margin-bottom: 0.5rem;">Ignition Successful!</h3>
                            <p style="color: var(--color-text-muted);">Our team has received your message and will reach out shortly to help you evolve.</p>
                            <button class="btn btn-secondary" style="margin-top: 1.5rem;" onclick="location.reload()">Send Another</button>
                        </div>
                    `;
                } catch (err) {
                    btn.innerHTML = 'Error. Try again';
                    btn.disabled = false;
                    console.error("Contact error", err);
                }
            });
        }

        console.log("Scientifier initialized successfully.");
    } catch (err) {
        console.error("Critical error during initialization:", err);
    }
});


// End Global Initialization
