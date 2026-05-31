// Theme 1: Cyber-Premium JS Injected Script
// Dynamically formats date-time in high-fidelity console readout style

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
    // Ensure header element doesn't exist already to avoid duplicate widgets on hot-reload
    if (document.querySelector('.headerInfos')) {
      document.querySelector('.headerInfos').remove();
    }

    var headerInfos = document.createElement('div');
    headerInfos.classList.add('headerInfos');
    insertAfter(sortableElement, headerInfos);

    var divDate = createAndInsertDiv('divDate', headerInfos);
    var timeDiv = createAndInsertDiv('horloge', divDate);
    var dateDiv = createAndInsertDiv('ladate', divDate);

    // Weather widget shell styling integration
    // If there is an existing .meteo element in the DOM (e.g. injected by other sources), 
    // move it inside .headerInfos next to .divDate for a premium aligned layout.
    setTimeout(function() {
      const existingMeteo = document.querySelector('.meteo');
      if (existingMeteo && existingMeteo.parentNode !== headerInfos) {
        headerInfos.appendChild(existingMeteo);
      }
    }, 100);

    function afficherDateHeure() {
      const maintenant = new Date();
      
      // Formatting options
      const optionsJour = { weekday: 'short' }; // e.g. "SUN"
      const optionsDate = { year: 'numeric', month: 'short', day: '2-digit' }; // e.g. "MAY 31 2026"
      
      let jourFormatted = maintenant.toLocaleDateString(undefined, optionsJour).toUpperCase();
      let dateFormatted = maintenant.toLocaleDateString(undefined, optionsDate).toUpperCase();
      
      // Zero-padded hours/minutes/seconds for precision technical readout
      let hrs = String(maintenant.getHours()).padStart(2, '0');
      let mins = String(maintenant.getMinutes()).padStart(2, '0');
      let secs = String(maintenant.getSeconds()).padStart(2, '0');
      
      let heureFormatted = `${hrs}:${mins}:${secs}`;

      dateDiv.innerHTML = '';

      // High tech bracket headers: [SYS_TIME // SUN]
      var spanJourSemaine = document.createElement('span');
      spanJourSemaine.textContent = `// ${jourFormatted}`;
      dateDiv.appendChild(spanJourSemaine);

      timeDiv.textContent = heureFormatted;
      
      // Append formatted calendar string
      dateDiv.appendChild(document.createTextNode(' ' + dateFormatted));
    }

    afficherDateHeure();
    setInterval(afficherDateHeure, 1000);

    // Subtle micro-interactive hover sounds or matrix-like digital effects can go here
    console.log("Cyber-Premium Dashboard Core Active: Port 1090 Secure.");
  }
})();
