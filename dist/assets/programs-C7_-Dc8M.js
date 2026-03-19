import{a as d}from"./voice-client-DhlfJVqx.js";import"./script-JMLIZS3t.js";async function o(){try{const e=await d.getCourses().catch(()=>null);l(e?e.results:[]),s()}catch(e){console.error("Failed to load programs:",e),s()}}function l(e){const t=document.querySelector('.subsection-title[data-i18n="programs_subtitle_langs"]');if(!t)return;const a=t.nextElementSibling;if(a&&e&&e.length>0){const n=document.createDocumentFragment();e.forEach(r=>{if(document.querySelector(`.program-card[href*="course_id=${r.id}"]`))return;const i=document.createElement("a");i.className="program-card dynamic-card",i.href=`detail.html?course_id=${r.id}`,i.innerHTML=`
                <div class="program-icon">${r.language?r.language.flag_emoji:"🌐"}</div>
                <h3>${r.title}</h3>
                <p class="program-desc">${r.description||r.desc}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7; display: flex; gap: 1rem;">
                    <span class="kh-tag kh-tag--beginner">${r.difficulty_level||"Beginner"}</span>
                    <span>⏱ ${r.estimated_duration||30}m</span>
                    <span>⚡ ${r.xp_reward||100} XP</span>
                </div>
            `,n.appendChild(i)}),a.insertBefore(n,a.firstChild)}}function s(){if(typeof KNOWLEDGE_DATA>"u")return;const e=document.querySelector(".free-hub-cta .programs-grid");if(e&&KNOWLEDGE_DATA.freeCourses){const t=e.querySelector(".highlight-card");e.innerHTML="",KNOWLEDGE_DATA.freeCourses.forEach(a=>{const n=document.createElement("a");n.className="program-card free-badge",n.href=`detail.html?slug=${a.slug}`,n.innerHTML=`
                <div class="program-icon">${a.icon}</div>
                <h3>${a.title}</h3>
                <p class="program-desc">${a.desc}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="kh-tag kh-tag--beginner">${a.level}</span>
                    <span>⏱ ${a.duration}</span>
                    <span>📚 ${a.lessons} Lessons</span>
                </div>
                <span class="badge" style="background: var(--color-primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; position: absolute; top: 1rem; right: 1rem;">FREE</span>
            `,e.appendChild(n)}),t&&e.appendChild(t)}}document.addEventListener("DOMContentLoaded",o);
