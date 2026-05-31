// =========================================================================
// 🎨 HEIMDALL UNIVERSAL MASTER ENGINE (custom.js)
// =========================================================================
// Injects animated widgets, real-time search filtering, dynamic greetings,
// and a floating premium theme switcher to change aesthetics on-the-fly.

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
  const existingSwitcher = document.querySelector('.theme-selector-pill');
  if (existingSwitcher) existingSwitcher.remove();

  // --- 2. Injected Structure Setup ---
  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  insertAfter(sortableElement, headerInfos);

  // Widget A: Date & Clock Widget
  var divDate = createAndInsertDiv('divDate', headerInfos);
  var timeDiv = createAndInsertDiv('horloge', divDate);
  var dateDiv = createAndInsertDiv('ladate', divDate);

  // Widget B: System Metrics Widget (New Feature!)
  var divMetrics = createAndInsertDiv('divMetrics', headerInfos);
  divMetrics.innerHTML = `
    <div class="metric-row">
      <span class="metric-label">CPU LOAD</span>
      <div class="metric-track"><div class="metric-bar" id="cpu-bar" style="width: 32%"></div></div>
      <span class="metric-value" id="cpu-val">32%</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">RAM USED</span>
      <div class="metric-track"><div class="metric-bar" id="ram-bar" style="width: 58%"></div></div>
      <span class="metric-value" id="ram-val">58%</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">WAN LATENCY</span>
      <div class="metric-track"><div class="metric-bar" id="net-bar" style="width: 14%"></div></div>
      <span class="metric-value" id="net-val">14ms</span>
    </div>
  `;

  // Dynamic Weather Widget Alignment
  setTimeout(function() {
    const existingMeteo = document.querySelector('.meteo');
    if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
      // Move meteo between clock and metrics
      headerInfos.insertBefore(existingMeteo, divMetrics);
    }
  }, 100);

  // --- 3. Dynamic Clock & Time-of-Day Greeting ---
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

  // --- 4. Animated System Metrics Logic ---
  function fluctuateMetrics() {
    const cpuBar = document.getElementById('cpu-bar');
    const cpuVal = document.getElementById('cpu-val');
    const ramBar = document.getElementById('ram-bar');
    const ramVal = document.getElementById('ram-val');
    const netBar = document.getElementById('net-bar');
    const netVal = document.getElementById('net-val');

    if (!cpuBar || !ramBar || !netBar) return;

    // Generate natural fluctuations
    const cpu = Math.floor(Math.random() * (48 - 18) + 18);
    const ram = Math.floor(Math.random() * (64 - 55) + 55);
    const net = Math.floor(Math.random() * (35 - 12) + 12);

    cpuBar.style.width = cpu + '%';
    cpuVal.textContent = cpu + '%';

    ramBar.style.width = ram + '%';
    ramVal.textContent = ram + '%';

    // Latency scales from 0 to 100ms representing width (capped)
    netBar.style.width = Math.min((net * 2.5), 100) + '%';
    netVal.textContent = net + 'ms';
  }

  setInterval(fluctuateMetrics, 3000);

  // --- 5. Interactive Theme Selector ---
  const themes = [
    { id: 'theme-cyber-premium', name: '🌌 Cyber-Premium' },
    { id: 'theme-cyber-organic', name: '🌿 Cyber-Organic' },
    { id: 'theme-slate-minimalist', name: '📐 Slate Minimalist' }
  ];

  // Retrieve saved theme or default to Cyber-Premium
  let currentTheme = localStorage.getItem('heimdall-current-theme') || 'theme-cyber-premium';
  document.body.classList.add(currentTheme);

  var selectorPill = document.createElement('div');
  selectorPill.classList.add('theme-selector-pill');

  themes.forEach(t => {
    var btn = document.createElement('button');
    btn.classList.add('theme-btn');
    if (t.id === currentTheme) btn.classList.add('active');
    btn.textContent = t.name.split(' ')[1]; // Short label (Premium, Organic, Slate)
    btn.title = t.name;

    btn.addEventListener('click', () => {
      // Deactivate current active button
      selectorPill.querySelector('.theme-btn.active').classList.remove('active');
      btn.classList.add('active');

      // Swap body classes
      document.body.classList.remove(...themes.map(x => x.id));
      document.body.classList.add(t.id);

      // Save preference
      localStorage.setItem('heimdall-current-theme', t.id);
      currentTheme = t.id;
    });

    selectorPill.appendChild(btn);
  });

  document.body.appendChild(selectorPill);

  // --- 6. Real-Time Client-Side Quick Search & Card Filter ---
  const searchInput = document.querySelector('#search input') || document.querySelector('input[type="search"]');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('#sortable .item');

      cards.forEach(card => {
        // Retrieve title/name from card
        const cardTitleEl = card.querySelector('a') || card.querySelector('.title') || card;
        const titleText = cardTitleEl.textContent.toLowerCase();

        if (query === '') {
          // Reset cards to default state
          card.classList.remove('item-dimmed');
          card.classList.remove('search-highlight');
        } else if (titleText.includes(query)) {
          // Highlight match
          card.classList.remove('item-dimmed');
          card.classList.add('search-highlight');
        } else {
          // Dim out non-match
          card.classList.add('item-dimmed');
          card.classList.remove('search-highlight');
        }
      });
    });

    // Reset when search input is cleared
    searchInput.addEventListener('search', function() {
      const cards = document.querySelectorAll('#sortable .item');
      cards.forEach(card => {
        card.classList.remove('item-dimmed');
        card.classList.remove('search-highlight');
      });
    });
  }

  console.log("Heimdall Master Engine fully active. Enjoy your upgraded workspace!");
})();
