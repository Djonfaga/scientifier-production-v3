import"./voice-client-DhlfJVqx.js";import"./script-JMLIZS3t.js";import{B as a}from"./blog_data-Com_ImP4.js";document.addEventListener("DOMContentLoaded",()=>{const n=new URLSearchParams(window.location.search),i=n.get("post")||n.get("slug"),e=document.getElementById("blog-detail-container");if(!i||!a){e.innerHTML='<div class="not-found"><h2>Article Not Found</h2><a href="blog.html" class="link-primary">← Return to Blog</a></div>';return}const t=a.find(s=>s.slug===i);if(!t){e.innerHTML='<div class="not-found"><h2>Article Not Found</h2><p>The post you are looking for does not exist.</p><a href="blog.html" class="link-primary">← Return to Blog</a></div>';return}document.title=`${t.title} - Scientifier Blog`,e.innerHTML=`
                <article class="blog-article fade-in">
                    <!-- Hero Section -->
                    <section class="article-hero" style="background: ${t.gradient};">
                        <div class="container">
                            <div class="article-header">
                                <span class="article-category">${t.category}</span>
                                <h1 class="article-title">${t.title}</h1>
                                <div class="article-meta">
                                    <span>📅 ${t.date}</span>
                                    <span>⏱️ ${t.read_time}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Article Content -->
                    <section class="content-section">
                        <div class="container">
                            <div class="article-content">
                                ${t.content}
                            </div>

                            <!-- CTA Section -->
                            <div class="article-cta">
                                <h3>Ready to Apply These Insights?</h3>
                                <p>Join thousands learning with science-backed methods on Scientifier.</p>
                                <div class="cta-buttons">
                                    <a href="pricing.html" class="btn btn-primary">Start Free Trial</a>
                                    <a href="blog.html" class="btn btn-secondary">← Back to Blog</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </article>
            `});
