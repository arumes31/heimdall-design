// Theme 3: Slate Minimalist JS Injected Script
// Dynamically formats date-time with elegant ultra-lightweight typography and metrics gauges

(function() {
  const sortableElement = document.querySelector('.appheader');
  if (!sortableElement) return;

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

  // Clear existing
  if (document.querySelector('.headerInfos')) {
    document.querySelector('.headerInfos').remove();
  }

  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  insertAfter(sortableElement, headerInfos);

  var divDate = createAndInsertDiv('divDate', headerInfos);
  var timeDiv = createAndInsertDiv('horloge', divDate);
  var dateDiv = createAndInsertDiv('ladate', divDate);

  // Widget B: System Metrics Widget
  var divMetrics = createAndInsertDiv('divMetrics', headerInfos);
  divMetrics.innerHTML = `
    <div class="metric-row">
      <span class="metric-label">CPU LOAD</span>
      <div class="metric-track"><div class="metric-bar" id="cpu-bar" style="width: 28%"></div></div>
      <span class="metric-value" id="cpu-val">28%</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">RAM USED</span>
      <div class="metric-track"><div class="metric-bar" id="ram-bar" style="width: 58%"></div></div>
      <span class="metric-value" id="ram-val">58%</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">WAN SPEED</span>
      <div class="metric-track"><div class="metric-bar" id="net-bar" style="width: 14%"></div></div>
      <span class="metric-value" id="net-val">14ms</span>
    </div>
  `;

  // Weather alignment
  setTimeout(function() {
    const existingMeteo = document.querySelector('.meteo');
    if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
      headerInfos.insertBefore(existingMeteo, divMetrics);
    }
  }, 100);

  function afficherDateHeure() {
    const maintenant = new Date();
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
    const optionsDate = { year: 'numeric', month: 'short', day: '2-digit' };

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

  afficherDateHeure();
  setInterval(afficherDateHeure, 1000);

  // Fluctuating Metrics
  function fluctuateMetrics() {
    const cpuBar = document.getElementById('cpu-bar');
    const cpuVal = document.getElementById('cpu-val');
    const ramBar = document.getElementById('ram-bar');
    const ramVal = document.getElementById('ram-val');
    const netBar = document.getElementById('net-bar');
    const netVal = document.getElementById('net-val');

    if (!cpuBar || !ramBar || !netBar) return;

    const cpu = Math.floor(Math.random() * (45 - 20) + 20);
    const ram = Math.floor(Math.random() * (65 - 55) + 55);
    const net = Math.floor(Math.random() * (35 - 12) + 12);

    cpuBar.style.width = cpu + '%';
    cpuVal.textContent = cpu + '%';
    ramBar.style.width = ram + '%';
    ramVal.textContent = ram + '%';
    netBar.style.width = Math.min((net * 2.5), 100) + '%';
    netVal.textContent = net + 'ms';
  }
  setInterval(fluctuateMetrics, 3000);

  // Client-Side Search Quick Filter
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
})();
