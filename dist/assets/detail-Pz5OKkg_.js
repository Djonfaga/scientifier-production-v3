import{t as o,a as d}from"./voice-client-DhlfJVqx.js";import"./script-JMLIZS3t.js";async function p(){const e=new URLSearchParams(window.location.search),s=e.get("course_id"),a=e.get("id"),n=e.get("course"),r=e.get("slug");if(r&&typeof KNOWLEDGE_DATA<"u"&&KNOWLEDGE_DATA.freeCourses){const t=KNOWLEDGE_DATA.freeCourses.find(i=>i.slug===r);if(t){const i=KNOWLEDGE_DATA.lessonsData?KNOWLEDGE_DATA.lessonsData[r]:null;m(t,i);return}}if(s)try{const t=await d.getCourseDetail(s);c(t);return}catch(t){console.error("Failed to load dynamic course:",t)}a&&window.loadProgramDetails?window.loadProgramDetails(a):n&&window.renderCourseDetail&&window.renderCourseDetail(n)}function m(e,s){const a=localStorage.getItem("language")||"en",n=o[a]||o.en,r=document.getElementById("course-detail-shell"),t=document.getElementById("regular-detail");!r||!t||(t.style.display="none",r.style.display="block",r.innerHTML=`
    <section class="cd-hero" style="padding: 100px 0 40px; background: var(--color-surface);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="programs.html" class="btn btn-secondary" style="margin-bottom: 2rem;">${n.back_to_programs||"← Back to Programs"}</a>
            <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:4rem; line-height:1;">${e.icon||"🌐"}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        <span class="kh-tag kh-tag--beginner">${e.level}</span>
                        <span class="kh-tag kh-tag--free">FREE</span>
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${e.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${e.desc}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${e.lessons} ${n.modules_count||"Modules"}</span>
                <span>⏱ ${e.duration}</span>
                <span>👤 ${e.instructor}</span>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0; background: var(--color-surface-elevated);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                <div>
                    <h2 style="font-size:1.5rem; margin-bottom:1.5rem;">Learning Objectives</h2>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem;">
                        ${e.learningObjectives.map(i=>`
                            <li style="display: flex; gap: 0.75rem; align-items: flex-start;">
                                <span style="color: var(--color-primary);">✓</span>
                                <span style="opacity: 0.9;">${i}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>
                <div>
                    <h2 style="font-size:1.5rem; margin-bottom:1.5rem;">Prerequisites</h2>
                    <p style="opacity: 0.8; line-height: 1.6;">${e.prerequisites}</p>
                </div>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <h2 style="font-size:1.8rem; margin-bottom:2rem;">${n.curriculum||"Curriculum"}</h2>
            <div class="lessons-container" style="display: flex; flex-direction: column; gap: 1rem;">
                ${s?s.map(i=>`
                    <div class="about-card" style="padding: 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start;">
                        <div style="background: var(--color-primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                            ${i.num}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                                <h3 style="margin: 0; font-size: 1.2rem;">${i.title}</h3>
                                <span style="font-size: 0.85rem; opacity: 0.6;">⏱ ${i.duration}</span>
                            </div>
                            <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 1rem;">${i.overview}</p>
                            
                            <details style="margin-bottom: 1rem;">
                                <summary style="cursor: pointer; font-size: 0.9rem; color: var(--color-primary); font-weight: 600;">View Lesson Details</summary>
                                <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-left: 2px solid var(--color-primary); margin-top: 0.5rem; font-size: 0.9rem;">
                                    <h4 style="margin-bottom: 0.5rem;">Key Points:</h4>
                                    <ul style="padding-left: 1.2rem; margin-bottom: 1rem; opacity: 0.8;">
                                        ${i.key_points.map(l=>`<li>${l}</li>`).join("")}
                                    </ul>
                                    <h4 style="margin-bottom: 0.5rem;">Vocabulary:</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                                        ${i.vocabulary.map(l=>`<span class="kh-tag" style="background: rgba(255,255,255,0.05);">${l}</span>`).join("")}
                                    </div>
                                    <h4 style="margin-bottom: 0.5rem;">Practice:</h4>
                                    <ul style="padding-left: 1.2rem; opacity: 0.8;">
                                        ${i.practice.map(l=>`<li>${l}</li>`).join("")}
                                    </ul>
                                </div>
                            </details>

                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <button class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">${n.start_module||"Start Lesson"}</button>
                            </div>
                        </div>
                    </div>
                `).join(""):"<p>Curriculum details coming soon.</p>"}
            </div>
        </div>
    </section>
    `)}function c(e){const s=localStorage.getItem("language")||"en",a=o[s]||o.en,n=document.getElementById("course-detail-shell"),r=document.getElementById("regular-detail");!n||!r||(r.style.display="none",n.style.display="block",n.innerHTML=`
    <section class="cd-hero" style="padding: 100px 0 40px; background: var(--color-surface);">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="programs.html" class="btn btn-secondary" style="margin-bottom: 2rem;">${a.back_to_programs}</a>
            <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:4rem; line-height:1;">${e.language.flag_emoji||"🌐"}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        <span class="kh-tag kh-tag--beginner">${e.difficulty_level}</span>
                        <span class="kh-tag kh-tag--free">${e.is_premium?"PREMIUM":"FREE"}</span>
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${e.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${e.description}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${e.content_items?e.content_items.length:0} ${a.modules_count}</span>
                <span>⏱ ${e.estimated_duration} ${a.mins_count}</span>
                <span>⚡ ${e.xp_reward} XP</span>
            </div>
        </div>
    </section>

    <section style="padding:4rem 0;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <h2 style="font-size:1.8rem; margin-bottom:2rem;">${a.curriculum}</h2>
            <div class="lessons-container" style="display: flex; flex-direction: column; gap: 1rem;">
                ${e.content_items&&e.content_items.length>0?e.content_items.map(t=>`
                    <div class="about-card" style="padding: 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start;">
                        <div style="background: var(--color-primary); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                            ${t.order_index}
                        </div>
                        <div style="flex: 1;">
                            <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.2rem;">${t.question_text}</h3>
                            <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 1rem;">${t.explanation_text}</p>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <span class="kh-tag" style="background: rgba(255,255,255,0.05);">${t.content_type.toUpperCase()}</span>
                                <button class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">${a.start_module}</button>
                            </div>
                        </div>
                    </div>
                `).join(""):`<p>${a.no_modules}</p>`}
            </div>
        </div>
    </section>
    `)}window.renderCourseDetail=renderCourseDetail;window.renderEnhancedCourseContent=m;document.addEventListener("DOMContentLoaded",p);
