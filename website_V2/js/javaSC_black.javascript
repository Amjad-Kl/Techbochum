// Karte initialisieren
var map = L.map('map').setView([51.4823, 7.2167], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo(map);

// Marker für Hindernisse und barrierefreie Orte
var hindernisse = L.layerGroup().addTo(map);
var barrierefreieOrte = L.layerGroup().addTo(map);

// Beispiel-Marker
var marker1 = L.marker([51.4823, 7.2167]).addTo(hindernisse);
var marker2 = L.marker([51.4833, 7.2177]).addTo(barrierefreieOrte);

// Marker-Styling
hindernisse.eachLayer(function(layer) {
  layer.setIcon(L.icon({
    iconUrl: 'images/hindernis-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28]
  }));
});

barrierefreieOrte.eachLayer(function(layer) {
  layer.setIcon(L.icon({
    iconUrl: 'images/barrierefreier-ort-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28]
  }));
});
