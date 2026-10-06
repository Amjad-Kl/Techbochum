// Navigation zwischen Seiten (Single Page App Prinzip)
function showPage(pageId) {
  var pages = document.querySelectorAll('.page');
  pages.forEach(function(p) { p.classList.remove('active'); });
  var s = document.getElementById(pageId);
  if (s) {
    s.classList.add('active');
    window.location.hash = '#' + pageId;
  } else {
    document.getElementById('notfound').classList.add('active');
    window.location.hash = '#notfound';
  }
}

// Hash-basierte Navigation bei Seitenaufruf/Reload:
window.addEventListener('DOMContentLoaded', function() {
  var hash = window.location.hash.replace('#','');
  if(hash && document.getElementById(hash)) {
    showPage(hash);
  } else {
    showPage('home');
  }
});
window.addEventListener('hashchange', function() {
  var hash = window.location.hash.replace('#','');
  if(hash && document.getElementById(hash)) {
    showPage(hash);
  } else {
    showPage('notfound');
  }
});

// Einfache Bewertungsfunktion mit LocalStorage
function submitBewertung() {
  var ort = document.getElementById('ortName').value.trim();
  var wert = document.getElementById('bewertungWert').value;
  var kommentar = document.getElementById('kommentar').value.trim();
  if(!ort) return false;
  var bewertungen = JSON.parse(localStorage.getItem('bewertungen') || '[]');
  bewertungen.push({ort: ort, wert: wert, kommentar: kommentar});
  localStorage.setItem('bewertungen', JSON.stringify(bewertungen));
  document.getElementById('bewertungsForm').reset();
  showBewertungen();
  alert('Danke für deine Bewertung!');
  return false;
}
function showBewertungen() {
  var liste = document.getElementById('bewertungsListe');
  var bewertungen = JSON.parse(localStorage.getItem('bewertungen') || '[]');
  if(bewertungen.length === 0) {
    liste.innerHTML = "<em>Keine Bewertungen vorhanden.</em>";
    return;
  }
  liste.innerHTML = "<strong>Vorherige Bewertungen:</strong><ul>" + 
    bewertungen.map(function(b){
      return "<li><b>"+b.ort+"</b> – Note: "+b.wert+(b.kommentar?" („"+b.kommentar+"“)":"")+"</li>";
    }).join('')+"</ul>";
}
window.showBewertungen = showBewertungen;
window.submitBewertung = submitBewertung;

// Bewertungen auch beim Anzeigen der Seite laden
document.addEventListener('DOMContentLoaded', function(){
  showBewertungen();
});