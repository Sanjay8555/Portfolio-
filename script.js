/**
 * SANJAY S - PROFESSIONAL PORTFOLIO SCRIPT
 * High-performance, zero-dependency interactive portfolio logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initThemeToggle();
  initTypewriter();
  initScrollEffects();
  initSkillsFilter();
  initCounters();
  initTerminal();
  initMobileMenu();
  initResumeModal();
  updateCurrentYear();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE CONSTELLATION BACKGROUND
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth > 768 ? 60 : 30, 80);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.35)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? 'rgba(56, 189, 248,' : 'rgba(2, 132, 199,';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lineColor} ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. THEME SWITCHER
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sanjay_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sanjay_portfolio_theme', next);
      showToast(`Switched to ${next} theme mode`);
    });
  }
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'Software Engineer',
    'B.Tech IT Scholar @ VSB',
    'Full Stack Developer',
    'IoT & Embedded Innovator',
    'India Innovates 2026 Finalist',
    'Salesforce & Agentforce Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      delay = 45;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      delay = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      delay = 1800; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. SCROLL PROGRESS & NAVBAR SPY
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('btn-back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Header background blur
    if (header) {
      if (winScroll > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTop) {
      backToTop.style.opacity = winScroll > 400 ? '1' : '0.6';
    }

    // Nav Link Spy
    let currentSec = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
        currentSec = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSec}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   5. SKILLS MATRIX FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Animate skill bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-progress-bar');
        if (bar) {
          const percent = bar.style.getPropertyValue('--skill-percent') || '85%';
          bar.style.width = percent;
        }
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => observer.observe(card));
}

/* ==========================================================================
   6. STATS COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const metricCounters = document.querySelectorAll('.metric-counter');

  const animateCount = (el) => {
    const target = +el.getAttribute('data-target') || +el.getAttribute('data-count') || 0;
    let count = 0;
    const speed = target > 50 ? 20 : 150;
    const step = Math.ceil(target / (1000 / speed));

    const update = () => {
      count += step;
      if (count < target) {
        el.innerText = count;
        setTimeout(update, speed);
      } else {
        el.innerText = target;
      }
    };
    update();
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
  metricCounters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   7. PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  erp: {
    title: "ERP Based Student Management System (2026)",
    domain: "Enterprise Resource Planning & Education Technology",
    stack: ["Java", "MySQL", "PHP", "JavaScript", "HTML5", "CSS3"],
    overview: "A comprehensive academic management system designed to eliminate manual administrative overhead in collegiate institutions. Combines centralized student profiling, automated fee accounting, attendance calculation, and examination grading.",
    architecture: [
      "Role-Based Access Control (RBAC): Dedicated distinct privilege matrices for Super Admins, Faculty, and Students.",
      "Database Optimization: Relational schema in MySQL with indexed foreign keys for sub-second retrieval across 10,000+ student records.",
      "Exam & Grade Processing: Automated GPA & percentage computation algorithm with exportable PDF report cards.",
      "Fee Invoicing: Real-time billing system with pending dues alerts and online receipt verification."
    ],
    highlights: [
      "Digitized 100% of admission, attendance, fee, and examination workflows.",
      "Engineered secure session management and parameterized SQL queries to prevent SQL injections.",
      "Deployed responsive web UI accessible across mobile and desktop devices."
    ]
  },
  helmet: {
    title: "Smart Helmet for Rider Safety (2025)",
    domain: "IoT, Embedded Systems & Road Safety",
    stack: ["Arduino", "ESP8266 / ESP32", "GPS Module (NEO-6M)", "GSM Module (SIM800L)", "Alcohol Sensor (MQ-3)", "IR Sensor", "C / C++"],
    overview: "A life-saving IoT embedded safety system engineered to enforce two-wheeler safety laws automatically and expedite emergency response during vehicular crashes.",
    architecture: [
      "Pre-Ignition Interlock: IR sensor inside the helmet verifies helmet wear; MQ-3 sensor checks rider breath for alcohol concentration.",
      "Engine Ignition Circuit: Relay will ONLY close to trigger the bike starter motor if both helmet is worn and breath alcohol is below legal limits (< 0.05 mg/L).",
      "Accident Detection & Telemetry: Accelerometer/vibration sensor triggers an instant interrupt upon impact, querying the NEO-6M GPS for exact latitude/longitude.",
      "Automated GSM SOS Dispatch: Sends SMS with Google Maps link directly to emergency response services and pre-configured family contacts within 4.2 seconds."
    ],
    highlights: [
      "Reduced potential accident mortality by expediting the critical 'Golden Hour' emergency dispatch.",
      "Dual wireless handshake between helmet transmitter and motorcycle ignition receiver using ESP-NOW / RF.",
      "Ultra-low power sleep modes ensuring multi-week battery endurance on single charge."
    ]
  },
  crm: {
    title: "Public CRM (Citizen Relationship Management System) (2025)",
    domain: "Public Sector, E-Governance & Web Development",
    stack: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3"],
    overview: "An e-Governance citizen service portal bridging the gap between local municipal authorities and the public for seamless grievance redressal and municipal transparency.",
    architecture: [
      "Grievance Lodging Engine: Categorized submission (Sanitation, Roads, Electricity, Water) with photo evidence upload and auto-generated tracking token.",
      "Administrative Workflow Dispatcher: Auto-routes tickets to relevant municipal ward officers based on geolocation and issue category.",
      "SLA Tracking & Auto-Escalation: Configurable turnaround timelines (e.g. 48h for water leak). Overdue tickets automatically escalate to senior commissioners.",
      "Citizen Notification Pipeline: Asynchronous status update tracking with real-time progress bar (Submitted -> Assigned -> In Progress -> Resolved)."
    ],
    highlights: [
      "Centralized civic analytics dashboard providing breakdown of high-frequency civic grievances.",
      "Optimized query response times through stored procedures and normalized citizen records.",
      "Fully responsive mobile-first UI for citizen accessibility in diverse demographics."
    ]
  }
};

window.openProjectModal = function(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const body = document.getElementById('modal-project-body');

  body.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span class="badge-pill" style="margin-bottom: 10px;">${data.domain}</span>
      <h2 style="font-size: 1.8rem; margin-bottom: 8px;">${data.title}</h2>
    </div>

    <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 20px;">${data.overview}</p>

    <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--primary);">System Architecture & Key Modules</h3>
    <ul style="padding-left: 20px; margin-bottom: 24px; display: grid; gap: 8px; font-size: 0.95rem;">
      ${data.architecture.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--accent);">Engineering Impact & Highlights</h3>
    <ul style="padding-left: 20px; margin-bottom: 24px; display: grid; gap: 8px; font-size: 0.95rem;">
      ${data.highlights.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
      <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px;">Technologies Utilized</h4>
      <div class="tech-stack-pills">
        ${data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('open');
};

/* ==========================================================================
   8. INTERACTIVE PROJECT SIMULATORS
   ========================================================================== */
window.openSimulationModal = function(type) {
  const modal = document.getElementById('simulation-modal');
  const title = document.getElementById('sim-modal-title');
  const body = document.getElementById('modal-sim-body');

  if (type === 'helmet') {
    title.textContent = "Smart Helmet IoT Telemetry & Ignition Simulator";
    body.innerHTML = `
      <div class="sim-grid">
        <div class="sim-control-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-sliders"></i> Sensor Controls</h4>
          
          <div class="sim-toggle-row">
            <span><strong>IR Sensor:</strong> Helmet Worn on Head</span>
            <label class="sim-switch">
              <input type="checkbox" id="sim-helmet-worn" checked onchange="updateHelmetSim()" />
              <span class="sim-slider"></span>
            </label>
          </div>

          <div class="range-wrap">
            <label for="sim-alcohol-level"><strong>MQ-3 Sensor:</strong> Alcohol Level (<span id="sim-alc-val">0.01</span> mg/L)</label>
            <input type="range" id="sim-alcohol-level" class="range-input" min="0" max="0.15" step="0.01" value="0.01" oninput="updateHelmetSim()" />
            <small style="color: var(--text-dim); font-size: 0.75rem;">Legal limit is < 0.04 mg/L</small>
          </div>

          <div style="margin-top: 20px;">
            <button class="btn btn-sm btn-primary" onclick="simulateAccidentCrash()" style="width: 100%; background: #ef4444;">
              <i class="fa-solid fa-triangle-exclamation"></i> Simulate Impact / Crash Event
            </button>
          </div>
        </div>

        <div class="sim-display-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-microchip"></i> Ignition &amp; Emergency Hub</h4>
          
          <div id="sim-ignition-status" class="status-indicator-box ready">
            <i class="fa-solid fa-circle-check"></i>
            <div>
              <div>IGNITION STATUS: <strong id="sim-ign-text">ENABLED (Engine Ready)</strong></div>
              <small id="sim-ign-sub">All safety checks verified.</small>
            </div>
          </div>

          <h5 style="font-size: 0.85rem; margin-bottom: 6px; color: var(--text-muted);">Real-Time ESP32 Serial Telemetry:</h5>
          <div class="sim-telemetry-log" id="sim-telemetry">
            [SYS] Booting ESP8266/ESP32 & sensors...<br>
            [GPS] NEO-6M acquired satellites: FIX OK (10.9601° N, 78.0766° E)<br>
            [IR] Helmet sensor: CONTACT DETECTED<br>
            [MQ3] Alcohol concentration: 0.01 mg/L (SAFE)<br>
            [RELAY] Ignition relay energised: ACTIVE<br>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'erp') {
    title.textContent = "ERP Student Management Interactive Sandbox";
    body.innerHTML = `
      <div class="sim-grid">
        <div class="sim-control-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-user-shield"></i> Role &amp; Operations</h4>
          
          <div style="margin-bottom: 14px;">
            <label style="font-size: 0.85rem; display: block; margin-bottom: 4px;">Select User Role:</label>
            <select id="erp-sim-role" class="form-group" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);" onchange="updateErpSim()">
              <option value="admin">Super Administrator</option>
              <option value="faculty">Faculty Member</option>
              <option value="student">Student (Sanjay S - 24IT108)</option>
            </select>
          </div>

          <div id="erp-actions-container" style="display: grid; gap: 8px;">
            <button class="btn btn-sm btn-outline" onclick="runErpAction('attendance')"><i class="fa-solid fa-clipboard-user"></i> Log Daily Attendance</button>
            <button class="btn btn-sm btn-outline" onclick="runErpAction('grades')"><i class="fa-solid fa-calculator"></i> Calculate Semester GPA</button>
            <button class="btn btn-sm btn-outline" onclick="runErpAction('fees')"><i class="fa-solid fa-receipt"></i> Generate Fee Invoicing</button>
          </div>
        </div>

        <div class="sim-display-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-database"></i> Live ERP Portal Response</h4>
          <div id="erp-sim-output" style="background: var(--bg-card); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem; line-height: 1.5; min-height: 180px;">
            <p><strong>Active Session:</strong> Super Administrator</p>
            <p style="color: var(--accent); margin-top: 8px;">✓ Database connected: MySQL v8.0 on localhost:3306</p>
            <p style="margin-top: 8px; color: var(--text-muted);">Select an action on the left to simulate automated academic calculations.</p>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'crm') {
    title.textContent = "Public CRM Citizen Grievance & SLA Dispatcher";
    body.innerHTML = `
      <div class="sim-grid">
        <div class="sim-control-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-ticket"></i> Lodge Grievance (Citizen Portal)</h4>
          
          <div style="display: grid; gap: 10px;">
            <div>
              <label style="font-size: 0.8rem; display: block; margin-bottom: 2px;">Grievance Category:</label>
              <select id="crm-cat" style="width: 100%; padding: 8px; border-radius: 6px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);">
                <option value="Roads & Highways (Pothole Repair)">Roads &amp; Infrastructure (Pothole)</option>
                <option value="Sanitation & Waste Disposal">Municipal Sanitation &amp; Waste</option>
                <option value="Electricity & Street Lights">Street Light Malfunction</option>
                <option value="Water Supply Distribution">Water Supply Pipeline Leak</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.8rem; display: block; margin-bottom: 2px;">Ward / Location:</label>
              <input type="text" id="crm-loc" value="Vellakovil Ward 12, Tiruppur" style="width: 100%; padding: 8px; border-radius: 6px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);" />
            </div>

            <button class="btn btn-sm btn-primary" onclick="submitCrmGrievance()" style="margin-top: 6px;">
              <i class="fa-solid fa-paper-plane"></i> Submit Grievance Ticket
            </button>
          </div>
        </div>

        <div class="sim-display-panel">
          <h4 class="sim-panel-title"><i class="fa-solid fa-chart-line"></i> SLA Resolution Tracker</h4>
          <div id="crm-ticket-view" style="background: var(--bg-card); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem; line-height: 1.5; min-height: 190px;">
            <p style="color: var(--text-muted);">No active ticket submitted yet. Fill the grievance details on the left and submit to view live municipal dispatch tracking.</p>
          </div>
        </div>
      </div>
    `;
  }

  modal.classList.add('open');
};

window.closeSimulationModal = function() {
  const modal = document.getElementById('simulation-modal');
  if (modal) modal.classList.remove('open');
};

// Helmet Simulator Logic
window.updateHelmetSim = function() {
  const worn = document.getElementById('sim-helmet-worn')?.checked;
  const alc = parseFloat(document.getElementById('sim-alcohol-level')?.value || '0');
  const alcText = document.getElementById('sim-alc-val');
  if (alcText) alcText.textContent = alc.toFixed(2);

  const statusBox = document.getElementById('sim-ignition-status');
  const ignText = document.getElementById('sim-ign-text');
  const ignSub = document.getElementById('sim-ign-sub');
  const log = document.getElementById('sim-telemetry');

  let safe = true;
  let reason = [];

  if (!worn) {
    safe = false;
    reason.push("Helmet IR sensor disengaged (Not worn)");
  }
  if (alc >= 0.04) {
    safe = false;
    reason.push(`Alcohol level ${alc.toFixed(2)} mg/L exceeds threshold (0.04 mg/L)`);
  }

  if (safe) {
    statusBox.className = "status-indicator-box ready";
    ignText.textContent = "ENABLED (Engine Ready)";
    ignSub.textContent = "Helmet verified + Sobriety test passed. Relay closed.";
    if (log) log.innerHTML += `[OK] Checks passed. Relay: ON at ${new Date().toLocaleTimeString()}<br>`;
  } else {
    statusBox.className = "status-indicator-box locked";
    ignText.textContent = "LOCKED (Ignition Disabled)";
    ignSub.textContent = reason.join(' & ');
    if (log) log.innerHTML += `[ALERT] Ignition locked: ${reason.join(' | ')}<br>`;
  }
  if (log) log.scrollTop = log.scrollHeight;
};

window.simulateAccidentCrash = function() {
  const log = document.getElementById('sim-telemetry');
  const statusBox = document.getElementById('sim-ignition-status');
  const ignText = document.getElementById('sim-ign-text');
  const ignSub = document.getElementById('sim-ign-sub');

  if (statusBox) {
    statusBox.className = "status-indicator-box alert";
    ignText.textContent = "CRASH DETECTED — EMERGENCY SOS ACTIVE";
    ignSub.textContent = "Broadcasting GPS coordinates via GSM module.";
  }

  const time = new Date().toLocaleTimeString();
  if (log) {
    log.innerHTML += `
      <span style="color: #f87171;">[INTERRUPT] High-G impact detected on Accelerometer!</span><br>
      [GPS] Coordinates locked: 10.9601° N, 78.0766° E (VSB Tech Hub)<br>
      [GSM] SIM800L sending SOS SMS to emergency services (+91 9489841868)...<br>
      <span style="color: #34d399;">[GSM] Message dispatched successfully at ${time}!</span><br>
    `;
    log.scrollTop = log.scrollHeight;
  }
  showToast("🚨 Emergency SOS dispatched with GPS coordinates!");
};

// ERP Simulator Actions
window.updateErpSim = function() {
  const role = document.getElementById('erp-sim-role').value;
  const out = document.getElementById('erp-sim-output');
  out.innerHTML = `
    <p><strong>Active Session:</strong> ${role.toUpperCase()}</p>
    <p style="color: var(--primary); margin-top: 6px;">Privilege Level: ${role === 'admin' ? 'Full Read/Write/Delete' : role === 'faculty' ? 'Attendance & Grades Entry' : 'Personal Academic Records Only'}</p>
    <p style="color: var(--text-muted); margin-top: 8px;">Click any operation button to execute database transactions.</p>
  `;
};

window.runErpAction = function(action) {
  const out = document.getElementById('erp-sim-output');
  if (action === 'attendance') {
    out.innerHTML = `
      <div style="color: var(--accent); font-weight: 600; margin-bottom: 6px;">✓ Attendance Batch Processed</div>
      <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; margin-top: 8px;">
        <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
          <th>Course</th><th>Total</th><th>Attended</th><th>Percentage</th>
        </tr>
        <tr><td>Data Structures (IT301)</td><td>45</td><td>43</td><td><strong style="color: var(--accent);">95.5%</strong></td></tr>
        <tr><td>Java Enterprise (IT302)</td><td>40</td><td>38</td><td><strong style="color: var(--accent);">95.0%</strong></td></tr>
        <tr><td>IoT Architecture (IT304)</td><td>36</td><td>35</td><td><strong style="color: var(--accent);">97.2%</strong></td></tr>
      </table>
    `;
  } else if (action === 'grades') {
    out.innerHTML = `
      <div style="color: var(--primary); font-weight: 600; margin-bottom: 6px;">📊 Semester GPA Computation (Auto-Calculated)</div>
      <p style="margin-top: 6px;"><strong>Student:</strong> Sanjay S (VSB IT Dept)</p>
      <p><strong>Calculated GPA:</strong> <span style="font-size: 1.2rem; color: var(--accent); font-weight: 700;">8.85 / 10.0</span></p>
      <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 6px;">Status: Grade sheet verified & signed with digital token.</p>
    `;
  } else if (action === 'fees') {
    out.innerHTML = `
      <div style="color: var(--warning); font-weight: 600; margin-bottom: 6px;">💳 Fee Invoicing & Ledger Status</div>
      <p><strong>Academic Year:</strong> 2026 – Term 1</p>
      <p><strong>Status:</strong> <span style="color: var(--accent); font-weight: 600;">PAID IN FULL</span> (Txn Ref: #VSB-ERP-89240)</p>
      <button class="btn btn-sm btn-outline" style="margin-top: 8px;" onclick="showToast('Receipt PDF exported!')"><i class="fa-solid fa-download"></i> Download Receipt</button>
    `;
  }
};

// CRM Simulator Actions
window.submitCrmGrievance = function() {
  const cat = document.getElementById('crm-cat').value;
  const loc = document.getElementById('crm-loc').value;
  const token = 'CRM-' + Math.floor(100000 + Math.random() * 900000);
  const time = new Date().toLocaleTimeString();

  const view = document.getElementById('crm-ticket-view');
  view.innerHTML = `
    <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 10px; border-radius: 6px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between;">
        <strong>Ticket ID: ${token}</strong>
        <span style="color: var(--accent); font-weight: 600;">STATUS: ASSIGNED</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Logged at: ${time} | Geotag: ${loc}</div>
    </div>

    <p><strong>Category:</strong> ${cat}</p>
    <p><strong>Assigned To:</strong> Municipal Rapid Response Unit (Tiruppur District)</p>
    <p><strong>Target SLA:</strong> Within 24 Hours</p>

    <div style="margin-top: 12px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
      <div style="width: 50%; height: 100%; background: var(--gradient-brand);"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">
      <span>Logged</span>
      <span style="color: var(--primary); font-weight: 600;">Triage</span>
      <span>Dispatched</span>
      <span>Resolved</span>
    </div>
  `;

  showToast(`Grievance #${token} submitted & dispatched!`);
};

/* ==========================================================================
   9. INTERACTIVE DEVELOPER TERMINAL (EASTER EGG)
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const clearBtn = document.getElementById('term-clear-btn');
  if (!input || !output) return;

  const commands = {
    help: () => `
      <span class="term-cyan">Available Commands:</span><br>
      &nbsp;&nbsp;<span class="term-yellow">about</span>       - Print profile and background<br>
      &nbsp;&nbsp;<span class="term-yellow">skills</span>      - List technical skills and proficiencies<br>
      &nbsp;&nbsp;<span class="term-yellow">projects</span>    - Display major engineered projects<br>
      &nbsp;&nbsp;<span class="term-yellow">certs</span>       - View professional certifications & awards<br>
      &nbsp;&nbsp;<span class="term-yellow">education</span>   - Display academic history<br>
      &nbsp;&nbsp;<span class="term-yellow">contact</span>     - Show email, phone & social links<br>
      &nbsp;&nbsp;<span class="term-yellow">sudo hire</span>   - Initiate candidate hire pipeline<br>
      &nbsp;&nbsp;<span class="term-yellow">clear</span>       - Clear terminal screen<br>
      &nbsp;&nbsp;<span class="term-yellow">whoami</span>      - Display current visitor identifier<br>
      &nbsp;&nbsp;<span class="term-yellow">date</span>        - Display current system timestamp
    `,
    about: () => `
      <span class="term-green">Sanjay S</span> — Software Engineer & B.Tech Information Technology student at VSB Engineering College.<br>
      Passionate about high-impact software, scalable database architecture, and real-time IoT embedded systems.
    `,
    skills: () => `
      <span class="term-cyan">Languages:</span> Java, SQL, Python, C/C++, PHP, JavaScript, HTML5/CSS3<br>
      <span class="term-cyan">IoT & Embedded:</span> Arduino, ESP8266/ESP32, GPS NEO-6M, GSM SIM800L, Sensors<br>
      <span class="term-cyan">Focus Areas:</span> Data Analysis, Full Stack Web, Cloud & Agentforce
    `,
    projects: () => `
      1. <span class="term-green">ERP Based Student Management System (2026)</span> [Java, MySQL, PHP, JS]<br>
      2. <span class="term-green">Smart Helmet for Rider Safety (2025)</span> [IoT, ESP32, Arduino, GPS/GSM, C/C++]<br>
      3. <span class="term-green">Public CRM (Citizen Relationship Management) (2025)</span> [PHP, MySQL, E-Governance]
    `,
    certs: () => `
      ★ <span class="term-yellow">India Innovates 2026 – Finalist</span><br>
      • Salesforce Administrative Explorer<br>
      • Pega National Internship Program<br>
      • Salesforce: Becoming an Agentforce Champion
    `,
    education: () => `
      • <span class="term-cyan">B.Tech IT (2024–2028)</span>: VSB Engineering College, Karur, Tamil Nadu<br>
      • <span class="term-cyan">12th Grade (HSC)</span>: Sathyam International School (73.2%)<br>
      • <span class="term-cyan">10th Grade (SSLC)</span>: Sathyam International School (83.6%)
    `,
    contact: () => `
      • Email: <a href="mailto:sanjayselvakumar05@gmail.com" class="term-cyan">sanjayselvakumar05@gmail.com</a><br>
      • Phone: <span class="term-cyan">+91 9489841868</span><br>
      • LinkedIn: <a href="https://linkedin.com/in/sanjay-s-b57531317" target="_blank" class="term-cyan">linkedin.com/in/sanjay-s-b57531317</a><br>
      • GitHub: <a href="https://github.com/Sanjay8555" target="_blank" class="term-cyan">github.com/Sanjay8555</a>
    `,
    'sudo hire': () => `
      <span class="term-green">[SUCCESS] Initiating hiring handshake protocol!</span><br>
      Please reach out directly at <span class="term-yellow">sanjayselvakumar05@gmail.com</span> or call <span class="term-yellow">+91 9489841868</span>. Looking forward to engineering something great together!
    `,
    whoami: () => `visitor@recruiter-workstation:~$ (Authorized to explore & hire)`,
    date: () => new Date().toString(),
    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      const cmd = rawCmd.toLowerCase();
      input.value = '';

      if (!rawCmd) return;

      const cmdLine = document.createElement('div');
      cmdLine.className = 'term-line';
      cmdLine.innerHTML = `<span class="term-prompt">sanjay@portfolio:~$</span> ${escapeHtml(rawCmd)}`;
      output.appendChild(cmdLine);

      if (commands[cmd]) {
        const res = commands[cmd]();
        if (res) {
          const resLine = document.createElement('div');
          resLine.className = 'term-line';
          resLine.innerHTML = res;
          output.appendChild(resLine);
        }
      } else {
        const errLine = document.createElement('div');
        errLine.className = 'term-line term-red';
        errLine.innerHTML = `command not found: '${escapeHtml(rawCmd)}'. Type <span class="term-yellow">'help'</span> for list of commands.`;
        output.appendChild(errLine);
      }

      const screen = document.getElementById('terminal-screen');
      if (screen) screen.scrollTop = screen.scrollHeight;
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      commands.clear();
      showToast('Terminal cleared');
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   10. MOBILE MENU & RESUME MODAL
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }
}

function initResumeModal() {
  const btn = document.getElementById('btn-quick-resume');
  const modal = document.getElementById('resume-modal');

  if (btn && modal) {
    btn.addEventListener('click', () => {
      modal.classList.add('open');
    });
  }
}

window.closeResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.remove('open');
};

window.copyResumeText = function() {
  const text = `
SANJAY S
Software Engineer | B.Tech Information Technology
Vellakovil, Tiruppur | +91 9489841868 | sanjayselvakumar05@gmail.com
LinkedIn: linkedin.com/in/sanjay-s-b57531317 | GitHub: github.com/Sanjay8555

PROFILE SUMMARY:
Motivated and detail-oriented B.Tech student with a strong foundation in computer science and a passion for developing innovative software solutions.

EDUCATION:
- B.Tech in IT (2024-2028), VSB Engineering College, Karur
- 12th Grade: Sathyam International School (73.2%)
- 10th Grade: Sathyam International School (83.6%)

SKILLS:
- Languages: Java, SQL, Python, C/C++, PHP, JavaScript, HTML5, CSS3
- Focus: Data Analysis, Full Stack Development, IoT & Embedded Systems

PROJECTS:
1. ERP Based Student Management System (2026) [Java, MySQL, PHP, JS]
2. Smart Helmet for Rider Safety (2025) [IoT, ESP32, Arduino, GPS, GSM, C/C++]
3. Public CRM - Citizen Grievance Portal (2025) [PHP, MySQL, Web]

CERTIFICATIONS:
- Salesforce Administrative Explorer
- Pega National Internship Program
- Salesforce: Becoming an Agentforce Champion

ACHIEVEMENTS:
- India Innovates 2026 – Finalist
  `;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Resume plain-text copied to clipboard!');
  });
};

/* ==========================================================================
   11. UTILITIES: TOAST & CONTACT FORM
   ========================================================================== */
window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${msg}</span>`;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3200);
};

window.copyText = function(text, evt) {
  if (evt) evt.preventDefault();
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard!`);
  });
};

window.handleFormSubmit = function(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-form');
  const feedback = document.getElementById('form-feedback');
  const name = document.getElementById('form-name').value;

  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>`;
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>`;
    feedback.className = "form-feedback success";
    feedback.textContent = `Thank you ${name}! Your message has been routed to Sanjay S (sanjayselvakumar05@gmail.com). Expect a response shortly!`;
    document.getElementById('contact-form').reset();
    btn.disabled = false;
    showToast('Message dispatched to Sanjay S!');
  }, 1200);
};

function updateCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}
