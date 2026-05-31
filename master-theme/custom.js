// =========================================================================
// 🎨 HEIMDALL UNIVERSAL MASTER ENGINE (custom.js)
// =========================================================================
// Redesigned dashboard framework featuring:
// 1. Big Date and Clock digital panels.
// 2. Dynamic Background Aurora Glows (Togglable) [Feature 11]
// 3. Glassmorphic Ripple Particle Click Effects [Feature 17]
// 4. Self-Host Latency Ping Monitors [Feature 23]
// 5. Floating theme selector panel hidden behind micro-interactive toggle.
//
// *NO WIDGET TRANSPARENCY/HIDING HOVER OR SEARCH EFFECTS*

(function() {
  const sortableElement = document.querySelector('.appheader');
  if (!sortableElement) return;

  // --- 1. Helper Functions ---
  function insertAfter(referenceNode, newNode) {
    if (referenceNode && referenceNode.parentNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }

  function createAndInsertDiv(className, referenceNode) {
    var newDiv = document.createElement("div");
    newDiv.classList.add(className);
    referenceNode.appendChild(newDiv);
    return newDiv;
  }

  // --- 1.1 HTML5 Background Canvas Particles System ---
  let canvasElem = null;
  let particleAnimationId = null;

  function initParticles() {
    // Prevent duplicate canvases
    if (document.getElementById('ambient-particles')) return;
    
    canvasElem = document.createElement('canvas');
    canvasElem.id = 'ambient-particles';
    document.body.appendChild(canvasElem);

    const ctx = canvasElem.getContext('2d');
    let width = (canvasElem.width = window.innerWidth);
    let height = (canvasElem.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (canvasElem) {
        width = canvasElem.width = window.innerWidth;
        height = canvasElem.height = window.innerHeight;
      }
    });

    const particles = [];
    const maxParticles = 45;

    class Petal {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.r = Math.random() * 4 + 2;
        this.vy = Math.random() * 1.2 + 0.4;
        this.vx = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.02 - 0.01;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        // Semi-transparent sakura blossom color
        ctx.fillStyle = `rgba(253, 164, 175, ${this.opacity})`;
        ctx.ellipse(0, 0, this.r * 1.6, this.r, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.y += this.vy;
        this.x += this.vx + Math.sin(this.y / 25) * 0.15;
        this.angle += this.spin * 180 / Math.PI;

        if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
          this.y = -20;
          this.x = Math.random() * width;
          this.vy = Math.random() * 1.2 + 0.4;
          this.vx = Math.random() * 0.8 - 0.4;
          this.opacity = Math.random() * 0.4 + 0.2;
        }
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Petal());
    }

    function animate() {
      if (!canvasElem) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      particleAnimationId = requestAnimationFrame(animate);
    }

    animate();
  }

  function destroyParticles() {
    if (particleAnimationId) {
      cancelAnimationFrame(particleAnimationId);
      particleAnimationId = null;
    }
    if (canvasElem) {
      canvasElem.remove();
      canvasElem = null;
    }
  }

  // Clear existing modifications on re-load to prevent duplicate injections
  const existingHeader = document.querySelector('.headerInfos');
  if (existingHeader) existingHeader.remove();
  const existingSwitcher = document.querySelector('.theme-selection-panel');
  if (existingSwitcher) existingSwitcher.remove();
  const existingTrigger = document.querySelector('.theme-trigger-btn');
  if (existingTrigger) existingTrigger.remove();
  const existingCanvas = document.getElementById('ambient-particles');
  if (existingCanvas) existingCanvas.remove();
  document.querySelectorAll('.aurora-blob').forEach(x => x.remove());

  // --- 2. Aurora Background Blob Injections [Feature 11] ---
  const blob1 = document.createElement('div');
  blob1.className = 'aurora-blob blob-1';
  const blob2 = document.createElement('div');
  blob2.className = 'aurora-blob blob-2';
  const blob3 = document.createElement('div');
  blob3.className = 'aurora-blob blob-3';
  document.body.appendChild(blob1);
  document.body.appendChild(blob2);
  document.body.appendChild(blob3);

  // --- 3. Injected Header Setup (Big Clock) ---
  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  insertAfter(sortableElement, headerInfos);

  // Big Date & Clock Widget
  var divDate = createAndInsertDiv('divDate', headerInfos);
  var timeDiv = createAndInsertDiv('horloge', divDate);
  var dateDiv = createAndInsertDiv('ladate', divDate);

  // Weather Widget Alignment
  setTimeout(function() {
    const existingMeteo = document.querySelector('.meteo');
    if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
      headerInfos.appendChild(existingMeteo);
    }
  }, 100);

  // --- 4. Clock Sync & Dynamic Welcomes ---
  function updateClock() {
    const maintenant = new Date();
    
    // Choose greeting based on time of day
    const hour = maintenant.getHours();
    let greeting = "SYSTEM STATUS: OPTIMAL";
    if (hour >= 5 && hour < 12) {
      greeting = "GOOD MORNING, ADMIN";
    } else if (hour >= 12 && hour < 17) {
      greeting = "GOOD AFTERNOON, ADMIN";
    } else if (hour >= 17 && hour < 22) {
      greeting = "GOOD EVENING, ADMIN";
    } else {
      greeting = "NIGHT CYCLE DEPLOYED";
    }

    const optionsJour = { weekday: 'long' };
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    
    const jourFormatted = maintenant.toLocaleDateString(undefined, optionsJour);
    const dateFormatted = maintenant.toLocaleDateString(undefined, optionsDate);
    
    const hrs = String(maintenant.getHours()).padStart(2, '0');
    const mins = String(maintenant.getMinutes()).padStart(2, '0');
    const secs = String(maintenant.getSeconds()).padStart(2, '0');
    const heureFormatted = `${hrs}:${mins}:${secs}`;

    dateDiv.innerHTML = '';

    var spanJourSemaine = document.createElement('span');
    spanJourSemaine.textContent = `${greeting} // ${jourFormatted.toUpperCase()}`;
    dateDiv.appendChild(spanJourSemaine);

    timeDiv.textContent = heureFormatted;
    dateDiv.appendChild(document.createTextNode(' ' + dateFormatted));
  }

  updateClock();
  setInterval(updateClock, 1000);

  // --- 5. Glassmorphic Click Ripples [Feature 17] ---
  document.addEventListener('click', function(e) {
    const card = e.target.closest('#sortable .item');
    if (!card) return;

    // Clear existing ripples inside this card
    card.querySelectorAll('.glass-ripple').forEach(r => r.remove());

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.classList.add('glass-ripple');
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 700);
  });

  // --- 6. Self-Host Latency Ping Monitors [Feature 23] ---
  function initLatencyPingMonitors() {
    const cards = document.querySelectorAll('#sortable .item');
    cards.forEach(card => {
      const link = card.querySelector('a');
      if (link && link.href && link.href.startsWith('http') && !card.querySelector('.latency-dot')) {
        
        const titleContainer = card.querySelector('.title') || link;
        
        const dot = document.createElement('span');
        dot.className = 'latency-dot';
        dot.title = "Pinging local node...";
        titleContainer.appendChild(dot);

        // Client-side async latency verification (CORS-tolerant)
        const start = performance.now();
        fetch(link.href, { 
          mode: 'no-cors', 
          cache: 'no-store', 
          credentials: 'omit',
          referrerPolicy: 'no-referrer'
        })
        .then(() => {
          const latency = Math.round(performance.now() - start);
          dot.classList.add('online');
          dot.title = `Online // Latency: ${latency}ms`;
        })
        .catch(() => {
          dot.classList.add('offline');
          dot.title = "Offline or Port Blocked";
        });
      }
    });
  }

  // Scan and test connectivity 500ms after load complete
  setTimeout(initLatencyPingMonitors, 500);

  // --- 7. Toggle-Hidden Theme Panel & Aurora Settings ---
  const themes = [
    { id: 'theme-cyber-premium', name: '🌌 Cyber-Premium' },
    { id: 'theme-cyber-organic', name: '🌿 Cyber-Organic' },
    { id: 'theme-slate-minimalist', name: '📐 Slate Minimalist' },
    { id: 'theme-sunset-aurora', name: '🌅 Sunset Aurora' },
    { id: 'theme-nordic-frost', name: '❄️ Nordic Frost' },
    { id: 'theme-solarized-amber', name: '🍂 Solarized Amber' },
    { id: 'theme-monolith-dark', name: '🖤 Monolith Dark' },
    { id: 'theme-dracula-dark', name: '🧛 Dracula Dark' },
    { id: 'theme-retrowave-80s', name: '⚡ Retrowave 80s' },
    { id: 'theme-sakura-blossom', name: '🌸 Sakura Blossom' },
    { id: 'theme-cyberpunk-yellow', name: '🟨 Cyberpunk 2077' },
    { id: 'theme-cosmic-nebula', name: '💫 Cosmic Nebula' },
    { id: 'theme-glassmorphic-light', name: '💎 Frosted Crystal' },
    { id: 'theme-matrix-rain', name: '📟 Matrix Rain' },
    { id: 'theme-toxic-hazard', name: '☣️ Toxic Hazard' }
  ];

  // Retrieve states
  let currentTheme = localStorage.getItem('heimdall-current-theme') || 'theme-cyber-premium';
  document.body.classList.add(currentTheme);
  
  let aurorasEnabled = localStorage.getItem('heimdall-auroras-enabled') !== 'false';
  if (aurorasEnabled) document.body.classList.add('auroras-active');

  let dynamicSizingEnabled = localStorage.getItem('heimdall-dynamic-sizing') === 'true';
  if (dynamicSizingEnabled) document.body.classList.add('dynamic-sizing-active');

  let laserOutlinesEnabled = localStorage.getItem('heimdall-laser-outlines') === 'true';
  if (laserOutlinesEnabled) document.body.classList.add('laser-outlines-active');

  let particlesEnabled = localStorage.getItem('heimdall-particles') === 'true';
  if (particlesEnabled) {
    setTimeout(initParticles, 150);
  }

  let searchPlacement = localStorage.getItem('heimdall-search-placement') || 'default';
  document.body.classList.add(`search-${searchPlacement}`);

  let widgetGap = localStorage.getItem('heimdall-widget-gap') || '16';
  document.documentElement.style.setProperty('--widget-gap', `${widgetGap}px`);

  // A. Create Trigger FAB Button
  var triggerBtn = document.createElement('button');
  triggerBtn.className = 'theme-trigger-btn';
  triggerBtn.title = "Customize Dashboard Theme";
  triggerBtn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3a9 9 0 0 0-9 9c0 1.25.5 2.39 1.32 3.22.4.4.4 1.04 0 1.44a1.01 1.01 0 0 1-1.44 0A10.93 10.93 0 0 1 1 12 11 11 0 0 1 12 1a11 11 0 0 1 11 11c0 1.46-.3 2.87-.87 4.14-.38.86-.73 1.76-1.03 2.68-.2.62-.77 1.05-1.43 1.05h-3.66a2.02 2.02 0 0 1-2.02-2.02v-1.63c0-.62-.25-1.22-.69-1.66l-1.66-1.66a2.38 2.38 0 0 1-.69-1.66V9.02A2.02 2.02 0 0 1 13.06 7H17c1.1 0 2-.9 2-2a2 2 0 0 0-2-2h-5zM6.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm2.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  `;

  // B. Create Panel Container
  var selectionPanel = document.createElement('div');
  selectionPanel.className = 'theme-selection-panel';

  var panelTitle = document.createElement('div');
  panelTitle.className = 'panel-title';
  panelTitle.textContent = "Dashboard Style";
  selectionPanel.appendChild(panelTitle);

  // Ingest Theme option items
  themes.forEach(t => {
    var optBtn = document.createElement('button');
    optBtn.className = 'theme-option-btn';
    if (t.id === currentTheme) optBtn.classList.add('active');
    optBtn.innerHTML = `<span>${t.name}</span>`;

    optBtn.addEventListener('click', () => {
      selectionPanel.querySelector('.theme-option-btn.active').classList.remove('active');
      optBtn.classList.add('active');
      document.body.classList.remove(...themes.map(x => x.id));
      document.body.classList.add(t.id);
      localStorage.setItem('heimdall-current-theme', t.id);
      currentTheme = t.id;
    });

    selectionPanel.appendChild(optBtn);
  });

  // C. Ingest togglable Aurora Controls [Feature 11 - Configurable]
  var section = document.createElement('div');
  section.className = 'panel-section';
  section.innerHTML = `
    <span class="panel-subtitle">Ambient Auroras</span>
    <label class="switch-container">
      <input type="checkbox" id="aurora-toggle" ${aurorasEnabled ? 'checked' : ''}>
      <span class="slider-switch"></span>
    </label>
  `;
  selectionPanel.appendChild(section);

  // Smart Auto-Sizing Control Ingestion (Feature 21)
  var dynamicSizingSection = document.createElement('div');
  dynamicSizingSection.className = 'panel-section';
  dynamicSizingSection.innerHTML = `
    <span class="panel-subtitle">Smart Auto-Sizing</span>
    <label class="switch-container">
      <input type="checkbox" id="dynamic-sizing-toggle" ${dynamicSizingEnabled ? 'checked' : ''}>
      <span class="slider-switch"></span>
    </label>
  `;
  selectionPanel.appendChild(dynamicSizingSection);

  // Laser Outlines Control Ingestion (Feature 8)
  var laserSection = document.createElement('div');
  laserSection.className = 'panel-section';
  laserSection.innerHTML = `
    <span class="panel-subtitle">✨ Laser Outlines</span>
    <label class="switch-container">
      <input type="checkbox" id="laser-toggle" ${laserOutlinesEnabled ? 'checked' : ''}>
      <span class="slider-switch"></span>
    </label>
  `;
  selectionPanel.appendChild(laserSection);

  // Ambient Particles Control Ingestion (Feature 11)
  var particlesSection = document.createElement('div');
  particlesSection.className = 'panel-section';
  particlesSection.innerHTML = `
    <span class="panel-subtitle">🌸 Ambient Particles</span>
    <label class="switch-container">
      <input type="checkbox" id="particles-toggle" ${particlesEnabled ? 'checked' : ''}>
      <span class="slider-switch"></span>
    </label>
  `;
  selectionPanel.appendChild(particlesSection);

  // Search Placement Control Ingestion (Feature 23)
  var searchSection = document.createElement('div');
  searchSection.className = 'panel-section';
  searchSection.style.flexDirection = 'column';
  searchSection.style.alignItems = 'stretch';
  searchSection.style.gap = '6px';
  searchSection.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="panel-subtitle">🔍 Search Placement</span>
    </div>
    <select id="search-placement-select" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:4px 8px; font-size:0.85em; outline:none; font-family:inherit; cursor:pointer;">
      <option value="default" ${searchPlacement === 'default' ? 'selected' : ''}>Default</option>
      <option value="compact" ${searchPlacement === 'compact' ? 'selected' : ''}>Compact Top</option>
      <option value="hidden" ${searchPlacement === 'hidden' ? 'selected' : ''}>Hidden (Ctrl+F)</option>
    </select>
  `;
  selectionPanel.appendChild(searchSection);

  // Widget Spacing Control Ingestion (Feature 30)
  var gapSection = document.createElement('div');
  gapSection.className = 'panel-section';
  gapSection.style.flexDirection = 'column';
  gapSection.style.alignItems = 'stretch';
  gapSection.style.gap = '6px';
  gapSection.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="panel-subtitle">🌬️ Widget Gap</span>
      <span id="gap-val-display" style="font-size:0.8em; color:rgba(255,255,255,0.5); font-weight:600;">${widgetGap}px</span>
    </div>
    <input type="range" id="widget-gap-slider" min="8" max="32" value="${widgetGap}" style="width:100%; height:4px; border-radius:2px; background:rgba(255,255,255,0.15); outline:none; cursor:pointer; accent-color:#10b981;">
  `;
  selectionPanel.appendChild(gapSection);

  // Toggle Panel Open/Close Handlers
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectionPanel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!selectionPanel.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
      selectionPanel.classList.remove('open');
    }
  });

  document.body.appendChild(triggerBtn);
  document.body.appendChild(selectionPanel);

  // Aurora Dynamic State switch listeners
  const auroraToggle = document.getElementById('aurora-toggle');
  if (auroraToggle) {
    auroraToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('auroras-active');
        localStorage.setItem('heimdall-auroras-enabled', 'true');
      } else {
        document.body.classList.remove('auroras-active');
        localStorage.setItem('heimdall-auroras-enabled', 'false');
      }
    });
  }

  // Dynamic Sizing State switch listeners
  const dynamicSizingToggle = document.getElementById('dynamic-sizing-toggle');
  if (dynamicSizingToggle) {
    dynamicSizingToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('dynamic-sizing-active');
        localStorage.setItem('heimdall-dynamic-sizing', 'true');
      } else {
        document.body.classList.remove('dynamic-sizing-active');
        localStorage.setItem('heimdall-dynamic-sizing', 'false');
      }
    });
  }

  // Laser Outlines Switch Listener (Feature 8)
  const laserToggle = document.getElementById('laser-toggle');
  if (laserToggle) {
    laserToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('laser-outlines-active');
        localStorage.setItem('heimdall-laser-outlines', 'true');
      } else {
        document.body.classList.remove('laser-outlines-active');
        localStorage.setItem('heimdall-laser-outlines', 'false');
      }
    });
  }

  // Particles Switch Listener (Feature 11)
  const particlesToggle = document.getElementById('particles-toggle');
  if (particlesToggle) {
    particlesToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        initParticles();
        localStorage.setItem('heimdall-particles', 'true');
      } else {
        destroyParticles();
        localStorage.setItem('heimdall-particles', 'false');
      }
    });
  }

  // Search Placement Select Listener (Feature 23)
  const searchSelect = document.getElementById('search-placement-select');
  if (searchSelect) {
    searchSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      document.body.classList.remove('search-default', 'search-compact', 'search-hidden');
      document.body.classList.add(`search-${val}`);
      localStorage.setItem('heimdall-search-placement', val);
    });
  }

  // Widget Gap Range Slider Listener (Feature 30)
  const gapSlider = document.getElementById('widget-gap-slider');
  const gapValDisplay = document.getElementById('gap-val-display');
  if (gapSlider && gapValDisplay) {
    gapSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      gapValDisplay.textContent = `${val}px`;
      document.documentElement.style.setProperty('--widget-gap', `${val}px`);
      localStorage.setItem('heimdall-widget-gap', val);
    });
  }

  // Ctrl+F Keyboard Shortcut listener to reveal search when hidden (Feature 23)
  window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      const currentPlacement = localStorage.getItem('heimdall-search-placement') || 'default';
      if (currentPlacement === 'hidden') {
        e.preventDefault();
        const searchInputEl = document.querySelector('#search input') || document.querySelector('input[type="search"]');
        if (searchInputEl) {
          document.body.classList.remove('search-hidden');
          document.body.classList.add('search-default'); // temporarily show it
          searchInputEl.focus();
          
          // Re-hide search when input loses focus if it was hidden
          searchInputEl.addEventListener('blur', function blurHandler() {
            const freshPlacement = localStorage.getItem('heimdall-search-placement') || 'default';
            if (freshPlacement === 'hidden') {
              document.body.classList.remove('search-default');
              document.body.classList.add('search-hidden');
            }
            searchInputEl.removeEventListener('blur', blurHandler);
          });
        }
      }
    }
  });

  // --- 8. Real-Time Client-Side Quick Search & Card Filter (No Dimming) ---
  const searchInput = document.querySelector('#search input') || document.querySelector('input[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('#sortable .item');

      cards.forEach(card => {
        const cardTitleEl = card.querySelector('a') || card.querySelector('.title') || card;
        const titleText = cardTitleEl.textContent.toLowerCase();

        if (query === '') {
          card.classList.remove('search-highlight');
        } else if (titleText.includes(query)) {
          // Highlight match (adds white stroke/glow)
          card.classList.add('search-highlight');
        } else {
          // Removes highlights but DOES NOT hide or dim the widget
          card.classList.remove('search-highlight');
        }
      });
    });

    // Reset when search input is cleared
    searchInput.addEventListener('search', function() {
      const cards = document.querySelectorAll('#sortable .item');
      cards.forEach(card => {
        card.classList.remove('search-highlight');
      });
    });
  }

  console.log("Heimdall Master Engine fully active. Enjoy your clean redesigned dashboard.");
})();
