// Theme 1: Cyber-Premium JS Injected Script
// Dynamically formats date-time console style and controls animated features

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

  // Avoid duplication
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

    const optionsJour = { weekday: 'short' };
    const optionsDate = { year: 'numeric', month: 'short', day: '2-digit' };

    let jourFormatted = maintenant.toLocaleDateString(undefined, optionsJour).toUpperCase();
    let dateFormatted = maintenant.toLocaleDateString(undefined, optionsDate).toUpperCase();

    let hrs = String(maintenant.getHours()).padStart(2, '0');
    let mins = String(maintenant.getMinutes()).padStart(2, '0');
    let secs = String(maintenant.getSeconds()).padStart(2, '0');
    let heureFormatted = `${hrs}:${mins}:${secs}`;

    dateDiv.innerHTML = '';

    var spanJourSemaine = document.createElement('span');
    spanJourSemaine.textContent = `${greeting} // ${jourFormatted}`;
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
