// Einfache Implementierung der Sensemap
document.addEventListener('DOMContentLoaded', function() {
    // Beispiel-Daten für Standorte
    const locations = [
        { id: 1, name: "Hauptbahnhof", lat: 51.4816, lng: 7.2162, description: "Zentraler Verkehrsknotenpunkt" },
        { id: 2, name: "Ruhr-Universität", lat: 51.4472, lng: 7.2638, description: "Größte Universität der Region" },
        { id: 3, name: "Bermudadreieck", lat: 51.4795, lng: 7.2128, description: "Beliebtes Ausgehviertel" }
    ];

    // Kartencontainer auswählen
    const mapContainer = document.getElementById('map-container');
    const locationDetails = document.getElementById('location-details');

    // Statische Karte erstellen (ohne echte Karten-API)
    const mapImage = document.createElement('div');
    mapImage.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background-color: #eee;">
            <div style="position: absolute; width: 100%; height: 100%; background-image: url('https://maps.googleapis.com/maps/api/staticmap?center=Bochum&zoom=13&size=800x500&scale=2'); background-size: cover;">
                ${locations.map(loc => `
                    <div style="position: absolute; 
                                left: ${((loc.lng - 7.18) * 1000).toFixed(0)}px; 
                                top: ${((51.49 - loc.lat) * 1000).toFixed(0)}px;
                                width: 20px; height: 20px; background-color: red; border-radius: 50%; cursor: pointer;"
                         title="${loc.name}"
                         onclick="showLocationDetails(${loc.id})">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    mapContainer.innerHTML = '';
    mapContainer.appendChild(mapImage);

    // Globale Funktion für Standortdetails
    window.showLocationDetails = function(locationId) {
        const location = locations.find(loc => loc.id === locationId);
        if (location) {
            locationDetails.innerHTML = `
                <h2>${location.name}</h2>
                <p>${location.description}</p>
                <p>Koordinaten: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            `;
            locationDetails.classList.remove('hidden');
        }
    };
});