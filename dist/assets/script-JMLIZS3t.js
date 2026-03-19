import{t as y,i as se,a as V}from"./voice-client-DhlfJVqx.js";let B,L,S;function z(e){!B||!L||!S||(e?(B.classList.add("active"),L.classList.add("active"),S.classList.add("active"),document.body.style.overflow="hidden"):(B.classList.remove("active"),L.classList.remove("active"),S.classList.remove("active"),document.body.style.overflow=""))}window.translations=y;const J=document.getElementById("language-select");window.updateLanguage=function(e){document.querySelectorAll("[data-i18n]").forEach(s=>{const o=s.getAttribute("data-i18n");y[e]&&y[e][o]&&(s.innerText=y[e][o])}),document.querySelectorAll("[data-i18n-placeholder]").forEach(s=>{const o=s.getAttribute("data-i18n-placeholder");y[e]&&y[e][o]&&(s.placeholder=y[e][o])}),e==="ar"?(document.documentElement.setAttribute("dir","rtl"),document.documentElement.lang="ar"):(document.documentElement.setAttribute("dir","ltr"),document.documentElement.lang=e),typeof renderKnowledgeHub=="function"&&document.getElementById("notebooks-grid")&&renderKnowledgeHub();const t=new URLSearchParams(window.location.search),i=t.get("id"),n=t.get("course")||i||t.get("course_id")||t.get("slug");n&&(i&&te.includes(i)&&typeof window.loadProgramDetails=="function"?window.loadProgramDetails(i):typeof window.renderCourseDetail=="function"&&window.renderCourseDetail(n))};J&&J.addEventListener("change",e=>{const t=e.target.value;localStorage.setItem("language",t),updateLanguage(t)});const I=document.getElementById("theme-toggle"),q=document.body;function N(e){if(e==="light"?q.classList.add("light-mode"):q.classList.remove("light-mode"),I){const t=I.querySelector("svg");t&&(t.style.transform=e==="light"?"rotate(180deg)":"rotate(0deg)")}}const oe=localStorage.getItem("theme")||"dark";N(oe);I&&I.addEventListener("click",()=>{const t=q.classList.contains("light-mode")?"dark":"light";localStorage.setItem("theme",t),N(t)});window.programIds=["english","french","spanish","turkish","arabic","prompt_engineering","mcp_automations","ai_optimization","sports","chess","typing","free_neuro","free_ai","free_speed_reading","free_memory_hacking"];const te=window.programIds;window.loadProgramDetails=function(e){const t=localStorage.getItem("language")||"en",i=y[t]||y.en,n=document.getElementById("regular-detail"),s=document.getElementById("course-detail-shell");if(n&&(n.style.display="block"),s&&(s.style.display="none"),te.includes(e)){const o=`prog_detail_${e}_title`,r=`prog_detail_${e}_content`;if(i[o])document.getElementById("detail-title").innerText=i[o],document.getElementById("detail-content").innerHTML=i[r];else{const l=y.en;document.getElementById("detail-title").innerText=l[o]||"Program Not Found",document.getElementById("detail-content").innerHTML=l[r]||""}typeof injectSectionButtons=="function"&&injectSectionButtons()}else console.error("Content not found for id:",e),document.getElementById("detail-title")&&(document.getElementById("detail-title").innerText="Program Not Found")};window.renderCourseDetail=function(e){if(typeof KNOWLEDGE_DATA>"u")return;let t=e;if(!t){const a=new URLSearchParams(window.location.search);t=a.get("course")||a.get("id");const d=a.get("course_id");if(d&&!t){const v=KNOWLEDGE_DATA.freeCourses.find(h=>h.id==d||h.course_id==d);v&&(t=v.slug)}}if(!t)return;const i=KNOWLEDGE_DATA.freeCourses.find(a=>a.slug===t);if(!i){document.getElementById("detail-title")&&(document.getElementById("detail-title").innerText="Course Not Found");return}i.full_lessons=KNOWLEDGE_DATA.lessonsData[t]||[],i.learning_objectives=i.learningObjectives||[];const n=localStorage.getItem("language")||"en",s=y[n]||y.en,o=document.getElementById("regular-detail"),r=document.getElementById("course-detail-shell");o&&(o.style.display="none"),r&&(r.style.display="block");let l=`
    <section class="cd-hero">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem;">
            <a href="knowledge.html" style="color: var(--color-primary); text-decoration:none; font-size:0.9rem; display:inline-flex; align-items:center; gap:6px; margin-bottom:1.5rem; opacity:0.8;">
                ${s.back_to_kh}
            </a>
            <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
                <span style="font-size:3.5rem; line-height:1;">${i.icon}</span>
                <div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
                        ${i.tags.map(a=>`<span class="kh-tag kh-tag--${a.toLowerCase()}">${a}</span>`).join("")}
                    </div>
                    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; margin:0; line-height:1.2;">${i.title}</h1>
                </div>
            </div>
            <p style="font-size:1.1rem; opacity:0.8; max-width:700px; line-height:1.7; margin:1rem 0 1.5rem;">${i.desc}</p>
            <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.95rem; opacity:0.7;">
                <span>📖 ${i.lessons} ${s.lessons_count}</span>
                <span>⏱ ${i.duration}</span>
                <span>👤 ${i.instructor}</span>
            </div>
        </div>
    </section>

    <section style="padding:2rem 0 4rem;">
        <div class="container" style="max-width:1100px; margin:0 auto; padding:0 1.5rem; display:grid; grid-template-columns: 1fr 340px; gap:2.5rem; align-items:start;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h2 style="font-size:1.6rem; font-weight:700; margin:0;">${s.course_lessons}</h2>
                    <div class="focus-toggle" id="focus-toggle-btn">
                        <span style="font-size:1.2rem;">👁️</span>
                        <span style="font-size:0.9rem; font-weight:600; color:var(--color-primary);">${s.focus_mode}</span>
                    </div>
                </div>

                <div class="lessons-container">
                    ${i.full_lessons?i.full_lessons.map(a=>`
                        <div class="cd-lesson">
                            <button class="cd-lesson-header" style="width:100%; background:none; border:none; color:inherit; padding:1.2rem 1.5rem; cursor:pointer; display:flex; align-items:center; gap:1rem; text-align:left;">
                                <span style="background: var(--color-primary); color:#fff; font-weight:800; min-width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:0.95rem;">${a.num}</span>
                                <div style="flex:1;">
                                    <div style="font-weight:600; font-size:1.05rem;">${a.title}</div>
                                    <div style="font-size:0.8rem; opacity:0.5; margin-top:2px;">⏱ ${a.duration}</div>
                                </div>
                                <svg class="cd-chevron" style="width:20px; height:20px; opacity:0.4; transition:transform 0.3s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            <div class="cd-lesson-body" style="display:none;">
                                <div style="background:rgba(16,185,129,0.06); border-left:3px solid var(--color-primary); padding:1rem 1.2rem; border-radius:0 12px 12px 0; margin-bottom:1.5rem;">
                                    <p style="margin:0; font-size:0.95rem; line-height:1.6; opacity:0.85;">${a.overview}</p>
                                </div>
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#60a5fa; margin-bottom:0.7rem;">${s.key_points}</h4>
                                    <ul style="margin:0; padding:0; list-style:none;">
                                        ${a.key_points.map(d=>`<li style="padding:0.4rem 0 0.4rem 1.5rem; position:relative; font-size:0.9rem; line-height:1.5; opacity:0.85;"><span style="position:absolute; left:0; color:var(--color-primary);">✓</span>${d}</li>`).join("")}
                                    </ul>
                                </div>
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#fbbf24; margin-bottom:0.7rem;">${s.vocabulary}</h4>
                                    <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                                        ${a.vocabulary.map(d=>`<span style="background:rgba(251,191,36,0.1); color:#fbbf24; padding:4px 10px; border-radius:8px; font-size:0.8rem; font-weight:500;">${d}</span>`).join("")}
                                    </div>
                                </div>
                                ${a.grammar_focus?`
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#c084fc; margin-bottom:0.7rem;">${s.grammar_focus}</h4>
                                    <p style="margin:0; font-size:0.9rem; line-height:1.6; opacity:0.85; background:rgba(168,85,247,0.06); padding:0.8rem 1rem; border-radius:10px;">${a.grammar_focus}</p>
                                </div>`:""}
                                <div style="margin-bottom:1.5rem;">
                                    <h4 style="font-size:0.9rem; font-weight:700; color:#f472b6; margin-bottom:0.7rem;">${s.practice_exercises}</h4>
                                    <ol style="margin:0; padding-left:1.3rem;">
                                        ${a.practice.map(d=>`<li style="padding:0.3rem 0; font-size:0.9rem; line-height:1.5; opacity:0.85;">${d}</li>`).join("")}
                                    </ol>
                                </div>
                                <div style="background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.15); padding:1rem 1.2rem; border-radius:12px;">
                                    <div style="font-weight:600; font-size:0.85rem; color:#fbbf24; margin-bottom:0.3rem;">${s.cultural_tip}</div>
                                    <p style="margin:0; font-size:0.88rem; line-height:1.6; opacity:0.8;">${a.cultural_tip}</p>
                                </div>
                            </div>
                        </div>
                    `).join(""):`<p>${s.coming_soon}</p>`}
                </div>

                <div style="margin-top: 3rem; text-align: center; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button id="start-nsdr-btn" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <span>🧘‍♀️</span> ${s.btn_nsdr}
                    </button>
                </div>
            </div>

            <aside>
                <div style="background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem; margin-bottom:1.5rem;">
                    <div style="font-weight:700; font-size:1.1rem; margin-bottom:1rem;">${s.course_progress}</div>
                    <div style="background:rgba(255,255,255,0.06); border-radius:10px; height:10px; overflow:hidden; margin-bottom:0.5rem;">
                        <div style="background:var(--color-primary); height:100%; width:0%;"></div>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem;">
                    <div style="font-weight:700; font-size:1.1rem; margin-bottom:1rem;">${s.learning_objectives}</div>
                    <ul style="margin:0; padding:0; list-style:none;">
                        ${i.learning_objectives.map(a=>`<li style="padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:0.85rem; opacity:0.8;">✓ ${a}</li>`).join("")}
                    </ul>
                </div>
            </aside>
        </div>
    </section>
    `;r&&(r.innerHTML=l),typeof window.injectSectionButtons=="function"&&window.injectSectionButtons(),r.querySelectorAll(".cd-lesson-header").forEach(a=>{a.addEventListener("click",()=>{const d=a.closest(".cd-lesson"),v=d.querySelector(".cd-lesson-body");d.classList.contains("open")?(v.style.display="none",d.classList.remove("open")):(v.style.display="block",d.classList.add("open"))})});const g=document.getElementById("focus-toggle-btn");g&&g.addEventListener("click",()=>{document.body.classList.toggle("focus-active");const a=document.body.classList.contains("focus-active");g.style.background=a?"var(--color-primary)":"rgba(16,185,129,0.1)",g.querySelector("span:last-child").style.color=a?"#fff":"var(--color-primary)"});const f=document.getElementById("start-nsdr-btn");f&&f.addEventListener("click",ae)};window.renderKnowledgeHub=function(){if(typeof KNOWLEDGE_DATA>"u")return;const e=document.getElementById("notebooks-grid");e&&(e.innerHTML=KNOWLEDGE_DATA.notebooks.map(n=>`
            <div class="kh-notebook-card kh-notebook--${n.color}">
                <div class="kh-notebook-glow"></div>
                <div class="kh-notebook-icon">${n.icon}</div>
                <h3>${n.title}</h3>
                <p>${n.desc}</p>
                <div class="kh-notebook-badges">
                    <span class="kh-badge kh-badge--${n.color}">${n.sources} Sources</span>
                    <span class="kh-badge kh-badge--${n.color}">${n.badge_label}</span>
                </div>
                <div class="kh-notebook-actions">
                    <a href="${n.link}" target="_blank" class="btn btn-primary">Open Notebook →</a>
                    <button class="btn btn-secondary kh-ask-ai-btn" data-notebook="${n.id}">Ask AI</button>
                </div>
            </div>
        `).join(""),e.querySelectorAll(".kh-ask-ai-btn").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.notebook,o=document.getElementById("kh-ask-input");o&&(o.focus(),o.scrollIntoView({behavior:"smooth",block:"center"}),o.placeholder=`Ask about ${s}...`)})}));const t=document.getElementById("courses-grid");t&&(t.innerHTML=KNOWLEDGE_DATA.freeCourses.map(n=>`
            <div class="kh-course-card" data-tags="${n.tags.join(",")},${n.category}">
                <div class="kh-course-icon">${n.icon}</div>
                <div class="kh-course-tags">
                    ${n.tags.map(s=>`<span class="kh-tag kh-tag--${s.toLowerCase()}">${s}</span>`).join("")}
                </div>
                <h3>${n.title}</h3>
                <p>${n.desc}</p>
                <div class="kh-course-meta">
                    <span>📖 ${n.lessons} lessons</span>
                    <span>⏱ ${n.duration}</span>
                </div>
                <a href="detail.html?course=${n.slug}" class="btn btn-primary">Start Free ✦</a>
            </div>
            `).join(""));const i=document.getElementById("mini-lessons-grid");i&&(i.innerHTML=KNOWLEDGE_DATA.miniLessons.map(n=>`
            <div class="kh-mini-card">
                <div class="kh-mini-icon">${n.icon}</div>
                <div class="kh-mini-info">
                    <h4>${n.title}</h4>
                    <div class="kh-mini-meta">
                        <span class="kh-mini-type">${n.type}</span>
                        <span class="kh-mini-duration">${n.duration}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-primary">▶</button>
            </div >
            `).join("")),document.querySelectorAll(".kh-filter-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".kh-filter-tab").forEach(o=>o.classList.remove("active")),n.classList.add("active");const s=n.dataset.filter.toLowerCase();document.querySelectorAll(".kh-course-card").forEach(o=>{const r=o.dataset.tags.toLowerCase();s==="all"||r.includes(s)?o.style.display="flex":o.style.display="none"})})})};function ae(){const e=document.getElementById("nsdr-overlay");if(!e)return;e.style.display="flex";let t=1200;const i=document.getElementById("nsdr-timer"),n=setInterval(()=>{if(e.style.display==="none"){clearInterval(n);return}t--;const o=Math.floor(t/60).toString().padStart(2,"0"),r=(t%60).toString().padStart(2,"0");i&&(i.innerText=`${o}:${r} `),t<=0&&clearInterval(n)},1e3),s=document.getElementById("exit-nsdr");s&&(s.onclick=()=>e.style.display="none")}I&&I.addEventListener("click",()=>{isLight=!isLight,isLight?(q.classList.add("light-mode"),localStorage.setItem("theme","light")):(q.classList.remove("light-mode"),localStorage.setItem("theme","dark"));const e=I.querySelector("svg");e.style.transform=isLight?"rotate(180deg)":"rotate(0deg)"});const re=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("visible")})},{threshold:.1});document.querySelectorAll(".about-card, .program-card, .section-title, .hero-content").forEach((e,t)=>{e.style.opacity="0",e.style.transform="translateY(20px)",e.style.transition="all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",e.style.transitionDelay=`${t*.05} s`,re.observe(e)});const ne=document.createElement("style");ne.innerHTML=`
            .visible { opacity: 1!important; transform: translateY(0)!important; }
        `;document.head.appendChild(ne);function le(e,t,i=""){const s=performance.now(),o=t%1!==0;function r(l){const g=l-s,f=Math.min(g/2e3,1),a=1-Math.pow(1-f,3),d=Math.round(a*t);e.textContent=(o?d:d.toLocaleString())+i,f<1&&requestAnimationFrame(r)}requestAnimationFrame(r)}const ie=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.querySelectorAll(".stat-value").forEach(n=>{const o=n.textContent.trim().match(/^([\d,]+\.?\d*)\s*(.*)$/);if(o){const r=parseFloat(o[1].replace(/,/g,"")),l=o[2]||"";n.textContent="0"+l,le(n,r,l)}}),ie.unobserve(t.target))})},{threshold:.3}),Q=document.querySelector(".stats-grid");Q&&ie.observe(Q);const A=document.querySelector(".header");A&&window.addEventListener("scroll",()=>{window.scrollY>50?(A.style.padding="0.5rem 0",A.style.boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"):(A.style.padding="var(--spacing-sm) 0",A.style.boxShadow="none")},{passive:!0});const $=document.createElement("button");$.className="back-to-top";$.setAttribute("aria-label","Back to top");$.innerHTML='< svg width = "20" height = "20" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" stroke - width="2.5" stroke - linecap="round" stroke - linejoin="round" > <path d="M18 15l-6-6-6 6" /></svg > ';document.body.appendChild($);$.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});window.addEventListener("scroll",()=>{window.scrollY>500?$.classList.add("visible"):$.classList.remove("visible")},{passive:!0});const H=document.getElementById("neural-bg");if(H){let r=function(){t=H.width=window.innerWidth,i=H.height=window.innerHeight},g=function(){n=[];for(let a=0;a<s;a++)n.push(new l)},f=function(){e.clearRect(0,0,t,i);for(let a=0;a<n.length;a++){let d=n[a];d.update(),d.draw();for(let v=a;v<n.length;v++){let h=n[v],T=d.x-h.x,b=d.y-h.y,C=Math.sqrt(T*T+b*b);if(C<o){e.beginPath();let M=1-C/o;document.body.classList.contains("light-mode")?e.strokeStyle="rgba(16, 185, 129, "+M*.4+")":e.strokeStyle="rgba(16, 185, 129, "+M*.2+")",e.lineWidth=1,e.moveTo(d.x,d.y),e.lineTo(h.x,h.y),e.stroke()}}}requestAnimationFrame(f)};const e=H.getContext("2d");let t,i,n=[];const s=60,o=150;class l{constructor(){this.x=Math.random()*t,this.y=Math.random()*i,this.vx=(Math.random()-.5)*1.5,this.vy=(Math.random()-.5)*1.5,this.size=Math.random()*2+1,this.color=Math.random()>.5?"rgba(16, 185, 129, ":"rgba(251, 191, 36, "}update(){this.x+=this.vx,this.y+=this.vy,(this.x<0||this.x>t)&&(this.vx*=-1),(this.y<0||this.y>i)&&(this.vy*=-1)}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=this.color+"0.5)",e.fill()}}window.addEventListener("resize",()=>{r(),g()}),r(),g(),f()}(function(){emailjs.init("YavoYlqtomBUxbpMr")})();const j=document.querySelector(".contact-form");j&&j.addEventListener("submit",function(e){e.preventDefault();const t=j.querySelector('button[type="submit"]'),i=t.innerText;t.innerText="Sending...",t.disabled=!0,emailjs.sendForm("scientiservice","contact_form",this).then(()=>{t.innerText="Message Sent!",t.style.backgroundColor="var(--color-primary)",j.reset(),setTimeout(()=>{t.innerText=i,t.disabled=!1,t.style.backgroundColor=""},3e3)},o=>{t.innerText="Error!",t.style.backgroundColor="red",console.log("FAILED...",o),alert("Failed to send message. Please check the console or try again later. (Did you update the API keys?)"),setTimeout(()=>{t.innerText=i,t.disabled=!1,t.style.backgroundColor=""},3e3)})});const G=[];let Y=!1,F=!1;function O(){return{input:document.getElementById("chat-input"),messages:document.getElementById("chat-messages")}}function ce(e){e.key==="Enter"&&R()}async function R(){const{input:e,messages:t}=O();if(!e||!t)return;const i=e.value.trim();if(i){W(i,"user"),e.value="",e.disabled=!0,G.push({role:"user",content:i}),pe();try{const n=await V.chat(G);ee();const s=n.reply;G.push({role:"assistant",content:s}),W(s,"bot")}catch{ee(),W("Sorry, something went wrong. Please try again.","bot")}finally{e.disabled=!1,e.focus()}}}function de(e){const{input:t}=O();t&&(t.value=e,R())}function me(e){if(!e)return"";let t=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^- (.*)$/gm,"<li>$1</li>").replace(/`(.*?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return t=t.replace(/\*\*/g,"").replace(/\[(.*?)\]/g,"$1"),t}function W(e,t){const{messages:i}=O();if(!i)return;const n=document.createElement("div");n.className=`message ${t} `;let s=me(e);n.innerHTML=s,i.appendChild(n),i.scrollTop=i.scrollHeight}function Z(){try{const e=document.getElementById("mic-btn");e&&(e.style.display="none");const t=document.getElementById("live-mode-toggle");t&&(t.onclick=X);const i=document.getElementById("stop-live-btn");i&&(i.onclick=()=>X(!1))}catch(e){console.error("Error in initVoiceFeatures:",e)}}function ue(e){Y=e;const t=document.getElementById("mic-btn");t&&t.classList.toggle("active",Y);const i=document.getElementById("live-status-text");i&&F&&(i.textContent=Y?"Listening...":"Scienti is Thinking...")}function ge(e){console.info("Browser speech synthesis is disabled. Use Gemini Live mode for voice conversation.")}function X(e){F=typeof e=="boolean"?e:!F;const i=document.getElementById("live-overlay"),n=document.getElementById("live-mode-toggle");F?(i.style.display="flex",n.classList.add("active"),localStorage.setItem("voice_enabled","true"),window.startLiveSession?window.startLiveSession():(console.error("Voice Client not loaded"),alert("Voice features are initializing. Please try again in a moment."),X(!1))):(i.style.display="none",n.classList.remove("active"),window.stopLiveSession&&window.stopLiveSession(),ue(!1))}function pe(){const{messages:e}=O();if(!e)return;const t=document.createElement("div");t.className="typing-indicator",t.id="typing-indicator",t.innerHTML=`
            < div class="typing-dot" ></div >
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        `,e.appendChild(t),e.scrollTop=e.scrollHeight}function ee(){const e=document.getElementById("typing-indicator");e&&e.remove()}function fe(){if(document.getElementById("scienti-fab")||!document.body)return;const e=document.createElement("div");e.innerHTML=`
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
    `,document.body.append(...e.children)}function ye(){fe();const e=document.getElementById("scienti-fab"),t=document.getElementById("scienti-quick-window"),i=document.getElementById("close-scienti-window"),n=document.getElementById("send-scienti-btn"),s=document.getElementById("scienti-quick-input"),o=document.getElementById("scienti-chat-body"),r=document.getElementById("scienti-window-drag-handle"),l=document.getElementById("quick-live-mode-toggle"),g=document.getElementById("quick-live-overlay"),f=document.getElementById("quick-stop-live-btn");if(!e||!t||!n||!s||!o||e.dataset.initialized==="true")return;e.dataset.initialized="true";function a(){const c=[".section-title",".hero-title",".subsection-title",".article-title",".kh-notebook-card h3",".kh-mini-card h4",".about-card h3",".program-card h3",".pricing-card h3",".pricing-header h3",".faq-item h4","#detail-title",".cd-lesson-header div div"];document.querySelectorAll(c.join(", ")).forEach(u=>{if(u.querySelector(".section-chat-btn")||u.closest(".scienti-window"))return;const p=document.createElement("button");p.className="scienti-chat-trigger section-chat-btn",p.innerHTML="<span>🧠</span> Ask Scienti",p.title="Ask Scienti about this section",p.addEventListener("click",E=>{E.stopPropagation();const x=u.innerText.replace("Ask Scienti","").trim();h(`I'm looking at "${x}". Can you explain how this helps my learning or give me more details about it?`)}),u.appendChild(p)})}const d=new MutationObserver(c=>{let m=!1;c.forEach(u=>{u.addedNodes.length>0&&(m=!0)}),m&&a()});document.body&&d.observe(document.body,{childList:!0,subtree:!0});function v(c){return c?c.replace(/\n/g,"<br>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/`(.*?)`/g,"<code>$1</code>"):""}function h(c=null){t.style.display="flex",t.classList.add("active"),t.setAttribute("aria-hidden","false"),c&&(b(c,"user"),U(c)),s.focus()}function T(){t.style.display="none",t.classList.remove("active"),t.setAttribute("aria-hidden","true"),g&&(g.style.display="none"),l&&l.classList.remove("active"),window.stopLiveSession&&window.stopLiveSession()}function b(c,m){const u=document.createElement("div");u.className=`chat-msg ${m}`,m==="assistant"?u.innerHTML=v(c):u.innerText=c,o.appendChild(u),o.scrollTop=o.scrollHeight}function C(){const c=document.createElement("div");c.className="chat-msg assistant typing",c.id="scienti-quick-typing",c.innerHTML='<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>',o.appendChild(c),o.scrollTop=o.scrollHeight}function M(){const c=document.getElementById("scienti-quick-typing");c&&c.remove()}async function U(c){C();try{const m={messages:[{role:"user",content:c}],context:window.location.pathname,quick_chat:!0},u=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)});M();const p=await u.json().catch(()=>({}));if(!u.ok){b(p.reply||p.error||"I'm having trouble processing that right now. Please try again.","assistant");return}p.reply?b(p.reply,"assistant"):p.choices&&p.choices[0]?.message?.content?b(p.choices[0].message.content,"assistant"):b("I'm having trouble processing that right now. Please try again.","assistant")}catch(m){M(),console.error("Scienti Neural Error:",m),b("Neural connection lost. Please try again in a moment.","assistant")}}if(n&&s){const c=()=>{const m=s.value.trim();m&&(b(m,"user"),s.value="",U(m))};n.addEventListener("click",c),s.addEventListener("keypress",m=>{m.key==="Enter"&&c()})}if(r&&t){let D=function(w){p=w.clientX-x,E=w.clientY-_,(w.target===r||r.contains(w.target))&&(c=!0)},P=function(w){c&&(w.preventDefault(),m=w.clientX-p,u=w.clientY-E,x=m,_=u,t.style.transform=`translate3d(${m}px, ${u}px, 0)`)},K=function(){c=!1},c=!1,m,u,p,E,x=0,_=0;r.addEventListener("mousedown",D),document.addEventListener("mousemove",P),document.addEventListener("mouseup",K)}if(e){let P=function(k){E=k.clientX-_,x=k.clientY-D,(k.target===e||e.contains(k.target))&&(c=!0,m=!1)},K=function(k){c&&(k.preventDefault(),m=!0,u=k.clientX-E,p=k.clientY-x,_=u,D=p,e.style.transform=`translate3d(${u}px, ${p}px, 0)`)},w=function(){!m&&c&&(t.classList.contains("active")?T():h()),c=!1},c=!1,m=!1,u,p,E,x,_=0,D=0;e.addEventListener("mousedown",P),document.addEventListener("mousemove",K),document.addEventListener("mouseup",w)}i?.addEventListener("click",T),!window.startLiveSession||!window.stopLiveSession?l.style.display="none":(l.addEventListener("click",()=>{g.style.display="flex",l.classList.add("active"),window.startLiveSession()}),f?.addEventListener("click",()=>{g.style.display="none",l.classList.remove("active"),window.stopLiveSession()})),a()}window.handleChatInput=ce;window.sendMessage=R;window.sendSuggestion=de;window.speakText=ge;document.addEventListener("DOMContentLoaded",()=>{try{console.log("Scientifier: DOMContentLoaded fired"),se(),B=document.getElementById("mobile-menu-toggle"),L=document.getElementById("main-nav"),S=document.createElement("div"),S.className="menu-overlay",document.body.appendChild(S),B&&L&&(B.addEventListener("click",r=>{r.stopPropagation();const l=L.classList.contains("active");z(!l)}),L.querySelectorAll("a").forEach(r=>{r.addEventListener("click",()=>{z(!1)})}),S.addEventListener("click",()=>{z(!1)}),document.addEventListener("keydown",r=>{r.key==="Escape"&&L.classList.contains("active")&&z(!1)}));const e=r=>{try{return localStorage.getItem(r)}catch(l){return console.warn("LocalStorage access denied:",l),null}},t=localStorage.getItem("language")||"en",i=document.getElementById("language-select");if(i&&(i.value=t,!i.value&&i.options.length>0)){for(let r=0;r<i.options.length;r++)if(i.options[r].value===t){i.selectedIndex=r;break}}typeof updateLanguage=="function"?updateLanguage(t):console.error("updateLanguage function missing!"),typeof Z=="function"?Z():console.error("initVoiceFeatures function missing!"),ye();const n=e("theme")||"dark";typeof N=="function"&&N(n);const s=document.getElementById("newsletter-form");s&&s.addEventListener("submit",async r=>{r.preventDefault();const l=s.querySelector("button"),g=s.querySelector("input"),f=g.value;l.innerHTML='<span class="btn-spinner"></span>',l.disabled=!0;try{await V.subscribeNewsletter(f),l.innerHTML="&#10003; Subscribed!",l.classList.add("success"),g.value=""}catch(a){l.innerHTML="Error",console.error("Newsletter error",a)}finally{setTimeout(()=>{l.innerHTML="Subscribe",l.classList.remove("success"),l.disabled=!1},3e3)}}),typeof renderKnowledgeHub=="function"&&document.getElementById("notebooks-grid")&&renderKnowledgeHub();const o=document.querySelector(".contact-form");o&&o.addEventListener("submit",async r=>{r.preventDefault();const l=o.querySelector("button"),g=document.getElementById("name").value,f=document.getElementById("email").value,a=document.getElementById("message").value;l.innerHTML='<span class="btn-spinner"></span>',l.disabled=!0;try{await V.sendFeedback({name:g,email:f,message:a,subject:`Contact Form: ${g}`,category:"other"}),o.innerHTML=`
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                            <h3 style="margin-bottom: 0.5rem;">Ignition Successful!</h3>
                            <p style="color: var(--color-text-muted);">Our team has received your message and will reach out shortly to help you evolve.</p>
                            <button class="btn btn-secondary" style="margin-top: 1.5rem;" onclick="location.reload()">Send Another</button>
                        </div>
                    `}catch(d){l.innerHTML="Error. Try again",l.disabled=!1,console.error("Contact error",d)}}),console.log("Scientifier initialized successfully.")}catch(e){console.error("Critical error during initialization:",e)}});
