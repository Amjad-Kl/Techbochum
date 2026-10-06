// js/script.js

document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map').setView([51.4833, 7.2167], 13); // Bochum Zentrum

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  // Beispiel: Barrierefreier Ort (grün)
  L.marker([51.4833, 7.2167])
    .addTo(map)
    .bindPopup("Jahrhunderthalle – barrierefrei")
    .openPopup();

  // Beispiel: Hindernis (rot)
  L.marker([51.4815, 7.2194], {
    icon: L.divIcon({ className: 'marker red', html: '⚠️' })
  }).addTo(map).bindPopup("Stufen entdeckt");

  // Einfaches Styling für Marker
  const style = document.createElement('style');
  style.textContent = `
    .marker { width: 24px; height: 24px; text-align: center; font-size: 18px; }
    .marker.red { color: red; }
  `;
  document.head.appendChild(style);
});