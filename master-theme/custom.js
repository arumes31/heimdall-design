// =========================================================================
// 🎨 HEIMDALL UNIVERSAL MASTER ENGINE (custom.js)
// =========================================================================
// Redesigned dashboard framework featuring:
// 1. Big Date and Clock digital panels.
// 2. Card Focus Dimmer (Hover Backdrop) [Feature 4 - CSS Driven]
// 3. Dynamic Background Aurora Glows (Togglable) [Feature 11]
// 4. Glassmorphic Ripple Particle Click Effects [Feature 17]
// 5. Self-Host Latency Ping Monitors [Feature 23]
// 6. Floating theme selector panel hidden behind micro-interactive toggle.

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

  // Clear existing modifications on re-load to prevent duplicate injections
  const existingHeader = document.querySelector('.headerInfos');
  if (existingHeader) existingHeader.remove();
  const existingSwitcher = document.querySelector('.theme-selection-panel');
  if (existingSwitcher) existingSwitcher.remove();
  const existingTrigger = document.querySelector('.theme-trigger-btn');
  if (existingTrigger) existingTrigger.remove();
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

  // Dynamic Weather Widget Alignment
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
    const heureFormatted = `${hrs}:${mins}`;

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
        
        // Find suitable placement inside card title tag
        const titleContainer = card.querySelector('.title') || link;
        
        // Create checking status dot
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
          // If connection refused/timeout, display offline alert
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
    { id: 'theme-sakura-blossom', name: '🌸 Sakura Blossom' }
  ];

  // Retrieve states
  let currentTheme = localStorage.getItem('heimdall-current-theme') || 'theme-cyber-premium';
  document.body.classList.add(currentTheme);
  
  let aurorasEnabled = localStorage.getItem('heimdall-auroras-enabled') !== 'false'; // Default true
  if (aurorasEnabled) document.body.classList.add('auroras-active');

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

  // --- 8. Real-Time Client-Side Quick Search & Card Filter ---
  const searchInput = document.querySelector('#search input') || document.querySelector('input[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('#sortable .item');

      cards.forEach(card => {
        const cardTitleEl = card.querySelector('a') || card.querySelector('.title') || card;
        const titleText = cardTitleEl.textContent.toLowerCase();

        if (query === '') {
          card.classList.remove('item-dimmed');
          card.classList.remove('search-highlight');
        } else if (titleText.includes(query)) {
          card.classList.remove('item-dimmed');
          card.classList.add('search-highlight');
        } else {
          card.classList.add('item-dimmed');
          card.classList.remove('search-highlight');
        }
      });
    });

    searchInput.addEventListener('search', function() {
      const cards = document.querySelectorAll('#sortable .item');
      cards.forEach(card => {
        card.classList.remove('item-dimmed');
        card.classList.remove('search-highlight');
      });
    });
  }

  console.log("Heimdall Master Engine fully active. Features [4, 11, 17, 23] and Big Clock successfully initialized.");
})();
// End Universal Master Engine
