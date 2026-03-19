import{a as d}from"./voice-client-DhlfJVqx.js";import"./script-JMLIZS3t.js";let i="users";async function c(){try{const e=await d.getProfile();if(!e.is_staff&&!e.is_superuser){alert("Access Denied: You are not an administrator."),window.location.href="dashboard.html";return}}catch{window.location.href="login.html";return}l(),o("users")}function l(){const e=document.querySelectorAll(".admin-tab");e.forEach(r=>{r.addEventListener("click",()=>{r.dataset.tab!==i&&(e.forEach(a=>a.classList.remove("active")),r.classList.add("active"),i=r.dataset.tab,o(i))})})}async function o(e){const r=document.getElementById("admin-content");r.innerHTML='<div style="text-align: center; padding: 3rem;"><div class="loader"></div><p>Loading...</p></div>';try{if(e==="users"){const a=await d.getAdminUsers();m(a)}else if(e==="feedback"){const a=await d.getAdminFeedback();h(a)}else e==="stats"&&g()}catch(a){r.innerHTML=`<div style="color: var(--color-error); padding: 2rem;">Error loading data: ${a.message||"Unknown error"}</div>`}}function m(e){const r=document.getElementById("admin-content");if(!e||e.length===0){r.innerHTML="<p>No users found.</p>";return}let a=`
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
    `;e.forEach(t=>{const n=t.progress||{},s=`badge-${t.subscription_tier||"free"}`;a+=`
            <tr>
                <td><strong>${t.first_name} ${t.last_name}</strong><br><small>@${t.username}</small></td>
                <td>${t.email}</td>
                <td><span class="badge ${s}">${t.subscription_tier||"free"}</span></td>
                <td>${n.total_xp||0}</td>
                <td>${n.level||1}</td>
                <td>🔥 ${n.current_streak||0}</td>
                <td>${new Date(t.created_at).toLocaleDateString()}</td>
            </tr>
        `}),a+="</tbody></table>",r.innerHTML=a}function h(e){const r=document.getElementById("admin-content");if(!e||e.length===0){r.innerHTML="<p>No feedback received yet.</p>";return}let a=`
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
    `;e.forEach(t=>{const n=t.is_read?"":"status-unread",s=`badge-${t.category}`;a+=`
            <tr class="${n}">
                <td>${new Date(t.created_at).toLocaleDateString()}</td>
                <td>${t.name||"Anonymous"}<br><small>${t.email}</small></td>
                <td><strong>${t.subject}</strong></td>
                <td><div class="feedback-msg" title="${t.message}">${t.message}</div></td>
                <td><span class="badge ${s}">${t.category}</span></td>
                <td>
                    ${t.is_read?"Read":`<button class="btn btn-secondary btn-sm" onclick="markRead(${t.id}, this)">Mark Read</button>`}
                </td>
            </tr>
        `}),a+="</tbody></table>",r.innerHTML=a,window.markRead=async(t,n)=>{try{await d.markFeedbackRead(t),n.parentElement.innerHTML="Read",n.closest("tr").classList.remove("status-unread")}catch(s){console.error(s)}}}function g(){const e=document.getElementById("admin-content");e.innerHTML=`
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
    `}document.addEventListener("DOMContentLoaded",c);
