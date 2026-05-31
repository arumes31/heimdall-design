// Theme 2: Cyber-Organic JS Injected Script
// Dynamically formats date-time with friendly geometric styling

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

  // Clear existing to avoid duplicate widgets
  if (document.querySelector('.headerInfos')) {
    document.querySelector('.headerInfos').remove();
  }

  var headerInfos = document.createElement('div');
  headerInfos.classList.add('headerInfos');
  insertAfter(sortableElement, headerInfos);

  var divDate = createAndInsertDiv('divDate', headerInfos);
  var timeDiv = createAndInsertDiv('horloge', divDate);
  var dateDiv = createAndInsertDiv('ladate', divDate);

  // Weather alignment
  setTimeout(function() {
    const existingMeteo = document.querySelector('.meteo');
    if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
      headerInfos.appendChild(existingMeteo);
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

  afficherDateHeure();
  setInterval(afficherDateHeure, 1000);

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
