// js/script.js

document.addEventListener("DOMContentLoaded", function () {
  // Karte einrichten
  const map = L.map('map').setView([51.4833, 7.2167], 13); // Bochum Zentrum

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  // Marker zur Markierung des Standorts
  let marker;

  map.on('click', (event) => {
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(event.latlng).addTo(map);
  });

  // Upload-Button
  const uploadBox = document.querySelector('.upload-box');
  const photoUpload = document.getElementById('photo-upload');

  uploadBox.addEventListener('click', () => {
    photoUpload.click();
  });
});