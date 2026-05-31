// =========================================================================
// 🎨 HEIMDALL UNIVERSAL MASTER ENGINE (custom.js)
// =========================================================================
// Features 10 togglable premium designs, dynamic greeting readouts, real-time 
// instant search, and a floating selector dial hidden behind a micro-interactive toggle.

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

  // --- 2. Injected Structure Setup ---
  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  insertAfter(sortableElement, headerInfos);

  // Date & Clock Widget Shell
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

  // --- 4. Interactive Floating Toggle-Hidden Theme Switcher ---
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

  // Retrieve saved theme or default to Cyber-Premium
  let currentTheme = localStorage.getItem('heimdall-current-theme') || 'theme-cyber-premium';
  document.body.classList.add(currentTheme);

  // A. Create Trigger Button (FAB)
  var triggerBtn = document.createElement('button');
  triggerBtn.classList.add('theme-trigger-btn');
  triggerBtn.title = "Customize Dashboard Theme";
  triggerBtn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3a9 9 0 0 0-9 9c0 1.25.5 2.39 1.32 3.22.4.4.4 1.04 0 1.44a1.01 1.01 0 0 1-1.44 0A10.93 10.93 0 0 1 1 12 11 11 0 0 1 12 1a11 11 0 0 1 11 11c0 1.46-.3 2.87-.87 4.14-.38.86-.73 1.76-1.03 2.68-.2.62-.77 1.05-1.43 1.05h-3.66a2.02 2.02 0 0 1-2.02-2.02v-1.63c0-.62-.25-1.22-.69-1.66l-1.66-1.66a2.38 2.38 0 0 1-.69-1.66V9.02A2.02 2.02 0 0 1 13.06 7H17c1.1 0 2-.9 2-2a2 2 0 0 0-2-2h-5zM6.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm2.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  `;

  // B. Create Selection Panel
  var selectionPanel = document.createElement('div');
  selectionPanel.classList.add('theme-selection-panel');

  var panelTitle = document.createElement('div');
  panelTitle.classList.add('panel-title');
  panelTitle.textContent = "Dashboard Style";
  selectionPanel.appendChild(panelTitle);

  themes.forEach(t => {
    var optBtn = document.createElement('button');
    optBtn.classList.add('theme-option-btn');
    if (t.id === currentTheme) optBtn.classList.add('active');
    optBtn.innerHTML = `<span>${t.name}</span>`;

    optBtn.addEventListener('click', () => {
      // Toggle active visual class on buttons
      selectionPanel.querySelector('.theme-option-btn.active').classList.remove('active');
      optBtn.classList.add('active');

      // Swap body classes
      document.body.classList.remove(...themes.map(x => x.id));
      document.body.classList.add(t.id);

      // Save preference
      localStorage.setItem('heimdall-current-theme', t.id);
      currentTheme = t.id;
    });

    selectionPanel.appendChild(optBtn);
  });

  // Toggle Panel Open/Close Click Handler
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectionPanel.classList.toggle('open');
  });

  // Close Panel when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!selectionPanel.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
      selectionPanel.classList.remove('open');
    }
  });

  document.body.appendChild(triggerBtn);
  document.body.appendChild(selectionPanel);

  // --- 5. Real-Time Client-Side Quick Search & Card Filter ---
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

  console.log("Heimdall Master Engine fully active. 10 Premium Themes loaded.");
})();
