// =========================================================================
// 🎨 HEIMDALL MASTER ENGINE v2.5 (custom.js)
// =========================================================================

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
    if (document.getElementById('ambient-particles')) return;
    canvasElem = document.createElement('canvas');
    canvasElem.id = 'ambient-particles';
    canvasElem.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:1;opacity:0.6;';
    document.body.appendChild(canvasElem);

    const ctx = canvasElem.getContext('2d');
    let width = (canvasElem.width = window.innerWidth);
    let height = (canvasElem.height = window.innerHeight);

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        vy: Math.random() * 0.5 + 0.2,
        vx: Math.random() * 0.4 - 0.2,
        o: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      if (!canvasElem) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx;
        if (p.y > height) p.y = -10;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      particleAnimationId = requestAnimationFrame(animate);
    }
    animate();
  }

  function destroyParticles() {
    if (particleAnimationId) cancelAnimationFrame(particleAnimationId);
    if (canvasElem) canvasElem.remove();
    canvasElem = null;
  }

  // --- 1.2 SVG Inlining Engine ---
  function inlineSvgIcons() {
    const images = document.querySelectorAll('#sortable .item img[src$=".svg"]');
    images.forEach(img => {
      fetch(img.src).then(r => r.text()).then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'image/svg+xml');
        const svg = xml.querySelector('svg');
        if (svg) {
          if (img.id) svg.id = img.id;
          if (img.className) svg.classList.add(...img.className.split(' '));
          svg.setAttribute('width', '48'); svg.setAttribute('height', '48');
          img.parentNode.replaceChild(svg, img);
        }
      });
    });
  }

  // Clean injections
  document.querySelectorAll('.headerInfos, .theme-selection-panel, .theme-trigger-btn, #ambient-particles, .aurora-blob').forEach(x => x.remove());

  // --- 2. Aurora Blobs ---
  ['blob-1', 'blob-2', 'blob-3'].forEach(c => {
    const b = document.createElement('div'); b.className = `aurora-blob ${c}`; document.body.appendChild(b);
  });

  // --- 3. Header ---
  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  headerInfos.style.zIndex = '100'; // Added z-index for clickability
  insertAfter(sortableElement, headerInfos);

  var divClock = createAndInsertDiv('divDate', headerInfos);
  divClock.classList.add('divClock');
  var timeDiv = createAndInsertDiv('horloge', divClock);

  var divDate = createAndInsertDiv('divDate', headerInfos);
  divDate.classList.add('divDateOnly');
  var dateDiv = createAndInsertDiv('ladate', divDate);

  function updateClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    timeDiv.textContent = `${hrs}:${mins}:${secs}`;
    
    const day = now.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
    const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    dateDiv.innerHTML = `<span>${day}</span>${date}`;
  }
  updateClock(); setInterval(updateClock, 1000);

  // --- 4. Latency Monitors (Multi-Probe Engine) ---
  function initLatencyPingMonitors() {
    document.querySelectorAll('#sortable .item').forEach(card => {
      const link = card.querySelector('a');
      if (link && link.href && link.href.startsWith('http')) {
        let dot = card.querySelector('.latency-dot');
        if (!dot) {
          dot = document.createElement('span');
          dot.className = 'latency-dot';
          card.querySelector('.title')?.appendChild(dot);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const setStatus = (status) => {
          clearTimeout(timeoutId);
          dot.classList.remove('online', 'offline');
          dot.classList.add(status);
          dot.title = status === 'online' ? "Service Reachable" : "Service Offline or Restricted";
        };

        const probe = (url) => fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal, referrerPolicy: 'no-referrer' });

        // Phase 1: Direct Deep Link Fetch
        probe(link.href)
        .then(() => setStatus('online'))
        .catch(() => {
          // Phase 2: Fallback to Root Favicon (Often lacks strict CORP/CORS)
          try {
            const origin = new URL(link.href).origin;
            probe(origin + '/favicon.ico')
            .then(() => setStatus('online'))
            .catch(() => {
              // Phase 3: Legacy Image Probe (Most permissive cross-origin method)
              const img = new Image();
              img.onload = () => setStatus('online');
              img.onerror = () => setStatus('offline');
              img.src = origin + '/favicon.ico?v=' + Date.now();
            });
          } catch(e) { setStatus('offline'); }
        });
      }
    });
  }
  // Run every 60 seconds for live health updates
  initLatencyPingMonitors();
  setInterval(initLatencyPingMonitors, 60000);

  // --- 5. Theme Engine ---
  const themes = [
    { id: 'theme-tokyo-midnight', name: '🌌 Tokyo Midnight' },
    { id: 'theme-brutalism', name: '📐 Swiss Brutalism' },
    { id: 'theme-neumorphic', name: '☁️ Neumorphic Soft' },
    { id: 'theme-biolum', name: '🌊 Deep Sea Biolum' },
    { id: 'theme-mars', name: '🚀 Mars Colony' },
    { id: 'theme-macintosh', name: '💻 Retro Macintosh' },
    { id: 'theme-graffiti', name: '🎨 Cyber-Graffiti' },
    { id: 'theme-velvet', name: '🍷 Royal Velvet' },
    { id: 'theme-paper', name: '📝 Paper Texture' },
    { id: 'theme-amoled', name: '🖤 AMOLED Black' },
    { id: 'theme-pastel', name: '🌸 Pastel Dream' },
    { id: 'theme-steel', name: '⚙️ Industrial Steel' },
    { id: 'theme-emerald', name: '💎 Emerald City' },
    { id: 'theme-magma', name: '🌋 Volcanic Magma' },
    { id: 'theme-coffee', name: '☕ Coffee House' },
    { id: 'theme-arctic', name: '❄️ Arctic Night' },
    { id: 'theme-golden', name: '☀️ Golden Hour' },
    { id: 'theme-glitch', name: '👾 Glitch Core' },
    { id: 'theme-rainbow', name: '🌈 Rainbow Glass' },
    { id: 'theme-amber', name: '📟 Terminal Amber' },
    { id: 'theme-nord-polar', name: '❄️ Nord Polar' },
    { id: 'theme-catppuccin', name: '🐱 Catppuccin' },
    { id: 'theme-rose-pine', name: '🌹 Rose Pine' },
    { id: 'theme-one-dark', name: '🌑 One Dark' },
    { id: 'theme-monokai', name: '🌺 Monokai' },
    { id: 'theme-gruvbox', name: '📦 Gruvbox' },
    { id: 'theme-dracula-pro', name: '🧛 Dracula Pro' },
    { id: 'theme-cyber-lime', name: '🍋 Cyber Lime' },
    { id: 'theme-ocean-deep', name: '🐋 Ocean Deep' },
    { id: 'theme-solar-dark', name: '☀️ Solarized Dark' },
    { id: 'theme-synthwave', name: '🌆 Synthwave' },
    { id: 'theme-forest', name: '🌲 Deep Forest' },
    { id: 'theme-ghost', name: '👻 Ghost Shell' },
    { id: 'theme-crimson', name: '🩸 Crimson' },
    { id: 'theme-gold-black', name: '🏆 Gold & Black' },
    { id: 'theme-midnight-cyan', name: '🌑 Midnight Cyan' },
    { id: 'theme-lavender', name: '🪻 Lavender' },
    { id: 'theme-blood-moon', name: '🌙 Blood Moon' },
    { id: 'theme-void', name: '🕳️ The Void' },
    { id: 'theme-cyberpunk-red', name: '🥊 Cyber Red' },
    { id: 'theme-cyber-orange', name: '🟠 Cyber Orange' },
    { id: 'theme-dracula-soft', name: '🧛 Dracula Soft' },
    { id: 'theme-nord-deep', name: '🌊 Nord Deep' },
    { id: 'theme-solar-light', name: '☀️ Solar Light' },
    { id: 'theme-midnight-purple', name: '🔮 Midnight Purple' },
    { id: 'theme-retro-future', name: '🚀 Retro Future' },
    { id: 'theme-grayscale', name: '⚪ Grayscale' },
    { id: 'theme-ocean-breeze', name: '🌬️ Ocean Breeze' },
    { id: 'theme-forest-mist', name: '🌫️ Forest Mist' },
    { id: 'theme-desert-sand', name: '🏜️ Desert Sand' },
    { id: 'theme-ghost-oled', name: '👻 Ghost OLED' },
    { id: 'theme-neon-pulse', name: '💓 Neon Pulse' },
    { id: 'theme-royal-blue', name: '👑 Royal Blue' },
    { id: 'theme-copper-pipe', name: '🔧 Copper Pipe' },
    { id: 'theme-sakura-night', name: '🌙 Sakura Night' },
    { id: 'theme-mint-glass', name: '🍃 Mint Glass' },
    { id: 'theme-velvet-gold', name: '🏆 Velvet & Gold' },
    { id: 'theme-slate-ice', name: '🧊 Slate Ice' },
    { id: 'theme-matrix-gold', name: '🪙 Matrix Gold' },
    { id: 'theme-toxic-red', name: '☢️ Toxic Red' }
  ];

  let currentTheme = localStorage.getItem('heimdall-current-theme') || 'theme-tokyo-midnight';
  document.body.classList.add(currentTheme);

  const panel = document.createElement('div'); panel.className = 'theme-selection-panel';
  themes.forEach(t => {
    const btn = document.createElement('button'); btn.className = 'theme-option-btn';
    if (t.id === currentTheme) btn.classList.add('active');
    btn.innerHTML = `<span>${t.name}</span>`;
    btn.onclick = () => {
      panel.querySelector('.active')?.classList.remove('active');
      btn.classList.add('active');
      document.body.classList.remove(...themes.map(x => x.id));
      document.body.classList.add(t.id);
      localStorage.setItem('heimdall-current-theme', t.id);
    };
    panel.appendChild(btn);
  });

  function addToggle(label, id, defaultVal, callback) {
    const active = localStorage.getItem(`heimdall-${id}`) === 'true' || (defaultVal && localStorage.getItem(`heimdall-${id}`) !== 'false');
    if (active) { document.body.classList.add(`${id}-active`); callback?.(true); }
    const sec = document.createElement('div');
    sec.style.cssText = 'display:flex;justify-content:space-between;padding:8px;border-top:1px solid rgba(255,255,255,0.05);font-size:0.8em;color:#fff;';
    sec.innerHTML = `<span>${label}</span><input type="checkbox" id="${id}-toggle" ${active ? 'checked' : ''}>`;
    panel.appendChild(sec);
    setTimeout(() => {
      document.getElementById(`${id}-toggle`).onchange = (e) => {
        const val = e.target.checked;
        document.body.classList.toggle(`${id}-active`, val);
        localStorage.setItem(`heimdall-${id}`, val);
        callback?.(val);
      };
    }, 100);
  }

  addToggle('Ambient Auroras', 'auroras', true);
  addToggle('Smart Sizing', 'dynamic-sizing', true);
  addToggle('Animated Particles', 'particles', false, (v) => v ? initParticles() : destroyParticles());
  addToggle('Animated Icons', 'animated-icons', true, (v) => v && inlineSvgIcons());
  addToggle('Animated Borders', 'animated-borders', false);
  addToggle('Health Pulse', 'health-pulse', true);

  const trigger = document.createElement('button');
  trigger.className = 'theme-trigger-btn'; trigger.innerHTML = '🎨';
  trigger.onclick = () => panel.classList.toggle('open');
  document.body.appendChild(trigger); document.body.appendChild(panel);

  // Click delegation
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== trigger) panel.classList.remove('open');
    const card = e.target.closest('#sortable .item');
    if (card && !e.target.closest('a, button, input')) card.querySelector('a')?.click();
  });

  console.log("Heimdall Master Engine v2.5 Active.");
})();
