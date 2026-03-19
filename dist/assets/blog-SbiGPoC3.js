import"./voice-client-DhlfJVqx.js";import"./script-JMLIZS3t.js";import{B as i}from"./blog_data-Com_ImP4.js";document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("blog-grid");if(e&&i){let t="";i.forEach(a=>{t+=`
                    <article class="blog-card fade-in">
                        <div class="blog-image" style="background: ${a.gradient};"></div>
                        <div class="blog-content">
                            <span class="blog-category">${a.category}</span>
                            <h2>${a.title}</h2>
                            <p>${a.excerpt}</p>
                            <div class="blog-meta">
                                <span>📅 ${a.date}</span>
                                <span>⏱️ ${a.read_time}</span>
                            </div>
                            <a href="blog_detail.html?post=${a.slug}" class="link-primary">Read More →</a>
                        </div>
                    </article>`}),e.innerHTML=t}});
