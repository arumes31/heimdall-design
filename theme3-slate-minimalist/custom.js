// Theme 3: Slate Minimalist JS Injected Script
// Dynamically formats date-time with elegant ultra-lightweight typography

(function() {
  const sortableElement = document.querySelector('.appheader');

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

  if (sortableElement) {
    // Ensure header element doesn't exist already to avoid duplicate widgets
    if (document.querySelector('.headerInfos')) {
      document.querySelector('.headerInfos').remove();
    }

    var headerInfos = document.createElement('div');
    headerInfos.classList.add('headerInfos');
    insertAfter(sortableElement, headerInfos);

    var divDate = createAndInsertDiv('divDate', headerInfos);
    var timeDiv = createAndInsertDiv('horloge', divDate);
    var dateDiv = createAndInsertDiv('ladate', divDate);

    // Weather widget alignment
    setTimeout(function() {
      const existingMeteo = document.querySelector('.meteo');
      if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
        headerInfos.appendChild(existingMeteo);
      }
    }, 100);

    function afficherDateHeure() {
      const maintenant = new Date();
      
      // Clean editorial options
      const optionsJour = { weekday: 'long' }; // e.g. "Sunday"
      const optionsDate = { year: 'numeric', month: 'short', day: '2-digit' }; // e.g. "May 31 2026"
      
      const jourFormatted = maintenant.toLocaleDateString(undefined, optionsJour);
      const dateFormatted = maintenant.toLocaleDateString(undefined, optionsDate);
      
      // Clean hour & minute representation
      const hrs = String(maintenant.getHours()).padStart(2, '0');
      const mins = String(maintenant.getMinutes()).padStart(2, '0');
      const heureFormatted = `${hrs}:${mins}`;

      dateDiv.innerHTML = '';

      var spanJourSemaine = document.createElement('span');
      spanJourSemaine.textContent = jourFormatted;
      dateDiv.appendChild(spanJourSemaine);

      timeDiv.textContent = heureFormatted;
      
      dateDiv.appendChild(document.createTextNode(' ' + dateFormatted));
    }

    afficherDateHeure();
    setInterval(afficherDateHeure, 1000);

    console.log("Slate Minimalist Dashboard loaded successfully.");
  }
})();
