// Theme 2: Cyber-Organic JS Injected Script
// Dynamically formats date-time with friendly geometric styling and live pulses

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

    // Weather widget integration
    setTimeout(function() {
      const existingMeteo = document.querySelector('.meteo');
      if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
        headerInfos.appendChild(existingMeteo);
      }
    }, 100);

    function afficherDateHeure() {
      const maintenant = new Date();
      
      // Geometric elegant options
      const optionsJour = { weekday: 'long' }; // e.g. "Sunday"
      const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' }; // e.g. "May 31, 2026"
      
      const jourFormatted = maintenant.toLocaleDateString(undefined, optionsJour);
      const dateFormatted = maintenant.toLocaleDateString(undefined, optionsDate);
      
      // Clean hour & minute presentation
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

    console.log("Cyber-Organic System Dashboard online. Pulse sync active.");
  }
})();
